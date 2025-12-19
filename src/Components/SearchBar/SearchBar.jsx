import React, { useState, useRef, useEffect } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cacheRef = useRef({}); // cache previous queries
  const debounceRef = useRef(null);

  const fetchResults = async (q) => {
    if (!q) return;
    setLoading(true);
    setError("");

    // Use cache if available
    if (cacheRef.current[q]) {
      setResults(cacheRef.current[q]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          q
        )}&format=json&limit=5`
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const formatted = data.map((item) => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
      setResults(formatted);
      cacheRef.current[q] = formatted; // save in cache
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setError("Unable to fetch results. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q) => {
    if (!q) return;
    fetchResults(q);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    // Debounce search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch(val);
    }, 500); // 500ms delay
  };

  const handleSelect = (place) => {
    if (!place || place.lat == null || place.lng == null) return;
    onSelect(place);
    setQuery("");
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(query);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-input">
        <input
          type="text"
          value={query}
          placeholder="Search location..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => handleSearch(query)} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="search-error">{error}</div>}

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
