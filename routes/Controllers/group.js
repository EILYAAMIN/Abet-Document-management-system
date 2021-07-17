const express = require("express");
const router = express.Router();
const Group = require("../Controles/group");
const private = require("../../middleware/blockstd");


router.get("/mygroups", private, Group.getMyGroups);

router.get("/unapproved-groups", private, Group.getUnapprovedGroupsADVS);

router.put("/approve/:id", private, Group.approveGroupADVS);

router.delete("/remove/:id", private, Group.removeMyApprovedGroupADVS);

router.post("/create", Group.createGroupSTD);

router.put("/edit", Group.editMyGroupSTD);

router.delete("/delete", Group.deleteMyGroupSTD);

router.get("/groupRequests", Group.getGroupsRequestsSTD);

router.get("/createdGroup", Group.getCreatedGroupSTD);

router.put("/mygroups/approve/:id", Group.approveRequestedGroupSTD);

router.put("/mygroups/decline/:id", Group.cancelMyGroupSTD);


module.exports = router;
