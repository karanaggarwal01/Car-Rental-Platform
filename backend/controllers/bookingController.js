const User = require('../models/User');
const Car = require('../models/Cars');
const Office = require('../models/Office');
const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    try {
        const {
            userId,
            carId,
            pickupLocation,
            dropoffLocation,
            startDate,
            endDate
        } = req.body;

        if (!userId || !carId || !pickupLocation || !dropoffLocation || !startDate || !endDate) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const car = await Car.findById(carId);
        if (!car) return res.status(404).json({ error: "Car not found" });

        const pickupOffice = await Office.findById(pickupLocation);
        const dropoffOffice = await Office.findById(dropoffLocation);

        if (!pickupOffice || !dropoffOffice) {
            return res.status(404).json({ error: "Pickup or dropoff office not found" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const diffMs = end - start;
        if (diffMs <= 0) {
            return res.status(400).json({ error: "Invalid date range" });
        }

        const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const totalAmount = totalDays * car.rentPerDay;

        const booking = await Booking.create({
            user: userId,
            car: carId,
            pickupLocation,
            dropoffLocation,
            startDate,
            endDate,
            totalDays,
            totalAmount,
            bookingStatus: "Pending" 
        });

        res.status(201).json({
            message: "Booking Request Sent (Pending Approval)",
            bookingReceipt: {
                user: {
                    name: user.name,
                    email: user.email
                },
                car: {
                    model: car.model,
                    year: car.year,
                    rentPerDay: car.rentPerDay
                },
                pickup: {
                    location: pickupOffice.name,
                    address: pickupOffice.address,
                    date: startDate
                },
                dropoff: {
                    location: dropoffOffice.name,
                    address: dropoffOffice.address,
                    date: endDate
                },
                totalDays,
                totalPrice: totalAmount,
                status: "Pending"
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Booking Failed", details: err.message });
    }
};
