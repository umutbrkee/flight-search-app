import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import axios from 'axios';
import "../App.css";


const SearchSchema = Yup.object().shape({
  departureAirport: Yup.string().required("Kalkış havaalanı zorunlu bir alan."),
  arrivalAirport: Yup.string().required("Varış havaalanı zorunlu bir alan."),
  departureDate: Yup.date().required("Kalkış tarihi zorunlu bir alan."),
  returnDate: Yup.date().when(['oneWay', 'departureDate'], {
    is: (oneWay, departureDate) => !oneWay && departureDate,
    then: (SearchSchema) => SearchSchema.min(
      Yup.ref('departureDate'),
      "Dönüş tarihi, kalkış tarihinden erken olamaz."
    ).required("Dönüş Tarihi zorunlu bir alan."),
    otherwise: (SearchSchema) => SearchSchema,
  }).nullable(),
  oneWay: Yup.boolean(),
});

const SearchForm = ({ onSearch }) => {
  const [options, setOptions] = useState([]);
  const [selectedDeparture] = useState('');

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
  const filteredOptions = options.filter(option => option.value !== selectedDeparture);
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

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '10px 0',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: '20px',
  };


  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        margin: '20px auto', 
        maxWidth: '500px', 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' 
      }}>
      <Formik
        initialValues={{
          departureAirport: '',
          arrivalAirport: '',
          departureDate: null,
          returnDate: null,
          oneWay: false,
        }}
        validationSchema={SearchSchema}
        onSubmit={(values) => {
          onSearch(values);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div>
              <label htmlFor="departureAirport" style={{ marginBottom: '5px', fontWeight: '600' }}>Kalkış Havaalanı</label>
              <Select
                name="departureAirport"
                options={options}
                classNamePrefix="select"
                value={options.find(option => option.value === values.departureAirport)}
                onChange={(selectedOption) => {
                  setFieldValue('departureAirport', selectedOption.value);
                }}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '40px',
                    marginBottom: '20px',
                  }),
                }}
              />
              <ErrorMessage name="departureAirport" component="div" style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }} />
            </div>
  
            <div>
              <label htmlFor="arrivalAirport" style={{ marginBottom: '5px', fontWeight: '600' }}>Varış Havaalanı</label>
              <Select
                name="arrivalAirport"
                options={filteredOptions}
                classNamePrefix="select"
                value={filteredOptions.find(option => option.value === values.arrivalAirport)}
                onChange={(selectedOption) => setFieldValue('arrivalAirport', selectedOption.value)}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '40px',
                    marginBottom: '20px',
                  }),
                }}
              />
              <ErrorMessage name="arrivalAirport" component="div" style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }} />
            </div>
  
            <div>
              <label htmlFor="departureDate" style={{ marginBottom: '5px', fontWeight: '600' }}>Kalkış Tarihi</label>
              <DatePicker
                selected={values.departureDate}
                dateFormat="yyyy-MM-dd'T'HH:mm:ss"
                onChange={(date) => setFieldValue('departureDate', date)}
                style={datePickerStyle}
              />
              <ErrorMessage name="departureDate" component="div" style={errorStyle} />
            </div>
  
            <div>
              <label htmlFor="returnDate" style={{ marginBottom: '5px', fontWeight: '600' }}>Dönüş Tarihi</label>
              <DatePicker
                selected={values.returnDate}
                dateFormat="yyyy-MM-dd'T'HH:mm:ss"
                onChange={(date) => setFieldValue('returnDate', date)}
                disabled={values.oneWay}
                style={datePickerStyle}
              />
              <ErrorMessage name="returnDate" component="div" style={errorStyle} />
            </div>
  
            <div style={checkboxContainerStyle}>
              <Field type="checkbox" name="oneWay" style={checkboxStyle} />
              <label htmlFor="oneWay">Tek yönlü uçuş</label>
            </div>
  
            <button type="submit" style={buttonStyle}>
              Ara
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
export default SearchForm;