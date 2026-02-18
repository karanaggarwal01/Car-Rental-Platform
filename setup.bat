@echo off
REM Car Rental Booking System - Setup & Testing (Windows)

echo ================================
echo Car Rental Booking System Setup
echo ================================
echo.

REM Check if we're in the right directory
if not exist "backend\app.js" (
    echo ERROR: Please run this from the project root directory
    pause
    exit /b 1
)

echo [OK] Project structure verified
echo.

REM Step 1: Initialize offices
echo Step 1: Initializing office locations in MongoDB...
cd backend
node scripts/initializeOffices.js

if %errorlevel% neq 0 (
    echo [ERROR] Failed to initialize offices
    echo Make sure MongoDB is running
    pause
    exit /b 1
)

echo [OK] Offices initialized successfully
echo.
echo [IMPORTANT] Copy the Office IDs output above and update:
echo            frontend\src\utils\officeLocations.js
echo.

echo Step 2: Verifying dependencies...
npm ls express mongoose cors >nul 2>&1 && echo [OK] Backend dependencies OK

cd ..\frontend
npm ls react react-router-dom >nul 2>&1 && echo [OK] Frontend dependencies OK

echo.
echo ================================
echo Setup Complete! [OK]
echo ================================
echo.
echo Next steps:
echo 1. Update officeLocations.js with the Office IDs from Step 1
echo 2. Start backend: cd backend ^&^& npm start
echo 3. Start frontend: cd frontend ^&^& npm start
echo 4. Navigate to http://localhost:3000
echo 5. Login and test the booking flow
echo.
echo Press any key to close this window...
pause
