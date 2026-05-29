# Installation — tds-landingpage

> Part of the Tracht Digital Solutions multi-repo project.
> tds-landingpage is the **public marketing site** at `tracht-digital.de`.
> Astro SSG → static HTML; bring it up after `tds-contact-api` (the
> Hero/Contact form POSTs there) and `tds-content-api` (the Journal
> teaser fetches three posts from there at build time).

## Prerequisites

| Tool | Version | Why |
|---|---|---|
| Node.js | 20 LTS or 22 LTS | Astro 5 baseline |
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
[tds-shared/INSTALL.md](https://github.com/Tracht-Digital-Solutions/tds-shared/blob/main/INSTALL.md)
section 5 for the full setup.

## 2. Clone + install

```bash
git clone https://github.com/Tracht-Digital-Solutions/tds-landingpage.git
cd tds-landingpage
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

Auto-SFTP was removed. The repo ships
`.github/workflows/build.yml` which only builds and force-pushes
`dist/` to an orphan `build` branch on every push to `main`. Deploy
from there by hand:

```bash
# Option A — build locally then SFTP
npm run build

# SFTP contents of dist/ to netcup at
# ~/sites/tracht-digital.de/releases/<TIMESTAMP>/

# Activate
curl --fail \
  "https://tracht-digital.de/install.php?action=install-static\
&target=tracht-digital.de&release=<TIMESTAMP>&token=<INSTALL_TOKEN>"


# Option B — pull from the build branch
git fetch origin build
git worktree add ../tds-landingpage-build origin/build
# SFTP ../tds-landingpage-build/ to netcup as above
```

## 7. Before go-live: replace placeholder values

The site ships with visibly-placeholder values you must replace:

| Where | Value |
|---|---|
| `src/components/sections/Contact.astro` — `phoneDisplay` | `+49 4151 1234567` → real |
| `src/components/sections/Contact.astro` — `socials.*` | `/example` URLs → real |
| `src/pages/legal/impressum.astro` | address + phone + VAT ID |
| `src/pages/legal/datenschutz.astro` | address + phone (mirrors impressum) |

Smoke search:

```bash
git grep -nE '1234567|/example|Musterstraße|DE 123 456 789'
```

## Related repos

- [tds-shared](https://github.com/Tracht-Digital-Solutions/tds-shared) — i18n strings, brand tokens, Tailwind preset
- [tds-contact-api](https://github.com/Tracht-Digital-Solutions/tds-contact-api) — Contact form POSTs here
- [tds-content-api](https://github.com/Tracht-Digital-Solutions/tds-content-api) — Journal teaser fetches at build time
- [tds-blog](https://github.com/Tracht-Digital-Solutions/tds-blog) — `Alle Artikel →` link points at `https://blog.tracht-digital.de`

## Troubleshooting

**`npm install` returns 401.**
GitHub Packages auth missing/expired. See section 1.

**`npm install` returns 403 `read_package` despite valid token.**
The token's classic-PAT scope is right but it isn't SSO-authorized
for the org, or the workflow uses `secrets.GITHUB_TOKEN` instead
of `secrets.NPM_TOKEN`. See
[tds-shared INSTALL §5](https://github.com/Tracht-Digital-Solutions/tds-shared/blob/main/INSTALL.md).

**Build succeeds but Journal section is empty.**
`PUBLIC_CONTENT_API_URL` unreachable at build time, or no posts
published yet. Graceful fallback — log shows the failed fetch.

**`Cannot find module @rollup/rollup-linux-x64-gnu` (or similar
`*-linux-x64-gnu` failure) in CI.**
The lockfile was generated on Windows and only registers win32
platform binaries (npm/cli#4828). CI's install step uses `npm
install --no-package-lock` to bypass this — confirm the workflow
hasn't been reverted to `npm ci` / plain `npm install`.
