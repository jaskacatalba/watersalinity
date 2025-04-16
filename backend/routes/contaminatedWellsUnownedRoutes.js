const express = require("express");
const router = express.Router();
const contaminatedWellsUnownedController = require("../controllers/contaminatedWellsUnownedController");

router.get("/", contaminatedWellsUnownedController.getAllWells);
// NEW: Filter by barangay
router.get("/barangay/:barangayId", contaminatedWellsUnownedController.getWellsByBarangay);
router.get("/:id", contaminatedWellsUnownedController.getWellById);
router.post("/create", contaminatedWellsUnownedController.createWell);
router.put("/:id", contaminatedWellsUnownedController.updateWell);
router.delete("/:id", contaminatedWellsUnownedController.deleteWell);

module.exports = router;
