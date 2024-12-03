import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Search.css'; // Optional styling

const SearchAndRecords = () => {
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/search?query=${query}`);
      setRecords(response.data.records);
    } catch (err) {
      setError('Failed to fetch records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewData = async (propertyId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/property/${propertyId}`);
      navigate('/property-details', { state: { propertyData: response.data } });
    } catch (err) {
      console.error('Error fetching property data:', err);
      alert('Failed to fetch property data. Please try again.');
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter APN, address, pincode, or search query"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {records.length > 0 && (
        <table className="records-table">
          <thead>
            <tr>
              <th>Property ID</th>
              <th>Address</th>
              <th>APN</th>
              <th>Pincode</th>
              <th>Zoning</th>
              <th>Plot Area (sqft)</th>
              <th>Height Limit (ft)</th>
              <th>Depth (ft)</th>
              <th>Width (ft)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.property_id}>
                <td>{record.property_id}</td>
                <td>{record.address}</td>
                <td>{record.apn}</td>
                <td>{record.pincode}</td>
                <td>{record.zoning}</td>
                <td>{record.plot_area_sqft}</td>
                <td>{record.height_limit_ft}</td>
                <td>{record.depth_ft}</td>
                <td>{record.width_ft}</td>
                <td>
                  <button onClick={() => handleViewData(record.property_id)}>
                    View Data
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchAndRecords;
