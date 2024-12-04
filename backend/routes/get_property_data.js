const express = require('express');
const db = require('../config/db');  // Import your MySQL connection
const router = express.Router();

// Define the route to fetch property details by property_id
router.get('/api/property/:property_id', (req, res) => {
    const propertyId = req.params.property_id;
  
    // Updated SQL query to fetch property details, permitted uses, and other related data
    const query = `
      SELECT 
        p.address, 
        p.zoning, 
        p.plot_area_sqft, 
        p.pincode,
        p.height_limit_ft,
        p.depth_ft,
        p.width_ft,
        p.building_sqft,
        s.front_ft, 
        s.back_ft, 
        s.side_ft, 
        
        GROUP_CONCAT(DISTINCT CONCAT(u.use_type, ' (', u.additional_notes, ')') SEPARATOR '; ') AS permitted_uses,
        a.adu_type, 
        a.adu_max_sqft, 
        pr.parking_spaces
      FROM Properties p
      LEFT JOIN Setbacks s ON p.property_id = s.property_id
      LEFT JOIN Permitted_Uses u ON p.property_id = u.property_id
      LEFT JOIN ADU_Details a ON p.property_id = a.property_id
      LEFT JOIN Parking_Requirements pr ON p.property_id = pr.property_id
      WHERE p.property_id = ?
      GROUP BY 
        p.property_id,
        p.address, 
        p.zoning, 
        p.plot_area_sqft, 
        p.pincode,
        p.height_limit_ft,
        p.depth_ft,
        p.width_ft,
        p.building_sqft,
        s.front_ft, 
        s.back_ft, 
        s.side_ft, 
        a.adu_type, 
        a.adu_max_sqft, 
        pr.parking_spaces;
    `;
  
    // Execute the query with the provided property_id
    db.query(query, [propertyId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database query failed.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Property not found.' });
      }
  
      // Return the first result (since the query is expected to return one row per property_id)
      res.status(200).json(results[0]);
    });
});
  
module.exports = router;
