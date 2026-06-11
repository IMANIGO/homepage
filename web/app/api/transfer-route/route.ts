import { resolveTransferRoute } from '../../../lib/transfer-route-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('stops') ?? '';
  const stops = raw
    .split('|')
    .map((stop) => decodeURIComponent(stop.trim()))
    .filter(Boolean)
    .slice(0, 4);

  if (!stops.length) {
    return Response.json({ error: 'Missing stops' }, { status: 400 });
  }

  const includeGeometry = searchParams.get('geometry') !== '0';
  const route = await resolveTransferRoute(stops, { includeGeometry });
  if (!route) {
    return Response.json({ error: 'Route not found' }, { status: 404 });
  }

  return Response.json(route, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
    }
  });
}
