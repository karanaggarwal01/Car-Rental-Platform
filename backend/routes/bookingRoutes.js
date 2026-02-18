
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

const { createBooking } = require("../controllers/bookingController");
const checkCarAvailability = require("../middleware/checkCarAvailability");


router.post("/book", checkCarAvailability, createBooking);



router.get("/user/:userId", async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate("car", "model name")
            .populate("pickupLocation", "name")
            .populate("dropoffLocation", "name");

        res.json({
            message: "User bookings",
            total: bookings.length,
            bookings
        });

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

module.exports = router;
