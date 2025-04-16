const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Your database connection

// Get all municipalities with their barangays
router.get("/municipalities", (req, res) => {
  const sql = `
    SELECT m.id AS municipality_id, m.name AS municipality_name, 
           b.id AS barangay_id, b.name AS barangay_name
    FROM municipalities m
    LEFT JOIN barangays b ON m.id = b.municipality_id
    ORDER BY m.id, b.id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    // Transform the result into a structured format
    const municipalitiesMap = {};

    results.forEach((row) => {
      if (!municipalitiesMap[row.municipality_id]) {
        municipalitiesMap[row.municipality_id] = {
          id: row.municipality_id,
          name: row.municipality_name,
          barangays: [],
        };
      }
      if (row.barangay_id) {
        municipalitiesMap[row.municipality_id].barangays.push(row.barangay_name);
      }
    });

    res.json(Object.values(municipalitiesMap)); // Convert object to array
  });
});

module.exports = router;
