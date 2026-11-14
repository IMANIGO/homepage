export type RoutePoint = { lat: number; lng: number };

const OSRM_ENDPOINTS = [
  'https://router.project-osrm.org/route/v1/driving',
  'https://routing.openstreetmap.de/routed-car/route/v1/driving'
];

export function hasRoadGeometry(line: [number, number][] | undefined) {
  return Boolean(line && line.length > 4);
}

export async function fetchDrivingRouteLine(stops: RoutePoint[]): Promise<[number, number][]> {
  if (stops.length < 2) {
    return [];
  }

  const path = stops.map((stop) => `${stop.lng},${stop.lat}`).join(';');

  for (const base of OSRM_ENDPOINTS) {
    try {
      const response = await fetch(`${base}/${path}?overview=full&geometries=geojson`, {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        continue;
      }

      const data = (await response.json()) as {
        routes?: { geometry?: { coordinates: [number, number][] } }[];
      };
      const coordinates = data.routes?.[0]?.geometry?.coordinates;
      if (!coordinates?.length) {
        continue;
      }

      return coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
    } catch {
      continue;
    }
  }

  return [];
}
