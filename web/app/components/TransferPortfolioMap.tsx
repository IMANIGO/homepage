'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CircleMarker, LeafletMouseEvent, Map as LeafletMap, Polyline } from 'leaflet';
import { loadLeaflet } from '../../lib/leaflet-loader';
import {
  assignDistinctRouteColors,
  buildTransferMapGroups,
  type TransferMapGroup,
  type TransferMapJob,
  type TransferMapProject
} from '../../lib/transfer-map';
import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import type { TransferRouteResponse } from '../../lib/transfer-route-api';
import { formatVehicleLabel } from '../../lib/vehicle-condition';
import { enableLeafletTrackpadZoom } from '../../lib/leaflet-trackpad-zoom';
import { fetchDrivingRouteLine, hasRoadGeometry } from '../../lib/osrm-line';
import { fetchMissingTransferRoutes, routesFromKnownPlaces } from '../../lib/transfer-route-client';

type TransferPortfolioMapProps = {
  projects: TransferMapProject[];
  lang: Locale;
};

const IDLE_WEIGHT = 8;
const ACTIVE_WEIGHT = 12;
const HIT_PIXELS = 28;

function routeLine(group: TransferMapGroup): [number, number][] {
  if (hasRoadGeometry(group.geometry.routeLine)) {
    return group.geometry.routeLine;
  }
  return group.geometry.stops.map((stop) => [stop.lat, stop.lng]);
}

function sameKeys(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }
  const set = new Set(left);
  return right.every((key) => set.has(key));
}

