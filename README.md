# tds-landingpage-frontend

> **Setting this up from scratch?** See [`INSTALL.md`](INSTALL.md) for
> the step-by-step bring-up (Packages auth → npm install → env →
> dev → build → auto-deploy). This README documents pages,
> structure and brand notes.

---


Marketing landing page for Tracht Digital Solutions. **Astro 6** +
**React** islands + **Tailwind v4** (via the `@tailwindcss/postcss`
plugin — see the *Tailwind note* below) with self-hosted
**Lato + Plus Jakarta Sans**. Builds to fully static HTML and ships
in two locale trees (DE at `/`, EN at `/en/`); deploys automatically to
the production host at `tracht-digital.de` on every push to `main`.

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

Deploys automatically on every push to `main`; see [Deploy](#deploy).

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
npm run build        # → dist/ (static HTML/CSS/JS, what gets deployed)
npm run preview      # serve dist/ to inspect the production build
npm run type-check   # astro check — catches .astro + .tsx errors
```

---

## Deploy

Two-track branch model (the old `build` branch is gone):

- **`dev`** — [`dev.yml`](.github/workflows/dev.yml), on **every push to `main`**:
  builds `dist/` with the Staging/Demo config (`PUBLIC_DEMO_MODE=true`) and
  force-pushes it to the orphan **`dev`** branch. **Not deployed** — the
  continuously-built developer version + the push-to-main build gate.
- **`release`** — [`release.yml`](.github/workflows/release.yml), **only on the
  manual Actions button** (*Actions → Release → Run workflow*): builds with the
  real production config and force-pushes to **`release`**, then POST-pings the
  deploy webhook so the host pulls `release` and goes live.

**Required secret:** `DEPLOY_WEBHOOK_URL` (host deploy-hook URL; token inside the
URL) — used only by `release.yml`. The production host pulls **`release`**. Fall
back manually with:

```bash
git fetch origin release
git worktree add ../tds-landingpage-release origin/release   # the built dist/
```

---

## Configuration

### Runtime env vars (build-time, baked into the static HTML)

| Var | Default | What it does |
|---|---|---|
| `PUBLIC_CONTACT_API_URL` | `https://api.tracht-digital.de/contact` | Where `ContactForm` POSTs |
| `PUBLIC_CONTENT_API_URL` | `https://api.tracht-digital.de/content` | Where `Journal.astro` build-time-fetches teaser posts |
| `PUBLIC_BLOG_BASE_URL` | `https://blog.tracht-digital.de` | Base href for `BlogPostCard` links — each teaser navigates to `${base}/${slug}` |

Copy [`.env.example`](.env.example) to `.env` (gitignored) and
edit values to taste. Astro inlines anything prefixed `PUBLIC_` as
a constant at build time — safe to expose in the client bundle.
`.env.production` overrides `.env` for production builds.

> `NPM_TOKEN` is **not** an Astro env var. npm doesn't auto-load
> `.env`, so set it in your shell (`$env:NPM_TOKEN = "ghp_…"` on
> PowerShell, `export NPM_TOKEN=ghp_…` on bash) before `npm install`.

### GitHub Actions secrets

Both `dev.yml` and `release.yml` need `NPM_TOKEN`, a classic PAT with
`read:packages` on the `Tracht-Digital-Solutions` org. It authenticates both
the install (cross-repo read of `tds-shared-pkg` from GitHub Packages) and the
`peaceiris/actions-gh-pages` push to the `dev` / `release` branch. The
auto-provided `GITHUB_TOKEN` can't read `tds-shared-pkg` (different repo).

Workflow `permissions:` are declared inline (`contents: write` for the branch
push, `packages: read`). Deploy secrets: `NPM_TOKEN` (install + push the
`dev`/`release` branches) and `DEPLOY_WEBHOOK_URL` (host deploy-hook URL, used
only by `release.yml`). The old `FTP_*` / `INSTALL_TOKEN` secrets and the
`INSTALLER_URL` variable are unused and can be cleaned up.

---

## Replace examples before go-live

All contact/legal placeholders are now real: the business address,
phone, LinkedIn/GitHub, the portrait photo, the header logo, the
favicon, the VAT ID (`DE450639725` — in `src/pages/legal/impressum.astro`
+ `src/lib/seo.ts`, surfaced as `Organization.vatID`) and the AGB PDF.

The AGB is no longer a committed static file: it is **uploaded in the frontend**
(Website-CMS → Rechtsdokumente) and baked into the build, with
`src/assets/legal/agb.pdf` kept only as the fallback for when the API is
unreachable. See § [AGB](#agb-page--pdf).

**Still TODO before launch** (tracked as open issues on this repo):

- Real portfolio screenshots (× 4) — note the Portfolio section is
  currently hidden, see § [Portfolio (temporarily hidden)](#portfolio-temporarily-hidden)
- ~~Real journal cover images (× 3)~~ — **shipped**: hosted in
  `tds-blog-frontend/public/covers/<slug>.webp`, wired via the content-api
  seeder `cover_hint`; the Journal card renders the photo when the
  cover URL is present (else the labelled placeholder).
- Lawyer review of `/legal/impressum` + `/legal/datenschutz`
  (issue #5)

See [`IMAGES.md`](IMAGES.md) for the per-image swap guide — file
paths, aspect ratios, recommended sizes, and the exact pattern for
replacing each remaining `<ImagePlaceholder />` with an
`<Image />` / `<img>`.

---

## Portfolio (temporarily hidden)

The **Portfolio** section is temporarily hidden from both homepages
(`/` and `/en/`) until real project screenshots and case-study copy
are ready. The `Portfolio.astro` component and its data are left in
place — only the rendering and the navigation links are switched off:

| File | What is commented out |
|---|---|
| `src/pages/index.astro` | `import Portfolio` + `<Portfolio />` |
| `src/pages/en/index.astro` | `import Portfolio` + `<Portfolio />` |
| `src/components/Header.astro` | `portfolio` entry in the `items` nav array |
| `src/components/Footer.astro` | Portfolio `<li>` in the footer nav |

**To restore:** uncomment those four spots (each is marked with a
`Portfolio temporarily hidden` comment pointing back here). Nothing
else changes — the section slots back in between **Tech** and
**Process**.

---

## Pages

| Path | Source | Purpose |
|---|---|---|
| `/` | `src/pages/index.astro` | Single-page scroll layout (DE) — narrative order: Hero → About → Services → Tech → Process → Currently → PricingTeaser → Journal → Consulting → FAQ → Contact (Portfolio currently hidden, see § [Portfolio (temporarily hidden)](#portfolio-temporarily-hidden)) |
| `/en/` | `src/pages/en/index.astro` | Same layout, EN copy |
| `/preise` | `src/pages/preise.astro` | Hourly-rate pricing (DE) |
| `/en/preise` | `src/pages/en/preise.astro` | Hourly-rate pricing (EN) |
| `/legal/impressum` | `src/pages/legal/impressum.astro` | Legal notice (DE) |
| `/legal/datenschutz` | `src/pages/legal/datenschutz.astro` | Privacy policy (DSGVO) |
| `/legal/agb` | `src/pages/legal/agb.astro` | Terms & conditions, as a page (DE) |
| `/legal/agb.pdf` | `src/pages/legal/agb.pdf.ts` | The same document as a PDF (DE) |
| `/en/legal/agb` | `src/pages/en/legal/agb.astro` | Terms & conditions, as a page (EN) |
| `/en/legal/agb.pdf` | `src/pages/en/legal/agb.pdf.ts` | The same document as a PDF (EN) |

Impressum and Datenschutz are German-only by regulation; the AGB has both
trees because the document itself is uploaded per language. The language dropdown in
the header navigates between the DE and EN trees via Astro's i18n
routing (`defaultLocale: de`, `prefixDefaultLocale: false`).

---

## AGB page + PDF

The AGB is served two ways from one document: a readable page at `/legal/agb`
(heading, "Stand", download button, and an inline PDF viewer on desktop) and
the file itself at `/legal/agb.pdf`. The footer links the page; the page offers
the download.

**To change the AGB** — no code, no deploy:

1. Frontend → **Website-CMS** → open the site → **Rechtsdokumente**.
2. Pick `agb`, the language, optionally a *Stand* label (e.g. `Stand: 09/2025`,
   shown under the heading), choose the PDF, **Hochladen**.
3. The upload fires this site's rebuild automatically, provided the site has a
   *Rebuild-Konfiguration* (repo + workflow) and the panel has a rebuild token.
   Without those, upload and then release this repo by hand — nothing is lost,
   the document just goes live on the next build.

PDF only, 8 MB maximum, one file per language. **The English document is a
separate upload, not a translation** — legal text is never machine-translated,
and until an `en` document exists `/en/legal/agb.pdf` serves the German one
rather than 404ing.

`src/assets/legal/agb.pdf` is the committed fallback used when the API is
unreachable or nothing has been uploaded. Keep it in `src/assets/`, **not**
`public/legal/` — a file there would collide with the generated
`/legal/agb.pdf` route.

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
│   │   ├── CustomCursor.tsx    # Trailing custom cursor; bg-aware colour + velocity stretch (fine-pointer only)
│   │   ├── Hero.tsx            # Hero with motion entrance; takes lang prop
│   │   ├── LanguageToggle.tsx  # SVG-flag dropdown; navigates between /  ↔ /en/
│   │   ├── ScrollProgress.tsx  # Thin gradient reading-progress bar (top of viewport)
│   │   └── SmoothScroll.tsx    # Lenis singleton (desktop only); exposes window.tdsScrollTo — bounce on click-jumps, plain wheel scroll. Touch path is a rAF tween; both plan through lib/scrollJump.ts
│   ├── sections/               # Static .astro sections (no JS by default)
│   │   ├── About.astro, Services.astro, TechMarquee.astro,
│   │   │ Portfolio.astro, Process.astro, Currently.astro,
│   │   │ PricingTeaser.astro, Journal.astro, Consulting.astro,
│   │   │ FAQ.astro, Contact.astro
│   └── ui/                     # Reusable bits (BlogPostCard, ImagePlaceholder, ServiceCard + ServiceIcon, PortfolioCard, ProcessStep, SectionHeader)
├── layouts/Layout.astro        # Mounts SmoothScroll (load) + ScrollProgress/CustomCursor (idle); renders meta + JSON-LD
├── lib/
│   ├── i18n.ts                 # tFor / resolveLang / localizePath — locale-aware translation
│   ├── content.ts              # fetchTopics() — build-time pull of recent blog posts
│   ├── cms.ts                  # fetchBlocks()/cmsFor() — build-time pull of editable section content (/landing), merged over the tds-shared-pkg defaults
│   ├── seo.ts                  # Single source of truth for org/person identity
│   ├── jsonld.ts               # Schema.org graph generators
│   ├── faq.ts                  # FAQ Q&A source (DE/EN) — also feeds the FAQPage JSON-LD
│   ├── scrollJump.ts           # DOM-free geometry + easing for the bounce section-jumps (both scroll paths)
│   └── processDetails.ts       # Per-step detail copy for the Process hover frontend
├── og/                         # Satori OG-card pipeline (build-time)
│   ├── render.ts               # 1200×630 default card
│   └── fonts/                  # Lato Bold (ttf) for the OG card
├── pages/                      # Astro file-routing
│   ├── index.astro             # DE home
│   ├── preise.astro            # DE pricing
│   ├── en/
│   │   ├── index.astro         # EN home (thin shell; sections read Astro.currentLocale)
│   │   └── preise.astro        # EN pricing
│   ├── og/default.png.ts       # Endpoint emitting the default OG card
│   └── legal/{impressum,datenschutz,agb}.astro + agb.pdf.ts
├── public/                     # Static assets (robots.txt, llms.txt, favicon)
└── styles/global.css           # imports tds-shared-pkg base.css (tokens/@theme) + local marketing CSS

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
