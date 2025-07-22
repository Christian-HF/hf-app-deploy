import React, { useState, useEffect } from "react";
import api from "../api";
import Layout from "./Layout";

function SearchRide() {
  const [fahrten, setFahrten] = useState([]);
  const [start, setStart] = useState("");
  const [ziel, setZiel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nutzer = localStorage.getItem("username") || "Gast";

  useEffect(() => {
    ladeFahrten();
  }, []);

  const ladeFahrten = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/fahrten");
      setFahrten(res.data);
    } catch (err) {
      setError("Fahrten konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuchen = async (id) => {
    try {
      const fahrt = fahrten.find(f => (f._id || f.id) === id);
      if (!fahrt) return;
      const neueMitfahrer = [...fahrt.mitfahrer, nutzer];
      await api.put(`/fahrten/${id}`, { ...fahrt, mitfahrer: neueMitfahrer });
      ladeFahrten();
    } catch (err) {
      alert("Fehler beim Buchen!");
    }
  };

  const handleAustragen = async (id) => {
    try {
      const fahrt = fahrten.find(f => (f._id || f.id) === id);
      if (!fahrt) return;
      const neueMitfahrer = fahrt.mitfahrer.filter(m => m !== nutzer);
      await api.put(`/fahrten/${id}`, { ...fahrt, mitfahrer: neueMitfahrer });
      ladeFahrten();
    } catch (err) {
      alert("Fehler beim Austragen!");
    }
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
    const id = fahrt._id || fahrt.id;
    const istGebucht = fahrt.mitfahrer.includes(nutzer);
    const istEigeneFahrt = fahrt.fahrer === nutzer;
    const freiePlaetze = fahrt.maxMitfahrer - fahrt.mitfahrer.length;

    return (
      <li className="border border-hf-green p-4 rounded shadow bg-white font-body">
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
              onClick={() => handleAustragen(id)}
              className="mt-2 text-red-600 underline"
            >
              Buchung stornieren
            </button>
          ) : freiePlaetze > 0 ? (
            <button
              onClick={() => handleBuchen(id)}
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
    <Layout>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_6px_32px_0_rgba(100,100,100,0.18)] p-8 mt-10 border border-neutral-light">
        <div className="mb-4">
          <a href="/home" className="text-green-600 underline text-sm">
            ← Zurück zur Übersicht
          </a>
        </div>
        <h2 className="text-xl font-headline text-primary mb-6">Fahrt suchen</h2>
        <input
          className="border border-hf-green rounded px-3 py-2 mb-2 w-full"
          placeholder="Startort oder Zwischenstopp"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          className="border border-hf-green rounded px-3 py-2 mb-4 w-full"
          placeholder="Zielort"
          value={ziel}
          onChange={(e) => setZiel(e.target.value)}
        />
        {loading && <p>Lade Fahrten...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {gefilterteFahrten.length === 0 && !loading ? (
          <p className="text-gray-600">Keine passenden Fahrten gefunden.</p>
        ) : (
          <ul className="space-y-4">
            {gefilterteFahrten.map((fahrt) => (
              <FahrtCard key={fahrt._id || fahrt.id} fahrt={fahrt} />
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default SearchRide;
