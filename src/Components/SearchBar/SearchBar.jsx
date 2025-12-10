// src/components/SearchBar/SearchBar.jsx
import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=5`
      );
      const data = await res.json();
      setResults(
        data.map((item) => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon), // IMPORTANT: convert lon -> lng
        }))
      );
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (place) => {
    if (!place || place.lat == null || place.lng == null) return;
    onSelect(place); // pass object { name, lat, lng }
    setQuery("");
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-input">
        <input
          type="text"
          value={query}
          placeholder="Search location..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((place, i) => (
            <li key={i} onClick={() => handleSelect(place)}>
              {place.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
