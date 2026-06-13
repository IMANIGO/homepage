import type { Locale } from './i18n';

export type PymScreenshot = {
  /** Path under /public, e.g. /images/pym/ios/pantry.png */
  src: string;
  /** Key into dict.pym.screenshotAlts */
  altKey: string;
};

export type PymPlatform = 'ios' | 'android' | 'web';

export const pymPlatforms: PymPlatform[] = ['ios', 'android', 'web'];

/** Store and web links. Update playStore when the Android app is live. */
export const pymLinks = {
  webApp: 'https://www.planyourmeals.de',
  appStore: 'https://apps.apple.com/app/id6758863688',
  playStore: process.env.NEXT_PUBLIC_PYM_PLAY_STORE_URL ?? ''
} as const;

/**
 * Screenshots per platform. Place images in web/public/images/pym/{ios,android,web}/
 * and list them here (phone: ~1170×2532, web: browser window ratio).
 */
export const pymScreenshotsByPlatform: Record<PymPlatform, PymScreenshot[]> = {
  ios: [
    // { src: '/images/pym/ios/screenshot-1.png', altKey: 'pantry' },
    // { src: '/images/pym/ios/screenshot-2.png', altKey: 'recipes' },
  ],
  android: [
    // { src: '/images/pym/android/screenshot-1.png', altKey: 'pantry' },
  ],
  web: [
    // { src: '/images/pym/web/screenshot-1.png', altKey: 'pantry' },
  ]
};

export function getDefaultPymPlatform(): PymPlatform {
  const withShots = pymPlatforms.find((platform) => pymScreenshotsByPlatform[platform].length > 0);
  return withShots ?? 'ios';
}

export const pymLegalSlugs = ['impressum', 'datenschutz', 'nutzungsbedingungen', 'cookie-preferences'] as const;

export type PymLegalSlug = (typeof pymLegalSlugs)[number];

export function isPymLegalSlug(slug: string): slug is PymLegalSlug {
  return (pymLegalSlugs as readonly string[]).includes(slug);
}

export function getPymRoute(locale: Locale) {
  return `/${locale}/pym`;
}

export function getPymLegalRoute(locale: Locale, slug: PymLegalSlug) {
  return `/${locale}/pym/${slug}`;
}
