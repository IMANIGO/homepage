import type { Metadata } from 'next';
import { getDictionary, type Locale } from '../../../lib/i18n';
import { buildPageMetadata } from '../../../lib/metadata';
import { getPymSoftwareGraph } from '../../../lib/structured-data';
import { JsonLd } from '../../components/JsonLd';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { ScrollRestoration } from '../../components/ScrollRestoration';
import { PymFooter } from '../../components/PymFooter';
import { PymHeader } from '../../components/PymHeader';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);

  return buildPageMetadata({
    locale,
    path: 'pym',
    title: dict.pym.metaTitle,
    description: dict.pym.metaDescription,
    siteName: 'PYM – PlanYourMeals'
  });
}

export function generateStaticParams() {
  return [{ lang: 'de' }, { lang: 'en' }];
}

export default async function PymLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen bg-background text-white">
      <JsonLd data={getPymSoftwareGraph(locale)} />
      <ScrollRestoration />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-slate-950"
      >
        {dict.cta.skipToContent}
      </a>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 lg:px-8">
        <PymHeader lang={locale} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <PymFooter lang={locale} />
      </div>
      <LanguageSwitcher lang={locale} />
    </div>
  );
}
