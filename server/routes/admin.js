const express = require('express');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Upload company logo
router.post('/upload-logo', authMiddleware, upload.single('logo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No logo file uploaded' });
    }

    // Remove old logo if exists
    const logoPath = path.join(__dirname, '../uploads/company-logo.png');
    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }

    // Rename new logo
    const oldPath = req.file.path;
    const newPath = path.join(__dirname, '../uploads/company-logo.png');
    fs.renameSync(oldPath, newPath);

    res.json({ 
      message: 'Logo uploaded successfully',
      logoUrl: '/uploads/company-logo.png'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get company logo
router.get('/logo', (req, res) => {
  const logoPath = path.join(__dirname, '../uploads/company-logo.png');
  if (fs.existsSync(logoPath)) {
    res.json({ logoUrl: '/uploads/company-logo.png' });
  } else {
    res.json({ logoUrl: null });
  }
});

module.exports = router;
