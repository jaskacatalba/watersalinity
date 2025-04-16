const ContaminatedWellUnowned = require("../models/contaminatedWellsUnownedModel");

exports.createWell = (req, res) => {
  console.log("🔹 Route Hit: /api/contaminated-wells-unowned/create");
  console.log("🔹 Request Body:", req.body);

  const requiredFields = [
    "municipality_id",
    "barangay_id",
    "purok_id",
    "location",
    "contamination_type",
    "ph_level",
    "salinity"
  ];
  let missingFields = requiredFields.filter(
    (field) => req.body[field] === undefined
  );
  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ message: `Missing required fields: ${missingFields.join(", ")}` });
  }

  ContaminatedWellUnowned.createWell(req.body, (err, result) => {
    if (err) {
      console.error("❌ Database Error (Create Well):", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("✅ Unowned Contaminated Well Entry Created");
    res
      .status(201)
      .json({ message: "Unowned contaminated well recorded successfully", wellId: result.insertId });
  });
};

exports.getAllWells = (req, res) => {
  ContaminatedWellUnowned.getAllWells((err, results) => {
    if (err) {
      console.error("❌ Database Error (Get All Wells):", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(results);
  });
};

exports.getWellsByBarangay = (req, res) => {
  const { barangayId } = req.params;
  ContaminatedWellUnowned.getByBarangay(barangayId, (err, results) => {
    if (err) {
      console.error("Error fetching unowned contaminated wells by barangay:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.getWellById = (req, res) => {
  const { id } = req.params;
  ContaminatedWellUnowned.getWellById(id, (err, results) => {
    if (err) {
      console.error("❌ Database Error (Get Well by ID):", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Well not found" });
    }
    res.status(200).json(results[0]);
  });
};

exports.updateWell = (req, res) => {
  const { id } = req.params;
  const updatedData = { ...req.body };

  console.log("🔹 Incoming Update Request for Well ID:", id);
  console.log("🔹 Updated Data:", updatedData);

  ContaminatedWellUnowned.updateWell(id, updatedData, (err, result) => {
    if (err) {
      console.error("❌ Database Error (Update Well):", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("✅ Update Successful, Database Response:", result);
    res.status(200).json({ message: "Unowned contaminated well updated successfully" });
  });
};

exports.deleteWell = (req, res) => {
  const { id } = req.params;
  ContaminatedWellUnowned.deleteWell(id, (err) => {
    if (err) {
      console.error("❌ Database Error (Delete Well):", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ message: "Unowned contaminated well deleted successfully" });
  });
};
