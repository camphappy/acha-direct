const mongoose = require('mongoose')

const itemQtySchema = new mongoose.Schema({
    showroom: {
      type: Number,
      required: true
    },
    qc: {
      type: Number,
      required: true
    },
    shelf: {
      type: Number,
      required: true
    },
    inStockTotal: {
      type: Number,
      required: true
    }
  });
  

const itemSchema = new mongoose.Schema({
    masterCode: {type: String},
    oldCode: {type: String},
    sku: {type: String, required: true},
    inStock: [itemQtySchema] // Include the itemQty field with the subschema
}, { strict: false, timestamps: true, collection: 'item' });

//model based on the above schema (itemSchema)
module.exports = mongoose.model('Item', itemSchema)


