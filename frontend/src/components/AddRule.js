import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEye,
  faCloudUploadAlt,
  faUpload,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";

const FileUploadAndDisplay = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;
  const apiBaseUrl = process.env.REACT_APP_NODE_API_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const isDuplicate = files.some((f) => f.filename === selectedFile.name);
    if (isDuplicate) {
      toast.warning("A file with the same name already exists.");
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.warning("Please select a file to upload.");
      return;
    }

    const isDuplicate = files.some((f) => f.filename === file.name);
    if (isDuplicate) {
      toast.error("A file with the same name already exists. Please rename your file.");
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
      setFilteredFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }, [apiBaseUrl]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/files/${id}`);
      const updatedFiles = files.filter((file) => file.id !== id);
      setFiles(updatedFiles);
      setFilteredFiles(updatedFiles);
      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting the file. Please try again.");
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredFiles(files);
      return;
    }
    const filtered = files.filter((f) =>
      f.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFiles(filtered);
    setCurrentPage(1);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const selected = acceptedFiles[0];
      if (!selected) return;

      const isDuplicate = files.some((f) => f.filename === selected.name);
      if (isDuplicate) {
        toast.warning("A file with the same name already exists.");
      }

      setFile(selected);
      setFileName(selected.name);
    },
    accept: ".jpg,.png,.pdf,.docx",
  });

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">File Upload Manager</h2>

      <div
        {...getRootProps()}
        className="border-2 border-dashed p-6 text-center cursor-pointer rounded-md bg-blue-50 hover:bg-blue-100"
      >
        <input {...getInputProps()} onChange={handleFileChange} />
        <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" className="text-blue-500" />
        <p className="mt-2 text-gray-700">
          {file ? `Selected File: ${fileName}` : "Click or drag a file to upload"}
        </p>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FontAwesomeIcon icon={faUpload} className="mr-2" /> Upload
        </button>
      </div>

     
      {/* Search Field */}
      <hr className="my-6 border-t-2 border-gray-300" />
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6 text-center">
      <input
          type="text"
          placeholder="Search by filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
      <hr className="my-6 border-t-2 border-gray-300" />

      <h3 className="text-lg font-semibold mt-6 text-gray-800">Uploaded Files</h3>
      <div className="overflow-x-auto">
        <table className="w-full mt-4 border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3">#</th>
              <th className="p-3">Filename</th>
              <th className="p-3">View</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentFiles.map((file, index) => (
              <tr key={file.id} className="border-t hover:bg-gray-100">
                <td className="p-3 text-center">{indexOfFirstFile + index + 1}</td>
                <td className="p-3 text-center text-gray-700">{file.filename}</td>
                <td className="p-3 text-center">
                  <a
                    href={`${apiBaseUrl}${file.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </a>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Next <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default FileUploadAndDisplay;
