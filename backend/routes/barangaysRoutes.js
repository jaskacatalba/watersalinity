const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Your DB connection

// Get barangays by municipality
router.get("/", (req, res) => {
  const municipalityId = req.query.municipality;

  if (!municipalityId) {
    return res.status(400).json({ message: "Municipality ID is required" });
  }

  const sql = `
    SELECT b.name AS barangay_name
    FROM barangays b
    WHERE b.municipality_id = ?
  `;

  db.query(sql, [municipalityId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No barangays found for this municipality" });
    }

    const barangays = results.map((row) => row.barangay_name);
    res.json(barangays);
  });
});

module.exports = router;
