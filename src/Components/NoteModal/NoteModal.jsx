import React , { useState } from "react";
import { motion } from "framer-motion";

export default function NoteModal({ initialText, onSave, onClose }) {
  const [text, setText] = useState(initialText);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        padding: "1rem",
        borderRadius: "10px",
        boxShadow: "0px 5px 20px rgba(0,0,0,0.3)",
        zIndex: 1000,
        width: "300px"
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", height: "100px" }}
      />
      <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
        <button onClick={onClose} style={{ marginRight: "0.5rem", background: "#ccc", padding: "0.3rem 0.6rem" }}>Cancel</button>
        <button onClick={() => onSave(text)} style={{ background: "#4caf50", color: "white", padding: "0.3rem 0.6rem" }}>Save</button>
      </div>
    </motion.div>
  );
}
