import { getDictionary } from '../../lib/i18n';
import { getHomePage } from '../../lib/sanity';
import { ServiceCard } from '../components/ServiceCard';
import { SectionHeading } from '../components/SectionHeading';
import { MetricCard } from '../components/MetricCard';
import { QuoteCard } from '../components/QuoteCard';
import { getRoute } from '../../lib/content';

export const revalidate = 60;

type PageProps = {
  params?: Promise<{
    lang: string;
  }>;
  searchParams?: Promise<any>;
};

export default async function HomePage(props: PageProps) {
  const params = await props.params;

  if (!params) {
    return null;
  }

  const locale = params.lang as 'de' | 'en';
  const dict = getDictionary(locale);
  const page = await getHomePage(locale);

  return (
    <article className="space-y-16 py-10">
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-accentSoft bg-white/5 px-4 py-2 text-sm text-accent">
            {dict.hero.badge}
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            {page?.heroTitle ?? dict.hero.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-200">
            {page?.heroSubtitle ?? dict.hero.subtitle}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a href={getRoute(locale, 'book-call')} className="btn-primary w-full text-center sm:w-auto">
              {dict.cta.bookCall}
            </a>
            <a href={getRoute(locale, 'contact')} className="btn-ghost w-full text-center sm:w-auto">
              {dict.cta.contact}
            </a>
          </div>
        </div>
        <div className="card-surface relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,255,0.22),transparent_45%)]" />
          <div className="relative rounded-[1.25rem] border border-white/10 bg-surface/90 p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">IMANIGO</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">{dict.hero.panelTitle}</h2>
            <p className="mt-4 text-base leading-7 text-slate-200">{dict.hero.panelText}</p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading eyebrow={dict.services.eyebrow} title={dict.services.title} description={dict.services.description} />
        <div className="grid gap-6 lg:grid-cols-3">
          {page?.serviceCards?.map((card: any) => (
            <ServiceCard
              key={card.slug}
              title={card.title}
              description={card.summary}
              href={getRoute(locale, card.slug)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.95fr_0.9fr]">
        <div className="card-surface">
          <SectionHeading eyebrow={dict.about.eyebrow} title={dict.about.title} description={page?.aboutSummary ?? dict.about.description} />
          <p className="mt-4 leading-8 text-slate-200">{page?.aboutSummary ?? dict.about.description}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href={getRoute(locale, 'about')} className="btn-primary w-full text-center sm:w-auto">
              {dict.cta.learnMore}
            </a>
            <a href={getRoute(locale, 'book-call')} className="btn-ghost w-full text-center sm:w-auto">
              {dict.cta.bookCall}
            </a>
          </div>
        </div>
        <div className="grid gap-4">
          {page?.trustPoints?.map((item: any) => (
            <div key={item.title} className="card-surface flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">{item.tag}</p>
              <p className="text-2xl font-semibold text-white">{item.title}</p>
              <p className="text-sm leading-6 text-slate-200">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <SectionHeading eyebrow={dict.trust.eyebrow} title={dict.trust.title} description={dict.trust.description} />
          {page?.testimonials?.map((quote: any) => (
            <QuoteCard key={quote._id} quote={quote.quote} author={quote.author} company={quote.company} />
          ))}
        </div>
        <div className="grid gap-4">
          {page?.metrics?.map((metric: any) => (
            <MetricCard key={metric._id} label={metric.label} value={metric.value} detail={metric.detail} />
          ))}
        </div>
      </section>
    </article>
  );
}
