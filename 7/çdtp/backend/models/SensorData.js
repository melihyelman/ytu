const mongoose = require('mongoose');

const sensorDataSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    heartRate: {
        type: Number,
        required: true
    },
    motionStatus: {
        type: String,
        enum: ['Normal', 'Fall Detected', 'Inactivity', 'Manual Alarm', 'Abnormal Heart Rate', 'Long Inactivity'],
        default: 'Normal'
    },
    rawAccel: {
        x: { type: Number, required: false },
        y: { type: Number, required: false },
        z: { type: Number, required: false }
    },
    inactivityDuration: {
        type: Number, // in minutes or seconds
        default: null
    },
    thresholdExceeded: {
        heartRate: { type: Boolean, default: false }, // Kalp ritmi eşiği aşıldı mı?
        inactivity: { type: Boolean, default: false } // Aktivitesizlik eşiği aşıldı mı?
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;

