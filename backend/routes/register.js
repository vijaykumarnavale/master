const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const db = require('../config/db'); // Make sure db supports query promises

const router = express.Router();

// Validation schema
const schema = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  contact_number: Joi.string().min(10).max(15).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Admin', 'User').insensitive().optional(),
});

// Promisify the query method (for use with async/await)
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Register Route
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { full_name, email, contact_number, password, role } = req.body;

    // Check if email exists
    try {
      const existingUser = await query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    } catch (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Database error occurred.' });
    }

    // Hash the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error('Error hashing password:', err.message);
      return res.status(500).json({ success: false, message: 'Error securing password.' });
    }

    // Insert user into database
    try {
      await query(
        'INSERT INTO users (full_name, email, contact_number, password, role) VALUES (?, ?, ?, ?, ?)',
        [full_name, email, contact_number, hashedPassword, role || 'User']
      );
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
      });
    } catch (err) {
      console.error('Database insertion error:', err.message);
      res.status(500).json({ success: false, message: 'Error saving user to database.' });
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
  }
});

module.exports = router;
