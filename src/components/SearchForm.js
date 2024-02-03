import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import axios from 'axios';


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
  const [selectedDeparture, setSelectedDeparture] = useState('');

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

  return (
    <div>
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
              <label htmlFor="departureAirport">Kalkış Havaalanı</label>
              <Select
                options={options}
                name="departureAirport"
                value={options.find(option => option.value === values.departureAirport)}
                onChange={(selectedOption) => {
                  setFieldValue('departureAirport', selectedOption.value);
                  setSelectedDeparture(selectedOption.value); // Seçilen kalkış havaalanını güncelle
                }}
              />
              <ErrorMessage name="departureAirport" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="arrivalAirport">Varış Havaalanı</label>
              <Select
                options={filteredOptions}
                name="arrivalAirport"
                value={filteredOptions.find(option => option.value === values.arrivalAirport)}
                onChange={(selectedOption) => setFieldValue('arrivalAirport', selectedOption.value)}
              />
              <ErrorMessage name="arrivalAirport" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="departureDate">Kalkış Tarihi</label>
              <DatePicker
                selected={values.departureDate}
                dateFormat="yyyy-MM-dd'T'HH:mm:ss"
                onChange={(date) => setFieldValue('departureDate', date)}
              />
<ErrorMessage name="departureDate" component="div" className="error" />
                          </div>

            <div>
              <label htmlFor="returnDate">Dönüş Tarihi</label>
              <DatePicker
                selected={values.returnDate}
                dateFormat="yyyy-MM-dd'T'HH:mm:ss"
                onChange={(date) => setFieldValue('returnDate', date)}
                disabled={values.oneWay}
              />
<ErrorMessage name="returnDate" component="div" className="error" />
                          </div>

            <div>
              <label>
                <Field type="checkbox" name="oneWay" />
                Tek yönlü uçuş
              </label>
            </div>

            <button
              //disabled={Object.keys(errors).length > 0 || (values.oneWay ? false : Object.keys(touched).length === 0)}
              type="submit"
            >
              Ara
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchForm;