import { prefetchPlaces, resolveTransferRoute, type TransferRouteResponse } from './transfer-route-api';
import { collectTransferRouteStops, type TransferProject } from './transfer-route-keys';

export {
  collectTransferRouteStops,
  getTransferRouteKey,
  type TransferProject
} from './transfer-route-keys';

export async function prefetchTransferRoutes(
  projects: TransferProject[],
  options?: { includeGeometry?: boolean }
): Promise<Record<string, TransferRouteResponse>> {
  const routeStops = collectTransferRouteStops(projects);
  const uniquePlaces = new Set<string>();
  for (const stops of Object.values(routeStops)) {
    for (const stop of stops) {
      uniquePlaces.add(stop);
    }
  }

  if (!uniquePlaces.size) {
    return {};
  }

  await prefetchPlaces([...uniquePlaces]);

  const includeGeometry = options?.includeGeometry ?? false;
  const routes: Record<string, TransferRouteResponse> = {};
  await Promise.all(
    Object.entries(routeStops).map(async ([key, stops]) => {
      const route = await resolveTransferRoute(stops, { includeGeometry });
      if (route) {
        routes[key] = route;
      }
    })
  );

  return routes;
}
