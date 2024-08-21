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
      return res.status(409).json({ message409: `Backend: ${file.originalname} already exists. Overwrite? `, fileExists: true, responseNo: 409});
    }

    // Move the file from temp location to desired location
    fs.renameSync(file.path, filePath);
    fs.chmodSync(filePath, 0o666); //chmod 666
    console.log('File moved to:', filePath)

    //await parseAndProcessCSV(filePath)

    return res.status(200).json({ message200: 'Backend File uploaded successfully', responseNo: 200 });
  }
    catch (error) {
    console.error('Backend handleFileUpload: Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error });
  }
};

const handleFileUpdate = async (req, res) => {
  const file = req.file;
  const uploadDir = path.join(__dirname, '../uploadsCSV');
  const filePath = path.join(uploadDir, file.originalname);
  //const { parseAndProcessCSV } = require('../utils/csvProcessor');


  try {
    // No need to check if the file exists since this is specifically for overwriting
    console.log(`Backend begin process: ${filePath}`);

    // Move the file from temp location to desired location, overwriting the existing file
    //fs.renameSync(file.path, filePath);
    //fs.chmodSync(filePath, 0o666); //chmod 666

    // Process the CSV file as required
    //await parseAndProcessCSV(filePath);
    res.status(200).json({ message: 'Backend: File overwritten and processed successfully', responseNo: 200 });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error });
  }
};

module.exports = {
  handleFileUpload,
  handleFileUpdate
};