import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Home from "./components/Home";
import SearchRide from "./components/SearchRide";
import OfferRide from "./components/OfferRide";
import EditRide from "./components/EditRide";

function App() {
  const [fahrten, setFahrten] = useState([]);

  useEffect(() => {
    const gespeicherteFahrten = JSON.parse(localStorage.getItem("fahrten")) || [];
    setFahrten(gespeicherteFahrten);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home fahrten={fahrten} setFahrten={setFahrten} />} />
        <Route path="/search" element={<SearchRide fahrten={fahrten} setFahrten={setFahrten} />} />
        <Route path="/offer" element={<OfferRide fahrten={fahrten} setFahrten={setFahrten} />} />
        <Route path="/edit/:id" element={<EditRide fahrten={fahrten} setFahrten={setFahrten} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
