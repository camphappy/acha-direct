const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Directory where the output will be saved
const outputDirectory = '../downloads/CustomerOrders';

// Function to get current date and time in YYYY-MM-DD_HH-MM-SS format
const getFormattedDateTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

// Function to get current date in YYYY-MM-DD format (for log filename)
const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Function to save the raw and flattened filenames into the log file
const saveDownloadLog = (rawFilename, flattenedFilename) => {
    const logFilename = path.join(outputDirectory, `downloadLog_${getFormattedDate()}.json`);
    let logData = {};

    // If the log file exists, read the existing content
    if (fs.existsSync(logFilename)) {
        logData = JSON.parse(fs.readFileSync(logFilename, 'utf-8'));
    }

    // Append the new raw and flattened filenames to the log data
    logData[rawFilename] = flattenedFilename;

    // Write back the updated log data to the log file
    fs.writeFileSync(logFilename, JSON.stringify(logData, null, 2), 'utf-8');
};

// Function to fetch and process Magento orders, and flatten the resulting JSON
const fetchMagentoOrders = async () => {
    try {
        const accessToken = 'l422p6smzd3kpqvdv20vvloq5zcjq8a1';
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const params = {
            'searchCriteria[pageSize]': 20,
            'searchCriteria[currentPage]': 1,
            'searchCriteria[filter_groups][0][filters][4][field]': 'created_at',
            'searchCriteria[filter_groups][0][filters][4][value]': '2024-07-01 06:00:00',
            'searchCriteria[filter_groups][0][filters][4][condition_type]': 'gt',
            'searchCriteria[filter_groups][1][filters][5][field]': 'created_at',
            'searchCriteria[filter_groups][1][filters][5][value]': '2024-07-01 10:00:00',
            'searchCriteria[filter_groups][1][filters][5][condition_type]': 'lt'
        }

        const response = await axios.get('https://upgrade.achadirect.com/rest/V1/orders', {
            headers: headers,
            params: params
        });
        
        // Create a filename for the raw data file with date and time
        const rawFilename = `customerOrders_${getFormattedDateTime()}.json`;
        const rawFilePath = path.join(outputDirectory, rawFilename);
        
        // Save the raw Magento orders
        fs.writeFileSync(rawFilePath, JSON.stringify(response.data, null, 2), 'utf-8');
        console.log('Raw Magento orders saved to:', rawFilePath);

        // Process the raw data
        fs.readFile(rawFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Could not read file:", err);
                return;
            }

            // Parse the JSON file
            const jsonData = JSON.parse(data);

            // Extract the items array from the first index
            const orders = jsonData.items;  // Assuming `items` is at the root

            // Create a filename for the flattened orders file with date and time
            const flattenedFilename = `flattenedOrders_${getFormattedDateTime()}.json`;
            const flattenedFilePath = path.join(outputDirectory, flattenedFilename);
            
            // Write the individual orders (flattened) to a new JSON file
            fs.writeFile(flattenedFilePath, JSON.stringify(orders, null, 2), (err) => {
                if (err) {
                    console.error("Error writing flattened orders file:", err);
                } else {
                    console.log("Flattened orders written to:", flattenedFilePath);

                    // Save the raw and flattened filenames to the download log
                    saveDownloadLog(rawFilename, flattenedFilename);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching or saving Magento orders:', error.response ? error.response.data : error.message);
    }
};

// Run the fetch and save function
fetchMagentoOrders();
