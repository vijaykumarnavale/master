import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // Import FontAwesomeIcon
import { faEye, faFile, faLink } from '@fortawesome/free-solid-svg-icons';  // Import the eye, file, and link icons
import './ViewRules.css';

const ViewRules = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/files');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  // Function to open file in a new tab
  const handleViewFile = (filePath) => {
    window.open(`http://localhost:5000${filePath}`, '_blank');
  };

  return (
    <div>
      <h2>Rules and Regulations</h2>
      <table>
        <thead>
          <tr>
            <th>File ID</th>
            <th>Filename</th>
            <th>File Path</th>
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
                <a href={`http://localhost:5000${file.file_path}`} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faLink} style={{ marginRight: '8px' }} />
                  {`http://localhost:5000${file.file_path}`}
                </a>
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
