import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { Locale } from './i18n';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-01';

const config = {
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  ignoreBrowserTokenWarning: true
};

export const sanityClient = projectId ? createClient(config) : null;
const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export const urlFor = (source: any) => {
  if (!builder) return '';
  return builder.image(source).auto('format').url();
};

export async function getHomePage(locale: Locale) {
  if (!sanityClient) {
    return null;
  }

  return sanityClient.fetch(
    `*[_type == 'homePage' && locale == $locale][0]{
      heroTitle,
      heroSubtitle,
      aboutSummary,
      serviceCards[]->{title,slug,summary},
      trustPoints[]{tag,title,detail},
      testimonials[]->{_id,author,company,quote},
      metrics[]->{_id,label,value,detail}
    }`,
    { locale }
  );
}

export async function getPageContent(locale: Locale, slug: string) {
  if (!sanityClient) {
    if (slug === 'book-call') {
      return {
        title: locale === 'de' ? 'Kostenloses Erstgespräch' : 'Free discovery call',
        eyebrow: '',
        intro: locale === 'de' ? 'Ich öffne den Dialog mit einer klaren Agenda.' : 'I open the call with a concise agenda.',
        body: [
          { heading: locale === 'de' ? 'Ablauf' : 'How it works', text: locale === 'de' ? 'Wir klären Ziele, Budgetrahmen und nächsten Schritte.' : 'We clarify goals, budget and next steps.' }
        ]
      };
    }
    return null;
  }
  const serviceSlugs = ['software', 'transfer', 'sponsored'];
  const legalSlugs = ['impressum', 'datenschutz', 'cookie-preferences'];

  if (serviceSlugs.includes(slug)) {
    return sanityClient.fetch(`*[_type == 'servicePage' && locale == $locale && slug.current == $slug][0]{title,eyebrow,intro,description,body[]{heading,text}}`, { locale, slug });
  }

  if (legalSlugs.includes(slug)) {
    return sanityClient.fetch(`*[_type == 'legalPage' && locale == $locale && slug.current == $slug][0]{title,eyebrow,intro,description,body[]{heading,text}}`, { locale, slug });
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
      intro: locale === 'de' ? 'Ich öffne den Dialog mit einer klaren Agenda.' : 'I open the call with a concise agenda.',
      body: [
        { heading: locale === 'de' ? 'Ablauf' : 'How it works', text: locale === 'de' ? 'Wir klären Ziele, Budgetrahmen und nächsten Schritte.' : 'We clarify goals, budget and next steps.' }
      ]
    };
  }

  return null;
}

export function getPageSlugs() {
  return ['software', 'transfer', 'sponsored', 'about', 'contact', 'impressum', 'datenschutz', 'cookie-preferences', 'book-call'];
}
