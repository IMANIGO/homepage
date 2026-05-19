import { notFound } from 'next/navigation';
import { getDictionary } from '../../../lib/i18n';
import { getPageContent, getPageSlugs } from '../../../lib/sanity';
import { pageRoutes } from '../../../lib/i18n';
import { getRoute } from '../../../lib/content';
import { SectionHeading } from '../../components/SectionHeading';

export async function generateStaticParams() {
  return getPageSlugs().flatMap((slug) => ['de', 'en'].map((lang) => ({ lang, slug })));
}

type PageProps = {
  params?: Promise<{
    lang: string;
    slug: string;
  }>;
  searchParams?: Promise<any>;
};

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

  return (
    <article className="space-y-10 py-10">
      <SectionHeading eyebrow={pageData.eyebrow ?? dict.pageTitles[slug] ?? ''} title={pageData.title ?? dict.pageTitles[slug]} description={pageData.intro ?? pageData.description ?? ''} />
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          {pageData.body?.map((block: any, index: number) => (
            <section key={index} className="prose prose-invert max-w-none text-slate-200">
              <h3 className="mt-0 text-xl text-white">{block.heading}</h3>
              <p>{block.text}</p>
            </section>
          ))}
          {isBookCall ? (
            <div className="card-surface">
              <h3 className="text-2xl font-semibold text-white">{dict.bookCall.title}</h3>
              <p className="mt-3 text-slate-200">{dict.bookCall.description}</p>
              <a href={getRoute(locale, 'book-call')} className="btn-primary mt-6 inline-block">
                {dict.cta.bookCall}
              </a>
            </div>
          ) : null}
        </div>
        <aside className="space-y-6">
          <div className="card-surface">
            <p className="text-sm uppercase tracking-[0.26em] text-cyan-200">{dict.sidebar.contactHeading}</p>
            <p className="mt-4 text-lg font-semibold text-white">{dict.sidebar.contactText}</p>
            <a href="mailto:contact@imanigo.de" className="mt-5 block text-accent">contact@imanigo.de</a>
          </div>
          <div className="card-surface">
            <p className="text-sm uppercase tracking-[0.26em] text-cyan-200">{dict.sidebar.addressHeading}</p>
            <p className="mt-4 text-slate-200">Adalbert-Stifter-Str. 32</p>
            <p className="text-slate-200">83301 Traunreut</p>
            <p className="mt-4 text-slate-400 text-sm">{dict.sidebar.offerDisclaimer}</p>
          </div>
        </aside>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {pageRoutes.map((route) => {
          const routeKey = route.slice(1) as keyof typeof dict.pageTitles;
          return (
            <a key={route} href={`/${locale}${route}`} className="card-surface hover:-translate-y-1">
              <p className="text-slate-200">{dict.pageTitles[routeKey]}</p>
              <p className="mt-2 font-semibold text-white">{dict.cta.explore}</p>
            </a>
          );
        })}
      </div>
    </article>
  );
}
