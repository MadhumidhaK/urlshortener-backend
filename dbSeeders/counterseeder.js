const path = require('path')
require('dotenv').config({
    path: path.join(__dirname, "../.env")
})
const db = require('../config/dbConfig')
const Counter = require('../models/counter');


const insertFirstCount = async () => {
    const counter = new Counter({
        name: "URLCounter",
        count: 1000000
    })

    const c = await counter.save();
    console.log(c)

}

insertFirstCount()