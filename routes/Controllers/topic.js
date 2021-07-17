const express = require("express");
const router = express.Router();
const Topic = require("../Controles/topic");
const private = require("../../middleware/blockstd");


router.get("/getTopics", Topic.getTopicsPUB);

router.get("/:search", Topic.searchTopicsPUB);

router.post("/gettopics/unapproved", private, Topic.getUnapprovedTopicsCHR);

router.post("/approved", private, Topic.getApprovedTopicsCHR);

router.put("/approve", private, Topic.approveTopicCHR);

router.put("/disapprove/:id", private, Topic.disApproveTopicCHR);

router.post("/createTopic", private, Topic.createTopicADVS);

router.get("/getTopics/myTopics", private, Topic.getMyTopics);

router.put("/editTopic/:id", private, Topic.editMyTopicADVS);

router.post("/deleteTopic", private, Topic.deleteMyTopicADVS);

module.exports =  router;
