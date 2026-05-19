import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';

export function Footer({ lang, dict }: { lang: Locale; dict: ReturnType<typeof getDictionary> }) {
  return (
    <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-slate-400">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="font-semibold text-white">IMANIGO</p>
          <p>{dict.brand}</p>
          <p>Adalbert-Stifter-Str. 32</p>
          <p>83301 Traunreut</p>
        </div>
        <div>
          <p className="font-semibold text-white">Contact</p>
          <p>
            <a href="mailto:contact@imanigo.de" className="text-accent">contact@imanigo.de</a>
          </p>
          <p className="mt-3 text-slate-500">Essential cookies only. No analytics until consented.</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-500">
        <a href={`/${lang}/impressum`} className="hover:text-accent">{dict.pageTitles.impressum}</a>
        <a href={`/${lang}/datenschutz`} className="hover:text-accent">{dict.pageTitles['datenschutz']}</a>
        <a href={`/${lang}/cookie-preferences`} className="hover:text-accent">{dict.pageTitles['cookie-preferences']}</a>
      </div>
    </footer>
  );
}
