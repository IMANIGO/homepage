import { navItems } from '../../lib/content';
import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import { MainNav } from './MainNav';
import { MobileNav } from './MobileNav';

export function SiteHeader({ lang, dict }: { lang: Locale; dict: ReturnType<typeof getDictionary> }) {
  const mobileItems = navItems.map((item) => {
    const labelKey = item.slug as keyof typeof dict.navLabels;
    return {
      ...item,
      label: dict.navLabels[labelKey]
    };
  });

  return (
    <header className="mb-10 border-b border-white/10 pb-6">
      <div className="flex flex-nowrap items-center gap-3 sm:gap-4">
        <a href={`/${lang}`} className="logo-halo shrink-0 px-1 py-0.5 md:mr-8 lg:mr-10">
          <img src="/images/logo-dark.png" alt={dict.brand} className="h-10 w-auto sm:h-12" width={180} height={56} />
        </a>
        <div className="relative z-10 hidden min-w-0 flex-1 md:block md:pl-1">
          <MainNav lang={lang} />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <a href={`/${lang}/book-call`} className="btn-primary hidden shrink-0 md:inline-flex">
            {dict.cta.bookCall}
          </a>
          <MobileNav lang={lang} items={mobileItems} />
        </div>
      </div>
    </header>
  );
}
