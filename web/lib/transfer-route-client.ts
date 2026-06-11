import type { TransferRouteResponse } from './transfer-route-api';

const routeCache = new Map<string, TransferRouteResponse>();
const inflight = new Map<string, Promise<TransferRouteResponse | null>>();

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
