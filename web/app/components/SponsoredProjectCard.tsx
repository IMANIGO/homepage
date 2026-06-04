import { formatPortfolioNumber } from '../../lib/portfolio-format';
import type { Locale } from '../../lib/i18n';

type SponsoredLabels = {
  title: string;
  adType: string;
  company: string;
  publishedWhere: string;
  publishedWhen: string;
  audience: string;
  description: string;
  tags: string;
  views: string;
  watchTime: string;
  hoursUnit: string;
};

type SponsoredProjectCardProps = {
  labels: SponsoredLabels;
  adTypeLabels: Record<string, string>;
  lang: Locale;
  title: string;
  adType?: string;
  company?: string;
  publishedWhere?: string;
  publishedWhen?: string;
  targetAudience?: string;
  description?: string;
  year?: string;
  imageUrl?: string;
  imageAlt?: string;
  tags?: string[];
  viewCount?: number;
  watchTimeHours?: number;
};

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-white">{value}</dd>
    </div>
  );
}

export function SponsoredProjectCard({
  labels,
  adTypeLabels,
  lang,
  title,
  adType,
  company,
  publishedWhere,
  publishedWhen,
  targetAudience,
  description,
  year,
  imageUrl,
  imageAlt,
  tags,
  viewCount,
  watchTimeHours
}: SponsoredProjectCardProps) {
  const tagList = tags?.filter(Boolean) ?? [];

  const metrics = [
    viewCount !== undefined && viewCount !== null
      ? { label: labels.views, value: formatPortfolioNumber(viewCount, lang) }
      : null,
    watchTimeHours !== undefined && watchTimeHours !== null
      ? {
          label: labels.watchTime,
          value: `${formatPortfolioNumber(watchTimeHours, lang)} ${labels.hoursUnit}`
        }
      : null
  ].filter((item): item is { label: string; value: string | null } => Boolean(item && item.value));

  return (
    <div className="card-surface relative">
      {year ? <span className="absolute right-6 top-6 z-10 text-sm text-slate-400">{year}</span> : null}
      <div className="flex flex-col gap-4 pr-10 sm:flex-row">
        {imageUrl ? (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2">
            <img
              src={imageUrl}
              alt={imageAlt ?? company ?? title}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          </div>
        ) : null}

        <dl className="min-w-0 flex-1 space-y-3 text-sm">
          <div className="grid grid-cols-[minmax(0,7.5rem)_1fr] gap-x-3 gap-y-1">
            <dt className="text-slate-400">{labels.title}</dt>
            <dd className="font-medium text-white">{title}</dd>

            {adType ? (
              <>
                <dt className="text-slate-400">{labels.adType}</dt>
                <dd className="text-slate-200">{adTypeLabels[adType] ?? adType}</dd>
              </>
            ) : null}

            {company ? (
              <>
                <dt className="text-slate-400">{labels.company}</dt>
                <dd className="text-slate-200">{company}</dd>
              </>
            ) : null}

            {publishedWhere ? (
              <>
                <dt className="text-slate-400">{labels.publishedWhere}</dt>
                <dd className="text-slate-200">{publishedWhere}</dd>
              </>
            ) : null}

            {publishedWhen ? (
              <>
                <dt className="text-slate-400">{labels.publishedWhen}</dt>
                <dd className="text-slate-200">{publishedWhen}</dd>
              </>
            ) : null}

            {targetAudience ? (
              <>
                <dt className="text-slate-400">{labels.audience}</dt>
                <dd className="text-slate-200">{targetAudience}</dd>
              </>
            ) : null}
          </div>

          {description ? <p className="text-sm leading-6 text-slate-300">{description}</p> : null}

          {tagList.length ? (
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">{labels.tags}</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {tagList.map((tag) => (
                  <span
                    key={tag}
                    className="flex min-h-[2.75rem] items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-center text-sm leading-5 text-cyan-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {metrics.length ? (
            <dl className="grid grid-cols-2 gap-3">
              {metrics.map((metric) => (
                <MetricTile key={metric.label} label={metric.label} value={metric.value!} />
              ))}
            </dl>
          ) : null}
        </dl>
      </div>
    </div>
  );
}
