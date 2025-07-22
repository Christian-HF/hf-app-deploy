import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Layout from "./Layout";

function OfferRide() {
  const [start, setStart] = useState("");
  const [ziel, setZiel] = useState("");
  const [datum, setDatum] = useState("");
  const [zeit, setZeit] = useState("");
  const [maxMitfahrer, setMaxMitfahrer] = useState(1);
  const [gepaeck, setGepaeck] = useState(false);
  const [zwischenstopps, setZwischenstopps] = useState([""]);
  const [erfolgreichGespeichert, setErfolgreichGespeichert] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const nutzer = localStorage.getItem("username") || "Fahrer";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!start || !ziel || !datum || !zeit || !maxMitfahrer) {
      setError("Bitte alle Felder ausfüllen!");
      return;
    }

    const jetzt = new Date();
    const fahrtDatum = new Date(`${datum}T${zeit}`);
    if (fahrtDatum < jetzt) {
      setError("Bitte kein Datum in der Vergangenheit wählen.");
      return;
    }

    const neueFahrt = {
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

    try {
      await api.post("/fahrten", neueFahrt);
      setErfolgreichGespeichert(true);
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setError("Fehler beim Speichern!");
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_6px_32px_0_rgba(100,100,100,0.18)] p-8 mt-10 border border-neutral-light">
        <div className="mb-4">
          <a href="/home" className="text-green-600 underline text-sm">
            ← Zurück zur Übersicht
          </a>
        </div>
        <h2 className="text-xl font-headline text-primary mb-6">Fahrt einstellen</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input type="text" placeholder="Startort (mit Adresse)" className="w-full border border-hf-green rounded px-3 py-2" value={start} onChange={(e) => setStart(e.target.value)} required />
          <input type="text" placeholder="Zielort" className="w-full border border-hf-green rounded px-3 py-2" value={ziel} onChange={(e) => setZiel(e.target.value)} required />
          <input type="date" className="w-full border border-hf-green rounded px-3 py-2" value={datum} onChange={(e) => setDatum(e.target.value)} required />
          <input type="time" className="w-full border border-hf-green rounded px-3 py-2" value={zeit} onChange={(e) => setZeit(e.target.value)} required />
          <input type="number" placeholder="Max. Mitfahrer" min="1" className="w-full border border-hf-green rounded px-3 py-2" value={maxMitfahrer} onChange={(e) => setMaxMitfahrer(Number(e.target.value))} required />
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
              className="w-full border border-hf-green rounded px-3 py-2"
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
          <button type="submit" className="block mt-4 bg-hf-yellow text-gray-900 px-4 py-2 rounded hover:bg-hf-green hover:text-white">
            Fahrt speichern
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {erfolgreichGespeichert && (
          <label className="mt-4 flex items-center space-x-2 text-green-700">
            <input type="checkbox" checked readOnly />
            <span>Fahrt wurde erfolgreich gespeichert</span>
          </label>
        )}
      </div>
    </Layout>
  );
}

export default OfferRide;

