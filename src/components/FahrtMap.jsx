import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker, Source, Layer } from "react-map-gl";

const MAPBOX_TOKEN = "pk.eyJ1IjoiY2hyaXN0aWFud3MtaGYiLCJhIjoiY21kZWlyOGV1MDJzdTJrc2dub29ka2p3NSJ9.TQ5LnksSWzynrO3LdD7sQA";

const defaultCoords = {
  Berlin: [13.405, 52.52],
  Hamburg: [9.993, 53.551],
  München: [11.582, 48.135],
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
  if (defaultCoords[address]) return defaultCoords[address];
  return null;
}

export default function FahrtMap({ start, ziel, zwischenstopps = [] }) {
  const [coordsArray, setCoordsArray] = useState(null);

  // Interaktiver Viewport
  const [viewport, setViewport] = useState({
    latitude: 51,
    longitude: 10,
    zoom: 5.5,
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchAllCoords() {
      const allPlaces = [start, ...zwischenstopps.filter(Boolean), ziel];
      const promises = allPlaces.map(geocode);
      const coords = await Promise.all(promises);
      if (isMounted) setCoordsArray(coords);
    }
    fetchAllCoords();
    return () => { isMounted = false; };
  }, [start, ziel, zwischenstopps]);

  // Map-Center bei neuen Koordinaten
  useEffect(() => {
    if (coordsArray && coordsArray.length > 1 && coordsArray.every(Boolean)) {
      const lng = coordsArray.map(c => c[0]);
      const lat = coordsArray.map(c => c[1]);
      setViewport(v => ({
        ...v,
        latitude: lat.reduce((a, b) => a + b, 0) / lat.length,
        longitude: lng.reduce((a, b) => a + b, 0) / lng.length,
        zoom: 5.5,
      }));
    }
  }, [coordsArray]);

  if (!coordsArray || coordsArray.some(c => !c)) {
    return <div className="text-center text-gray-400">Lade Karte…</div>;
  }

  const route = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordsArray,
    },
  };

  return (
    <div className="relative w-full max-w-4xl h-[260px] sm:h-[320px] md:h-[420px] mx-auto rounded-xl overflow-hidden my-3 border border-gray-200 shadow-md">
      {/* Zoom-Buttons (mobil freundlich) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button
          onClick={() => setViewport(v => ({ ...v, zoom: v.zoom + 0.5 }))}
          className="bg-white rounded-full p-2 shadow text-lg font-bold border border-gray-300"
          aria-label="Zoom in"
        >+</button>
        <button
          onClick={() => setViewport(v => ({ ...v, zoom: v.zoom - 0.5 }))}
          className="bg-white rounded-full p-2 shadow text-lg font-bold border border-gray-300"
          aria-label="Zoom out"
        >−</button>
      </div>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={setViewport}
        dragPan={true}
        scrollZoom={true}
        touchZoom={true}
        doubleClickZoom={true}
        minZoom={2}
        maxZoom={16}
      >
        {/* Marker für alle Orte */}
        {coordsArray.map((coord, idx) => (
          <Marker key={idx} longitude={coord[0]} latitude={coord[1]}>
            <div className={`text-xs bg-white/90 rounded px-1 mt-1 font-bold border shadow
              ${idx === 0
                ? "text-green-800 border-green-500"
                : idx === coordsArray.length - 1
                ? "text-red-700 border-red-400"
                : "text-blue-800 border-blue-400"}
            `}>
              {idx === 0
                ? start
                : idx === coordsArray.length - 1
                ? ziel
                : zwischenstopps[idx - 1]}
            </div>
          </Marker>
        ))}
        {/* Route */}
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

