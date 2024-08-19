const fs = require('fs');
const path = require('path');
const { parseAndProcessCSV } = require('../utility/csvProcessor');

const handleFileUpload = async (req, res) => {
  const file = req.file;
  const uploadDir = path.join(__dirname, '../uploadsCSV');
  const filePath = path.join(uploadDir, file.originalname);

  try {
    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      console.log('Backend console: This File already exists:', filePath);
      return res.status(409).json({ message: 'Backend return: File already exists', fileExists: true });
    }

    // Move the file from temp location to desired location
    fs.renameSync(file.path, filePath);
    console.log('File moved to:', filePath)

    // Call the CSV processing function
    await parseAndProcessCSV(filePath);

    res.status(200).json({ message: 'File uploaded and processed successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error });
  }
};

module.exports = {
  handleFileUpload,
};