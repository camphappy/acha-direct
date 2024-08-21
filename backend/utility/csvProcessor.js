const fs = require('fs');
const Papa = require('papaparse');

const parseAndProcessCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Processing CSV file at: ${filePath}`);

      // Read the file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      console.log('File content:', fileContent);

      // Parse the file content
      Papa.parse(fileContent, {
        header: true, // Treat the first row as headers
        dynamicTyping: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error); // Reject the promise on error
        }
      });
    } catch (error) {
      console.error('Error processing file:', error);
      reject(error); // Reject the promise if an error occurs
    }
  });
};

module.exports = { parseAndProcessCSV };