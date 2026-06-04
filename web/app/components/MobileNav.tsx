'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getActiveNavSlug } from '../../lib/content';
import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';

type NavItem = {
  slug: string;
  path: string;
  label: string;
};

export function MobileNav({ lang, items }: { lang: Locale; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dict = getDictionary(lang);
  const activeSlug = getActiveNavSlug(pathname);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? dict.cta.closeMenu : dict.cta.openMenu}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? dict.cta.closeMenu : dict.cta.openMenu}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          {open ? (
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          ) : (
            <>
              <path strokeLinecap="round" d="M4 7h16" />
              <path strokeLinecap="round" d="M4 12h16" />
              <path strokeLinecap="round" d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {open ? (
        <>
          <button type="button" className="fixed inset-0 z-40 bg-black/70" aria-label={dict.cta.closeMenu} onClick={() => setOpen(false)} />
          <nav id="mobile-nav-panel" className="fixed inset-x-4 top-20 z-50 rounded-2xl border border-white/10 bg-surface/95 p-4 shadow-soft backdrop-blur-xl">
            <ul className="space-y-2">
              {items.map((item) => {
                const isActive = activeSlug === item.slug;

                return (
                  <li key={item.slug}>
                    <a
                      href={`/${lang}${item.path}`}
                      aria-current={isActive ? 'page' : undefined}
                      className={`block rounded-xl border px-4 py-3 text-base font-medium ${
                        isActive
                          ? 'border-accentSoft/60 bg-accent/10 text-accent'
                          : 'border-white/10 bg-white/5 text-white'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <a href={`/${lang}/book-call`} className="btn-primary mt-4 block w-full text-center" onClick={() => setOpen(false)}>
              {dict.cta.bookCall}
            </a>
          </nav>
        </>
      ) : null}
    </div>
  );
}
