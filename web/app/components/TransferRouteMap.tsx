'use client';

import { useEffect, useRef, useState } from 'react';
import type { LatLngExpression, Map as LeafletMap } from 'leaflet';
import { loadLeaflet } from '../../lib/leaflet-loader';
import { fetchTransferRoute } from '../../lib/transfer-route-client';
import type { TransferRouteResponse } from '../../lib/transfer-route-api';
import {
  getRouteWaypointNames,
  normalizeTourType,
  type TourType
} from '../../lib/transfer-route';

type TransferRouteMapProps = {
  tourType?: string | null;
  routeFrom: string;
  routeVia?: string;
  routeTo: string;
  routePathLabel: string;
  prefetchedRoute?: TransferRouteResponse;
};

function getRouteMapViewport(
  L: typeof import('leaflet'),
  stops: { lat: number; lng: number }[],
  routeLine: [number, number][]
) {
  const bounds = L.latLngBounds(stops.map((stop) => [stop.lat, stop.lng]));

  for (const point of routeLine) {
    bounds.extend(point);
  }

  const center = bounds.getCenter();
  const latSpan = Math.max(bounds.getNorth() - bounds.getSouth(), 0.001);
  const lngSpan = Math.max(bounds.getEast() - bounds.getWest(), 0.001);
  const span = Math.max(latSpan, lngSpan);

  // Keep short routes readable in the thumbnail without zooming out too far.
  const minViewSpan = span < 0.04 ? 0.07 : span < 0.12 ? 0.1 : 0;
  const viewLatSpan = Math.max(latSpan, minViewSpan);
  const viewLngSpan = Math.max(lngSpan, minViewSpan);

  const latPad = viewLatSpan * 0.24;
  const lngPad = viewLngSpan * 0.3;

  const paddedBounds = L.latLngBounds(
    [center.lat - viewLatSpan / 2 - latPad, center.lng - viewLngSpan / 2 - lngPad],
    [center.lat + viewLatSpan / 2 + latPad, center.lng + viewLngSpan / 2 + lngPad]
  );

  let maxZoom = 14;
  if (span > 1.2) maxZoom = 13;
  if (span > 2.5) maxZoom = 12;
  if (span > 5) maxZoom = 11;
  if (span > 9) maxZoom = 10;

  return {
    bounds: paddedBounds,
    options: {
      paddingTopLeft: [22, 26] as [number, number],
      paddingBottomRight: [22, 26] as [number, number],
      maxZoom,
      animate: false
    }
  };
}

function fitRouteMap(L: typeof import('leaflet'), map: LeafletMap, viewport: ReturnType<typeof getRouteMapViewport>) {
  map.invalidateSize();
  map.fitBounds(viewport.bounds, viewport.options);
  window.requestAnimationFrame(() => {
    map.invalidateSize();
    map.fitBounds(viewport.bounds, viewport.options);
  });
}

function renderRouteMap(
  L: typeof import('leaflet'),
  container: HTMLDivElement,
  data: TransferRouteResponse,
  normalizedTourType: TourType
) {
  const map = L.map(container, {
    zoomControl: false,
    attributionControl: true,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  const routeColor = '#0891b2';
  const { stops, routeLine = [] } = data;
  const viewport = getRouteMapViewport(L, stops, routeLine);

  if (routeLine.length) {
    L.polyline(routeLine as LatLngExpression[], { color: routeColor, weight: 4, opacity: 0.95 }).addTo(map);
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

  fitRouteMap(L, map, viewport);

  return map;
}

export function TransferRouteMap({
  tourType,
  routeFrom,
  routeVia,
  routeTo,
  routePathLabel,
  prefetchedRoute
}: TransferRouteMapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [visible, setVisible] = useState(Boolean(prefetchedRoute));
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const normalizedTourType = normalizeTourType(tourType);
  const stopNames = getRouteWaypointNames(normalizedTourType, routeFrom, routeVia, routeTo);
  const stopsKey = stopNames.join('|');

  useEffect(() => {
    if (prefetchedRoute) {
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px' }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [prefetchedRoute]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    let cancelled = false;

    async function initMap() {
      if (!containerRef.current) {
        return;
      }

      setStatus('loading');

      const [L, data] = await Promise.all([
        loadLeaflet(),
        prefetchedRoute ? Promise.resolve(prefetchedRoute) : fetchTransferRoute(stopsKey)
      ]);

      if (!data?.stops?.length || cancelled || !containerRef.current) {
        if (!cancelled) {
          setStatus('error');
        }
        return;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      mapRef.current = renderRouteMap(L, containerRef.current, data, normalizedTourType);

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
  }, [visible, normalizedTourType, stopsKey, prefetchedRoute]);

  return (
    <div
      ref={wrapperRef}
      className="relative h-36 w-full overflow-hidden rounded-xl border border-white/15 bg-slate-100 sm:h-32 sm:w-44"
    >
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
