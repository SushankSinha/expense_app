const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { z } = require('zod');
const { signupSchema, loginSchema } = require('../validators/authValidator');

const JWT_SECRET = process.env.JWT_SECRET; // Ensured this is populated in .env

const signup = async (req, res) => {
  try {
    const { fullname, email, password } = signupSchema.parse(req.body);

    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    const newUser = await userModel.createUser({ fullname, email, password });
    
    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    // Set secure cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    if (error && error.name === 'ZodError') {
      const issues = error.issues || error.errors || [];
      const errorMessage = issues.map(e => e.message).join(', ') || 'Validation failed';
      return res.status(400).json({ error: errorMessage, details: issues });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Set secure cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ user: { id: user.id, fullname: user.fullname, email: user.email } });
  } catch (error) {
    if (error && error.name === 'ZodError') {
      const issues = error.issues || error.errors || [];
      const errorMessage = issues.map(e => e.message).join(', ') || 'Validation failed';
      return res.status(400).json({ error: errorMessage, details: issues });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

const me = (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = {
  signup,
  login,
  logout,
  me
};
