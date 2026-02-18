import React, { useState, useEffect } from 'react';
import { carAPI } from '../services/api';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const response = await carAPI.getAllCars();
                setCars(response.cars || []);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching cars:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    if (loading) return <div>Loading cars...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="car-list">
            <h2>Available Cars</h2>
            {cars.length === 0 ? (
                <p>No cars available</p>
            ) : (
                cars.map(car => (
                    <div key={car._id} className="car-item">
                        <h3>{car.model}</h3>
                        <p>Year: {car.year}</p>
                        <p>Rent per day: ${car.rentPerDay}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default CarList;
