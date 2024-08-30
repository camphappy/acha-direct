{/*
For each row, perform the following:
if attribute1 is:  	store value1 to
Packing Option		packingOption
Length			    length
Color			    color
Crystal Color		crystalColor
Quantity in Bulk	bulkQuantity
Size			    size
CZ Color		    czColor
Gauge			    guage
Ring Size		    ringSize
Design			    design

Do the same for attribute2 and value2

export the file to achaItem.aug272024.json*/}

const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const inputFilePath = path.join(__dirname, '../uploadsCSV/achaItemNoID.aug272024.csv');  // Path to your source file
const outputFilePath = path.join(__dirname, '../uploadsCSV/achaItem.aug272024.json');  // Path to output JSON file

const attributeMapping = {
    'Packing Option': 'packingOption',
    'Length': 'length',
    'Color': 'color',
    'Crystal Color': 'crystalColor',
    'Quantity in Bulk': 'bulkQuantity',
    'Size': 'size',
    'CZ Color': 'czColor',
    'Gauge': 'gauge',
    'Ring Size': 'ringSize',
    'Design': 'design'
};

const results = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())  // Use default comma separator
  .on('data', (row) => {
      const processedRow = { ...row };  // Copy all original fields

      // Map specific attributes if they exist
      if (attributeMapping[row.Attribute1]) {
          processedRow[attributeMapping[row.Attribute1]] = row.Value1;
      }
      if (attributeMapping[row.Attribute2]) {
          processedRow[attributeMapping[row.Attribute2]] = row.Value2;
      }

      results.push(processedRow);
  })
  .on('end', () => {
      fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2), 'utf-8');
      console.log(`File successfully written to ${outputFilePath}`);
  });
