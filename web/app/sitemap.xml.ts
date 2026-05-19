import { getSupportedLocales, pageRoutes } from '../lib/i18n';

export function GET() {
  const baseUrl = 'https://imanigo.de';
  const locales = getSupportedLocales();
  const urls = ['/', ...pageRoutes].flatMap((path) => locales.map((locale) => `${baseUrl}/${locale}${path}`));

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n')}
</urlset>`, {
    headers: {
      'Content-Type': 'application/xml;charset=UTF-8'
    }
  });
}
