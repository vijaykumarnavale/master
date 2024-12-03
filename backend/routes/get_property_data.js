const express = require('express');
const db = require('../config/db');  // Import your MySQL connection
const router = express.Router();
router.get('/api/property/:property_id', (req, res) => {
    const propertyId = req.params.property_id;
  
    const query = `
      SELECT 
      p.property_id,
        p.address, 
        p.zoning, 
        p.plot_area_sqft, 
        s.front_ft, 
        s.back_ft, 
        s.side_ft, 
        u.use_type, 
        u.additional_notes, 
        a.adu_type, 
        a.adu_max_sqft, 
        pr.parking_spaces
      FROM Properties p
      LEFT JOIN Setbacks s ON p.property_id = s.property_id
      LEFT JOIN Permitted_Uses u ON p.property_id = u.property_id
      LEFT JOIN ADU_Details a ON p.property_id = a.property_id
      LEFT JOIN Parking_Requirements pr ON p.property_id = pr.property_id
      WHERE p.property_id = ?;
    `;
  
    db.query(query, [propertyId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database query failed.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Property not found.' });
      }
  
      res.status(200).json(results[0]);
    });
  });
  
  module.exports = router;