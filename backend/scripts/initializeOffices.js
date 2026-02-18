// This script initializes the Office locations in the database
// Run this once to populate the offices
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../connections/mongodb');
const Office = require('../models/Office');

const officeData = [
    {
        name: 'Delhi',
        address: '123 Rajpath, New Delhi, Delhi 110001, India'
    },
    {
        name: 'Kolkata',
        address: '456 Camac Street, Kolkata, West Bengal 700016, India'
    },
    {
        name: 'Bengaluru',
        address: '789 MG Road, Bengaluru, Karnataka 560001, India'
    },
    {
        name: 'Mumbai',
        address: '321 Marine Drive, Mumbai, Maharashtra 400001, India'
    },
    {
        name: 'Goa',
        address: '654 Panaji, Goa 403001, India'
    }
];

const initializeOffices = async () => {
    try {
        // Connect to database
        await connectDB();
        console.log('Connected to MongoDB');

        // Clear existing offices
        await Office.deleteMany({});
        console.log('Cleared existing offices');

        // Insert new offices
        const insertedOffices = await Office.insertMany(officeData);
        console.log('Offices created successfully:');
        
        insertedOffices.forEach((office, index) => {
            console.log(`${index + 1}. ${office.name}: ${office._id}`);
        });

        // Create mapping for frontend
        const mapping = {};
        insertedOffices.forEach(office => {
            mapping[office.name] = office._id.toString();
        });

        console.log('\n📌 Update your frontend officeLocations.js with these IDs:');
        console.log('export const OFFICE_LOCATIONS = {');
        Object.entries(mapping).forEach(([name, id]) => {
            console.log(`    '${name}': '${id}',`);
        });
        console.log('};');

        process.exit(0);
    } catch (error) {
        console.error('Error initializing offices:', error);
        process.exit(1);
    }
};

initializeOffices();
