const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Function to read existing JSON data (output file)
const readExistingData = (outputFile) => {
    if (fs.existsSync(outputFile)) {
        const fileData = fs.readFileSync(outputFile, 'utf8');
        return JSON.parse(fileData);
    }
    return [];
};

// Function to check if masterCodeRead.json exists
const checkMasterCodeReadExists = (masterCodeReadFile) => {
    return fs.existsSync(masterCodeReadFile);
};

// Function to read masterCodeRead from masterCodeRead.json if it exists
const readMasterCodeRead = (masterCodeReadFile) => {
    if (fs.existsSync(masterCodeReadFile)) {
        const fileData = fs.readFileSync(masterCodeReadFile, 'utf8');
        return JSON.parse(fileData);
    }
    return [];
};

// Function to process each Excel file
const processExcelFile = (filePath, existingData, masterCodeRead) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = 'Invoice';
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
        console.log(`Sheet ${sheetName} not found in ${filePath}`);
        return [];
    }

    const startRow = 22;
    const data = [];
    let row = startRow;

    while (true) {
        let masterCode = sheet[`C${row}`] ? sheet[`C${row}`].v : ''; 
        let shortDescription = sheet[`I${row}`] ? sheet[`I${row}`].v : ''; 

        // Stop when there's no more data
        if (!masterCode || !shortDescription) {
            break;
        }

        // Normalize masterCode: trim and lowercase it
        masterCode = masterCode.trim().toLowerCase();

        // Logging
        console.log(`Processing masterCode from Excel: ${masterCode}`);

        // Check if masterCode has been read already in masterCodeRead (exact match check)
        if (masterCodeRead.includes(masterCode)) {
            console.log(`Skipping duplicate masterCode (already processed): ${masterCode}`);
            row++;
            continue;
        }

        // Search in existingData for a match (exact character match)
        const exists = existingData.some(item => {
            const existingMasterCode = item.masterCode.trim().toLowerCase();
            return existingMasterCode === masterCode && existingMasterCode.length === masterCode.length;
        });

        if (!exists) {
            console.log(`Adding new masterCode: ${masterCode}`);
            data.push({ masterCode, shortDescription });

            // Add to masterCodeRead array to avoid processing it again
            masterCodeRead.push(masterCode);
        } else {
            console.log(`masterCode already exists in JSON: ${masterCode}`);
        }

        row++;
    }

    return data;
};

// Main function to process files, create/append to JSON, and delete processed files
const createItemDescriptionJson = (sourceDir, outputFile, masterCodeReadFile) => {
    // Check if masterCodeRead.json exists, set flag
    const exists = checkMasterCodeReadExists(masterCodeReadFile);
    let masterCodeRead = [];

    if (exists) {
        // Read masterCodeRead.json if it exists
        masterCodeRead = readMasterCodeRead(masterCodeReadFile);
    } else {
        console.log(`masterCodeRead.json does not exist, starting with an empty list.`);
    }

    // Read existing JSON file to avoid duplicates
    const existingData = readExistingData(outputFile);
    const allData = [...existingData];

    // Process each Excel file in the source directory
    const files = fs.readdirSync(sourceDir).filter(file => path.extname(file) === '.xlsx');
    files.forEach(file => {
        const filePath = path.join(sourceDir, file);
        const fileData = processExcelFile(filePath, existingData, masterCodeRead);
        console.log(`Processing file: ${file}`);

        if (fileData.length > 0) {
            // Append the new data to the JSON file after processing the current Excel file
            fs.appendFileSync(outputFile, JSON.stringify(fileData, null, 2), 'utf8');
            console.log(`Data appended to ${outputFile}`);

            // After processing, delete the file
            try {
                fs.unlinkSync(filePath);
                console.log(`Deleted processed file: ${file}`);
            } catch (err) {
                console.error(`Error deleting file: ${file}, ${err}`);
            }
        } else {
            console.log(`No new data found in file: ${file}`);
        }
    });

    // Only at the end, create or append to masterCodeRead.json
    fs.writeFileSync(masterCodeReadFile, JSON.stringify(masterCodeRead, null, 2), 'utf8');
    console.log(`masterCodeRead successfully created/appended to ${masterCodeReadFile}`);
};

// Paths and File Configurations
const sourceDir = path.join(__dirname, '../uploadsXLSX');  // path to Excel files
const outputFile = path.join(__dirname, '../utilityOutput/jisooShortDescription.json');  // Path to your source file
const masterCodeReadFile = './masterCodeRead.json'; // File to store the masterCodeRead array
createItemDescriptionJson(sourceDir, outputFile, masterCodeReadFile);
