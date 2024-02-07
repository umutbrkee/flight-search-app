import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import "../App.css";

import { TextField } from '@mui/material';
import Autocomplete from "@mui/material/Autocomplete"

import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"


const SearchSchema = Yup.object().shape({
  departureAirport: Yup.string().required("Departure airpoer must be chosen."),
  arrivalAirport: Yup.string().required("Arrival airport must be chosen."),
  departureDate: Yup.date().required("Departure date must be chosen."),
  returnDate: Yup.date().when(['oneWay', 'departureDate'], {
    is: (oneWay, departureDate) => !oneWay && departureDate,
    then: (SearchSchema) => SearchSchema.min(
      Yup.ref('departureDate'),
      "Return date can not be earlier than departure date."
    ).required("Return date must be chosen."),
    otherwise: (SearchSchema) => SearchSchema,
  }).nullable(),
  oneWay: Yup.boolean(),
});

const SearchForm = ({ onSearch }) => {
  const [options, setOptions] = useState([]);
  const [departureAirport, setDepartureAirport] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/flights')
      .then((response) => {
        const data = response.data;
  
        const allAirports = [
          ...new Set(data.map((flight) => flight.departureAirport)),
          ...new Set(data.map((flight) => flight.arrivalAirport)),
        ];
  
        const uniqueAirports = Array.from(new Set(allAirports));
        const options = uniqueAirports.map((name) => ({ value: name, label: name }));
        setOptions(options);
      })
      .catch((error) => {
        console.error('Veri çekme hatası:', error);
      });
  }, []);

  // Filtrelenmiş varış havaalanı seçenekleri
  const filteredOptions = options.filter(option => option.value !== departureAirport);
  const datePickerStyle = {
    display: 'block',
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '16px',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '14px',
    marginTop: '5px',
  };

  const checkboxContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '20px',
    
  };

  const checkboxStyle = {
    marginRight: '10px',
  };


  const dateClass = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height:'80px',
    justifyContent:'space-between',
    alignItems: 'center',
marginTop:'10px'
  }
  


  return (
    
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        margin: '20px auto', 
        maxWidth: '500px', 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', 
        textAlign: 'left',
      }}>
      <Formik
        initialValues={{
          departureAirport: null,
          arrivalAirport: null,
          departureDate: null,
          returnDate: null,
          oneWay: false,
        }}
        validationSchema={SearchSchema}
        onSubmit={(values) => {
          onSearch(values);
        }}
      >
{({ setFieldValue, values, errors, touched }) => (
            <Form>
            <div style={{marginTop:'10px',marginBottom:'10px'}}>
            <Autocomplete
                id="departureAirport"
                options={options}
                getOptionLabel={(option) => option ? option.label : ''}
                value={options.find(option => option.value === values.departureAirport) || ''}
                onChange={(event, newValue) => {
                  setFieldValue('departureAirport', newValue ? newValue.value : '');
                  setDepartureAirport(newValue ? newValue.value : '');
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Departure Airport" margin="normal" />
                )}
              />
              <ErrorMessage name="departureAirport" component="div" style={errorStyle} />
            </div>
  
            <div>
            <Autocomplete
                id="arrivalAirport"
                options={filteredOptions}
                getOptionLabel={(option) => option ? option.label : ''}
                value={filteredOptions.find(option => option.value === values.arrivalAirport) || ''}
                onChange={(event, newValue) => {
                  setFieldValue('arrivalAirport', newValue ? newValue.value : '');
                }}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={(params) => (
                  <TextField {...params} label="Arrival Airport" margin="normal" />
                )}
              />
              <ErrorMessage name="arrivalAirport" component="div" style={errorStyle} />
            </div>
  <div style={dateClass}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div style={{ marginBottom: '20px' }}>
                <DatePicker
                  label="Departure Date"
                  value={values.departureDate}
                  onChange={(newValue) => {
                    setFieldValue('departureDate', newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(touched.departureDate && errors.departureDate)}
                      helperText={touched.departureDate && errors.departureDate}
                    />
                  )}
                />
              </div>

              {!values.oneWay && (
                <div style={{ marginBottom: '20px' }}>
                  <DatePicker
                    label="Return Date"
                    value={values.returnDate}
                    onChange={(newValue) => {
                      setFieldValue('returnDate', newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(touched.returnDate && errors.returnDate)}
                        helperText={touched.returnDate && errors.returnDate}
                        disabled={values.oneWay}
                      />
                    )}
                  />
                </div>
              )}
            </LocalizationProvider>
              </div>

            <div style={checkboxContainerStyle}>
              <Field type="checkbox" name="oneWay" style={checkboxStyle} />
              <label htmlFor="oneWay" style={{ fontWeight: '600' }}>One way flight </label>
            </div>
            <button type="submit" className='button'>
              Search
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
export default SearchForm;