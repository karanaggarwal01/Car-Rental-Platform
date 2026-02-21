# 🚗 Car Rental System

A full-stack car rental application built with React and Node.js, featuring user authentication, car booking, and admin management.

## 🌐 Live Demo

👉 [View Live Demo](https://car-rental-platform-five.vercel.app/)

## 📋 Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)
- [Booking Flow](#booking-flow)
- [Security Features](#security-features)

## ✨ Features

- 🔐 User Authentication (Signup/Login)
- 🚗 Car Booking System with date validation
- 📍 Multiple Office Locations (Delhi, Kolkata, Bengaluru, Mumbai, Goa)
- 💰 Automatic Price Calculation
- ✅ Car Availability Checking
- 👨‍💼 Admin Panel for Booking Management
- 📱 Responsive Design

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Sass/SCSS
- React DatePicker

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (for authentication)

## 📁 Project Structure

```
Car-Rental/
├── backend/
│   ├── controllers/     # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── connections/     # Database connection
│   └── scripts/         # Setup scripts
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── Pages/       # Page components
│   │   ├── context/     # React Context (Auth)
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
│
├── setup.bat            # Windows setup script
├── setup.sh             # Linux/Mac setup script
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Quick Setup

**Option 1: Using Setup Scripts**

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Option 2: Manual Setup**

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Car-Rental
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up Environment Variables**

   Create `backend/.env`:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SEED_OWNER_EMAIL=your_email@example.com
   ```

5. **Initialize Office Locations**
   ```bash
   cd backend
   node scripts/initializeOffices.js
   ```
   
   Copy the Office IDs from the output and update `frontend/src/utils/officeLocations.js`

6. **Start the Application**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm start
   ```
   Backend runs on: `http://localhost:8080`

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on: `http://localhost:3000`

## 📡 API Endpoints

### User Endpoints
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - User login

### Car Endpoints
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car by ID

### Booking Endpoints
- `POST /api/bookings/book` - Create new booking
- `GET /api/bookings/user/:userId` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID

### Admin Endpoints
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id/approve` - Approve booking
- `PUT /api/admin/bookings/:id/decline` - Decline booking
- `GET /api/admin/approved` - Get approved bookings
- `GET /api/admin/declined` - Get declined bookings

## 🐛 Troubleshooting

### Common Issues

**Issue: MongoDB connection failed**
- Ensure MongoDB is running
- Check `MONGODB_URL` in `.env` file
- Verify connection string format

**Issue: Office locations not found**
- Run `node backend/scripts/initializeOffices.js`
- Update `frontend/src/utils/officeLocations.js` with correct IDs

**Issue: Cannot book car**
- Ensure user is logged in
- Check all form fields are filled
- Verify car availability for selected dates

**Issue: Port already in use**
- Backend: Change port in `backend/app.js` (default: 8080)
- Frontend: React will prompt to use different port

For more detailed troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 🏗️ Architecture

For detailed system architecture and data flow, see [ARCHITECTURE.md](./ARCHITECTURE.md)

## 📝 Booking Flow

1. User logs in or signs up
2. Selects a car from available options
3. Chooses pickup/dropoff locations and dates
4. Fills in personal information
5. System validates availability and calculates price
6. Booking is created with "Pending" status
7. Admin approves/declines booking

## 🔒 Security Features

- Password hashing (bcrypt)
- JWT authentication
- Input validation
- CORS configuration
- Environment variables for sensitive data

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Karan Aggarwal**
- LinkedIn: [karanagg2005](https://linkedin.com/in/karanagg2005)
- GitHub: [karanaggarwal01](https://github.com/karanaggarwal01)


## 🙏 Acknowledgments

- React community
- MongoDB documentation
- Express.js team

---

**Note:** Make sure to set up your `.env` file with proper credentials before running the application.
