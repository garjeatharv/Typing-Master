const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getEnv } = require('../config/env');

const protect = async (req, res, next) => {
  let token;

  // Retrieve token from Cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  // Fallback to Bearer token in headers (standard for API testing)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token exists
  if (!token) {
    // If requesting an API endpoint, send JSON response
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ success: false, message: 'Not authorized, please login' });
    }
    // If requesting a HTML view, redirect to login page
    return res.redirect('/login');
  }

  try {
    // Verify the token using secret key
    const decoded = jwt.verify(token, getEnv('JWT_SECRET') || 'typingmastersecretkey');

    // Find the user by ID and exclude password field
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      return res.redirect('/login');
    }

    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ success: false, message: 'Session expired, please login again' });
    }
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

module.exports = { protect };
