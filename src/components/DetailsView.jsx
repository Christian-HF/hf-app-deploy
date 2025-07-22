import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Layout from "./Layout";
import FahrtMap from "./FahrtMap";

export default function DetailsView() {
  const { id } = useParams();
  const [fahrt, setFahrt] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFahrt() {
      try {
        const res = await api.get(`/fahrten/${id}`);
        setFahrt(res.data);
      } catch {
        setError("Fahrt konnte nicht geladen werden");
      }
    }
    fetchFahrt();
  }, [id]);

  if (error) return <Layout><p className="text-red-600">{error}</p></Layout>;
  if (!fahrt) return <Layout><p>Lade Daten…</p></Layout>;

  return (
    <Layout>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_6px_32px_0_rgba(100,100,100,0.18)] p-12 mt-14 border border-neutral-light">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-green-700 underline text-sm"
        >
          ← Zurück
        </button>
        <h2 className="text-2xl font-headline mb-2 text-primary-dark">
          {fahrt.start} → {fahrt.ziel}
        </h2>
        <p className="mb-1 text-gray-600">
          Datum: <b>{fahrt.datum}</b> um <b>{fahrt.zeit}</b>
        </p>
        <p className="mb-1 text-gray-600">
          Fahrer: <b>{fahrt.fahrer}</b>
        </p>
        <p className="mb-1 text-gray-600">
          Max. Mitfahrer: <b>{fahrt.maxMitfahrer}</b>
        </p>
        <p className="mb-1 text-gray-600">
          Gepäck: <b>{fahrt.gepaeck ? "Ja" : "Nein"}</b>
        </p>
        {fahrt.zwischenstopps?.length > 0 && (
          <p className="mb-1 text-gray-600">
            Zwischenstopps: {fahrt.zwischenstopps.filter(Boolean).join(", ")}
          </p>
        )}
        <div className="my-4">
          <FahrtMap
              start={fahrt.start}
              ziel={fahrt.ziel}
              zwischenstopps={fahrt.zwischenstopps}
          />
        </div>
      </div>
    </Layout>
  );
}

