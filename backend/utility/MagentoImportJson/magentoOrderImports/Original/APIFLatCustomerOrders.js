///home/howardt/MernStart/acha-direct/backend/utility/MagentoImportJson/magentoOrderImports/cronApiCustomerOrders.js
// Orders are imported by system API to Magento using: (below is should be one line without spaces in between)
// https://upgrade.achadirect.com/rest/V1/orders?searchCriteria[pageSize]
//     =20&searchCriteria[currentPage]=1&searchCriteria[filter_groups][0][filters][4][field]
//     =created_at&searchCriteria[filter_groups][0][filters][4][value]
//     =2024-08-25&searchCriteria[filter_groups][0][filters][4][condition_type]
//     =gt&searchCriteria[filter_groups][1][filters][5][field]
//     =created_at&searchCriteria[filter_groups][1][filters][5][value]
//     =2024-08-30&searchCriteria[filter_groups][1][filters][5][condition_type]=lt

//Step 1.a Import Orders (This script)
//Step 1.b curate Import Orders
//Step 2. Flatten imported orders
//Step 3. Upload Orders to customerOrders collection

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Replace with your Magento API URL
const magentoUrl = 'https://upgrade.achadirect.com/rest/V1/orders';

// Replace with your Magento access token (bearer token)
const accessToken = 'l422p6smzd3kpqvdv20vvloq5zcjq8a1';

// Directory where the output will be saved
const outputDirectory = '../downloads/CustomerOrders/';

// Function to get current date in YYYY-MM-DD format
const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Fetch orders from Magento
const fetchMagentoOrders = async () => {
    try {
        // Define the headers including Authorization
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': 'PHPSESSID=kf6q6h7p59pqg7adqegpoh0f5n; visid_incap_56271=Oio1RnllT5+pxAwDjGNiWovrhGYAAAAAQUIPAAAAAACGTi3gguM3tSoObOOOvv9z; PHPSESSID=kf6q6h7p59pqg7adqegpoh0f5n; PHPSESSID=kf6q6h7p59pqg7adqegpoh0f5n'
        };

        // Define the query parameters (optional, depending on your endpoint)
        const params = {
            'searchCriteria[pageSize]': 20,
            'searchCriteria[currentPage]': 1,
            'searchCriteria[filter_groups][0][filters][4][field]': 'created_at',
            'searchCriteria[filter_groups][0][filters][4][value]': '2024-07-01',
            'searchCriteria[filter_groups][0][filters][4][condition_type]': 'gt',
            'searchCriteria[filter_groups][1][filters][5][field]': 'created_at',
            'searchCriteria[filter_groups][1][filters][5][value]': '2024-09-30',
            'searchCriteria[filter_groups][1][filters][5][condition_type]': 'lt'
        };

        // Make the GET request to the Magento API
        const response = await axios.get(magentoUrl, {
            headers: headers,
            params: params // Pass the query parameters
        });

        // Get the JSON data from the response
        const jsonData = response.data;

        // Ensure the output directory exists
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true });
        }

        // Get today's date in YYYY-MM-DD format
        const today = getFormattedDate();

        const outputFilePath = path.join(outputDirectory, `customerOrders_${today}.json`);


        // Write the JSON data to a file
        fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');

        console.log('Magento Orders:', response.data);

        const outputFlatFile = path.join(outputFilePath, `flatCustomerOrders_${today}.json`);

        //-------Flatten Files 
        fs.readFile(outputFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Could not read file:", err);
                return;
            }

            // Parse the JSON file
            const jsonData = JSON.parse(data);
            
            // Extract the items array
            const orders = jsonData[0].items;

            // Write the individual orders to a new JSON file
            fs.writeFile(outputFlatFile, JSON.stringify(orders, null, 2), (err) => {
                if (err) {
                    console.error("Error writing file:", err);
                }
            });   
        });
        console.log('Magento orders have been saved to:', outputFlatFile);
    
    } catch (error) {
            console.error('Error fetching Magento orders:', error.response ? error.response.data : error.message);
    }
};

// Run the fetch function
fetchMagentoOrders();
