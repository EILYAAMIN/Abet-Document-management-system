const express = require("express");
const router = express.Router();
const Report = require("../Controles/report");


router.post("/:id", Report.submitReport);

router.get("/download/:id", Report.downloadMyReport);

router.delete("/delete/:id", Report.deleteMyReport);



module.exports =  router;