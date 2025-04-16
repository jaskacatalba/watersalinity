// file: models/wellModel.js

const db = require("../config/db");

const wellModel = {
  // Create new sensor data record
  createWellData: (data, callback) => {
    const {
      user_id,
      first_name,
      last_name,
      contact_no,
      municipality_id,
      barangay_id,
      purok_id,
      ph_level,
      salinity_level,
      date_added,
    } = data;

    const sql = `
      INSERT INTO sensor_data (
        user_id,
        first_name,
        last_name,
        contact_no,
        municipality_id,
        barangay_id,
        purok_id,
        ph_level,
        salinity_level,
        date_added
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        user_id,
        first_name,
        last_name,
        contact_no,
        municipality_id,
        barangay_id,
        purok_id,
        ph_level,
        salinity_level,
        date_added,
      ],
      callback
    );
  },

  // Retrieve all sensor data
  getAllWells: (callback) => {
    const sql = "SELECT * FROM sensor_data";
    db.query(sql, callback);
  },

  // Retrieve sensor data for a specific user
  getWellsByUserId: (userId, callback) => {
    const sql = "SELECT * FROM sensor_data WHERE user_id = ?";
    db.query(sql, [userId], callback);
  },

  // Retrieve one sensor data record by ID
  getWellById: (id, callback) => {
    const sql = "SELECT * FROM sensor_data WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // Update sensor data (ph_level and salinity_level)
  updateWellData: (id, data, callback) => {
    const { ph_level, salinity_level } = data;
    const sql = `
      UPDATE sensor_data
      SET ph_level = ?, salinity_level = ?
      WHERE id = ?
    `;
    db.query(sql, [ph_level, salinity_level, id], callback);
  },

  // Delete sensor data
  deleteWellData: (id, callback) => {
    const sql = "DELETE FROM sensor_data WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

module.exports = wellModel;
