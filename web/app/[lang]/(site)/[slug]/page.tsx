import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '../../../../lib/i18n';
import { getPageContent, getPageSlugs } from '../../../../lib/sanity';
import { filterPortfolioProjects } from '../../../../lib/cms-helpers';
import { getRelatedSlugs, getRoute } from '../../../../lib/content';
import { EmailLink } from '../../../components/EmailLink';
import { SectionHeading } from '../../../components/SectionHeading';
import { PageSidebar } from '../../../components/PageSidebar';
import { GlowDivider } from '../../../components/GlowDivider';
import { PageBodySection } from '../../../components/PageBodySection';
import { PortfolioJobList, type PortfolioProject } from '../../../components/PortfolioJobList';
import { TransferPortfolioStats } from '../../../components/TransferPortfolioStats';
import { prefetchTransferRoutes } from '../../../../lib/transfer-route-prefetch';

export const revalidate = 60;

export async function generateStaticParams() {
  return getPageSlugs().flatMap((slug) => ['de', 'en'].map((lang) => ({ lang, slug })));
}

type PageProps = {
  params?: Promise<{
    lang: string;
    slug: string;
  }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  if (!params) {
    return {};
  }

  const locale = params.lang as 'de' | 'en';
  const dict = getDictionary(locale);
  const slug = params.slug as keyof typeof dict.pageTitles;
  const pageData = await getPageContent(locale, params.slug);
  const title = pageData?.title ?? dict.pageTitles[slug] ?? dict.brand;
  const description = pageData?.intro ?? pageData?.description ?? dict.meta.description;

  return {
    title: `${dict.brand} · ${title}`,
    description,
    alternates: {
      canonical: `https://imanigo.de/${locale}/${params.slug}`,
      languages: {
        en: `https://imanigo.de/en/${params.slug}`,
        de: `https://imanigo.de/de/${params.slug}`
      }
    },
    openGraph: {
      title: `${dict.brand} · ${title}`,
      description,
      url: `https://imanigo.de/${locale}/${params.slug}`,
      siteName: dict.brand,
      locale: locale === 'de' ? 'de_DE' : 'en_GB',
      type: 'website'
    }
  };
}

