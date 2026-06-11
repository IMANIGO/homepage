import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import { pymScreenshots } from '../../lib/pym-config';

export function PymScreenshotGallery({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  if (pymScreenshots.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((slot) => (
          <div
            key={slot}
            className="card-surface flex aspect-[9/19] flex-col items-center justify-center gap-3 border-dashed p-6 text-center"
          >
            <span className="text-3xl text-accent/60">+</span>
            <p className="text-sm leading-6 text-slate-400">{dict.pym.screenshots.placeholder}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pymScreenshots.map((shot) => {
        const altKey = shot.altKey as keyof typeof dict.pym.screenshotAlts;
        const alt = dict.pym.screenshotAlts[altKey] ?? dict.pym.screenshots.fallbackAlt;

        return (
          <figure key={shot.src} className="card-surface overflow-hidden p-2">
            <img
              src={shot.src}
              alt={alt}
              className="w-full rounded-[0.85rem] border border-white/10 object-cover"
              loading="lazy"
            />
          </figure>
        );
      })}
    </div>
  );
}
