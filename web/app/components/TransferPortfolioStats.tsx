'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { computeTransferStats, formatStatNumber } from '../../lib/transfer-stats';
import type { Locale } from '../../lib/i18n';
import type { TransferPortfolioItem } from '../../lib/transfer-stats';

type TransferStatsLabels = {
  title: string;
  totalJobs: string;
  totalHours: string;
  totalKm: string;
  abTours: string;
  abcTours: string;
  roundTours: string;
  vehicles: string;
  kmUnit: string;
  hoursUnit: string;
  shortestKm: string;
  longestKm: string;
  averageKm: string;
  averageTimePerKm: string;
  minutesPerKmUnit: string;
};

function StatCard({
  label,
  value,
  tooltip,
  tooltipAlign = 'center'
}: {
  label: string;
  value: string;
  tooltip?: string[];
  tooltipAlign?: 'center' | 'end';
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, transform: 'translate(-50%, -100%)' });
  const hasTooltip = Boolean(tooltip?.length);

  const updatePosition = () => {
    const box = cardRef.current?.getBoundingClientRect();
    if (!box) {
      return;
    }

    const left = tooltipAlign === 'end' ? box.right : box.left + box.width / 2;
    setCoords({
      top: box.top - 8,
      left,
      transform: tooltipAlign === 'end' ? 'translate(-100%, -100%)' : 'translate(-50%, -100%)'
    });
  };

  const show = () => {
    if (!hasTooltip) {
      return;
    }
    updatePosition();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const onReposition = () => updatePosition();
    window.addEventListener('scroll', onReposition, true);
    window.addEventListener('resize', onReposition);
    return () => {
      window.removeEventListener('scroll', onReposition, true);
      window.removeEventListener('resize', onReposition);
    };
  }, [open, tooltipAlign]);

  return (
    <div
      ref={cardRef}
      tabIndex={hasTooltip ? 0 : undefined}
      onMouseEnter={show}
      onMouseLeave={() => setOpen(false)}
      onFocus={show}
      onBlur={() => setOpen(false)}
      onClick={() => {
        if (!hasTooltip) {
          return;
        }
        if (open) {
          setOpen(false);
        } else {
          show();
        }
      }}
      className={`relative rounded-xl border border-white/10 bg-white/5 px-3 py-3${
        hasTooltip ? ' cursor-help' : ''
      }`}
    >
      <dt className={`text-xs text-slate-400${hasTooltip ? ' underline decoration-dotted decoration-slate-500 underline-offset-4' : ''}`}>
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold text-white">{value}</dd>
      {hasTooltip && open
        ? createPortal(
            <div
              role="tooltip"
              className="pointer-events-none w-max max-w-[min(20rem,calc(100vw-1.5rem))] rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs leading-5 text-slate-900 shadow-[0_12px_40px_rgba(0,0,0,0.45)] [&_p]:m-0"
              style={{
                position: 'fixed',
                top: coords.top,
                left: Math.min(Math.max(coords.left, 12), typeof window === 'undefined' ? coords.left : window.innerWidth - 12),
                transform: coords.transform,
                zIndex: 200
              }}
            >
              {tooltip!.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

export function TransferPortfolioStats({
  projects,
  lang,
  labels
}: {
  projects: TransferPortfolioItem[];
  lang: Locale;
  labels: TransferStatsLabels;
}) {
  const stats = computeTransferStats(projects);
  const kmLabel = (km: number, title: string) =>
    title
      ? `${formatStatNumber(km, lang)} ${labels.kmUnit} · ${title}`
      : `${formatStatNumber(km, lang)} ${labels.kmUnit}`;

  const items = [
    { label: labels.totalJobs, value: formatStatNumber(stats.totalJobs, lang) },
    {
      label: labels.totalKm,
      value:
        stats.jobsWithDistance > 0
          ? `${formatStatNumber(stats.totalKm, lang)} ${labels.kmUnit}`
          : '–',
      tooltip: [
        stats.shortestKm
          ? `${labels.shortestKm}: ${kmLabel(stats.shortestKm.km, stats.shortestKm.title)}`
          : null,
        stats.longestKm
          ? `${labels.longestKm}: ${kmLabel(stats.longestKm.km, stats.longestKm.title)}`
          : null,
        stats.averageKm
          ? `${labels.averageKm}: ${kmLabel(Math.round(stats.averageKm), '')}`
          : null
      ].filter((line): line is string => Boolean(line))
    },
    {
      label: labels.totalHours,
      value:
        stats.jobsWithDuration > 0
          ? `${formatStatNumber(stats.totalHours, lang)} ${labels.hoursUnit}`
          : '–',
      tooltip:
        stats.minutesPerKm != null
          ? [
              `${labels.averageTimePerKm}: ${formatStatNumber(stats.minutesPerKm, lang, {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1
              })} ${labels.minutesPerKmUnit}`
            ]
          : undefined
    },
    { label: labels.abTours, value: formatStatNumber(stats.abTours, lang) },
    { label: labels.abcTours, value: formatStatNumber(stats.abcTours, lang) },
    { label: labels.roundTours, value: formatStatNumber(stats.roundTours, lang) },
    {
      label: labels.vehicles,
      value: formatStatNumber(stats.vehicleCount, lang),
      tooltip: stats.vehicleModels.length ? stats.vehicleModels : undefined
    }
  ];

  return (
    <div className="relative z-20 w-full overflow-visible rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">{labels.title}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 overflow-visible sm:grid-cols-3 lg:grid-cols-7">
        {items.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            tooltip={item.tooltip}
            tooltipAlign={item.label === labels.vehicles ? 'end' : 'center'}
          />
        ))}
      </dl>
    </div>
  );
}
