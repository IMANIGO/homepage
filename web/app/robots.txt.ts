export function GET() {
  return new Response(`User-agent: *
Allow: /
Disallow: /api/
Host: imanigo.de
Sitemap: https://imanigo.de/sitemap.xml
`, {
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    }
  });
}
