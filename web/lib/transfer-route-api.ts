export type RouteCoordinates = { lat: number; lng: number };

export type TransferRouteResponse = {
  stops: RouteCoordinates[];
  routeLine: [number, number][];
};

const geocodeCache = new Map<string, RouteCoordinates | null>();
const routeCache = new Map<string, TransferRouteResponse | null>();
let geocodeQueue: Promise<void> = Promise.resolve();
let lastGeocodeAt = 0;

const NOMINATIM_DELAY_MS = 1100;

type ResolveOptions = {
  includeGeometry?: boolean;
};

function normalizePlaceKey(place: string) {
  return place.trim().toLowerCase();
}

async function waitForGeocodeSlot() {
  const now = Date.now();
  const waitMs = Math.max(0, NOMINATIM_DELAY_MS - (now - lastGeocodeAt));
  if (waitMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  lastGeocodeAt = Date.now();
}

async function nominatimLookup(query: string, countrycodes?: string) {
  await waitForGeocodeSlot();

  const countryParam = countrycodes ? `&countrycodes=${countrycodes}` : '';
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1${countryParam}&q=${encodeURIComponent(query)}`,
    {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'de,en',
        'User-Agent': 'IMANIGO-Website/1.0 (contact@imanigo.de; https://imanigo.de)'
      },
      next: { revalidate: 60 * 60 * 24 * 30 }
    }
  );

  if (!response.ok) {
    return null;
  }

  const results = (await response.json()) as { lat: string; lon: string }[];
  const hit = results[0];
  if (!hit) {
    return null;
  }

  return { lat: Number(hit.lat), lng: Number(hit.lon) };
}

async function geocodePlace(place: string): Promise<RouteCoordinates | null> {
  const trimmed = place.trim();
  if (!trimmed) {
    return null;
  }

  const cacheKey = normalizePlaceKey(trimmed);
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey) ?? null;
  }

  const run = async () => {
    const attempts = [
      { query: `${trimmed}, Deutschland`, countrycodes: 'de,at,ch' },
      { query: trimmed, countrycodes: 'de,at,ch' },
      { query: trimmed, countrycodes: undefined }
    ];

    for (const attempt of attempts) {
      const point = await nominatimLookup(attempt.query, attempt.countrycodes);
      if (point) {
        geocodeCache.set(cacheKey, point);
        return point;
      }
    }

    geocodeCache.set(cacheKey, null);
    return null;
  };

  const queued = geocodeQueue.then(run, run);
  geocodeQueue = queued.then(
    () => undefined,
    () => undefined
  );
  return queued;
}

export async function prefetchPlaces(places: string[]) {
  for (const place of places) {
    await geocodePlace(place);
  }
}

async function fetchRouteGeometry(stops: RouteCoordinates[]) {
  const path = stops.map((stop) => `${stop.lng},${stop.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${path}?overview=simplified&geometries=geojson`;
  const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 7 } });

  if (!response.ok) {
    return [] as [number, number][];
  }

  const data = (await response.json()) as {
    routes?: { geometry?: { coordinates: [number, number][] } }[];
  };

  const coordinates = data.routes?.[0]?.geometry?.coordinates;
  if (!coordinates?.length) {
    return [] as [number, number][];
  }

  return coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
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
