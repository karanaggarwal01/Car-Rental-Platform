const Booking = require("../models/Booking");
const Car = require("../models/Cars");
const User = require("../models/User");
const Office = require("../models/Office");

exports.getIncomingBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ bookingStatus: "Pending" })
            .populate("user", "name email phone")
            .populate("car", "model name rentPerDay")
            .populate("pickupLocation", "name")
            .populate("dropoffLocation", "name");

        res.json({
            message: "Incoming booking requests",
            count: bookings.length,
            bookings
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};


exports.acceptBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        if (booking.bookingStatus !== "Pending") {
            return res.status(400).json({ error: "Booking already processed" });
        }

        booking.bookingStatus = "Approved";
        await booking.save();

        await Car.findByIdAndUpdate(booking.car, {
            currentLocation: booking.dropoffLocation
        });

        res.json({
            message: "Booking Approved Successfully",
            booking
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Approval failed" });
    }
};


exports.declineBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        if (booking.bookingStatus !== "Pending") {
            return res.status(400).json({ error: "Booking already processed" });
        }

        booking.bookingStatus = "Declined";
        await booking.save();

        res.json({
            message: "Booking Declined Successfully",
            booking
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Decline failed" });
    }
};

exports.getApprovedBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ bookingStatus: "Approved" })
            .populate("user", "name email phone")
            .populate("car", "model name")
            .populate("pickupLocation", "name")
            .populate("dropoffLocation", "name");

        res.json({ message: "Approved bookings", count: bookings.length, bookings });

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch approved bookings" });
    }
};

exports.getDeclinedBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ bookingStatus: "Declined" })
            .populate("user", "name email")
            .populate("car", "model name");

        res.json({ message: "Declined bookings", count: bookings.length, bookings });

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch declined bookings" });
    }
};
