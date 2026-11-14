export type TourType = 'ab' | 'abc' | 'round';

export function normalizeTourType(value?: string | null): TourType {
  if (value === 'abc' || value === 'round') {
    return value;
  }
  return 'ab';
}

export function cleanWaypointList(values?: unknown) {
  if (typeof values === 'string') {
    return values
      .split(/\r?\n|;/)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(values)) {
    return [];
  }

  return values.flatMap((item) => {
    if (typeof item === 'string') {
      return item.trim() ? [item.trim()] : [];
    }
    if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>;
      const text = [record.place, record.name, record.title, record.value, record.label].find(
        (value) => typeof value === 'string' && value.trim()
      );
      return typeof text === 'string' ? [text.trim()] : [];
    }
    return [];
  });
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

/** Visible stops plus hidden detours — used for geometry, distance and duration. */
export function getRoutingWaypointNames(
  tourType: TourType,
  routeFrom: string,
  routeVia: string | undefined,
  routeTo: string,
  hiddenStops?: Array<string | null | undefined> | null,
  hiddenStopsAfterVia?: Array<string | null | undefined> | null
) {
  const from = routeFrom.trim();
  const to = routeTo.trim();
  const via = routeVia?.trim();
  const hidden = cleanWaypointList(hiddenStops);
  const afterVia = cleanWaypointList(hiddenStopsAfterVia);

  switch (tourType) {
    case 'abc':
      return via ? [from, ...hidden, via, ...afterVia, to] : [from, ...hidden, ...afterVia, to];
    case 'round':
      return [from, ...hidden, to, ...afterVia, from];
    default:
      return [from, ...hidden, ...afterVia, to];
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
