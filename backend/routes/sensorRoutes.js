const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

router.get('/', sensorController.getAllSensors);
// NEW: Filter sensors by barangay
router.get('/barangay/:barangayId', sensorController.getSensorsByBarangay);

router.get('/:id', sensorController.getSensorById);
router.post('/', sensorController.addSensorData);
router.put('/:id', sensorController.updateSensorData);  // New PUT route
router.delete('/:id', sensorController.deleteSensorData);

module.exports = router;
