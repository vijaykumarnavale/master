import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faCloudUploadAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import "./FileUploadAndDisplay.css";

const FileUploadAndDisplay = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const apiBaseUrl = process.env.REACT_APP_NODE_API_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const fileData = {
      name: file.name,
      status: "uploading",
    };

    setUploadStatus((prev) => [...prev, fileData]);

    try {
      await axios.post(`${apiBaseUrl}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateStatus(file.name, "success");
      toast.success("File uploaded successfully!");
      setFile(null); // Reset file
      setFileName(""); // Reset file name
      fetchFiles(); // Fetch updated files
    } catch (error) {
      console.error("Error uploading file:", error);
      updateStatus(file.name, "error");
      toast.error("Upload failed! Try again.");
    }
  };

  const updateStatus = (fileName, status) => {
    setUploadStatus((prev) =>
      prev.map((file) =>
        file.name === fileName ? { ...file, status } : file
      )
    );
  };

  const fetchFiles = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }, [apiBaseUrl]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/files/${id}`);
      setFiles((prev) => prev.filter((file) => file.id !== id));
      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting the file. Please try again.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setFileName(acceptedFiles[0].name);
    },
    accept: '.jpg,.png,.pdf,.docx',
  });

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]); // Add fetchFiles as a dependency

  return (
    <div className="container">
      <h2>Rules and Regulations</h2>

      <div className="upload-box" {...getRootProps()}>
        <input {...getInputProps()} onChange={handleFileChange} />
        <div className="upload-box-content">
          <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" />
          <p className={`upload-message ${file && uploadStatus.some(status => status.name === file.name && status.status === "success") ? 'success-file' : ''}`}>
            {file ? `Selected File: ${fileName}` : "Click or drag a file to upload"}
          </p>
        </div>
      </div>

      <div className="upload-btn-container">
        <button type="button" onClick={handleSubmit} className="upload-btn">
          <FontAwesomeIcon icon={faUpload} /> Upload
        </button>
      </div>

      <h3>Uploaded Files</h3>
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
              <td>{file.id}</td>
              <td>{file.filename}</td>
              <td>
                <a
                  href={`${apiBaseUrl}${file.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-file-link"
                >
                  <FontAwesomeIcon icon={faEye} />
                </a>
              </td>
              <td>
                <button onClick={() => handleDelete(file.id)} className="delete-btn">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default FileUploadAndDisplay;
//up
