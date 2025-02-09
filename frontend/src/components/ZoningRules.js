import React, { useState, useEffect } from "react";
import "./ZoningRules.css";

const ZoningRules = () => {
  const [zoneCodes, setZoneCodes] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/zones")
      .then(response => response.json())
      .then(data => {
        const uniqueZoneCodes = [...new Set(data.map(item => item.zone_code))];
        setZoneCodes(uniqueZoneCodes);
      })
      .catch(error => console.error("Error fetching zone codes:", error));
  }, []);

  const handleSearch = () => {
    fetch(`http://localhost:5000/zones/${selectedZone}`)
      .then(response => response.json())
      .then(data => setFilteredData(data))
      .catch(error => console.error("Error fetching zone data:", error));
  };

  const handleViewDetails = (zoneId) => {
    fetch(`http://localhost:5000/zone/${zoneId}`)
      .then(response => response.json())
      .then(data => setViewData(data))
      .catch(error => console.error("Error fetching zone details:", error));
  };

  return (
    <div className="zone-container">
      <h2 className="zone-title">Zoning Rules</h2>
      <label htmlFor="zone-select" className="zone-label">Select Zone Code:</label>
      <select
        id="zone-select"
        className="zone-select"
        value={selectedZone}
        onChange={(e) => setSelectedZone(e.target.value)}
      >
        <option value="">--Select--</option>
        {zoneCodes.map((code) => (
          <option key={code} value={code}>{code}</option>
        ))}
      </select>
      <button onClick={handleSearch} className="zone-button">Search</button>

      {filteredData.length > 0 && (
        <table className="zone-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Zone Code</th>
              <th>Use Name</th>
              <th>Use Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.zone_code}</td>
                <td>{item.use_name}</td>
                <td>{item.use_type}</td>
                <td>
                  <button className="view-button" onClick={() => handleViewDetails(item.id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {viewData && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3 className="popup-title">Zone Details</h3>
            <table className="popup-table">
              <tbody>
                {["id", "zone_code", "use_name", "use_type", "min_lot_size", "front_setback", "side_setback", "rear_setback", "max_height", "max_units", "required_parking_spaces", "parking_type", "parking_dimensions", "condition_type", "condition_description", "additional_notes"].map((key) => (
                  <tr key={key}><td><strong>{key.replace(/_/g, ' ')}:</strong></td><td>{viewData[key]}</td></tr>
                ))}
              </tbody>
            </table>
            <button className="close-button" onClick={() => setViewData(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoningRules;
