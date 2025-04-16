const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all municipalities
router.get("/municipalities", (req, res) => {
  const sql = "SELECT id, name FROM municipalities";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching municipalities:", err);
      return res.status(500).json({ error: "Failed to fetch municipalities" });
    }
    res.json(results);
  });
});

// GET all barangays
router.get("/barangays", (req, res) => {
  const sql = "SELECT id, name, municipality_id FROM barangays";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching barangays:", err);
      return res.status(500).json({ error: "Failed to fetch barangays" });
    }
    res.json(results);
  });
});

// GET all purok (note singular table name: `purok`)
router.get("/purok", (req, res) => {
  const sql = "SELECT id, name, barangay_id FROM purok"; // <-- make sure your table is actually named `purok`
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching purok:", err);
      return res.status(500).json({ error: "Failed to fetch purok" });
    }
    res.json(results);
  });
});

module.exports = router;
