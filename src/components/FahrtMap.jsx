import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker, Source, Layer } from "react-map-gl";

// Trage HIER deinen Mapbox Token ein
const MAPBOX_TOKEN = "pk.eyJ1IjoiY2hyaXN0aWFud3MtaGYiLCJhIjoiY21kZWlyOGV1MDJzdTJrc2dub29ka2p3NSJ9.TQ5LnksSWzynrO3LdD7sQA";

const defaultCoords = {
  Berlin: [13.405, 52.52],
  Hamburg: [9.993, 53.551],
  München: [11.582, 48.135],
  // Weitere Städte als Fallback
};

async function geocode(address) {
  const resp = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`
  );
  const data = await resp.json();
  if (
    data.features &&
    data.features.length > 0 &&
    data.features[0].geometry &&
    data.features[0].geometry.coordinates
  ) {
    return data.features[0].geometry.coordinates;
  }
  // Fallback: Städte aus defaultCoords
  if (defaultCoords[address]) return defaultCoords[address];
  return null;
}

export default function FahrtMap({ start, ziel }) {
  const [startCoords, setStartCoords] = useState(null);
  const [zielCoords, setZielCoords] = useState(null);

  // Interaktiver Viewport
  const [viewport, setViewport] = useState({
    latitude: 51,
    longitude: 10,
    zoom: 5.5,
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchCoords() {
      const s = await geocode(start);
      const z = await geocode(ziel);
      if (isMounted) {
        setStartCoords(s);
        setZielCoords(z);
      }
    }
    fetchCoords();
    return () => {
      isMounted = false;
    };
  }, [start, ziel]);

  // Update Map-Center, sobald Koordinaten bekannt
  useEffect(() => {
    if (startCoords && zielCoords) {
      setViewport(v => ({
        ...v,
        latitude: (startCoords[1] + zielCoords[1]) / 2,
        longitude: (startCoords[0] + zielCoords[0]) / 2,
        zoom: 5.5
      }));
    }
  }, [startCoords, zielCoords]);

  if (!startCoords || !zielCoords) {
    return <div className="text-center text-gray-400">Lade Karte…</div>;
  }

  const route = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [startCoords, zielCoords],
    },
  };

  return (
    <div className="w-full max-w-4xl h-[620px] mx-auto rounded-xl overflow-hidden my-3 border border-gray-200 shadow-md">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={setViewport}
      >
        {/* Start Marker */}
        <Marker longitude={startCoords[0]} latitude={startCoords[1]}>
          <div className="text-xs bg-white/90 rounded px-1 mt-1 text-green-800 font-bold border border-green-500 shadow">
            {start}
          </div>
        </Marker>
        {/* Ziel Marker */}
        <Marker longitude={zielCoords[0]} latitude={zielCoords[1]}>
          <div className="text-xs bg-white/90 rounded px-1 mt-1 text-red-700 font-bold border border-red-400 shadow">
            {ziel}
          </div>
        </Marker>
        {/* Route als Linie */}
        <Source id="route" type="geojson" data={route}>
          <Layer
            id="route"
            type="line"
            source="route"
            layout={{ "line-cap": "round", "line-join": "round" }}
            paint={{
              "line-color": "#2e7d32",
              "line-width": 4,
            }}
          />
        </Source>
      </ReactMapGL>
    </div>
  );
}
