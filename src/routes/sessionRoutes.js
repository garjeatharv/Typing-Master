const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createTypingSession,
  getTypingSessions,
  getTypingStats,
} = require('../controllers/sessionController');

router.get('/stats', protect, getTypingStats);
router.get('/', protect, getTypingSessions);
router.post('/', protect, createTypingSession);

module.exports = router;
