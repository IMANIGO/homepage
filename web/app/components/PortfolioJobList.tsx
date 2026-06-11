import { getPortfolioImageUrl } from '../../lib/sanity';
import { normalizePublishPlatforms, type PublishPlatform } from '../../lib/publish-platforms';
import { normalizeSoftwareTypes } from '../../lib/software-types';
import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import type { TransferRouteResponse } from '../../lib/transfer-route-api';
import { getTransferRouteKey } from '../../lib/transfer-route-prefetch';
import { ProjectCard } from './ProjectCard';
import { SoftwareProjectCard } from './SoftwareProjectCard';
import { SponsoredProjectCard } from './SponsoredProjectCard';

export type PortfolioProject = {
  _type?: string;
  brand?: string;
  customer?: string;
  company?: string;
  title: string;
  description?: string;
  tourType?: string;
  routeFrom?: string;
  routeVia?: string;
  routeTo?: string;
  vehicleModel?: string;
  softwareTypes?: string[];
  softwareType?: string | string[];
  publishPlatforms?: (string | { label?: string; url?: string })[];
  visibility?: string;
  adType?: string;
  publishedWhere?: string;
  publishedWhen?: string;
  targetAudience?: string;
  image?: { alt?: string };
  year?: string;
  publishedOn?: string;
  tags?: string[];
  url?: string;
  downloadCount?: number;
  rating?: number;
  premiumSubscriberCount?: number;
  viewCount?: number;
  watchTimeHours?: number;
};

function resolvePortfolioKind(project: PortfolioProject, pageSlug: string) {
  if (project._type === 'portfolioSoftwareItem') {
    return 'software';
  }
  if (project._type === 'portfolioSponsoredItem') {
    return 'sponsored';
  }
  if (project._type === 'portfolioTransferItem') {
    return 'transfer';
  }
  if (pageSlug === 'software') {
    return 'software';
  }
  if (pageSlug === 'sponsored') {
    return 'sponsored';
  }
  return 'transfer';
}

function legacySoftwarePlatforms(project: PortfolioProject): PublishPlatform[] {
  if (project.publishPlatforms?.length) {
    return normalizePublishPlatforms(project.publishPlatforms, project.url);
  }
  if (project.publishedOn) {
    return normalizePublishPlatforms(
      project.publishedOn.split(',').map((part) => part.trim()).filter(Boolean),
      project.url
    );
  }
  const fromTags = project.tags?.filter((tag) =>
    ['App Store', 'Google Play', 'Web'].some((store) => tag.includes(store))
  );
  return normalizePublishPlatforms(fromTags, project.url);
}

export function PortfolioJobList({
  projects,
  lang,
  pageSlug,
  transferRoutes
}: {
  projects: PortfolioProject[];
  lang: Locale;
  pageSlug: string;
  transferRoutes?: Record<string, TransferRouteResponse>;
}) {
  if (!projects.length) {
    return null;
  }

  const dict = getDictionary(lang);

  return (
    <div className="grid gap-4">
      {projects.map((project, index) => {
        const kind = resolvePortfolioKind(project, pageSlug);
        const key = `${project.title}-${index}`;

        if (kind === 'software') {
          return (
            <SoftwareProjectCard
              key={key}
              lang={lang}
              labels={dict.softwarePortfolio}
              typeLabels={dict.softwareTypes}
              title={project.title}
              softwareTypes={normalizeSoftwareTypes(project.softwareTypes ?? project.softwareType)}
              customer={project.customer ?? project.brand}
              publishPlatforms={legacySoftwarePlatforms(project)}
              visibility={project.visibility ?? 'public'}
              description={project.description}
              year={project.year}
              imageUrl={getPortfolioImageUrl(project.image, 192)}
              imageAlt={project.image?.alt ?? project.title}
              tags={project.tags}
              downloadCount={project.downloadCount}
              rating={project.rating}
              premiumSubscriberCount={project.premiumSubscriberCount}
            />
          );
        }

        if (kind === 'sponsored') {
          return (
            <SponsoredProjectCard
              key={key}
              lang={lang}
              labels={dict.sponsoredPortfolio}
              adTypeLabels={dict.adTypes}
              title={project.title}
              adType={project.adType ?? 'reel'}
              company={project.company ?? project.brand}
              publishedWhere={project.publishedWhere ?? project.tags?.[0]}
              publishedWhen={project.publishedWhen ?? project.publishedOn}
              targetAudience={project.targetAudience}
              description={project.description}
              year={project.year}
              imageUrl={getPortfolioImageUrl(project.image, 192)}
              imageAlt={project.image?.alt ?? project.company ?? project.title}
              tags={project.tags}
              viewCount={project.viewCount}
              watchTimeHours={project.watchTimeHours}
            />
          );
        }

        const routeKey =
          project.routeFrom && project.routeTo
            ? getTransferRouteKey(project.tourType, project.routeFrom, project.routeVia, project.routeTo)
            : '';

        return (
          <ProjectCard
            key={key}
            labels={dict.portfolio}
            tourTypeLabels={dict.tourTypes}
            brand={project.brand}
            title={project.title}
            description={project.description}
            tourType={project.tourType}
            routeFrom={project.routeFrom}
            routeVia={project.routeVia}
            routeTo={project.routeTo}
            vehicleModel={project.vehicleModel}
            year={project.year}
            publishedOn={project.publishedOn}
            tags={project.tags}
            url={project.url}
            showRouteMap
            routeData={routeKey ? transferRoutes?.[routeKey] : undefined}
          />
        );
      })}
    </div>
  );
}
