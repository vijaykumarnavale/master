import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserSearch.css'; // Import CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SearchAndRecords = () => {
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null); // Ref to store timeout for debouncing

  const apiUrl = process.env.REACT_APP_NODE_API_URL || 'http://localhost:5000'; // Fallback for local testing

  // Function to validate query input
  const validateQuery = (input) => {
    if (!input.trim()) {
      setError('Search query cannot be empty.');
    //  toast.warn('Please enter a valid search query.', { position: 'top-right', autoClose: 3000 });
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
      if (!apiUrl) {
        throw new Error('API URL is not set. Check your .env file.');
      }

      const response = await axios.get(`${apiUrl}/search`, {
        params: { query: searchQuery.trim() }, // Ensure trimmed query
      });

      console.log('API Response:', response.data);

      if (response.data?.records && Array.isArray(response.data.records)) {
        if (response.data.records.length > 0) {
          setRecords(response.data.records);
        } else {
          setRecords([]);
          setError('No records found Please try again.');
        }
      } else {
        throw new Error('Invalid response format from server.');
      }
    } catch (err) {
      console.error('Search API Error:', err);

      if (err.response) {
        // API responded with a status outside the 2xx range
        console.error('Response Data:', err.response.data);
        setError(err.response.data?.message || 'Server returned an error.');
      } else if (err.request) {
        // No response received
        setError('No response from the server. Please check your internet connection.');
      } else {
        // Other errors
        setError(err.message);
      }
      toast.error('Error fetching records. Check console for details.', { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  }, [apiUrl]); // Memoized using `useCallback`

  // Debounce effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (query) fetchRecords(query);
    }, 500); // Delay of 500ms

    return () => clearTimeout(debounceRef.current);
  }, [query, fetchRecords]); // Added `fetchRecords` to dependencies

  const handleViewData = async (propertyId) => {
    try {
      if (!apiUrl) {
        throw new Error('API URL is not set. Check your .env file.');
      }

      const response = await axios.get(`${apiUrl}/api/property/${propertyId}`);
      console.log('Property Data:', response.data);

      if (!response.data) {
        throw new Error('Invalid property data received.');
      }

      navigate('/user-property-details', { state: { propertyData: response.data } });
    } catch (err) {
      console.error('Error fetching property data:', err);
      toast.error('Failed to fetch property details.', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className="search-container">
      <ToastContainer /> {/* Toastify Container for notifications */}
      
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter APN, address, pincode, or search query"
        />
        <button onClick={() => fetchRecords(query)} disabled={loading}>
          <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px' }} />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loader">Loading...</div>} {/* Optional loading indicator */}

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
                  <button onClick={() => handleViewData(record.property_id)}>View</button>
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
