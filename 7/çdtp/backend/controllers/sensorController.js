const SensorData = require('../models/SensorData');
const User = require('../models/User');
const { sendEmergencyAlert } = require('../services/notificationService');

// @desc    Save sensor data & check for emergencies
// @route   POST /api/sensor/data
// @access  Public (accessed by ESP32)
const saveSensorData = async (req, res) => {
    // ESP32 sends: { deviceId, heartRate, motionStatus, rawAccel, inactivityDuration }
    const { deviceId, heartRate, motionStatus, rawAccel, inactivityDuration } = req.body;

    try {
        console.log(req.body);
        if (!deviceId) {
             return res.status(400).json({ message: 'Device ID is required' });
        }

        // Find user by Device ID
        const user = await User.findOne({ deviceId });
        
        if (!user) {
            return res.status(404).json({ message: 'Device not registered to any user' });
        }
        
        const userId = user._id;

        // Kullanıcının eşik değerlerini al (varsayılan değerler kullanılabilir)
        const heartRateMin = user.heartRateThresholdMin || 40;
        const heartRateMax = user.heartRateThresholdMax || 200;
        const inactivityThreshold = user.inactivityThreshold || 300; // saniye

        // Eşik değer kontrolü için flag'ler
        let heartRateExceeded = false;
        let inactivityExceeded = false;

        // --- Emergency Logic Check ---
        let alertTriggered = false;
        let alertType = '';
        let setMotionStatus = 'Normal';

        if (motionStatus === 'Fall Detected') {
            alertTriggered = true;
            alertType = 'DÜŞME ALGILANDI';
            setMotionStatus = 'Fall Detected';
        }
        
        else if (motionStatus === 'Manual Alarm') {
            alertTriggered = true;
            alertType = 'MANUEL ACİL DURUM BUTONU';
            setMotionStatus = 'Manual Alarm';
        }

        // Kalp ritmi eşik değer kontrolü (kullanıcının ayarladığı değerlerle)
        else if (heartRate > heartRateMax || heartRate < heartRateMin) {
            heartRateExceeded = true;
            alertTriggered = true;
            alertType = 'ANORMAL KALP RİTMİ';
            setMotionStatus = 'Abnormal Heart Rate';
        }

        // Aktivitesizlik eşik değer kontrolü
        else if (motionStatus === 'Inactivity' && inactivityDuration) {
            if (inactivityDuration >= inactivityThreshold) {
                inactivityExceeded = true;
                alertTriggered = true;
                alertType = `UZUN SÜRELİ HAREKETSİZLİK (${inactivityDuration} saniye)`;
                setMotionStatus = 'Long Inactivity';
            }
        }

        const sensorData = await SensorData.create({
            user: userId,
            heartRate,
            motionStatus: setMotionStatus,
            rawAccel: rawAccel || null,
            inactivityDuration: inactivityDuration || null,
            thresholdExceeded: {
                heartRate: heartRateExceeded,
                inactivity: inactivityExceeded
            }
        });

        if (alertTriggered) {
            console.log('Emergency alert triggered');
            await sendEmergencyAlert(user, alertType, { heartRate, motionStatus: setMotionStatus });
        }

        const io = req.app.get('io');
        io.to(userId.toString()).emit('newData', {
            user: userId,
            heartRate,
            motionStatus: setMotionStatus,
            timestamp: sensorData.timestamp
        });
        res.status(201).json(sensorData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get sensor history for a user
// @route   GET /api/sensor/history
// @access  Private
const getSensorHistory = async (req, res) => {
    try {
        const data = await SensorData.find({ user: req.user._id })
            .sort({ timestamp: -1 })
            .limit(100); // Return last 100 records for graph
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get analytics data for a user
// @route   GET /api/sensor/analytics
// @access  Private
const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Son 30 günün verilerini al
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const allData = await SensorData.find({ 
            user: userId,
            timestamp: { $gte: thirtyDaysAgo }
        }).sort({ timestamp: -1 });

        if (allData.length === 0) {
            return res.json({
                heartRateAnalysis: {
                    average: 0,
                    min: 0,
                    max: 0,
                    thresholdExceededCount: 0,
                    totalReadings: 0
                },
                emergencyStats: {
                    totalEmergencies: 0,
                    byType: {}
                }
            });
        }

        // Kalp Ritmi Analizi
        const heartRates = allData.map(d => d.heartRate).filter(hr => hr > 0);
        const heartRateAnalysis = {
            average: heartRates.length > 0 
                ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length) 
                : 0,
            min: heartRates.length > 0 ? Math.min(...heartRates) : 0,
            max: heartRates.length > 0 ? Math.max(...heartRates) : 0,
            thresholdExceededCount: allData.filter(d => d.thresholdExceeded?.heartRate === true).length,
            totalReadings: heartRates.length
        };

        // Acil Durum İstatistikleri
        const emergencyData = allData.filter(d => d.motionStatus !== 'Normal');
        const emergencyByType = {};
        
        emergencyData.forEach(data => {
            const status = data.motionStatus;
            emergencyByType[status] = (emergencyByType[status] || 0) + 1;
        });

        const emergencyStats = {
            totalEmergencies: emergencyData.length,
            byType: emergencyByType
        };

        res.json({
            heartRateAnalysis,
            emergencyStats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Trigger emergency manually from frontend
// @route   POST /api/sensor/emergency
// @access  Private
const triggerEmergency = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const alertType = 'MANUEL ACİL DURUM BUTONU';
        const setMotionStatus = 'Manual Alarm';

        const lastData = await SensorData.findOne({ user: user._id }).sort({ timestamp: -1 });
        const heartRate = lastData ? lastData.heartRate : 0;

        await sendEmergencyAlert(user, alertType, { heartRate, motionStatus: setMotionStatus });

        const sensorData = await SensorData.create({
            user: user._id,
            heartRate,
            motionStatus: setMotionStatus,
            rawAccel: null, // Manual trigger has no accel data
            inactivityDuration: null
        });

        const io = req.app.get('io');
        io.to(user._id.toString()).emit('newData', {
            user: user._id,
            heartRate,
            motionStatus: setMotionStatus,
            timestamp: sensorData.timestamp
        });

        res.status(200).json({ message: 'Emergency alert sent', sensorData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { saveSensorData, getSensorHistory, triggerEmergency, getAnalytics };

