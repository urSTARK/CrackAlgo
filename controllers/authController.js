const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).render('register', { 
        error: 'User already exists' 
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      isAdmin: isAdmin === 'true'
    });

    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true });
    
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).render('register', { 
      error: 'Registration failed' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).render('login', { 
        error: 'Invalid credentials' 
      });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true });
    
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).render('login', { 
      error: 'Login failed' 
    });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

module.exports = { register, login, logout };