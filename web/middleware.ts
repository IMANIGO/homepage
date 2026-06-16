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

  const isAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.png' ||
    pathname === '/apple-icon.png' ||
    pathname === '/llms.txt' ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml');

  if (pathname === '/' || (!pathname.startsWith('/de') && !pathname.startsWith('/en') && !isAsset)) {
    const localeFromCookie = cookies.get('imanigo-lang')?.value;
    const locale = supported.includes(localeFromCookie ?? '') ? localeFromCookie : getLocaleFromHeader(headers.get('accept-language'));
    const destination = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(new URL(destination, request.url), 302);
  }

  const response = NextResponse.next();
  response.headers.set('x-imanigo-locale', pathname.startsWith('/en') ? 'en' : 'de');
  return response;
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|llms.txt|robots.txt|sitemap.xml|images).*)'
  ]
};