export function TransferPortfolioMap({ projects, lang }: TransferPortfolioMapProps) {
  const dict = getDictionary(lang);
  const [routes, setRoutes] = useState<Record<string, TransferRouteResponse>>(
    () => routesFromKnownPlaces(projects).routes
  );
  const [loadingRoutes, setLoadingRoutes] = useState(
    () => Object.keys(routesFromKnownPlaces(projects).missing).length > 0
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const hideTimer = useRef<number | null>(null);
  const pinnedRef = useRef(false);
  const activeKeysRef = useRef<string[]>([]);
  const visualsRef = useRef<Map<string, { line: Polyline; markers: CircleMarker[] }>>(new Map());
  const groups = buildTransferMapGroups(projects, routes, dict.tourTypes);
  const groupsRef = useRef(groups);
  groupsRef.current = groups;
  const routeSignature = Object.keys(routes).sort().join('|');

  useEffect(() => {
    let cancelled = false;
    const { routes: known, missing } = routesFromKnownPlaces(projects);
    setRoutes((current) => ({ ...known, ...current }));
    if (!Object.keys(missing).length) {
      setLoadingRoutes(false);
      return;
    }

    setLoadingRoutes(true);
    fetchMissingTransferRoutes(missing)
      .then((extra) => {
        if (cancelled) {
          return;
        }
        setRoutes((current) => ({ ...current, ...extra }));
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingRoutes(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projects]);

  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [tourIndex, setTourIndex] = useState(0);

  const matching = useMemo(() => {
    const keySet = new Set(activeKeys);
    return groups.flatMap((group) =>
      keySet.has(group.key) ? group.jobs.map((job) => ({ group, job })) : []
    );
  }, [groups, activeKeys]);

  const current = matching[Math.min(tourIndex, Math.max(0, matching.length - 1))] ?? null;

  function clearHideTimer() {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }

  function setVisualActive(keys: string[], selectedKey?: string | null) {
    const keySet = new Set(keys);
    const highlightAll = keys.length === 0;
    const selected = selectedKey ?? (keys.length === 1 ? keys[0] : null);

    visualsRef.current.forEach((visual, lineKey) => {
      const isSelected = Boolean(selected) && lineKey === selected;
      const isMatch = keySet.has(lineKey);
      const opacity = highlightAll ? 0.95 : isSelected ? 1 : isMatch ? 0.38 : 0.12;
      visual.line.setStyle({
        weight: isSelected ? ACTIVE_WEIGHT : IDLE_WEIGHT,
        opacity
      });
      visual.markers.forEach((marker) => {
        marker.setStyle({
          opacity,
          fillOpacity: highlightAll || isSelected ? 1 : isMatch ? 0.4 : 0.15
        });
      });
      if (isSelected) {
        visual.line.bringToFront();
        visual.markers.forEach((marker) => marker.bringToFront());
      }
    });
  }

  function showMatches(keys: string[], pin = false) {
    if (!keys.length) {
      return;
    }
    clearHideTimer();
    const changed = !sameKeys(activeKeysRef.current, keys);
    if (changed) {
      setTourIndex(0);
    }
    activeKeysRef.current = keys;
    pinnedRef.current = pin;
    if (changed) {
      setActiveKeys(keys);
    }
    setVisualActive(keys, keys[0]);
  }

  function hideMatches() {
    clearHideTimer();
    activeKeysRef.current = [];
    pinnedRef.current = false;
    setActiveKeys([]);
    setTourIndex(0);
    setVisualActive([]);
  }

  function scheduleHide() {
    if (pinnedRef.current) {
      return;
    }
    clearHideTimer();
    hideTimer.current = window.setTimeout(() => {
      if (!pinnedRef.current) {
        hideMatches();
      }
    }, 180);
  }

  function findMatches(latlng: { lat: number; lng: number }) {
    const map = mapRef.current;
    if (!map) {
      return [];
    }

    const point = map.latLngToLayerPoint(latlng);
    return groupsRef.current
      .filter((group) => {
        const visual = visualsRef.current.get(group.key);
        if (!visual) {
          return false;
        }
        const closest = visual.line.closestLayerPoint(point);
        return Boolean(closest && closest.distanceTo(point) <= HIT_PIXELS);
      })
      .map((group) => group.key);
  }

  const showMatchesRef = useRef(showMatches);
  const hideMatchesRef = useRef(hideMatches);
  const scheduleHideRef = useRef(scheduleHide);
  const findMatchesRef = useRef(findMatches);
  showMatchesRef.current = showMatches;
  hideMatchesRef.current = hideMatches;
  scheduleHideRef.current = scheduleHide;
  findMatchesRef.current = findMatches;

  useEffect(() => {
    let cancelled = false;
    let removeResize: (() => void) | undefined;
    let removeTrackpadZoom: (() => void) | undefined;
    let fitTimer: number | undefined;

    async function initMap() {
      if (!containerRef.current || !groupsRef.current.length) {
        return;
      }

      const L = await loadLeaflet();
      if (cancelled || !containerRef.current) {
        return;
      }

      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: true,
        dragging: true,
        doubleClickZoom: true,
        touchZoom: true,
        wheelPxPerZoomLevel: 80,
        boxZoom: true,
        keyboard: true
      });
      mapRef.current = map;
      removeTrackpadZoom = enableLeafletTrackpadZoom(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      const bounds = L.latLngBounds([]);

      groupsRef.current.forEach((group) => {
        const line = routeLine(group);
        line.forEach((point) => bounds.extend(point));
        group.geometry.stops.forEach((stop) => bounds.extend([stop.lat, stop.lng]));

        const visual = L.polyline(line, {
          color: group.color,
          weight: IDLE_WEIGHT,
          opacity: 0.95,
          lineJoin: 'round',
          lineCap: 'round',
          interactive: false
        }).addTo(map);

        const visibleStops = [group.geometry.stops[0], group.geometry.stops[group.geometry.stops.length - 1]].filter(
          Boolean
        );
        const markers = visibleStops.map((stop, index) => {
          const isEnd = index === visibleStops.length - 1;
          return L.circleMarker([stop.lat, stop.lng], {
            radius: isEnd ? 8 : 6,
            color: group.color,
            weight: 2,
            fillColor: isEnd ? group.color : '#ffffff',
            fillOpacity: 1,
            interactive: false
          }).addTo(map);
        });

        visualsRef.current.set(group.key, { line: visual, markers });
      });

      map.on('mousemove', (event: LeafletMouseEvent) => {
        if (pinnedRef.current) {
          return;
        }
        const keys = findMatchesRef.current(event.latlng);
        if (keys.length) {
          showMatchesRef.current(keys);
        } else {
          scheduleHideRef.current();
        }
      });

      map.on('click', (event: LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(event);
        const keys = findMatchesRef.current(event.latlng);
        if (keys.length) {
          showMatchesRef.current(keys, true);
        } else {
          hideMatchesRef.current();
        }
      });

      const fitAllRoutes = () => {
        if (cancelled || !bounds.isValid()) {
          return;
        }
        map.invalidateSize();
        map.fitBounds(bounds.pad(0.12), { padding: [28, 28], maxZoom: 12, animate: false });
      };

      if (!bounds.isValid()) {
        map.setView([48.5, 11.6], 7);
      }

      if (cancelled) {
        map.remove();
        mapRef.current = null;
        return;
      }

      async function followRoads() {
        await Promise.all(
          groupsRef.current.map(async (group) => {
            if (cancelled || hasRoadGeometry(group.geometry.routeLine)) {
              return;
            }
            const road = await fetchDrivingRouteLine(group.geometry.stops);
            if (cancelled || !hasRoadGeometry(road)) {
              return;
            }
            group.geometry.routeLine = road;
            visualsRef.current.get(group.key)?.line.setLatLngs(road);
            road.forEach((point) => bounds.extend(point));
          })
        );
        assignDistinctRouteColors(groupsRef.current);
        groupsRef.current.forEach((group) => {
          const visual = visualsRef.current.get(group.key);
          if (!visual) {
            return;
          }
          visual.line.setStyle({ color: group.color });
          visual.markers.forEach((marker, markerIndex) => {
            const isEnd = markerIndex === visual.markers.length - 1;
            marker.setStyle({
              color: group.color,
              fillColor: isEnd ? group.color : '#ffffff'
            });
          });
        });
        fitAllRoutes();
      }

      map.whenReady(fitAllRoutes);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(fitAllRoutes);
      });
      fitTimer = window.setTimeout(fitAllRoutes, 280);
      void followRoads();

      const onResize = () => {
        map.invalidateSize();
      };
      window.addEventListener('resize', onResize);
      removeResize = () => window.removeEventListener('resize', onResize);
    }

    initMap().catch(() => undefined);

    return () => {
      cancelled = true;
      if (fitTimer) {
        window.clearTimeout(fitTimer);
      }
      removeResize?.();
      removeTrackpadZoom?.();
      clearHideTimer();
      visualsRef.current.clear();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [routeSignature]);

  useEffect(() => {
    if (!current) {
      return;
    }
    setVisualActive(activeKeys, current.group.key);
    if (tourIndex === 0) {
      return;
    }
    const map = mapRef.current;
    const visual = visualsRef.current.get(current.group.key);
    if (!map || !visual) {
      return;
    }
    const bounds = visual.line.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.14), { padding: [32, 32], maxZoom: 12, animate: true });
    }
  }, [activeKeys, current?.group.key, current?.job.id, tourIndex]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!matching.length) {
        return;
      }
      if (event.key === 'Escape') {
        hideMatches();
      }
      if (event.key === 'ArrowRight') {
        setTourIndex((value) => Math.min(matching.length - 1, value + 1));
      }
      if (event.key === 'ArrowLeft') {
        setTourIndex((value) => Math.max(0, value - 1));
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [matching.length]);

  if (!groups.length) {
    return (
      <div className="flex min-h-[18rem] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 text-center text-sm text-slate-400">
        {loadingRoutes ? dict.transferMap.loading : dict.transferMap.empty}
      </div>
    );
  }

  return (
    <div className="relative">
      <p className="sr-only">{dict.transferMap.hint}</p>
      <div
        className="relative z-0 h-[min(70vh,40rem)] min-h-[22rem] w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-100"
        onMouseEnter={clearHideTimer}
        onMouseLeave={() => scheduleHide()}
      >
        <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full" />
        <ul className="sr-only">
          {groups.flatMap((group) =>
            group.jobs.map((job) => {
              const vehicle = formatVehicleLabel(job.vehicleModel, job.vehicleCondition, dict.vehicleConditions);
              return (
                <li key={job.id}>
                  {group.typeLabel}: {job.title || group.pathLabel}
                  {vehicle ? `, ${vehicle}` : ''}
                </li>
              );
            })
          )}
        </ul>
        {current ? (
          <RouteInfoCard
            group={current.group}
            job={current.job}
            index={tourIndex}
            total={matching.length}
            vehicleLabel={formatVehicleLabel(current.job.vehicleModel, current.job.vehicleCondition, dict.vehicleConditions)}
            labels={dict.portfolio}
            mapLabels={dict.transferMap}
            statsLabels={dict.transferStats}
            lang={lang}
            onPrev={() => setTourIndex((value) => Math.max(0, value - 1))}
            onNext={() => setTourIndex((value) => Math.min(matching.length - 1, value + 1))}
            onClose={hideMatches}
          />
        ) : null}
      </div>
    </div>
  );
}

