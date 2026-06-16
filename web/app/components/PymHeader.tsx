import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import { getPymRoute } from '../../lib/pym-config';

export function PymHeader({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  return (
    <header className="mb-10 border-b border-white/10 pb-6">
      <a href={getPymRoute(lang)} className="logo-halo inline-flex items-center gap-3 px-1 py-0.5">
        <img
          src="/images/logo-dark.png"
          alt={dict.brand}
          className="h-10 w-auto sm:h-12"
          width={180}
          height={56}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">{dict.pym.brandLine}</span>
      </a>
    </header>
  );
}
