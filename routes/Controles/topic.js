const Topic = require("../../models/Topic");


module.exports = class topic {

    static async searchTopicsPUB(req, res) {
        try {
            const topics = await Topic.find({
                $and: [
                    { approved: true },
                    {
                        $or: [
                            { name: { $regex: req.params.search } },
                            { type: { $regex: req.params.search } }
                        ]
                    }
                ]
            }).limit(10).select('-advisor');

            return res.json(topics);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async getTopicsPUB(req, res) {
        try {
            let topics = [];
            if (req.user.role === 'student') {
                if (req.user.course.includes('CMSE')) {
                    topics = await Topic.find({
                        $and: [
                            { approved: true },
                            { type: 'SW' }
                        ]
                    }).select('-advisor');
                }
                else {
                    topics = await Topic.find({ approved: true }).limit(10).select('-advisor');
                }
            }
            else {
                topics = await Topic.find({
                    $and: [
                        { approved: true },
                        {
                            $or: [
                                { name: { $regex: req.params.search } },
                                { type: { $regex: req.params.search } }
                            ]
                        }
                    ]
                }).limit(10).select('-advisor');
            }


            return res.json(topics);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async getUnapprovedTopicsCHR(req, res) {

        try {
            const topics = await Topic.find({ approved: false });

            return res.json(topics);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async getApprovedTopicsCHR(req, res) {
        try {
            const topics = await Topic.find({ approved: true });

            return res.json(topics);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async approveTopicCHR(req, res) {
        const topic = await Topic.findOne({ $and: [{ _id: req.body.id }, { approved: false }] });

        if (!topic) {
            return res.status(404).json("Topic not Found");
        }
        try {
            topic.approved = true;

            await topic.save();

            return res.json(topic);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async disApproveTopicCHR(req, res) {
        const topic = await Topic.findOne({ $and: [{ _id: req.params.id }, { approved: true }] });

        if (!topic) {
            return res.status(404).json("Topic not Found");
        }
        try {

            topic.approved = false;

            await topic.save();

            return res.json(topic);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async createTopicADVS(req, res) {
        const { name, type } = req.body;

        const advisor = req.user._id;

        const topic = new Topic({
            name, advisor, type
        });
        try {

            await topic.save().catch(err => { return res.status(403).json(err.message) });

            return res.json(topic);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    }

    static async getMyTopics(req, res) {
        try {
            const topics = await Topic.find({ advisor: req.user._id });

            return res.json(topics);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    static async editMyTopicADVS(req, res) {
        const { name, type } = req.body;

        const topic = await Topic.findOne({
            $and: [
                { _id: { $eq: req.params.id } },
                { advisor: { $eq: req.inst.id } },
                { approved: { $eq: false } }
            ]
        });

        if (!topic) {
            return res.status(401).json("Topic not Found");
        }

        try {
            topic.name = name;
            topic.type = type;

            await topic.save();

            return res.json(topic);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    }

    static async deleteMyTopicADVS(req, res) {
        try {
            
            const topic = await Topic.findOne({
                $and: [
                    { _id: { $eq: req.body.id } },
                    { advisor: { $eq: req.user.id } },
                    { approved: { $eq: false } }
                ]
            });

            if (!topic) {
                return res.status(401).json("Topic not Found");
            }

            await topic.delete();

            return res.json(topic._id);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    }
}
