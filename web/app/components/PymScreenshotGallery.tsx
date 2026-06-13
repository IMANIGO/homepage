'use client';

import { useState } from 'react';
import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import {
  getDefaultPymPlatform,
  pymPlatforms,
  pymScreenshotsByPlatform,
  type PymPlatform
} from '../../lib/pym-config';

const platformLabelKey: Record<PymPlatform, 'platformIos' | 'platformAndroid' | 'platformWeb'> = {
  ios: 'platformIos',
  android: 'platformAndroid',
  web: 'platformWeb'
};

export function PymScreenshotGallery({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const [platform, setPlatform] = useState<PymPlatform>(getDefaultPymPlatform());
  const shots = pymScreenshotsByPlatform[platform];
  const activeLabel = dict.pym.screenshots[platformLabelKey[platform]];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">{dict.pym.screenshots.platformHint}</p>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={dict.pym.screenshots.platformHint}>
          {pymPlatforms.map((item) => {
            const isActive = item === platform;
            const label = dict.pym.screenshots[platformLabelKey[item]];

            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setPlatform(item)}
                className={
                  isActive
                    ? 'rounded-lg border border-accentSoft bg-accent/10 px-4 py-2 text-sm font-medium text-accent'
                    : 'rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-accentSoft hover:text-accent'
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {shots.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((slot) => (
            <div
              key={slot}
              className="card-surface flex aspect-[9/19] flex-col items-center justify-center gap-3 border-dashed p-6 text-center"
            >
              <span className="text-3xl text-accent/60">+</span>
              <p className="text-sm leading-6 text-slate-400">
                {dict.pym.screenshots.emptyForPlatform.replace('{platform}', activeLabel)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shots.map((shot) => {
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
      )}
    </div>
  );
}
