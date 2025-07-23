import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import SearchRide from "./components/SearchRide";
import OfferRide from "./components/OfferRide";
import EditRide from "./components/EditRide";
import DetailsView from "./components/DetailsView";
import Login from "./components/Login";
import Register from "./components/Register";
import Profil from "./components/Profil";
import Header from "./components/Header";

// Prüft, ob Token vorhanden ist
function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <Header />
      <div className="pt-20 md:pt-24"> {/* Abstand wegen fixed Header */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/search"
            element={
              <RequireAuth>
                <SearchRide />
              </RequireAuth>
            }
          />
          <Route
            path="/offer"
            element={
              <RequireAuth>
                <OfferRide />
              </RequireAuth>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <RequireAuth>
                <EditRide />
              </RequireAuth>
            }
          />
          <Route
            path="/details/:id"
            element={
              <RequireAuth>
                <DetailsView />
              </RequireAuth>
            }
          />
          <Route
            path="/profil"
            element={
              <RequireAuth>
                <Profil />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
