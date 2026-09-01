# Agent guide — tds-landingpage-frontend

Marketing site for Tracht Digital Solutions at
`https://tracht-digital.de`. The current stack is Astro 7 with the standalone
Node adapter (`output: "server"`), React 19 islands and Tailwind CSS 4 through
PostCSS. Production runs under Passenger and uses a file-backed full-page cache;
this is not an SSG-only site.

Use current code, configuration and tests as the source of truth. Keep setup in
`INSTALL.md`, the product overview in `README.md`, and open assets in
`IMAGES.md`; Git history is the archive.

## Application shape

- Prefer `.astro` components for rendered content. Add a React island only for
  state, browser APIs or event-driven interaction.
- `src/layouts/Layout.astro` owns global fonts, theme bootstrap, metadata,
  canonical/hreflang links, optional JSON-LD and global islands.
- German is the default locale at `/`; English pages live under `/en/`.
  Resolve copy with `resolveLang()`/`tFor()` and generate internal links with
  `localizePath()` from `src/lib/i18n.ts`.
- The home-page order is Hero → Wieso ich? → Was ich anbiete? → Webseiten-Demos
  → positioning callout → Process → PricingTeaser → compact Journal → FAQ →
  Contact. The demos section renders nothing at all when no demo is available,
  so the order above describes a full house, not a guaranteed one. The old
  TechMarquee and Currently sections do not belong on the home page. Portfolio
  stays hidden; approved references belong to their service instead.
- Public service detail routes are `/leistungen/[slug]` and
  `/en/services/[slug]`. Route IDs and localized slugs are code-owned; never
  accept a slug or href from CMS content.
- Pricing remains at `/preise` and `/en/preise`. Legal routes stay outside the
  public sitemap.

## Design invariants

This site uses the `marketing` surface from `tds-shared-pkg`. Preserve its
visual language rather than rebuilding it locally:

- Lato for display text, Plus Jakarta Sans for body copy and JetBrains Mono for
  technical microcopy. Import Fontsource packages from layout frontmatter so
  Vite emits and rewrites font files; CSS `@import` breaks their relative URLs.
- Keep the navy, burgundy, warm-white, sand and coral/pink palette; light and
  dark themes; borderless hierarchy; 6 px cards; pill buttons; washes,
  brandbars, circuit lines and constructed geometry.
- Shared tokens, primitives, geometry and marketing-surface behavior belong in
  `tds-shared-pkg`, not in a local duplicate. Local styles are for composition
  unique to this site.
- A borderless card must use a fill that differs from its section background.
  Preserve a visible hover response and `:focus-visible` state when replacing
  borders. Never remove a focus ring.
- Avoid generic SaaS styling, new palettes, glows, organic blobs, heavy
  shadows, strong gradients, gratuitous motion and framework/tech-stack
  diagrams on the home page.
- Subpages carry no numbering. Service detail pages and the pricing cards show
  no chapter number above the title, and the process stepper marks its steps
  with dots rather than `01`…`04`; the sequence is carried by the `<ol>` and by
  the connector line. `ServiceDefinition.number` still orders the catalog and
  keys the card decoration — it is not display text. The home page's Process
  section is the one place that still numbers, deliberately.
- Keep `SectionHeader` and `AccentLetters` semantics. Accent letters need one
  accessible label and must stop transforming under `prefers-reduced-motion`.
- Test desktop, 375 px mobile, both themes and reduced motion. Horizontal
  overflow can be clipped without a visible scrollbar, so measure or inspect
  the rendered page rather than trusting the build alone.

## Content and CMS

`src/lib/cms.ts` reads all blocks for one language from
`GET /content/landing?lang=…`. `cmsFor(section, lang, fallback)` treats the
committed fallback as its runtime schema and recursively applies only useful,
type-compatible CMS values. Missing, blank, unknown or malformed values keep
the local default. New list items require a complete valid shape; a malformed
list falls back as a unit. Preserve this fail-soft contract.

CMS reads are server-side and generation-scoped through `contentCache`. Do not
restore a process-lifetime memo: after invalidation it would render stale CMS
content back into a fresh page-cache entry. A rejected configured site key must
also remain unstorable.

