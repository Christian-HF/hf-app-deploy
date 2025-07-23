import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header({ username }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative w-full bg-white/90 backdrop-blur-md shadow-sm fixed top-0 left-0 z-30 h-16 px-3 md:px-8 flex items-center">
      {/* App-Name: Desktop */}
      <div className="hidden md:flex flex-1 justify-center">
        <span className="font-headline text-2xl font-bold text-primary-dark tracking-wide text-center">
          HF Mitfahrer APP
        </span>
      </div>
      {/* Mobil: App-Name oben */}
      <div className="md:hidden flex-1 flex justify-center">
        <span className="font-headline text-xl font-bold text-primary-dark tracking-wide text-center">
          HF Mitfahrer APP
        </span>
      </div>

      {/* Desktop-Navigation */}
      <nav className="hidden md:flex gap-8 absolute left-8 top-0 h-16 items-center">
        <Link to="/home" className="text-primary-dark font-semibold">Home</Link>
        <Link to="/search" className="text-primary-dark font-semibold">Fahrt suchen</Link>
        <Link to="/offer" className="text-primary-dark font-semibold">Fahrt anbieten</Link>
        <Link to="/profil" className="text-primary-dark font-semibold">Profil</Link>
      </nav>

      {/* Username rechts auf Desktop */}
      <div className="hidden md:flex items-center absolute right-8 top-0 h-16">
        <span className="text-hf-green font-semibold text-base">{username}</span>
      </div>

      {/* Burger-Button (mobil) */}
      <button
        className="md:hidden ml-2 p-2 absolute right-2 top-2"
        onClick={() => setOpen(o => !o)}
        aria-label="Menü öffnen"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobil-Menü */}
      {open && (
        <nav className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 py-4 flex flex-col items-center gap-4 md:hidden z-40 shadow-lg">
          <Link to="/home" className="text-primary-dark font-semibold" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/search" className="text-primary-dark font-semibold" onClick={() => setOpen(false)}>Fahrt suchen</Link>
          <Link to="/offer" className="text-primary-dark font-semibold" onClick={() => setOpen(false)}>Fahrt anbieten</Link>
          <Link to="/profil" className="text-primary-dark font-semibold" onClick={() => setOpen(false)}>Profil</Link>
        </nav>
      )}
    </header>
  );
}
