const express = require('express');
const db = require('../config/db');  // Import your MySQL connection
const router = express.Router();

// Endpoint to fetch records based on search query
router.get('/search', (req, res) => {
  const query = req.query.query?.toLowerCase(); // Get the search query from the request

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // SQL query to search the properties table
  const sql = `
    SELECT * FROM properties
    WHERE LOWER(address) LIKE ? 
    OR LOWER(apn) LIKE ? 
    OR pincode LIKE ?
  `;

  const searchTerm = `%${query}%`;

  db.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Failed to fetch records from the database' });
    }

    // ✅ Always return an array, even if empty
    res.status(200).json({ records: results });
  });
});

module.exports = router;
