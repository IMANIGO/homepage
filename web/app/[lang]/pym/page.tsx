import { getDictionary, type Locale } from '../../../lib/i18n';
import { PymScreenshotGallery } from '../../components/PymScreenshotGallery';
import { PymStoreButtons } from '../../components/PymStoreButtons';
import { SectionHeading } from '../../components/SectionHeading';

export const revalidate = 60;

type PageProps = {
  params: Promise<{ lang: string }>;
};

export default async function PymLandingPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);

  return (
    <article className="space-y-16 py-6 sm:py-10">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-accentSoft bg-white/5 px-4 py-2 text-sm text-accent">
            {dict.pym.badge}
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            {dict.pym.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-200">{dict.pym.subtitle}</p>
          <PymStoreButtons lang={locale} layout="hero" />
        </div>

        <div className="card-surface relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,255,0.22),transparent_45%)]" />
          <div className="relative rounded-[1.25rem] border border-white/10 bg-surface/90 p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">{dict.pym.panelEyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">{dict.pym.panelTitle}</h2>
            <p className="mt-4 text-base leading-7 text-slate-200">{dict.pym.panelText}</p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading eyebrow={dict.pym.featuresEyebrow} title={dict.pym.featuresTitle} description={dict.pym.featuresDescription} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dict.pym.features.map((feature) => (
            <div key={feature.title} className="card-surface space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">{feature.tag}</p>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-6 text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow={dict.pym.screenshots.eyebrow}
          title={dict.pym.screenshots.title}
          description={dict.pym.screenshots.description}
        />
        <PymScreenshotGallery lang={locale} />
      </section>

      <section className="card-surface space-y-6 text-center">
        <div className="mx-auto max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-200">{dict.pym.downloadEyebrow}</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{dict.pym.downloadTitle}</h2>
          <p className="text-base leading-7 text-slate-300">{dict.pym.downloadDescription}</p>
        </div>
        <div className="flex justify-center">
          <PymStoreButtons lang={locale} layout="compact" />
        </div>
      </section>
    </article>
  );
}
