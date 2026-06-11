'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { preloadLeaflet } from '../../lib/leaflet-loader';
import type { TransferRouteResponse } from '../../lib/transfer-route-api';
import {
  formatTransferRouteLabel,
  isTransferRouteComplete,
  normalizeTourType,
  type TourType
} from '../../lib/transfer-route';
const TransferRouteMap = dynamic(() => import('./TransferRouteMap').then((mod) => mod.TransferRouteMap), {
  ssr: false,
  loading: () => <div className="h-36 w-full animate-pulse rounded-xl border border-white/15 bg-slate-100 sm:h-32 sm:w-44" />
});

type PortfolioLabels = {
  name: string;
  customer: string;
  vehicle: string;
  route: string;
  tourType: string;
  features: string;
  published: string;
  website: string;
};

type ProjectCardProps = {
  labels: PortfolioLabels;
  tourTypeLabels: Record<TourType, string>;
  brand?: string;
  title: string;
  description?: string;
  tourType?: string | null;
  routeFrom?: string;
  routeVia?: string;
  routeTo?: string;
  vehicleModel?: string;
  year?: string;
  tags?: string[];
  publishedOn?: string;
  url?: string;
  showRouteMap?: boolean;
  routeData?: TransferRouteResponse;
};

export function ProjectCard({
  labels,
  tourTypeLabels,
  brand,
  title,
  description,
  tourType,
  routeFrom,
  routeVia,
  routeTo,
  vehicleModel,
  year,
  tags,
  publishedOn,
  url,
  showRouteMap = false,
  routeData
}: ProjectCardProps) {
  const features = tags?.filter(Boolean) ?? [];
  const normalizedTourType = normalizeTourType(tourType);
  const hasRoute = Boolean(
    showRouteMap && isTransferRouteComplete(normalizedTourType, routeFrom, routeVia, routeTo)
  );

  useEffect(() => {
    if (hasRoute) {
      preloadLeaflet();
    }
  }, [hasRoute]);
  const routeDisplay = hasRoute
    ? formatTransferRouteLabel(normalizedTourType, routeFrom!, routeVia, routeTo!, tourTypeLabels)
    : null;

  return (
    <div className="card-surface relative">
      {year ? <span className="absolute right-6 top-6 z-10 text-sm text-slate-400">{year}</span> : null}
      <div className="flex flex-col gap-4 pr-10 sm:flex-row">
        {hasRoute && routeDisplay ? (
          <div className="w-full shrink-0 sm:w-44">
            <TransferRouteMap
              tourType={normalizedTourType}
              routeFrom={routeFrom!}
              routeVia={routeVia}
              routeTo={routeTo!}
              routePathLabel={routeDisplay.path}
              prefetchedRoute={routeData}
            />
          </div>
        ) : null}

        <dl className="min-w-0 flex-1 space-y-3 text-sm">
          <div className="grid grid-cols-[minmax(0,7.5rem)_1fr] gap-x-3 gap-y-1">
            {hasRoute && routeDisplay ? (
              <>
                <dt className="text-slate-400">{labels.tourType}</dt>
                <dd className="font-medium text-accent">{routeDisplay.typeLabel}</dd>
                <dt className="text-slate-400">{labels.route}</dt>
                <dd className="font-medium text-white">{routeDisplay.path}</dd>
              </>
            ) : (
              <>
                <dt className="text-slate-400">{labels.name}</dt>
                <dd className="font-medium text-white">{title}</dd>
              </>
            )}

            {vehicleModel ? (
              <>
                <dt className="text-slate-400">{labels.vehicle}</dt>
                <dd className="text-slate-200">{vehicleModel}</dd>
              </>
            ) : null}

            {brand ? (
              <>
                <dt className="text-slate-400">{labels.customer}</dt>
                <dd className="text-slate-200">{brand}</dd>
              </>
            ) : null}

            {publishedOn ? (
              <>
                <dt className="text-slate-400">{labels.published}</dt>
                <dd className="text-slate-200">{publishedOn}</dd>
              </>
            ) : null}

            {url ? (
              <>
                <dt className="text-slate-400">{labels.website}</dt>
                <dd>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="break-all text-accent hover:underline">
                    {url.replace(/^https?:\/\//, '')}
                  </a>
                </dd>
              </>
            ) : null}
          </div>

          {description ? <p className="text-sm leading-6 text-slate-300">{description}</p> : null}

          {features.length ? (
            <div>
              <dd className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {features.map((feature) => (
                  <span
                    key={feature}
                    className="flex min-h-[2.75rem] w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-center text-sm leading-5 text-cyan-100"
                  >
                    {feature}
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}
