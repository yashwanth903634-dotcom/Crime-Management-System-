const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const ActivityModel = require('../models/activityModel');

const JWT_SECRET = process.env.JWT_SECRET || 'nova-enforce-crms-secret-key-2026';
const JWT_EXPIRY = '24h';

const AuthController = {
  // Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      // Log login activity
      await ActivityModel.create({
        user_id: user.id,
        action: 'LOGIN',
        entity_type: 'auth',
        description: `${user.full_name} logged in`
      });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
          badge_number: user.badge_number,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ message: 'Server error during login', error: error.message });
    }
  },

  // Verify token / Get current user
  me: async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error in me:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Register new user (admin only)
  register: async (req, res) => {
    try {
      const { username, password, full_name, role, badge_number, email } = req.body;

      if (!username || !password || !full_name) {
        return res.status(400).json({ message: 'Username, password, and full name are required' });
      }

      // Check if username already exists
      const existing = await UserModel.findByUsername(username);
      if (existing) {
        return res.status(409).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await UserModel.create({
        username,
        password: hashedPassword,
        full_name,
        role: role || 'police_officer',
        badge_number,
        email
      });

      // Log activity
      await ActivityModel.create({
        user_id: req.user.id,
        action: 'CREATE',
        entity_type: 'user',
        entity_id: userId,
        description: `Created new user: ${username} (${role || 'police_officer'})`
      });

      res.status(201).json({ message: 'User created successfully', id: userId });
    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }
};

module.exports = AuthController;
