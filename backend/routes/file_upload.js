const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'uploads/';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  const upload = multer({ storage: storage });
  
  // File Upload Endpoint
  router.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
  
    const filePath = '/uploads/' + file.filename;
    const filename = file.originalname;
  
    // Insert file metadata into the database
db.query('INSERT INTO uploaded_files (filename, file_path) VALUES (?, ?)', [file.originalname, filePath], (err, result) => {
      if (err) {
        console.error('Error inserting into database:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(200).json({
        message: 'File uploaded successfully!',
        file: { filename, filePath },
      });
    });
  });
  
  // Get All Uploaded Files Endpoint
  router.get('/files', (req, res) => {
    db.query('SELECT * FROM uploaded_files', (err, result) => {
      if (err) {
        console.error('Error retrieving files from database:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(200).json(result);
    });
  });
  
  // Delete File Endpoint
  router.delete('/files/:id', (req, res) => {
    const fileId = req.params.id;
  
    // Get file path from database
    db.query('SELECT * FROM uploaded_files WHERE id = ?', [fileId], (err, result) => {
      if (err) {
        console.error('Error retrieving file from database:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      const file = result[0];
      const filePath = `.${file.file_path}`;
  
      // Delete file from disk
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).json({ message: 'Error deleting file' });
        }
  
        // Delete file metadata from database
        db.query('DELETE FROM uploaded_files WHERE id = ?', [fileId], (err, result) => {
          if (err) {
            console.error('Error deleting from database:', err);
            return res.status(500).json({ message: 'Error deleting file metadata' });
          }
          res.status(200).json({ message: 'File deleted successfully' });
        });
      });
    });
  });    
module.exports = router;
