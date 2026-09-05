const express = require('express');
const router = express.Router();
const { getRandomWords } = require('../controllers/wordController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRandomWords);

module.exports = router;
