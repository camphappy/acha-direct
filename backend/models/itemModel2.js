const mongoose = require('mongoose');

// Define the SKU sub-schema
const skuSchema = new mongoose.Schema({
    sku: { type: String, required: true },
    isPrimary: { type: Boolean, required: true }, // Changed to Boolean type
    qtyInStock: { type: Number, required: true },
    attrib1Primary: { type: String },
    attrib1Val: { type: String },
    attrib2Primary: { type: String },
    attrib2Val: { type: String },
    dateSKUChange: { type: Date }
});

// Define the main item schema
const itemSchema = new mongoose.Schema({
masterCode: { type: String },
    oldCode: { type: String },
    attrib1Primary: { type: String },
    attrib1Val: { type: String },
    attrib2Primary: { type: String },
    attrib2Val: { type: String },
    skuPrimary: { type: String },
    dateSKUChange: { type: Date },
    sku: [skuSchema]
}, { timestamps: true, collection: 'item' });

// Method to get only primary SKUs
itemSchema.methods.getPrimarySKU = function() {
    return this.sku.filter(sku => sku.isPrimary);
};

// Model based on the above schema (itemSchema)
module.exports = mongoose.model('Item', itemSchema);