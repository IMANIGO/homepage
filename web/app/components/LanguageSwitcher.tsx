'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useTransition } from 'react';
import { saveScrollPosition } from './ScrollRestoration';
import { FlagIcon } from './FlagIcon';

const locales = [
  { code: 'de' as const, name: 'Deutsch' },
  { code: 'en' as const, name: 'English' }
];

export function LanguageSwitcher({ lang }: { lang: 'de' | 'en' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const basePath = useMemo(() => pathname.replace(/^\/(de|en)/, ''), [pathname]);

  const changeLanguage = (locale: 'de' | 'en') => {
    if (locale === lang) {
      return;
    }

    saveScrollPosition();
    document.cookie = `imanigo-lang=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;

    startTransition(() => {
      router.push(`/${locale}${basePath}`, { scroll: false });
    });
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-full border border-accentSoft bg-surface/95 p-1 shadow-soft backdrop-blur-lg transition-opacity ${isPending ? 'opacity-90' : 'opacity-100'}`}
    >
      {locales.map((locale) => (
        <button
          key={locale.code}
          type="button"
          className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 sm:text-sm ${lang === locale.code ? 'bg-accent text-slate-950' : 'text-white/80 hover:text-white'}`}
          aria-pressed={lang === locale.code}
          aria-label={`${locale.name}${lang === locale.code ? ' (aktiv)' : ''}`}
          title={locale.name}
          onClick={() => changeLanguage(locale.code)}
        >
          <FlagIcon locale={locale.code} />
          <span className="hidden sm:inline">{locale.name}</span>
        </button>
      ))}
    </div>
  );
}
