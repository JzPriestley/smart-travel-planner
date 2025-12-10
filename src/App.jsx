import { useState } from "react";
import MapView from "./Components/Mapview/MapView";
import ItineraryPanel from "./Components/ItineraryPanel/ItineraryPanel";

export default function App() {
  const [points, setPoints] = useState([]);
  const [notes, setNotes] = useState({}); // key: index, value: text

  return (
    <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", height: "100%" }}>
      <MapView points={points} setPoints={setPoints} notes={notes} setNotes={setNotes} />
      <ItineraryPanel points={points} setPoints={setPoints} notes={notes} setNotes={setNotes} />
    </div>
  );
}
