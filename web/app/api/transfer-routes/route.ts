import { prefetchPlaces, resolveTransferRoute } from '../../../lib/transfer-route-api';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    routes?: Record<string, string[]>;
    geometry?: boolean;
  } | null;

  const routeStops = body?.routes ?? {};
  const keys = Object.keys(routeStops);
  if (!keys.length) {
    return Response.json({});
  }

  const uniquePlaces = new Set<string>();
  for (const stops of Object.values(routeStops)) {
    for (const stop of stops ?? []) {
      if (stop?.trim()) {
        uniquePlaces.add(stop.trim());
      }
    }
  }

  await prefetchPlaces([...uniquePlaces]);

  const includeGeometry = Boolean(body?.geometry);
  const routes: Record<string, Awaited<ReturnType<typeof resolveTransferRoute>>> = {};
  await Promise.all(
    keys.map(async (key) => {
      const stops = (routeStops[key] ?? []).map((stop) => stop.trim()).filter(Boolean).slice(0, 12);
      const route = await resolveTransferRoute(stops, { includeGeometry });
      if (route) {
        routes[key] = route;
      }
    })
  );

  return Response.json(routes, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
    }
  });
}
