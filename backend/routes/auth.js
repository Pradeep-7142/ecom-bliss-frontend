const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Manual authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticateToken, authController.logout);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  authController.googleCallback
);

// Profile management
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/change-password', authenticateToken, authController.changePassword);

// Password reset
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);

// Admin routes
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

module.exports = router; 