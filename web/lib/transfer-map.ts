import {
  formatTransferRouteLabel,
  isTransferRouteComplete,
  normalizeTourType,
  type TourType
} from './transfer-route';
import type { TransferRouteResponse } from './transfer-route-api';
import { getTransferRouteKey } from './transfer-route-prefetch';

export const TRANSFER_ROUTE_COLORS = [
  '#0891b2',
  '#e11d48',
  '#16a34a',
  '#7c3aed',
  '#ea580c',
  '#2563eb',
  '#db2777',
  '#0f766e',
  '#ca8a04',
  '#4f46e5',
  '#be123c',
  '#65a30d'
] as const;

export type TransferMapProject = {
  title: string;
  brand?: string;
  tourType?: string;
  routeFrom?: string;
  routeVia?: string;
  routeTo?: string;
  hiddenStops?: string[];
  hiddenStopsAfterVia?: string[];
  vehicleModel?: string;
  vehicleCondition?: string;
  year?: string;
  publishedOn?: string;
  description?: string;
  tags?: string[];
  url?: string;
  distanceKm?: number;
  durationHours?: number;
};

export type TransferMapJob = {
  id: string;
  title: string;
  brand?: string;
  vehicleModel?: string;
  vehicleCondition?: string;
  year?: string;
  publishedOn?: string;
  description?: string;
  tags: string[];
  url?: string;
  tourType: TourType;
  routeFrom: string;
  routeVia?: string;
  routeTo: string;
  distanceKm?: number;
  durationHours?: number;
};

export type TransferMapGroup = {
  key: string;
  color: string;
  pathLabel: string;
  typeLabel: string;
  jobs: TransferMapJob[];
  geometry: TransferRouteResponse;
};

type TourTypeLabels = Record<TourType, string>;

export function buildTransferMapGroups(
  projects: TransferMapProject[],
  routes: Record<string, TransferRouteResponse>,
  tourTypeLabels: TourTypeLabels
): TransferMapGroup[] {
  const groups = new Map<string, TransferMapGroup>();

  projects.forEach((project, index) => {
    const tourType = normalizeTourType(project.tourType);
    if (!isTransferRouteComplete(tourType, project.routeFrom, project.routeVia, project.routeTo)) {
      return;
    }

    const routeFrom = project.routeFrom!.trim();
    const routeTo = project.routeTo!.trim();
    const routeVia = project.routeVia?.trim() || undefined;
    const key = getTransferRouteKey(
      tourType,
      routeFrom,
      routeVia,
      routeTo,
      project.hiddenStops,
      project.hiddenStopsAfterVia
    );
    const geometry = routes[key];
    if (!geometry?.stops?.length && !geometry?.routeLine?.length) {
      return;
    }

    const labels = formatTransferRouteLabel(tourType, routeFrom, routeVia, routeTo, tourTypeLabels);
    const job: TransferMapJob = {
      id: `${key}-${index}`,
      title: project.title,
      brand: project.brand,
      vehicleModel: project.vehicleModel,
      vehicleCondition: project.vehicleCondition,
      year: project.year,
      publishedOn: project.publishedOn,
      description: project.description,
      tags: project.tags?.filter(Boolean) ?? [],
      url: project.url,
      tourType,
      routeFrom,
      routeVia,
      routeTo,
      distanceKm: project.distanceKm,
      durationHours: project.durationHours
    };

    const existing = groups.get(key);
    if (existing) {
      existing.jobs.push(job);
      return;
    }

    groups.set(key, {
      key,
      color: TRANSFER_ROUTE_COLORS[groups.size % TRANSFER_ROUTE_COLORS.length],
      pathLabel: labels.path,
      typeLabel: labels.typeLabel,
      jobs: [job],
      geometry
    });
  });

  return [...groups.values()];
}
