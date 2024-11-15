const mongoose = require('mongoose');

// Connect to your MongoDB database
const uri = 'mongodb://localhost:27017/acha-direct';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const Item = require('../../models/NewitemModel.js');

async function addQtyOnHand() {
    try {
        // Update all documents to add qtyOnHand array with default qtyTotal value
        const result = await Item.updateMany(
            {}, // Empty filter to target all documents
            { $set: { qtyOnHand: [{ qtyTotal: 1000000 }] } }
        );
        
        console.log(`Modified ${result.nModified} documents to include qtyOnHand.`);
    } catch (error) {
        console.error("Error updating documents:", error);
    } finally {
        mongoose.connection.close();
    }
}

addQtyOnHand();
