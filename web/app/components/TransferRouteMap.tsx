'use client';

import { useEffect, useRef, useState } from 'react';
import type { LatLngExpression, Map as LeafletMap } from 'leaflet';
import {
  getRouteWaypointNames,
  normalizeTourType,
  type TourType
} from '../../lib/transfer-route';

type Coordinates = { lat: number; lng: number };

async function geocodePlace(place: string): Promise<Coordinates | null> {
  const query = encodeURIComponent(place.trim());
  if (!query) {
    return null;
  }

  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`, {
    headers: {
      'Accept-Language': 'de,en',
      'User-Agent': 'IMANIGO-Website/1.0 (https://imanigo.de)'
    }
  });

  if (!response.ok) {
    return null;
  }

  const results = (await response.json()) as { lat: string; lon: string }[];
  const hit = results[0];
  if (!hit) {
    return null;
  }

  return { lat: Number(hit.lat), lng: Number(hit.lon) };
}

async function geocodeStops(stops: string[]) {
  const coordinates: Coordinates[] = [];

  for (let index = 0; index < stops.length; index += 1) {
    if (index > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    }

    const point = await geocodePlace(stops[index]);
    if (!point) {
      return null;
    }

    coordinates.push(point);
  }

  return coordinates;
}

async function fetchRouteGeometry(stops: Coordinates[]) {
  const path = stops.map((stop) => `${stop.lng},${stop.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${path}?overview=full&geometries=geojson`;
  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    routes?: { geometry?: { coordinates: [number, number][] } }[];
  };

  const coordinates = data.routes?.[0]?.geometry?.coordinates;
  if (!coordinates?.length) {
    return null;
  }

  return coordinates.map(([lng, lat]) => [lat, lng] as LatLngExpression);
}

type TransferRouteMapProps = {
  tourType?: string | null;
  routeFrom: string;
  routeVia?: string;
  routeTo: string;
  routePathLabel: string;
};

export function TransferRouteMap({
  tourType,
  routeFrom,
  routeVia,
  routeTo,
  routePathLabel
}: TransferRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const normalizedTourType = normalizeTourType(tourType);
  const stopNames = getRouteWaypointNames(normalizedTourType, routeFrom, routeVia, routeTo);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!containerRef.current) {
        return;
      }

      setStatus('loading');
      const stops = await geocodeStops(stopNames);

      if (cancelled || !stops?.length) {
        if (!cancelled) {
          setStatus('error');
        }
        return;
      }

      const L = await import('leaflet');

      if (cancelled || !containerRef.current) {
        return;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: true,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false
      });

      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      const routeColor = '#0891b2';
      const routeLine = await fetchRouteGeometry(stops);
      const bounds = L.latLngBounds(stops.map((stop) => [stop.lat, stop.lng]));

      if (routeLine?.length) {
        L.polyline(routeLine, { color: routeColor, weight: 4, opacity: 0.95 }).addTo(map);
        for (const point of routeLine) {
          bounds.extend(point);
        }
      } else {
        L.polyline(
          stops.map((stop) => [stop.lat, stop.lng]),
          { color: routeColor, weight: 4, opacity: 0.8, dashArray: '6 8' }
        ).addTo(map);
      }

      const markerStyle = {
        radius: 6,
        color: '#0e7490',
        weight: 2,
        fillColor: '#ffffff',
        fillOpacity: 1
      };

      stops.forEach((stop, index) => {
        const isLast = index === stops.length - 1;
        const isRoundReturn = normalizedTourType === 'round' && isLast && stops.length > 1;
        if (isRoundReturn && stop.lat === stops[0].lat && stop.lng === stops[0].lng) {
          return;
        }

        L.circleMarker([stop.lat, stop.lng], {
          ...markerStyle,
          fillColor: index === stops.length - 1 ? routeColor : markerStyle.fillColor
        }).addTo(map);
      });

      map.fitBounds(bounds, { padding: [18, 18] });

      if (!cancelled) {
        setStatus('ready');
      }
    }

    initMap().catch(() => {
      if (!cancelled) {
        setStatus('error');
      }
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [normalizedTourType, routeFrom, routeVia, routeTo]);

  return (
    <div className="relative h-36 w-full overflow-hidden rounded-xl border border-white/15 bg-slate-100 sm:h-32 sm:w-44">
      <div ref={containerRef} className="h-full w-full" aria-hidden={status !== 'ready'} />
      {status === 'loading' ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-xs text-slate-500">Route …</div>
      ) : null}
      {status === 'error' ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 px-3 text-center text-xs leading-5 text-slate-600">
          {routePathLabel}
        </div>
      ) : null}
      <span className="sr-only">{routePathLabel}</span>
    </div>
  );
}
