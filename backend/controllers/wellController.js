// file: controllers/wellController.js

const wellModel = require("../models/wellModel");
const userModel = require("../models/userModel");
const sendGmailNotification = require("../utils/gmailNotification");

// ───────────────────────────────────────────────
// 🔹 Create new sensor data (well data)
// ───────────────────────────────────────────────
exports.createWell = (req, res) => {
  const { user_id, ph_level, salinity_level } = req.body;

  userModel.getUserProfile(user_id, (err, userResults) => {
    if (err) {
      console.error("❌ Error fetching user:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!userResults.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResults[0];
    const sensorData = {
      user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      contact_no: user.u_Uphone,
      municipality_id: user.municipality_id,
      barangay_id: user.barangay_id,
      purok_id: user.purok_id,
      ph_level: parseFloat(ph_level) || 0,
      salinity_level: parseFloat(salinity_level) || 0,
      date_added: new Date().toISOString().split("T")[0],
    };

    wellModel.createWellData(sensorData, (err, result) => {
      if (err) {
        console.error("❌ Error creating sensor data:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const email = user.gmail;
      console.log("📧 Sending notification to:", email);

      sendGmailNotification(email, sensorData.salinity_level, sensorData.ph_level);

      return res.status(201).json({
        message: "Sensor data created successfully",
        id: result.insertId,
      });
    });
  });
};

// ───────────────────────────────────────────────
// 🔹 Get all sensor data
// ───────────────────────────────────────────────
exports.getAllWells = (req, res) => {
  wellModel.getAllWells((err, results) => {
    if (err) {
      console.error("❌ Error retrieving wells:", err);
      return res.status(500).json({ error: "Database error" });
    }

    return res.status(200).json(results);
  });
};

// ───────────────────────────────────────────────
// 🔹 Get sensor data for a specific user
// ───────────────────────────────────────────────
exports.getWellsByUser = (req, res) => {
  const { userId } = req.params;

  wellModel.getWellsByUserId(userId, (err, results) => {
    if (err) {
      console.error("❌ Error fetching wells for user:", err);
      return res.status(500).json({ error: "Database error" });
    }

    return res.status(200).json(results);
  });
};

// ───────────────────────────────────────────────
// 🔹 Get sensor data by ID
// ───────────────────────────────────────────────
exports.getWellById = (req, res) => {
  const { id } = req.params;

  wellModel.getWellById(id, (err, results) => {
    if (err) {
      console.error("❌ Error retrieving well by ID:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!results.length) {
      return res.status(404).json({ error: "Well not found" });
    }

    return res.status(200).json(results[0]);
  });
};

// ───────────────────────────────────────────────
// 🔹 Update sensor data (ph_level and salinity_level)
// ───────────────────────────────────────────────
exports.updateWell = (req, res) => {
  const { id } = req.params;
  const { ph_level, salinity_level, user_id } = req.body;

  wellModel.updateWellData(id, { ph_level, salinity_level }, (err, result) => {
    if (err) {
      console.error("❌ Error updating sensor data:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sensor data not found or no changes made" });
    }

    // Send notification after update
    userModel.getUserProfile(user_id, (err, userResults) => {
      if (err || !userResults.length) {
        console.error("❌ Error fetching user email for notification:", err);
        return res.status(200).json({ message: "Sensor data updated, but notification not sent" });
      }

      const email = userResults[0].gmail;
      console.log("📧 Sending update notification to:", email);

      sendGmailNotification(email, salinity_level, ph_level);

      return res.status(200).json({ message: "Sensor data updated successfully" });
    });
  });
};

// ───────────────────────────────────────────────
// 🔹 Delete sensor data
// ───────────────────────────────────────────────
exports.deleteWell = (req, res) => {
  const { id } = req.params;

  wellModel.deleteWellData(id, (err, result) => {
    if (err) {
      console.error("❌ Error deleting sensor data:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sensor data not found" });
    }

    return res.status(200).json({ message: "Sensor data deleted successfully" });
  });
};
