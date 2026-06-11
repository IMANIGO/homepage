import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';

export function PymFooter({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  return (
    <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-slate-400">
      <p className="text-slate-500">{dict.pym.footerNote}</p>
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
        <a href={`/${lang}/impressum`} className="hover:text-accent">
          {dict.pageTitles.impressum}
        </a>
        <a href={`/${lang}/datenschutz`} className="hover:text-accent">
          {dict.pageTitles.datenschutz}
        </a>
        <a href={`/${lang}/nutzungsbedingungen`} className="hover:text-accent">
          {dict.pageTitles.nutzungsbedingungen}
        </a>
        <a href={`/${lang}/cookie-preferences`} className="hover:text-accent">
          {dict.pageTitles['cookie-preferences']}
        </a>
      </div>
    </footer>
  );
}
