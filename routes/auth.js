const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', register);

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', login);

router.get('/logout', logout);

module.exports = router;