function RouteInfoCard({
  group,
  job,
  index,
  total,
  vehicleLabel,
  labels,
  mapLabels,
  statsLabels,
  lang,
  onPrev,
  onNext,
  onClose
}: {
  group: TransferMapGroup;
  job: TransferMapJob;
  index: number;
  total: number;
  vehicleLabel: string;
  labels: ReturnType<typeof getDictionary>['portfolio'];
  mapLabels: ReturnType<typeof getDictionary>['transferMap'];
  statsLabels: ReturnType<typeof getDictionary>['transferStats'];
  lang: Locale;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const hasMultiple = total > 1;
  const number = new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-GB');
  const countLabel = mapLabels.sectionCount.replace('{count}', String(total));

  return (
    <aside
      className="pointer-events-auto absolute bottom-4 left-4 right-4 z-30 max-w-md rounded-2xl border border-white/15 bg-surface/95 p-4 shadow-soft backdrop-blur-xl sm:right-auto"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-200">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: group.color }} />
            {group.typeLabel}
          </p>
          <p className="mt-1 text-lg font-semibold text-white">{job.title || group.pathLabel}</p>
          <p className="mt-1 text-sm font-medium text-accent">{countLabel}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300 hover:text-white"
        >
          {mapLabels.close}
        </button>
      </div>

      {hasMultiple ? (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={index === 0}
            className="rounded-lg border border-white/10 px-2 py-1 text-sm text-white disabled:opacity-30"
            aria-label={mapLabels.previousTour}
          >
            ‹
          </button>
          <p className="text-sm text-slate-300">
            {mapLabels.tourOf.replace('{current}', String(index + 1)).replace('{total}', String(total))}
          </p>
          <button
            type="button"
            onClick={onNext}
            disabled={index === total - 1}
            className="rounded-lg border border-white/10 px-2 py-1 text-sm text-white disabled:opacity-30"
            aria-label={mapLabels.nextTour}
          >
            ›
          </button>
        </div>
      ) : null}

      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        {vehicleLabel ? (
          <>
            <dt className="text-slate-400">{labels.vehicle}</dt>
            <dd className="text-slate-200">{vehicleLabel}</dd>
          </>
        ) : null}
        {job.brand ? (
          <>
            <dt className="text-slate-400">{labels.customer}</dt>
            <dd className="text-slate-200">{job.brand}</dd>
          </>
        ) : null}
        {job.publishedOn ? (
          <>
            <dt className="text-slate-400">{labels.published}</dt>
            <dd className="text-slate-200">{job.publishedOn}</dd>
          </>
        ) : null}
        {typeof job.distanceKm === 'number' && job.distanceKm > 0 ? (
          <>
            <dt className="text-slate-400">{statsLabels.kmUnit}</dt>
            <dd className="text-slate-200">
              {number.format(job.distanceKm)} {statsLabels.kmUnit}
            </dd>
          </>
        ) : null}
        {typeof job.durationHours === 'number' && job.durationHours > 0 ? (
          <>
            <dt className="text-slate-400">{statsLabels.hoursUnit}</dt>
            <dd className="text-slate-200">
              {number.format(job.durationHours)} {statsLabels.hoursUnit}
            </dd>
          </>
        ) : null}
      </dl>
      {job.description ? <p className="mt-3 text-sm leading-6 text-slate-300">{job.description}</p> : null}
    </aside>
  );
}
