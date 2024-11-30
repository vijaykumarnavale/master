const express = require('express');
const db = require('../config/db'); // Ensure db supports promise-based queries
const router = express.Router();
// Update User (PUT /users/:id)
router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { full_name, email, contact_number } = req.body;
  
    const query = `
      UPDATE users 
      SET full_name = ?, email = ?, contact_number = ? 
      WHERE id = ?
    `;
  
    db.query(query, [full_name, email, contact_number, userId], (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'User updated successfully' });
    });
  });
  
  module.exports = router;