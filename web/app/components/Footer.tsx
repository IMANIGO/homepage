import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';

type SiteSettings = {
  phone?: string;
  phoneHidden?: boolean;
  email?: string;
} | null;

export function Footer({
  lang,
  dict,
  siteSettings
}: {
  lang: Locale;
  dict: ReturnType<typeof getDictionary>;
  siteSettings?: SiteSettings;
}) {
  const showPhone = siteSettings?.phoneHidden === false && Boolean(siteSettings?.phone?.trim());
  const contactEmail = siteSettings?.email?.trim() || dict.footer.email;
  return (
    <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-slate-400">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-semibold text-white">{dict.brand}</p>
          <p>{dict.footer.addressLine1}</p>
          <p>{dict.footer.addressLine2}</p>
        </div>
        <div>
          <p className="font-semibold text-white">{dict.footer.contactHeading}</p>
          <p>
            <a href={`mailto:${contactEmail}`} className="text-accent">
              {contactEmail}
            </a>
          </p>
          {showPhone ? (
            <p className="mt-2">
              <a href={`tel:${siteSettings!.phone!.replace(/\s+/g, '')}`} className="text-accent">
                {siteSettings!.phone}
              </a>
            </p>
          ) : null}
          <p className="mt-3 text-slate-500">{dict.footer.cookieNote}</p>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <a href={`/${lang}/book-call`} className="btn-primary inline-block w-full text-center sm:w-auto">
            {dict.cta.bookCall}
          </a>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-500">
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
