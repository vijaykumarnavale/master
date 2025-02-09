const express = require('express');
const db = require('../config/db'); // Import your MySQL connection
const router = express.Router();

// Route to fetch property details by property_id up
router.get('/api/property/:property_id', (req, res) => {
    const propertyId = req.params.property_id;

    // SQL query to join multiple tables and fetch property details, including JADU fields
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
            u.lot_area_sqft,
            u.lot_width_ft,
            u.lot_depth_ft,
            u.setback_front_ft,
            u.setback_back_ft,
            u.setback_side_ft,
            u.max_height_ft,
            u.parking_spaces_required,
            a.adu_type, 
            a.adu_count, 
            a.adu_max_sqft,
            a.height as adu_height,
            a.length as adu_length,
            a.breadth as adu_breadth,
            a.setbacks_front_back as adu_setbacks_front_back,
            a.side_yards as adu_side_yards,
            a.no_of_units as adu_no_of_units,
            j.jadu_type,
            j.jadu_count, 
            j.jadu_max_sqft,
            j.height as jadu_height,
            j.length as jadu_length,
            j.breadth as jadu_breadth,
            j.setbacks_front_back as jadu_setbacks_front_back,
            j.side_yards as jadu_side_yards,
            j.no_of_units as jadu_no_of_units,
            p.parking_spaces,
            p.garages
        FROM properties p
        LEFT JOIN setbacks s ON p.property_id = s.property_id
        LEFT JOIN lot_zoning_details u ON p.property_id = u.property_id
        LEFT JOIN adu_details a ON p.property_id = a.property_id
        LEFT JOIN jadu_details j ON p.property_id = j.property_id
        LEFT JOIN parking_requirements pr ON p.property_id = pr.property_id
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
            const useType = row.use_type;
            if (!permittedUses[useType]) {
                permittedUses[useType] = {
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

        // Create the adu_details object
        const aduDetails = {};
        results.forEach((row) => {
            const aduType = row.adu_type; // Use 'adu_type' as the key
            if (!aduDetails[aduType]) {
                aduDetails[aduType] = {
                    adu_type: row.adu_type,
                    adu_count: row.adu_count,
                    adu_max_sqft: row.adu_max_sqft,
                    adu_height: row.adu_height,
                    adu_length: row.adu_length,
                    adu_breadth: row.adu_breadth,
                    adu_setbacks_front_back: row.adu_setbacks_front_back,
                    adu_side_yards: row.adu_side_yards,
                    adu_no_of_units: row.adu_no_of_units,
                };
            }
        });

        // Create the jadu_details object
        const jaduDetails = {};
        results.forEach((row) => {
            const jaduType = row.jadu_type; // Use 'jadu_type' as the key
            if (!jaduDetails[jaduType]) {
                jaduDetails[jaduType] = {
                    jadu_type: row.jadu_type,
                    jadu_count: row.jadu_count,
                    jadu_max_sqft: row.jadu_max_sqft,
                    jadu_height: row.jadu_height,
                    jadu_length: row.jadu_length,
                    jadu_breadth: row.jadu_breadth,
                    jadu_setbacks_front_back: row.jadu_setbacks_front_back,
                    jadu_side_yards: row.jadu_side_yards,
                    jadu_no_of_units: row.jadu_no_of_units,
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
            adu_details: aduDetails,
            jadu_details: jaduDetails,
            parking_spaces: property.parking_spaces,
            garages: property.garages, // Include garages explicitly
        };
        

        // Send the JSON response
        res.status(200).json(output);
    });
});

module.exports = router;
