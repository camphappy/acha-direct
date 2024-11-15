// Load Mongoose and connect to the database
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/acha-direct');

// Define the schema and explicitly set the collection name
const itemSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  masterCode: String,
  oldCode: String,
  sku: String,
  Attribute1: String,
  Value1: String,
  Attribute2: String,
  Value2: String,
  packingOption: String,
  qtyStock: Number,
  qtyQc: Number,
  qtyShowroom: Number,
  qtyPmetal: Number,
  qtyInStock: { type: Number, default: 1000000 },
  updatedOn: { type: Date, default: Date.now },
  updatedBy: String,
  inStock: {
    showroom: Number,
    qc: Number,
    shelf: Number,
    inStockTotal: Number },
  _itemID: {
    type: mongoose.Schema.Types.ObjectId,
    immutable: true },
}, { collection: 'item' });  // Specify the target collection name here

const Item = mongoose.model('Item', itemSchema);

async function updateItems() {
  try {
    const items = await Item.find({});

    for (const item of items) {
      await Item.updateOne(
        { _id: item._id },
        {
          $set: {
            _itemID: item._id, // Use the existing _id as _itemID
            qtyStock: item.qtyStock || 0,
            qtyQc: item.qtyQc || 0,
            qtyShowroom: item.qtyShowroom || 0,
            qtyPmetal: item.qtyPmetal || 0,
            qtyInStock: item.qtyInStock || 1000000,
            updatedOn: new Date(),
            updatedBy: 'system' // Or replace with the actual user identifier if needed
          }
        }
      );
    }

    console.log('Documents updated successfully.');
  } catch (error) {
    console.error('Error updating items:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Execute the update function
updateItems();
