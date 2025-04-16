const db = require("../config/db");

// 🔹 Create Monitoring Record
const createMonitoring = (monitoringData, callback) => {
  const { sensor_id, ph_level, salinity_level, monitored_by } = monitoringData;
  const query = `
    INSERT INTO monitoring_well (sensor_id, ph_level, salinity_level, monitoring_date, monitored_by) 
    VALUES (?, ?, ?, NOW(), ?)
  `;
  db.query(query, [sensor_id, ph_level, salinity_level, monitored_by], callback);
};

// 🔹 Get All Monitoring Records
const getAllMonitoringRecords = (callback) => {
  const query = "SELECT * FROM monitoring_well";
  db.query(query, callback);
};

// 🔹 Get Monitoring Record by ID
const getMonitoringById = (id, callback) => {
  const query = "SELECT * FROM monitoring_well WHERE monitoring_id = ?";
  db.query(query, [id], callback);
};

// 🔹 Update Monitoring Record
const updateMonitoring = (id, updatedData, callback) => {
  const query = "UPDATE monitoring_well SET ? WHERE monitoring_id = ?";
  db.query(query, [updatedData, id], callback);
};

// 🔹 Delete Monitoring Record
const deleteMonitoring = (id, callback) => {
  const query = "DELETE FROM monitoring_well WHERE monitoring_id = ?";
  db.query(query, [id], callback);
};

// ✅ Export functions properly
module.exports = {
  createMonitoring,
  getAllMonitoringRecords,
  getMonitoringById,
  updateMonitoring,
  deleteMonitoring,
};
