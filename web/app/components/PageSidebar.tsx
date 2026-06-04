import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';

export function PageSidebar({ lang, slug }: { lang: Locale; slug: string }) {
  const dict = getDictionary(lang);
  const showTransferNote = slug === 'transfer' || slug === 'contact';

  return (
    <aside className="space-y-6">
      <div className="card-surface">
        <p className="text-sm uppercase tracking-[0.26em] text-cyan-200">{dict.sidebar.contactHeading}</p>
        <p className="mt-4 text-lg font-semibold text-white">{dict.sidebar.contactText}</p>
        <a href={`mailto:${dict.footer.email}`} className="mt-5 block text-accent">
          {dict.footer.email}
        </a>
      </div>
      <div className="card-surface">
        <p className="text-sm uppercase tracking-[0.26em] text-cyan-200">{dict.sidebar.addressHeading}</p>
        <p className="mt-4 text-slate-200">{dict.footer.addressLine1}</p>
        <p className="text-slate-200">{dict.footer.addressLine2}</p>
        {showTransferNote ? <p className="mt-4 text-sm text-slate-400">{dict.sidebar.offerDisclaimer}</p> : null}
      </div>
    </aside>
  );
}
