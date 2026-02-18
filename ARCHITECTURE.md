# 🏗️ Car Rental System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Frontend (React - Port 3000)                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  BookCar Component (BookCar.jsx)                         │   │
│  │  ├─ Car Selection Dropdown (fetches from API)           │   │
│  │  ├─ Pickup/Dropoff Location Selection                   │   │
│  │  ├─ Date/Time Pickers                                   │   │
│  │  ├─ Personal Information Form                           │   │
│  │  └─ Reserve Button → Calls API                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Authentication (AuthContext)                                    │
│  ├─ useAuth() Hook                                               │
│  ├─ user.id (MongoDB User ID)                                    │
│  └─ localStorage persistence                                     │
│                                                                   │
│  API Service Layer (api.js)                                      │
│  ├─ bookingAPI.createBooking()                                   │
│  ├─ carAPI.getAllCars()                                          │
│  └─ userAPI.login/signup                                         │
│                                                                   │
│  Office Locations Mapper (officeLocations.js)                    │
│  ├─ Delhi → ObjectId                                            │
│  ├─ Kolkata → ObjectId                                          │
│  ├─ Bengaluru → ObjectId                                        │
│  ├─ Mumbai → ObjectId                                           │
│  └─ Goa → ObjectId                                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
            ↓ HTTP/REST
            │ POST /api/bookings/book
            │ {userId, carId, pickupLocation, dropoffLocation, startDate, endDate}
            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                              │
│                    (Port 8080)                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Routes (bookingRoutes.js)                                       │
│  POST /bookings/book → Middleware → Controller                  │
│                                                                   │
│  Middleware (checkCarAvailability.js)                            │
│  ├─ Extract carId, startDate, endDate from request             │
│  ├─ Query MongoDB for overlapping bookings                      │
│  ├─ If overlap found: Return 400 "Car NOT available"           │
│  └─ If no overlap: Continue to Controller                       │
│                                                                   │
│  Controller (bookingController.js > createBooking)              │
│  ├─ Receive: userId, carId, pickupLocation, dropoffLocation,  │
│  │            startDate, endDate                                │
│  ├─ Validate user exists: User.findById(userId)                │
│  ├─ Validate car exists: Car.findById(carId)                   │
│  ├─ Validate offices exist: Office.findById(locations)         │
│  ├─ Calculate totalDays: (endDate - startDate) / 86400000      │
│  ├─ Calculate totalAmount: totalDays × car.rentPerDay          │
│  ├─ Create booking: Booking.create({...})                      │
│  │   Status: "Pending"                                          │
│  └─ Return booking receipt with total price                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
            ↓ MongoDB Query
            │ Validates, Calculates, Saves
            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      MongoDB Database                             │
