import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FileUploadAndDisplay.css";

const FileUploadAndDisplay = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]); // To track upload progress
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // State to track the file name

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
      await axios.post("http://localhost:5000/upload", formData, {
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
      setFileName(""); // Clear the file name after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      updateStatus(file.name, "error");
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
      const response = await axios.get("http://localhost:5000/files");
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/files/${id}`);
      setFiles(files.filter((file) => file.id !== id));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="container">
      <h2>Rules and Regulations</h2>

      {/* File Upload Box */}
      <form onSubmit={handleSubmit} className="upload-box">
        <label htmlFor="file-input" className="upload-label">
          Click here or drag and drop a file to upload
        </label>
        <input id="file-input" type="file" onChange={handleFileChange} />
        {fileName && <p className="file-selected">Selected File: {fileName}</p>}
        <button type="submit" className="upload-btn">
          Upload
        </button>
      </form>

      {/* Upload Status */}
      {uploadStatus.map((file, index) => (
        <div key={index} className="upload-status">
          <div className="file-info">
            <span>{file.name}</span>
          </div>
          <div
            className={`progress-bar ${
              file.status === "success" ? "success" : file.status === "error" ? "error" : "uploading"
            }`}
            style={{ width: `${file.progress}%` }}
          ></div>
          <span className="progress-text">
            {file.status === "uploading"
              ? `${file.progress}%`
              : file.status === "success"
              ? "Upload Successful!"
              : "Upload Failed! Try Again"}
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
                  href={`http://localhost:5000${file.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </td>
              <td>
                <button onClick={() => handleDelete(file.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileUploadAndDisplay;
