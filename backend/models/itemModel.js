const mongoose = require('mongoose')

const itemQtySchema = new mongoose.Schema({
    itemQty: {
      type: Number,
      required: true
    },
    qcQty: {
      type: Number,
      required: true
    },
    trashyTrashybox: {
      type: Number,
      required: true
    }
  });
  

const itemSchema = new mongoose.Schema({
    masterCode: {type: String},
    oldCode: {type: String},
    sku: {type: String, required: true},
    itemQty: [itemQtySchema] // Include the itemQty field with the subschema
}, { strict: false, timestamps: true, collection: 'item' });

//model based on the above schema (itemSchema)
module.exports = mongoose.model('Item', itemSchema)
