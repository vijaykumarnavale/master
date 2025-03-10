import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye, faCloudUploadAlt, faUpload } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";

const FileUploadAndDisplay = () => {
  const [files, setFiles] = useState([]);
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

    try {
      await axios.post(`${apiBaseUrl}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully!");
      setFile(null);
      setFileName("");
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Upload failed! Try again.");
    }
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
    accept: ".jpg,.png,.pdf,.docx",
  });

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">File Upload Manager</h2>

      <div {...getRootProps()} className="border-2 border-dashed p-6 text-center cursor-pointer rounded-md bg-blue-50 hover:bg-blue-100">
        <input {...getInputProps()} onChange={handleFileChange} />
        <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" className="text-blue-500" />
        <p className="mt-2 text-gray-700">{file ? `Selected File: ${fileName}` : "Click or drag a file to upload"}</p>
      </div>

      <div className="text-center mt-4">
        <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          <FontAwesomeIcon icon={faUpload} className="mr-2" /> Upload
        </button>
      </div>

      <h3 className="text-lg font-semibold mt-6 text-gray-800">Uploaded Files</h3>
      <div className="overflow-x-auto">
        <table className="w-full mt-4 border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3">File ID</th>
              <th className="p-3">Filename</th>
              <th className="p-3">View</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="border-t hover:bg-gray-100">
                <td className="p-3 text-center">{file.id}</td>
                <td className="p-3 text-center text-gray-700">{file.filename}</td>
                <td className="p-3 text-center">
                  <a href={`${apiBaseUrl}${file.file_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    <FontAwesomeIcon icon={faEye} />
                  </a>
                </td>
                <td className="p-3 text-center">
                  <button onClick={() => handleDelete(file.id)} className="text-red-500 hover:text-red-700 transition">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default FileUploadAndDisplay;
