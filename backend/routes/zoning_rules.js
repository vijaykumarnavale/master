const express = require("express");
const db = require("../config/db");
const router = express.Router();
router.get("/zones", (req, res) => {
    db.query("SELECT * FROM zoning_rules", (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No zoning rules found" });
        }
        res.json(results);
    });
});


router.get("/zones/:zone_code", (req, res) => {
    const { zone_code } = req.params;
    const { city } = req.query;

    if (!zone_code || typeof zone_code !== "string") {
        return res.status(400).json({ error: "Invalid zone code" });
    }

    let query = "SELECT * FROM zoning_rules WHERE zone_code = ?";
    const values = [zone_code];

    if (city) {
        query += " AND city LIKE ?";
        values.push(`%${city}%`);
    }

    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No zoning rules found for this zone code" });
        }
        res.json(results);
    });
});


router.get("/zone/:id", (req, res) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    db.query("SELECT * FROM zoning_rules WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Zone not found" });
        }
        res.json(results[0]);
    });
});

module.exports = router;
    