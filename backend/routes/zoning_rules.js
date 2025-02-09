const express = require('express');
const db = require('../config/db'); // Ensure db supports promise-based queries
const router = express.Router();

router.get("/zones", (req, res) => {
    db.query("SELECT * FROM zoning_rules", (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(results);
      }
    });
  });
  
  router.get("/zones/:zone_code", (req, res) => {
    const { zone_code } = req.params;
    db.query("SELECT * FROM zoning_rules WHERE zone_code = ?", [zone_code], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(results);
      }
    });
  });
  
  router.get("/zone/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM zoning_rules WHERE id = ?", [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: "Zone not found" });
      }
    });
  });
  module.exports = router;