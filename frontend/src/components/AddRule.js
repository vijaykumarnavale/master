import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faCloudUploadAlt, faUpload } from '@fortawesome/free-solid-svg-icons';  // Import faUpload icon
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for Toastify
import { useDropzone } from 'react-dropzone';  // Import useDropzone for drag and drop
import "./FileUploadAndDisplay.css";

const FileUploadAndDisplay = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]); // To track upload progress
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // State to track the file name

  // Load API base URL from environment variables
  const apiBaseUrl = process.env.REACT_APP_NODE_API_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : ""); // Set the file name
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const fileData = {
      name: file.name,
      progress: 0,
      status: "uploading",
    };

    setUploadStatus([...uploadStatus, fileData]);

    try {
      await axios.post(`${apiBaseUrl}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          updateProgress(file.name, percentCompleted);
        },
      });
      updateStatus(file.name, "success");
      fetchFiles();
      toast.success("File uploaded successfully!");  // Show success toast
      setFileName(""); // Clear the file name after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      updateStatus(file.name, "error");
      toast.error("Upload failed! Try again.");  // Show error toast
    }
  };

  const updateProgress = (fileName, progress) => {
    setUploadStatus((prev) =>
      prev.map((file) =>
        file.name === fileName ? { ...file, progress } : file
      )
    );
  };

  const updateStatus = (fileName, status) => {
    setUploadStatus((prev) =>
      prev.map((file) =>
        file.name === fileName ? { ...file, status, progress: 100 } : file
      )
    );
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/files/${id}`);
      setFiles(files.filter((file) => file.id !== id));
      toast.success("File deleted successfully!");  // Show success toast
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting the file. Please try again.");  // Show error toast
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setFileName(acceptedFiles[0].name);
    },
    accept: '.jpg,.png,.pdf,.docx', // You can specify accepted file types
  });

  useEffect(() => {
    fetchFiles();
  });

  return (
    <div className="container">
      <h2>Rules and Regulations</h2>

      {/* File Upload Box */}
      <div className="upload-box" {...getRootProps()}>
        <input {...getInputProps()} onChange={handleFileChange} />
        <div className="upload-box-content">
          <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" />
          <p className={`upload-message ${file && uploadStatus.some(status => status.name === file.name && status.status === "success") ? 'success-file' : ''}`}>
            {file ? `Selected File: ${fileName}` : "Click or drag a file to upload"}
          </p>
        </div>
      </div>

      {/* Upload Button Outside the Upload Box */}
      <div className="upload-btn-container">
        <button type="button" onClick={handleSubmit} className="upload-btn">
          <FontAwesomeIcon icon={faUpload} /> Upload  {/* Added upload icon here */}
        </button>
      </div>

      {/* Upload Status */}
      {uploadStatus.map((file, index) => (
        <div key={index} className="upload-status">
          <div className="file-info">
            <span>{file.name}</span>
          </div>
          <div
            className={`progress-bar ${file.status === "success"
                ? "success"
                : file.status === "error"
                ? "error"
                : "uploading"}`}
            style={{ width: `40%` }}
          ></div>
          <span className="progress-text">
            {file.status === "uploading"
              ? `${file.progress}%`
              : file.status === "success"
              ? "File Upload Successful!"
              : "File Upload Failed! Try Again"}
          </span>
        </div>
      ))}

      {/* Uploaded Files Table */}
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

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default FileUploadAndDisplay;
