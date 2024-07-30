//register different routes here
//require the actual controlls from the controllers folder
const express = require('express')
const {
    getItems,
    getItem,
    createItem,
    deleteItem,
    updateItem,
    searchItem

} = require('../controllers/itemController.js')

const router = express.Router()

//GET all items
router.get('/', getItems)

//GET a single item
router.get('/:id', getItem)

//ADD or POST a new item
router.post('/', createItem)

//DELETE an item
router.delete('/:id', deleteItem)
 
//UPDATE or PATCH an item
router.patch('/:id', updateItem)

//SEARCH an item
router.get('/search', searchItem)

module.exports = router