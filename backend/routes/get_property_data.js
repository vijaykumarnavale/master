const express = require('express');
const db = require('../config/db');  // Import your MySQL connection
const router = express.Router();

// Route to fetch property details by property_id
router.get('/api/property/:property_id', (req, res) => {
    const propertyId = req.params.property_id;

    // SQL query to join multiple tables and fetch property details, including ADU fields
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
            u.use_type,
            u.zoning_type,
            u.lot_area_sqft,
            u.lot_width_ft,
            u.lot_depth_ft,
            u.setback_front_ft,
            u.setback_back_ft,
            u.setback_side_ft,
            u.max_height_ft,
            u.floor_area_ratio,
            u.density_units_per_lot,
            u.parking_spaces_required,
            u.open_space_sqft,
            a.adu_type, 
            a.adu_max_sqft,
            a.adu_count,        -- Add adu_count
            a.jadu_count,       -- Add jadu_count
            a.jadu_max_sqf,     -- Add jadu_max_sqf
            pr.parking_spaces
        FROM Properties p
        LEFT JOIN Setbacks s ON p.property_id = s.property_id
        LEFT JOIN lot_zoning_details u ON p.property_id = u.property_id
        LEFT JOIN ADU_Details a ON p.property_id = a.property_id
        LEFT JOIN Parking_Requirements pr ON p.property_id = pr.property_id
        WHERE p.property_id = ?;
    `;

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

        // Create the permitted_uses object
        const permittedUses = {};

        results.forEach((row) => {
            const useType = row.use_type;  // Use the 'use_type' as the key
            if (!permittedUses[useType]) {
                permittedUses[useType] = {
                    zoning_type: row.zoning_type,
                    use_type: row.use_type,
                    lot_area_sqft: row.lot_area_sqft,
                    lot_width_ft: row.lot_width_ft,
                    lot_depth_ft: row.lot_depth_ft,
                    setback_front_ft: row.setback_front_ft,
                    setback_back_ft: row.setback_back_ft,
                    setback_side_ft: row.setback_side_ft,
                    max_height_ft: row.max_height_ft,
                    floor_area_ratio: row.floor_area_ratio,
                    density_units_per_lot: row.density_units_per_lot,
                    parking_spaces_required: row.parking_spaces_required,
                    open_space_sqft: row.open_space_sqft
                };
            }
        });

        // Build the final JSON response
        const output = {
            address: property.address,
            zoning: property.zoning,
            plot_area_sqft: property.plot_area_sqft,
            pincode: property.pincode,
            height_limit_ft: property.height_limit_ft,
            depth_ft: property.depth_ft,
            width_ft: property.width_ft,
            building_sqft: property.building_sqft,
            front_ft: property.front_ft,
            back_ft: property.back_ft,
            side_ft: property.side_ft,
            permitted_uses: permittedUses,
            adu_type: property.adu_type,
            adu_max_sqft: property.adu_max_sqft,
            adu_count: property.adu_count,  // Add adu_count
            jadu_count: property.jadu_count, // Add jadu_count
            jadu_max_sqf: property.jadu_max_sqf, // Add jadu_max_sqf
            parking_spaces: property.parking_spaces,
        };

        // Send the JSON response
        res.status(200).json(output);
    });
});

module.exports = router;
