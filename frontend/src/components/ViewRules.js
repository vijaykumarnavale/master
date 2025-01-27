import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faEye, faFile } from '@fortawesome/free-solid-svg-icons'; // Import the eye and file icons
import './ViewRules.css';

const ViewRules = () => {
  const [files, setFiles] = useState([]);

  // Load API base URL from environment variables
  const apiBaseUrl = process.env.REACT_APP_NODE_API_URL;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/files`);
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [apiBaseUrl]);

  // Function to open file in a new tab
  const handleViewFile = (filePath) => {
    window.open(`${apiBaseUrl}${filePath}`, '_blank');
  };

  return (
    <div>
      <h2>Rules and Regulations</h2>
      <table>
        <thead>
          <tr>
            <th>File ID</th>
            <th>Filename</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.id}</td> {/* Displaying the file ID */}
              <td>
                <FontAwesomeIcon icon={faFile} style={{ marginRight: '8px' }} />
                {file.filename}
              </td>
              <td>
                <button onClick={() => handleViewFile(file.file_path)} className="view-button">
                  {/* Add eye icon to the button */}
                  <FontAwesomeIcon icon={faEye} style={{ marginRight: '8px' }} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRules;
