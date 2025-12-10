import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import AnimatedPolyline from "../AnimatedPolyline/AnimatedPolyline";
import L from "leaflet";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NoteModal from "../NoteModal/NoteModal";
import { createNumberedIcon } from "../../lib/mapUtils";
import "./MapView.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({ points, setPoints, notes, setNotes }) {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleMarkerClick = (idx) => {
    setSelectedIdx(idx);
  };

  const handleNoteSave = (text) => {
    setNotes({ ...notes, [selectedIdx]: text });
    setSelectedIdx(null);
  };

  function AddMarker({ onAdd }) {
    useMapEvents({
        click(e) {
        const latlng = e.latlng;
        if (latlng?.lat != null && latlng?.lng != null) {
            onAdd({ lat: latlng.lat, lng: latlng.lng, name: null }); // name null for clicks
        }
        },
    });
    return null;
    }


  // Add a point safely from search
//   const handleSearchSelect = (place) => {
//     if (place?.lat != null && place?.lng != null) {
//       setPoints((prev) => [...prev, place]);
//     }
//   };

  return (
    <>
      <div className="map-hint">
        Click map to add a stop or Search a location <br />
        Click location marker on map to add a note 📝
      </div>

      <MapContainer
        center={[52.52, 13.405]}
        zoom={6}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AddMarker onAdd={(p) => setPoints((prev) => [...prev, p])} />


        // src/components/MapView.jsx (marker loop)
        {points.map((p, i) => {
        // defensive guard
        if (!p || typeof p.lat !== "number" || typeof p.lng !== "number") return null;

        return (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>
            <Marker
                position={[p.lat, p.lng]}                // <-- explicit array
                icon={createNumberedIcon(i + 1)}
                eventHandlers={{ click: () => handleMarkerClick(i) }}
            />
            </motion.div>
        );
        })}


        {points.length > 1 && (
          <AnimatedPolyline points={points} color="#2196f3" weight={4} />
        )}
      </MapContainer>

      <AnimatePresence>
        {selectedIdx !== null && (
          <NoteModal
            initialText={notes[selectedIdx] || ""}
            onSave={handleNoteSave}
            onClose={() => setSelectedIdx(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}


