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
  '#65a30d',
  '#0ea5e9',
  '#a21caf',
  '#b45309',
  '#15803d',
  '#1d4ed8',
  '#c2410c',
  '#6d28d9',
  '#047857'
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

function linePoints(geometry: TransferRouteResponse): [number, number][] {
  if (geometry.routeLine.length > 1) {
    return geometry.routeLine;
  }
  return geometry.stops.map((stop) => [stop.lat, stop.lng]);
}

function lineBounds(points: [number, number][]) {
  let minLat = 90;
  let maxLat = -90;
  let minLng = 180;
  let maxLng = -180;
  for (const [lat, lng] of points) {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }
  return { minLat, maxLat, minLng, maxLng };
}

function boundsOverlap(
  left: ReturnType<typeof lineBounds>,
  right: ReturnType<typeof lineBounds>,
  pad = 0.03
) {
  return !(
    left.maxLat < right.minLat - pad ||
    right.maxLat < left.minLat - pad ||
    left.maxLng < right.minLng - pad ||
    right.maxLng < left.minLng - pad
  );
}

function pointDistance2(left: [number, number], right: [number, number]) {
  const dLat = left[0] - right[0];
  const dLng = (left[1] - right[1]) * Math.cos((left[0] * Math.PI) / 180);
  return dLat * dLat + dLng * dLng;
}

function minDistance2ToLine(point: [number, number], line: [number, number][]) {
  let min = Number.POSITIVE_INFINITY;
  for (const other of line) {
    min = Math.min(min, pointDistance2(point, other));
  }
  return min;
}

/** True when two different routes share a noticeable stretch of road. */
export function routesShareCorridor(left: TransferRouteResponse, right: TransferRouteResponse) {
  const leftLine = linePoints(left);
  const rightLine = linePoints(right);
  if (leftLine.length < 2 || rightLine.length < 2) {
    return false;
  }
  if (!boundsOverlap(lineBounds(leftLine), lineBounds(rightLine))) {
    return false;
  }

  const threshold = 0.035 * 0.035;
  const step = Math.max(1, Math.floor(leftLine.length / 28));
  let hits = 0;
  let samples = 0;
  for (let index = 0; index < leftLine.length; index += step) {
    samples += 1;
    if (minDistance2ToLine(leftLine[index], rightLine) <= threshold) {
      hits += 1;
    }
  }
  return samples > 0 && hits / samples >= 0.2;
}

function extraRouteColor(index: number) {
  const hue = Math.round((index * 137.508) % 360);
  return `hsl(${hue} 72% 40%)`;
}

export function assignDistinctRouteColors(groups: TransferMapGroup[]) {
  const assigned: TransferMapGroup[] = [];

  for (const group of groups) {
    const blocked = new Set<string>();
    for (const other of assigned) {
      if (routesShareCorridor(group.geometry, other.geometry)) {
        blocked.add(other.color);
      }
    }

    const used = new Set(assigned.map((item) => item.color));
    const color =
      TRANSFER_ROUTE_COLORS.find((candidate) => !blocked.has(candidate) && !used.has(candidate)) ??
      TRANSFER_ROUTE_COLORS.find((candidate) => !blocked.has(candidate)) ??
      extraRouteColor(assigned.length);

    group.color = color;
    assigned.push(group);
  }

  return groups;
}

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

  return assignDistinctRouteColors([...groups.values()]);
}
