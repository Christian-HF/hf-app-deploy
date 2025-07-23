import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Layout from "./Layout";

export default function EditRide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    start: "",
    ziel: "",
    datum: "",
    zeit: "",
    maxMitfahrer: 3,
    gepaeck: false,
    zwischenstopps: [""],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFahrt() {
      try {
        const res = await api.get(`/fahrten/${id}`);
        // Wenn keine Zwischenstopps, immer als Array setzen!
        setForm({
          ...res.data,
          zwischenstopps:
            res.data.zwischenstopps && res.data.zwischenstopps.length > 0
              ? res.data.zwischenstopps
              : [""],
        });
      } catch {
        setError("Fahrt konnte nicht geladen werden.");
      }
    }
    fetchFahrt();
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleZwischenstopp = (val, idx) => {
    const arr = [...form.zwischenstopps];
    arr[idx] = val;
    setForm(f => ({ ...f, zwischenstopps: arr }));
  };

  const addZwischenstopp = () =>
    setForm(f => ({
      ...f,
      zwischenstopps: [...f.zwischenstopps, ""],
    }));

  const removeZwischenstopp = idx =>
    setForm(f => ({
      ...f,
      zwischenstopps: f.zwischenstopps.filter((_, i) => i !== idx),
    }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.start || !form.ziel || !form.datum || !form.zeit) {
      setError("Bitte alle Pflichtfelder ausfüllen!");
      return;
    }
    try {
      await api.put(`/fahrten/${id}`, {
        ...form,
        zwischenstopps: form.zwischenstopps.filter(Boolean),
      });
      navigate("/home");
    } catch {
      setError("Speichern fehlgeschlagen!");
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-[0_6px_32px_0_rgba(100,100,100,0.18)] px-3 py-6 md:px-8 md:py-10 mt-8 border border-neutral-light">
        <h2 className="text-xl md:text-2xl font-headline mb-4 text-primary-dark text-center">
          Fahrt bearbeiten
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border border-hf-green rounded px-3 py-2 w-full"
            name="start"
            placeholder="Startort"
            value={form.start}
            onChange={handleChange}
          />
          <input
            className="border border-hf-green rounded px-3 py-2 w-full"
            name="ziel"
            placeholder="Zielort"
            value={form.ziel}
            onChange={handleChange}
          />
          <div className="flex gap-2 flex-col md:flex-row">
            <input
              type="date"
              className="border border-hf-green rounded px-3 py-2 flex-1"
              name="datum"
              value={form.datum}
              onChange={handleChange}
            />
            <input
              type="time"
              className="border border-hf-green rounded px-3 py-2 flex-1"
              name="zeit"
              value={form.zeit}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-col md:flex-row">
            <input
              type="number"
              min="1"
              max="7"
              className="border border-hf-green rounded px-3 py-2 flex-1"
              name="maxMitfahrer"
              value={form.maxMitfahrer}
              onChange={handleChange}
              placeholder="Max. Mitfahrer"
            />
            <label className="flex items-center gap-2 flex-1">
              <input
                type="checkbox"
                className="accent-primary"
                name="gepaeck"
                checked={form.gepaeck}
                onChange={handleChange}
              />
              Gepäck möglich?
            </label>
          </div>
          {/* Zwischenstopps */}
          {form.zwischenstopps.map((stopp, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                className="border border-hf-green rounded px-3 py-2 flex-1"
                placeholder={`Zwischenstopp ${idx + 1}`}
                value={stopp}
                onChange={e => handleZwischenstopp(e.target.value, idx)}
              />
              {form.zwischenstopps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeZwischenstopp(idx)}
                  className="text-red-500 text-lg px-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addZwischenstopp}
            className="text-primary hover:text-primary-dark text-sm underline self-end"
          >
            + Zwischenstopp hinzufügen
          </button>
          {error && <p className="text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary-dark transition"
          >
            Fahrt speichern
          </button>
        </form>
      </div>
    </Layout>
  );
}
