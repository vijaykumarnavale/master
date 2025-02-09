const express = require('express');
const db = require('../config/db'); // Ensure db supports promise-based queries
const router = express.Router();

// Insert data into Properties table
router.post("/api/properties", (req, res) => {
  const {
    address,
    apn,
    pincode,
    zoning,
    plot_area_sqft,
    height_limit_ft,
    depth_ft,
    width_ft,
    building_sqft, // Existing field
    parking_spaces, // New field
    garages         // New field
  } = req.body;

  const sql = `
      INSERT INTO properties 
      (address, apn, pincode, zoning, plot_area_sqft, height_limit_ft, depth_ft, width_ft, building_sqft, parking_spaces, garages)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [address, apn, pincode, zoning, plot_area_sqft, height_limit_ft, depth_ft, width_ft, building_sqft, parking_spaces, garages],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json({ property_id: result.insertId });
    }
  );
});

// Insert data into Setbacks table
router.post("/api/setbacks", (req, res) => {
  const { property_id, front_ft, back_ft, side_ft } = req.body;

  // Replace empty strings with null
  const sanitizedValues = [
    property_id,
    front_ft === '' ? null : front_ft,
    back_ft === '' ? null : back_ft,
    side_ft === '' ? null : side_ft,
  ];

  const sql = `INSERT INTO setbacks (property_id, front_ft, back_ft, side_ft) VALUES (?, ?, ?, ?)`;

  db.query(sql, sanitizedValues, (err, result) => {
    if (err) {
      console.error("Error inserting setbacks:", err);
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ setback_id: result.insertId });
  });
});


// Insert data into Permitted_Uses table
router.post("/api/permitted-uses", (req, res) => {
  const { property_id, uses } = req.body;

  if (!property_id || !Array.isArray(uses) || uses.length === 0) {
    return res.status(400).json({ error: "Invalid input. 'property_id' and 'uses' are required." });
  }

  const sql = `
    INSERT INTO lot_zoning_details 
    (property_id, use_type, lot_area_sqft, lot_width_ft, lot_depth_ft, 
    setback_front_ft, setback_back_ft, setback_side_ft, max_height_ft, parking_spaces_required) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const insertQueries = uses.map((use) => {
    const {
      use_type=null,
      lot_area_sqft = null,
      lot_width_ft = null,
      lot_depth_ft = null,
      setback_front_ft = null,
      setback_back_ft = null,
      setback_side_ft = null,
      max_height_ft = null,
      parking_spaces_required = null,
    } = use;

    if (!use_type) {
      return Promise.reject(new Error("Missing required 'use_type'."));
    }

    return new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          property_id,
          use_type,
          lot_area_sqft,
          lot_width_ft,
          lot_depth_ft,
          setback_front_ft,
          setback_back_ft,
          setback_side_ft,
          max_height_ft,
          parking_spaces_required,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  });

  Promise.all(insertQueries)
    .then((insertIds) => {
      res.status(200).json({
        message: "Lot zoning details added successfully.",
        use_ids: insertIds,
      });
    })
    .catch((err) => {
      console.error("Error inserting lot zoning details:", err.message);
      res.status(500).json({ error: err.message || "Error inserting lot zoning details." });
    });
});



// Insert data into ADU_Details table
router.post("/api/adu-details", (req, res) => {
  const { aduDetails } = req.body; // Expecting an array of ADU details

  if (!Array.isArray(aduDetails) || aduDetails.length === 0) {
    return res.status(400).json({ error: "Invalid input: aduDetails should be a non-empty array." });
  }

  // Ensure optional fields are converted to null if empty
  const sanitizedDetails = aduDetails.map((detail) => ({
    property_id: detail.property_id || null,
    adu_type: detail.adu_type || null, // Required field
    adu_count: detail.adu_count === '' ? null : detail.adu_count,
    adu_max_sqft: detail.adu_max_sqft === '' ? null : detail.adu_max_sqft,
    height: detail.height === '' ? null : detail.height,
    length: detail.length === '' ? null : detail.length,
    breadth: detail.breadth === '' ? null : detail.breadth,
    setbacks_front_back: detail.setbacks_front_back === '' ? null : detail.setbacks_front_back,
    side_yards: detail.side_yards === '' ? null : detail.side_yards,
    no_of_units: detail.no_of_units === '' ? null : detail.no_of_units,
  }));

  // Prepare values for bulk insert
  const values = sanitizedDetails.map((detail) => [
    detail.property_id,
    detail.adu_type,
    detail.adu_count,
    detail.adu_max_sqft,
    detail.height,
    detail.length,
    detail.breadth,
    detail.setbacks_front_back,
    detail.side_yards,
    detail.no_of_units,
  ]);

  const sql = `
    INSERT INTO adu_details 
    (property_id, adu_type, adu_count, adu_max_sqft, height, length, breadth, setbacks_front_back, side_yards, no_of_units) 
    VALUES ?
  `;

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Error inserting ADU details:", err.message);
      return res.status(500).json({ error: "Error inserting ADU details." });
    }

    res.status(200).json({
      message: "ADU details inserted successfully.",
      affectedRows: result.affectedRows,
    });
  });
});


router.post("/api/jadu-details", (req, res) => {
  const { jaduDetails } = req.body; // Expecting an array of JADU details

  if (!Array.isArray(jaduDetails) || jaduDetails.length === 0) {
    return res.status(400).json({ error: "Invalid input: jaduDetails should be a non-empty array." });
  }

  // Convert empty fields to null for optional fields
  const sanitizedDetails = jaduDetails.map((detail) => [
    detail.property_id || null,
    detail.jadu_type || null,
    detail.jadu_count === '' ? null : detail.jadu_count,
    detail.jadu_max_sqft === '' ? null : detail.jadu_max_sqft,
    detail.height === '' ? null : detail.height,
    detail.length === '' ? null : detail.length,
    detail.breadth === '' ? null : detail.breadth,
    detail.setbacks_front_back === '' ? null : detail.setbacks_front_back,
    detail.side_yards === '' ? null : detail.side_yards,
    detail.no_of_units === '' ? null : detail.no_of_units,
  ]);

  const sql = `
    INSERT INTO jadu_details 
    (property_id, jadu_type, jadu_count, jadu_max_sqft, height, length, breadth, setbacks_front_back, side_yards, no_of_units) 
    VALUES ?
  `;

  db.query(sql, [sanitizedDetails], (err, result) => {
    if (err) {
      console.error("Error inserting JADU details:", err.message);
      return res.status(500).json({ error: "Error inserting JADU details. Please check the input data and try again." });
    }

    res.status(200).json({
      message: "JADU details inserted successfully.",
      affectedRows: result.affectedRows,
    });
  });
});


// Insert data into Parking_Requirements table
router.post("/api/parking-requirements", (req, res) => {
  const { 
    property_id, 
    parking_spaces, 
    eligible_for_bonus, // New field
    bonus_type,         // New field
    bonus_percentage    // New field
  } = req.body;

  const sql = `
    INSERT INTO parking_requirements 
    (property_id, parking_spaces, Eligible_For_Bonus, Bonus_Type, Bonus_Percentage) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql, 
    [property_id, parking_spaces, eligible_for_bonus, bonus_type, bonus_percentage], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json({ parking_id: result.insertId });
    }
  );
});

module.exports = router;
//up