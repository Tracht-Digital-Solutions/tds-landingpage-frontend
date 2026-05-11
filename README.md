# tds-landingpage

Marketing landing page for Tracht Digital Solutions. **Astro 5** +
**React** islands + **Tailwind v4**. Builds to fully static HTML;
deploys to **netcup Webhosting 8000** at `tracht-digital.de`.

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
| Node.js | 20 LTS or 22 LTS | Astro 5 requires ≥18.20, 20 LTS is what CI runs |
| npm | 10+ | Bundled with Node 20 |
| Git | any | Repo hosting |
| (optional) `gh` CLI | latest | Easiest way to mint a packages-scoped token |

### First install generates the lockfile

The repo intentionally doesn't ship a committed `package-lock.json` —
the lockfile is created the first time you run `npm install` against
your authenticated GitHub Packages registry. Once you commit that
lockfile, CI's `npm ci` step (in `.github/workflows/deploy.yml`)
becomes deterministic. For one-off manual deploys, `npm install`
without a committed lockfile is fine.

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

The repo also ships an automated `.github/workflows/deploy.yml` (push
to `main` → SFTP to netcup → `install.php` finalise). If you'd rather
deploy by hand:

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

The CI workflow does exactly these steps in sequence — manual deploy
is the same flow, just with you in the driver's seat. If you never
want the workflow to fire, delete `.github/workflows/deploy.yml`.

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

### GitHub Actions secrets / vars (for the auto-deploy workflow)

Only needed if you keep `deploy.yml` enabled.

- `secrets.NETCUP_FTP_HOST` / `NETCUP_FTP_USER` / `NETCUP_FTP_PASSWORD`
- `secrets.INSTALL_TOKEN` — matches the value baked into netcup's
  `install.htaccess`
- `vars.INSTALLER_URL` — e.g. `https://tracht-digital.de/install.php`
- CI uses `secrets.GITHUB_TOKEN` (auto-provided, no separate PAT)
  to read the `@tracht-digital-solutions/tds-shared` package

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
| `/` | `src/pages/index.astro` | Single-page scroll layout (9 sections) |
| `/preise` | `src/pages/preise.astro` | Hourly-rate pricing |
| `/legal/impressum` | `src/pages/legal/impressum.astro` | Legal notice (DE) |
| `/legal/datenschutz` | `src/pages/legal/datenschutz.astro` | Privacy policy (DSGVO) |

---

## Project structure

```
src/
├── components/
│   ├── Header.astro            # Floating capsule nav + LanguageToggle
│   ├── Footer.astro            # Dark footer, social-less; links to /preise + /legal/*
│   ├── islands/                # React, hydrated via client:load|visible
│   │   ├── ContactForm.tsx     # POSTs to PUBLIC_CONTACT_API_URL
│   │   ├── Hero.tsx            # Hero with motion entrance
│   │   ├── LanguageToggle.tsx  # DE | EN pill, persists in localStorage
│   │   ├── SectionSnap.tsx     # wheel/touch/keyboard snap controller
│   │   └── SmoothScroll.tsx    # Lenis singleton + getLenis() helper
│   ├── sections/               # Static .astro sections (no JS by default)
│   │   ├── About.astro, Services.astro, PricingTeaser.astro,
│   │   │ TechMarquee.astro, Portfolio.astro, Process.astro,
│   │   │ Journal.astro, Contact.astro
│   └── ui/                     # Reusable bits (BlogPostCard, ImagePlaceholder, …)
├── layouts/Layout.astro        # Wraps every page; mounts SmoothScroll + SectionSnap
├── lib/sections.ts             # Section-id source of truth (for SectionSnap)
├── pages/                      # Astro file-routing
│   ├── index.astro
│   ├── preise.astro
│   └── legal/{impressum,datenschutz}.astro
└── styles/global.css           # Brand tokens via @theme, Tailwind v4
```

See `AGENTS.md` for the porting rationale and "don't reach for an
island when an .astro will do" guidance.

---

## License

UNLICENSED — internal Tracht Digital Solutions project.
