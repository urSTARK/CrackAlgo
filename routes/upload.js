const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth, adminAuth } = require('../middleware/auth');
const { uploadFile, getUserUploads, getAllUploads } = require('../controllers/uploadController');
const Upload = require('../models/Upload');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads', req.user._id.toString());
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
  // Removed file type filter to accept all file types
});

router.post('/project', auth, upload.single('file'), uploadFile);
router.post('/media', auth, upload.single('file'), uploadFile);
router.get('/user', auth, getUserUploads);
router.get('/all', adminAuth, getAllUploads);

// Serve files securely
router.get('/file/:id', auth, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if user owns the file or is admin
    if (!req.user.isAdmin && upload.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.sendFile(path.resolve(upload.filePath));
  } catch (error) {
    res.status(500).json({ message: 'Error serving file' });
  }
});

// Download file
router.get('/download/:id', auth, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if user owns the file or is admin
    if (!req.user.isAdmin && upload.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.download(upload.filePath, upload.originalName);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading file' });
  }
});

module.exports = router;