│                   (MongoDB Atlas - Cloud)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Collections:                                                    │
│  ┌─ users ─────────────────────────────────────────────────┐   │
│  │ { _id, name, email, phone, password }                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ cars ──────────────────────────────────────────────────┐   │
│  │ { _id, model, year, rentPerDay, transmission,           │   │
│  │   fuelType, seats, currentLocation }                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ offices ──────────────────────────────────────────────┐    │
│  │ { _id, name, address }                                  │   │
│  │ (Delhi, Kolkata, Bengaluru, Mumbai, Goa)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ bookings ─────────────────────────────────────────────┐    │
│  │ { _id, user, car, pickupLocation, dropoffLocation,     │   │
│  │   startDate, endDate, totalDays, totalAmount,          │   │
│  │   bookingStatus, createdAt }                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
            ↑ Response
            │ {message, bookingReceipt}
            ↑
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER                                    │
│  Show success: "Check your email to confirm an order"           │
│  Reset form for next booking                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│ USER INTERACTION                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. USER SELECTS CAR & DATES                                       │
│     BookCar Component receives:                                    │
│     - carType: "507f1f77bcf86cd799439001" (Car ID)               │
│     - pickUp: "Delhi" (String)                                    │
│     - dropOff: "Mumbai" (String)                                  │
│     - pickTime: "2025-12-20" (ISO String)                        │
│     - dropTime: "2025-12-25" (ISO String)                        │
│                      ↓                                             │
│  2. BOOKING MODAL OPENS                                           │
│     Shows car details + calculated price                          │
│     Total Days: 5                                                 │
│     Total Price: $500 (5 days × $100/day)                        │
│                      ↓                                             │
│  3. USER FILLS PERSONAL INFO                                      │
│     - name, lastName, phone, age                                 │
│     - email, address, city, zipcode                              │
│                      ↓                                             │
│  4. USER CLICKS "RESERVE NOW"                                     │
│     confirmBooking() function executes                            │
│     - Validates user is logged in: user.id ✓                     │
│     - Validates all fields filled ✓                              │
│     - Gets Office IDs:                                           │
│       pickupOfficeId = getOfficeId("Delhi")                     │
│       → "507f1f77bcf86cd799439011"                              │
│       dropoffOfficeId = getOfficeId("Mumbai")                   │
│       → "507f1f77bcf86cd799439014"                              │
│                      ↓                                             │
│  5. CREATES BOOKING DATA OBJECT                                  │
│     {                                                             │
│       userId: "507f1f77bcf86cd799439101",  (from user.id)       │
│       carId: "507f1f77bcf86cd799439001",   (selected car)       │
│       pickupLocation: "507f1f77bcf86cd799439011",  (office ID)  │
│       dropoffLocation: "507f1f77bcf86cd799439014", (office ID)  │
│       startDate: "2025-12-20T00:00:00.000Z",  (ISO string)      │
│       endDate: "2025-12-25T00:00:00.000Z"    (ISO string)       │
│     }                                                             │
│                      ↓                                             │
│  6. CALLS API                                                     │
│     POST http://localhost:8080/api/bookings/book                │
│     Headers: { 'Content-Type': 'application/json' }             │
│     Body: JSON stringified booking data                          │
│     Shows: "Processing..." on button                             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                         ↓ HTTP REQUEST
┌────────────────────────────────────────────────────────────────────┐
│ BACKEND PROCESSING                                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  7. REQUEST ARRIVES AT BACKEND                                    │
│     Route: POST /api/bookings/book                               │
│                      ↓                                             │
│  8. MIDDLEWARE: checkCarAvailability                             │
│     Queries MongoDB:                                              │
│     db.bookings.findOne({                                        │
│       car: "507f1f77bcf86cd799439001",                          │
│       startDate: { $lte: "2025-12-25" },                        │
│       endDate: { $gte: "2025-12-20" }                           │
│     })                                                            │
│                      ↓                                             │
│     Result: null (no conflicts)                                  │
│     → Continue to Controller ✓                                   │
│                      ↓                                             │
│  9. CONTROLLER: createBooking                                    │
│     - Find user: User.findById(userId)                          │
│       Result: { name: "John Doe", email: "...", ... } ✓        │
│                      ↓                                             │
│     - Find car: Car.findById(carId)                             │
│       Result: { model: "BMW 320", rentPerDay: 100, ... } ✓     │
│                      ↓                                             │
│     - Find offices:                                              │
│       Office.findById(pickupLocation)                           │
│       Result: { name: "Delhi", address: "..." } ✓              │
│       Office.findById(dropoffLocation)                          │
│       Result: { name: "Mumbai", address: "..." } ✓             │
│                      ↓                                             │
│     - Calculate days:                                            │
│       (2025-12-25 - 2025-12-20) / 86400000 = 5 days           │
│                      ↓                                             │
│     - Calculate total:                                           │
│       5 days × 100 $/day = $500                                 │
│                      ↓                                             │
│     - Create booking in MongoDB:                                 │
│       db.bookings.create({                                      │
│         user: "507f1f77bcf86cd799439101",                      │
│         car: "507f1f77bcf86cd799439001",                       │
│         pickupLocation: "507f1f77bcf86cd799439011",            │
│         dropoffLocation: "507f1f77bcf86cd799439014",           │
│         startDate: Date("2025-12-20"),                         │
│         endDate: Date("2025-12-25"),                           │
│         totalDays: 5,                                           │
│         totalAmount: 500,                                       │
│         bookingStatus: "Pending",                               │
│         createdAt: Date.now()                                   │
│       })                                                         │
│       Result: New booking document with _id ✓                  │
│                      ↓                                             │
│  10. RETURN RESPONSE (201 Created)                              │
│      {                                                            │
│        message: "Booking Request Sent (Pending Approval)",      │
│        bookingReceipt: {                                         │
│          user: { name: "John Doe", email: "..." },             │
│          car: { model: "BMW 320", rentPerDay: 100 },           │
│          pickup: {                                              │
│            location: "Delhi",                                   │
│            date: "2025-12-20"                                  │
│          },                                                      │
│          dropoff: {                                             │
│            location: "Mumbai",                                  │
│            date: "2025-12-25"                                  │
│          },                                                      │
│          totalDays: 5,                                          │
│          totalPrice: 500,                                       │
│          status: "Pending"                                      │
│        }                                                         │
│      }                                                            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                    ↑ HTTP RESPONSE
┌────────────────────────────────────────────────────────────────────┐
│ FRONTEND COMPLETION                                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  11. RESPONSE RECEIVED                                            │
│      Status: 201 (Success!)                                       │
│                      ↓                                             │
│  12. DISPLAY SUCCESS                                              │
│      - Hide modal                                                │
│      - Show message: "Check your email to confirm..."           │
│      - Reset all form fields                                    │
│      - Button shows "Reserve Now" again (not processing)        │
│                      ↓                                             │
│  13. USER SEES SUCCESS                                           │
│      Booking saved to database! ✓                               │
│      Status: Pending (awaiting admin approval)                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## File Structure

