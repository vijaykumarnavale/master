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
    building_sqft, // New field
  } = req.body;

  const sql = `
      INSERT INTO Properties 
      (address, apn, pincode, zoning, plot_area_sqft, height_limit_ft, depth_ft, width_ft, building_sqft)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [address, apn, pincode, zoning, plot_area_sqft, height_limit_ft, depth_ft, width_ft, building_sqft],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json({ property_id: result.insertId });
    }
  );
});


// Insert data into Setbacks table
router.post("/api/setbacks", (req, res) => {
  const { property_id, front_ft, back_ft, side_ft } = req.body;
  const sql = `INSERT INTO Setbacks (property_id, front_ft, back_ft, side_ft) VALUES (?, ?, ?, ?)`;
  db.query(sql, [property_id, front_ft, back_ft, side_ft], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ setback_id: result.insertId });
  });
});

// Insert data into Permitted_Uses table
router.post("/api/permitted-uses", (req, res) => {
  const { property_id, use_type, max_height_ft, additional_notes } = req.body;
  const sql = `INSERT INTO Permitted_Uses (property_id, use_type, max_height_ft, additional_notes) VALUES (?, ?, ?, ?)`;
  db.query(sql, [property_id, use_type, max_height_ft, additional_notes], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ use_id: result.insertId });
  });
});

// Insert data into ADU_Details table
router.post("/api/adu-details", (req, res) => {
  const {
    property_id,
    adu_type,
    adu_count,
    adu_max_sqft,
    jadu_count, // New field
    jadu_max_sqf, // New field
  } = req.body;

  const sql = `
    INSERT INTO ADU_Details 
    (property_id, adu_type, adu_count, adu_max_sqft, jadu_count, jadu_max_sqf) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [property_id, adu_type, adu_count, adu_max_sqft, jadu_count, jadu_max_sqf],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json({ adu_id: result.insertId });
    }
  );
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
    INSERT INTO Parking_Requirements 
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