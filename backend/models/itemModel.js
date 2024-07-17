const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    masterCode: {type: String},
    oldCode: {type: String},
    sku: {type: String, required: true},
}, {timestamps: true , collection: 'item'})

//model based on the above schema (itemSchema)
module.exports = mongoose.model('Item', itemSchema)


//export the model for use on other parts of the application
// module.exports = {
//     itemModel
// }; 