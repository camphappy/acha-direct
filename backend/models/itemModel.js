const mongoose = require('mongoose')


const itemSchema = new mongoose.Schema({
    masterCode: {type: String},
    oldCode: {type: String},
    sku: {type: String, required: true},
}, {strict: false , timestamps: true , collection: 'item'})

//model based on the above schema (itemSchema)
module.exports = mongoose.model('Item', itemSchema)
