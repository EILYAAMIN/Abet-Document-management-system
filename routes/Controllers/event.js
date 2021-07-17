const express = require("express");
const router = express.Router();
const Event = require("../Controles/event");
const private = require("../../middleware/blockstd");

router.get("/sessions", Event.getMySessionPUB);

router.get("/session/:id", private, Event.getSessionJRY);

router.get("/groups/:sessionId", private, Event.getSessiongroupsJRY);

router.post("/setMeeting", private, Event.setMeetingADVS);

router.put("/editMeeting/:id", private, Event.editMeetingADVS);

router.delete("/deleteMeeting/:id", private, Event.deleteMeetingADVS);

router.post("/setSession", private, Event.setSession);

router.put("/editSession/:id", private, Event.editSession);

router.delete("/deleteSession/:id", private, Event.deleteSession);

router.post("/rubrics/:course/:topic", private, Event.getRubrics);

router.post("/criteria/:course/:topic", private, Event.getCriteria);

router.post("/:sessionId/:groupId/:studentId", private, Event.evaluateJRY);

router.post("/getstudentgroup", private, Event.getStudentGroupJRY);

router.post("/getstudent", private, Event.getStudentJRY);

router.post("/downloadEvaluation/:id", private, Event.downloadEvaluation);

router.post("/isEvaluated", private, Event.isEvaluated);

router.post("/genAfterSession", private, Event.genAfterSession);

router.post("/downloadSessionOutcome/:session", private, Event.downloadSessionOutcome);

router.post("/deleteSessionOutcome/:session", private, Event.deleteSessionOutcome);

router.post("/isOutcomeGenerated", private, Event.isOutcomeGenerated);

router.post("/deleteEvaluation", private, Event.deleteEvaluation);

module.exports = router;