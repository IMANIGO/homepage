import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import { pymLinks } from '../../lib/pym-config';

export function PymStoreButtons({ lang, layout = 'hero' }: { lang: Locale; layout?: 'hero' | 'compact' }) {
  const dict = getDictionary(lang);
  const hasPlayStore = Boolean(pymLinks.playStore.trim());

  const buttonClass =
    layout === 'hero'
      ? 'btn-primary w-full text-center sm:w-auto'
      : 'btn-ghost w-full text-center sm:w-auto';

  return (
    <div className={`flex flex-col gap-3 ${layout === 'hero' ? 'sm:flex-row sm:flex-wrap' : 'sm:flex-row'}`}>
      <a href={pymLinks.appStore} className={buttonClass} target="_blank" rel="noopener noreferrer">
        {dict.pym.cta.appStore}
      </a>
      {hasPlayStore ? (
        <a href={pymLinks.playStore} className="btn-ghost w-full text-center sm:w-auto" target="_blank" rel="noopener noreferrer">
          {dict.pym.cta.playStore}
        </a>
      ) : (
        <span className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-400 sm:w-auto">
          {dict.pym.cta.playStoreSoon}
        </span>
      )}
      <a href={pymLinks.webApp} className="btn-ghost w-full text-center sm:w-auto" target="_blank" rel="noopener noreferrer">
        {dict.pym.cta.webApp}
      </a>
    </div>
  );
}
