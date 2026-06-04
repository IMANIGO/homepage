type Testimonial = { author?: string; company?: string; quote?: string; _id?: string };

const seedAuthorPattern = /mustermann|john\s+doe|jane\s+doe/i;
const seedCompanyPattern = /example\s*(gmbh|ltd|inc|corp)?/i;
const seedSponsoredCompanyPattern =
  /^(example\s*brand|partner\s*(ltd|gmbh)|beispiel\s*marke|partner\s*gmbh)$/i;
const seedSponsoredTitlePattern =
  /produktlaunch-kampagne|product launch campaign|langzeit-kooperation|long-term collaboration/i;

const slugAliases: Record<string, string> = {
  'sponsored-content': 'sponsored',
  'software-services': 'software',
  softwareentwicklung: 'software',
  ueberfuehrung: 'transfer',
  überführung: 'transfer',
  fahrzeugtransfer: 'transfer',
  'vehicle-transfer': 'transfer'
};

const routeSlugCandidates: Record<string, string[]> = {
  software: ['software', 'software-services', 'softwareentwicklung'],
  sponsored: ['sponsored', 'sponsored-content'],
  transfer: ['transfer', 'überführung', 'ueberfuehrung', 'fahrzeugtransfer', 'vehicle-transfer']
};

export function resolveSlug(slug: string | { current?: string } | null | undefined) {
  if (!slug) return '';
  const value = typeof slug === 'string' ? slug : slug.current ?? '';
  return slugAliases[value] ?? value;
}

export function getSanitySlugCandidates(routeSlug: string) {
  return routeSlugCandidates[routeSlug] ?? [routeSlug];
}

const legalSlugAliases: Record<string, string[]> = {
  impressum: ['impressum', 'impressum-de', 'legal-notice'],
  datenschutz: ['datenschutz', 'privacy-policy', 'privacy'],
  nutzungsbedingungen: ['nutzungsbedingungen', 'terms', 'terms-of-use'],
  'cookie-preferences': ['cookie-preferences', 'cookie-einstellungen', 'cookies']
};

export function getLegalDocumentId(locale: string, routeSlug: string) {
  return `legal-${routeSlug}-${locale}`;
}

export function getLegalSlugCandidates(routeSlug: string) {
  return legalSlugAliases[routeSlug] ?? [routeSlug];
}

export function isSeedTestimonial(testimonial: Testimonial) {
  return seedAuthorPattern.test(testimonial.author ?? '') || seedCompanyPattern.test(testimonial.company ?? '');
}

export function filterTestimonials(testimonials?: Testimonial[]) {
  return testimonials?.filter((item) => !isSeedTestimonial(item)) ?? [];
}

type PortfolioSeedItem = { company?: string; brand?: string; title?: string };

export function isSeedSponsoredProject(project: PortfolioSeedItem) {
  const company = (project.company ?? project.brand ?? '').trim();
  if (seedSponsoredCompanyPattern.test(company) || seedCompanyPattern.test(company)) {
    return true;
  }
  return seedSponsoredTitlePattern.test(project.title ?? '');
}

export function filterPortfolioProjects<T extends PortfolioSeedItem>(
  projects: T[] | undefined,
  pageSlug: string
): T[] {
  if (!projects?.length) {
    return [];
  }
  if (pageSlug !== 'sponsored') {
    return projects;
  }
  return projects.filter((item) => !isSeedSponsoredProject(item));
}

export function hasSeedMetrics(metrics?: { label?: string; value?: string }[]) {
  if (!metrics?.length) return true;
  return metrics.every((metric) => /^\d+$/.test(metric.value ?? '') || /projects|clients|engagements/i.test(metric.label ?? ''));
}
