const Booking = require("../models/Booking");

module.exports = async function checkCarAvailability(req, res, next) {
    try {
        const { carId, startDate, endDate } = req.body;

        if (!carId || !startDate || !endDate) {
            return res.status(400).json({ error: "Missing booking fields" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        
        const overlappingBooking = await Booking.findOne({
            car: carId,
            startDate: { $lte: end },
            endDate: { $gte: start }
        });

        if (overlappingBooking) {
            return res.status(400).json({
                error: "Car is NOT available for the selected date range.",
                bookedFrom: overlappingBooking.startDate,
                bookedTo: overlappingBooking.endDate
            });
        }

        next();

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Availability check failed" });
    }
};
