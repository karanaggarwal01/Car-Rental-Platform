# 🔧 Troubleshooting Guide - Car Rental Booking

## ❌ Error: "Cannot read property 'id' of null" or "Please log in first"

**Problem**: User not authenticated when trying to book

**Cause**: `user` is null in AuthContext, meaning user is not logged in

**Solution**:
1. Click on "Sign Up" or "Log In" in the navigation bar
2. Create a new account or login with existing credentials
3. Return to the booking section
4. Try booking again

**Check**:
- Is there a user icon/name displayed in the navbar?
- If not, you're not logged in

---

## ❌ Error: "500 Internal Server Error" on booking submission

**Problem**: Backend returned 500 status when submitting booking

**Cause**: Could be several issues:
1. Invalid Office IDs in `officeLocations.js`
2. MongoDB not connected
3. User not found in database
4. Car not found in database

**Solution**:
1. Check browser console (DevTools > Console) for detailed error
2. Check backend terminal for error message
3. Verify Office IDs in `src/utils/officeLocations.js` are real MongoDB IDs
4. Make sure backend is running: `npm start` in backend folder
5. Ensure MongoDB is running

**Debug Steps**:
```bash
# Terminal 1: Check MongoDB is running
# Windows: mongodb should be running as service or via mongod command

# Terminal 2: Check backend server logs
cd backend
npm start
# Look for "Server is running on port 8080"
# Look for "MongoDB connected successfully"

# Terminal 3: Check frontend
cd frontend
npm start
```

---

## ❌ Error: "Invalid pickup or dropoff location"

**Problem**: System couldn't find the office location

**Cause**: Office IDs in `officeLocations.js` don't exist in database

**Solution**:
1. Run office initialization: `node backend/scripts/initializeOffices.js`
2. Copy the output Office IDs
3. Paste them into `frontend/src/utils/officeLocations.js`
4. Refresh browser (Ctrl+R)
5. Try booking again

**Verify**:
```javascript
// Your officeLocations.js should have REAL MongoDB IDs like:
export const OFFICE_LOCATIONS = {
    'Delhi': '67a1b2c3d4e5f6g7h8i9j0k1',    // Real 24-char ID
    'Kolkata': '67a1b2c3d4e5f6g7h8i9j0k2',
    // ... etc
};
```

---

## ❌ Error: "All fields are required!" message stays visible

**Problem**: Form won't submit booking

**Cause**: You're missing one of these fields:
- Car selection
- Pickup location
- Dropoff location
- Pickup date
- Dropoff date

**Solution**:
1. Make sure you selected a car from the dropdown
2. Make sure you selected a pickup location
3. Make sure you selected a dropoff location  
4. Make sure you picked a pickup date
5. Make sure you picked a dropoff date
6. Click "Search" again

---

## ❌ Error: "Car is NOT available for the selected date range"

**Problem**: The car is already booked for those dates

**Cause**: Someone else already booked this car during your selected dates

**Solution**:
1. Choose different dates (earlier or later)
2. Choose a different car model
3. Try dates that don't conflict with existing bookings

**Note**: Bookings are checked at the minute level - if there's any overlap, it's blocked

---

## ❌ Error: "User not found" (backend error)

**Problem**: Backend can't find the user in database

**Cause**: User ID stored in AuthContext doesn't exist in MongoDB

**Solution**:
1. Logout (click logout in navbar)
2. Clear browser cache: Press Ctrl+Shift+Delete
3. Close browser completely
4. Reopen browser
5. Go to localhost:3000
6. Create a NEW account (don't login with old one)
7. Try booking with new account

---

## ❌ Error: "Car not found"

**Problem**: Backend can't find the selected car

**Cause**: Car ID doesn't exist or cars haven't been loaded

**Solution**:
1. Check that cars are displaying in the dropdown
2. If no cars showing, backend car data might be missing
3. Make sure backend `/api/cars` endpoint returns data
4. Refresh page (Ctrl+R)
5. Try again

---

## ❌ Error: Button shows "Processing..." but never completes

**Problem**: Request seems to hang

**Cause**: Network issue or backend not responding

**Solution**:
1. Check if backend is running: Should see "Server is running on port 8080"
2. Check browser Network tab (DevTools > Network)
3. Look for POST request to `/api/bookings/book`
4. See if it shows status and response
5. If no response, backend isn't running
6. Restart backend: `npm start` in backend folder

---

## ✅ Verification Checklist

Before troubleshooting, verify these are working:

### Backend Checks
- [ ] MongoDB is running
- [ ] Backend server started: `npm start` in backend folder
- [ ] Terminal shows: "Server is running on port 8080"
- [ ] Terminal shows: "MongoDB connected successfully"
- [ ] Can visit: http://localhost:8080/ (shows "hello Karan, Backend is running, this is home")

### Frontend Checks
- [ ] Frontend server started: `npm start` in frontend folder
- [ ] Can visit: http://localhost:3000
- [ ] Page loads without errors
- [ ] Navbar shows (Home, About, Models, etc.)

### Authentication Checks
- [ ] User can signup/login
- [ ] After login, user name shows in navbar
- [ ] User data saved in localStorage (DevTools > Application > Storage > localStorage)

### Office Setup Checks
- [ ] Ran: `node backend/scripts/initializeOffices.js`
- [ ] Got output with Office IDs
- [ ] Updated `officeLocations.js` with those IDs
- [ ] IDs are 24-character strings like: `507f1f77bcf86cd799439011`

### Booking Flow Checks
- [ ] Can see cars in dropdown
- [ ] Can select all booking fields
- [ ] Can click "Search"
- [ ] Modal opens with car details
- [ ] Can fill personal info
- [ ] Can click "Reserve Now"
- [ ] See success message or error

---

## 🔍 How to Debug (For Developers)

### Check Backend Logs
```bash
cd backend
npm start
# Look for errors in the console
# Add console.log in bookingController.js to debug
```

### Check Frontend Console
Open DevTools (F12) > Console tab
- Look for red errors
- Check Network tab for API calls
- Look for request/response data

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Try to book a car
4. Look for POST `/api/bookings/book`
5. Click it to see request and response

### Add Debugging to Code
In `BookCar.jsx`, before `await bookingAPI.createBooking(bookingData)`:
```javascript
console.log('Sending booking data:', bookingData);
console.log('User ID:', user.id);
console.log('Car ID:', carType);
```

In `backend/controllers/bookingController.js`, start of createBooking:
```javascript
console.log('Booking request received:', req.body);
console.log('User searching for:', userId);
console.log('Car searching for:', carId);
```

---

## 📞 Getting Help

1. **Check the logs**: Backend console and browser console
2. **Read error messages**: They usually tell you what's wrong
3. **Verify Office IDs**: Most common issue
4. **Restart servers**: Often fixes connection issues
5. **Check MongoDB**: Make sure it's running

---

## 🎯 Common Success Indicators

You'll know booking works when:
- ✅ Modal opens with car details and calculated total charge
- ✅ Button shows "Processing..." briefly
- ✅ Success message appears: "Check your email to confirm an order"
- ✅ Form resets
- ✅ Backend terminal shows successful booking log

---

**Last Updated**: November 29, 2025
**Version**: 1.0
