const mongoose = require('mongoose')

const legacySkuSchema = new mongoose.Schema({
    sku: {type: String, required: true}
})

 const itemSchema = new mongoose.Schema({
    _itemID: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        immutable: true, // Ensure it cannot be modified after setting
    },
    masterCode: {type: String},
    oldCode: {type: String},
    sku: {type: String, required: true},
    legacySku: [legacySkuSchema]
}, {timestamps: true, collection: 'item'})

// Pre-save hook to set _itemID to the same value as _id before saving
itemSchema.pre('save', function(next) {
    if (this.isNew) {
        this._itemID = this._id; // Set _itemID to the same value as _id
    }
    next();
});

//model based on the above schema (itemSchema)
module.exports = mongoose.model('Item', itemSchema)
