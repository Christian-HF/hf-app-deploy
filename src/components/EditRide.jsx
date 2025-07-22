// src/components/EditRide.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; // ggf. Pfad anpassen

function EditRide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fahrt, setFahrt] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fahrt vom Backend laden
  useEffect(() => {
    const ladeFahrt = async () => {
      setError(null);
      try {
        const res = await api.get(`/fahrten/${id}`);
        setFahrt(res.data);
      } catch (err) {
        setError("Fahrt konnte nicht geladen werden.");
      }
    };
    ladeFahrt();
  }, [id]);

  const handleChange = (key, value) => {
    setFahrt({ ...fahrt, [key]: value });
  };

  const handleZwischenstoppChange = (index, value) => {
    const neueStopps = [...fahrt.zwischenstopps];
    neueStopps[index] = value;
    setFahrt({ ...fahrt, zwischenstopps: neueStopps });
  };

  const addZwischenstopp = () => {
    setFahrt({ ...fahrt, zwischenstopps: [...fahrt.zwischenstopps, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const jetzt = new Date();
    const fahrtDatum = new Date(`${fahrt.datum}T${fahrt.zeit}`);
    if (fahrtDatum < jetzt) {
      setError("Bitte kein Datum in der Vergangenheit wählen.");
      return;
    }
    try {
      await api.put(`/fahrten/${id}`, fahrt);
      setSuccess(true);
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setError("Fahrt konnte nicht aktualisiert werden.");
    }
  };

  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!fahrt) return <p className="p-4">Lade Daten...</p>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <a href="/home" className="text-green-600 underline text-sm">← Zurück zur Übersicht</a>
      </div>
      <h2 className="text-xl font-bold text-green-700 mb-4">Fahrt bearbeiten</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" className="w-full p-2 border rounded" value={fahrt.start} onChange={(e) => handleChange("start", e.target.value)} required />
        <input type="text" className="w-full p-2 border rounded" value={fahrt.ziel} onChange={(e) => handleChange("ziel", e.target.value)} required />
        <input type="date" className="w-full p-2 border rounded" value={fahrt.datum} onChange={(e) => handleChange("datum", e.target.value)} required />
        <input type="time" className="w-full p-2 border rounded" value={fahrt.zeit} onChange={(e) => handleChange("zeit", e.target.value)} required />
        <input type="number" className="w-full p-2 border rounded" value={fahrt.maxMitfahrer} onChange={(e) => handleChange("maxMitfahrer", Number(e.target.value))} required />
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={fahrt.gepaeck} onChange={(e) => handleChange("gepaeck", e.target.checked)} />
          <span>Gepäck erlaubt?</span>
        </label>
        {fahrt.zwischenstopps.map((z, idx) => (
          <input
            key={idx}
            type="text"
            className="w-full p-2 border rounded"
            value={z}
            onChange={(e) => handleZwischenstoppChange(idx, e.target.value)}
          />
        ))}
        <button type="button" className="text-green-700 underline" onClick={addZwischenstopp}>
          + weiteren Zwischenstopp hinzufügen
        </button>
        <button type="submit" className="block mt-4 bg-green-700 text-white px-4 py-2 rounded">
          Änderungen speichern
        </button>
      </form>
      {success && (
        <p className="text-green-600 mt-2">Fahrt wurde erfolgreich aktualisiert.</p>
      )}
    </div>
  );
}

export default EditRide;
