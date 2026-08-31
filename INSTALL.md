# Installation — tds-landingpage-frontend

This is the setup and deployment guide for the public marketing site at
`tracht-digital.de`. The current application is Astro 7 in server mode with the
standalone Node adapter. Production runs under Passenger and serves rendered
pages through a file-backed cache; instructions for an SSG-only `dist/` are
obsolete.

## Prerequisites

| Tool/service | Requirement |
|---|---|
| Node.js | 22.12 or newer |
| npm | 10 or newer |
| Git | Current supported version |
| GitHub Packages token | Classic PAT with `read:packages` for the Tracht Digital Solutions organization |
| Production host | Node/Passenger application with a writable persistent cache location |

## 1. Authenticate to GitHub Packages

`@tracht-digital-solutions/tds-shared` is private. Configure a classic PAT in
the user-level npm configuration:

```ini
@tracht-digital-solutions:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_yourClassicPATWithReadPackagesScope
```

Alternatively, expose `NPM_TOKEN` in the shell; the repository's `.npmrc` reads
it. npm does not load `.env`, so putting this token there will not authenticate
an install. Never commit the token.

A 401 usually means a missing or expired token. A 403 with the right scope
usually means the classic PAT has not been authorized for the organization.

## 2. Clone and install

```text
git clone https://github.com/Tracht-Digital-Solutions/tds-landingpage-frontend.git
cd tds-landingpage-frontend
npm install
```

The Windows-generated `package-lock.json` is used locally. Linux CI runs
`npm install --no-package-lock` so npm resolves native Rollup, Lightning CSS,
esbuild, Sharp and Tailwind binaries for Linux instead of reusing Windows-only
optional-dependency entries.

## 3. Configure local defaults

Copy `.env.example` to `.env` and override only what the local environment
needs:

```ini
PUBLIC_CONTACT_API_URL=http://localhost:8080/contact
PUBLIC_CONTENT_API_URL=http://localhost:8080/content
PUBLIC_BLOG_BASE_URL=http://localhost:4322
PUBLIC_DEMO_MODE=false
```

Port `8080` is the gateway in the Docker stack (`tds-gateway-api`,
`INSTALL-DOCKER.md`); `8000` is the one `composer start` brings up. Both serve
the same routes — `/content` and `/contact` are answered by
`tds-core-frontend-api`, the composed frontend API that is the gateway's
default catch-all.

The committed defaults point at the production services, so an empty `.env`
is enough for read-only development against production content.

`PUBLIC_*` values are public by definition: Vite can expose or compile them
into browser assets. Do not put credentials in them. `TDS_SITE_KEY` and
`TDS_CACHE_TOKEN` are server-only fallback values used by the connection and
cache layers; production should normally receive its paired connection through
the `/install` flow described below.

Behavior of the variables:

| Variable | Purpose |
|---|---|
| `PUBLIC_CONTACT_API_URL` | Fallback endpoint used by the contact-form island |
| `PUBLIC_CONTENT_API_URL` | Fallback API base for CMS blocks, journal posts and legal documents |
| `PUBLIC_BLOG_BASE_URL` | Public origin for journal links |
| `PUBLIC_DEMO_MODE` | `true` disables live content reads and displays committed fallbacks |
| `TDS_SITE_KEY` | Private fallback credential for API content reads; never prefix with `PUBLIC_` |
| `TDS_CACHE_TOKEN` | Private fallback credential for cache status/rebuild/purge controls |

## 4. Run locally

```text
npm run dev
```

Open `http://localhost:4321`. Astro renders requests in server mode; content
failures are fail-soft and use committed defaults. The contact form still
submits to its configured endpoint, so do not send test enquiries to production.

For a production-style local server:

```text
npm run build
npm run preview
```

`npm run build` creates both `dist/server` and `dist/client`, then runs
`postbuild` to assemble the deployable `release/` tree. It is expected to write
generated output in `dist/`, `release/` and the local cache under `var/`; all
three are ignored by Git.

## 5. Verify a change

Run the same gates as CI:

```text
npm run type-check
npm run test:run
npm run og:smoke
npm run build
```

Open `scripts/og-smoke.png` after the social-card check. For page changes,
inspect German and English routes at desktop and 375 px, in light/dark mode and
with reduced motion enabled. A green build does not detect clipped horizontal
content, invisible same-color cards or a missing focus state.

The build intentionally tolerates an unavailable content API and renders local
fallbacks. At request time, a configured site key rejected with 401/403 prevents
that fallback response from being stored in the page cache so a credential
problem cannot become a long-lived page.

## 6. Release artifact

`scripts/pack-release.mjs` assembles a self-contained production tree:

```text
release/
├── app.cjs          Passenger startup file
├── package.json     public-registry runtime dependencies only
├── server/          Astro SSR bundle; not web-accessible
├── client/          document root, assets, prerendered files and .htaccess
├── node_modules/    preinstalled runtime dependencies
└── tmp/             Passenger restart marker
```

