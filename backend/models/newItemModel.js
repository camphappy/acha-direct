const mongoose = require('mongoose')

const skuSchema = new mongoose.Schema({
    sku: {type: String, required: true},
    isPrimary: {type: String, required: true, default: 'T'},
    dateSKUChange: {type: Date, default: Date.now}
})

const itemSchema = new mongoose.Schema({
    masterCode: {type: String},
    oldCode: {type: String},
    sku: { type: [skuSchema], required: true },
    uploadable: {type: String, default: 0},
    qtyTotal: { type: Number, required: true, default: 1000000 },
    showroom: { type: Number, default: 0 }, // Add default as needed
    qtySteelTitanium: { type: Number, default: 0 },
    qtyShowroom: { type: Number, default: 0 },
    qtyQC: { type: Number, default: 0 },
    qtyC1: { type: Number, default: 0 },
    qtyProduction: { type: Number, default: 0 },
    qtyWarehouse: { type: Number, default: 0 },
    qtyAdminBuilding : { type: Number, default: 0 },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    _itemID: { type: mongoose.Schema.Types.ObjectId, immutable: true }
}, { timestamps: true, collection: 'item' });

//model based on the above schema (itemSchema)
module.exports = mongoose.model('Item', itemSchema)


