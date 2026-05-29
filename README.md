# tds-landingpage

> **Setting this up from scratch?** See [`INSTALL.md`](INSTALL.md) for
> the step-by-step bring-up (Packages auth → npm install → env →
> dev → build → manual deploy). This README documents pages,
> structure and brand notes.

---


Marketing landing page for Tracht Digital Solutions. **Astro 6** +
**React** islands + **Tailwind v4** (via the `@tailwindcss/postcss`
plugin — see the *Tailwind note* below) with self-hosted
**Instrument Serif + Geist**. Builds to fully static HTML and ships
in two locale trees (DE at `/`, EN at `/en/`); deploys to **netcup
Webhosting 8000** at `tracht-digital.de`.

SEO surface includes Schema.org JSON-LD (Organization,
ProfessionalService, Person, WebSite, Service+OfferCatalog,
BreadcrumbList), per-page OG/Twitter meta, `robots.txt` with explicit
allow-list for AI crawlers (GPTBot, OAI-SearchBot, PerplexityBot,
ClaudeBot, Google-Extended, etc.) and an `llms.txt` directory file.
See `AGENTS.md` § *SEO + structured data* for the layout.

---

## Quick start (TL;DR)

```bash
# 1. One-time: GitHub Packages auth (see "Prerequisites" if this fails)
export NPM_TOKEN=ghp_yourClassicPATWithReadPackagesScope

# 2. Install + run
npm install
npm run dev          # http://localhost:4321
```

