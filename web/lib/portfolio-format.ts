import type { Locale } from './i18n';

export function formatPortfolioNumber(value: number | undefined, locale: Locale) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return null;
  }

  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1
  }).format(value);
}
