const Upload = require('../models/Upload');
const path = require('path');
const fs = require('fs');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const upload = await Upload.create({
      userId: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.body.fileType || 'project',
      mimeType: req.file.mimetype,
      size: req.file.size
    });

    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).json({ message: 'Upload failed' });
  }
};

const getUserUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(uploads);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch uploads' });
  }
};

const getAllUploads = async (req, res) => {
  try {
    const uploads = await Upload.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    
    res.json(uploads);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch uploads' });
  }
};

module.exports = { uploadFile, getUserUploads, getAllUploads };