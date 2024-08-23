const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
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

    await parseAndProcessCSV(filePath)

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
  const ObjectId = mongoose.Types.ObjectId;
  const Item = mongoose.model('Item'); // Ensure this matches your model name  
  try {
    // No need to check if the file exists since this is specifically for overwriting
    console.log(`Backend begin process: ${filePath}`);
    fs.chmodSync(filePath, 0o666); // Ensure proper permissions

    const parsedData = await parseAndProcessCSV(filePath);
   
    // Iterate over the parsed data and update MongoDB
    for (const data of parsedData) {
      const { _id, ...updateFields } = data; // Extract _id and update fields

      if (!_id || !ObjectId.isValid(_id)) {
        console.log('Invalid or missing ObjectID:', _id);
        continue; // Skip invalid or missing ObjectID
      }

      // Update the item collection based on ObjectID
      const updateResult = await Item.findByIdAndUpdate(
        _id, // Match document by ObjectID
        { $set: updateFields }, // Fields to update
        { new: true, upsert: false } // Return updated doc if found, do not insert new
      );

      if (updateResult) {
        console.log(`Document with ObjectID ${_id} updated successfully`);
      } else {
        console.log(`Document with ObjectID ${_id} not found`);
      }
    }

    res.status(200).json({
      message: 'File processed and items updated successfully',
      responseNo: 200,
      data: parsedData,
    });

  } catch (error) {
    console.error('Error updating items:', error);
    res.status(500).json({ message: 'Backend: Error processing file', responseNo: 500 });
  }
};

module.exports = {
  handleFileUpload,
  handleFileUpdate
};