import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';

export function Footer({ lang, dict }: { lang: Locale; dict: ReturnType<typeof getDictionary> }) {
  return (
    <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-slate-400">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="font-semibold text-white">{dict.brand}</p>
          <p>{dict.footer.addressLine1}</p>
          <p>{dict.footer.addressLine2}</p>
        </div>
        <div>
          <p className="font-semibold text-white">{dict.footer.contactHeading}</p>
          <p>
            <a href={`mailto:${dict.footer.email}`} className="text-accent">{dict.footer.email}</a>
          </p>
          <p className="mt-3 text-slate-500">{dict.footer.cookieNote}</p>
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
