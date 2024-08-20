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
      return res.status(409).json({ message: 'Backend return: File already exists', fileExists: true, errNo: 409});
    }

    // Move the file from temp location to desired location
    fs.renameSync(file.path, filePath);
    fs.chmodSync(filePath, 0o666); //chmod 666
    console.log('File moved to:', filePath)

    // Call the CSV processing function
    await parseAndProcessCSV(filePath);

    res.status(200).json({ message: 'File uploaded and processed successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error });
  }
};

const handleFileUpdate = async (req, res) => {
  const file = req.file;
  const uploadDir = path.join(__dirname, '../uploads2');
  const filePath = path.join(uploadDir, file.originalname);

  try {
    // No need to check if the file exists since this is specifically for overwriting
    console.log(`Overwriting file: ${filePath}`);

    // Move the file from temp location to desired location, overwriting the existing file
    fs.renameSync(file.path, filePath);

    // Process the CSV file as required
    //await parseAndProcessCSV(filePath);

    res.status(200).json({ message: 'File overwritten and processed successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error });
  }
};

module.exports = {
  handleFileUpload,
  handleFileUpdate
};