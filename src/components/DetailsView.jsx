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

  if (error)
    return (
      <Layout>
        <p className="text-red-600">{error}</p>
      </Layout>
    );
  if (!fahrt)
    return (
      <Layout>
        <p>Lade Daten…</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_6px_32px_0_rgba(100,100,100,0.18)] px-3 py-5 md:px-12 md:py-12 mt-4 md:mt-14 border border-neutral-light">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-green-700 underline text-sm"
        >
          ← Zurück
        </button>
        <h2 className="text-xl md:text-2xl font-headline mb-2 text-primary-dark">
          {fahrt.start} → {fahrt.ziel}
        </h2>

        {/* Abfahrtszeit klar hervorgehoben */}
        <p className="mb-2 text-gray-700 text-lg">
          <b>Abfahrt:</b> {fahrt.datum} um {fahrt.zeit}
        </p>

        {/* Kalender-Download-Button */}
        <button
          className="mt-2 mb-3 bg-green-100 text-green-800 px-3 py-1 rounded font-bold text-sm hover:bg-green-200"
          onClick={() => downloadICS(fahrt)}
        >
          Zum Kalender hinzufügen
        </button>

        <div className="mb-1 text-gray-600">
          Fahrer: <b>{fahrt.fahrer}</b>
        </div>
        <div className="mb-1 text-gray-600">
          Max. Mitfahrer: <b>{fahrt.maxMitfahrer}</b>
        </div>
        <div className="mb-1 text-gray-600">
          Gepäck: <b>{fahrt.gepaeck ? "Ja" : "Nein"}</b>
        </div>
        {fahrt.zwischenstopps?.length > 0 && (
          <div className="mb-1 text-gray-600">
            Zwischenstopps: {fahrt.zwischenstopps.filter(Boolean).join(", ")}
          </div>
        )}

        {/* Mitfahrer */}
        {fahrt.mitfahrer && fahrt.mitfahrer.length > 0 && (
          <div className="mb-2">
            <b className="text-primary-dark">Mitfahrer:</b>
            <ul className="ml-4 list-disc text-gray-700">
              {fahrt.mitfahrer.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Karte */}
        <div className="my-4">
          <FahrtMap
            start={fahrt.start}
            ziel={fahrt.ziel}
            zwischenstopps={fahrt.zwischenstopps}
            geometry={fahrt.geometry} // <-- Route als GeoJSON!
          />
        </div>

        {/* Gefahrene Autobahnen als Pillen */}
        {fahrt.autobahnen && fahrt.autobahnen.length > 0 && (
          <div className="my-6">
            <h3 className="text-lg font-semibold text-primary-dark mb-2">
              Gefahrene Autobahnen
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {fahrt.autobahnen.map((a, i) => (
                <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-mono border border-green-300">
                  {a}
                </span>
              ))}
            </div>

            {/* Ankunftszeiten (Stopps & Ziel) */}
            <h4 className="font-medium text-base mb-1 text-gray-700">Ankunftszeiten:</h4>
            <ul className="list-disc pl-5 text-gray-700">
              {fahrt.zwischenstopps?.map((stop, i) => (
                <li key={i}>
                  {stop}:{" "}
                  {fahrt.ankunftszeiten?.[i]
                    ? new Date(fahrt.ankunftszeiten[i]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "-"}
                </li>
              ))}
              <li>
                Ziel ({fahrt.ziel}):{" "}
                {fahrt.ankunftszeiten && fahrt.ankunftszeiten.length
                  ? new Date(fahrt.ankunftszeiten[fahrt.ankunftszeiten.length - 1]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "-"}
              </li>
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}

// --- ICS-Download-Funktion ---
function downloadICS(fahrt) {
  if (!fahrt) return;

  // Start- und Endzeit für den Kalender: Endzeit = Abfahrt + 30min als Platzhalter
  const startDateTime = new Date(`${fahrt.datum}T${fahrt.zeit}`);
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // +30 Minuten

  function formatICSDate(d) {
    // YYYYMMDDTHHmmssZ (UTC)
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }

  // Beschreibung & Titel
  const stops = (fahrt.zwischenstopps || []).join(", ");
  const desc =
    `Mitfahrgelegenheit von ${fahrt.start} nach ${fahrt.ziel}` +
    (stops ? ` (über ${stops})` : "") +
    `\nFahrer: ${fahrt.fahrer}\nMax. Mitfahrer: ${fahrt.maxMitfahrer}\nGepäck: ${fahrt.gepaeck ? "Ja" : "Nein"}`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startDateTime)}`,
    `DTEND:${formatICSDate(endDateTime)}`,
    `SUMMARY:Mitfahrt ${fahrt.start} → ${fahrt.ziel}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${fahrt.start} → ${fahrt.ziel}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Mitfahrt_${fahrt.start}_${fahrt.ziel}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