```
Car-Rental/
│
├── backend/
│   ├── app.js                                 [Main server file]
│   ├── package.json                          [Dependencies]
│   │
│   ├── models/
│   │   ├── User.js                          [User schema]
│   │   ├── Cars.js                          [Car schema]
│   │   ├── Office.js                        [Office schema]
│   │   └── Booking.js                       [Booking schema]
│   │
│   ├── controllers/
│   │   ├── userController.js               [Auth logic]
│   │   ├── carController.js                [Car management]
│   │   ├── bookingController.js            [Booking logic]
│   │   └── adminController.js              [Admin functions]
│   │
│   ├── routes/
│   │   ├── userRoutes.js                   [/api/users]
│   │   ├── carRoutes.js                    [/api/cars]
│   │   ├── bookingRoutes.js                [/api/bookings]
│   │   └── adminRoutes.js                  [/api/admin]
│   │
│   ├── middleware/
│   │   └── checkCarAvailability.js         [Availability check]
│   │
│   ├── connections/
│   │   └── mongodb.js                      [MongoDB connection]
│   │
│   ├── scripts/
│   │   └── initializeOffices.js            [Setup script]
│   │
│   └── BOOKING_SETUP.md                    [Setup guide]
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCar.jsx                [Booking form]
│   │   │   ├── Hero.jsx                   [Hero section]
│   │   │   ├── Navbar.jsx                 [Navigation]
│   │   │   └── [other components]
│   │   │
│   │   ├── Pages/
│   │   │   ├── Home.jsx                   [Home page]
│   │   │   ├── Login.jsx                  [Login page]
│   │   │   ├── Signup.jsx                 [Signup page]
│   │   │   └── [other pages]
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js             [Auth state]
│   │   │
│   │   ├── services/
│   │   │   └── api.js                     [API calls]
│   │   │
│   │   ├── utils/
│   │   │   └── officeLocations.js         [Office ID mapping]
│   │   │
│   │   ├── styles/
│   │   │   └── [SCSS files]
│   │   │
│   │   ├── App.js                         [Main app]
│   │   └── index.js                       [Entry point]
│   │
│   └── package.json                        [Dependencies]
│
├── README_BOOKING.md                        [Quick start]
├── INTEGRATION_SUMMARY.md                   [Implementation docs]
├── TROUBLESHOOTING.md                       [Troubleshooting]
└── BOOKING_IMPLEMENTATION.md               [Technical details]
```

## Sequence Diagram

```
Frontend              API          Middleware        Controller       Database
   │                  │               │                  │              │
   ├─ Click "Reserve" │               │                  │              │
   │────────────────→ │               │                  │              │
   │ POST /book       │               │                  │              │
   │  (booking data)  │               │                  │              │
   │                  ├──────────────→ │                  │              │
   │                  │ checkCar       │                  │              │
   │                  │ Available?     ├─ Query Bookings─→│              │
   │                  │                │                  │─────────────→ │
   │                  │                │                  │  find({...})  │
   │                  │                │                  │              │
   │                  │                │                  │←─────────────│
   │                  │                │                  │ null (OK)    │
   │                  │←────────────────│ Continue         │              │
   │                  │                                   │              │
   │                  │                                   ├─ Validate   │
   │                  │                                   │  user, car  │
   │                  │                                   │  offices    │
   │                  │                                   │              │
   │                  │                                   ├─ Calculate │
   │                  │                                   │  total days │
   │                  │                                   │  & amount   │
   │                  │                                   │              │
   │                  │                                   ├─ Create    │
   │                  │                                   │  Booking   ─→│
   │                  │                                   │              │ insert({...})
   │                  │                                   │              │
   │                  │←──────────────────────────────────┤ Return OK   │
   │                  │  {bookingReceipt}                 │              │
   │← Show Success────│                                   │              │
   │  Message         │                                   │              │
   │ Reset Form       │                                   │              │
   │                  │                                   │              │
```

---

This architecture ensures:
- ✅ User authentication required
- ✅ Data validation at every level
- ✅ No double-booking
- ✅ Automatic calculations
- ✅ Secure database operations
- ✅ Clean error handling
