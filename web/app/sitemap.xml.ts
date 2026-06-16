import { getSupportedLocales, pageRoutes } from '../lib/i18n';
import { pymLegalSlugs } from '../lib/pym-config';
import { SITE_URL } from '../lib/site-config';

function buildSitemapPaths() {
  const pymLegalPaths = pymLegalSlugs.map((slug) => `/pym/${slug}`);
  return ['', ...pageRoutes, ...pymLegalPaths];
}

export function GET() {
  const locales = getSupportedLocales();
  const paths = buildSitemapPaths();
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = paths.flatMap((path) =>
    locales.map((locale) => {
      const loc = `${SITE_URL}/${locale}${path}`;
      const alternates = locales
        .map(
          (altLocale) =>
            `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${SITE_URL}/${altLocale}${path}" />`
        )
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/de${path}" />`)
        .join('\n');

      return `  <url>
    <loc>${loc}</loc>
${alternates}
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    })
  );

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400'
      }
    }
  );
}
