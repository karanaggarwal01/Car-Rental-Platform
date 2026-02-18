const Car = require('../models/Cars');

exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find()
            .populate("owner", "name email") 
            .populate("currentLocation", "name address");

        res.json({
            success: true,
            total: cars.length,
            cars
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch cars" });
    }
};
