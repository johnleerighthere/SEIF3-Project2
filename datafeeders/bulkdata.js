require('dotenv').config()
const mongoose = require('mongoose')
const bulkjson = require('./bulk.json');
const winningsModel = require("../models/winnings");

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        console.log('MongoDB connection successful')
    })
    .then(response => {
        winningsModel.insertMany(bulkjson)
            .then(insertResponse => {
                console.log('Data seeding successful')
            })
            .catch(insertErr => {
                console.log(insertErr)
            })
            .finally(() => {
                mongoose.disconnect()
            })
    })
    .catch(err => {
        console.log(err)
    })

// const winningsModel = require("../models/winnings");
// const bulkjson = require('./bulk.json');

// console.log(bulkjson);

// const bulkData = () => {
//     console.log("hii");
//     winningsModel.insertMany(bulkjson, (err, data) => {
//         if (err) console.log("Error Inserting Data", err);

//         console.log("Data Inserted Succesfully");



//     })




// }
// bulkData();