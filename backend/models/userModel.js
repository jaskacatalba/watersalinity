// file: models/userModel.js

const db = require("../config/db");

const User = {
  // 🔹 User Login Query
  login: (username, callback) => {
    db.query("SELECT * FROM UserTbl WHERE u_UName = ?", [username], callback);
  },

  // 🔹 Create User (now returns a Promise so controller can access insertId)
  createUser: (data) => {
    return new Promise((resolve, reject) => {
      const {
        first_name,
        last_name,
        u_UName,
        u_PName,
        gmail,
        u_Uphone,
        municipality_id,
        barangay_id,
        purok_id,
        UserType,
      } = data;

      const sql = `
        INSERT INTO UserTbl 
          (first_name, last_name, u_UName, u_PName, gmail, u_Uphone, municipality_id, barangay_id, purok_id, UserType)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          first_name,
          last_name,
          u_UName,
          u_PName,
          gmail,
          u_Uphone,
          municipality_id,
          barangay_id || null,
          purok_id || null,
          UserType,
        ],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
      );
    });
  },

  // 🔹 Get All Users (with joined Municipality and Barangay names)
  getAllUsers: (callback) => {
    const query = `
      SELECT 
        u.*,
        m.name AS municipality_name,
        b.name AS barangay_name
      FROM UserTbl u
      LEFT JOIN municipalities m ON u.municipality_id = m.id
      LEFT JOIN barangays b ON u.barangay_id = b.id
    `;
    db.query(query, callback);
  },

  // 🔹 Get User by ID (with joined Municipality and Barangay names)
  getUserById: (id, callback) => {
    const query = `
      SELECT 
        u.*,
        m.name AS municipality_name,
        b.name AS barangay_name
      FROM UserTbl u
      LEFT JOIN municipalities m ON u.municipality_id = m.id
      LEFT JOIN barangays b ON u.barangay_id = b.id
      WHERE u.u_ID = ?
    `;
    db.query(query, [id], callback);
  },

  // 🔹 Get Minimal User Profile for Sensor Data Integration
  //    Includes the 'gmail' field so notifications can be sent
  getUserProfile: (userId, callback) => {
    const sql = `
      SELECT 
        u_ID,
        first_name,
        last_name,
        gmail,
        u_Uphone,
        municipality_id,
        barangay_id,
        purok_id
      FROM UserTbl 
      WHERE u_ID = ?
    `;
    db.query(sql, [userId], callback);
  },

  // 🔹 Update User (now includes `purok_id`)
  updateUser: (id, updatedData, callback) => {
    const {
      first_name,
      last_name,
      u_UName,
      u_PName,
      gmail,
      u_Uphone,
      municipality_id,
      barangay_id,
      purok_id,
      UserType,
    } = updatedData;

    const sql = `
      UPDATE UserTbl
      SET
        first_name = ?,
        last_name = ?,
        u_UName = ?,
        u_PName = ?,
        gmail = ?,
        u_Uphone = ?,
        municipality_id = ?,
        barangay_id = ?,
        purok_id = ?,
        UserType = ?
      WHERE u_ID = ?
    `;

    db.query(
      sql,
      [
        first_name,
        last_name,
        u_UName,
        u_PName,
        gmail,
        u_Uphone,
        municipality_id,
        barangay_id || null,
        purok_id || null,
        UserType,
        id,
      ],
      callback
    );
  },

  // 🔹 Delete User
  deleteUser: (id, callback) => {
    db.query("DELETE FROM UserTbl WHERE u_ID = ?", [id], callback);
  },
};

module.exports = User;
