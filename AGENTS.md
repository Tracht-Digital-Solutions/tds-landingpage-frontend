# AGENTS.md — tds-landingpage-frontend

Marketing site for Tracht Digital Solutions at `https://tracht-digital.de`. Astro 7 with the
standalone Node adapter (`output: "server"`), React 19 islands and Tailwind CSS 4 through PostCSS.
Production runs under Passenger behind a file-backed full-page cache; it is not an SSG site. German at
`/`, English under `/en/`. Setup: [INSTALL.md](INSTALL.md); overview: [README.md](README.md); image
assets: [IMAGES.md](IMAGES.md).

## Commands

```bash
npm install --no-package-lock
npm run dev
npm run type-check          # astro check
npm run test:run            # vitest (default env: node)
npm run build               # SSR build + release/ assembly and verification
npm run audit:ux -- <url>   # also audit:geo, audit:perf, audit:contrast, audit:chrome, audit:nav
```

Full list and what each audit checks: [docs/agents/verification.md](docs/agents/verification.md).

## Hard rules

- Never revert to static output or build-time-only content; never make a cached route visitor-specific.
- Resolve copy through `tFor()`; never hard-code a locale in a shared component.
- Route ids, slugs and destinations are code-owned; never accept them from the CMS.
- Never publish fabricated references, metrics or promises; anonymised by default, named only with approval.
- The site says **"du"** (legal pages excepted); no "echt"/"wirklich"; no hourly rates; no free or timed first conversation.
- Nothing a visitor reads ships at `opacity: 0`; above-the-fold islands need a measured reason for `client:load`.
- Shared tokens and primitives belong in tds-shared; local styles only compose.
- Every `<dialog>` spells out `margin: auto`.
- `public/llms.txt` stays deleted; `TDS_SITE_KEY` and `TDS_CACHE_TOKEN` are never `PUBLIC_*`.
- A new public route updates cache event mapping, `alwaysPaths`, the sitemap inventory and tests together.
- Every production deploy restarts Node.

## Topic files

| File | Read before |
|---|---|
| [docs/agents/architecture.md](docs/agents/architecture.md) | Changing pages, routes, the home order, contact form, assistant, prices or caching |
| [docs/agents/content-cms.md](docs/agents/content-cms.md) | Changing copy, CMS blocks, references or anything in `cms.ts` |
| [docs/agents/design.md](docs/agents/design.md) | Changing styles, layout, the floating pill, bookmarks, hero or shadows |
| [docs/agents/motion.md](docs/agents/motion.md) | Touching anything that moves |
| [docs/agents/website-demos.md](docs/agents/website-demos.md) | Touching the showcase, demo catalog, card bar or the embed brand bar |
| [docs/agents/seo-a11y.md](docs/agents/seo-a11y.md) | Changing titles, JSON-LD, sitemap, hreflang, robots, llms.txt or accessibility |
| [docs/agents/verification.md](docs/agents/verification.md) | Running audits or preparing a hand-off |

Workspace rules: `../CLAUDE.md`. Cross-repo state: `../MIGRATION-STATUS.md`.
