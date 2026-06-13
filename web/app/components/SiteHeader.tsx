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
        <a href={`/${lang}`} className="logo-halo min-w-0 shrink px-1 py-0.5 md:mr-8 lg:mr-10">
          <img src="/images/logo-dark.png" alt={dict.brand} className="h-9 w-auto max-w-[7.5rem] sm:h-10 sm:max-w-none md:h-12" width={180} height={56} />
        </a>
        <div className="relative z-10 hidden min-w-0 flex-1 md:block md:pl-1">
          <MainNav lang={lang} />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={`/${lang}/book-call`}
            className="btn-primary inline-flex shrink-0 px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm md:px-5 md:py-3 md:text-base"
          >
            <span className="md:hidden">{dict.cta.bookCallShort}</span>
            <span className="hidden md:inline">{dict.cta.bookCall}</span>
          </a>
          <MobileNav lang={lang} items={mobileItems} />
        </div>
      </div>
    </header>
  );
}
