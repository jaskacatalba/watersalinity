const express = require("express");
const router = express.Router();
const unownedWellsCleanController = require("../controllers/unownedWellsCleanController");

// Existing endpoints
router.post("/create", unownedWellsCleanController.createUnownedWellClean);
router.get("/", unownedWellsCleanController.getAllUnownedWellsClean);
router.get("/:id", unownedWellsCleanController.getUnownedWellCleanById);
router.put("/:id", unownedWellsCleanController.updateUnownedWellClean);
router.delete("/:id", unownedWellsCleanController.deleteUnownedWellClean);

// NEW: Filter Unowned Wells (Clean) by barangay
router.get("/barangay/:barangayId", unownedWellsCleanController.getWellsByBarangay);

module.exports = router;