`contentCache` lives in `src/lib/contentCache.ts`, not in `cache.ts`. Keep it
there: `cache.ts` imports the service catalog to build its route lists, so a
content fetch importing `cache.ts` closes the cycle
`services.ts` → `cms.ts` → `cache.ts` → `services.ts`, which throws at module
evaluation and is invisible to `astro check`.

A service `summary` is rendered twice: as the card text on the home page and as
the `<meta name="description">` of that service's detail page. Keep overrides
between 80 and 160 characters — a shorter one silently degrades an indexable
page's description, and only the committed defaults are covered by tests.

The redesigned page-level blocks are `home_hero`, `why_me`,
`services_overview`, `digital_responsibility`, `pricing_services` and `faq_v2`.
The flat pricing block owns the page/teaser copy, five numeric hourly rates,
the custom-rate label, notes and CTA. Legacy `hero`, `about`, `services`,
`consulting`, `pricing` and `faq` rows remain readable in the editor for stored
content but have no active home/pricing renderer; do not wire them back. The
`tech` and `portfolio` blocks were removed from the CMS schema together with
their renderers — any stored rows are inert and must not be reintroduced.

The six service blocks are:

- `service_consulting`
- `service_process`
- `service_solutions`
- `service_custom_development`
- `service_web_presence`
- `service_complete_it`

Each block exposes `label`, `title`, `summary`, `intro`; titled lists for
`situations`, `responsibilities`, `outcomes`, `boundaries` and `process`;
`priceLabel`/`priceText`; `referencesLabel`/`referencesHeadline`; references
with `title`, `context`, `challenge`, `solution`, `result` and optional
`metric`; and `ctaTitle`, `ctaText`, `ctaButton`. Do not add editable IDs,
slugs or URLs. An explicitly empty references list is valid and hides the
entire references section—never render placeholders or invent customer names,
quotes, screenshots, metrics or outcomes.

Home cards, pricing and detail pages resolve from one service catalog/default;
DE and EN are edited separately. Change fallbacks, the Website-CMS
structured schema, validation tests and renderers together.

The contact form and public runtime connection use `src/lib/connection.ts`.
`TDS_SITE_KEY` and `TDS_CACHE_TOKEN` are server-only credentials; never rename
them to `PUBLIC_*`. Public variables are browser-visible or compiled into the
bundle. Content/API failures may fall back to committed content, but a rejected
configured site key must be surfaced by the existing guard.

## Website demos

The demo sites (`demo1`…`demo5.tracht-digital.de`) render on the home page and
on the Webauftritt service page through `sections/WebsiteDemos.astro`. Three
files own them and the split is load-bearing:

- `src/lib/demoCatalog.ts` — id, order, host and URL. Code-owned like
  `ServiceDefinition.slug`; the CMS must never name a host this site sends a
  visitor to. Imported by the sync script, so it has no other imports.
- `src/lib/demoData.json` — the committed snapshot `npm run demos:sync` writes:
  each demo's own title, meta description, favicon and screenshot. Never edit
  it by hand.
- `src/lib/demos.ts` — `getDemos()`, the snapshot filtered by a live probe.

**A demo that is not available is not loaded and not shown.** Only a snapshot
entry with `status: "ok"`, a title and a screenshot can render, and it must
also answer a `HEAD` request at render time. Three separate failures are all
disqualifying, because from here each one looks like a working link:

- a **placeholder or control panel** — Plesk answers `200 OK` for a subdomain
  with no document root;
- an **invalid certificate** — checked with TLS verification on and with no
  insecure retry, deliberately: a certificate the visitor's browser rejects is
  a page the visitor cannot reach;
- a host that was fine at sync time and is **down now**.

Unknown status strings fail closed. There is no "show it anyway" path, and
none should be added: a card leading to a certificate warning or to "Hier
entsteht eine neue Webseite" costs more than an absent card.

Everything a visitor reads on a demo card came from that demo. `homeContent.ts`
owns only the section's own framing, overridable through the `website_demos`
block; that block has no Website-CMS schema yet and falls back cleanly until it
does. Never write a description for someone's site — a demo without a meta
description simply shows none.

