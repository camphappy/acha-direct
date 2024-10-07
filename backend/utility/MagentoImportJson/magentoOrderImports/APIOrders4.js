const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Directory where the output will be saved
const outputDirectory = '../downloads/CustomerOrders';
const lastDownloadedFile = path.join(outputDirectory, 'lastDownloadedDate.json');

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

// Function to fetch and process Magento orders, and flatten the resulting JSON
const fetchMagentoOrders = async () => {
    try {
        const accessToken = 'l422p6smzd3kpqvdv20vvloq5zcjq8a1';

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Use the last downloaded date in the search criteria
        const lastDownloadedDate = getLastDownloadedDate();

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

        // Save the fetched data to a temporary file (new4.json) for further processing
        const rawFilePath = path.join(outputDirectory, 'newCustomerOrders.json');
        fs.writeFileSync(rawFilePath, JSON.stringify(response.data, null, 2), 'utf-8');
        console.log('Raw Magento orders saved to:', rawFilePath);

        // Read the temporary file (new4.json), flatten it, and save the cleaned data
        fs.readFile(rawFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Could not read file:", err);
                return;
            }

            // Parse the JSON file
            const jsonData = JSON.parse(data);

            // Extract the items array from the first index
            const orders = jsonData.items;  // Assuming `items` is at the root

            // Write the individual orders (flattened) to a new JSON file
            const flattenedFilePath = path.join(outputDirectory, `flattened_orders_${getFormattedDate()}.json`);
            fs.writeFile(flattenedFilePath, JSON.stringify(orders, null, 2), (err) => {
                if (err) {
                    console.error("Error writing flattened orders file:", err);
                } else {
                    console.log("Flattened orders written to:", flattenedFilePath);
                }
            });

            // Update the last downloaded date
            if (orders && orders.length > 0) {
                const latestOrder = orders[0]; // Assuming orders are sorted by 'created_at'
                const latestDate = latestOrder.created_at;
                saveLastDownloadedDate(latestDate);
            }
        });
    } catch (error) {
        console.error('Error fetching or saving Magento orders:', error.response ? error.response.data : error.message);
    }
};

// Run the fetch and save function
fetchMagentoOrders();
