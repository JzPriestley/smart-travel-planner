import React, { useEffect, useState } from "react";
import { Polyline } from "react-leaflet";

export default function AnimatedPolyline({ points, color = "#2196f3", weight = 4 }) {
  const [displayedPoints, setDisplayedPoints] = useState([]);

  useEffect(() => {
    let i = 0;
    setDisplayedPoints([]); // reset on points change
    const interval = setInterval(() => {
      if (i >= points.length) {
        clearInterval(interval);
        return;
      }
      const p = points[i];
      if (p?.lat != null && p?.lng != null) {
        setDisplayedPoints((prev) => [...prev, p]);
      }
      i++;
    }, 200); // 200ms between each point

    return () => clearInterval(interval);
  }, [points]);

  const validPoints = displayedPoints.filter(
    (p) => p && typeof p.lat === "number" && typeof p.lng === "number"
  );

  if (validPoints.length < 2) return null;

  return (
    <Polyline
      positions={validPoints.map((p) => [p.lat, p.lng])}
      pathOptions={{ color, weight }}
    />
  );
}
