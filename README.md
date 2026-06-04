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

Both apps need to run at the same time: the website reads content from Sanity.

### 1. Environment variables

Create `web/.env.local`:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=o4554lb2
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-01
```

Create `studio/.env`:
```bash
SANITY_PROJECT_ID=o4554lb2
SANITY_DATASET=production
SANITY_API_TOKEN=yourSanityWriteToken
```

The write token is only needed for seeding/import. Create one at [sanity.io/manage](https://sanity.io/manage) → Project → API → Tokens (Editor permissions).

If you are already logged into the Sanity CLI (`npx sanity login`), you can seed without saving the token:
```bash
cd studio
SANITY_API_TOKEN=$(npx sanity debug --secrets 2>/dev/null | awk '/Auth token:/ {print $3}') npm run seed
```

### 2. Install dependencies

From the repo root:
```bash
npm run dev:web
npm run dev:studio
```

Or separately:
```bash
cd web && npm install && npm run dev
cd studio && npm install --legacy-peer-deps && npm run dev
```

### 3. Open in the browser

- Website: [http://localhost:3000/de](http://localhost:3000/de) or [http://localhost:3000/en](http://localhost:3000/en)
- Sanity Studio: [http://localhost:3333](http://localhost:3333)

Useful pages to review:
- [http://localhost:3000/de/software](http://localhost:3000/de/software)
- [http://localhost:3000/de/transfer](http://localhost:3000/de/transfer)
- [http://localhost:3000/de/sponsored](http://localhost:3000/de/sponsored)

### Legal pages (website + App Store / Google Play)

After seeding, use these public URLs in store listings and contracts:

| Purpose | German | English |
| --- | --- | --- |
| Privacy policy (required) | https://imanigo.de/de/datenschutz | https://imanigo.de/en/datenschutz |
| Terms of use / EULA | https://imanigo.de/de/nutzungsbedingungen | https://imanigo.de/en/nutzungsbedingungen |
| Legal notice (Impressum) | https://imanigo.de/de/impressum | https://imanigo.de/en/impressum |
| Support / contact | https://imanigo.de/de/contact | https://imanigo.de/en/contact |
| Marketing / website | https://imanigo.de/de | https://imanigo.de/en |

Content lives in `studio/data/legal-pages.json` (seeded into Sanity as `legalPage` documents). Update register/VAT placeholders in Sanity Studio before publishing to production stores.

Seed legal content together with the rest:

```bash
cd studio
npm run seed
```

### 4. Sync local JSON into Sanity

After editing `studio/data/import_all.json`, `import_all_en.json`, or `legal-pages.json`:
```bash
cd studio
npm run seed
```

Then refresh the website. Content changes made directly in Sanity Studio appear on the site after refresh as well.

### 5. Edit content going forward

- **Text, portfolio items, images:** Sanity Studio → `Service page`, `Home page`, etc.
- **UI labels, navigation, fallbacks:** `web/lib/i18n.ts`
- **Layout/components:** `web/app/`

Frontend only:
```bash
cd web
npm run dev
```
Studio only:
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

## Deploy to Cloudflare (Production)

The site runs as a **Cloudflare Worker** via [OpenNext](https://opennext.js.org/cloudflare).

```bash
cd web
npm run deploy
```

Worker preview URL: `https://imanigo-homepage.<account>.workers.dev`

Full steps (domain at IONOS, CMS workflow): **[docs/DEPLOY-CLOUDFLARE.md](docs/DEPLOY-CLOUDFLARE.md)**

### Domain setup
- Primary domain: `imanigo.de`
- Add custom domain on Worker **imanigo-homepage** in Cloudflare Dashboard
- Redirect `www.imanigo.de` → non-www (handled in `web/middleware.ts`)

### Content updates (no redeploy)
Edit in Sanity Studio → **Publish**. Live within ~1 minute.

## Verification
- `npm run build:web` passes
- local navigation works at `/en` and `/de`
- middleware redirects root and enforces canonical domain

