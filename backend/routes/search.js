const express = require('express');
const db = require('../config/db'); // Ensure db supports promise-based queries
const router = express.Router();

const records = [
    { id: 1, description: 'Building 1', address: '123 Main St' },
    { id: 2, description: 'Building 2', address: '456 Elm St' },
  ];
  
  // Endpoint to fetch records based on search query
  router.get('/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    const filteredRecords = records.filter((record) =>
      record.description.toLowerCase().includes(query) || record.address.toLowerCase().includes(query)
    );
    res.json({ records: filteredRecords });
  });
  module.exports = router;