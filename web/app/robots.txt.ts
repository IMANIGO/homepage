export function GET() {
  return new Response(
    `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://imanigo.de/sitemap.xml
`,
    {
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Cache-Control': 'public, max-age=86400'
      }
    }
  );
}
