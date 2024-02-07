import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import "../App.css";
import { Margin } from '@mui/icons-material';


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
    return <div className="loading"><CircularProgress /></div>;
  }

  // Uygun uçuş bulunamadıysa
  if (departure.length === 0 && (searchParams.oneWay || departureReturn.length === 0)) {
    return <Typography variant="h6" color="textSecondary">No flight available.</Typography>;
  }

  const listStyle = {
    maxHeight: '400px', // Maksimum yükseklik
    overflow: 'auto', // Taşma durumunda scrollbar göster
    width: '100%', // Genişlik
  };

  const getType = (flight) => {
    if (flight.departureAirport === searchParams.arrivalAirport) {
      return "Homing flight";
    } else if (flight.departureAirport === searchParams.departureAirport) {
      return "Outbound flight";
    }
  };

  return (
    <div className="flightListContainer">
      <FormControl margin="normal">
      <InputLabel>Order By</InputLabel>
          <Select
          style={{marginBottom:'5px'}}
            value={sortCriteria}
            label="Sırala"
            onChange={handleSortChange}
          >
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="departureTime">Departure Time</MenuItem>
            <MenuItem value="arrivalTime">Arrival Time</MenuItem>
            <MenuItem value="duration">Flight Duration</MenuItem>
          </Select>      
        </FormControl>
      {departure.length > 0 || departureReturn.length > 0 ? (
        <TableContainer component={Paper} style={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Departure</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Arrival</TableCell>
                <TableCell>Departure Time</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Flight Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...departure, ...departureReturn].map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell>{flight.departureAirport}</TableCell>
                  <TableCell>{getType(flight)}</TableCell>
                  <TableCell>{flight.arrivalAirport}</TableCell>
                  <TableCell>{new Date(flight.departureTime).toLocaleString()}</TableCell>
                  <TableCell>${flight.price}</TableCell>
                  <TableCell>{flight.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" color="textSecondary">No flight available.</Typography>
      )}
    </div>
  );
};

export default FlightList;