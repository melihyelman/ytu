const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const contactSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String }, // For Telegram integration later, maybe chatID
    telegramChatId: { type: String }
});

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    deviceId: { type: String, unique: true, sparse: true }, // Cihaz Kimliği (Opsiyonel ama unique)
    emergencyContacts: [contactSchema],
    // Eşik değerleri
    heartRateThresholdMin: { type: Number, default: 40 }, // Minimum kalp ritmi eşiği (BPM)
    heartRateThresholdMax: { type: Number, default: 200 }, // Maksimum kalp ritmi eşiği (BPM)
    inactivityThreshold: { type: Number, default: 300 } // Uzun süreli aktivitesizlik eşiği (saniye)
}, {
    timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Password verification method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