The host must not run `npm install`: first-party packages are bundled into the
server output and native/public dependencies are already present. `client/`
must remain the web document root and a sibling of `server/`; flattening either
directory breaks Astro's runtime paths and can expose server files.

The packer verifies that the server entry, client tree and startup file exist,
that first-party imports did not leak from the bundle, and that remaining
runtime imports resolve inside the artifact. Treat a packer failure as a
deployment blocker.

## 7. Configure the production host

Create the domain as a Node application with these effective settings:

- application root: the checkout/published `release` tree;
- document root: `client/`;
- startup file: `app.cjs`;
- Node.js: 22.12 or newer;
- production environment;
- persistent, writable page-cache storage outside disposable build output.

`public/.htaccess` is copied to `client/.htaccess`. It serves real files,
prerendered pages and cache entries before falling through to Passenger. Do not
disable Passenger in this file and do not expose the internal `_tds-cache`
link.

Every deployment must restart the Node application after the release tree is
replaced. In Plesk use **Node.js → Restart App**; the conventional command-line
fallback is to update `tmp/restart.txt`. Without a restart, cached routes can
still answer while an uncached route returns 500 because the live process
references server chunks removed by the deploy.

After restart, request at least `/`, `/en/`, `/preise`, `/en/preise` and one
service page in each locale. Confirm a cache miss renders, the next request is
served as a cache hit, and no hashed asset returns 404.

## 8. Pair the deployed site through `/install`

Open `https://<domain>/install` after the Node application is running. This
prerendered, `noindex` wizard connects the deployed site to the composed API;
it does not install application files.

Use the wizard to check the API endpoint, pair the site's private content key
and establish the cache-rebuild credential. Complete the verification step and
then inspect `/tds/connect/status`. Repeat for each production origin that is
actually served, because browser-origin and CORS checks are origin-specific.

The relevant server routes are:

| Route | Purpose |
|---|---|
| `POST /tds/connect` | Receive and store the paired connection configuration |
| `GET /tds/connect/status` | Report whether the server has a usable connection |
| `GET /tds-runtime.json` | Expose public, non-secret runtime settings to browser islands |
| `/tds/cache/{status,rebuild,purge}` | Token-protected page-cache control plane |

The public runtime response must never contain the private site or cache token.
If the host cannot persist the paired configuration, fix the application-root
permissions rather than publishing secrets as `PUBLIC_*` values.

## 9. GitHub Actions and deployment

The reusable workflow runs type-check, tests, social-card smoke and build. It
publishes the verified `release/` directory—not raw `dist/`—to generated
branches:

- A push to `main` triggers `dev.yml`, builds with `PUBLIC_DEMO_MODE=true` and
  force-publishes the non-deployed `dev` branch.
- The manual **Actions → Release → Run workflow** action runs `release.yml`
  with production content, publishes `release`, then POSTs the deploy webhook.

Repository secrets:

| Secret | Used for |
|---|---|
| `NPM_TOKEN` | Reading private packages and publishing the generated branch |
| `DEPLOY_WEBHOOK_URL` | Notifying the production host after the release branch is ready |

If the webhook fails, the workflow leaves the successfully published release
available and emits a warning. Pull/deploy that `release` branch on the host,
then restart the Node application manually.

## 10. Content and legal readiness

Website copy and service references are maintained through Website CMS. Saving
a block should call the site's cache control plane and re-render every affected
home, pricing or service route without a new application release. If an update
does not appear, check the connection status and cache-event response before
rebuilding the application.

AGB PDFs are uploaded per language under Website CMS → Rechtsdokumente. Keep
`src/assets/legal/agb.pdf` as the offline fallback. English legal content must
be an independently approved upload; do not machine-translate it.

Open image/content dependencies are listed in `IMAGES.md`. Placeholder
portfolio screenshots are not a go-live step because that section remains
hidden.

## Troubleshooting

**`npm install` returns 401/403.** Verify a classic PAT with `read:packages`,
organization authorization and that npm can see `NPM_TOKEN` in the shell.

**Linux CI cannot load a `*-linux-x64-*` package.** Confirm the workflow still
uses `npm install --no-package-lock`; do not replace it with `npm ci` while the
committed lockfile is Windows-generated.

**Content remains unchanged after a CMS save.** Check `/tds/connect/status`,
the cache token, the cache-control response and that `src/lib/cache.ts` maps the
block to the affected route. A process-lifetime content memo is not valid under
SSR.

**Cached routes work but uncached routes return 500 after deployment.** Restart
Passenger/Node. The process is still holding the previous server manifest.

**Hashed browser assets return 404 after deployment.** Confirm the web document
root is `release/client`, the release tree was deployed as a unit, and the Node
process was restarted so stale cache entries were invalidated for the new asset
fingerprint.

**The contact form targets the wrong API.** Check `/tds-runtime.json` and the
paired connection first, then `PUBLIC_CONTACT_API_URL` as its build-time
fallback.
