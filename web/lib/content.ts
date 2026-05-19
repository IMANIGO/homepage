import { pageRoutes as routePaths } from './i18n';

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

export const pageRoutes = routePaths;
