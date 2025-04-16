// 🔐 Auth Controller
// File: controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const db = require("../config/db");
const { sendRegistrationEmail } = require("../utils/mailer");

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

// ───────────────────────────────────────────────
// 🔹 Login User
// ───────────────────────────────────────────────
exports.loginUser = async (req, res) => {
  try {
    const { u_UName, u_PName } = req.body;

    if (!u_UName || !u_PName) {
      console.warn("⚠️ Missing username or password");
      return res.status(400).json({ error: "Username and password are required" });
    }

    User.login(u_UName, async (err, results) => {
      if (err) {
        console.error("❌ Database Error (Login):", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!results || results.length === 0) {
        console.warn("⚠️ Invalid login attempt for:", u_UName);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(u_PName, user.u_PName);

      if (!isPasswordValid) {
        console.warn("⚠️ Incorrect password for:", u_UName);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const payload = {
        user_ID: user.u_ID,
        UserType: user.UserType,
        municipality_id: user.municipality_id || null,
        barangay_id: user.barangay_id || null,
      };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });

      if (user.UserType !== "Barangay Representative") {
        console.log("✅ Login success:", u_UName);
        return res.status(200).json({
          message: "Login successful",
          token,
          userId: user.u_ID,
          UserType: user.UserType,
          first_name: user.first_name,
        });
      }

      // Handle Barangay Representative extra data
      db.query(
        "SELECT name FROM Municipalities WHERE id = ?",
        [user.municipality_id],
        (err, munResults) => {
          if (err || !munResults.length) {
            console.error("❌ Municipality fetch error for:", u_UName);
            return res.status(500).json({ error: "Municipality not found" });
          }

          const municipalityName = munResults[0].name;

          db.query(
            "SELECT name FROM Barangays WHERE id = ?",
            [user.barangay_id],
            (err, barResults) => {
              if (err || !barResults.length) {
                console.error("❌ Barangay fetch error for:", u_UName);
                return res.status(500).json({ error: "Barangay not found" });
              }

              const barangayName = barResults[0].name;

              console.log("✅ Login success (Barangay Rep):", u_UName);
              return res.status(200).json({
                message: "Login successful",
                token,
                userId: user.u_ID,
                UserType: user.UserType,
                first_name: user.first_name,
                municipalityName,
                barangayName,
              });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error("❌ Unexpected Error (Login):", error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
};

// ───────────────────────────────────────────────
// 🔹 Create User
// ───────────────────────────────────────────────
exports.createUser = async (req, res) => {
  console.log("🔹 Create User Request Body:", req.body);

  const requiredFields = [
    "first_name",
    "last_name",
    "u_UName",
    "u_PName",
    "gmail",
    "u_Uphone",
    "municipality_id",
    "UserType",
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (req.body.UserType !== "Super Admin" && !req.body.barangay_id) {
    missingFields.push("barangay_id");
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const plainPassword = req.body.u_PName; // Store for sending in email
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const newUser = { ...req.body, u_PName: hashedPassword };

    if (req.body.UserType === "Super Admin") delete newUser.barangay_id;
    else if (newUser.barangay_id == null) delete newUser.barangay_id;

    const result = await User.createUser(newUser);
    console.log("✅ User Created - ID:", result.insertId);

    try {
      const emailInfo = await sendRegistrationEmail(
        req.body.gmail,
        req.body.first_name,
        req.body.u_UName,
        plainPassword
      );
      console.log("📧 Welcome Email Sent - Message ID:", emailInfo.messageId);
    } catch (emailErr) {
      console.error("❌ Email Send Failed:", emailErr.message);
    }

    return res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("❌ User Creation Error:", err.message);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};

// ───────────────────────────────────────────────
// 🔹 Get All Users
// ───────────────────────────────────────────────
exports.getAllUsers = (req, res) => {
  User.getAllUsers((err, results) => {
    if (err) {
      console.error("❌ Get All Users Error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json(results);
  });
};

// ───────────────────────────────────────────────
// 🔹 Get User By ID
// ───────────────────────────────────────────────
exports.getUserById = (req, res) => {
  const { id } = req.params;

  User.getUserById(id, (err, results) => {
    if (err) {
      console.error("❌ Get User By ID Error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!results.length) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(results[0]);
  });
};

// ───────────────────────────────────────────────
// 🔹 Update User
// ───────────────────────────────────────────────
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    if (updates.u_PName) {
      updates.u_PName = await bcrypt.hash(updates.u_PName, 10);
      console.log("🔐 Password updated and hashed");
    }

    if (updates.UserType === "Super Admin") delete updates.barangay_id;
    else if (updates.barangay_id == null) delete updates.barangay_id;

    User.updateUser(id, updates, (err, result) => {
      if (err) {
        console.error("❌ Update User Error:", err);
        return res.status(500).json({ error: err.message });
      }
      if (!result.affectedRows) {
        return res.status(404).json({ error: "User not found or no changes applied" });
      }
      console.log("✅ User Updated - ID:", id);
      return res.status(200).json({ message: "User updated successfully" });
    });
  } catch (error) {
    console.error("❌ Unexpected Error (Update User):", error);
    return res.status(500).json({ error: "An error occurred while updating user" });
  }
};

// ───────────────────────────────────────────────
// 🔹 Delete User
// ───────────────────────────────────────────────
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  User.deleteUser(id, (err, result) => {
    if (err) {
      console.error("❌ Delete User Error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!result.affectedRows) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("🗑️ User Deleted - ID:", id);
    return res.status(200).json({ message: "User deleted successfully" });
  });
};
