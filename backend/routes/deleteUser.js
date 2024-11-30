const express = require('express');
const db = require('../config/db'); // Ensure db supports promise-based queries
const router = express.Router();
// Delete User (DELETE /users/:id)
router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
  
    const query = `DELETE FROM users WHERE id = ?`;
  
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'User deleted successfully' });
    });
  });
  module.exports = router;