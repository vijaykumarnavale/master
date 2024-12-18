import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
              <td>{file.filename}</td>
              <td>
                {/* Make the file path URL clickable */}
                <a href={`http://localhost:5000${file.file_path}`} target="_blank" rel="noopener noreferrer">
                  {`http://localhost:5000${file.file_path}`}
                </a>
              </td>
              <td>
                <button onClick={() => handleViewFile(file.file_path)}>View</button> {/* View as a button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRules;
