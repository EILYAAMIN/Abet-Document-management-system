const User = require("../../models/User");
const Group = require("../../models/Group");
const Evaluation = require("../../models/Evaluation");
const Session = require("../../models/Session");
const path = require("path");
const excel = require("../../form/excelGenerator");
const child_process = require("child_process");
const fs = require("fs");

module.exports = class superAccess {

  static async getNullRoleUsers(req, res) {
    try {
      const users = await User.find({ role: { $eq: null } }).select(
        "-password"
      );

      return res.json(users);
    } catch (err) {
      console.error({ msg: err.message });
      res.status(500).json("Server Error");
    }
  }

  static async setRoleForUser(req, res) {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(401).json({ msg: "User not found" });

    const roles = ['admin', 'coordinator', 'instructor', 'external', 'student', 'assistant', 'chair', "null"];

    if (!roles.includes(req.body.role)) return res.status(401).json({ msg: "Role not found" });

    try {
      if (req.body.role === "null")
        user.role = null;
      else user.role = req.body.role;

      await user.save();

      return res.json(user);
    } catch (err) {
      console.error({ msg: err.message });
      res.status(500).json("Server Error");
    }
  }

  static async addStudentToGroup(req, res) {
    const student = await User.findOne({
      _id: req.body.student,
      role: "student",
      "groups.0": { $exists: false },
    });

    if (!student) return res.status(404).json({ msg: "student not found" });

    const group = await Group.findOne({
      _id: req.body.group,
      "members._id": { $ne: req.body.student },
    });

    if (!group) return res.status(404).json({ msg: "group not found" });

    try {
      const field = {
        _id: student.id,
        approved: true,
      };
      group.members.unshift(field);

      await group.save();

      return res.json(group);
    } catch (err) {
      console.error({ msg: err.message });
      res.status(500).json("Server Error");
    }
  }

  static async removeStudentFromGroup(req, res) {
    const group = await Group.findOne({
      _id: req.body.group,
      "members._id": req.body.student,
    });

    if (!group) return res.status(404).json({ msg: "group not found" });

    try {
      const field = {
        _id: req.body.student,
      };
      group.members.shift(field);

      await group.save();

      return res.json(group);
    } catch (err) {
      console.error({ msg: err.message });
      res.status(500).json("Server Error");
    }
  }

  static async generateCourseOutcomeExcelFile(req, res) {
    const tags = [`CMSE406SW`, `CMPE406HW`, `CMPE406SW`, `BLGM406SW`, `BLGM406HW`];

    if (!tags.includes(req.body.coursetag))
      return res.status(406).json({ errors: [{ msg: "Course name is wrong" }] });

    const evaluations = await Evaluation.find({
      coursetag: req.body.coursetag,
    });

    if (evaluations.length === 0) {
      return res.status(406).json({ errors: [{ msg: "No student yet has been evaluated in this course" }] });
    }

    try {
      let ids = [];
      for (let key = 0; key < evaluations.length; key++) {
        ids.push(evaluations[key].student.idNum);
      }

      let idNumbers = [...new Set(ids)];
      const data = [];
      for (let x = 0; x < idNumbers.length; x++) {
        const fields = await Evaluation.find({ "student.idNum": idNumbers[x] });

        let Evaluator = [];
        for (let inst = 0; inst < fields.length; inst++) {
          const evaluator = await User.findById(fields[inst].evaluator).select("-_id").select("name").select("surname");

          Evaluator.push({
            name: [`${evaluator.name.charAt(0)}.${evaluator.surname.charAt(0)}`],
            report: [...fields[inst].report],
            cooperation: [...fields[inst].cooperation],
            quality: [...fields[inst].quality],
            present: [...fields[inst].present],
            summary: [...fields[inst].summary],
          });
        }
        const student = await User.findOne({ idNum: idNumbers[x] }).select("-_id").select("name").select("surname");

        data.push(
          Object({
            id: idNumbers[x],
            name: `${student.name} ${student.surname}`,
            Evaluator,
          })
        );
      }

      if (data.length === 0)
        return res.status(406).json({ errors: [{ msg: "Outcome Generation Unsuccessful" }] });

      await excel(data, req.body.coursetag);

      return res.json("Done");
    } catch (err) {
      console.error({ msg: err.message });
      res.status(500).json("Server Error");
    }
  }

  static async downloadSystemFiles(req, res) {
    try {
      const filePath = path.join(process.cwd(), 'files/archive.zip');

      fs.unlink(filePath, function (err) {
        if (err) throw err;
      });

      const folderpath = path.join(process.cwd(), "files");
      child_process.execSync(`zip -r archive *`, {
        cwd: folderpath,
      });

      // zip archive of your folder is ready to download
      return res.download(folderpath + "/archive.zip");
    } catch (err) {
      console.error({ msg: err.message });
      res.status(500).json("Server Error");
    }
  }
};
