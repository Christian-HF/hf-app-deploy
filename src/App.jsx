import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import OfferRide from "./components/OfferRide";
import EditRide from "./components/EditRide";
import Login from "./components/Login";
import SearchRide from "./components/SearchRide";
import DetailsView from "./components/DetailsView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchRide />} />
        <Route path="/offer" element={<OfferRide />} />
        <Route path="/edit/:id" element={<EditRide />} />
        <Route path="/details/:id" element={<DetailsView />} />
        {/* Optional: 404 Page */}
        <Route path="*" element={<div>Seite nicht gefunden</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
