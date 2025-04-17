const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.patch("/:property_id", (req, res) => {
  const { property_id } = req.params;

  // List of allowed fields and their matching keys in the DB
  const allowedFields = [
    "address", "apn", "pincode", "zoning", "plot_area_sqft", "height_limit_ft",
    "depth_ft", "width_ft", "building_sqft", "parking_spaces", "garages", "UsableSqrft"
  ];

  const updates = [];
  const values = [];

  // Loop through allowed fields and prepare dynamic SQL
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(req.body[field]);
    }
  });

  // No fields to update
  if (updates.length === 0) {
    return res.status(400).json({ error: "No update fields provided." });
  }

  const query = `UPDATE properties SET ${updates.join(", ")} WHERE property_id = ?`;
  values.push(property_id);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property updated successfully" });
  });
});

module.exports = router;
