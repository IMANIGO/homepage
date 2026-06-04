import { pageRoutes as routePaths } from './i18n';
import { resolveSlug } from './cms-helpers';

export const getRoute = (locale: string, slug: string) => {
  return `/${locale}/${slug}`;
};

export const navItems = [
  { slug: 'software', path: '/software' },
  { slug: 'transfer', path: '/transfer' },
  { slug: 'sponsored', path: '/sponsored' },
  { slug: 'about', path: '/about' },
  { slug: 'contact', path: '/contact' }
];

export function getActiveNavSlug(pathname: string) {
  const segment = pathname.split('/').filter(Boolean)[1];
  if (!segment) {
    return null;
  }

  const slug = resolveSlug(segment);
  return navItems.some((item) => item.slug === slug) ? slug : null;
}

const contactRelatedSlugs = new Set(['contact', 'book-call']);

export const relatedPageSlugs: Record<string, string[]> = {
  software: ['transfer', 'sponsored', 'contact'],
  transfer: ['software', 'sponsored', 'contact'],
  sponsored: ['software', 'transfer', 'contact'],
  about: ['software', 'transfer', 'contact'],
  contact: ['software', 'transfer', 'book-call'],
  'book-call': ['software', 'transfer', 'contact'],
  impressum: ['datenschutz', 'nutzungsbedingungen', 'contact'],
  datenschutz: ['nutzungsbedingungen', 'impressum', 'cookie-preferences'],
  nutzungsbedingungen: ['datenschutz', 'impressum', 'contact'],
  'cookie-preferences': ['datenschutz', 'impressum', 'contact']
};

function dedupeContactRelated(slugs: string[]) {
  const contactEntries = slugs.filter((slug) => contactRelatedSlugs.has(slug));
  if (contactEntries.length <= 1) {
    return slugs;
  }

  const preferred = slugs.includes('contact') ? 'contact' : 'book-call';
  return slugs.filter((slug) => !contactRelatedSlugs.has(slug) || slug === preferred);
}

export const getRelatedSlugs = (slug: string) =>
  dedupeContactRelated(relatedPageSlugs[slug] ?? ['software', 'transfer', 'contact']);

export const pageRoutes = routePaths;