export default async function Page(props: PageProps) {
  const params = await props.params;

  if (!params) {
    return notFound();
  }

  const locale = params.lang as 'de' | 'en';
  const dict = getDictionary(locale);
  const pageData = await getPageContent(locale, params.slug);

  if (!pageData) {
    return notFound();
  }

  const slug = params.slug as keyof typeof dict.pageTitles;
  const isBookCall = params.slug === 'book-call';
  const relatedSlugs = getRelatedSlugs(params.slug).filter((item) => item !== params.slug);
  const showcaseLabels =
    params.slug === 'software'
      ? dict.softwareProjects
      : params.slug === 'transfer'
        ? dict.transferShowcase
        : params.slug === 'sponsored'
          ? dict.sponsoredShowcase
          : null;
  const hasShowcaseSection = Boolean(showcaseLabels);
  const portfolioProjects = filterPortfolioProjects(
    (pageData.projects ?? []) as PortfolioProject[],
    params.slug
  );
  const leftColumnJobs = portfolioProjects.filter((_, index) => index % 2 === 0);
  const rightColumnJobs = portfolioProjects.filter((_, index) => index % 2 === 1);
  const isTransferShowcase = params.slug === 'transfer' && hasShowcaseSection;
  const transferRoutes = isTransferShowcase ? await prefetchTransferRoutes(portfolioProjects) : undefined;
  const transferGridClass =
    'grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] lg:grid-rows-[auto_auto_auto_auto] lg:items-start lg:gap-x-8';

  return (
    <article className="space-y-10 py-10">
      <SectionHeading
        eyebrow={pageData.eyebrow ?? dict.pageTitles[slug] ?? ''}
        title={pageData.title ?? dict.pageTitles[slug]}
        description={pageData.intro ?? pageData.description ?? ''}
      />
      <div
        className={
          isTransferShowcase
            ? transferGridClass
            : hasShowcaseSection
              ? 'grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:grid-rows-[auto_auto_auto] lg:items-start lg:gap-x-8'
              : 'grid gap-8 lg:grid-cols-[1.05fr_0.95fr]'
        }
      >
        <div className={hasShowcaseSection ? 'space-y-8 lg:col-start-1 lg:row-start-1' : 'space-y-8'}>
          {pageData.body?.map(
            (block: { heading: string; text?: string; sections?: { title: string; items?: string[] }[] }, index: number) => (
              <PageBodySection
                key={index}
                heading={block.heading}
                text={block.text}
                sections={block.sections}
              />
            )
          )}
          {hasShowcaseSection && showcaseLabels ? (
            <section className="space-y-5 lg:hidden">
              <div>
                <h3 className="text-xl text-white">{showcaseLabels.title}</h3>
                <p className="mt-2 text-slate-300">{showcaseLabels.description}</p>
              </div>
              {params.slug === 'transfer' ? (
                <TransferPortfolioStats projects={portfolioProjects} lang={locale} labels={dict.transferStats} />
              ) : null}
              <PortfolioJobList projects={portfolioProjects} lang={locale} pageSlug={params.slug} />
            </section>
          ) : null}
          {isBookCall ? (
            <div className="card-surface space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-white">{dict.bookCall.title}</h3>
                <p className="mt-3 text-slate-200">{dict.bookCall.description}</p>
              </div>
              <ol className="space-y-4">
                {dict.bookCall.steps.map((step, index) => (
                  <li key={`${step.heading}-${index}`} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accentSoft bg-white/5 text-sm font-semibold text-accent">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{step.heading}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <EmailLink
                email={dict.footer.email}
                subject={dict.bookCall.mailSubject}
                body={dict.bookCall.mailBody}
                copyLabel={dict.cta.copyEmail}
                copiedLabel={dict.cta.emailCopied}
              >
                {dict.cta.sendEmail}
              </EmailLink>
            </div>
          ) : null}
        </div>

        {hasShowcaseSection ? (
          isTransferShowcase ? (
            <>
              <div className="relative hidden lg:col-start-2 lg:row-start-1 lg:block lg:self-stretch">
                <GlowDivider
                  orientation="vertical"
                  className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
                />
              </div>
              <div className="lg:col-start-3 lg:row-start-1">
                <GlowDivider orientation="horizontal" className="lg:hidden" />
                <PageSidebar lang={locale} slug={params.slug} />
              </div>
              {showcaseLabels ? (
                <div className="hidden lg:col-span-3 lg:row-start-2 lg:block">
                  <h3 className="text-xl text-white">{showcaseLabels.title}</h3>
                  <p className="mt-2 text-slate-300">{showcaseLabels.description}</p>
                </div>
              ) : null}
              <div className="hidden lg:col-span-3 lg:row-start-3 lg:block">
                <TransferPortfolioStats projects={portfolioProjects} lang={locale} labels={dict.transferStats} />
              </div>
              {portfolioProjects.length ? (
                <>
                  <div className="relative hidden lg:col-start-2 lg:row-start-4 lg:row-end-[-1] lg:block lg:self-stretch">
                    <GlowDivider
                      orientation="vertical"
                      className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
                    />
                  </div>
                  <div className="hidden lg:col-start-1 lg:row-start-4 lg:block">
                    <PortfolioJobList
                      projects={leftColumnJobs}
                      lang={locale}
                      pageSlug={params.slug}
                      transferRoutes={transferRoutes}
                    />
                  </div>
                  <div className="hidden lg:col-start-3 lg:row-start-4 lg:block">
                    <PortfolioJobList
                      projects={rightColumnJobs}
                      lang={locale}
                      pageSlug={params.slug}
                      transferRoutes={transferRoutes}
                    />
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <>
              <div className="lg:col-start-2 lg:row-start-1">
                <GlowDivider orientation="horizontal" className="lg:hidden" />
                <PageSidebar lang={locale} slug={params.slug} />
              </div>
              {showcaseLabels ? (
                <div className="hidden lg:col-span-2 lg:row-start-2 lg:block">
                  <h3 className="text-xl text-white">{showcaseLabels.title}</h3>
                  <p className="mt-2 text-slate-300">{showcaseLabels.description}</p>
                </div>
              ) : null}
              {portfolioProjects.length ? (
                <>
                  <div className="hidden lg:col-start-1 lg:row-start-3 lg:block">
                    <PortfolioJobList projects={leftColumnJobs} lang={locale} pageSlug={params.slug} />
                  </div>
                  <div className="hidden lg:col-start-2 lg:row-start-3 lg:block">
                    <PortfolioJobList projects={rightColumnJobs} lang={locale} pageSlug={params.slug} />
                  </div>
                </>
              ) : null}
            </>
          )
        ) : (
          <PageSidebar lang={locale} slug={params.slug} />
        )}
      </div>
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">{dict.cta.related}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {relatedSlugs.map((relatedSlug) => {
            const routeKey = relatedSlug as keyof typeof dict.pageTitles;
            return (
              <a key={relatedSlug} href={getRoute(locale, relatedSlug)} className="card-surface hover:-translate-y-1">
                <p className="text-slate-200">{dict.pageTitles[routeKey]}</p>
                <p className="mt-2 font-semibold text-white">{dict.cta.explore}</p>
              </a>
            );
          })}
        </div>
      </section>
    </article>
  );
}
