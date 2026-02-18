const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    model: { type: String, required: true },
    name: { type: String, required: true },
    year: { type: Number, required: true },
    rentPerDay: { type: Number, required: true },

    currentLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Office",
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});


const Car = mongoose.model('Car',carSchema);    
module.exports = Car;