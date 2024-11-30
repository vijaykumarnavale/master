import React, { useState } from 'react';
import axios from 'axios';
import './Search.css'; // Optional styling

const SearchAndRecords = () => {
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      // Replace with your API endpoint
      const response = await axios.get(`http://localhost:5000/search?query=${query}`);
      setRecords(response.data.records); // Assuming response contains the records
    } catch (err) {
      setError('Failed to fetch records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAP = (recordId) => {
    // Logic to create an architectural plan (for now, just a log)
    console.log(`Creating architectural plan for record ID: ${recordId}`);
    // You could trigger an API call here to create the AP
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter area code or search query"
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
              <th>Record ID</th>
              <th>Description</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.description}</td>
                <td>{record.address}</td>
                <td>
                  <button onClick={() => handleCreateAP(record.id)}>
                    Create AP
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
