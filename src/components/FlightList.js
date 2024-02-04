import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../App.css";


const FlightList = ({ searchParams }) => {
  const [departure, setDeparture] = useState([]);
  const [departureReturn, setDepartureReturn] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('price'); // default sorting criteria
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    setIsLoading(true); // Start loading
    axios.get('http://localhost:3001/flights')
      .then(response => {
        let departureFlights = [];
        let returnFlights = [];

        response.data.forEach((flight) => {
          let flightDepartureDate = new Date(flight.departureTime).toDateString();
          let searchDepartureDate = new Date(searchParams.departureDate).toDateString();
          let searchReturnDate = searchParams.returnDate ? new Date(searchParams.returnDate).toDateString() : null;

          if (flight.arrivalAirport === searchParams.arrivalAirport && flight.departureAirport === searchParams.departureAirport) {
            if (searchDepartureDate === flightDepartureDate) {
              flight.durationInMinutes = parseDurationToMinutes(flight.duration);
              departureFlights.push(flight);
            }
          }

          if (!searchParams.oneWay && flight.departureAirport === searchParams.arrivalAirport && flight.arrivalAirport === searchParams.departureAirport) {
            let flightReturnDate = new Date(flight.departureTime).toDateString();
            if (searchReturnDate === flightReturnDate) {
              returnFlights.push(flight);
            }
          }
        });

        sortFlights(departureFlights, sortCriteria); // sort after fetching and before setting state
        sortFlights(returnFlights, sortCriteria); // sort after fetching and before setting state

        setDeparture(departureFlights);
        setDepartureReturn(returnFlights);
        setIsLoading(false); // End loading
      })
      .catch(error => {
        console.error("API'den veri çekilirken hata oluştu:", error);
        setDeparture([]);
        setDepartureReturn([]);
        setIsLoading(false); // End loading even if there is an error
      });
  }, [searchParams, sortCriteria]);

  const sortFlights = (flights, criteria) => {
    switch (criteria) {
      case 'price':
        flights.sort((a, b) => a.price - b.price);
        break;
      case 'departureTime':
        flights.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
        break;
      case 'arrivalTime':
        flights.sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));
        break;
      case 'duration':
        flights.sort((a, b) => a.durationInMinutes - b.durationInMinutes); // Sort by duration in minutes
        break;
      default:
        break;
    }
  };
  const parseDurationToMinutes = (duration) => {
    const parts = duration.split(' '); // Split duration by space
    let minutes = 0;

    for (const part of parts) {
      if (part.includes('h')) {
        minutes += parseInt(part, 10) * 60; // Convert hours to minutes
      } else if (part.includes('m')) {
        minutes += parseInt(part, 10); // Add minutes
      }
    }

    return minutes;
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  // Loading Indicator
  if (isLoading) {
    return <div className="loading">Yükleniyor...</div>; // can replace this with a spinner or any custom loading animation
  }

  if (departure.length === 0 && searchParams.oneWay) {
    return <div>Uygun gidiş uçuşu bulunamadı.</div>;
  } else if (departure.length === 0 || (!searchParams.oneWay && departureReturn.length === 0)) {
    return <div>Uygun uçuş bulunamadı.</div>;
  }

  
return (
  <div className="flightListContainer">
    <select value={sortCriteria} onChange={handleSortChange} className="sortSelect">
      <option value="price">Price</option>
      <option value="departureTime">Departure Time</option>
      <option value="arrivalTime">Arrival Time</option>
      <option value="duration">Duration</option>
    </select>
    <h2 className="flightHeader">Gidiş Uçuşları</h2>
    <ul className="flightList">
      {departure.map((flight) => (
        <li key={flight.id} className="flightItem">
          <div className="flightDetails">{flight.departureAirport} - {flight.arrivalAirport}</div>
          <div className="flightDetails">Kalkış: {new Date(flight.departureTime).toLocaleString()}</div>
          <div className="flightDetails">Varış: {new Date(flight.arrivalTime).toLocaleString()}</div>
          <div className="flightDetails">Uçuş Süresi: {flight.duration}</div>
          <div className="flightPrice">Fiyat: ${flight.price}</div>
        </li>
      ))}
    </ul>
    {!searchParams.oneWay && (
      <div>
        <h2 className="flightHeader">Dönüş Uçuşları</h2>
        <ul className="flightList">
          {departureReturn.map((flight) => (
            <li key={flight.id} className="flightItem">
              <div className="flightDetails">{flight.departureAirport} - {flight.arrivalAirport}</div>
              <div className="flightDetails">Kalkış: {new Date(flight.departureTime).toLocaleString()}</div>
              <div className="flightDetails">Varış: {new Date(flight.arrivalTime).toLocaleString()}</div>
              <div className="flightDetails">Uçuş Süresi: {flight.duration}</div>
              <div className="flightPrice">Fiyat: ${flight.price}</div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
          }
export default FlightList;