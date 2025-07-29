import React, { useEffect, useState } from "react";
import ReactMapGL, { Source, Layer, Marker } from "react-map-gl";

const MAPBOX_TOKEN = "pk.eyJ1IjoiY2hyaXN0aWFud3MtaGYiLCJhIjoiY21kZWlyOGV1MDJzdTJrc2dub29ka2p3NSJ9.TQ5LnksSWzynrO3LdD7sQA";

function getBounds(coords) {
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
  coords.forEach(([lng, lat]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });
  return { minLat, maxLat, minLng, maxLng };
}

// Hilfsfunktion für alle Marker: Start, Stopps, Ziel
function getMarkerCoords(geometry, stops = []) {
  if (!geometry?.coordinates?.length) return [];
  const markers = [];
  // Start
  markers.push({ coord: geometry.coordinates[0], label: "S", color: "#27ae60" });
  // Stopps (Indices approximiert: falls du exakte Koordinaten hast, hier einsetzen!)
  stops.forEach((s, i) => {
    // Index für Stopp-Koordinate (grobe Annäherung: teile Strecke gleichmäßig)
    const idx = Math.round(((i + 1) * (geometry.coordinates.length - 1)) / (stops.length + 1));
    markers.push({ coord: geometry.coordinates[idx], label: `${i + 1}`, color: "#2980b9" });
  });
  // Ziel
  markers.push({ coord: geometry.coordinates[geometry.coordinates.length - 1], label: "Z", color: "#c0392b" });
  return markers;
}

export default function FahrtMap({ geometry, zwischenstopps = [] }) {
  const [viewport, setViewport] = useState({
    latitude: 51.1657,
    longitude: 10.4515,
    zoom: 6,
    width: "100%",
    height: "100%",
  });

  useEffect(() => {
    if (geometry && geometry.coordinates && geometry.coordinates.length > 1) {
      const bounds = getBounds(geometry.coordinates);
      const centerLat = (bounds.minLat + bounds.maxLat) / 2;
      const centerLng = (bounds.minLng + bounds.maxLng) / 2;
      const latDiff = bounds.maxLat - bounds.minLat;
      const lngDiff = bounds.maxLng - bounds.minLng;
      let zoom = 8;
      if (latDiff > 2 || lngDiff > 2) zoom = 6;
      if (latDiff > 6 || lngDiff > 6) zoom = 5;
      if (latDiff > 12 || lngDiff > 12) zoom = 4;
      setViewport(v => ({
        ...v,
        latitude: centerLat,
        longitude: centerLng,
        zoom,
      }));
    }
  }, [geometry]);

  if (!geometry || !geometry.coordinates || geometry.coordinates.length < 2) {
    return <div className="text-center text-gray-400">Keine Routendaten…</div>;
  }

  // MARKER: Start, Stopps, Ziel
  const markerList = getMarkerCoords(geometry, zwischenstopps);

  return (
    <div style={{ height: 320, borderRadius: 16, overflow: "hidden" }}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={setViewport}
        minZoom={2}
        maxZoom={16}
      >
        <Source id="route" type="geojson" data={{ type: "Feature", geometry }}>
          <Layer
            id="route"
            type="line"
            layout={{ "line-cap": "round", "line-join": "round" }}
            paint={{
              "line-color": "#2e7d32",
              "line-width": 4,
            }}
          />
        </Source>
        {/* Alle Marker */}
        {markerList.map((m, i) =>
          m.coord ? (
            <Marker key={i} longitude={m.coord[0]} latitude={m.coord[1]} anchor="bottom">
              <div
                style={{
                  background: m.color,
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  border: "2px solid white",
                  boxShadow: "0 0 3px #3334",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 11,
                }}
                title={i === 0 ? "Start" : i === markerList.length - 1 ? "Ziel" : `Stopp ${m.label}`}
              >
                {m.label}
              </div>
            </Marker>
          ) : null
        )}
      </ReactMapGL>
    </div>
  );
}
