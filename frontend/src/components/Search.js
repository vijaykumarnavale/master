import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SearchAndRecords = () => {
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const apiUrl = process.env.REACT_APP_NODE_API_URL || 'http://localhost:5000';

  const validateQuery = (input) => {
    if (!input.trim()) {
      setError('Search query cannot be empty.');
      return false;
    }
    return true;
  };

  const fetchRecords = useCallback(async (searchQuery) => {
    if (!validateQuery(searchQuery)) return;

    setLoading(true);
    setError(null);
    setRecords([]);
    setCurrentPage(1);

    try {
      const response = await axios.get(`${apiUrl}/search`, {
        params: { query: searchQuery.trim() },
      });

      if (response.data?.records && Array.isArray(response.data.records)) {
        setRecords(response.data.records.length > 0 ? response.data.records : []);
        if (response.data.records.length === 0) setError('No records found.');
      } else {
        throw new Error('Invalid response format from server.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching records.';
      setError(errorMessage);
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (query.trim()) fetchRecords(query);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [query, fetchRecords]);

  const handleViewData = async (propertyId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/property/${propertyId}`);
      navigate('/property-details', { state: { propertyData: response.data } });
    } catch (err) {
      toast.error('Failed to fetch property data.', { position: 'top-right', autoClose: 3000 });
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Property Search</h2>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by APN, address, pincode, or query"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => fetchRecords(query)}
            disabled={loading || !query.trim()}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">APN</th>
                <th className="border px-4 py-2">Pincode</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record, index) => (
                  <tr key={record.property_id} className="border hover:bg-gray-100 transition">
                    <td className="border px-4 py-2 text-center">{indexOfFirstRecord + index + 1}</td>
                    <td className="border px-4 py-2">{record.address}</td>
                    <td className="border px-4 py-2 text-center">{record.apn}</td>
                    <td className="border px-4 py-2 text-center">{record.pincode}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleViewData(record.property_id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg ml-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndRecords;