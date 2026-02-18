const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',   
        required: true
    },

    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car', 
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    totalDays: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    pickupLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Office",
    required: true,
    },

    dropoffLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Office",
        required: true,
    },


    bookingStatus: {
    type: String,
    enum: ["Pending", "Approved", "Declined", "Completed"],
    default: "Pending"
    },


    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
