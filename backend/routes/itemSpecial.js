//register different routes here
//require the actual controlls from the controllers folder
const express = require('express')
const { searchItemsByMasterCode } = require('../controllers/itemController.js')

const router = express.Router()

// Search items by masterCode
router.get('/search', searchItemsByMasterCode);

module.exports = router