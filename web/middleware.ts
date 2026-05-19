import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supported = ['de', 'en'];

function getLocaleFromHeader(header: string | null) {
  if (!header) return 'en';
  return /(^|,)de\b/i.test(header) ? 'de' : 'en';
}

export function middleware(request: NextRequest) {
  const { nextUrl: url, cookies, headers } = request;
  const pathname = url.pathname;
  const host = headers.get('host') ?? '';

  if (host.startsWith('www.')) {
    url.hostname = host.replace(/^www\./, '');
    return NextResponse.redirect(url, 301);
  }

  const isAsset = pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/robots.txt') || pathname.startsWith('/sitemap.xml');

  if (pathname === '/' || (!pathname.startsWith('/de') && !pathname.startsWith('/en') && !isAsset)) {
    const localeFromCookie = cookies.get('imanigo-lang')?.value;
    const locale = supported.includes(localeFromCookie ?? '') ? localeFromCookie : getLocaleFromHeader(headers.get('accept-language'));
    const destination = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(new URL(destination, request.url), 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)']
};
