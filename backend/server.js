//MernStart/backend
//to allow the use of the .env environment file
require ('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

//create express app
const app = express();

//contains all the routes
//const poRoutes = require('./routes/po')
//const poModel = require('./models/poModel')
const itemRoute = require('./routes/items')
const itemFilterRoute = require('./routes/itemsSpecial')
const fileUpdateRoute = require('./routes/fileUpdate')
const itemModel = require('./models/itemModel')


// Middelware:  handles data from front end passed on to the backend
// Browser example: http://192.168.101.48:4001/assets
// after the port and the address will then be loaded to middleware
app.use(express.json());
app.use(cors()); // enable CORS
// Middleware to serve static files
app.use('/assets',express.static(path.join(__dirname, '/public/assets')));
app.use('/pics',express.static(path.join(__dirname, '/public/pagePics')));
app.use((req, res, next) => {
    console.log(req.path, req.method)
        next()
    })

//Define routes
//app.use('/acha-kvell/po', poRoute)
app.use('/acha-kvell/item', itemRoute)
app.use('/acha-kvell/itemSpecial', itemFilterRoute)
app.use('/acha-kvell/upload', fileUpdateRoute)

//connect to mongodb
mongoose.connect(process.env.mongo_URI)
    .then(() => {

    //listen for requests on port 
        app.listen(process.env.PORT, () => {
        console.log('Connected to AchaDB and listening on port', process.env.PORT);
        return itemModel.ensureIndexes();
        })
      })
    .catch((error) => {
        console.log(error)   
    })
