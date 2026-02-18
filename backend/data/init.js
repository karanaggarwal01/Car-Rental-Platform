require('dotenv').config();
const mongoose = require("mongoose");

const Car = require("../models/Cars");
const Office = require("../models/Office");
const User = require("../models/User");


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB Connected");
    initCars();  // Call initCars() ONLY after connection succeeds
  })
  .catch((err) => {
    console.log("Connection error:", err);
    process.exit(1);
  });

async function initCars() {
  try {
    const ownerEmail = process.env.SEED_OWNER_EMAIL;

    if (!ownerEmail) {
      console.log("❌ SEED_OWNER_EMAIL is not set in .env");
      return mongoose.connection.close();
    }

    const owner = await User.findOne({ email: ownerEmail });

    if (!owner) {
      console.log(`❌ Owner with email '${ownerEmail}' not found!`);
      return mongoose.connection.close();
    }

    const offices = await Office.find();
    if (offices.length === 0) {
      console.log("❌ No offices found. Please run scripts/initializeOffices.js first.");
      return mongoose.connection.close();
    }

    
    const carsData = [
      { model: "Toyota Camry", name: "Sedan", year: 2020, rentPerDay: 2500 },
      { model: "Honda Civic", name: "Sedan", year: 2019, rentPerDay: 2300 },
      { model: "Hyundai Creta", name: "SUV", year: 2021, rentPerDay: 3000 },
      { model: "Mahindra Thar", name: "Off-Road", year: 2022, rentPerDay: 4500 },
      { model: "Maruti Swift", name: "Hatchback", year: 2018, rentPerDay: 1500 },
      { model: "Tata Nexon", name: "Compact SUV", year: 2021, rentPerDay: 2800 },
      { model: "Kia Seltos", name: "SUV", year: 2022, rentPerDay: 3200 },
      { model: "BMW X5", name: "Luxury SUV", year: 2020, rentPerDay: 9000 },
      { model: "Audi A6", name: "Luxury Sedan", year: 2021, rentPerDay: 8500 },
      { model: "Mercedes C-Class", name: "Luxury Sedan", year: 2020, rentPerDay: 8800 },
      { model: "Ford Endeavour", name: "SUV", year: 2019, rentPerDay: 5000 },
      { model: "Toyota Fortuner", name: "SUV", year: 2021, rentPerDay: 5500 },
      { model: "Renault Kwid", name: "Hatchback", year: 2020, rentPerDay: 1200 },
      { model: "Volkswagen Polo", name: "Hatchback", year: 2019, rentPerDay: 1600 },
      { model: "Skoda Superb", name: "Sedan", year: 2021, rentPerDay: 6000 },
      { model: "Jeep Compass", name: "SUV", year: 2022, rentPerDay: 4200 },
      { model: "MG Hector", name: "SUV", year: 2021, rentPerDay: 3100 },
      { model: "Nissan Magnite", name: "Compact SUV", year: 2022, rentPerDay: 2000 },
      { model: "Hyundai i20", name: "Hatchback", year: 2021, rentPerDay: 1700 },
      { model: "Honda City", name: "Sedan", year: 2020, rentPerDay: 2400 },
      { model: "Tata Harrier", name: "SUV", year: 2021, rentPerDay: 3300 },
      { model: "Mahindra XUV700", name: "SUV", year: 2022, rentPerDay: 4500 },
      { model: "BMW 3 Series", name: "Luxury Sedan", year: 2021, rentPerDay: 8200 },
      { model: "Audi Q3", name: "Luxury SUV", year: 2020, rentPerDay: 7800 },
      { model: "Hyundai Verna", name: "Sedan", year: 2021, rentPerDay: 2200 },
      { model: "Maruti Baleno", name: "Hatchback", year: 2022, rentPerDay: 1600 },
      { model: "Kia Carens", name: "MPV", year: 2022, rentPerDay: 3500 },
      { model: "Toyota Innova Crysta", name: "MPV", year: 2020, rentPerDay: 4000 },
      { model: "Range Rover Evoque", name: "Luxury SUV", year: 2021, rentPerDay: 12000 },
      { model: "Porsche Cayenne", name: "Luxury SUV", year: 2020, rentPerDay: 18000 }
    ];

    
    let index = 0;
    const carsFinal = carsData.map((car) => ({
      ...car,
      currentLocation: offices[index++ % offices.length]._id,
      owner: owner._id
    }));

    await Car.deleteMany();
    const inserted = await Car.insertMany(carsFinal);

    console.log("✔ 30 Cars inserted successfully!");
    console.log(inserted);

    mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
}

