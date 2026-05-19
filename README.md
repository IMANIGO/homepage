# IMANIGO Website

## Architecture
- `web/`: Next.js 15 + TypeScript + Tailwind CSS frontend
- `studio/`: Sanity CMS studio for content-managed pages and translations
- `public/images/logo-dark.png`: dark PNG logo asset
- `public/favicon.ico`: minimal favicon
- `web/lib/`: Sanity client, i18n dictionary, content routing
- `web/app/`: Next.js App Router with locale-based pages and middleware

## Key Features
- German and UK English support with auto-detect and sticky language cookie
- `de` and `en` route prefixes
- `middleware.ts` for root redirect and www -> non-www redirect
- CMS-driven page content via Sanity document schemas
- Essential-only cookie setup and legal page scaffolding
- Responsive premium dark UI with soft neo-glass cards and cyan accent styling

## Install
Frontend only:
```bash
cd web
npm install
```
Studio only:
```bash
cd studio
npm install --legacy-peer-deps
```

## Run locally
Frontend:
```bash
cd web
npm run dev
```
Studio:
```bash
cd studio
npm run dev
```

## Build
```bash
cd web
npm run build
```

## Sanity environment variables
Create `web/.env.local` or Cloudflare Pages vars:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_API_VERSION=2026-01-01`

Studio also uses:
- `SANITY_PROJECT_ID`
- `SANITY_DATASET=production`

## Cloudflare Pages
Root build command:
```bash
npm run build:web
```
Output: Next.js static preview via Cloudflare Pages auto-detection (`.next` artifacts)

## Domain setup
- Primary domain: `imanigo.de`
- Redirect `www.imanigo.de` to non-www via Cloudflare Pages custom domain settings

## Verification
- `npm run build:web` passes
- local navigation works at `/en` and `/de`
- middleware redirects root and enforces canonical domain

