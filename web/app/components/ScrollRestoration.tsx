'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const SCROLL_RESTORE_KEY = 'imanigo-scroll-restore';

export function saveScrollPosition() {
  sessionStorage.setItem(SCROLL_RESTORE_KEY, String(window.scrollY));
}

export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_RESTORE_KEY);
    if (saved === null) {
      return;
    }

    sessionStorage.removeItem(SCROLL_RESTORE_KEY);
    const scrollY = Number(saved);

    const restore = () => window.scrollTo(0, scrollY);

    restore();
    requestAnimationFrame(restore);
    requestAnimationFrame(() => requestAnimationFrame(restore));
  }, [pathname]);

  return null;
}
