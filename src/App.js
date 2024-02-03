import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import FlightList from './components/FlightList';
import "./App.css";

function App() {
  const [searchParams, setSearchParams] = useState(null);
  const [searchMade, setSearchMade] = useState(false); // Arama yapıldığını takip et

  const handleSearch = (values) => {
    setSearchParams(values);
    setSearchMade(true); // Arama yapıldığında bu durumu true olarak güncelle
  };

  return (
    <div className="App">
      <h1>Uçuş Arama Uygulaması</h1>
      <SearchForm onSearch={handleSearch} />
      {searchMade && <FlightList searchParams={searchParams} />}
    </div>
  );
}

export default App;
