# tds-landingpage

> **Setting this up from scratch?** See [`INSTALL.md`](INSTALL.md) for
> the step-by-step bring-up (Packages auth → npm install → env →
> dev → build → manual deploy). This README documents pages,
> structure and brand notes.

---


Marketing landing page for Tracht Digital Solutions. **Astro 5** +
**React** islands + **Tailwind v4** with self-hosted **Fraunces +
Geist** (the brand fonts now actually load — `global.css` previously
fell back to `ui-serif` / `system-ui` despite the brief specifying
Fraunces). Builds to fully static HTML; deploys to **netcup
Webhosting 8000** at `tracht-digital.de`.

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
lockfile, CI's `npm ci` step (in `.github/workflows/build.yml`)
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

`build.yml` uses only the auto-provided `GITHUB_TOKEN`. It needs
two permissions, both granted in the workflow itself:

- `contents: write` — for force-pushing to the `build` branch
- `packages: read` — to install `@tracht-digital-solutions/tds-shared`
  from the org's GitHub Packages registry

The package must explicitly grant **Actions access** to this repo
(Package settings → "Manage Actions access" → Add repository),
otherwise `npm ci` returns 403 even with the right permissions.

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
