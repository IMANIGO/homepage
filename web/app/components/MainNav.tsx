'use client';

import { usePathname } from 'next/navigation';
import { getActiveNavSlug, navItems } from '../../lib/content';
import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';

export function MainNav({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const dict = getDictionary(lang);
  const activeSlug = getActiveNavSlug(pathname);

  return (
    <nav aria-label="Main navigation" className="flex flex-nowrap items-center gap-1.5 lg:gap-2">
      {navItems.map((item) => {
        const labelKey = item.slug as keyof typeof dict.navLabels;
        const isActive = activeSlug === item.slug;

        return (
          <a
            key={item.slug}
            href={`/${lang}${item.path}`}
            aria-current={isActive ? 'page' : undefined}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition lg:px-4 lg:py-2 ${
              isActive
                ? 'border-accentSoft/60 bg-white/5 text-accent'
                : 'border-white/10 bg-white/5 text-slate-100 hover:border-accentSoft hover:text-accent'
            }`}
          >
            {dict.navLabels[labelKey]}
          </a>
        );
      })}
    </nav>
  );
}
