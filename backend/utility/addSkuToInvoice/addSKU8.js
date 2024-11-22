const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Paths to the input CSV and JSON files

const invoiceFile = 'updated_SR-09Final_2024_colnames13J_NoSKU.tsv.csv';
const jsonFilePath = '../_ioFiles/acha-direct.item-pre.json';

// Path to the output CSV file
const outputFilePath = `../_ioFiles/SKU_${invoiceFile}_${Date.now()}.csv`;

// Load and parse the JSON file
const itemData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

// CSV writer for the output file
const csvWriter = createCsvWriter({
  path: outputFilePath,
  header: [
    { id: 'invoiceNumber', title: 'invoiceNumber' },
    { id: 'invoiceDate', title: 'invoiceDate' },
    { id: 'qty', title: 'qty' },
    { id: 'masterCode', title: 'masterCode' },
    { id: 'oldCode', title: 'oldCode' },
    { id: 'opt1', title: 'opt1' },
    { id: 'opt2', title: 'opt2' },
    { id: 'description', title: 'description' },
    { id: 'unitPrice', title: 'unitPrice' },
    { id: 'totalPrice', title: 'totalPrice' },
    { id: 'sku', title: 'sku' },
    { id: 'length', title: 'length' },
    { id: 'crystalColor', title: 'crystalColor' },
    { id: 'color', title: 'color' },
    { id: 'gauge', title: 'gauge' },
    { id: 'size', title: 'size' },
    { id: 'czColor', title: 'czColor' },
    { id: 'qtyInPack', title: 'qtyInPack' },
    { id: 'bulkQuantity', title: 'bulkQuantity' },
    { id: 'height', title: 'height' },
    { id: 'width', title: 'width' },
    { id: 'itemType', title: 'itemType' },
    { id: 'ringSize', title: 'ringSize' },
    { id: 'rack', title: 'rack' },
    { id: 'packingOption', title: 'packingOption' }

  ]
});

// Array to store the CSV data
const csvData = [];

// Read the CSV file and process each row
fs.createReadStream(invoiceFile)
  .pipe(csv())
  .on('data', (row) => {
    csvData.push(row);
  })
  .on('end', () => {
    // Process the CSV data to find the sku values
    const outputData = csvData.map((row) => {
      const { masterCode, oldCode, length, crystalColor, color, Gauge, size, czColor, qtyInPack, bulkQuantity, height, width, itemType, ringSize, packingOption } = row;

      // Find a matching item in the JSON data
      const matchedItem = itemData.find((item) => {
        // Check mandatory fields
        const isMatch = item.masterCode === masterCode && item.oldCode === oldCode;

        // Check optional fields only if they have values
        if (length && item.length !== length) return false;
        if (crystalColor && item.crystalColor !== crystalColor) return false;
        if (color && item.color !== color) return false;
        if (Gauge && item.Gauge !== Gauge) return false;
        if (size && item.size !== size) return false;
        if (czColor && item.czColor !== czColor) return false;
        if (qtyInPack && item.qtyInPack !== qtyInPack) return false;
        if (bulkQuantity && item.bulkQuantity !== bulkQuantity) return false;
        if (height && item.height !== height) return false;
        if (width && item.width !== width) return false;
        if (itemType && item.itemType !== itemType) return false;
        if (ringSize && item.ringSize !== ringSize) return false;
        if (packingOption && item.packingOption !== packingOption) return false;
        return isMatch;
      });

      // If a match is found, add the sku to the row, otherwise set it to "NOT FOUND"
      row.sku = matchedItem ? matchedItem.sku : 'NOT FOUND';
      return row;
    });

    // Write the output data to a new CSV file
    csvWriter.writeRecords(outputData)
      .then(() => {
        console.log('Output file with SKU values has been written.');
      });
  });
