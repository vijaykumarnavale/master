const express = require('express');
const db = require('../config/db'); // Import your MySQL connection
const router = express.Router();

// Route to fetch property details by property_id
router.get('/api/property/:property_id', (req, res) => {
    const propertyId = req.params.property_id;

    // SQL query to fetch all columns from the properties table
    const query = `SELECT * FROM properties WHERE property_id = ?`;

    // Execute the query
    db.query(query, [propertyId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query failed.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Property not found.' });
        }

        // Extract the first property data
        const property = results[0];

        // Send the JSON response
        res.status(200).json(property);
    });
});

module.exports = router;
