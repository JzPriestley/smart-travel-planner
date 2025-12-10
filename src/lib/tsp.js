export function solveTSP(points) {
  if (points.length <= 1) return points;

  const remaining = [...points];
  const route = [remaining.shift()];

  while (remaining.length) {
    const last = route[route.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;

    remaining.forEach((p, i) => {
      const d = Math.hypot(p.lat - last.lat, p.lng - last.lng);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    });

    route.push(remaining.splice(nearestIdx, 1)[0]);
  }

  return route;
}
