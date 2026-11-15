import { lookupKnownPlace } from './known-places';
import type { TransferRouteResponse } from './transfer-route-api';
import { collectTransferRouteStops, type TransferProject } from './transfer-route-keys';

const routeCache = new Map<string, TransferRouteResponse>();
const inflight = new Map<string, Promise<TransferRouteResponse | null>>();

export function routesFromKnownPlaces(projects: TransferProject[]) {
  const routeStops = collectTransferRouteStops(projects);
  const routes: Record<string, TransferRouteResponse> = {};
  const missing: Record<string, string[]> = {};

  for (const [key, stops] of Object.entries(routeStops)) {
    const points = stops.map((stop) => lookupKnownPlace(stop));
    if (points.every((point) => point)) {
      routes[key] = { stops: points.filter((point) => point !== null), routeLine: [] };
    } else {
      missing[key] = stops;
    }
  }

  return { routes, missing };
}

export async function fetchMissingTransferRoutes(missing: Record<string, string[]>) {
  const keys = Object.keys(missing);
  if (!keys.length) {
    return {} as Record<string, TransferRouteResponse>;
  }

  const response = await fetch('/api/transfer-routes', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ routes: missing, geometry: false })
  });
  if (!response.ok) {
    return {};
  }

  return (await response.json()) as Record<string, TransferRouteResponse>;
}

export async function fetchTransferRoute(stopsKey: string, includeGeometry = true) {
  const cached = routeCache.get(stopsKey);
  if (cached) {
    return cached;
  }

  const pending = inflight.get(stopsKey);
  if (pending) {
    return pending;
  }

  const query = stopsKey
    .split('|')
    .map((stop) => encodeURIComponent(stop))
    .join('|');
  const geometryParam = includeGeometry ? '1' : '0';

  const request = fetch(`/api/transfer-route?stops=${query}&geometry=${geometryParam}`, {
    headers: { Accept: 'application/json' }
  })
    .then(async (response) => {
      if (!response.ok) {
        return null;
      }
      return (await response.json()) as TransferRouteResponse;
    })
    .then((data) => {
      if (data) {
        routeCache.set(stopsKey, data);
      }
      return data;
    })
    .finally(() => {
      inflight.delete(stopsKey);
    });

  inflight.set(stopsKey, request);
  return request;
}
