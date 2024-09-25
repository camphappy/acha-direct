///home/howardt/MernStart/acha-direct/backend/utility/MagentoImportJson/magentoOrderImports/cronApiCustomerOrders.js
// Orders are imported by system API to Magento using: (below is should be one line without spaces in between)
// https://upgrade.achadirect.com/rest/V1/orders?searchCriteria[pageSize]
//     =20&searchCriteria[currentPage]=1&searchCriteria[filter_groups][0][filters][4][field]
//     =created_at&searchCriteria[filter_groups][0][filters][4][value]
//     =2024-08-25&searchCriteria[filter_groups][0][filters][4][condition_type]
//     =gt&searchCriteria[filter_groups][1][filters][5][field]
//     =created_at&searchCriteria[filter_groups][1][filters][5][value]
//     =2024-08-30&searchCriteria[filter_groups][1][filters][5][condition_type]=lt

//Step 1. Import Orders (This script)
//Step 2. Flatten imported orders
//Step 3. Upload Orders to customerOrders collection

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
    } catch (error) {
        console.error('Error fetching orders:', error.message);
    }
};

// Run the fetch operation
fetchMagentoOrders();
