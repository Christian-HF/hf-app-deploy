import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
    <header className="w-full bg-neutral-light shadow-md fixed top-0 left-0 z-30 h-16 px-4 md:px-8 flex items-center justify-between">
      {/* Mobile: Burger-Menü */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="p-2"
          aria-label="Menü öffnen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* App Name zentriert */}
      <span className="mx-auto absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-headline text-base sm:text-lg md:text-2xl font-bold text-primary-dark tracking-wide whitespace-nowrap">
        HF Fahrgemeinschaft
      </span>

      {/* Desktop: Navigation und Userinfo */}
      <div className="hidden md:flex items-center gap-6 w-full justify-between">
        <nav className="flex gap-6 items-center">
          <Link to="/home" className="text-primary-dark font-semibold">Übersicht</Link>
          <Link to="/search" className="text-primary-dark font-semibold">Fahrt suchen</Link>
          <Link to="/offer" className="text-primary-dark font-semibold">Fahrt anbieten</Link>
        </nav>
        {token && (
          <div className="relative flex flex-col items-end min-w-[120px]">
            <button
              onClick={() => setUserMenuOpen((open) => !open)}
              className="flex flex-col items-end focus:outline-none"
            >
              <span className="text-primary-dark font-semibold text-base">{username}</span>
              <span className="text-neutral-dark font-semibold text-xs">{email}</span>
            </button>
            {/* User-Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
                <Link
                  to="/profil"
                  className="block px-4 py-2 hover:bg-neutral-light text-primary-dark"
                  onClick={() => setUserMenuOpen(false)}
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
      </div>

      {/* Mobile: Offcanvas-Menü */}
      {menuOpen && (
        <nav className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-gray-200 py-4 flex flex-col items-center gap-4 z-40 shadow-lg">
          <Link to="/home" className="text-primary-dark font-semibold" onClick={() => setMenuOpen(false)}>Übersicht</Link>
          <Link to="/search" className="text-primary-dark font-semibold" onClick={() => setMenuOpen(false)}>Fahrt suchen</Link>
          <Link to="/offer" className="text-primary-dark font-semibold" onClick={() => setMenuOpen(false)}>Fahrt anbieten</Link>
          {token && (
            <>
              <Link to="/profil" className="text-primary-dark font-semibold" onClick={() => setMenuOpen(false)}>Profil/Benutzerdaten</Link>
              <button onClick={handleLogout} className="text-red-500 underline mt-2">Abmelden</button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
