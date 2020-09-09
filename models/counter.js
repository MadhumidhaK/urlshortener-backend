const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    name: {
        type: String,
        required: true   
    },
    count: {
        type: Number,
        required: true,
        default: 1
    }
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;