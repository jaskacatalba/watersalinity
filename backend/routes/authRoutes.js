const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/users/login", authController.loginUser);
router.post("/users/create", authController.createUser);
router.get("/users", authController.getAllUsers);
router.get("/users/:id", authController.getUserById);
router.put("/users/:id", authController.updateUser);
router.delete("/users/:id", authController.deleteUser);

module.exports = router;
