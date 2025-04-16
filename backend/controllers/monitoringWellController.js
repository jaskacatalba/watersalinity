const MonitoringWell = require("../models/monitoringWellModel");

// ✅ Create Monitoring Record
exports.createMonitoringRecord = (req, res) => {
  MonitoringWell.createMonitoring(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Monitoring record added successfully!", monitoring_id: result.insertId });
  });
};

// ✅ Get All Monitoring Records
exports.getAllMonitoringRecords = (req, res) => {
  MonitoringWell.getAllMonitoringRecords((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Get Monitoring Record by ID
exports.getMonitoringRecordById = (req, res) => {
  console.log("Fetching monitoring record for ID:", req.params.id); // Debugging log
  MonitoringWell.getMonitoringById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Monitoring record not found" });
    }
    res.json(result[0]);
  });
};

// ✅ Update Monitoring Record
exports.updateMonitoringRecord = (req, res) => {
  MonitoringWell.updateMonitoring(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Monitoring record not found" });
    }
    res.json({ message: "Monitoring record updated successfully" });
  });
};

// ✅ Delete Monitoring Record
exports.deleteMonitoringRecord = (req, res) => {
  MonitoringWell.deleteMonitoring(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Monitoring record not found" });
    }
    res.json({ message: "Monitoring record deleted successfully" });
  });
};
