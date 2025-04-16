const Sensor = require('../models/sensorModel');

exports.getAllSensors = (req, res) => {
    Sensor.getAll((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.getSensorsByBarangay = (req, res) => {
    const { barangayId } = req.params;
    Sensor.getByBarangay(barangayId, (err, results) => {
        if (err) {
            console.error("Error fetching sensors by barangay:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.getSensorById = (req, res) => {
    const { id } = req.params;
    Sensor.getById(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Sensor data not found" });
        }
        res.json(results[0]);
    });
};

exports.addSensorData = (req, res) => {
    const { first_name, last_name, contact_no, municipality_id, barangay_id, purok_id, ph_level, salinity_level, date_added } = req.body;
    Sensor.add({ first_name, last_name, contact_no, municipality_id, barangay_id, purok_id, ph_level, salinity_level, date_added }, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Data added successfully", id: result.insertId });
    });
};

exports.updateSensorData = (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, contact_no, municipality_id, barangay_id, purok_id, ph_level, salinity_level, date_added } = req.body;
    Sensor.update(id, { first_name, last_name, contact_no, municipality_id, barangay_id, purok_id, ph_level, salinity_level, date_added }, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Sensor data not found" });
        }
        res.json({ message: "Sensor data updated successfully" });
    });
};

exports.deleteSensorData = (req, res) => {
    const { id } = req.params;
    Sensor.deleteById(id, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Sensor data deleted successfully" });
    });
};
