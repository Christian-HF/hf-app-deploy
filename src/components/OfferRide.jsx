// src/components/OfferRide.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function OfferRide({ fahrten, setFahrten }) {
  const [start, setStart] = useState("");
  const [ziel, setZiel] = useState("");
  const [datum, setDatum] = useState("");
  const [zeit, setZeit] = useState("");
  const [maxMitfahrer, setMaxMitfahrer] = useState(1);
  const [gepaeck, setGepaeck] = useState(false);
  const [zwischenstopps, setZwischenstopps] = useState([""]);
  const [erfolgreichGespeichert, setErfolgreichGespeichert] = useState(false);
  const navigate = useNavigate();

  const nutzer = localStorage.getItem("username") || "Fahrer";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!start || !ziel || !datum || !zeit || !maxMitfahrer) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    const jetzt = new Date();
    const fahrtDatum = new Date(`${datum}T${zeit}`);
    if (fahrtDatum < jetzt) {
      alert("Bitte kein Datum in der Vergangenheit wählen.");
      return;
    }

    const neueFahrt = {
      id: Date.now(),
      start,
      ziel,
      datum,
      zeit,
      maxMitfahrer,
      gepaeck,
      zwischenstopps: zwischenstopps.filter(Boolean),
      fahrer: nutzer,
      mitfahrer: [],
    };

    const gespeicherte = JSON.parse(localStorage.getItem("fahrten")) || [];
    const neueFahrten = [...gespeicherte, neueFahrt];

    localStorage.setItem("fahrten", JSON.stringify(neueFahrten));
    setFahrten(neueFahrten);
    setErfolgreichGespeichert(true);
    setTimeout(() => navigate("/home"), 1000);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <a href="/home" className="text-green-600 underline text-sm">
          ← Zurück zur Übersicht
        </a>
      </div>
      <h2 className="text-xl font-bold text-green-700 mb-4">Fahrt einstellen</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" placeholder="Startort (mit Adresse)" className="w-full p-2 border rounded" value={start} onChange={(e) => setStart(e.target.value)} required />
        <input type="text" placeholder="Zielort" className="w-full p-2 border rounded" value={ziel} onChange={(e) => setZiel(e.target.value)} required />
        <input type="date" className="w-full p-2 border rounded" value={datum} onChange={(e) => setDatum(e.target.value)} required />
        <input type="time" className="w-full p-2 border rounded" value={zeit} onChange={(e) => setZeit(e.target.value)} required />
        <input type="number" placeholder="Max. Mitfahrer" min="1" className="w-full p-2 border rounded" value={maxMitfahrer} onChange={(e) => setMaxMitfahrer(Number(e.target.value))} required />
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={gepaeck} onChange={(e) => setGepaeck(e.target.checked)} />
          <span>Gepäck erlaubt?</span>
        </label>
        <p className="font-semibold mt-4">Zwischenstopps (optional):</p>
        {zwischenstopps.map((z, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Zwischenstopp ${idx + 1}`}
            className="w-full p-2 border rounded"
            value={z}
            onChange={(e) => {
              const newZ = [...zwischenstopps];
              newZ[idx] = e.target.value;
              setZwischenstopps(newZ);
            }}
          />
        ))}
        <button type="button" className="text-green-700 underline" onClick={() => setZwischenstopps([...zwischenstopps, ""])}>
          + weiteren Zwischenstopp hinzufügen
        </button>
        <button type="submit" className="block mt-4 bg-green-700 text-white px-4 py-2 rounded">
          Fahrt speichern
        </button>
      </form>
      {erfolgreichGespeichert && (
        <label className="mt-4 flex items-center space-x-2 text-green-700">
          <input type="checkbox" checked readOnly />
          <span>Fahrt wurde erfolgreich gespeichert</span>
        </label>
      )}
    </div>
  );
}

export default OfferRide;

