//to allow the use of the .env environment file
require ('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


//contains all the routes
const itemRoutes = require('./routes/items')
const itemModel = require('./models/itemModel')


//create express app
const app = express()

//middleware - handles data from front end passed on to the backend
app.use(express.json())
// any request that comes in, it looks if there is data
// included in the request and sends it to the server

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../..', 'frontend', 'public')));

// Logging middleware for requests
app.use((req, res, next) => {
    console.log(req.path, req.method)
        next()
    })

//Define routes
//app.use('/acha-kvell/po', poRoutes)
app.use('/acha-kvell/item', itemRoutes)

// In the browser's address, /api/workouts will need to be added
// after the port and the address will then be loaded to middleware

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
