# Installation — tds-landingpage-frontend

> Part of the Tracht Digital Solutions multi-repo project.
> tds-landingpage-frontend is the **public marketing site** at `tracht-digital.de`.
> Astro SSG → static HTML; bring it up after `tds-contact-api` (the
> Hero/Contact form POSTs there) and `tds-content-api` (the Journal
> teaser fetches three posts from there at build time).

## Prerequisites

| Tool | Version | Why |
|---|---|---|
| Node.js | 22.12+ | Astro 6 baseline (Node 18/20 unsupported) |
| npm | 10+ | Bundled with Node 20 |
| Git | any | Repo hosting |
| Classic GitHub PAT | with `read:packages` | Install `@tracht-digital-solutions/tds-shared` |

## 1. GitHub Packages access

`@tracht-digital-solutions/tds-shared` lives on GitHub Packages,
not on npm. You need a token to install it.

```ini
# ~/.npmrc (one-time setup)
@tracht-digital-solutions:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_yourClassicPATWithReadPackagesScope
```

…or set `NPM_TOKEN` in your environment — the repo's `.npmrc`
references it.

If you get a 403 even with a valid token, the token may be missing
SSO authorization for the `Tracht-Digital-Solutions` org, or the
classic PAT lacks `read:packages`. See
[tds-shared/INSTALL.md](https://github.com/Tracht-Digital-Solutions/tds-shared-pkg/blob/main/INSTALL.md)
section 5 for the full setup.

## 2. Clone + install

```bash
git clone https://github.com/Tracht-Digital-Solutions/tds-landingpage-frontend.git
cd tds-landingpage-frontend
npm install
```

A `package-lock.json` is committed and `npm install` honors it
locally. CI installs with `--no-package-lock` to bypass the
Windows-biased lockfile on the Linux runner — see the README's
*Lockfile note* for context.

## 3. Configure

```bash
cp .env.example .env       # if .env.example exists, otherwise create .env
```

Fill in:

```ini
# Where ContactForm POSTs
PUBLIC_CONTACT_API_URL=http://localhost:8002

# Where the Journal section fetches teaser posts at build time
PUBLIC_CONTENT_API_URL=http://localhost:8003
```

Both have sane production defaults baked into the code (the
`api.tracht-digital.de/*` URLs), so for a quick build against
production APIs you can leave `.env` empty.

## 4. Local development

```bash
npm run dev            # http://localhost:4321
```

The site hot-reloads on edits. Contact form submissions go to
whichever `PUBLIC_CONTACT_API_URL` you set; without a running
contact-api locally, leave the form alone or POST to production.

## 5. Verify the production build

```bash
npm run type-check     # astro check — must be 0 errors
npm run og:smoke       # render the default OG card to scripts/og-smoke.png
npm run build          # → dist/
npm run preview        # serve dist/ for visual inspection
```

`og:smoke` is the cheapest catch for the font-loading regression
called out in `AGENTS.md` (it renders `renderDefaultOgPng` via
tsx, bypassing the Astro bundler that breaks `import.meta.url`-
based font paths). Open `scripts/og-smoke.png` and check it looks
right.

The build does NOT need a reachable content-api — if the teaser
fetch fails, the Journal section gracefully shows zero posts and
the build still succeeds.

## 6. Production deployment

Two branches (the old `build` branch is gone):

- **`dev`** — every push to `main` auto-builds `dist/` (Staging/Demo config) via
  `.github/workflows/dev.yml` → orphan `dev` branch. Not deployed.
- **`release`** — the manual *Actions → Release → Run workflow* button
  (`release.yml`) builds the production `dist/` → `release` branch, then POST-pings
  the deploy webhook so the host pulls `release` and goes live.

One-time setup: add a `DEPLOY_WEBHOOK_URL` repository secret pointing at the
host's deploy-hook URL (the deploy token is carried inside the URL) — used only
by the release run.

```bash
# Manual fallback: pull the latest built artifact from the release branch
git fetch origin release
git worktree add ../tds-landingpage-release origin/release
# ../tds-landingpage-release/ now holds the built dist/
```

## 7. Before go-live: replace placeholder values

Address, phone, socials, portrait, logo and favicon are now real. The
only contact placeholder left is the VAT ID:

| Where | Value |
|---|---|
| `src/pages/legal/impressum.astro` — VAT ID | `DE 123 456 789` → real USt-IdNr |

Plus, before launch: real portfolio (× 4) and journal (× 3) images
(see [`IMAGES.md`](IMAGES.md)), a real `public/legal/agb.pdf`, and a
lawyer review of the legal pages.

Smoke search:

```bash
git grep -nE 'DE 123 456 789'
```


## Setup auf dem Host: `/install`

Jeder Produktions-Build enthält einen Setup-Assistenten unter
`https://<domain>/install`. Er verbindet die ausgelieferte Site mit
der API — **ohne Rebuild**.

> **Falls `/install` nicht antwortet:** `https://<domain>/install/index.php`
> funktioniert immer. Die kurze Form braucht Apaches `DirectoryIndex` aus der
> mitgelieferten `install/.htaccess`; ein Vhost, der `.htaccess` gar nicht
> auswertet (reines nginx), ignoriert sie. Von innen ist dieser Unterschied
> nicht erkennbar, deshalb steht der lange Pfad hier daneben.

**Warum es ihn gibt.** Diese Site ist statisch: Vite backt jede `PUBLIC_*`-URL
zur Buildzeit ein. Eine deployte `dist/` lässt sich deshalb nicht umkonfigurieren,
und — schlimmer — eine Site, die die API gar nicht erreicht, fällt still auf ihre
statischen Platzhalter zurück: kein Fehler, kein Log, nichts wird rot. Der
Assistent prüft die Verbindung mit echten Aussagen („12 Blöcke", nicht „HTTP
200"), fährt pro Origin einen CORS-Preflight und schreibt `tds-runtime.json`
neben die `index.html`. Die Site liest diese Datei zur Laufzeit und zieht sie
dem eingebackenen Wert vor.

**Ablauf.**

1. `https://<domain>/install` aufrufen.
2. **Anmeldung** als Plattform-Administrator (dieselben Zugangsdaten wie
   `auth.tracht-digital.de`). Der Assistent liegt auf einer öffentlich
   erreichbaren Domain und kommt mit jedem Deploy zurück — ein reines Lockfile
   wie beim Gateway-Installer würde jedes Deploy-Fenster offen lassen.
3. **Konfiguration**: API-Basis-URL, Auth-URL, Login-Seite und der
   Verbindungsmodus.
4. **Verbinden**: erst prüfen, dann schreiben. Fehlschläge in den Prüfschritten
   brechen den Lauf nicht ab, sie werden gemeldet.

**Zwei Verbindungsmodi.**

- **Same-Origin-Proxy** (Standard, wenn Rewrites verfügbar sind) — die Site ruft
  `/api/…` auf dem eigenen Host auf; `api/index.php` reicht ausschließlich die
  in ihrer Allowlist stehenden Routen an die API weiter. Kein CORS, und ein
  Site-Token verlässt den Server nie. Die Allowlist ist die Sicherheitsgrenze:
  `[Methode, Muster]`-Paare, beidseitig verankert, nie ein Präfix-Vergleich.
- **Direkt** — der Browser ruft die API-Domain direkt. Setzt voraus, dass die
  Origins dieser Site in `CORS_ALLOWED_ORIGINS` stehen; der Assistent sagt
  genau, welche fehlen.

**Was der Assistent nicht ablöst.** Die Inhalte, die beim `astro build` geholt
werden, kommen weiterhin aus den Umgebungsvariablen der GitHub Action — dort
gibt es keinen Host und keine `tds-runtime.json`. Laufzeit und Buildzeit sind
getrennt konfiguriert und müssen zusammenpassen; der Assistent prüft beides,
konfiguriert aber nur die Laufzeit.

**Sperre und erneutes Ausführen.** Nach einem erfolgreichen Lauf setzt der
Assistent `install/.tds-site-installed` und läuft ab dann nur noch im
Diagnosemodus (er zeigt den aktuellen Stand, bietet aber kein Formular). Zum
Neu-Verbinden diese Datei löschen. Es gibt bewusst keinen Selbstlöschen-Knopf:
`install/` ist Teil von `dist/`, das nächste Release brächte die Datei ohnehin
zurück.

**Erzeugte Dateien.** `install/` wird vom `prebuild`-Schritt
(`scripts/sync-installer.mjs`) aus `@tracht-digital-solutions/tds-shared/install`
kopiert und ist deshalb nicht eingecheckt. `tds-runtime.json`, `api/` und die
Geheimnis-Datei entstehen erst auf dem Host und liegen nicht in `dist/` — ein
erneuter Deploy überschreibt sie nicht.

## Related repos

- [tds-shared-pkg](https://github.com/Tracht-Digital-Solutions/tds-shared-pkg) — design system (base.css), components, i18n strings, motion
- [tds-contact-api](https://github.com/Tracht-Digital-Solutions/tds-contact-api) — Contact form POSTs here
- [tds-content-api](https://github.com/Tracht-Digital-Solutions/tds-content-api) — Journal teaser fetches at build time
- [tds-blog-frontend](https://github.com/Tracht-Digital-Solutions/tds-blog-frontend) — `Alle Artikel →` link points at `https://blog.tracht-digital.de`

## Troubleshooting

**`npm install` returns 401.**
GitHub Packages auth missing/expired. See section 1.

**`npm install` returns 403 `read_package` despite valid token.**
The token's classic-PAT scope is right but it isn't SSO-authorized
for the org, or the workflow uses `secrets.GITHUB_TOKEN` instead
of `secrets.NPM_TOKEN`. See
[tds-shared-pkg INSTALL §5](https://github.com/Tracht-Digital-Solutions/tds-shared-pkg/blob/main/INSTALL.md).

**Build succeeds but Journal section is empty.**
`PUBLIC_CONTENT_API_URL` unreachable at build time, or no posts
published yet. Graceful fallback — log shows the failed fetch.

**`Cannot find module @rollup/rollup-linux-x64-gnu` (or similar
`*-linux-x64-gnu` failure) in CI.**
The lockfile was generated on Windows and only registers win32
platform binaries (npm/cli#4828). CI's install step uses `npm
install --no-package-lock` to bypass this — confirm the workflow
hasn't been reverted to `npm ci` / plain `npm install`.
