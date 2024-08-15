// fileUpdateRoute.js
const express = require('express');
const { handleFileUpload } = require('../controllers/fileUpdateController');

const router = express.Router();

router.post('/uploads', async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No backend file was passed' });
    }

    const result = await handleFileUpload(file.path);

    res.status(200).json({ message: result.message, statusFile: result.statusFile });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'File processing failed', error: error.message });
  }
});

module.exports = router;
