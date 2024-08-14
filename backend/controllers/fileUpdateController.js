const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { Item } = require('../models/itemModel'); // Assuming you have an item model

const handleFileUpload = async (req, res) => {
    try {
        const csvFilePath = req.file.path;

        // Read and parse the CSV file
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        const jsonData = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
        }).data;

        // Process each JSON document
        for (let document of jsonData) {
            const sku = document.SKU;
            let item = await Item.findOne({ sku });

            if (item) {
                // Update the item with new attributes
                const attributes = [];
                if (document.Attribute1) attributes.push({ attributeName: 'Attribute1', value: document.Value1 });
                if (document.Attribute2) attributes.push({ attributeName: 'Attribute2', value: document.Value2 });

                item.attributes.push(...attributes);
                document.updateStatus = 'updated';
            } else {
                document.updateStatus = 'Not updated. Sku Not found';
            }
            await item.save();
        }

        // Save the resulting JSON file with update status
        const outputPath = path.join(__dirname, '../uploads/status/', `output-${Date.now()}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));

        res.json({ message: 'File processed successfully', outputPath });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'File processing failed' });
    }
};

module.exports = {
    handleFileUpload
}
