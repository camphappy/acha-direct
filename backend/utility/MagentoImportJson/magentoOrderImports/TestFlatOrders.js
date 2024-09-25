const fs = require('fs');
const path = require('path');

// Define input and output directories
const inputDir = path.join(__dirname, '../rawFetchedOrders');
const outputDir = path.join(__dirname, '../readyFetchedOrders');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to correct the JSON format and flatten the 'items' array
const processFetchedOrders = (fileName) => {
    const inputFilePath = path.join(inputDir, fileName);
    const outputFilePath = path.join(outputDir, `flattened_${fileName}`);

    // Read the raw JSON file
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Could not read file ${inputFilePath}:`, err);
            return;
        }

        // Add '[' at the beginning and ']' at the end
        const correctedData = '[' + data + ']';

        // Step 2: Parse corrected JSON and flatten the 'items' array
        try {
            const jsonData = JSON.parse(correctedData);

            // Extract the 'items' array from the first object
            const orders = jsonData[0].items;

            // Write the flattened 'items' array to the output file
            fs.writeFile(outputFilePath, JSON.stringify(orders, null, 2), (err) => {
                if (err) {
                    console.error(`Error writing flattened file ${outputFilePath}:`, err);
                } else {
                    console.log(`Flattened orders written to ${outputFilePath}`);
                }
            });
        } catch (parseError) {
            console.error("Error parsing corrected JSON data:", parseError);
        }
    });
};

// Run the process on the target file
const fileName = 'new4.json'; // Replace with your actual file name
processFetchedOrders(fileName);
