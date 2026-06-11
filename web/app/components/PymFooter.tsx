'use client';

import { usePathname } from 'next/navigation';
import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import { getPymLegalRoute, isPymLegalSlug, pymLegalSlugs } from '../../lib/pym-config';

export function PymFooter({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const maybeLegal = segments[2];
  const activeSlug = isPymLegalSlug(maybeLegal ?? '') ? maybeLegal : undefined;

  return (
    <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-slate-400">
      <p className="text-slate-500">{dict.pym.footerNote}</p>
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
        {pymLegalSlugs.map((slug) => (
          <a
            key={slug}
            href={getPymLegalRoute(lang, slug)}
            className={activeSlug === slug ? 'text-accent' : 'hover:text-accent'}
            aria-current={activeSlug === slug ? 'page' : undefined}
          >
            {dict.pageTitles[slug]}
          </a>
        ))}
      </div>
    </footer>
  );
}
