import { Fragment } from 'react';
import { linkifyText } from '../../lib/linkify';
import { formatPortfolioNumber } from '../../lib/portfolio-format';
import type { PublishPlatform } from '../../lib/publish-platforms';
import { formatSoftwareTypes } from '../../lib/software-types';
import type { Locale } from '../../lib/i18n';

type SoftwareLabels = {
  name: string;
  type: string;
  customer: string;
  publishedOn: string;
  visibility: string;
  year: string;
  features: string;
  description: string;
  downloads: string;
  rating: string;
  premiumSubs: string;
  visibilityPublic: string;
  visibilityPrivate: string;
};

type SoftwareProjectCardProps = {
  labels: SoftwareLabels;
  typeLabels: Record<string, string>;
  lang: Locale;
  title: string;
  softwareTypes?: string[];
  customer?: string;
  publishPlatforms?: PublishPlatform[];
  visibility?: string;
  description?: string;
  year?: string;
  imageUrl?: string;
  imageAlt?: string;
  tags?: string[];
  downloadCount?: number;
  rating?: number;
  premiumSubscriberCount?: number;
};

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-white">{value}</dd>
    </div>
  );
}

export function SoftwareProjectCard({
  labels,
  typeLabels,
  lang,
  title,
  softwareTypes,
  customer,
  publishPlatforms,
  visibility,
  description,
  year,
  imageUrl,
  imageAlt,
  tags,
  downloadCount,
  rating,
  premiumSubscriberCount
}: SoftwareProjectCardProps) {
  const features = tags?.filter(Boolean) ?? [];
  const platforms = publishPlatforms?.filter((platform) => platform.label) ?? [];
  const linkClassName = 'text-accent hover:underline';
  const visibilityLabel =
    visibility === 'private' ? labels.visibilityPrivate : visibility === 'public' ? labels.visibilityPublic : null;

  const metrics = [
    downloadCount !== undefined && downloadCount !== null
      ? { label: labels.downloads, value: formatPortfolioNumber(downloadCount, lang) }
      : null,
    rating !== undefined && rating !== null
      ? { label: labels.rating, value: formatPortfolioNumber(rating, lang) ?? '' }
      : null,
    premiumSubscriberCount !== undefined && premiumSubscriberCount !== null
      ? { label: labels.premiumSubs, value: formatPortfolioNumber(premiumSubscriberCount, lang) }
      : null
  ].filter((item): item is { label: string; value: string | null } => Boolean(item && item.value));

  return (
    <div className="card-surface relative">
      {year ? <span className="absolute right-6 top-6 z-10 text-sm text-slate-400">{year}</span> : null}
      <div className="flex flex-col gap-4 pr-10 sm:flex-row">
        {imageUrl ? (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2">
            <img src={imageUrl} alt={imageAlt ?? title} className="max-h-full max-w-full object-contain" loading="lazy" />
          </div>
        ) : null}

        <dl className="min-w-0 flex-1 space-y-3 text-sm">
          <div className="grid grid-cols-[minmax(0,7.5rem)_1fr] gap-x-3 gap-y-1">
            <dt className="text-slate-400">{labels.name}</dt>
            <dd className="font-medium text-white">{title}</dd>

            {softwareTypes?.length ? (
              <>
                <dt className="text-slate-400">{labels.type}</dt>
                <dd className="text-slate-200">{formatSoftwareTypes(softwareTypes, typeLabels)}</dd>
              </>
            ) : null}

            {customer ? (
              <>
                <dt className="text-slate-400">{labels.customer}</dt>
                <dd className="text-slate-200">{customer}</dd>
              </>
            ) : null}

            {platforms.length ? (
              <>
                <dt className="text-slate-400">{labels.publishedOn}</dt>
                <dd className="text-slate-200">
                  {platforms.map((platform, index) => (
                    <Fragment key={`${platform.label}-${index}`}>
                      {index > 0 ? <span className="text-slate-500"> · </span> : null}
                      {platform.url ? (
                        <a href={platform.url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
                          {platform.label}
                        </a>
                      ) : (
                        <span>{linkifyText(platform.label)}</span>
                      )}
                    </Fragment>
                  ))}
                </dd>
              </>
            ) : null}

            {visibilityLabel ? (
              <>
                <dt className="text-slate-400">{labels.visibility}</dt>
                <dd className="text-slate-200">{visibilityLabel}</dd>
              </>
            ) : null}
          </div>

          {description ? <p className="text-sm leading-6 text-slate-300">{description}</p> : null}

          {features.length ? (
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">{labels.features}</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {features.map((feature) => (
                  <span
                    key={feature}
                    className="flex min-h-[2.75rem] items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-center text-sm leading-5 text-cyan-100"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {metrics.length ? (
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
