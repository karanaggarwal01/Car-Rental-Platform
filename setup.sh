#!/bin/bash
# Car Rental Booking System - Testing Checklist

echo "================================"
echo "Car Rental Booking System Setup"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "backend/app.js" ]; then
    echo "❌ Error: Please run this from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Step 1: Initialize offices
echo "Step 1: Initializing office locations in MongoDB..."
cd backend
node scripts/initializeOffices.js

if [ $? -eq 0 ]; then
    echo "✅ Offices initialized successfully"
    echo ""
    echo "⚠️  IMPORTANT: Copy the Office IDs output above and update:"
    echo "   frontend/src/utils/officeLocations.js"
    echo ""
else
    echo "❌ Failed to initialize offices"
    echo "   Make sure MongoDB is running"
    exit 1
fi

echo ""
echo "Step 2: Verifying dependencies..."
npm ls express mongoose cors 2>/dev/null | grep -q "express@" && echo "✅ Backend dependencies OK"

cd ../frontend
npm ls react react-router-dom 2>/dev/null | grep -q "react@" && echo "✅ Frontend dependencies OK"

echo ""
echo "================================"
echo "Setup Complete! 🎉"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Update officeLocations.js with the Office IDs from Step 1"
echo "2. Start backend: cd backend && npm start"
echo "3. Start frontend: cd frontend && npm start"
echo "4. Navigate to http://localhost:3000"
echo "5. Login and test the booking flow"
echo ""
