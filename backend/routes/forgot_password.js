const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Adjust the path as needed
const dotenv = require('dotenv');
const path = require('path');
dotenv.config(); // Load environment variables

const router = express.Router();

// Create a transporter to send emails (using Gmail as an example)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    // logger: true,  // Enable logging for troubleshooting
    // debug: true,   // Enable detailed logging
  });
  

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      // Check if the user exists in the database
      db.query('SELECT * FROM users WHERE email = ?', [email], async (err, rows) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }
  
        // If no user is found with the provided email
        if (rows.length === 0) {
          return res.status(400).json({ message: 'Email not found' });
        }
  
        const user = rows[0]; // Get the first user from the result (in case of multiple users, though usually there should be only one)
  
        // Generate a reset token using JWT
        const resetToken = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: '1h' } // Token expires in 1 hour
        );
  
        // Construct the reset password URL
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
        // Send the email with the reset link
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Password Reset Request',
          text: `Click the link below to reset your password:\n\n${resetUrl}`,
        };
  
        transporter.sendMail(mailOptions, (err, info) => {
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
router.get('/reset-password', (req, res) => {
    const token = req.query.token; // Get the token from the query parameter
    if (!token) {
      return res.status(400).send('Token is required.');
    }
  
    // Render the reset-password.html page and pass the token to the frontend
    res.sendFile(path.join(__dirname, 'reset-password.html')); // Adjust the path as needed
  });
  
  
  // Handle the reset password submission
  router.post('/reset-password', async (req, res) => {
    const token = req.query.token;
    const {  newPassword } = req.body;
  
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
  
    try {
      // Verify the reset token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Validate password strength (example)
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordPattern.test(newPassword)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and contain a number.' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the password in the database
      db.query('UPDATE users SET password = ? WHERE id = ?', [
        hashedPassword,
        decoded.id,
      ], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Failed to update password. Please try again later.' });
        }
  
        res.status(200).json({ message: 'Password updated successfully' });
      });
    } catch (err) {
      console.error('Token verification error:', err);
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  });
  

module.exports = router;
