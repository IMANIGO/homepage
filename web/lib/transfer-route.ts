export type TourType = 'ab' | 'abc' | 'round';

export function normalizeTourType(value?: string | null): TourType {
  if (value === 'abc' || value === 'round') {
    return value;
  }
  return 'ab';
}

export function getRouteWaypointNames(tourType: TourType, routeFrom: string, routeVia: string | undefined, routeTo: string) {
  const from = routeFrom.trim();
  const to = routeTo.trim();
  const via = routeVia?.trim();

  switch (tourType) {
    case 'abc':
      return via ? [from, via, to] : [from, to];
    case 'round':
      return [from, to, from];
    default:
      return [from, to];
  }
}

export function isTransferRouteComplete(
  tourType: TourType,
  routeFrom?: string,
  routeVia?: string,
  routeTo?: string
) {
  if (!routeFrom?.trim() || !routeTo?.trim()) {
    return false;
  }

  if (tourType === 'abc') {
    return Boolean(routeVia?.trim());
  }

  return true;
}

export function formatTransferRouteLabel(
  tourType: TourType,
  routeFrom: string,
  routeVia: string | undefined,
  routeTo: string,
  tourTypeLabels: Record<TourType, string>
) {
  const from = routeFrom.trim();
  const to = routeTo.trim();
  const via = routeVia?.trim();
  const typeLabel = tourTypeLabels[tourType];

  const path =
    tourType === 'abc' && via
      ? `${from} → ${via} → ${to}`
      : tourType === 'round'
        ? `${from} → ${to} → ${from}`
        : `${from} → ${to}`;

  return { typeLabel, path };
}
