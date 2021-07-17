const express = require("express");
const router = express.Router();
const General = require("../Controles/general");
const private = require("../../middleware/blockstd");

router.post("/delete", private, General.deleteUser);

router.get("/users/:search", General.searchStudents);

router.get("/user/:search", General.searchUser);

router.get("/groups/:search", General.searchGroups);


module.exports = router;