const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const criminalRoutes = require('./routes/criminalRoutes');
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const fs = require('fs');
const path = require('path');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/criminals', criminalRoutes);
app.use('/api/activities', activityRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CRMS Backend API is running!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
