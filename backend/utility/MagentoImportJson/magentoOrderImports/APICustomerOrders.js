const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Directory where the output will be saved
const outputDirectory = '../downloads/CustomerOrders/';

// Function to get current date in YYYY-MM-DD format
const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Function to fetch the last downloaded date
const getLastDownloadedDate = () => {
    if (fs.existsSync(lastDownloadedFile)) {
        const data = fs.readFileSync(lastDownloadedFile, 'utf-8');
        return JSON.parse(data).lastDownloadedDate;
    }
    // If no previous download, default to an old date
    return '2024-01-01T00:00:00'; // Adjust this as necessary
};

// Function to save the latest downloaded date
const saveLastDownloadedDate = (latestDate) => {
    const data = { lastDownloadedDate: latestDate };
    fs.writeFileSync(lastDownloadedFile, JSON.stringify(data, null, 2), 'utf-8');
};

// Function to flatten JSON data by extracting the "items" field and removing unwanted fields
const flattenAndCleanData = (data) => {
    // Extract the "items" field
    const items = data.items;

    // Return the flattened "items" array, excluding "search_criteria" and "total_count"
    return items;
};

// Function to fetch orders and save the cleaned response to a file
const fetchMagentoOrders = async () => {
    try {
        const accessToken = 'l422p6smzd3kpqvdv20vvloq5zcjq8a1';
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': 'PHPSESSID=kf6q6h7p59pqg7adqegpoh0f5n; visid_incap_56271=Oio1RnllT5+pxAwDjGNiWovrhGYAAAAAQUIPAAAAAACGTi3gguM3tSoObOOOvv9z; PHPSESSID=kf6q6h7p59pqg7adqegpoh0f5n; PHPSESSID=kf6q6h7p59pqg7adqegpoh0f5n'
        };
        
        // Use the last downloaded date in the search criteria
        const lastDownloadedDate = getLastDownloadedDate();

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

        const response = await axios.get('https://upgrade.achadirect.com/rest/V1/orders', {
            headers: headers,
            params: params
        });

        // Flatten and clean the JSON data
        const cleanedData = flattenAndCleanData(response.data);

        // Ensure the output directory exists
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true });
        }

        const today = getFormattedDate();
        const outputFilePath = path.join(outputDirectory, `customerOrders_${today}.json`);

        // Write the cleaned JSON data to a file with square brackets
        fs.writeFileSync(outputFilePath, JSON.stringify(cleanedData, null, 2), 'utf-8');

        console.log('Magento orders have been saved to:', outputFilePath);

        // Extract the latest 'created_at' date from the fetched orders
        if (cleanedData && cleanedData.length > 0) {
            const latestOrder = cleanedData[0]; // Assuming the API returns orders sorted by 'created_at'
            const latestDate = latestOrder.created_at;
            saveLastDownloadedDate(latestDate); // Save the latest 'created_at' for future downloads
        }
    } catch (error) {
        console.error('Error fetching or saving Magento orders:', error.response ? error.response.data : error.message);
    }
};

// Run the fetch and save function
fetchMagentoOrders();
