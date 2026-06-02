const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', authenticate, AuthController.me);
router.post('/register', authenticate, requireAdmin, AuthController.register);

module.exports = router;
