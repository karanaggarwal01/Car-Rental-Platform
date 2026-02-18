const express = require("express");
const router = express.Router();

const {
    getIncomingBookings,
    acceptBooking,
    declineBooking,
    getApprovedBookings,
    getDeclinedBookings
} = require("../controllers/adminController");


router.get("/incoming-bookings", getIncomingBookings);


router.post("/approve/:id", acceptBooking);


router.post("/decline/:id", declineBooking);


router.get("/approved", getApprovedBookings);

router.get("/declined", getDeclinedBookings);

module.exports = router;
