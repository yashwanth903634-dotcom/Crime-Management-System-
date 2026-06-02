const express = require('express');
const router = express.Router();
const CriminalController = require('../controllers/criminalController');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// All routes require authentication temporarily removed
// router.use(authenticate);

// Routes
router.get('/stats', CriminalController.getStats);
router.get('/', CriminalController.getAll);
router.get('/search', CriminalController.search);
router.get('/:id', CriminalController.getById);

// Routes with image upload middleware
router.post('/', upload.single('image'), CriminalController.create);
router.put('/:id', upload.single('image'), CriminalController.update);

router.delete('/:id', CriminalController.delete);

module.exports = router;
