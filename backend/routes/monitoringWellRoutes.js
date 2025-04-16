const express = require("express");
const router = express.Router();
const monitoringWellController = require("../controllers/monitoringWellController");

// Define API routes
router.post("/create", monitoringWellController.createMonitoringRecord);
router.get("/", monitoringWellController.getAllMonitoringRecords);
router.get("/:id", monitoringWellController.getMonitoringRecordById);
router.put("/:id", monitoringWellController.updateMonitoringRecord);
router.delete("/:id", monitoringWellController.deleteMonitoringRecord);

module.exports = router;
