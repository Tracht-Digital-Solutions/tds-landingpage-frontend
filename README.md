# tds-landingpage-frontend

The bilingual public marketing site for Tracht Digital Solutions at
[`tracht-digital.de`](https://tracht-digital.de). It presents Julian Tracht as
the long-term contact for a company's digitalization—from advice and planning
through implementation to agreed operational IT support.

The site uses Astro 7, React 19 islands and Tailwind CSS 4. It is rendered by a
standalone Node server and cached as files, so common page requests are served
directly by the web server. German is the default locale at `/`; English lives
under `/en/`.

For a fresh checkout, production configuration or deployment, use
[`INSTALL.md`](INSTALL.md). Agent-specific implementation invariants live in
[`AGENTS.md`](AGENTS.md). Open image/content work is tracked in
[`IMAGES.md`](IMAGES.md).

## Experience and pages

The home page keeps the existing Tracht Digital Solutions visual system while
organizing the content around one clear responsibility:

1. Hero and initial-consultation CTA
2. Wieso ich? / Why me?
3. Six linked service areas
4. Digitalization-responsibility callout
5. Process
6. Pricing teaser
7. Compact journal teaser
8. FAQ
9. Contact

The former tech-stack and current-topics sections are no longer part of the
home-page story. The placeholder portfolio remains hidden. Approved references
appear within the relevant service page and on the home page — anonymized
unless that customer agreed to be named; when none are available, the complete
references section is omitted.

| Path | Purpose |
|---|---|
| `/`, `/en/` | German and English home pages |
| `/leistungen/[slug]` | German service detail pages |
| `/en/services/[slug]` | English service detail pages |
| `/preise`, `/en/preise` | Hourly rates for all four services |
| `/legal/impressum`, `/legal/datenschutz` | German legal notice and privacy policy |
| `/legal/agb`, `/en/legal/agb` | Terms pages backed by uploaded PDFs |
| `/legal/agb.pdf`, `/en/legal/agb.pdf` | The corresponding PDF endpoints |
| `/install` | Browser-assisted connection setup for a deployed site |

The four stable service identities are Beratung & Konzeption,
Prozessoptimierung, Individuelle Lösungen and Webauftritt (websites, online
shops and marketing). Localized slugs are controlled by source code; editors cannot
change routing.

| Service | German | English |
|---|---|---|
| Beratung & Konzeption | `/leistungen/beratung-konzeption` | `/en/services/consulting-planning` |
| Prozessoptimierung | `/leistungen/prozessoptimierung` | `/en/services/process-optimization` |
| Individuelle Lösungen | `/leistungen/individuelle-loesungen` | `/en/services/tailored-solutions` |
| Webauftritt | `/leistungen/webauftritt` | `/en/services/web-presence` |

## Content model

Most shared default copy comes from `tds-shared-pkg`; landing-specific defaults
live beside their renderers. The Website CMS supplies sparse DE/EN overrides
through the public `/content/landing` endpoint. `src/lib/cms.ts` validates each
stored value against the committed fallback and applies only compatible data.
Missing, partial or malformed blocks therefore remain publishable using local
defaults.

Each service has one CMS block shared by its home-page card, pricing entry and
detail page. A block contains the summary, introduction, typical situations,
responsibilities, outcomes, boundaries, process, pricing principle, optional
references and CTA. Stable IDs, slugs and hrefs are not CMS fields.

Reference records are deliberately factual: title, context, challenge,
solution, result and an optional verified metric. Never add placeholder clients,
quotes or results. An empty references list is a valid editorial state and
renders nothing.

The journal teaser reads published blog content and falls back to committed
copy when the API is unavailable. Legal PDFs are uploaded independently per
language through Website CMS; `src/assets/legal/agb.pdf` is the committed
fallback.

## Rendering and cache

The site is not a static-only build:

- Astro renders cache misses through the standalone Node adapter.
- The shared page-cache middleware stores complete responses on disk.
- Apache serves existing cache entries before Passenger wakes Node.
- CMS and blog changes call the token-protected cache control route, invalidate
  the server-side content memo, and re-render only affected pages.
- Routes that never vary with content—such as the OG image and sitemap
  endpoints—remain prerendered.

The cache is path-wide and must not contain visitor-specific server state.
Login/session UI, if any, belongs in the browser. Deployments must restart the
Node process after replacing the release tree.

## Localization, SEO and accessibility

Astro i18n resolves German at the unprefixed path and English under `/en/`.
Components use `tFor()` for copy and `localizePath()` for internal navigation.
Every indexable German route has a real English counterpart with reciprocal
canonical and hreflang links.

SEO output includes per-page titles/descriptions, Open Graph/Twitter metadata,
an explicit SSR-safe sitemap, `robots.txt`, `llms.txt` and Schema.org JSON-LD.
Structured data is built from the same resolved content the visitor sees.
Retired service URLs (Auftragsprogrammierung, Marketing, Komplette IT) answer
with a 301 to their successor rather than a 404 — the table lives in
`src/lib/services.ts`.

The navigation, service cards, FAQ and forms use native semantics and keyboard
interaction. Visible focus, heading order, labels, both themes and
`prefers-reduced-motion` are release requirements.

## Development

Requirements are Node.js 22.12+, npm 10+, Git and an authorized classic GitHub
PAT with `read:packages` for `@tracht-digital-solutions/tds-shared`.

```text
npm install
npm run dev          # local Astro server on http://localhost:4321
npm run type-check   # Astro/TypeScript checks
npm run test:run     # Vitest suite
npm run og:smoke     # render the default social card
npm run demos:sync   # re-harvest the demo sites (see AGENTS.md, "Website demos")
npm run build        # SSR build + verified self-contained release tree
npm run preview      # inspect the production build locally
```

Tailwind runs through `@tailwindcss/postcss` in `postcss.config.mjs`. A
Windows-generated `package-lock.json` is committed for local reproducibility;
the Linux workflow installs with `--no-package-lock` so native dependencies are
resolved for Linux.

The main source areas are:

```text
src/components/       Astro sections/UI and React islands
src/layouts/          global HTML, metadata, theme and shared islands
src/lib/              CMS, cache, connection, i18n, SEO and JSON-LD helpers
src/pages/            localized routes and server endpoints
src/og/               prerendered 1200×630 social-card renderer
src/styles/            shared marketing surface imports and local composition
public/                static assets and Apache rules
scripts/               release assembly and smoke helpers
```

## Configuration and release overview

Public API defaults point at `api.tracht-digital.de`; blog links point at
`blog.tracht-digital.de`. Copy `.env.example` to `.env` for local overrides.
Values beginning with `PUBLIC_` can be exposed to the browser. Site and cache
tokens are server-only and must keep their unprefixed names.

The repository publishes two generated branches:

- Pushes to `main` build a demo-configured, non-deployed `dev` artifact.
- The manual Release workflow builds the production `release` tree and pings
  the deployment webhook.

The published artifact is `release/`, not raw `dist/`: it contains the Node SSR
bundle, browser assets, Passenger startup file and runtime dependencies needed
to start without a GitHub Packages token on the host. See `INSTALL.md` for
secrets, first-time connection and host deployment steps.

## Legal documents and remaining content

To replace an AGB PDF, open Website CMS → Rechtsdokumente, select `agb` and the
language, optionally enter its revision label, and upload the approved PDF.
English is a separate legal upload, not a machine translation. The committed
fallback must remain under `src/assets/legal/` because `public/legal/` would
collide with the generated route.

The old portfolio screenshots are no longer a launch dependency: the portfolio
section stays hidden. The remaining publishable-content dependency is approved
reference material per service, anonymized by default. `IMAGES.md` lists only
unresolved asset work.

## License

UNLICENSED — internal Tracht Digital Solutions project.
