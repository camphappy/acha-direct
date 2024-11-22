//File1: Given invoice numbers
//File2: Given Names of files taken from a directory
//Invoice numbers are taken from filenames. The final outputs are filenames found  and another not found.



const fs = require('fs');
const path = require('path');

// File paths
const invoiceComparePath = path.join(__dirname, 'invoiceCompare3.txt');
const sourceDirPath = path.join(__dirname, 'sourceDir.txt');

// Read files into arrays, each line as an array element
const findStrings = fs.readFileSync(invoiceComparePath, 'utf-8').split('\n').map(line => line.trim()).filter(Boolean);
const sourceDirLines = fs.readFileSync(sourceDirPath, 'utf-8').split('\n').map(line => line.trim()).filter(Boolean);

// Initialize arrays to store results
const foundFiles = [];
const notFoundFiles = [];

// Process each line in invoiceCompare.txt
findStrings.forEach(findString => {
    let foundLine = null;
    // Search for findString in each line of sourceDir.txt
    for (const sourceLine of sourceDirLines) {
        if (sourceLine.includes(findString)) {
            isFound = true;
            foundLine = sourceLine; // Store the exact line where findString is found
            break;
        }
    }

    // Log result based on search outcome
    if (foundLine) {
        foundFiles.push(foundLine);
    } else {
        notFoundFiles.push(findString);
    }
});

// Write results to output files
fs.writeFileSync(path.join(__dirname, 'foundFiles3.txt'), foundFiles.join('\n'), 'utf-8');
fs.writeFileSync(path.join(__dirname, 'notfoundFiles3.txt'), notFoundFiles.join('\n'), 'utf-8');

console.log('Search complete. Results saved in foundFiles.txt and notfoundFiles.txt.');
