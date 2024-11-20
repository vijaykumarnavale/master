const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorizeRole');
const router = express.Router();

// Admin Dashboard
router.get('/admin-dashboard', authenticate, authorizeRole('Admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the Admin Dashboard', user: req.user });
});

// User Dashboard
router.get('/user-dashboard', authenticate, authorizeRole('User'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the User Dashboard', user: req.user });
});

module.exports = router;
