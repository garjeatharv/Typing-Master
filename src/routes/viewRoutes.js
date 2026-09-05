const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Protected Home view - only authenticated users can access
router.get('/', protect, (req, res) => {
  res.render('home', { naming: req.user.name });
});

// Login view
router.get('/login', (req, res) => {
  // If user is already logged in, redirect them to the home page
  if (req.cookies && req.cookies.token) {
    return res.redirect('/');
  }
  res.render('login', { pageTitle: 'LogIn' });
});

// Signup view
router.get('/signup', (req, res) => {
  if (req.cookies && req.cookies.token) {
    return res.redirect('/');
  }
  res.render('signup');
});

module.exports = router;
