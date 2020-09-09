const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const urlSchema = new Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    }, 
    clicks: [
        {
            clickedTime: {
                type: Date,
                required: true,
                default: Date.now()
            }
        }
    ]
}, {
    timestamps: true
});

const URL = model("URL", urlSchema);

module.exports = URL;