import L from "leaflet";

export function createNumberedIcon(number) {
  return L.divIcon({
    className: "numbered-marker",
    html: `<div class="numbered-marker-inner">${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
}
