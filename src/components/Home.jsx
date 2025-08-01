import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Layout from "./Layout";

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

  const FahrtCard = ({ fahrt, kannBearbeiten = false }) => {
    const id = fahrt._id || fahrt.id;
    return (
      <li className="border border-hf-green p-4 rounded shadow bg-white font-body">
        <Link
          to={`/details/${id}`}
          className="block text-lg font-headline text-primary-dark font-bold hover:underline"
        >
          {fahrt.start} → {fahrt.ziel}
        </Link>
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
              to={`/edit/${id}`}
              className="text-primary text-sm underline"
            >
              Bearbeiten
            </Link>
            <button
              onClick={() => loeschen(id)}
              className="text-red-600 text-sm underline"
            >
              Löschen
            </button>
          </div>
        )}
      </li>
    );
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_6px_32px_0_rgba(100,100,100,0.18)] px-3 py-6 md:px-8 md:py-12 mt-4 md:mt-10 border border-neutral-light">
        <h1 className="text-xl md:text-2xl font-headline mb-4 text-primary-dark">
          Hallo {username}, schön dass du da bist!
        </h1>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-8">
          <Link to="/search" className="w-full md:w-auto bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition text-center">
            Fahrt suchen & buchen
          </Link>
          <Link to="/offer" className="w-full md:w-auto bg-hf-yellow text-gray-900 px-4 py-2 rounded font-semibold hover:bg-[#bda751] transition text-center">
            Neue Fahrt einstellen
          </Link>
        </div>
        {loading && <p>Lade Fahrten...</p>}
        {error && <p className="text-red-600">{error}</p>}
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
    </Layout>
  );
}
