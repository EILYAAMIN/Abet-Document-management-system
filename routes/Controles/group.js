const Topic = require("../../models/Topic");
const User = require("../../models/User");
const Group = require("../../models/Group");
const { toInteger } = require("lodash");

module.exports = class group {

    static async getMyGroups(req, res) {
        try {
            const groups = await Group.find({
                $or: [
                    { 'advisor._id': { $eq: req.user.id } },
                    { 'leader._id': { $eq: req.user.id } },
                    { 'member._id': { $eq: req.user.id } }
                ]
            });

            return res.json(groups);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async getUnapprovedGroupsADVS(req, res) {
        try {

            const topic = await Topic.find({ advisor: req.user.id, approved: true }).select('_id');

            if (topic.length === 0) {
                return res.status(404).json({ errors: [{ msg: "No Topic Found!" }] });
            }

            const groups = await Group.find({
                $and: [
                    { "topic._id": { $in: topic } },
                    { 'advisor.approved': { $eq: false } },
                    { 'members.approved': { $ne: false } }
                ]
            });

            return res.json(groups);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async approveGroupADVS(req, res) {

        const group = await Group.findOne({
            $and: [
                { _id: { $eq: req.params.id } },
                { 'advisor.approved': false },
                { "members.approved": { $ne: false } }
            ]
        });
        if (!group) {
            return res.status(404).json({ errors: [{ msg: "Group Topic Found!" }] });
        }

        const topic = await Topic.findOne({
            $and: [
                { _id: { $eq: group.topic._id } },
                { advisor: { $eq: req.user.id } }
            ]
        });

        if (!topic) {
            return res.status(404).json({ errors: [{ msg: "No Topic Found!" }] });
        }

        try {
            group.advisor = {
                _id: req.user.id,
                name: req.user.name,
                surname: req.user.surname,
                idNum: req.user.idNum,
                email: req.user.email,
                approved: true
            }

            await group.save();

            return res.json(group);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    }

    static async removeMyApprovedGroupADVS(req, res) {

        try {
            const advisor = {};
            advisor.advisor = {
                id: null,
                name: null,
                surname: null,
                idNum: null,
                email: null,
                approved: false
            };

            const mainGroup = await Group.findOneAndUpdate({ _id: req.params.id }, { $set: advisor }, { new: true });

            if (!mainGroup)
                return res.status(404).json({ errors: [{ msg: "Group Topic Found!" }] });

            return res.json(mainGroup);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async createGroupSTD(req, res) {
        const leaderHasGroup = await Group.findOne({ "leader._id": { $eq: req.user.id } });

        if (leaderHasGroup) {
            return res.status(403).json({ errors: [{ msg: "Please Decline your membership and try again" }] });
        }
        let gp = await Group.findOne({ "members._id": { $eq: req.user.id } });

        if (gp) {
            for (let member = 0; member < gp.members.length; member++)
                if (gp.members[member]._id.toString() === req.user._id.toString() && gp.members[member].approved === true)
                    return res.status(403).json({ errors: [{ msg: "Please Decline your membership and try again" }] });
        }


        try {
            const { topic, members } = req.body;

            const tpc = await Topic.findOne({ $and: [{ _id: topic }, { approved: true }] });
            if (!tpc) {
                return res.status(404).json({ errors: [{ msg: "Topic not found!" }] });
            }

            if (req.user.course.includes("CMSE") && tpc.type === "HW") {
                return res.status(403).json({ errors: [{ msg: "Students of software engineering can not choose hardware projects" }] });
            }

            let number;
            for (let i = 1; i; i++) {
                number = await Group.findOne({ number: i });
                if (number === null) {
                    number = i;
                    break;
                }
            }

            let groupmembers = [];
            const groupFields = {};
            if (members.length > 0) {
                for (let i = 0; i <= members.length; i++) {
                    const student = await User.findById(members[i]);
                    if (student && student._id.toString() !== req.user.id.toString()) {
                        if (student.course.includes("CMSE") && tpc.type === "HW")
                            return res.status(403).json({
                                errors: [{
                                    msg: `Software engineering student ${student.name} ${student.surname} 
                                can not have hardware project` }]
                            });
                        groupmembers[i] = {
                            id: student._id,
                            name: student.name,
                            surname: student.surname,
                            idNum: student.idNum,
                            email: student.email,
                            course: student.course
                        };
                    }
                }
            } else {
                groupFields.members = [];
            }
            groupFields.number = number;
            groupFields.leader = {
                _id: req.user._id,
                name: req.user.name,
                surname: req.user.surname,
                idNum: req.user.idNum,
                email: req.user.email,
                course: req.user.course
            };
            groupFields.topic = {
                _id: tpc.id,
                name: tpc.name,
                type: tpc.type
            };
            groupFields.members = groupmembers.map(member => {
                return {
                    _id: member.id,
                    name: member.name,
                    surname: member.surname,
                    idNum: member.idNum,
                    email: member.email,
                    course: member.course,
                    approved: false
                }
            });

            const group = new Group(
                groupFields
            );

            await group.save().catch(err => { return res.status(403).json({ errors: [{ msg: err.message }] }) });

            return res.json(group);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async editMyGroupSTD(req, res) {
        const leaderHasGroup = await Group.findOne({
            $and: [
                {
                    "advisor.approved": { $eq: true }
                },
                {
                    $or: [
                        { "leader._id": { $eq: req.user.id } },
                        { "member._id": { $eq: req.user.id } }
                    ]
                }
            ]
        });

        if (leaderHasGroup) {
            return res.status(403).json({ errors: [{ msg: "Group is approved by superviosr and can't be modified" }] });
        }
        try {
            const { topic, members } = req.body;

            const groupFields = {};

            const tpc = await Topic.findOne({ $and: [{ _id: topic }, { approved: true }] });

            if (!tpc)
                return res.status(404).json({ errors: [{ msg: "Topic not Found" }] });

            if (members.length > 0) {
                let groupmembers = [];
                for (let i = 0; i < members.length; i++) {
                    const student = await User.findById(members[i]);
                    if (student) {
                        if (student.course.includes("CMSE") && tpc.type === "HW")
                            return res.status(403).json({ errors: [{ msg: `Student of software engineering ${student.name} ${student.surname} can not choose hardware projects` }] });

                        groupmembers[i] = {
                            id: student._id,
                            name: student.name,
                            surname: student.surname,
                            idNum: student.idNum,
                            email: student.email,
                            course: student.course
                        };
                    }
                    else {

                        return res.status(404).json({ errors: [{ msg: `Student ${student} not found!` }] });
                    }
                }
                groupFields.members = groupmembers.map(member => {
                    return {
                        _id: member.id,
                        name: member.name,
                        surname: member.surname,
                        idNum: member.idNum,
                        email: member.email,
                        course: member.course,
                        approved: false
                    }
                });
            } else {
                groupFields.members = [];
            }

            const group = await Group.findOne({ "leader._id": req.user.id });
            group.topic = {
                _id: tpc._id,
                name: tpc.name,
                type: tpc.type
            };
            group.members = groupFields.members;
            await group.save();
            return res.json(group);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async deleteMyGroupSTD(req, res) {
        try {
            const group = await Group.findOne({ $and: [{ "leader._id": req.user.id }, { "advisor.approved": { $eq: false } }] });
            if (!group) {
                return res.status(404).json({ errors: [{ msg: "Group not Found!" }] });
            }
            await group.delete();

            return res.json(group);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async getGroupsRequestsSTD(req, res) {
        try {

            const groups = await Group.find({
                $and: [
                    { "members._id": { $eq: req.user._id } },
                    { "advisor.approved": { $eq: false } }
                ]
            });

            return res.json(groups);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async getCreatedGroupSTD(req, res) {
        try {

            const group = await Group.findOne({
                $or: [
                    { "leader._id": { $eq: req.user._id } },
                    { "member._id": { $eq: req.user._id } }
                ]
            });

            return res.json(group);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async approveRequestedGroupSTD(req, res) {
        const gp = await Group.find({
            $or:
                [
                    { "leader._id": { $eq: req.user.id } },
                    { 'members._id': { $eq: req.user.id } }
                ]
        });

        if (gp.length > 0) {
            for (let grp = 0; grp < gp.length; grp++) {
                if (gp[grp].leader._id.toString() === req.user.id.toString())
                    return res.status(403).json({ errors: [{ msg: "Please Decline Group and try again" }] });
                for (let mem = 0; mem < gp[grp].members.length; mem++) {
                    if (gp[grp].members[mem]._id.toString() === req.user.id.toString() && gp[grp].members[mem].approved === true)
                        return res.status(403).json({ errors: [{ msg: "Please Decline your membership and try again" }] });
                }
            }
        }

        const group = await Group.findOne({
            $and:
                [
                    { _id: req.params.id },
                    { 'members._id': { $eq: req.user.id } }
                ]
        });

        if (!group) {
            return res.status(404).json({ errors: [{ msg: "Group not Found!" }] });
        }
        try {
            group.members.map(member => {
                if (member._id.toString() === req.user.id.toString())
                    member.approved = true;
            });

            await group.save().catch(err => { return { errors: [{ msg: err.message }] } });
            return res.json(group);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async cancelMyGroupSTD(req, res) {

        const group = await Group.findOne({
            $and:
                [
                    { _id: req.params.id },
                    { 'members._id': { $eq: req.user.id } },
                    { "advisor.approved": { $eq: false } }
                ]
        });

        if (!group) {
            return res.status(401).json({ errors: [{ msg: "No Group Found!" }] });
        }

        try {
            group.members.map(member => {
                if (member._id.toString() === req.user.id.toString())
                    member.approved = false;
            });

            await group.save().catch(err => { return res.status(403).json(err.message) });

            return res.json(group);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
}
