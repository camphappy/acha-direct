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

        // Define the query parameters for the request
        const params = {
            'searchCriteria[pageSize]': 20,
            'searchCriteria[currentPage]': 1,
            'searchCriteria[filter_groups][0][filters][4][field]': 'created_at',
            'searchCriteria[filter_groups][0][filters][4][value]': '2024-07-01 00:00:00',
            'searchCriteria[filter_groups][0][filters][4][condition_type]': 'gt',
            'searchCriteria[filter_groups][1][filters][5][field]': 'created_at',
            'searchCriteria[filter_groups][1][filters][5][value]': '2024-07-01 10:00:00',
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

        // Define the output file path, with today's date in the filename
        const outputFilePath = path.join(outputDirectory, `customerOrders_${today}.json`);

        // Write the JSON data to a file
        fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');

        console.log('Magento orders have been saved to:', outputFilePath);
    } catch (error) {
        console.error('Error fetching or saving Magento orders:', error.response ? error.response.data : error.message);
    }
};

// Run the fetch and save function
fetchMagentoOrders();
