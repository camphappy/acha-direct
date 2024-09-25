//home/howardt/MernStart/acha-direct/backend/utility/MagentoImportJson/flattenImportedOrders/flattenOrderFile.js
//immported json file from cronApiCustomerOrders need to be flattened.
//Step 1. Import Orders
//Step 2. Flatten imported orders (this script is Step 2B)
//Step 3. Upload Orders to customerOrders collection

const fs = require('fs');


// Read the original orders.json file
fs.readFile('new4.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Could not read file:", err);
        return;
    }

    // Parse the JSON file
    const jsonData = JSON.parse(data);
    
    // Extract the items array
    const orders = jsonData[0].items;

    // Write the individual orders to a new JSON file
    fs.writeFile('flattened_orders.json', JSON.stringify(orders, null, 2), (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log("Flattened orders written to flattened_orders.json");
        }
    });
});
