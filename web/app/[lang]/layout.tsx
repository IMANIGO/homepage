import type { Metadata } from 'next';
import { getDictionary } from '../../lib/i18n';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import '../../styles/globals.css';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const dict = getDictionary(params.lang as 'de' | 'en');
  return {
    title: `${dict.brand} · ${dict.hero.title}`,
    description: dict.meta.description,
    alternates: {
      canonical: `https://imanigo.de/${params.lang}`,
      languages: {
        en: 'https://imanigo.de/en',
        de: 'https://imanigo.de/de'
      }
    }
  };
}

export default function LangLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  const dict = getDictionary(params.lang as 'de' | 'en');

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 lg:px-8">
        <SiteHeader lang={params.lang as 'de' | 'en'} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer lang={params.lang as 'de' | 'en'} dict={dict} />
      </div>
      <LanguageSwitcher lang={params.lang as 'de' | 'en'} />
    </div>
  );
}
