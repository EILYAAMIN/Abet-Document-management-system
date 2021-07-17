const Session = require('../../models/Session');
const Group = require(`../../models/Group`);
const Evaluation = require(`../../models/Evaluation`);
const Meeting = require(`../../models/Meeting`);
const Topic = require(`../../models/Topic`);
const User = require('../../models/User');
const word = require('../../form/wordGenerator');
const path = require('path');
var _ = require('lodash');
const config = require("config");
const nodemailer = require("nodemailer");
const nodemailerKey = config.get("nodemailerKey");
const sendGridTransport = require('nodemailer-sendgrid-transport');
const rubrics = require('../../form/rubrics');
const criteria = require('../../form/wordGeneratorCriteria');
const excelAfterSession = require('../../form/excelAfterSessionGenerator');
var fs = require('fs');
var stream = require('stream');

module.exports = class event {

    static async getMySessionPUB(req, res) {
        try {

            const Sessions = await Session.find({
                $or: [
                    { 'coordinator._id': { $eq: req.user.id } },
                    { 'chair._id': { $eq: req.user.id } },
                    { 'external._id': { $eq: req.user.id } },
                    { 'members._id': { $eq: req.user.id } },
                    { 'groups.members._id': { $eq: req.user.id } },
                ]
            });

            return res.json(Sessions);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async getSessionJRY(req, res) {
        try {
            const session = await Session.findById(req.params.id);

            if (!session)
                return res.status(404).json({ msg: "Session not found" });

            return res.json(session);
        }
        catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async getSessiongroupsJRY(req, res) {
        const session = await Session.findOne({
            $and: [
                { _id: req.params.sessionId },
                {
                    $or: [
                        { coordinator: req.user.id },
                        { chair: req.user.id },
                        { external: req.user.id },
                        { members: { $eq: req.user.id } }
                    ]
                }
            ]
        });
        if (!session)
            return res.status(404).json("Session not found");

        try {
            let groups = [];

            for (let gp = 0; gp < session.groups.length; gp++) {
                let group = await Group.findById(session.groups[gp]);
                for (let member = 0; member < group.members.length; member++) {
                    const student = await User.findById(group.members[member]);
                    if (student)
                        group.members[member] = student;
                }
                groups.push(group);
            }

            return res.json(groups);

        } catch (err) {
            console.error(ree.message);
            res.status(500).json("Server Error");
        }
    }

    static async setMeetingADVS(req, res) {
        const { group, message, date, location, time, subject } = req.body;

        const gp = req.user.groups.find(grp => grp.toString() === group.toString());

        const grp = await Group.findById(gp);

        if (!gp || !grp) {
            return res.status(401).json("Group not found");
        }
        const meeting = new Meeting({
            instructor: req.user.id,
            group,
            message,
            date,
            location,
            time
        });
        try {
            grp.members.push(grp.leader);
            grp.members.push(grp.advisor.id);

            const transport = nodemailer.createTransport(sendGridTransport({
                auth: {
                    api_key: nodemailerKey
                }
            })
            );

            for (key in grp.members) {
                const user = await User.findOne({ _id: grp.members[key].id });
                transport.sendMail({
                    to: grp.members[key].email,
                    from: `${req.user.email}`,
                    subject: `${subject}`,
                    text: `${message}`
                        + `${date.split(charAt(10)[0])}`
                        + `${location}` + `${time}`
                });
                user.events.meeting.unshift(meeting);
                await user.save();
            }
            await meeting.save();

            return res.json(meeting);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async editMeetingADVS(req, res) {

        const { message, date, location, time } = req.body;

        const meeting = await Meeting.findOne({
            $and: [
                { _id: { $eq: req.params.id } },
                { instructor: { $eq: req.user.id } }
            ]
        });

        if (!meeting) {
            return res.status(401).json("meeting not found");
        }
        meeting.message = message;
        meeting.date = date;
        meeting.location = location;
        meeting.time = time;

        try {
            await meeting.save();

            return res.json(meeting);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async deleteMeetingADVS(req, res) {
        const meeting = await Meeting.findOne({
            $and: [
                { _id: { $eq: req.params.id } },
                { instructor: { $eq: req.user.id } }
            ]
        });

        if (!meeting) {
            return res.status(401).json("meeting not found");
        }

        const grp = await Group.findById(meeting.group);

        if (!grp) {
            return res.status(401).json("group not found");
        }

        try {

            grp.members.push(grp.leader);
            grp.members.push(grp.advisor.id);

            for (key in grp.members) {
                const user = await User.findOne({ _id: grp.members[key].id });
                const removeIndex = user.events.meeting.find(evt => evt.toString() === meeting.id.toString());
                user.events.meeting.splice(removeIndex, 1);
                await user.save();
            }
            await meeting.delete();

            return res.json(meeting);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async setSession(req, res) {
        const { chair, external, members, groups, message, date, location } = req.body;

        if (!chair || !external || !members || !groups || !message || !date || !location)
            return res.status(406).json({ errors: [{ msg: "Missong Fields" }] });

        try {
            const Coordinator = await User.findById(req.user.id);
            const Chair = await User.findById(chair);
            const External = await User.findById(external);

            let mmbrs = [];
            for (let i = 0; i < members.length; i++) {
                const user = await User.findById(members[i]);
                mmbrs.push(user);
            }
            let gps = [];
            for (let i = 0; i < groups.length; i++) {
                const group = await Group.findById(groups[i]);
                gps.push(group);
            }
            if (gps.length === null)
                return res.status(406).json({ errors: [{ msg: "Group not Fouond!" }] });

            const session = new Session({
                coordinator: Coordinator,
                chair: Chair,
                external: External,
                members: mmbrs,
                groups: gps,
                message: message,
                date: date,
                location: location,
                filePath: null
            });



            let invite = [Coordinator.email, Chair.email, External.email];
            for (let x = 0; x < gps.length; x++) {
                invite.push(gps[x].advisor.email, gps[x].leader.email);
                for (let i = 0; i < gps[x].members.length; i++) {
                    invite.push(gps[x].members[i].email);
                }
            }
            for (let x = 0; x < mmbrs.length; x++) {
                invite.push(mmbrs[x].email);
            }
            const transport = nodemailer.createTransport(sendGridTransport({
                auth: {
                    api_key: nodemailerKey
                }
            })
            );
            for (let usr = 0; usr < invite.length; usr++) {
                const user = invite[usr];
                transport.sendMail({
                    to: `${user}`,
                    from: `Graduation-Projects@emu.edu.tr`,
                    subject: `Alert for Graduation Project Session`,
                    text: `MESSAGE: ${message}\n`
                        + `DATE & TIME: ${date}\n`
                        + `LOCATION: ${location}\n`
                });
            }
            await session.save();
            return res.json(session);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async editSession(req, res) {
        const { chair, external, members, groups, message, date, location } = req.body;

        try {
            let gps = [];
            if (groups) {
                for (let i = 0; i < groups.length; i++) {
                    const group = await Group.findById(groups[i]);
                    gps.push(group);
                }
            }
            const session = {};
            if (chair) session.chair = chair;
            if (external) session.external = external;
            if (members) session.members = members;
            if (gps.length !== 0 || !gps.includes(null)) session.groups = gps;
            if (message) session.message = message;
            if (date) session.date = date;
            if (location) session.location = location;

            await Session.findOneAndUpdate({ _id: req.params.id }, { $addToSet: session }, { new: true });

            return res.json(session);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async deleteSession(req, res) {
        const session = await Session.findOne({ $and: [{ _id: req.params.id }, { 'coordinator._id': req.user.id }] });

        if (!session) {
            return res.status(404).json("Session not Found");
        }

        try {
            if (session.filePath !== null)
                await fs.unlink(session.filePath, function (err) {
                    if (err) throw err;
                });

            await session.delete();

            return res.json(session._id);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async evaluateJRY(req, res) {

        const check = await Evaluation.findOne({
            $and: [
                { "evaluator._id": req.user._id },
                { "student._id": { $eq: req.params.studentId } }
            ]
        });

        if (check)
            return res.status(401).json({ errors: [{ msg: 'Advisor has already evaluated this student' }] })

        const group = await Group.findOne({
            $and: [
                { _id: req.params.groupId },
                {
                    $or: [
                        { "leader._id": req.params.studentId },
                        { "members._id": { $eq: req.params.studentId } }
                    ]
                }
            ]
        });

        if (!group)
            return res.status(401).json({ msg: 'Group Not Found!' });

        const session = await Session.findOne({
            $and: [
                { _id: req.params.sessionId },
                { "groups._id": { $eq: group._id } },
                {
                    $or: [
                        { "coordinator._id": req.user._id },
                        { "chair._id": req.user._id },
                        { "external._id": req.user._id },
                        { "members._id": req.user._id }
                    ]
                }
            ]
        });

        if (!session)
            return res.status(401).json({ msg: 'Session Not Found!' });

        const topic = await Topic.findById(group.topic);

        if (!topic)
            return res.status(401).json({ msg: 'topic Not Found!' });

        const student = await User.findById(req.params.studentId);

        if (!student)
            return res.status(401).json({ msg: 'student Not Found!' });

        let members = [];
        for (let i = 0; i < group.members.length; i++) {
            const member = await User.findById(group.members[i]._id);
            const nameSurname = `${member.name} ${member.surname}`
            members.push(nameSurname);
        }
        const date = new Date();

        const information = [
            `${student.name} ${student.surname}`,
            student.idNum,
            members.toString(),
            `${student.course}`,
            `${group.semester} ${group.year}`,
            `${topic.name}`,
            `${date.toLocaleDateString('en-GB')}`,
            `${req.user.name} ${req.user.surname}`
        ];

        const { code,
            ReportTableGrades,
            CoopGrades,
            QualityGrades,
            PresentGrades,
            originality } = req.body;

        try {
            const filePath = `/${student.name}${student.surname}-${req.user.name}${req.user.surname}-${student.idNum}.docx`;
            const fields = await word(
                filePath,
                code,
                information,
                ReportTableGrades,
                CoopGrades,
                QualityGrades,
                PresentGrades,
                originality).catch(err => { return { errors: [{ msg: err.message }] } });


            const G = _.clone(fields.ReportTotal) + _.clone(fields.CoopTotal) + _.clone(fields.QualityTotal) + _.clone(fields.PresentationTotal);
            const T = _.clone(G) / 4;
            const O = _.clone(originality) / 100;
            const finalGrade = parseFloat((_.clone(T) * O).toFixed(2));
            const summary = [
                _.clone(fields.ReportTotal), _.clone(fields.CoopTotal), _.clone(fields.QualityTotal), _.clone(fields.PresentationTotal),
                G, T, originality, finalGrade
            ];
            ReportTableGrades.push(_.clone(fields.ReportTotal));
            CoopGrades.push(_.clone(fields.CoopTotal));
            QualityGrades.push(_.clone(fields.QualityTotal));
            PresentGrades.push(_.clone(fields.PresentationTotal));

            const evaluation = new Evaluation({
                evaluator: req.user,
                session: session,
                student: student,
                coursetag: `${student.course}${topic.type}`,
                idNum: student.idNum,
                filePath: filePath,
                report: ReportTableGrades,
                cooperation: CoopGrades,
                quality: QualityGrades,
                present: PresentGrades,
                summary: summary
            });

            await evaluation.save().catch(err => { return { errors: [{ msg: err.message }] } });

            return res.json(evaluation);

        } catch (err) {
            console.error(err.message);
            res.status(500).json("Server Error");
        }
    }

    static async getRubrics(req, res) {

        const topic = await Topic.findById(req.params.topic);

        const course = `${req.params.course}${topic.type}`;

        try {
            switch (course) {
                case "CMSE406SW":
                    return res.json(rubrics.CMSE406SW);
                case "CMPE406SW":
                    return res.json(rubrics.CMPE406SW);
                case "CMPE406HW":
                    return res.json(rubrics.CMPE406HW);
                case "BLGM406SW":
                    return res.json(rubrics.BLGM406SW);
                case "BLGM406HW":
                    return res.json(rubrics.BLGM406HW);
                default:
                    return res.json(rubrics.CMSE406SW);
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async getCriteria(req, res) {
        const topic = await Topic.findById(req.params.topic);

        const course = `${req.params.course}${topic.type}`;

        try {
            switch (course) {
                case "CMSE406SW":
                    return res.json(criteria.criteria.CMSE406SW);
                case "CMPE406SW":
                    return res.json(criteria.criteria.CMPE406SW);
                case "CMPE406HW":
                    return res.json(criteria.criteria.CMPE406HW);
                case "BLGM406SW":
                    return res.json(criteria.criteria.BLGM406SW);
                case "BLGM406HW":
                    return res.json(criteria.criteria.BLGM406HW);
                default:
                    return res.json(criteria.criteria.CMSE406SW);
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async getStudentJRY(req, res) {
        try {
            const student = await User.findById(req.body.id);

            return res.json(student);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async getStudentGroupJRY(req, res) {
        try {
            const group = await Group.findOne({
                $or: [
                    { 'leader._id': { $eq: req.body.id } },
                    { 'members._id': { $eq: req.body.id } }
                ]
            });

            return res.json(group);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async downloadEvaluation(req, res) {
        try {
            const file = await Evaluation.findOne({
                $and:
                    [
                        { "evaluator._id": { $eq: req.user._id } },
                        { "student._id": { $eq: req.params.id } }
                    ]
            });

            if (!file) {
                return res.status(404).json("Evaluation not Found");
            }

            const folderpath = await path.join(process.cwd(), 'files/Evaluations', file.filePath);

            return res.download(folderpath);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }


    static async isEvaluated(req, res) {
        try {

            let evaluatedList = await Evaluation.find({ "evaluator._id": { $eq: req.user._id } });

            evaluatedList = evaluatedList.map(evaluation => {
                return evaluation.student._id;
            });

            return res.status(200).json(evaluatedList);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async genAfterSession(req, res) {
        const session = await Session.findOne({
            $and: [
                {
                    $or: [
                        { "chair._id": req.user.id },
                        { "coordinator._id": req.user.id }
                    ]
                },
                {
                    _id: req.body.session
                }
            ]
        });
        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }
        try {
            const evaluations = await Evaluation.find({ "session._id": { $eq: req.body.session } });

            let evaluators = evaluations.map(evls => {
                return evls.evaluator;
            });

            let copy = evaluators.map(evt => evt._id.toString());

            copy = [...new Set(copy)];

            let evals = [];

            for (let x = 0; x < copy.length; x++) {
                for (let i = 0; i < evaluators.length; i++) {
                    if (evaluators[i]._id.toString() === copy[x].toString()) {
                        evals[x] = evaluators[i];
                        break;
                    }
                }
            }

            let students = evaluations.map(evls => {
                return evls.student;
            });

            copy = students.map(evt => evt._id.toString());

            copy = [...new Set(copy)];

            let stds = [];

            for (let x = 0; x < copy.length; x++) {
                for (let i = 0; i < students.length; i++) {
                    if (students[i]._id.toString() === copy[x].toString()) {
                        stds[x] = students[i];
                        break;
                    }
                }
            }

            let formData = [];

            for (let x = 0; x < stds.length; x++) {
                let row = [];
                for (let i = 0; i < evals.length; i++) {
                    const data = await Evaluation.findOne({
                        $and: [
                            { "session._id": { $eq: req.body.session } },
                            { "evaluator._id": { $eq: evals[i]._id } },
                            { "student._id": { $eq: stds[x]._id } }
                        ]
                    });
                    if (!data)
                        row[i] = "";
                    else
                        row[i] = data.summary.pop();
                }
                formData[x] = row;
            }

            for (let x = 0; x < formData.length; x++) {
                formData[x].unshift(`${stds[x].name} ${stds[x].surname}`);
                formData[x].unshift(`${stds[x].idNum}`);
            }

            evals = evals.map(evaluator => {
                return (`${evaluator.name} ${evaluator.surname}`);
            });

            formData = formData.map(row => {
                let average = 0;
                let length = 0;
                for (let x = 0; x < row.length; x++) {
                    if (x <= 1 || typeof row[x] !== 'number')
                        continue;

                    average += row[x];
                    length++;
                }
                average = average / length;
                return ([...row, average]);
            });

            const chair = (`${session.chair.name} ${session.chair.surname}`);

            const fileName = session.chair.name + session.chair.surname + (`${session.date}`).split("G")[0].replace(/\s/g, '');

            await excelAfterSession(formData, evals, chair, fileName);

            const filePath = `/${fileName}.xlsx`;

            session.filePath = filePath;

            await session.save();

            return res.json(session._id);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async downloadSessionOutcome(req, res) {
        try {
            const file = await Session.findOne({
                $and:
                    [
                        { _id: { $eq: req.params.session } },
                        {
                            $or:
                                [
                                    { "chair._id": { $eq: req.user._id } },
                                    { "coordinator._id": { $eq: req.user._id } }
                                ]
                        }
                    ]
            });

            if (!file) {
                return res.status(404).json("Evaluation not Found");
            }

            const folderpath = await path.join(process.cwd(), 'files/afterSessionFiles', file.filePath);

            return res.download(folderpath);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async deleteSessionOutcome(req, res) {
        try {
            const session = await Session.findOne({
                $and:
                    [
                        { _id: { $eq: req.params.session } },
                        {
                            $or:
                                [
                                    { "chair._id": { $eq: req.user._id } },
                                    { "coordinator._id": { $eq: req.user._id } }
                                ]
                        }
                    ]
            });

            if (!session) {
                return res.status(404).json("Evaluation not Found");
            }
            else if (session.filePath === null) {
                return res.status(200).json("Already deleted");
            }

            const filePath = path.join(process.cwd(), 'files/afterSessionFiles', session.filePath);

            fs.unlink(filePath, function (err) {
                if (err) throw err;
            });

            session.filePath = null;

            await session.save();

            return res.json(session._id);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async isOutcomeGenerated(req, res) {
        try {

            let session = await Session.find({
                $or: [
                    { "chair._id": { $eq: req.user.id } },
                    { "coordinator._id": { $eq: req.user.id } }
                ]
            });

            session = session.map(session => {
                if (session.filePath !== null)
                    return session._id;
            });

            session = [...new Set(session)];

            return res.json(session);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async deleteEvaluation(req, res) {
        try {
            const evaluation = await Evaluation.findOne({
                $and: [
                    { "evaluator._id": { $eq: req.user.id } },
                    { "student._id": { $eq: req.body.student } }
                ]
            });

            if (!evaluation)
                return res.status(404).json({ msg: "Evaluation not found" });

            const filePath = path.join(process.cwd(), 'files/Evaluations', evaluation.filePath);

            fs.unlink(filePath, function (err) {
                if (err) throw err;
            });

            await evaluation.delete();

            return res.json(evaluation.student._id);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
}
