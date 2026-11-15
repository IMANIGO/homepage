import { AIRPORT_QUERIES } from './airport-codes';
import type { GeoPoint } from './geocode-place';

const KNOWN_PLACES: Record<string, GeoPoint> = {
  münchen: { lat: 48.1374, lng: 11.5755 },
  munchen: { lat: 48.1374, lng: 11.5755 },
  munich: { lat: 48.1374, lng: 11.5755 },
  'flughafen münchen': { lat: 48.3538, lng: 11.7861 },
  'flughafen munchen': { lat: 48.3538, lng: 11.7861 },
  'munich airport': { lat: 48.3538, lng: 11.7861 },
  muc: { lat: 48.3538, lng: 11.7861 },
  freilassing: { lat: 47.8408, lng: 12.9813 },
  ebersberg: { lat: 48.0774, lng: 11.968 },
  wolnzach: { lat: 48.6036, lng: 11.6256 },
  brunnthal: { lat: 48.0067, lng: 11.6842 },
  rosenheim: { lat: 47.8561, lng: 12.1289 },
  schweitenkirchen: { lat: 48.5031, lng: 11.6064 },
  berglern: { lat: 48.39, lng: 11.93 },
  'unterschleißheim': { lat: 48.2808, lng: 11.5688 },
  unterschleissheim: { lat: 48.2808, lng: 11.5688 },
  florenz: { lat: 43.7696, lng: 11.2558 },
  florence: { lat: 43.7696, lng: 11.2558 },
  firenze: { lat: 43.7696, lng: 11.2558 },
  glasgow: { lat: 55.8642, lng: -4.2518 },
  wien: { lat: 48.2082, lng: 16.3738 },
  vienna: { lat: 48.2082, lng: 16.3738 },
  'motorworld münchen': { lat: 48.1838, lng: 11.5952 },
  'motorworld munchen': { lat: 48.1838, lng: 11.5952 },
  'motorworld munich': { lat: 48.1838, lng: 11.5952 },
  kolbermoor: { lat: 47.8497, lng: 12.0669 },
  altenmarkt: { lat: 48.0039, lng: 12.5356 },
  'altenmarkt an der alz': { lat: 48.0039, lng: 12.5356 },
  szg: { lat: 47.7933, lng: 13.0043 },
  'flughafen salzburg': { lat: 47.7933, lng: 13.0043 },
  'salzburg airport': { lat: 47.7933, lng: 13.0043 },
  salzburg: { lat: 47.8095, lng: 13.055 },
  traunreut: { lat: 47.9625, lng: 12.5925 }
};

function normalizePlaceKey(place: string) {
  return place
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ß/g, 'ss');
}

export function lookupKnownPlace(place: string): GeoPoint | null {
  const trimmed = place.trim();
  if (!trimmed) {
    return null;
  }

  const direct = KNOWN_PLACES[normalizePlaceKey(trimmed)] ?? KNOWN_PLACES[trimmed.toLowerCase()];
  if (direct) {
    return direct;
  }

  const iata = trimmed.toUpperCase();
  if (/^[A-Z]{3}$/.test(iata)) {
    const byCode = KNOWN_PLACES[normalizePlaceKey(iata)];
    if (byCode) {
      return byCode;
    }
    const airportName = AIRPORT_QUERIES[iata];
    if (airportName) {
      return KNOWN_PLACES[normalizePlaceKey(airportName)] ?? null;
    }
  }

  const commaHead = trimmed.split(',')[0]?.trim();
  if (commaHead && commaHead !== trimmed) {
    return lookupKnownPlace(commaHead);
  }

  return null;
}
