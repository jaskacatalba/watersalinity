const db = require("../config/db");

exports.createWell = (wellData, callback) => {
  const {
    municipality_id,
    barangay_id,
    purok_id,
    location,
    contamination_type,
    ph_level,
    salinity,
    date_added
  } = wellData;

  // Insert including ph_level and salinity placed after contamination_type.
  const query = `
    INSERT INTO contaminated_wells_unowned
      (municipality_id, barangay_id, purok_id, location,
       contamination_type, ph_level, salinity, date_added)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [
      municipality_id,
      barangay_id,
      purok_id,
      location,
      contamination_type,
      ph_level,
      salinity,
      date_added || new Date()
    ],
    callback
  );
};

exports.getAllWells = (callback) => {
  db.query("SELECT * FROM contaminated_wells_unowned", callback);
};

exports.getByBarangay = (barangayId, callback) => {
  db.query(
    "SELECT * FROM contaminated_wells_unowned WHERE barangay_id = ?",
    [barangayId],
    callback
  );
};

exports.getWellById = (id, callback) => {
  db.query(
    "SELECT * FROM contaminated_wells_unowned WHERE well_id = ?",
    [id],
    callback
  );
};

exports.updateWell = (id, updatedData, callback) => {
  const fields = Object.keys(updatedData)
    .filter(key => updatedData[key] !== undefined)
    .map(key => `${key} = ?`)
    .join(", ");
  const values = Object.values(updatedData).filter(value => value !== undefined);
  values.push(id);

  const query = `UPDATE contaminated_wells_unowned SET ${fields} WHERE well_id = ?`;
  db.query(query, values, callback);
};

exports.deleteWell = (id, callback) => {
  const query = "DELETE FROM contaminated_wells_unowned WHERE well_id = ?";
  db.query(query, [id], callback);
};
