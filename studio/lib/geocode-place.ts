import { airportSearchQueries } from './airport-codes';

export type GeoPoint = { lat: number; lng: number };

type NominatimHit = {
  lat: string;
  lon: string;
  importance?: number;
  class?: string;
  type?: string;
  addresstype?: string;
  display_name?: string;
};

const COUNTRY_ONLY =
  /^(deutschland|germany|italy|italien|italia|united kingdom|uk|great britain|vereinigtes königreich|france|frankreich|austria|österreich|switzerland|schweiz|spain|spanien|netherlands|niederlande)$/i;

const PLACE_TYPES = new Set([
  'city',
  'town',
  'village',
  'municipality',
  'hamlet',
  'suburb',
  'administrative',
  'postcode',
  'isolated_dwelling'
]);

function queryVariants(place: string) {
  const trimmed = place.trim();
  const parts = trimmed.split(',').map((part) => part.trim()).filter(Boolean);
  const variants = [...airportSearchQueries(trimmed), trimmed];

  if (parts.length > 1) {
    for (let index = 1; index < parts.length; index += 1) {
      variants.push(parts.slice(index).join(', '));
    }
  }

  return [...new Set(variants)].filter((variant) => variant && !COUNTRY_ONLY.test(variant));
}

function looksLikeRoadName(query: string) {
  return /^(a|e|b|s)\d+/i.test(query.trim()) || /autobahn|motorway|autoroute/i.test(query);
}

function scoreHit(hit: NominatimHit, query: string) {
  const kind = (hit.addresstype || hit.type || '').toLowerCase();
  let score = Number(hit.importance || 0);
  if (PLACE_TYPES.has(kind) || hit.class === 'place') {
    score += 5;
  }
  if (hit.class === 'aeroway' || kind === 'aerodrome' || kind === 'airport') {
    score += 8;
  }
  if ((hit.class === 'highway' || kind === 'road' || kind === 'retail') && !looksLikeRoadName(query)) {
    score -= 4;
  }
  return score;
}

function pickBestHit(results: NominatimHit[], query: string) {
  if (!results.length) {
    return null;
  }
  return [...results].sort((left, right) => scoreHit(right, query) - scoreHit(left, query))[0] ?? null;
}

export function createGeocoder(options: { userAgent?: boolean } = {}) {
  const cache = new Map<string, GeoPoint | null>();
  let queue: Promise<void> = Promise.resolve();
  let lastAt = 0;

  async function waitSlot() {
    const waitMs = Math.max(0, 1100 - (Date.now() - lastAt));
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
    lastAt = Date.now();
  }

  async function nominatimLookup(query: string, countrycodes?: string) {
    await waitSlot();
    const countryParam = countrycodes ? `&countrycodes=${countrycodes}` : '';
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Accept-Language': 'de,en'
    };
    if (options.userAgent) {
      headers['User-Agent'] = 'IMANIGO-Website/1.0 (contact@imanigo.de; https://imanigo.de)';
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=5${countryParam}&q=${encodeURIComponent(query)}`,
      { headers }
    );
    if (!response.ok) {
      return null;
    }

    const results = (await response.json()) as NominatimHit[];
    const hit = pickBestHit(results, query);
    if (!hit) {
      return null;
    }
    return { lat: Number(hit.lat), lng: Number(hit.lon) };
  }

  async function geocodePlace(place: string): Promise<GeoPoint | null> {
    const trimmed = place.trim();
    if (!trimmed) {
      return null;
    }

    const cacheKey = trimmed.toLowerCase();
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey) ?? null;
    }

    const run = async () => {
      for (const variant of queryVariants(trimmed)) {
        const worldwide = await nominatimLookup(variant);
        if (worldwide) {
          cache.set(cacheKey, worldwide);
          return worldwide;
        }
      }

      const regional = await nominatimLookup(trimmed, 'de,at,ch,it,gb,fr,nl,be,es,pl,cz');
      cache.set(cacheKey, regional);
      return regional;
    };

    const queued = queue.then(run, run);
    queue = queued.then(
      () => undefined,
      () => undefined
    );
    return queued;
  }

  return { geocodePlace };
}
