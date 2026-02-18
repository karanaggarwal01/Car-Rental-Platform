import { useEffect, useState } from "react";
import CarAudi from "../images/cars-big/audia1.jpg";
import CarGolf from "../images/cars-big/golf6.jpg";
import CarToyota from "../images/cars-big/toyotacamry.jpg";
import CarBmw from "../images/cars-big/bmw320.jpg";
import CarMercedes from "../images/cars-big/benz.jpg";
import CarPassat from "../images/cars-big/passatcc.jpg";
import { carAPI, bookingAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getOfficeId } from "../utils/officeLocations";

function BookCar() {
  const { user } = useAuth();
  const [modal, setModal] = useState(false);
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [carType, setCarType] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [pickUp, setPickUp] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [pickTime, setPickTime] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [carImg, setCarImg] = useState("");


  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipCode] = useState("");


  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await carAPI.getAllCars();
        setCars(response.cars || []);
        setLoadingCars(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoadingCars(false);
      }
    };
    fetchCars();
  }, []);


  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleLastName = (e) => {
    setLastName(e.target.value);
  };

  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleAge = (e) => {
    setAge(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
  };

  const handleCity = (e) => {
    setCity(e.target.value);
  };

  const handleZip = (e) => {
    setZipCode(e.target.value);
  };


  const openModal = (e) => {
    e.preventDefault();
    

    if (!user) {
      alert("Please log in first to book a car");
      return;
    }

    const errorMsg = document.querySelector(".error-message");
    if (
      pickUp === "" ||
      dropOff === "" ||
      pickTime === "" ||
      dropTime === "" ||
      carType === ""
    ) {
      errorMsg.style.display = "flex";
    } else {
      setModal(!modal);
      const modalDiv = document.querySelector(".booking-modal");
      modalDiv.scroll(0, 0);
      errorMsg.style.display = "none";
    }
  };


  useEffect(() => {
    if (modal === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modal]);


  const confirmBooking = async (e) => {
    e.preventDefault();
    

    if (!user || !user.id) {
      alert("Please log in to make a booking");
      return;
    }


    if (!name || !lastName || !phone || !age || !email || !address || !city || !zipcode) {
      alert("Please fill in all personal information fields");
      return;
    }

    setBookingLoading(true);

    try {
      const pickupOfficeId = getOfficeId(pickUp);
      const dropoffOfficeId = getOfficeId(dropOff);

      if (!pickupOfficeId || !dropoffOfficeId) {
        alert("Invalid pickup or dropoff location");
        setBookingLoading(false);
        return;
      }


      const bookingData = {
        userId: user.id,
        carId: carType,
        pickupLocation: pickupOfficeId,
        dropoffLocation: dropoffOfficeId,
        startDate: new Date(pickTime),
        endDate: new Date(dropTime)
      };


      const response = await bookingAPI.createBooking(bookingData);
      
      console.log("Booking successful:", response);
      
      setModal(false);
      const doneMsg = document.querySelector(".booking-done");
      doneMsg.style.display = "flex";
      
      setCarType("");
      setSelectedCar(null);
      setPickUp("");
      setDropOff("");
      setPickTime("");
      setDropTime("");
      setName("");
      setLastName("");
      setPhone("");
      setAge("");
      setEmail("");
      setAddress("");
      setCity("");
      setZipCode("");

    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCar = (e) => {
    const selectedCarId = e.target.value;
    setCarType(selectedCarId);
    

    const car = cars.find(c => c._id === selectedCarId);
    setSelectedCar(car || null);
    setCarImg(car?.model || "");
  };

  const handlePick = (e) => {
    setPickUp(e.target.value);
  };

  const handleDrop = (e) => {
    setDropOff(e.target.value);
  };

  const handlePickTime = (e) => {
    setPickTime(e.target.value);
  };

  const handleDropTime = (e) => {
    setDropTime(e.target.value);
  };


  const calculateTotalCharge = () => {
    if (!pickTime || !dropTime || !selectedCar) return { days: 0, total: 0 };
    
    const startDate = new Date(pickTime);
    const endDate = new Date(dropTime);
    
    const timeDifference = endDate - startDate;
    const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    const totalCharge = days > 0 ? days * selectedCar.rentPerDay : 0;
    
    return { days: Math.max(days, 1), total: totalCharge };
  };

  const { days: totalDays, total: totalCharge } = calculateTotalCharge();
  let imgUrl;
  switch (carImg) {
    case "Audi A1 S-Line":
      imgUrl = CarAudi;
      break;
    case "VW Golf 6":
      imgUrl = CarGolf;
      break;
    case "Toyota Camry":
      imgUrl = CarToyota;
      break;
    case "BMW 320 ModernLine":
      imgUrl = CarBmw;
      break;
    case "Mercedes-Benz GLK":
      imgUrl = CarMercedes;
      break;
    case "VW Passat CC":
      imgUrl = CarPassat;
      break;
    default:
      imgUrl = "";
  }

  if (selectedCar && selectedCar.image) {
    imgUrl = selectedCar.image;
  }

    const hideMessage = () => {
    const doneMsg = document.querySelector(".booking-done");
    doneMsg.style.display = "none";
  };

  return (
    <>
      <section id="booking-section" className="book-section">
        <div
          onClick={openModal}
          className={`modal-overlay ${modal ? "active-modal" : ""}`}
        ></div>

        <div className="container">
          <div className="book-content">
            <div className="book-content__box">
              <h2>Book a car</h2>

              <p className="error-message">
                All fields required! <i className="fa-solid fa-xmark"></i>
              </p>

              <p className="booking-done">
                Check your email to confirm an order.{" "}
                <i onClick={hideMessage} className="fa-solid fa-xmark"></i>
              </p>

              <form className="box-form">
                <div className="box-form__car-type">
                  <label>
                    <i className="fa-solid fa-car"></i> &nbsp; Select Your Car
                    Type <b>*</b>
                  </label>
                  <select value={carType} onChange={handleCar}>
                    <option value="">Select your car type</option>
                    {loadingCars ? (
                      <option disabled>Loading cars...</option>
                    ) : cars.length > 0 ? (
                      cars.map((car) => (
                        <option key={car._id} value={car._id}>
                          {car.model}
                        </option>
                      ))
                    ) : (
                      <option disabled>No cars available</option>
                    )}
                  </select>
                </div>

                <div className="box-form__car-type">
                  <label>
                    <i className="fa-solid fa-location-dot"></i> &nbsp; Pick-up{" "}
                    <b>*</b>
                  </label>
                  <select value={pickUp} onChange={handlePick}>
                    <option>Select pick up location</option>
                    <option>Delhi</option>
                    <option>Kolkata</option>
                    <option>Bengaluru</option>
                    <option>Mumbai</option>
                    <option>Goa</option>
                  </select>
                </div>

                <div className="box-form__car-type">
                  <label>
                    <i className="fa-solid fa-location-dot"></i> &nbsp; Drop-off{" "}
                    <b>*</b>
                  </label>
                  <select value={dropOff} onChange={handleDrop}>
                    <option>Select drop off location</option>
                    <option>Delhi</option>
                    <option>Kolkata</option>
                    <option>Bengaluru</option>
                    <option>Mumbai</option>
                    <option>Goa</option>
                  </select>
                </div>

                <div className="box-form__car-time">
                  <label htmlFor="picktime">
                    <i className="fa-regular fa-calendar-days "></i> &nbsp;
                    Pick-up <b>*</b>
                  </label>
                  <input
                    id="picktime"
                    value={pickTime}
                    onChange={handlePickTime}
                    type="date"
                  ></input>
                </div>

                <div className="box-form__car-time">
                  <label htmlFor="droptime">
                    <i className="fa-regular fa-calendar-days "></i> &nbsp;
                    Drop-off <b>*</b>
                  </label>
                  <input
                    id="droptime"
                    value={dropTime}
                    onChange={handleDropTime}
                    type="date"
                  ></input>
                </div>

                <button onClick={openModal} type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      

      <div className={`booking-modal ${modal ? "active-modal" : ""}`}>
        <div className="booking-modal__title">
          <h2>Complete Reservation</h2>
          <i onClick={openModal} className="fa-solid fa-xmark"></i>
        </div>
        
        <div className="booking-modal__message">
          <h4>
            <i className="fa-solid fa-circle-info"></i> Upon completing this
            reservation enquiry, you will receive:
          </h4>
          <p>
            Your rental voucher to produce on arrival at the rental desk and a
            toll-free customer support number.
          </p>
        </div>
        
        <div className="booking-modal__car-info">
          <div className="dates-div">
            <div className="booking-modal__car-info__dates">
              <h5>Location & Date</h5>
              <span>
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <h6>Pick-Up Date & Time</h6>
                  <p>
                    {pickTime} /{" "}
                    <input type="time" className="input-time"></input>
                  </p>
                </div>
              </span>
            </div>

            <div className="booking-modal__car-info__dates">
              <span>
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <h6>Drop-Off Date & Time</h6>
                  <p>
                    {dropTime} /{" "}
                    <input type="time" className="input-time"></input>
                  </p>
                </div>
              </span>
            </div>

            <div className="booking-modal__car-info__dates">
              <span>
                <i className="fa-solid fa-calendar-days"></i>
                <div>
                  <h6>Pick-Up Location</h6>
                  <p>{pickUp}</p>
                </div>
              </span>
            </div>

            <div className="booking-modal__car-info__dates">
              <span>
                <i className="fa-solid fa-calendar-days"></i>
                <div>
                  <h6>Drop-Off Location</h6>
                  <p>{dropOff}</p>
                </div>
              </span>
            </div>
          </div>
          <div className="booking-modal__car-info__model">
            <h5>
              <span>Car -</span> {selectedCar?.model || carType}
            </h5>
            {selectedCar && (
              <div className="modal-car-details">
                <p><strong>Year:</strong> {selectedCar.year}</p>
                <p><strong>Rent per Day:</strong> ${selectedCar.rentPerDay}</p>
                {selectedCar.transmission && <p><strong>Transmission:</strong> {selectedCar.transmission}</p>}
                {selectedCar.fuelType && <p><strong>Fuel Type:</strong> {selectedCar.fuelType}</p>}
                {selectedCar.seats && <p><strong>Seats:</strong> {selectedCar.seats}</p>}
                {totalDays > 0 && (
                  <>
                    <p style={{ borderTop: "1px solid #ddd", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                      <strong>Total Days:</strong> {totalDays}
                    </p>
                    <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ff5330" }}>
                      <strong>Total Charge:</strong> ${totalCharge}
                    </p>
                  </>
                )}
              </div>
            )}
            {imgUrl && <img src={imgUrl} alt="car_img" />}
          </div>
        </div>
        
        <div className="booking-modal__person-info">
          <h4>Personal Information</h4>
          <form className="info-form">
            <div className="info-form__2col">
              <span>
                <label>
                  First Name <b>*</b>
                </label>
                <input
                  value={name}
                  onChange={handleName}
                  type="text"
                  placeholder="Enter your first name"
                ></input>
                <p className="error-modal">This field is required.</p>
              </span>

              <span>
                <label>
                  Last Name <b>*</b>
                </label>
                <input
                  value={lastName}
                  onChange={handleLastName}
                  type="text"
                  placeholder="Enter your last name"
                ></input>
                <p className="error-modal ">This field is required.</p>
              </span>

              <span>
                <label>
                  Phone Number <b>*</b>
                </label>
                <input
                  value={phone}
                  onChange={handlePhone}
                  type="tel"
                  placeholder="Enter your phone number"
                ></input>
                <p className="error-modal">This field is required.</p>
              </span>

              <span>
                <label>
                  Age <b>*</b>
                </label>
                <input
                  value={age}
                  onChange={handleAge}
                  type="number"
                  placeholder="18"
                ></input>
                <p className="error-modal ">This field is required.</p>
              </span>
            </div>

            <div className="info-form__1col">
              <span>
                <label>
                  Email <b>*</b>
                </label>
                <input
                  value={email}
                  onChange={handleEmail}
                  type="email"
                  placeholder="Enter your email address"
                ></input>
                <p className="error-modal">This field is required.</p>
              </span>

              <span>
                <label>
                  Address <b>*</b>
                </label>
                <input
                  value={address}
                  onChange={handleAddress}
                  type="text"
                  placeholder="Enter your street address"
                ></input>
                <p className="error-modal ">This field is required.</p>
              </span>
            </div>

            <div className="info-form__2col">
              <span>
                <label>
                  City <b>*</b>
                </label>
                <input
                  value={city}
                  onChange={handleCity}
                  type="text"
                  placeholder="Enter your city"
                ></input>
                <p className="error-modal">This field is required.</p>
              </span>

              <span>
                <label>
                  Zip Code <b>*</b>
                </label>
                <input
                  value={zipcode}
                  onChange={handleZip}
                  type="text"
                  placeholder="Enter your zip code"
                ></input>
                <p className="error-modal ">This field is required.</p>
              </span>
            </div>

            <span className="info-form__checkbox">
              <input type="checkbox"></input>
              <p>Please send me latest news and updates</p>
            </span>

            <div className="reserve-button">
              <button onClick={confirmBooking} disabled={bookingLoading}>
                {bookingLoading ? "Processing..." : "Reserve Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default BookCar;
