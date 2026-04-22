const express = require('express');
const { signup, login, getProfile, updateProfile } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes (no authentication required)
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
