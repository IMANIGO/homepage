'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

const locales = [
  { code: 'de', label: 'DE', emoji: '🇩🇪' },
  { code: 'en', label: 'EN', emoji: '🇬🇧' }
];

export function LanguageSwitcher({ lang }: { lang: 'de' | 'en' }) {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = useMemo(() => pathname.replace(/^\/(de|en)/, ''), [pathname]);

  const changeLanguage = (locale: string) => {
    document.cookie = `imanigo-lang=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.push(`/${locale}${basePath}`);
  };

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-accentSoft bg-surface/90 p-2 backdrop-blur-lg">
      {locales.map((locale) => (
        <button
          key={locale.code}
          type="button"
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${lang === locale.code ? 'bg-accent text-slate-950' : 'text-white/80 hover:text-white'}`}
          aria-pressed={lang === locale.code}
          aria-label={`Switch language to ${locale.code}`}
          onClick={() => changeLanguage(locale.code)}
        >
          <span aria-hidden="true">{locale.emoji}</span>
          {locale.label}
        </button>
      ))}
    </div>
  );
}
