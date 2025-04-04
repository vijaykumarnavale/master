import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFile, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const ViewRules = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiBaseUrl = process.env.REACT_APP_NODE_API_URL;

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${apiBaseUrl}/files`);
        setFiles(response.data);
      } catch (error) {
        setError('Failed to load files. Please try again.');
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [apiBaseUrl]);

  const handleViewFile = (filePath) => {
    window.open(`${apiBaseUrl}${filePath}`, '_blank');
  };

  // Pagination Logic
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(files.length / filesPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Rules and Regulations</h2>

      {loading && <p className="text-gray-500">Loading files...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && files.length === 0 && <p className="text-gray-500">No files available.</p>}

      {!loading && files.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left border">#</th>
                  <th className="p-3 text-left border">Filename</th>
                  <th className="p-3 text-left border">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentFiles.map((file, index) => (
                  <tr key={file.id} className="border-b hover:bg-gray-100">
                    <td className="p-3">{indexOfFirstFile + index + 1}</td>
                    <td className="p-3 flex items-center">
                      <FontAwesomeIcon icon={faFile} className="mr-2 text-gray-500" />
                      {file.filename}
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => handleViewFile(file.file_path)} 
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Prev
            </button>
            <span className="text-gray-700 font-semibold">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages || totalPages === 0} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 transition"
            >
              Next <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewRules;
