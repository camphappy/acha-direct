//create _itemID - immutable with a default value of _id
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _itemID: {
        type: mongoose.Schema.Types.ObjectId,
        immutable: true,
        default: function() {
            return this._id;
        }
    },
    masterCode: String,
    oldCode: String,
    sku: String,
    Attribute1: String,
    Value1: String,
    Attribute2: String,
    Value2: String,
    packingOption: String,
    inStock: {
        showroom: Number,
        qc: Number,
        shelf: Number,
        inStockTotal: Number
    }
});

// Apply the default _itemID value when creating new items
itemSchema.pre('save', function(next) {
    if (!this._itemID) {
        this._itemID = this._id;
    }
    next();
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
