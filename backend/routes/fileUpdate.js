const express = require('express');
const multer = require('multer');
const router = express.Router();
const { handleFileUpload,
        handleFileUpdate 
        
} = require('../controllers/fileUpdateController');
const mongoose = require('mongoose');
const Item = mongoose.model('Item');  // Make sure 'Item' is the correct model name


// Configure multer for file upload handling
const upload = multer({ dest: 'uploadstmp/' });

// Route to handle file uploads
router.post('/', upload.single('file'), handleFileUpload);

router.post('/update', upload.single('file'), handleFileUpdate);


module.exports = router;
