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

## Domain `imanigo.de` — Variante A (DNS bei Cloudflare) ✓

Domain-Registrierung bleibt bei **IONOS**. Nur die **Nameserver** zeigen auf Cloudflare. Die Website hängt am Worker **imanigo-homepage**.

### Schritt 1 — Zone in Cloudflare anlegen

1. [dash.cloudflare.com](https://dash.cloudflare.com) einloggen (Account: accounts@imanigo.de).
2. **Add a site** → `imanigo.de` → Free-Plan reicht für die Marketing-Seite.
3. Cloudflare scannt bestehende DNS-Einträge (falls schon welche da sind).
4. Notiere die **zwei Nameserver**, z. B.:
   - `ada.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`  
   (bei dir können die Namen abweichen — exakt die anzeigen, die Cloudflare ausgibt.)

Status bleibt **Pending**, bis Schritt 2 erledigt ist.

### Schritt 2 — Nameserver bei IONOS umstellen

1. [IONOS Login](https://www.ionos.de/) → **Domains & SSL** → `imanigo.de`.
2. **Nameserver** / **DNS-Einstellungen** → **Eigene Nameserver verwenden** (nicht „IONOS Nameserver“).
3. Beide Cloudflare-Nameserver eintragen → speichern.
4. Warten: oft 15 Minuten bis wenige Stunden, maximal ~48 h.

In Cloudflare wird die Zone dann **Active** (grüner Haken).

**E-Mail (MX):** Wenn du Mail über IONOS/Microsoft nutzt, prüfe nach der Aktivierung unter Cloudflare → **DNS** → **Records**, ob MX-Einträge noch da sind. Fehlen sie, aus einem IONOS-Export oder der alten Zone wieder eintragen (gleiche Priorität/Werte wie vorher).

### Schritt 3 — Custom Domain am Worker

1. Cloudflare → **Workers & Pages** → Worker **imanigo-homepage**.
2. **Settings** → **Domains & Routes** → **Add Custom Domain**.
3. Eintragen:
   - `imanigo.de`
   - `www.imanigo.de`
4. Cloudflare legt die nötigen DNS-Einträge in der Zone oft **automatisch** an. Falls nicht: in **DNS** einen Eintrag vom Typ, den Cloudflare beim Hinzufügen der Domain anzeigt (meist CNAME/AAAA für Workers).

`www` → `imanigo.de` Redirect erledigt die App in `web/middleware.ts` (301 ohne www).

### Schritt 4 — Testen

| URL | Erwartung |
|-----|-----------|
| https://imanigo.de | Redirect → `/de` oder `/en` |
| https://imanigo.de/de | Startseite |
| https://www.imanigo.de/de | Redirect → `https://imanigo.de/de` |
| https://imanigo-homepage.*.workers.dev/de | Bleibt als Backup-URL erreichbar |

SSL-Zertifikat stellt Cloudflare automatisch aus (meist wenige Minuten nach Active).

### Optional — Andere Subdomains

Wenn z. B. `planyourmeals.de` oder eine andere App schon in derselben Cloudflare-Zone oder einem anderen Worker läuft: jede Subdomain separat unter **Domains & Routes** des jeweiligen Workers eintragen. `imanigo.de` betrifft nur diesen Homepage-Worker.

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
