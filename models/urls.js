const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },
    shortened: {
        type: String,
        required: true
    },
    visits: {
        type: Number,
        required: true,
        default: 0
    },
    creationTime:
    {
        type: Date, 
        default: Date.now
    },
    lastVisited:{
        type: Date, 
        default: Date.now
    },
    clicksPerHour:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model('urlSchema', urlSchema)