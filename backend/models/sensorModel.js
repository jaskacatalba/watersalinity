const db = require('../config/db');

const Sensor = {
    getAll: (callback) => {
        db.query('SELECT * FROM sensor_data', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM sensor_data WHERE id = ?', [id], callback);
    },

    // NEW: Get sensors filtered by barangay
    getByBarangay: (barangayId, callback) => {
        db.query('SELECT * FROM sensor_data WHERE barangay_id = ?', [barangayId], callback);
    },

    add: (data, callback) => {
        const { first_name, last_name, contact_no, municipality_id, barangay_id, purok_id, ph_level, salinity_level, date_added } = data;
        db.query(
            'INSERT INTO sensor_data (first_name, last_name, contact_no, municipality_id, barangay_id, purok_id, ph_level, salinity_level, date_added) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, contact_no, municipality_id, barangay_id, purok_id, ph_level, salinity_level, date_added || new Date()],
            callback
        );
    },

    update: (id, data, callback) => {
        const { first_name, last_name, contact_no, municipality_id, barangay_id, purok_id, ph_level, salinity_level, date_added } = data;
        db.query(
            'UPDATE sensor_data SET first_name = ?, last_name = ?, contact_no = ?, municipality_id = ?, barangay_id = ?, purok_id = ?, ph_level = ?, salinity_level = ?, date_added = ? WHERE id = ?',
            [first_name, last_name, contact_no, municipality_id, barangay_id, purok_id, ph_level, salinity_level, date_added, id],
            callback
        );
    },

    deleteById: (id, callback) => {
        db.query('DELETE FROM sensor_data WHERE id = ?', [id], callback);
    }
};

module.exports = Sensor;
