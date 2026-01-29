const express = require('express');
const router = express.Router();
const { saveSensorData, getSensorHistory, triggerEmergency, getAnalytics } = require('../controllers/sensorController');
const { protect } = require('../middleware/authMiddleware');

// Public route for ESP32 (or you can add a simple API key middleware)
router.post('/data', saveSensorData);

// Private route for Frontend Dashboard
router.get('/history', protect, getSensorHistory);
router.get('/analytics', protect, getAnalytics);
router.post('/emergency', protect, triggerEmergency);

module.exports = router;

