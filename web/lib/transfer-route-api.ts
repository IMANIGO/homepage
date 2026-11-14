import { createGeocoder } from './geocode-place';
import { fetchDrivingRouteLine } from './osrm-line';

export type RouteCoordinates = { lat: number; lng: number };

export type TransferRouteResponse = {
  stops: RouteCoordinates[];
  routeLine: [number, number][];
};

const routeCache = new Map<string, TransferRouteResponse | null>();
const { geocodePlace } = createGeocoder({ userAgent: true });

type ResolveOptions = {
  includeGeometry?: boolean;
};

export async function prefetchPlaces(places: string[]) {
  for (const place of places) {
    await geocodePlace(place);
  }
}

async function fetchRouteGeometry(stops: RouteCoordinates[]) {
  return fetchDrivingRouteLine(stops);
}

export async function resolveTransferRoute(
  stops: string[],
  options: ResolveOptions = {}
): Promise<TransferRouteResponse | null> {
  const cleaned = stops.map((stop) => stop.trim()).filter(Boolean);
  if (!cleaned.length) {
    return null;
  }

  const includeGeometry = options.includeGeometry ?? true;
  const cacheKey = `${cleaned.join('|')}|g${includeGeometry ? 1 : 0}`;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey) ?? null;
  }

  const coordinates: RouteCoordinates[] = [];
  for (const stop of cleaned) {
    const point = await geocodePlace(stop);
    if (!point) {
      routeCache.set(cacheKey, null);
      return null;
    }
    coordinates.push(point);
  }

  const routeLine = includeGeometry ? await fetchRouteGeometry(coordinates) : [];
  const route = { stops: coordinates, routeLine };
  routeCache.set(cacheKey, route);
  return route;
}
