# IMANIGO Homepage — Live auf Cloudflare

Die Marketing-Website läuft als **Cloudflare Worker** (`imanigo-homepage`), nicht als reine Static Site. Inhalte kommen aus **Sanity** — Texte und Portfolio änderst du nur im Studio, nicht im Code.

## Für dich im Alltag (Inhalte pflegen)

1. Studio öffnen: lokal `cd studio && npm run dev` → http://localhost:3333  
   Oder nach `cd studio && npm run deploy` die gehostete Studio-URL von Sanity.
2. Dokument bearbeiten (z. B. **Service page** → Software / Transfer / Sponsored).
3. **Publish** klicken.
4. Nach ca. 1 Minute ist es auf https://imanigo.de sichtbar (Seiten-Cache: 60 Sekunden).

Kein erneutes Deploy nötig, solange du nur CMS-Inhalte änderst.

---

## Technik (einmalig / bei Code-Änderungen)

| Befehl | Wo | Wirkung |
|--------|-----|--------|
| `npm run deploy` | `web/` | Build + Upload zu Cloudflare |
| `npm run preview` | `web/` | Lokal wie Production testen |
| `npm run dev` | `web/` | Normale Next-Entwicklung |

Vorschau-URL (Worker): https://imanigo-homepage.plain-poetry-7cf6.workers.dev

---

## Domain `imanigo.de` (IONOS + Cloudflare)

Die Domain liegt bei **IONOS**, die Website bei **Cloudflare**. Du brauchst eine der beiden Varianten:

### Variante A — Empfohlen: DNS bei Cloudflare

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Add a site** → `imanigo.de`.
2. Cloudflare zeigt **Nameserver** (z. B. `ada.ns.cloudflare.com`).
3. Bei **IONOS**: Domain → DNS / Nameserver → auf die Cloudflare-Nameserver umstellen (kann bis 24–48 h dauern).
4. Cloudflare → **Workers & Pages** → Worker **imanigo-homepage** → **Settings** → **Domains & Routes** → **Add Custom Domain**:
   - `imanigo.de`
   - `www.imanigo.de` (Redirect auf non-www macht die App bereits per Middleware)

### Variante B — DNS bleibt bei IONOS

1. Worker **imanigo-homepage** → Custom Domain hinzufügen (Cloudflare zeigt dir die Ziel-Adresse / CNAME).
2. Bei **IONOS** DNS-Einträge setzen, wie Cloudflare es vorschreibt (meist CNAME für `www`, für Root oft ALIAS/ANAME oder A-Record laut Cloudflare-Hinweis).

Ohne diesen Schritt bleibt die Seite nur unter der `*.workers.dev`-URL erreichbar.

---

## GitHub → automatisches Deploy (optional)

Im Cloudflare Dashboard: **Workers & Pages** → **Create** → **Connect to Git**:

| Einstellung | Wert |
|-------------|------|
| Repository | `IMANIGO/homepage` |
| Root directory | `web` |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx wrangler deploy` |

**Environment variables** (Production):

- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `o4554lb2`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `NEXT_PUBLIC_SANITY_API_VERSION` = `2026-01-01`

(Diese Werte stehen auch in `web/wrangler.jsonc` unter `vars`.)

---

## Sanity Studio online (optional)

```bash
cd studio
npm run deploy
```

Schreib-Token nur für `npm run seed` / Skripte — nicht auf der öffentlichen Website.

---

## Checkliste nach Go-Live

- [ ] https://imanigo.de/de und `/en` laden
- [ ] Impressum, Datenschutz, AGB erreichbar
- [ ] Portfolio Software / Transfer / Sponsored
- [ ] www → non-www Redirect
- [ ] In App-Stores die Legal-URLs aus dem README eintragen

---

## Was du uns ggf. noch geben musst

- Bestätigung, ob **DNS zu Cloudflare** (Variante A) oder **DNS bei IONOS** (Variante B) — dann können Custom Domains final verknüpft werden.
- Falls GitHub-Deploy gewünscht: Schreibzugriff aufs Repo ist schon unter `IMANIGO/homepage`; Cloudflare-Git-Verbindung musst du einmal im Dashboard autorisieren (OAuth).
