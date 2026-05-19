import { navItems } from '../../lib/content';
import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';

export function SiteHeader({ lang, dict }: { lang: Locale; dict: ReturnType<typeof getDictionary> }) {
  return (
    <header className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-6">
      <div className="flex items-center justify-between gap-4">
        <a href={`/${lang}`} className="text-xl font-semibold tracking-[0.18em] text-white">
          IMANIGO
        </a>
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const titleKey = item.slug as keyof typeof dict.pageTitles;
            return (
              <a key={item.slug} href={`/${lang}${item.path}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-accentSoft hover:text-accent">
                {dict.pageTitles[titleKey]}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
