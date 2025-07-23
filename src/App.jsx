import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SearchRide from "./components/SearchRide";
import OfferRide from "./components/OfferRide";
import EditRide from "./components/EditRide";
import DetailsView from "./components/DetailsView";
import Login from "./components/Login";
import Register from "./components/Register";
import Profil from "./components/Profil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchRide />} />
        <Route path="/offer" element={<OfferRide />} />
        <Route path="/edit/:id" element={<EditRide />} />
        <Route path="/details/:id" element={<DetailsView />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>
    </Router>
  );
}

export default App;
