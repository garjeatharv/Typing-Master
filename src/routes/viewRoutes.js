const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const { SESSION_CATEGORIES } = require('../constants/categories');

router.get('/', protect, (req, res) => {
  res.render('home', {
    naming: req.user.name,
    pageTitle: 'Practice',
    navActive: 'practice',
    categories: SESSION_CATEGORIES,
  });
});

router.get('/stats', protect, (req, res) => {
  res.render('stats', {
    naming: req.user.name,
    pageTitle: 'Your Stats',
    navActive: 'stats',
  });
});

router.get('/login', (req, res) => {
  if (req.cookies && req.cookies.token) {
    return res.redirect('/');
  }
  res.render('login', { pageTitle: 'Log In' });
});

router.get('/signup', (req, res) => {
  if (req.cookies && req.cookies.token) {
    return res.redirect('/');
  }
  res.render('signup', { pageTitle: 'Sign Up' });
});

module.exports = router;
