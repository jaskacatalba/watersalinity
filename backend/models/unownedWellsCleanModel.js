// unownedWellsCleanModel.js
const db = require("../config/db");

const createWell = (wellData, callback) => {
  const {
    municipality_id,
    barangay_id,
    purok_id,
    location,
    ph_level,
    salinity_level,
    date_added
  } = wellData;

  // Insert with date_added from request or fallback to Node's current date
  const query = `
    INSERT INTO unowned_wells_clean
      (municipality_id, barangay_id, purok_id, location,
       ph_level, salinity_level, date_added)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [
      municipality_id,
      barangay_id,
      purok_id,
      location,
      ph_level,
      salinity_level,
      date_added || new Date() // fallback
    ],
    callback
  );
};

const getAllWells = (callback) => {
  db.query("SELECT * FROM unowned_wells_clean", callback);
};

const getByBarangay = (barangayId, callback) => {
  db.query(
    "SELECT * FROM unowned_wells_clean WHERE barangay_id = ?",
    [barangayId],
    callback
  );
};

const getWellById = (id, callback) => {
  db.query(
    "SELECT * FROM unowned_wells_clean WHERE well_id = ?",
    [id],
    callback
  );
};

const updateWell = (id, updatedData, callback) => {
  const fields = Object.keys(updatedData)
    .filter(key => updatedData[key] !== undefined)
    .map(key => `${key} = ?`)
    .join(", ");

  const values = Object.values(updatedData).filter(value => value !== undefined);
  values.push(id);

  const query = `UPDATE unowned_wells_clean SET ${fields} WHERE well_id = ?`;
  db.query(query, values, callback);
};

const deleteWell = (id, callback) => {
  db.query(
    "DELETE FROM unowned_wells_clean WHERE well_id = ?",
    [id],
    callback
  );
};

module.exports = {
  createWell,
  getAllWells,
  getByBarangay,
  getWellById,
  updateWell,
  deleteWell
};
