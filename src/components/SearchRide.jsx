// src/components/SearchRide.jsx
import React, { useState } from "react";

function SearchRide({ fahrten, setFahrten }) {
  const [start, setStart] = useState("");
  const [ziel, setZiel] = useState("");
  const nutzer = localStorage.getItem("username") || "Gast";

  const handleBuchen = (id) => {
    const updated = fahrten.map((fahrt) => {
      if (
        fahrt.id === id &&
        !fahrt.mitfahrer.includes(nutzer) &&
        fahrt.fahrer !== nutzer
      ) {
        return {
          ...fahrt,
          mitfahrer: [...fahrt.mitfahrer, nutzer],
        };
      }
      return fahrt;
    });
    setFahrten(updated);
    localStorage.setItem("fahrten", JSON.stringify(updated));
  };

  const handleAustragen = (id) => {
    const updated = fahrten.map((fahrt) => {
      if (fahrt.id === id) {
        return {
          ...fahrt,
          mitfahrer: fahrt.mitfahrer.filter((m) => m !== nutzer),
        };
      }
      return fahrt;
    });
    setFahrten(updated);
    localStorage.setItem("fahrten", JSON.stringify(updated));
  };

  const gefilterteFahrten = fahrten
    .filter((fahrt) => {
      if (!start && !ziel) return true;
      const matchStart =
        !start ||
        fahrt.start.toLowerCase().includes(start.toLowerCase()) ||
        (fahrt.zwischenstopps &&
          fahrt.zwischenstopps.some((z) =>
            z.toLowerCase().includes(start.toLowerCase())
          ));
      const matchZiel =
        !ziel || fahrt.ziel.toLowerCase().includes(ziel.toLowerCase());
      return matchStart && matchZiel;
    })
    .sort(
      (a, b) =>
        new Date(`${a.datum}T${a.zeit}`) - new Date(`${b.datum}T${b.zeit}`)
    )
    .slice(0, 20);

  const FahrtCard = ({ fahrt }) => {
    const istGebucht = fahrt.mitfahrer.includes(nutzer);
    const istEigeneFahrt = fahrt.fahrer === nutzer;
    const freiePlaetze = fahrt.maxMitfahrer - fahrt.mitfahrer.length;

    return (
      <li className="border border-green-200 p-4 rounded shadow bg-white font-body">
        <p className="font-semibold font-headline text-lg text-primary-dark">
          {fahrt.start} → {fahrt.ziel}
        </p>
        <p className="text-sm text-gray-600">
          {fahrt.datum} um {fahrt.zeit} Uhr &nbsp;|&nbsp; 🚗 Fahrer: {fahrt.fahrer}
        </p>
        {fahrt.zwischenstopps.length > 0 && (
          <p className="text-sm text-gray-500">
            Zwischenstopps: {fahrt.zwischenstopps.join(", ")}
          </p>
        )}
        <p className="text-sm text-gray-500">
          Gepäck: {fahrt.gepaeck ? "✅" : "❌"} | Plätze: {freiePlaetze} frei
        </p>

        {!istEigeneFahrt &&
          (istGebucht ? (
            <button
              onClick={() => handleAustragen(fahrt.id)}
              className="mt-2 text-red-600 underline"
            >
              Buchung stornieren
            </button>
          ) : freiePlaetze > 0 ? (
            <button
              onClick={() => handleBuchen(fahrt.id)}
              className="mt-2 text-green-600 underline"
            >
              Mitfahren
            </button>
          ) : (
            <p className="text-red-600 mt-2">Keine Plätze frei</p>
          ))}

        {istEigeneFahrt && (
          <p className="text-gray-500 italic mt-2">Eigene Fahrt</p>
        )}
      </li>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto font-body">
      <div className="mb-4">
        <a href="/home" className="text-green-600 underline text-sm">
          ← Zurück zur Übersicht
        </a>
      </div>
      <h2 className="text-xl font-bold text-green-700 mb-4">Fahrt suchen</h2>
      <input
        className="border rounded p-2 mb-2 w-full"
        placeholder="Startort oder Zwischenstopp"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        className="border rounded p-2 mb-4 w-full"
        placeholder="Zielort"
        value={ziel}
        onChange={(e) => setZiel(e.target.value)}
      />
      {gefilterteFahrten.length === 0 ? (
        <p className="text-gray-600">Keine passenden Fahrten gefunden.</p>
      ) : (
        <ul className="space-y-4">
          {gefilterteFahrten.map((fahrt) => (
            <FahrtCard key={fahrt.id} fahrt={fahrt} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchRide;
