import type { Locale } from './i18n';

export type PymScreenshot = {
  /** Path under /public, e.g. /images/pym/pantry.png */
  src: string;
  /** Key into dict.pym.screenshotAlts */
  altKey: string;
};

/** Store and web links — update playStore when the Android app is live. */
export const pymLinks = {
  webApp: 'https://www.planyourmeals.de',
  appStore: 'https://apps.apple.com/app/id6758863688',
  playStore: process.env.NEXT_PUBLIC_PYM_PLAY_STORE_URL ?? ''
} as const;

/**
 * Add screenshots by placing images in web/public/images/pym/
 * and listing them here (recommended size: 1170×2532 or similar phone ratio).
 */
export const pymScreenshots: PymScreenshot[] = [
  // { src: '/images/pym/screenshot-1.png', altKey: 'pantry' },
  // { src: '/images/pym/screenshot-2.png', altKey: 'recipes' },
  // { src: '/images/pym/screenshot-3.png', altKey: 'shoppingList' },
];

export function getPymRoute(locale: Locale) {
  return `/${locale}/pym`;
}
