export type TourType = 'ab' | 'abc' | 'round';

type Coordinates = { lat: number; lng: number };

export type RouteStats = {
  distanceKm: number;
  durationHours: number;
};

function normalizeTourType(value?: string | null): TourType {
  if (value === 'abc' || value === 'round') {
    return value;
  }
  return 'ab';
}

export function formatTransferJobTitle(
  tourType: string | null | undefined,
  routeFrom?: string,
  routeVia?: string,
  routeTo?: string
) {
  const from = routeFrom?.trim() ?? '';
  const to = routeTo?.trim() ?? '';
  const via = routeVia?.trim() ?? '';
  if (!from || !to) {
    return '';
  }

  if (normalizeTourType(tourType) === 'abc' && via) {
    return `${from} - ${via} - ${to}`;
  }

  return `${from} - ${to}`;
}

export function roundToOneDecimal(hours: number) {
  if (!Number.isFinite(hours) || hours <= 0) {
    return 0;
  }
  return Math.round(hours * 10) / 10;
}

function cleanStops(values?: Array<string | null | undefined> | null) {
  if (!Array.isArray(values)) {
    return [];
  }
  return values.map((value) => (typeof value === 'string' ? value.trim() : '')).filter(Boolean);
}

function waypoints(
  tourType: TourType,
  from: string,
  via: string | undefined,
  to: string,
  hiddenStops?: Array<string | null | undefined> | null,
  hiddenStopsAfterVia?: Array<string | null | undefined> | null
) {
  const hidden = cleanStops(hiddenStops);
  const afterVia = cleanStops(hiddenStopsAfterVia);

  switch (tourType) {
    case 'abc':
      return via ? [from, ...hidden, via, ...afterVia, to] : [from, ...hidden, ...afterVia, to];
    case 'round':
      return [from, ...hidden, to, ...afterVia, from];
    default:
      return [from, ...hidden, ...afterVia, to];
  }
}

const geocodeCache = new Map<string, Coordinates | null>();
let geocodeQueue: Promise<void> = Promise.resolve();
let lastGeocodeAt = 0;

async function waitForGeocodeSlot() {
  const now = Date.now();
  const waitMs = Math.max(0, 1100 - (now - lastGeocodeAt));
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
        'Accept-Language': 'de,en'
      }
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

async function geocodePlace(place: string): Promise<Coordinates | null> {
  const trimmed = place.trim();
  if (!trimmed) {
    return null;
  }

  const cacheKey = trimmed.toLowerCase();
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

async function fetchDrivingStats(stops: Coordinates[]): Promise<RouteStats | null> {
  const path = stops.map((stop) => `${stop.lng},${stop.lat}`).join(';');
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${path}?overview=false`
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    routes?: { distance?: number; duration?: number }[];
  };
  const route = data.routes?.[0];
  if (!route || typeof route.distance !== 'number' || typeof route.duration !== 'number') {
    return null;
  }

  const distanceKm = Math.max(1, Math.round(route.distance / 1000));
  const durationHours = roundToOneDecimal(route.duration / 3600);
  return { distanceKm, durationHours };
}

export async function computeRouteStats(input: {
  tourType?: string | null;
  routeFrom?: string;
  routeVia?: string;
  routeTo?: string;
  hiddenStops?: Array<string | null | undefined> | null;
  hiddenStopsAfterVia?: Array<string | null | undefined> | null;
}): Promise<RouteStats | null> {
  const from = input.routeFrom?.trim() ?? '';
  const to = input.routeTo?.trim() ?? '';
  const via = input.routeVia?.trim();
  const tourType = normalizeTourType(input.tourType);

  if (!from || !to || (tourType === 'abc' && !via)) {
    return null;
  }

  const names = waypoints(tourType, from, via, to, input.hiddenStops, input.hiddenStopsAfterVia);
  const coordinates: Coordinates[] = [];
  for (const name of names) {
    const point = await geocodePlace(name);
    if (!point) {
      return null;
    }
    coordinates.push(point);
  }

  return fetchDrivingStats(coordinates);
}
