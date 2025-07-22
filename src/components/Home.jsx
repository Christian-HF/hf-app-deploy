// src/components/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api"; // ggf. Pfad anpassen

export default function Home() {
  const username = localStorage.getItem("username") || "User";
  const [alleFahrten, setAlleFahrten] = useState([]);
  const [meineFahrten, setMeineFahrten] = useState([]);
  const [gebuchteFahrten, setGebuchteFahrten] = useState([]);
  const [naechsteFahrten, setNaechsteFahrten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ladeFahrten();
    // eslint-disable-next-line
  }, []);

  const ladeFahrten = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/fahrten");
      const gespeicherte = res.data;
      const mitDatum = gespeicherte
        .filter(f => f.datum && f.zeit)
        .sort((a, b) => new Date(`${a.datum}T${a.zeit}`) - new Date(`${b.datum}T${b.zeit}`));
      const top20 = mitDatum.slice(0, 20);
      const eigene = gespeicherte.filter(f => f.fahrer === username);
      const gebucht = gespeicherte.filter(f => (f.mitfahrer || []).includes(username));
      setAlleFahrten(gespeicherte);
      setMeineFahrten(eigene);
      setGebuchteFahrten(gebucht);
      setNaechsteFahrten(top20);
    } catch (err) {
      setError("Fehler beim Laden der Fahrten");
    } finally {
      setLoading(false);
    }
  };

  const loeschen = async (id) => {
    try {
      await api.delete(`/fahrten/${id}`);
      ladeFahrten();
    } catch (err) {
      alert("Fehler beim Löschen!");
    }
  };

  const FahrtCard = ({ fahrt, kannBearbeiten = false }) => (
    <li className="border border-green-200 p-4 rounded shadow bg-white font-body">
      <p className="font-semibold font-headline text-lg text-primary-dark">
        {fahrt.start} → {fahrt.ziel}
      </p>
      <p className="text-sm text-gray-600">
        {fahrt.datum} um {fahrt.zeit} Uhr &nbsp;|&nbsp; 🚗 Fahrer: {fahrt.fahrer}
      </p>
      <p className="text-sm text-gray-500">
        Gepäck: {fahrt.gepaeck ? "✅" : "❌"} | Plätze: {fahrt.maxMitfahrer - (fahrt.mitfahrer?.length || 0)} frei
      </p>
      {kannBearbeiten && fahrt.mitfahrer.length > 0 && (
        <p className="text-sm text-gray-500 mt-1">
          Mitfahrer: {fahrt.mitfahrer.join(", ")}
        </p>
      )}
      {kannBearbeiten && (
        <div className="flex gap-4 mt-2">
          <Link
            to={`/edit/${fahrt._id || fahrt.id}`} // id kann _id oder id sein, je nach Backend
            className="text-primary text-sm underline"
          >
            Bearbeiten
          </Link>
          <button
            onClick={() => loeschen(fahrt._id || fahrt.id)}
            className="text-red-600 text-sm underline"
          >
            Löschen
          </button>
        </div>
      )}
    </li>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto font-body">
      <h1 className="text-2xl font-headline mb-4 text-primary-dark">
        Hallo {username}, schön dass du da bist!
      </h1>

      <div className="flex gap-4 mb-8">
        <Link to="/search" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
          Fahrt suchen & buchen
        </Link>
        <Link to="/offer" className="bg-accent text-gray-900 px-4 py-2 rounded hover:bg-green-300">
          Neue Fahrt einstellen
        </Link>
      </div>

      {loading && <p>Lade Fahrten...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Linke Seite – Top 20 */}
        <div>
          <h2 className="text-xl font-headline mb-2 text-primary-dark">🚗 Nächste anstehende Fahrten</h2>
          {naechsteFahrten.length === 0 ? (
            <p className="text-gray-600">Keine Fahrten gespeichert.</p>
          ) : (
            <ul className="space-y-3">
              {naechsteFahrten.map(f => <FahrtCard key={f._id || f.id} fahrt={f} />)}
            </ul>
          )}
        </div>

        {/* Rechte Seite – Eigene & Gebuchte */}
        <div>
          <div className="border-b border-gray-300 pb-4 mb-4">
            <h2 className="text-xl font-headline mb-2 text-primary-dark">📝 Deine eingestellten Fahrten</h2>
            {meineFahrten.length === 0 ? (
              <p className="text-gray-600">Du hast noch keine Fahrten erstellt.</p>
            ) : (
              <ul className="space-y-3">
                {meineFahrten.map(f => (
                  <FahrtCard key={f._id || f.id} fahrt={f} kannBearbeiten={true} />
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-xl font-headline mb-2 text-primary-dark">🎟️ Deine gebuchten Fahrten</h2>
            {gebuchteFahrten.length === 0 ? (
              <p className="text-gray-600">Du hast noch keine Fahrten gebucht.</p>
            ) : (
              <ul className="space-y-3">
                {gebuchteFahrten.map(f => <FahrtCard key={f._id || f.id} fahrt={f} />)}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
