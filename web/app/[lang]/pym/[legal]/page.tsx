import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, type Locale } from '../../../../lib/i18n';
import { getPageContent } from '../../../../lib/sanity';
import { getPymLegalRoute, getPymRoute, isPymLegalSlug, pymLegalSlugs } from '../../../../lib/pym-config';
import { PageBodySection } from '../../../components/PageBodySection';
import { SectionHeading } from '../../../components/SectionHeading';

export const revalidate = 60;

type PageProps = {
  params: Promise<{ lang: string; legal: string }>;
};

export function generateStaticParams() {
  return pymLegalSlugs.flatMap((legal) => ['de', 'en'].map((lang) => ({ lang, legal })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, legal } = await params;
  if (!isPymLegalSlug(legal)) {
    return {};
  }

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const pageData = await getPageContent(locale, legal);
  const title = pageData?.title ?? dict.pageTitles[legal];
  const description = pageData?.intro ?? pageData?.description ?? dict.pym.metaDescription;

  return {
    title: `${dict.pym.brandLine} · ${title}`,
    description,
    alternates: {
      canonical: `https://imanigo.de${getPymLegalRoute(locale, legal)}`,
      languages: {
        en: `https://imanigo.de${getPymLegalRoute('en', legal)}`,
        de: `https://imanigo.de${getPymLegalRoute('de', legal)}`
      }
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function PymLegalPage({ params }: PageProps) {
  const { lang, legal } = await params;

  if (!isPymLegalSlug(legal)) {
    return notFound();
  }

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const pageData = await getPageContent(locale, legal);

  if (!pageData) {
    return notFound();
  }

  return (
    <article className="space-y-8 py-6 sm:py-10">
      <a href={getPymRoute(locale)} className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-accent">
        <span aria-hidden="true">←</span>
        {dict.pym.backToLanding}
      </a>

      <SectionHeading
        eyebrow={pageData.eyebrow ?? dict.pym.legalEyebrow}
        title={pageData.title ?? dict.pageTitles[legal]}
        description={pageData.intro ?? pageData.description ?? ''}
      />

      <div className="card-surface space-y-8">
        {pageData.body?.map(
          (block: { heading: string; text?: string; sections?: { title: string; items?: string[] }[] }, index: number) => (
            <PageBodySection key={index} heading={block.heading} text={block.text} sections={block.sections} />
          )
        )}
      </div>
    </article>
  );
}