For a manual production build + deploy, see [Manual deploy](#manual-deploy).

---

## Prerequisites

| Tool | Version | Why |
|---|---|---|
| Node.js | 22 LTS | Astro 6 requires ≥22.12 — Node 18/20 are no longer supported |
| npm | 10+ | Bundled with Node 22 |
| Git | any | Repo hosting |
| (optional) `gh` CLI | latest | Easiest way to mint a packages-scoped token |

### Tailwind note (why PostCSS, not Vite plugin)

Tailwind is wired through **`@tailwindcss/postcss`** via
`postcss.config.mjs`, not the `@tailwindcss/vite` plugin. Astro 6
ships Vite 7 with the rolldown bundler under the hood, and the
Tailwind Vite plugin's build hook calls into rolldown's
`BindingViteResolvePluginConfig` with a shape missing the
`tsconfigPaths` field — builds crash with `Missing field
'tsconfigPaths'` (withastro/astro#16542). The PostCSS variant runs
the same Tailwind 4 compiler outside the rolldown contract and is
unaffected.

### Lockfile note

A `package-lock.json` is committed. Locally, `npm install` uses it
for reproducible installs. **CI installs with `npm install
--no-package-lock`** — the lockfile is generated on Windows and
only registers win32 platform binaries for native deps (rollup,
lightningcss, esbuild, sharp, tailwindcss-oxide), so `npm ci` /
`npm install` on the Linux runner would honor the lockfile and
skip the Linux binaries, crashing at type-check
(npm/cli#4828). `--no-package-lock` bypasses the lockfile on the
runner and lets npm resolve from `package.json` directly.

### GitHub Packages authentication

`@tracht-digital-solutions/tds-shared` lives on GitHub Packages, not
on npm. Installing requires a token with the `read:packages` scope.

Two ways to provide it:

**(a) Local `~/.npmrc`** — recommended for dev machines:

```ini
@tracht-digital-solutions:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_yourClassicPATWithReadPackagesScope
```

**(b) Environment variable** — picked up by the repo's `.npmrc`,
which references `${NPM_TOKEN}`:

```bash
export NPM_TOKEN=ghp_yourClassicPATWithReadPackagesScope
```

Either way, the token must be a **classic** PAT (not fine-grained)
with `read:packages` scope on the `Tracht-Digital-Solutions` org.

If `npm install` fails with `401 Unauthorized`, the token is missing,
expired, or lacks the scope. Mint a new one at
<https://github.com/settings/tokens> → classic → `read:packages`.

---

## Scripts

```bash
npm run dev          # Astro dev server (HMR, http://localhost:4321)
npm run build        # → dist/ (static HTML/CSS/JS, ready to SFTP)
npm run preview      # serve dist/ to inspect the production build
npm run type-check   # astro check — catches .astro + .tsx errors
```

---

## Manual deploy

Auto-deploy via GitHub Actions was removed. The repo now ships
`.github/workflows/build.yml` which only builds + force-pushes
`dist/` to an orphan `build` branch (one commit per run, no
history). Deploy from there by hand:

```bash
# 1. Build static output
npm run build

# 2. SFTP the contents of dist/ to netcup
#    Target: ~/sites/tracht-digital.de/releases/<TIMESTAMP>/
#    (use FileZilla, lftp, or netcup's web file manager)

# 3. Activate the new release on netcup
#    Hit: https://tracht-digital.de/install.php?action=install-static
#         &target=tracht-digital.de
#         &release=<TIMESTAMP>
#         &token=<INSTALL_TOKEN>
#    (or use netcup's CCP to repoint the DocumentRoot symlink directly)
```

If you want to pull straight from the `build` branch instead of
building locally, swap step 1 for `git fetch origin build &&
git worktree add ../tds-landingpage-build origin/build` and SFTP
that worktree.

---

## Configuration

### Runtime env vars (build-time, baked into the static HTML)

| Var | Default | What it does |
|---|---|---|
| `PUBLIC_CONTACT_API_URL` | `https://api.tracht-digital.de/contact` | Where `ContactForm` POSTs |
| `PUBLIC_CONTENT_API_URL` | `https://api.tracht-digital.de/content` | Where `Journal.astro` build-time-fetches teaser posts |

Set them in `.env` (or `.env.production` for prod-only) before
`npm run build`. Astro inlines them as constants — anything starting
with `PUBLIC_` is safe to expose in the client bundle.

### GitHub Actions secrets

`build.yml` needs **one** repo secret: `NPM_TOKEN`, a classic PAT
with `read:packages` on the `Tracht-Digital-Solutions` org. Both
the install (cross-repo read of `tds-shared` from GitHub Packages)
and the `peaceiris/actions-gh-pages` push to the `build` branch
authenticate via this PAT. The auto-provided `GITHUB_TOKEN` can't
read `tds-shared` because that package lives in a different repo.

Workflow `permissions:` declared inline:

- `contents: write` — required so the implicit `GITHUB_TOKEN` is
  still scoped correctly for the workflow itself, even though the
  actual push to `build` uses the PAT
- `packages: read` — sanity default; the PAT is what actually
  authenticates

The five netcup-related Repository Secrets (`NETCUP_FTP_*`,
`INSTALL_TOKEN`) and the `INSTALLER_URL` variable are now unused
and can be cleaned up.

---

## Replace examples before go-live

The site ships with **visibly-placeholder values** in three places.
A find-replace pass before launch catches them all:

| Where | What to replace | Current example value |
|---|---|---|
| `src/components/sections/Contact.astro` — `phoneDisplay` | Real phone | `+49 4151 1234567` |
| `src/components/sections/Contact.astro` — `socials.linkedin` | Real URL | `https://www.linkedin.com/in/example` |
| `src/components/sections/Contact.astro` — `socials.github` | Real URL | `https://github.com/example` |
| `src/components/sections/Contact.astro` — `socials.xing` | Real URL | `https://www.xing.com/profile/example` |
| `src/pages/legal/impressum.astro` — address (× 2 sections) | Real street + PLZ | `Musterstraße 1, 21493 Schwarzenbek` |
| `src/pages/legal/impressum.astro` — phone | Real phone | `+49 4151 1234567` |
| `src/pages/legal/impressum.astro` — VAT ID | Real `DE ...` | `DE 123 456 789` |
| `src/pages/legal/datenschutz.astro` — address + phone | Same as above | (mirrors impressum) |

**Also still TODO before launch** (tracked as open issues
on this repo):

- Real portrait photo in the About section
- Real portfolio screenshots (× 4)
- Real journal cover images (× 3)
- Lawyer review of `/legal/impressum` + `/legal/datenschutz`
  (issue #5)

Quick smoke search:

```bash
git grep -nE '1234567|/example|Musterstraße|DE 123 456 789'
```

---

## Pages

| Path | Source | Purpose |
|---|---|---|
| `/` | `src/pages/index.astro` | Single-page scroll layout (DE) — 9 sections in narrative order: Hero → About → Services → Tech → Portfolio → Process → PricingTeaser → Journal → Contact |
| `/en/` | `src/pages/en/index.astro` | Same layout, EN copy |
| `/preise` | `src/pages/preise.astro` | Hourly-rate pricing (DE) |
| `/en/preise` | `src/pages/en/preise.astro` | Hourly-rate pricing (EN) |
| `/legal/impressum` | `src/pages/legal/impressum.astro` | Legal notice (DE) |
| `/legal/datenschutz` | `src/pages/legal/datenschutz.astro` | Privacy policy (DSGVO) |

Legal pages are German-only by regulation. The language dropdown in
the header navigates between the DE and EN trees via Astro's i18n
routing (`defaultLocale: de`, `prefixDefaultLocale: false`).

---

## Project structure

```
src/
├── components/
│   ├── Header.astro            # Floating pill nav; data-scrolled morph + LanguageToggle
│   ├── Footer.astro            # Dark footer; links to /preise + /legal/* via localizePath
│   ├── JsonLd.astro            # Inline <script type="application/ld+json"> utility
│   ├── islands/                # React, hydrated via client:load|visible
│   │   ├── ContactForm.tsx     # POSTs to PUBLIC_CONTACT_API_URL; takes lang prop
│   │   ├── Hero.tsx            # Hero with motion entrance; takes lang prop
│   │   ├── LanguageToggle.tsx  # SVG-flag dropdown; navigates between /  ↔ /en/
│   │   ├── ScrollProgress.tsx  # Thin gradient reading-progress bar (top of viewport)
│   │   └── SmoothScroll.tsx    # Lenis singleton (desktop only)
│   ├── sections/               # Static .astro sections (no JS by default)
│   │   ├── About.astro, Services.astro, PricingTeaser.astro,
│   │   │ TechMarquee.astro, Portfolio.astro, Process.astro,
│   │   │ Journal.astro, Contact.astro
│   └── ui/                     # Reusable bits (BlogPostCard, ImagePlaceholder, ServiceCard + ServiceIcon, PortfolioCard, ProcessStep, SectionHeader)
├── layouts/Layout.astro        # Mounts SmoothScroll + ScrollProgress; renders meta + JSON-LD
├── lib/
│   ├── i18n.ts                 # tFor / resolveLang / localizePath — locale-aware translation
│   ├── seo.ts                  # Single source of truth for org/person identity
│   └── jsonld.ts               # Schema.org graph generators
├── og/                         # Satori OG-card pipeline (build-time)
│   ├── render.ts               # 1200×630 default card
│   └── fonts/                  # Fraunces + Geist TTFs (legacy; OG card not yet repointed)
├── pages/                      # Astro file-routing
│   ├── index.astro             # DE home
│   ├── preise.astro            # DE pricing
│   ├── en/
│   │   ├── index.astro         # EN home (thin shell; sections read Astro.currentLocale)
│   │   └── preise.astro        # EN pricing
│   ├── og/default.png.ts       # Endpoint emitting the default OG card
│   └── legal/{impressum,datenschutz}.astro
├── public/                     # Static assets (robots.txt, llms.txt, favicon)
└── styles/global.css           # Brand tokens via @theme, Tailwind v4

postcss.config.mjs              # @tailwindcss/postcss wiring — see Tailwind note above
scripts/og-smoke.ts             # `npm run og:smoke` — renders default OG card
                                # to disk; regression guard for the bundling
                                # gotcha called out in AGENTS.md
```

See `AGENTS.md` for the porting rationale and "don't reach for an
island when an .astro will do" guidance.

---

## License

UNLICENSED — internal Tracht Digital Solutions project.
