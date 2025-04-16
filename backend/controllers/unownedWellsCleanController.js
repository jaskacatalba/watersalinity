const UnownedWellsClean = require("../models/unownedWellsCleanModel");

exports.createUnownedWellClean = (req, res) => {
  UnownedWellsClean.createWell(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Clean unowned well added successfully!", well_id: result.insertId });
  });
};

exports.getAllUnownedWellsClean = (req, res) => {
  UnownedWellsClean.getAllWells((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// NEW: Get Unowned Wells (Clean) filtered by barangay
exports.getWellsByBarangay = (req, res) => {
  const { barangayId } = req.params;
  UnownedWellsClean.getByBarangay(barangayId, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getUnownedWellCleanById = (req, res) => {
  UnownedWellsClean.getWellById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: "Well not found" });
    res.json(result[0]);
  });
};

exports.updateUnownedWellClean = (req, res) => {
  UnownedWellsClean.updateWell(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Well not found" });
    res.json({ message: "Well updated successfully" });
  });
};

exports.deleteUnownedWellClean = (req, res) => {
  UnownedWellsClean.deleteWell(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Well not found" });
    res.json({ message: "Well deleted successfully" });
  });
};
