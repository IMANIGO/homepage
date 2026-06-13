import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { getLegalDocumentId, getLegalSlugCandidates, getSanitySlugCandidates } from './cms-helpers';
import { getLegalPageFallback } from './legal-fallback';
import type { Locale } from './i18n';
import { getDictionary } from './i18n';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-01';

const config = {
  projectId,
  dataset,
  apiVersion,
  // CDN API uses fetch — required on Cloudflare Workers (no Node https).
  useCdn: true
};

export const sanityClient = projectId ? createClient(config) : null;
const builder =
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }) : null;

export const urlFor = (source: any) => {
  if (!builder) return '';
  return builder.image(source).auto('format').url();
};

export const getPortfolioImageUrl = (source: any, width = 192) => {
  if (!source || !builder) return '';
  return builder.image(source).width(width).auto('format').fit('max').url();
};

function getServicePageFallback(locale: Locale, slug: string) {
  if (!['software', 'transfer', 'sponsored'].includes(slug)) {
    return null;
  }

  const dict = getDictionary(locale);
  const serviceSlug = slug as 'software' | 'transfer' | 'sponsored';
  const summaryKey = `${serviceSlug}Summary` as 'softwareSummary' | 'transferSummary' | 'sponsoredSummary';

  return {
    title: dict.pageTitles[serviceSlug],
    eyebrow: dict.navLabels[serviceSlug],
    intro: dict.services[summaryKey],
    description: dict.services[summaryKey],
    body: [] as { heading: string; text: string }[]
  };
}

export async function getSiteSettings(locale: Locale) {
  if (!sanityClient) {
    return null;
  }

  return sanityClient.fetch<{ phone?: string; phoneHidden?: boolean; email?: string } | null>(
    `*[_type == 'siteSettings' && locale == $locale][0]{ phone, phoneHidden, email }`,
    { locale }
  );
}

export async function getHomePage(locale: Locale) {
  if (!sanityClient) {
    return null;
  }

  return sanityClient.fetch(
    `*[_type == 'homePage' && locale == $locale][0]{
      heroTitle,
      heroSubtitle,
      aboutSummary,
      serviceCards[]->{title,"slug": coalesce(websitePage, slug.current),"summary": coalesce(intro, description)},
      trustPoints[]{tag,title,detail},
      testimonials[]->{_id,author,company,quote},
      metrics[]->{_id,label,value,detail}
    }`,
    { locale }
  );
}

export async function getPageContent(locale: Locale, slug: string) {
  const legalSlugs = ['impressum', 'datenschutz', 'nutzungsbedingungen', 'cookie-preferences'];

  if (!sanityClient) {
    if (slug === 'book-call') {
      return {
        title: locale === 'de' ? 'Kostenloses Erstgespräch' : 'Free discovery call',
        eyebrow: '',
        intro: '',
        body: [
          { heading: locale === 'de' ? 'Ablauf' : 'How it works', text: locale === 'de' ? 'Wir klären Ziele, Budgetrahmen und die nächsten Schritte.' : 'We clarify goals, budget and next steps.' }
        ]
      };
    }
    if (legalSlugs.includes(slug)) {
      return getLegalPageFallback(locale, slug);
    }
    return null;
  }
  const serviceSlugs = ['software', 'transfer', 'sponsored'];

  if (serviceSlugs.includes(slug)) {
    const page =
      (await sanityClient.fetch(
        `*[_type == 'servicePage' && locale == $locale && coalesce(websitePage, slug.current) in $slugs][0]{
          title,eyebrow,intro,description,
          body[]{heading,text,sections[]{title,items}},
          projects[]{
            _type,
            brand,customer,company,title,description,
            tourType,routeFrom,routeVia,routeTo,vehicleModel,distanceKm,durationHours,durationDays,
            softwareTypes,softwareType,publishPlatforms,visibility,
            adType,publishedWhere,publishedWhen,targetAudience,
            downloadCount,rating,premiumSubscriberCount,viewCount,watchTimeHours,
            image{asset,alt},year,publishedOn,tags,url
          }
        }`,
        { locale, slugs: getSanitySlugCandidates(slug) }
      )) ?? getServicePageFallback(locale, slug);

    return page;
  }

  if (legalSlugs.includes(slug)) {
    const page = await sanityClient.fetch(
      `*[_type == 'legalPage' && (_id == $docId || (locale == $locale && slug.current in $slugCandidates))][0]{
        title,eyebrow,intro,description,body[]{heading,text}
      }`,
      {
        docId: getLegalDocumentId(locale, slug),
        locale,
        slugCandidates: getLegalSlugCandidates(slug)
      }
    );
    return page ?? getLegalPageFallback(locale, slug);
  }

  if (slug === 'about') {
    return sanityClient.fetch(`*[_type == 'aboutPage' && locale == $locale][0]{title,eyebrow,intro,description,body[]{heading,text}}`, { locale });
  }

  if (slug === 'contact') {
    return sanityClient.fetch(`*[_type == 'contactPage' && locale == $locale][0]{title,eyebrow,intro,description,body[]{heading,text}}`, { locale });
  }

  if (slug === 'book-call') {
    return {
      title: locale === 'de' ? 'Kostenloses Erstgespräch' : 'Free discovery call',
      eyebrow: '',
      intro: '',
      body: [
        { heading: locale === 'de' ? 'Ablauf' : 'How it works', text: locale === 'de' ? 'Wir klären Ziele, Budgetrahmen und die nächsten Schritte.' : 'We clarify goals, budget and next steps.' }
      ]
    };
  }

  return null;
}

export function getPageSlugs() {
  return ['software', 'transfer', 'sponsored', 'about', 'contact', 'impressum', 'datenschutz', 'nutzungsbedingungen', 'cookie-preferences', 'book-call'];
}
