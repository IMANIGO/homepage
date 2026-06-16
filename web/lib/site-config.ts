import type { Locale } from './i18n';

export const SITE_URL = 'https://imanigo.de';
export const OG_IMAGE_PATH = '/images/logo-dark.png';
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export const organization = {
  name: 'IMANIGO',
  brand: 'IMANIGO',
  legalForm: {
    de: 'Einzelunternehmen',
    en: 'Sole proprietorship'
  },
  email: 'contact@imanigo.de',
  owner: 'Lukas Imanuel Hradetzky',
  address: {
    street: 'Adalbert-Stifter-Str. 32',
    postalCode: '83301',
    city: 'Traunreut',
    country: 'DE'
  }
} as const;

export function getLocaleOpenGraph(locale: Locale) {
  return locale === 'de' ? 'de_DE' : 'en_GB';
}

export function getLocalizedUrl(locale: Locale, path = '') {
  const normalized = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `${SITE_URL}/${locale}${normalized}`;
}
