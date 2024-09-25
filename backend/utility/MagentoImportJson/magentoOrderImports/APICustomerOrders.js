const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to get current date in YYYY-MM-DD format
const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Define the date variables
const startDate = getFormattedDate();
const endDate = startDate; // As per your request, endDate is the same as startDate

// Magento API endpoint
const url = `https://upgrade.achadirect.com/rest/V1/orders?searchCriteria[pageSize]=20&searchCriteria[currentPage]=1&searchCriteria[filter_groups][0][filters][4][field]=created_at&searchCriteria[filter_groups][0][filters][4][value]=${startDate}&searchCriteria[filter_groups][0][filters][4][condition_type]=gt&searchCriteria[filter_groups][1][filters][5][field]=created_at&searchCriteria[filter_groups][1][filters][5][value]=${endDate}&searchCriteria[filter_groups][1][filters][5][condition_type]=lt`;

// Output directory for fetched orders
const outputDir = path.join(__dirname, '../fetchedOrders');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Fetch Magento orders
const fetchMagentoOrders = async () => {
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Replace with your actual access token
            }
        });
        
        const orders = response.data;
        
        // Define the output file path
        const outputFilePath = path.join(outputDir, `orders_${startDate}.json`);
        
        // Write the orders to a file
        fs.writeFileSync(outputFilePath, JSON.stringify(orders, null, 2), 'utf-8');
        
        console.log(`Orders successfully fetched and saved to ${outputFilePath}`);
        
        // Step 2: Sub-Step 2.1 - Replace { and } with [ and ]
        correctJsonFormat(outputFilePath);
        
    } catch (error) {
        console.error('Error fetching orders:', error.message);
    }
};

// Sub-Step 2.1: Ensure the JSON file format is corrected (replace { } with [ ])
const correctJsonFormat = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Could not read file:", err);
            return;
        }
        
        // Replace first '{' with '[' and last '}' with ']'
        const correctedData = data.replace(/^{/, '[').replace(/}$/, ']');
        
        // Write the corrected data back to the file
        fs.writeFile(filePath, correctedData, 'utf8', (err) => {
            if (err) {
                console.error("Error writing corrected file:", err);
            } else {
                console.log(`Corrected JSON format written to ${filePath}`);
                
                // Proceed to Step 2.2: Flatten the JSON file
                flattenJsonFile(filePath);
            }
        });
    });
};

// Sub-Step 2.2: Flatten the JSON file by extracting the 'items' array
const flattenJsonFile = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Could not read file:", err);
            return;
        }

        try {
            // Parse the corrected JSON data
            const jsonData = JSON.parse(data);
            
            // Extract the 'items' array
            const orders = jsonData[0].items;

            // Define the new output file path for flattened orders
            const flattenedFilePath = path.join(outputDir, `flattened_orders_${startDate}.json`);

            // Write the flattened orders to a new file
            fs.writeFile(flattenedFilePath, JSON.stringify(orders, null, 2), (err) => {
                if (err) {
                    console.error("Error writing flattened file:", err);
                } else {
                    console.log(`Flattened orders written to ${flattenedFilePath}`);
                }
            });
        } catch (parseError) {
            console.error("Error parsing JSON data:", parseError);
        }
    });
};

// Run the fetch operation
fetchMagentoOrders();
