const express = require('express');
const db = require('../config/db'); // Ensure db supports promise-based queries
const router = express.Router();
// Example Node.js Express route to handle getting permitted uses by property_id
router.get("/permitted-uses/:property_id", (req, res) => {
    const { property_id } = req.params;
    const sql = "SELECT use_type, additional_notes FROM permitted_uses WHERE property_id = ?";
    
    db.query(sql, [property_id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json(result);  // Return array of permitted uses
    });
  });
  module.exports = router;