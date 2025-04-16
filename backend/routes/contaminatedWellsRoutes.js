const express = require("express");
const router = express.Router();
const contaminatedWellsController = require("../controllers/contaminatedWellsController");

// Existing endpoints
router.get("/", contaminatedWellsController.getAllWells);
// NEW: Filter by barangay
router.get("/barangay/:barangayId", contaminatedWellsController.getWellsByBarangay);
router.get("/:id", contaminatedWellsController.getWellById);
router.post("/create", contaminatedWellsController.createWell);
router.put("/:id", contaminatedWellsController.updateWell);
router.delete("/:id", contaminatedWellsController.deleteWell);

module.exports = router;
