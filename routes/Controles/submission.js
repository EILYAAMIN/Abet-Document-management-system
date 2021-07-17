const Topic = require("../../models/Topic");
const Submission = require("../../models/Submission");

module.exports = class submission {

    static async setSubmission(req, res) {
        const { year, month, day, hours, minutes, name, topic } = req.body;

        try {
            const tpc = await Topic.findOne({ _id: topic, approved: true });

            if (!tpc) {
                return res.status(401).json("Topic not Found!");
            }
            const submission = new Submission({
                name: name,
                deadline: new Date(year, month, day, hours, minutes),
                topic: tpc._id
            });

            const exist = await Submission.findOne({ name: name, topic: tpc._id });

            if (exist)
                return res.status(401).json("Submission already set");

            await submission.save();

            return res.json(submission);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async getSubmittedReports(req, res) {
        try {
            const submission = await Submission.findById(req.params.id);

            const reports = submission.reports.filter(report => {
                return report.date <= submission.deadline;
            });

            return res.json(reports);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }
    
    static async getLateSubmittedReports(req, res) {
        try {
            const submission = await Submission.findById(req.params.id);

            const reports = submission.reports.filter(report => {
                return report.date > submission.deadline;
            });

            return res.json(reports);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }
}