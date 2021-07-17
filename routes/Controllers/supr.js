const express = require("express");
const router = express.Router();
const superAccess = require("../Controles/supr");
const private = require("../../middleware/blockstd");


router.get("/", private, superAccess.getNullRoleUsers);

router.post("/roleSet/:id", private, superAccess.setRoleForUser);

router.post("/addStudent", private, superAccess.addStudentToGroup);

router.post("/removeMember", private, superAccess.removeStudentFromGroup);

router.post("/generate", private, superAccess.generateCourseOutcomeExcelFile);

router.get("/download", private, superAccess.downloadSystemFiles);


module.exports = router;