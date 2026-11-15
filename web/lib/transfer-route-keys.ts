import {
  getRoutingWaypointNames,
  isTransferRouteComplete,
  normalizeTourType
} from './transfer-route';

export type TransferProject = {
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

export function collectTransferRouteStops(projects: TransferProject[]) {
  const routeStops: Record<string, string[]> = {};

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
    routeStops[stops.join('|')] = stops;
  }

  return routeStops;
}
