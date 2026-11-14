import { createGeocoder } from './geocode-place';

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

const { geocodePlace } = createGeocoder();

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
