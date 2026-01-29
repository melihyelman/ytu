const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'gizliAnahtar123', {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                deviceId: user.deviceId,
                heartRateThresholdMin: user.heartRateThresholdMin,
                heartRateThresholdMax: user.heartRateThresholdMax,
                inactivityThreshold: user.inactivityThreshold,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                emergencyContacts: user.emergencyContacts,
                deviceId: user.deviceId,
                heartRateThresholdMin: user.heartRateThresholdMin,
                heartRateThresholdMax: user.heartRateThresholdMax,
                inactivityThreshold: user.inactivityThreshold
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                emergencyContacts: user.emergencyContacts,
                deviceId: user.deviceId,
                heartRateThresholdMin: user.heartRateThresholdMin,
                heartRateThresholdMax: user.heartRateThresholdMax,
                inactivityThreshold: user.inactivityThreshold
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
};

// @desc    Update emergency contacts
// @route   PUT /api/auth/contacts
// @access  Private
const updateContacts = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.emergencyContacts = req.body.emergencyContacts || user.emergencyContacts;
        if (req.body.deviceId) user.deviceId = req.body.deviceId;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            emergencyContacts: updatedUser.emergencyContacts,
            deviceId: updatedUser.deviceId,
            heartRateThresholdMin: updatedUser.heartRateThresholdMin,
            heartRateThresholdMax: updatedUser.heartRateThresholdMax,
            inactivityThreshold: updatedUser.inactivityThreshold,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user settings (thresholds)
// @route   PUT /api/auth/settings
// @access  Private
const updateSettings = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        if (req.body.heartRateThresholdMin !== undefined) {
            user.heartRateThresholdMin = req.body.heartRateThresholdMin;
        }
        if (req.body.heartRateThresholdMax !== undefined) {
            user.heartRateThresholdMax = req.body.heartRateThresholdMax;
        }
        if (req.body.inactivityThreshold !== undefined) {
            user.inactivityThreshold = req.body.inactivityThreshold;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            emergencyContacts: updatedUser.emergencyContacts,
            deviceId: updatedUser.deviceId,
            heartRateThresholdMin: updatedUser.heartRateThresholdMin,
            heartRateThresholdMax: updatedUser.heartRateThresholdMax,
            inactivityThreshold: updatedUser.inactivityThreshold,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateContacts, updateSettings };

