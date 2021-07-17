const Group = require("../../models/Group");
const Submission = require("../../models/Submission");
var fs = require('fs');

module.exports = class report {

    // static async getTopics(req, res) {
    //     try {

    //     } catch (err) {
    //         console.error(err.message);
    //         res.status(500).send('Server Error');
    //     }
    // }

    static async submitReport(req, res) {
        try {
            const group = await Group.findOne({ leader: req.user.id });
            const submission = await Submission.findOne({
                $and: [
                    { _id: req.params.id },
                    { topic: group.topic }
                ]
            });

            submission.reports.forEach(element => {
                if (element._id.toString() === group._id.toString()) {
                    res.status(401).json("Report was already submitted!");
                    throw new Error('Already Submitted');
                }
            });

            const fields = {
                path: req.file.path,
                id: group._id
            };

            submission.reports.unshift(fields);

            await submission.save();

            return res.json(fields);

        } catch (err) {
            console.error(err.message);
            fs.unlink(req.file.path, function (err) {
                if (err) throw err;
                console.log('File deleted!');
            });
            if (err.message !== 'Already Submitted')
                res.status(403).json('Server Error');
        }
    }


    static async downloadMyReport(req, res) {
        try {
            const group = await Group.findOne({
                $or:
                    [
                        { "leader._id": req.user.id },
                        { "members._id": { $eq: req.user.id } }
                    ]
            });

            const submission = await Submission.findOne({
                $and:
                    [
                        { _id: { $eq: req.params.id } },
                        { "reports._id": { $eq: group._id } }
                    ]
            });

            let path;
            for (let gp = 0; gp < submission.reports.length; gp++) {
                if (submission.reports[gp]._id.toString() === group._id.toString()) {
                    path = submission.reports[gp].path;
                    break;
                }
            }

            if (!path) {
                return res.status(404).json("Report not Found");
            }

            return res.download(path);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async deleteMyReport(req, res) {
        const group = await Group.findOne({ leader: req.user.id });

        if (!group)
            return res.status(404).json("Group Not Found!");

        const submission = await Submission.findOne({
            $and: [
                { _id: req.params.id },
                { "reports._id": { $eq: group._id } }
            ]
        });

        if (!submission)
            return res.status(404).json("Assignment Not Found!");

        try {
            const removeIndex = submission.reports.find(rpt => rpt._id.toString() === group._id.toString());
            if (!removeIndex)
                return res.status(404).json("Report not Found!");

            submission.reports.splice(removeIndex, 1);

            fs.unlinkSync(removeIndex.path, function (err) {
                if (err) throw err;

                console.log('File deleted!');
            });

            await submission.save();

            return res.json("Report Deleted");

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
    
    // router.get('myreport', async (req, res) => {
    // static async getTopics(req, res) {

    //     const group = await Group.findOne({
    //         $or: [
    //             { leader: req.user.id },
    //             // {members.id: }
    //         ]
    //     });
    // }
}
