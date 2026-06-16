import { getDictionary, type Locale } from './i18n';
import { getLocalizedUrl, organization, SITE_URL } from './site-config';

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: organization.address.street,
    postalCode: organization.address.postalCode,
    addressLocality: organization.address.city,
    addressCountry: organization.address.country
  };
}

export function getOrganizationSchema(locale: Locale) {
  const dict = getDictionary(locale);

  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: organization.legalName,
    alternateName: organization.brand,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-dark.png`,
    email: organization.email,
    description: dict.meta.description,
    address: postalAddress(),
    founder: {
      '@type': 'Person',
      name: organization.founder,
      jobTitle: locale === 'de' ? 'Gründer' : 'Founder',
      worksFor: { '@id': organizationId }
    },
    knowsAbout:
      locale === 'de'
        ? ['Softwareentwicklung', 'Fahrzeugtransfer', 'Content Creation', 'Sponsored Content']
        : ['Software development', 'Vehicle transfer', 'Content creation', 'Sponsored content'],
    areaServed: {
      '@type': 'Continent',
      name: 'Europe'
    }
  };
}

export function getWebsiteSchema(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: SITE_URL,
    name: organization.brand,
    description: getDictionary(locale).meta.description,
    inLanguage: ['de-DE', 'en-GB'],
    publisher: { '@id': organizationId }
  };
}

export function getSiteGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [getOrganizationSchema(locale), getWebsiteSchema(locale)]
  };
}

type WebPageSchemaInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  breadcrumbLabels?: string[];
};

export function getWebPageGraph({ locale, path, title, description, breadcrumbLabels }: WebPageSchemaInput) {
  const url = getLocalizedUrl(locale, path);
  const graph: Record<string, unknown>[] = [
    getOrganizationSchema(locale),
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { '@id': websiteId },
      inLanguage: locale === 'de' ? 'de-DE' : 'en-GB'
    }
  ];

  if (breadcrumbLabels?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbLabels.map((label, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: label,
        item: index === 0 ? getLocalizedUrl(locale) : index === breadcrumbLabels.length - 1 ? url : undefined
      }))
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

const serviceTypes: Record<string, { de: string; en: string }> = {
  software: { de: 'Individuelle Softwareentwicklung', en: 'Custom software development' },
  transfer: { de: 'Fahrzeugtransfer', en: 'Vehicle transfer' },
  sponsored: { de: 'Sponsored Content', en: 'Sponsored content' }
};

export function getServiceGraph(locale: Locale, slug: string, title: string, description: string) {
  const url = getLocalizedUrl(locale, slug);
  const serviceType = serviceTypes[slug]?.[locale] ?? title;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(locale),
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: title,
        description,
        serviceType,
        provider: { '@id': organizationId },
        areaServed: {
          '@type': 'Continent',
          name: 'Europe'
        },
        url
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { '@id': websiteId },
        about: { '@id': `${url}#service` },
        inLanguage: locale === 'de' ? 'de-DE' : 'en-GB'
      }
    ]
  };
}

export function getPymSoftwareGraph(locale: Locale) {
  const dict = getDictionary(locale);
  const url = getLocalizedUrl(locale, 'pym');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(locale),
      {
        '@type': 'SoftwareApplication',
        '@id': `${url}#software`,
        name: 'PlanYourMeals',
        alternateName: 'PYM',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'iOS, Android, Web',
        description: dict.pym.metaDescription,
        url,
        author: { '@id': organizationId },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR'
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: dict.pym.metaTitle,
        description: dict.pym.metaDescription,
        isPartOf: { '@id': websiteId },
        about: { '@id': `${url}#software` },
        inLanguage: locale === 'de' ? 'de-DE' : 'en-GB'
      }
    ]
  };
}
