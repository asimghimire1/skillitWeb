const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../config/authMiddleware');
const User = require('../models/User');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Get all teachers (public for students to browse)
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: 'teacher' },
      attributes: ['id', 'fullname', 'email', 'avatar', 'bio', 'verified', 'location']
    });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected routes
router.get('/me', authMiddleware, AuthController.getCurrentUser);

module.exports = router;
