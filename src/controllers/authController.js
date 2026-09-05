const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'typingmastersecretkey', {
    expiresIn: '1d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  const { name, password } = req.body;

  try {
    // 1. Validate inputs
    if (!name || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both username and password' });
    }

    if (name.length < 2) {
      return res.status(400).json({ success: false, message: 'Username must be at least 2 characters long' });
    }

    if (password.length < 4) {
      return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ name });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // 3. Create new user (password is hashed automatically by pre-save hook)
    const user = await User.create({ name, password });

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Send JWT in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: { id: user._id, name: user.name }
    });

  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { name, password } = req.body;

  try {
    // 1. Validate inputs
    if (!name || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    // 2. Find user
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Send cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  return res.json({ success: true, message: 'Logged out successfully' });
};
