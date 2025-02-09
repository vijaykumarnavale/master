import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import './Search.css'; // Optional styling

const SearchAndRecords = () => {
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const apiUrl = process.env.REACT_APP_NODE_API_URL || 'http://localhost:5000'; // API URL fallback

  // Function to validate the query
  const validateQuery = (input) => {
    if (!input.trim()) {
      setError('Search query cannot be empty.');
     // toast.warn('Please enter a valid search query.', { position: 'top-right', autoClose: 3000 });
      return false;
    }
    return true;
  };

  // Memoized function to fetch records
  const fetchRecords = useCallback(async (searchQuery) => {
    if (!validateQuery(searchQuery)) return;

    setLoading(true);
    setError(null);
    setRecords([]); // Clear previous records

    try {
      const response = await axios.get(`${apiUrl}/search`, {
        params: { query: searchQuery.trim() },
      });

      console.log('API Response:', response.data);

      if (response.data?.records && Array.isArray(response.data.records)) {
        if (response.data.records.length > 0) {
          setRecords(response.data.records);
        } else {
          setRecords([]);
          setError('No records found.');
        }
      } else {
        throw new Error('Invalid response format from server.');
      }
    } catch (err) {
      console.error('Search API Error:', err);
      if (err.response) {
        setError(err.response.data?.message || 'Server returned an error.');
      } else if (err.request) {
        setError('No response from server. Check your internet connection.');
      } else {
        setError(err.message);
      }
      toast.error('Error fetching records. Check console for details.', { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Debounce effect to optimize API calls
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (query) fetchRecords(query);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [query, fetchRecords]);

  const handleViewData = async (propertyId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/property/${propertyId}`);
      navigate('/property-details', { state: { propertyData: response.data } });
    } catch (err) {
      console.error('Error fetching property data:', err);
      toast.error('Failed to fetch property data. Please try again.', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className="search-container">
      <ToastContainer /> {/* Toastify Container */}

      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by APN, address, pincode, or query"
          aria-label="Search input"
        />
        <button onClick={() => fetchRecords(query)} disabled={loading} aria-label="Search button">
          <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px' }} />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {records.length > 0 ? (
        <table className="records-table">
          <thead>
            <tr>
              <th>Property ID</th>
              <th>Address</th>
              <th>APN</th>
              <th>Pincode</th>
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
                <td>
                  <button onClick={() => handleViewData(record.property_id)} aria-label="View record button">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && error === 'No records found.' && <div className="no-records"></div>
      )}
    </div>
  );
};

export default SearchAndRecords;
