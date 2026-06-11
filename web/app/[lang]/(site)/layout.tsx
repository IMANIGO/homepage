import type { Metadata } from 'next';
import { getDictionary } from '../../../lib/i18n';
import { getSiteSettings } from '../../../lib/sanity';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { ScrollRestoration } from '../../components/ScrollRestoration';
import { Footer } from '../../components/Footer';
import { SiteHeader } from '../../components/SiteHeader';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang as 'de' | 'en');

  return {
    title: `${dict.brand} · ${dict.hero.title}`,
    description: dict.meta.description,
    alternates: {
      canonical: `https://imanigo.de/${lang}`,
      languages: {
        en: 'https://imanigo.de/en',
        de: 'https://imanigo.de/de'
      }
    },
    openGraph: {
      title: `${dict.brand} · ${dict.hero.title}`,
      description: dict.meta.description,
      url: `https://imanigo.de/${lang}`,
      siteName: dict.brand,
      locale: lang === 'de' ? 'de_DE' : 'en_GB',
      type: 'website'
    }
  };
}

export default async function SiteLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const locale = lang as 'de' | 'en';
  const dict = getDictionary(locale);
  const siteSettings = await getSiteSettings(locale);

  return (
    <div className="min-h-screen bg-background text-white">
      <ScrollRestoration />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-slate-950"
      >
        {dict.cta.skipToContent}
      </a>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 lg:px-8">
        <SiteHeader lang={locale} dict={dict} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer lang={locale} dict={dict} siteSettings={siteSettings} />
      </div>
      <LanguageSwitcher lang={locale} />
    </div>
  );
}
