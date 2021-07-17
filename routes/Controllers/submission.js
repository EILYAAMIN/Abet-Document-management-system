const express = require("express");
const router = express.Router();
const Submission = require("../Controles/submission");


router.post("/submission", Submission.setSubmission);

router.get("/reports/:id", Submission.getSubmittedReports);

router.get("/latereports/:id", Submission.getLateSubmittedReports);


module.exports =  router;