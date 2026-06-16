import type { Metadata } from 'next';
import { getLocaleOpenGraph, getLocalizedUrl, OG_IMAGE_URL, organization } from './site-config';
import type { Locale } from './i18n';

type PageMetadataInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  siteName?: string;
};

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  siteName = organization.brand
}: PageMetadataInput): Metadata {
  const url = getLocalizedUrl(locale, path);
  const brandedTitle = `${organization.brand} · ${title}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        de: getLocalizedUrl('de', path),
        en: getLocalizedUrl('en', path)
      }
    },
    openGraph: {
      title: brandedTitle,
      description,
      url,
      siteName,
      locale: getLocaleOpenGraph(locale),
      type: 'website',
      images: [
        {
          url: OG_IMAGE_URL,
          width: 180,
          height: 56,
          alt: siteName
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: brandedTitle,
      description,
      images: [OG_IMAGE_URL]
    }
  };
}
