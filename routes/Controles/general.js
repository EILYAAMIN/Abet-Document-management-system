const Topic = require("../../models/Topic");
const User = require("../../models/User");
const Group = require("../../models/Group");


module.exports = class general {

    static async deleteUser(req, res) {
        try {
            const user = await User.findById(req.body.id);

            if (!user) {
                return res.status(401).json({ msg: "User not found" });
            }

            await user.delete();

            return res.json(user._id);
        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).json("Server Error");
        }
    }

    static async searchStudents(req, res) {
        try {
            const users = await User.find({
                $and: [
                    {
                        role: "student"
                    },
                    {
                        $or: [
                            { 'name': { $regex: req.params.search.charAt(0).toUpperCase() + req.params.search.slice(1).toLowerCase() } },
                            { 'surname': { $regex: req.params.search.charAt(0).toUpperCase() + req.params.search.slice(1).toLowerCase() } },
                            { 'idNum': { $regex: req.params.search } },
                        ]
                    }
                ]
            }).limit(10).select(['_id', 'name', 'surname', 'email', 'idNum', 'role']);

            return res.json(users);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).send("Server Error");
        }
    }

    static async searchUser(req, res) {
        try {
            const users = await User.find({
                $or: [
                    { 'name': { $regex: req.params.search.charAt(0).toUpperCase() + req.params.search.slice(1).toLowerCase() } },
                    { 'surname': { $regex: req.params.search.charAt(0).toUpperCase() + req.params.search.slice(1).toLowerCase() } },
                    { 'idNum': { $regex: req.params.search } },
                    { 'role': { $regex: req.params.search } }
                ]
            }).limit(10).select(['_id', 'name', 'surname', 'email', 'idNum', 'role']);

            return res.json(users);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).send("Server Error");
        }
    }


    static async searchGroups(req, res) {
        try {
            const groups = await Group.find({
                $and: [
                    { "advisor.approved": true },
                    {
                        $or: [
                            { 'number': { $regex: req.params.search } },
                            { 'topic.name': { $regex: req.params.search } },
                            { 'advisor.name': { $regex: req.params.search } },
                            { 'leader.name': { $regex: req.params.search } },
                            { 'advisor.surname': { $regex: req.params.search } },
                        ]
                    }
                ]

            }).limit(10);

            return res.json(groups);

        } catch (err) {
            console.error({ msg: err.message });
            res.status(500).send("Server Error");
        }
    }
}
