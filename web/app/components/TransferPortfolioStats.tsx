import { computeTransferStats, formatStatNumber } from '../../lib/transfer-stats';
import type { Locale } from '../../lib/i18n';
import type { TransferPortfolioItem } from '../../lib/transfer-stats';

type TransferStatsLabels = {
  title: string;
  totalJobs: string;
  totalKm: string;
  totalHours: string;
  abTours: string;
  abcTours: string;
  roundTours: string;
  vehicles: string;
  kmUnit: string;
  hoursUnit: string;
};

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

  const items = [
    { label: labels.totalJobs, value: formatStatNumber(stats.totalJobs, lang) },
    {
      label: labels.totalKm,
      value:
        stats.jobsWithDistance > 0
          ? `${formatStatNumber(stats.totalKm, lang)} ${labels.kmUnit}`
          : '–'
    },
    {
      label: labels.totalHours,
      value:
        stats.jobsWithDuration > 0
          ? `${formatStatNumber(stats.totalHours, lang)} ${labels.hoursUnit}`
          : '–'
    },
    { label: labels.abTours, value: formatStatNumber(stats.abTours, lang) },
    { label: labels.abcTours, value: formatStatNumber(stats.abcTours, lang) },
    { label: labels.roundTours, value: formatStatNumber(stats.roundTours, lang) },
    { label: labels.vehicles, value: formatStatNumber(stats.vehicleCount, lang) }
  ];

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">{labels.title}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
            <dt className="text-xs text-slate-400">{item.label}</dt>
            <dd className="mt-1 text-lg font-semibold text-white">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
