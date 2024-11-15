//~/MernStart/backend/controllers/itemController.js
const Item = require('../models/itemModel2')
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');

// Get all items with pagination
// Get all items with pagination and only the primary SKU
const getItems = async (req, res) => {
    const { page = 1, limit = itemsPerPage } = req.query; // Default to page 1 and limit 100

    try {
        const items = await Item.aggregate([
            // Add the primary SKU by accessing the last element in the SKU array
            {
                $addFields: {
                    primarySku: { $arrayElemAt: ["$sku", -1] } // Access the last element in the SKU array
                }
            },
            // Project the fields you want to return, including the filtered primarySku
            {
                $project: {
                    masterCode: 1,
                    oldCode: 1,
                    "sku.sku": "$primarySku.sku",  // Map primarySku.sku to sku.sku
                    "sku.dateSKUChange": "$primarySku.dateSKUChange",
                    "sku.qtyInStock": "$primarySku.qtyInStock"
                }
            },
            // Sort by masterCode, oldCode, and primary SKU
            { $sort: { masterCode: 1, oldCode: 1, "primarySku.sku": 1 } },
            // Pagination
            { $skip: (page - 1) * limit },
            { $limit: Number(limit) }
        ]);

        // Count total items for pagination
        const totalItems = await Item.countDocuments({});

        res.status(200).json({
            items,
            currentPage: Number(page),
            totalPages: Math.ceil(totalItems / limit),
        });
    } catch (error) {
        res.status(500).json({ error: 'Call IT. Internal Server Error' });
    }
};


// Get a single item
const getItem = async (req, res) => {
    try {
        const { id } = req.params; // ID included at the end of the address
        const idx = id.toUpperCase();

        // Fetch the item based on masterCode, oldCode, or sku
        const item = await Item.findOne({
            $or: [
                { masterCode: idx },
                { oldCode: idx },
                { 'sku.sku': idx } // Adjusted to search within the sku array
            ]
        });

        // Check if the item was found
        if (!item) {
            return res.status(404).json({ error: 'Single Item not found' });
        }

        // Check if the last SKU is primary
        const primarySKU = item.sku[item.sku.length - 1];
        if (primarySKU && primarySKU.isPrimary === 'T') {

            // Construct the path to the file in frontend/assets/inventoryPics
            const filePath = path.join(__dirname, '../..', 'backend', 'public');
            const fileUrl = `/assets/fullInventoryPics/${item.masterCode}.jpg`;

            // Check if the file exists
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // File does not exist
                    return res.status(200).json({
                        item: {
                            ...item.toObject(), // Convert Mongoose document to plain object
                            sku: [primarySKU] // Include only primary SKUs in response
                        },
                        imageExists: false,
                        fileLocation: fileUrl,
                        errorMessage: 'Image directory is bad or file not found',
                    });
                } else {
                    // File exists
                    return res.status(200).json({
                        item: {
                            ...item.toObject(), // Convert Mongoose document to plain object
                            sku: [primarySKU] // Include only primary SKUs in response
                        },
                        imageExists: true,
                        fileLocation: fileUrl,
                    });
                }
            });
        } else {
            // If the last SKU is not primary, return the item with no primary SKU
            return res.status(200).json({
                item: {
                    ...item.toObject(),
                    sku: [] // No primary SKU to return
                },
                imageExists: false,
                fileLocation: '/assets/fullInventoryPics/' + item.masterCode + '.jpg',
                errorMessage: 'No primary SKU found for this item',
            });
        }

    } catch (error) {
        console.error('Error fetching item by id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//create a new item
const appId ="itemController001" 
const createItem = async (req, res) => {
    const {sku, masterCode, oldCode} = req.body
    //add doc to db    
    try {
        const item = await Item.create({sku, masterCode, oldCode})
        res.status(200).json(item)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//delete an item
const deleteItem = async (req, res) => {
    const { id } = req.params
    if  (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "no such item"})
    }
    const item = await item.findOneAndDelete({_id: id})    
    if(!item) {
        return res.status(400).json({error: "Item to delete not found"})
    }
    res.status(200).json(item)
}

//Single item update
const updateItem = async (req,res) => {
    const {id} = req.params

    const item = await item.findOneAndUpdate({_id: id}, {
        ...req.body
    })
    if (!item) {
        return res.status(400).json({error: 'No such item'})
    }
    res.status(200).json(item)
}

// search items by masterCode
const searchItemsByMasterCode = async (req, res) => {
    const { reqmasterCode } = req.query; // Expecting the masterCode as a query parameter
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    if (!reqmasterCode) {
        return res.status(400).json({ error: 'masterCode query parameter is required' });
    }
    try {
        const items = await Item.find({ masterCode: reqmasterCode })
        .skip((page -1) * limit)
        .limit(limit);

        const totalItems = await Item.countDocuments({ masterCode: reqmasterCode });
        const totalPages = Math.ceil(totalItems / limit);

        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found with the given masterCode' });
        }
        res.status(200).json({
            items,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error fetching items by masterCode:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getItems,
    getItem,
    createItem,
    deleteItem,
    updateItem,
    searchItemsByMasterCode
}