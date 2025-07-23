import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const username = localStorage.getItem("username") || "";
  const email = localStorage.getItem("email") || "";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <header className="w-full bg-neutral-light shadow-md flex items-center justify-between fixed top-0 left-0 z-30 h-16 px-4 md:px-8">
      {/* Links: Navigation */}
      <nav className="flex gap-6 items-center">
        <Link to="/home" className="text-primary-dark font-semibold">Übersicht</Link>
        <Link to="/search" className="text-primary-dark font-semibold">Fahrt suchen</Link>
        <Link to="/offer" className="text-primary-dark font-semibold">Fahrt anbieten</Link>
      </nav>

      {/* App Name kann entfernt oder optional zentriert werden, falls gewünscht
      <span className="absolute left-1/2 transform -translate-x-1/2 font-headline text-xl md:text-2xl font-bold text-primary-dark tracking-wide">
        HF Mitfahrer APP
      </span>
      */}

      {/* Rechts: User Info & Dropdown */}
      {token && (
        <div className="relative flex flex-col items-end min-w-[120px]">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex flex-col items-end focus:outline-none"
          >
            <span className="text-primary-dark font-semibold text-base">{username}</span>
            <span className="text-neutral-dark font-semibold text-xs">{email}</span>
          </button>
          {/* Dropdown Menü */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
              <Link
                to="/profil"
                className="block px-4 py-2 hover:bg-neutral-light text-primary-dark"
                onClick={() => setMenuOpen(false)}
              >
                Profil/Benutzerdaten
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 hover:bg-neutral-light text-red-500"
              >
                Abmelden
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
