const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
const { log } = require('console');

const app = express();
const port = 3000;

// MongoDB connection URL and database name
const url = 'mongodb://localhost:27017/acha-direct';
const dbName = 'item';

// #const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(url);

async function processInvoice() {
  await client.connect();
  console.log('Connected to database');
  const db = client.db(dbName);
  const itemsCollection = db.collection('item');

  const results = [];

  fs.createReadStream('../_ioFiles/invoice.csv')
    .pipe(csv())
    .on('data', async (data) => {
      let foundMatch = 'n';

      const invoiceMasterCode = data['masterCode'];
      const invoiceOldCode = data['oldCode'];
      console.log(`MCode: ${invoiceMasterCode}`);
      console.log(`OCode: ${invoiceOldCode}`);

      // Collect non-empty fields from 12 through 25
      const nonEmptyFields = {};
      for (let i = 11; i <= 25; i++) {
        const field = `field${i}`;
        console.log(`Looking for Field: ${field}`);
        if (data[field] && data[field] !== '') {
          nonEmptyFields[field] = data[field];
          console.log(`Field: ${field}, Value: ${data[field]}`);
        }
      }

      if (Object.keys(nonEmptyFields).length === 0) {
        console.log('No non-empty fields found. Moving on to the next invoice line.');
        results.push(data);
        return;
      }

      if (Object.keys(nonEmptyFields).length === 1) {
        const [field] = Object.keys(nonEmptyFields);
        const item = await itemsCollection.findOne({
          masterCode: invoiceMasterCode,
          oldCode: invoiceOldCode,
          [field]: nonEmptyFields[field],
        });

        if (item) {
          console.log(`Complete match on field ${field}`);
          data['sku'] = item.sku;
          foundMatch = 'y';
        } else {
          console.log('No match found for this invoice row.');
        }
      } else if (Object.keys(nonEmptyFields).length > 1) {
        const fields = Object.keys(nonEmptyFields);
        console.log(`Found non-empty fields: ${fields.join(', ')}`);

        const query = {
          masterCode: invoiceMasterCode,
          oldCode: invoiceOldCode,
        };
        fields.forEach((field) => {
          query[field] = nonEmptyFields[field];
        });

        const item = await itemsCollection.findOne(query);

        if (item) {
          console.log('Complete match');
          data['sku'] = item.sku;
          foundMatch = 'y';
        } else {
          console.log('No match found for this invoice row.');
        }
      } else {
        console.log('There are more than 2 non-empty fields for this row. Skipping.');
      }

      if (foundMatch === 'y') {
        data['sku'] = item.sku;
      }

      foundMatch = 'n';
      results.push(data);
    })
    .on('end', () => {
      const csvWriter = require('csv-writer').createObjectCsvWriter({
        path: 'output_invoice.csv',
        header: Object.keys(results[0]).map((key) => ({ id: key, title: key })),
      });
      csvWriter.writeRecords(results).then(() => console.log('The CSV file was written successfully'));
    });
}

app.get('/process-invoice', async (req, res) => {
  await processInvoice();
  res.send('Invoice processing complete. Check the output file.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
