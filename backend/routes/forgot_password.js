const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const dotenv = require('dotenv');
const path = require('path');
const ejs = require('ejs');

dotenv.config();

const router = express.Router();

// Create a transporter to send emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (rows.length === 0) {
        return res.status(400).json({ message: 'Email not found' });
      }

      const user = rows[0];
      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

      // Render EJS template
      const emailHTML = await ejs.renderFile(path.join(__dirname, '../views/resetEmail.ejs'), { resetUrl });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset Request',
        html: emailHTML,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.error('Error sending email:', err);
          return res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
        }
        res.status(200).json({ message: 'Password reset email sent successfully' });
      });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  // Check if both token and new password are provided
  if (!token) {
    return res.status(400).json({ message: 'Token are required' });
  }
  else if (!newPassword) {
    return res.status(400).json({ message: 'New password are required' });
  }


  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Password pattern validation: Must have at least 8 characters and a number
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least one number.'
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    const query = 'UPDATE users SET password = ?, reset_token = NULL WHERE id = ?';
    db.query(query, [hashedPassword, decoded.id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Failed to update password. Please try again later.' });
      }

      // Check if the user was found and password updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found or token expired.' });
      }

      res.status(200).json({ message: 'Password updated successfully' });
    });
  } catch (err) {
    console.error('Token verification error:', err);
    // If the token is invalid or expired, return a 400 status
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
