const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateContacts, updateSettings } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/contacts', protect, updateContacts);
router.put('/settings', protect, updateSettings);

module.exports = router;

