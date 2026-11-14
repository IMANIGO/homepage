import {
  getRoutingWaypointNames,
  isTransferRouteComplete,
  normalizeTourType
} from './transfer-route';
import { prefetchPlaces, resolveTransferRoute, type TransferRouteResponse } from './transfer-route-api';

type TransferProject = {
  tourType?: string | null;
  routeFrom?: string;
  routeVia?: string;
  routeTo?: string;
  hiddenStops?: Array<string | null | undefined> | null;
  hiddenStopsAfterVia?: Array<string | null | undefined> | null;
};

export function getTransferRouteKey(
  tourType: string | null | undefined,
  routeFrom: string,
  routeVia: string | undefined,
  routeTo: string,
  hiddenStops?: Array<string | null | undefined> | null,
  hiddenStopsAfterVia?: Array<string | null | undefined> | null
) {
  const normalized = normalizeTourType(tourType);
  return getRoutingWaypointNames(
    normalized,
    routeFrom,
    routeVia,
    routeTo,
    hiddenStops,
    hiddenStopsAfterVia
  ).join('|');
}

export async function prefetchTransferRoutes(
  projects: TransferProject[],
  options?: { includeGeometry?: boolean }
): Promise<Record<string, TransferRouteResponse>> {
  const routeStops = new Map<string, string[]>();

  for (const project of projects) {
    const tourType = normalizeTourType(project.tourType);
    if (!isTransferRouteComplete(tourType, project.routeFrom, project.routeVia, project.routeTo)) {
      continue;
    }

    const stops = getRoutingWaypointNames(
      tourType,
      project.routeFrom!,
      project.routeVia,
      project.routeTo!,
      project.hiddenStops,
      project.hiddenStopsAfterVia
    );
    routeStops.set(stops.join('|'), stops);
  }

  if (!routeStops.size) {
    return {};
  }

  const uniquePlaces = new Set<string>();
  for (const stops of routeStops.values()) {
    for (const stop of stops) {
      uniquePlaces.add(stop);
    }
  }

  await prefetchPlaces([...uniquePlaces]);

  const includeGeometry = options?.includeGeometry ?? true;
  const routes: Record<string, TransferRouteResponse> = {};

  for (const [key, stops] of routeStops) {
    const route = await resolveTransferRoute(stops, { includeGeometry });
    if (route) {
      routes[key] = route;
    }
  }

  return routes;
}
