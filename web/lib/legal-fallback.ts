import legalPages from '../../studio/data/legal-pages.json';
import type { Locale } from './i18n';

type LegalPageDoc = {
  locale: string;
  slug: { current: string };
  title: string;
  eyebrow?: string;
  intro?: string;
  description?: string;
  body?: { heading: string; text: string }[];
};

export function getLegalPageFallback(locale: Locale, slug: string) {
  const doc = (legalPages as LegalPageDoc[]).find(
    (page) => page.locale === locale && page.slug.current === slug
  );

  if (!doc) {
    return null;
  }

  return {
    title: doc.title,
    eyebrow: doc.eyebrow,
    intro: doc.intro,
    description: doc.description,
    body: doc.body ?? []
  };
}
