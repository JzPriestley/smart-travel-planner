import { solveTSP } from "../../lib/tsp";
import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ItineraryPanel.css";

export default function ItineraryPanel({ points, setPoints, notes, setNotes }) {
  function optimize() {
    if (points.length < 3) return;
    const optimized = solveTSP(points);
    setPoints(optimized);
  }

  function clear() {
    setPoints([]);
    setNotes({});
  }

//   const handleSearchSelect = (latlng) => {
//   if (!latlng?.lat || !latlng?.lng) return;
//   setPoints((prevPoints) => [...prevPoints, latlng]);
//   };
        
    const handleSearchSelect = (place) => {
   
    if (!place?.lat && place?.lat !== 0) return;
    if (!place?.lng && place?.lng !== 0) return;

    setPoints((prev) => [...prev, place]); 
    };




  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newPoints = Array.from(points);
    const [moved] = newPoints.splice(result.source.index, 1);
    newPoints.splice(result.destination.index, 0, moved);
    setPoints(newPoints);
  };

  const exportPDF = async () => {
  const doc = new jsPDF();
  let y = 10;

  points.forEach((p, i) => {
    const title = `Stop ${i + 1}: ${p.name || "Unknown Place"}`;
    const coords = `Coordinates: ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`;
    const note = notes[i] ? `Note: ${notes[i]}` : "";

    doc.text(title, 10, y);
    y += 8;
    doc.text(coords, 10, y);
    y += 8;

    if (note) {
      doc.text(note, 10, y);
      y += 8;
    }

    y += 4; // space between stops
    });

    doc.save("itinerary.pdf");
    };


  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="itinerary-panel"
    >
      <h2 className="itinerary-title">Itinerary</h2>

      <SearchBar onSelect={handleSearchSelect} />
    

      <div className="itinerary-buttons">
        <button className="itinerary-button optimize-btn" onClick={optimize}>
          Optimize Route
        </button>
        <button className="itinerary-button clear-btn" onClick={clear}>
          Clear All
        </button>
        <button className="itinerary-button export-btn" onClick={exportPDF}>
          Export PDF
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="points">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="stop-list"
            >
              {points.map((p, i) => (
                <Draggable key={i} draggableId={String(i)} index={i}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="stop-item"
                    >
                      <span>
                        {/* Stop {i + 1}: {p.lat.toFixed(4)}, {p.lng.toFixed(4)} */}
                        Stop {i + 1}:  {p.name ? p.name : `Unnamed Location (${p.lat.toFixed(4)}, ${p.lng.toFixed(4)})`}
                      </span>
                      {notes[i] && <span>📝</span>}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </motion.div>
  );
}
