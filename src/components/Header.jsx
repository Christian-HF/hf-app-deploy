import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
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
      {/* Menü (links, auch Burger für mobile) */}
      <div className="flex items-center">
        {/* Burger-Menü nur auf Mobile */}
        {token && (
          <button
            className="md:hidden mr-2 p-2"
            onClick={() => setOpen(o => !o)}
            aria-label="Menü öffnen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        {/* Desktop-Menü */}
        {token && (
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/home" className="text-primary-dark font-semibold">Home</Link>
            <Link to="/search" className="text-primary-dark font-semibold">Fahrt suchen</Link>
            <Link to="/offer" className="text-primary-dark font-semibold">Fahrt anbieten</Link>
            <Link to="/profil" className="text-primary-dark font-semibold">Profil</Link>
            <button onClick={handleLogout} className="text-red-500 underline ml-2">Abmelden</button>
          </nav>
        )}
      </div>

      {/* App Name (zentriert, immer sichtbar) */}
      <span className="absolute left-1/2 transform -translate-x-1/2 font-headline text-xl md:text-2xl font-bold text-primary-dark tracking-wide">
        HF Mitfahrer APP
      </span>

      {/* Userinfo (rechts) */}
      {token && (
        <div className="flex flex-col items-end min-w-[120px]">
          <span className="text-primary-dark font-semibold text-xs md:text-base">{username}</span>
          <span className="text-neutral-dark font-semibold text-xs">{email}</span>
        </div>
      )}

      {/* Mobil-Menü (bei Burger-Click, nur Mobile!) */}
      {token && open && (
        <nav className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 py-4 flex flex-col items-center gap-4 md:hidden z-40 shadow-lg">
          <Link to="/home" className="text-primary-dark font-semibold" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/search" className="text-primary-dark font-semibold" onClick={() => setOpen(false)}>Fahrt suchen</Link>
          <Link to="/offer" className="text-primary-dark font-semibold" onClick={() => setOpen(false)}>Fahrt anbieten</Link>
          <Link to="/profil" className="text-primary-dark font-semibold" onClick={() => setOpen(false)}>Profil</Link>
          <button onClick={handleLogout} className="text-red-500 underline mt-2">Abmelden</button>
        </nav>
      )}
    </header>
  );
}
