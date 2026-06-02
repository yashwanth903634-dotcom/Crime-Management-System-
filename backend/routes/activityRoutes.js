const express = require('express');
const router = express.Router();
const ActivityModel = require('../models/activityModel');
const { authenticate } = require('../middleware/auth');

// All routes require authentication temporarily removed
// router.use(authenticate);

// Get recent activities
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const activities = await ActivityModel.getRecent(limit);
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

// Get all activities
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const activities = await ActivityModel.getAll(page, limit);
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

module.exports = router;
