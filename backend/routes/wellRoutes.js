// file: routes/wellRoutes.js

const express = require("express");
const router = express.Router();
const wellController = require("../controllers/wellController");

// Create new well data
router.post("/", wellController.createWell);

// Get all wells
router.get("/", wellController.getAllWells);

// Get wells for a specific user
router.get("/user/:userId", wellController.getWellsByUser);

// Get well by ID
router.get("/:id", wellController.getWellById);

// Update well data
router.put("/:id", wellController.updateWell);

// Delete well data
router.delete("/:id", wellController.deleteWell);

module.exports = router;
