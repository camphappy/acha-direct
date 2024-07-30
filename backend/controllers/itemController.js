//~/MernStart/backend/controllers/itemController.js
const Item = require('../models/itemModel')
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');

//get all items with pagination
//const getItems = async (req, res) => {
    //const items = await Item.find({}).sort({createdAt: -1})
const getItems = async (req, res) => {
    const { page = 1, limit = itemsPerPage } = req.query; // Default to page 1 and limit 100
    try {
        const items = await Item.find({})
            .sort({ masterCode: 1, oldCode: 1, sku: 1 })
            //.sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const totalItems = await Item.countDocuments({});
            res.status(200).json({
                items,
                currentPage: Number(page),
                totalPages: Math.ceil(totalItems / limit),
            });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//get a single item
const getItem = async (req, res) => {
    try {
        const { id } = req.params; // ID included at the end of the address
        const idx = id.toUpperCase();
        const items = await Item.find({
            $or: [
                { masterCode: idx },
                { oldCode: idx },
                { sku: idx }
            ]
        });

        // items is an array, so we check its length
        if (items.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const item = items[0]; // Get the first item from the array
 
        // Construct the path to the file in frontend/assets/inventoryPics
        filePath = path.join(__dirname, '../..', 'backend', 'public');

        const fileUrl = `/assets/fullInventoryPics/${item.masterCode}.jpg`;

        // Check if the file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // File does not exist
                return res.status(200).json({
                    item,
                    imageExists: false,
                    fileLocation: fileUrl, // Include the string value of filePath
                    errorMessage: 'Image directory is bad or file not found',
                });
            } else {
                // File exists
                return res.status(200).json({
                    item,
                    imageExists: true,
                    fileLocation: fileUrl // Include the string value of filePath
                    
                });
            }
    });
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
    const item = await Item.findOneAndDelete({_id: id})    
    if(!item) {
        return res.status(400).json({error: "Item to delete not found"})
    }
    res.status(200).json(item)
}

//update an item
const updateItem = async (req,res) => {
    const {id} = req.params

    const item = await Item.findOneAndUpdate({_id: id}, {
        ...req.body
    })
    if (!item) {
        return res.status(400).json({error: 'No such item'})
    }
    res.status(200).json(item)
}

const searchItem = async (req, res) => {
    const { searchText } = req.query;
    const upperCaseSearchText = searchText.toUpperCase();

    try {
        const item = await Item.findOne({
            $or: [
                { masterCode: upperCaseSearchText },
                { oldCode: upperCaseSearchText },
                { sku: upperCaseSearchText }
            ]
        });

        if (!item) {
            return res.status(404).json({ message: 'Your text was not found' });
        }

        res.status(200).json({ message: 'Text was found', item });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getItems,
    getItem,
    createItem,
    deleteItem,
    updateItem,
    searchItem
}