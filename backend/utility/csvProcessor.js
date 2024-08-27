//Bulk Add new fields, based on _id
const fs = require('fs');
//const Papa = require('papaparse');
const csvParser = require('csv-parser');

const parseAndProcessCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    try {
      console.log(`Processing CSV file at: ${filePath}`);
      fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        results.push(row); // Collect each parsed row
      })
      .on('end', () => {
        //update data row by row

        resolve(results); // Resolve the promise with all parsed data
      })
      .on('error', (error) => {
        reject(error); // Reject the promise if an error occurs
      });
    } 
    catch (error) {
      console.error('Error processing file:', error);
      reject(error); // Reject the promise if an error occurs
    }
  });
};



module.exports = { parseAndProcessCSV };