The live probe is memoised per render generation, so the home page and the
service page share one round of probes and a cache rebuild re-checks. That memo
is also the feature's latency: a demo that goes down disappears at the next
rebuild of the pages it appears on, not at the next visitor.

## SSR, page cache and deployment

`src/middleware.ts` wraps server-rendered responses with the shared page cache.
On production, `public/.htaccess` serves a stored file before Passenger reaches
Node; a miss renders once and stores the response. Do not render personalized,
cookie-, session- or `Accept-Language`-dependent server content on a cached
route.

Cache behavior is split deliberately:

- `src/lib/cache.ts` maps CMS/blog events to every affected URL and lists the
  paths required for a cold full rebuild.
- `src/lib/pageCache.ts` owns the single cache instance and invalidates the
  generation-scoped content memo before re-rendering.
- `/tds/cache/{status,rebuild,purge}` is the token-gated control plane.
- Service pages, pricing pages and home pages must all be included when a
  shared block can affect them. When adding a public route, update event
  mapping, `alwaysPaths`, sitemap data and tests in the same change.

`npm run build` emits server/client output and assembles the self-contained
`release/` tree. Keep server output, the Node adapter, `app.cjs`, the release
verifier and first-party bundling through `vite.ssr.noExternal`.

Every production deploy must restart Node. Otherwise cached routes may work
while uncached routes return 500 from server chunks replaced under the live
process; cache fingerprinting does not replace the restart.

## DE/EN, SEO and accessibility

- Every indexable German page must have a real English twin and reciprocal
  canonical/hreflang metadata. Preserve locale while linking between home,
  service and pricing pages.
- `src/lib/sitemap.ts` is the explicit route inventory because SSR routes are
  not emitted as pages during the build. Add both locale paths together and
  cover them in sitemap tests.
- Keep page titles and descriptions distinct, truthful and within the limits
  enforced by `src/lib/seo.test.ts`. `Layout.astro` must use the route's actual
  title rather than a hard-coded tab title.
- JSON-LD must match visible content after CMS resolution. FAQ answers and
  process steps must use the same resolved values as their rendered sections.
  Pricing structured data may include numeric hourly offers only; the custom
  monthly `Komplette IT` offer must not receive an invented numeric price.
- Service cards are semantic links with a full-card hit area, a visible
  keyboard focus and meaningful accessible text. Prefer native links,
  headings, lists, `<details>/<summary>` and form controls over scripted
  substitutes.
- Keep the skip link, logical heading order, labelled controls, keyboard mobile
  navigation, theme no-flash bootstrap and `prefers-reduced-motion` behavior.
  Entrance-motion visible states must explicitly restore opacity/position even
  when transition duration becomes zero.

## Verification

Use the repository scripts:

```text
npm run type-check   # Astro/TypeScript correctness
npm run test:run     # Vitest unit and contract tests
npm run og:smoke     # render the default social card for inspection
npm run demos:sync   # re-harvest the demo sites; prints why each one is hidden
npm run build        # SSR build plus deployable release assembly/verification
npm run preview      # production-style local inspection
```

The Vitest default environment is Node; opt a DOM-dependent test into jsdom in
that test file. `dist/`, `release/` and `var/` are generated and excluded from
source checks. `.claude/worktrees/**` contains active worktrees, not disposable
output.

Before handoff, verify at minimum both locale trees, every service route, the
pricing page, CMS fallbacks (missing/partial/malformed/empty references), cache
invalidation, sitemap/hreflang, JSON-LD, keyboard focus and responsive layout.

## Do not

- Do not revert the site to static output or fetch editable page content only
  at build time.
- Do not make cached server routes visitor-specific.
- Do not bypass `tFor()` with direct `translations.de` access or hard-code one
  locale into a shared component.
- Do not duplicate CMS copy in components, accept CMS-controlled route keys,
  or publish fabricated references and service promises.
- Do not add unconditional 24/7, response-time or availability guarantees for
  Complete IT; scope and availability are contractual.
- Do not create a numeric public price or Offer price for Complete IT before an
  assessment.
- Do not put secrets in source, `PUBLIC_*` variables, browser code or generated
  runtime JSON.
