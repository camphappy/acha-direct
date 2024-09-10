const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Function to read existing JSON data
const readExistingData = (outputFile) => {
    if (fs.existsSync(outputFile)) {
        const fileData = fs.readFileSync(outputFile, 'utf8');
        return JSON.parse(fileData);
    }
    return [];
};

// Function to process each Excel file
const processExcelFile = (filePath, existingData) => {
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

        if (!masterCode || !shortDescription) {
            break;
        }

        // Debugging log to show the value of masterCode
        console.log(`Processing    Excel masterCode: ${masterCode.trim().toLowerCase()}`);
        console.log(`Comparing with JSON file masterCode: ${masterCode.trim().toLowerCase()}`);

         // Search in existingData for a match
        let lmasterCode = masterCode.trim().toLowerCase();
        const exists = existingData.some(item => {
            // Normalize the existing masterCode before comparison
            const existingMasterCode = item.masterCode.trim().toLowerCase();
            return existingMasterCode === lmasterCode;
        });

        if (!exists) {
            console.log(`Adding new masterCode: ${masterCode}`);
            data.push({ masterCode, shortDescription });
        } else {
            console.log(`masterCode already exists: ${masterCode}`);
}

        row++;
    }

    return data;
};

// Main function to process files and create JSON
const createItemDescriptionJson = (sourceDir, outputFile) => {
    const files = fs.readdirSync(sourceDir).filter(file => path.extname(file) === '.xlsx');
    const existingData = readExistingData(outputFile);
    const allData = [...existingData];

    files.forEach(file => {
        const filePath = path.join(sourceDir, file);
        const fileData = processExcelFile(filePath, existingData);
        allData.push(...fileData);
    });

    fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2), 'utf8');
    console.log(`Data successfully written to ${outputFile}`);
};

const sourceDir = path.join(__dirname, '../uploadsXLSX');  // path to Excel files
const outputFile = path.join(__dirname, '../utilityOutput/jisooShortDescription.json');  // Path to your source file
createItemDescriptionJson(sourceDir, outputFile);
