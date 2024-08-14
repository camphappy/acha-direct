const express = require('express');
const multer = require('multer');
const router = express.Router();
const { handleFileUpload } = require('../controllers/fileUpdateController');

// Configure multer for file upload handling
const upload = multer({ dest: 'uploads/' });

// Route to handle file uploads
router.post('/', upload.single('file'), handleFileUpload);

module.exports = router;
