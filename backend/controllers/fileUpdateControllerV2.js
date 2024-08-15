// updateItemProcessor.js
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const mongoose = require('mongoose');
const Item = require('../models/itemModel'); // Adjust the path as necessary

const updateItemProcessor = async (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse the CSV data using PapaParse
    const parsedData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true
    });

    const items = parsedData.data;
    const results = [];

    for (const csvItem of items) {
      const { sku, ...fieldsToUpdate } = csvItem;

      // Find item by SKU
      const item = await Item.findOne({ 'attributes.sku': sku });

      if (item) {
        // Update the item with the fields from the CSV
        Object.assign(item.attributes, fieldsToUpdate);
        await item.save();
        results.push({ sku, status: 'updated' });
      } else {
        // SKU not found, return not updated status
        results.push({ sku, status: 'Not updated. SKU not found' });
      }
    }

    // Save results to a JSON file in the uploads/status folder
    const statusFileName = `status-${path.basename(filePath, path.extname(filePath))}.json`;
    const statusFilePath = path.join(__dirname, 'uploads', 'status', statusFileName);
    fs.writeFileSync(statusFilePath, JSON.stringify(results, null, 2));

    console.log(`Update complete. Status file saved to ${statusFilePath}`);
    return { message: 'Update complete', statusFile: statusFileName };

  } catch (error) {
    console.error('Error processing update:', error);
    throw error;
  }
};

module.exports = updateItemProcessor;
