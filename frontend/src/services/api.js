// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Helper function for API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw error;
    }
};

// User APIs
export const userAPI = {
    signup: (userData) => apiCall('/users/signup', 'POST', userData),
    login: (credentials) => apiCall('/users/login', 'POST', credentials),
};

// Car APIs
export const carAPI = {
    getAllCars: () => apiCall('/cars'),
    getCarById: (carId) => apiCall(`/cars/${carId}`),
};

// Booking APIs
export const bookingAPI = {
    createBooking: (bookingData) => apiCall('/bookings/book', 'POST', bookingData),
    getBookings: (userId) => apiCall(`/bookings/user/${userId}`),
    getBookingById: (bookingId) => apiCall(`/bookings/${bookingId}`),
    cancelBooking: (bookingId) => apiCall(`/bookings/${bookingId}`, 'DELETE'),
};

const apiServices = {
    userAPI,
    carAPI,
    bookingAPI,
};

export default apiServices;
