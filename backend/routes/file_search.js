const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path based on your setup

// Search API
router.get('/search', (req, res) => {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ error: 'Missing filename query parameter' });
  }

  const sql = `
    SELECT * FROM uploaded_files
    WHERE filename LIKE ?
    ORDER BY upload_date DESC
  `;

  db.query(sql, [`%${filename}%`], (err, results) => {
    if (err) {
      console.error("Error during file search:", err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;
