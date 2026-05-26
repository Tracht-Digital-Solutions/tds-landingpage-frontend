# Agent notes — tds-landingpage

Astro 5 + React islands + Tailwind v4. Static-rendered marketing site.
Deploys to **netcup Webhosting 8000** at `tracht-digital.de`.

## Status

Phase 5 ported. Homepage sections, `/preise`, and `/legal/{impressum,datenschutz}`
all shipped. Outstanding work is content (real phone, portrait,
portfolio screenshots, social URLs) — tracked as repo issues, not
ports. See README's "Replace examples before go-live" section.

## Mental model

- **Astro components** for non-interactive markup. Cheap, no JS.
- **React islands** only when state or DOM events are needed.
  Don't reach for an island when an `.astro` will do.
- **i18n strings**: `import { translations } from "@tracht-digital-solutions/tds-shared/i18n"`.
  In server-side Astro, use `translations.de` directly. In React
  islands, wrap with `<LanguageProvider>` from
  `@tracht-digital-solutions/tds-shared/i18n/react`.
- **Brand tokens**: imported via Tailwind's `@theme inline` block in
  `src/styles/global.css`. Same brand colors as the legacy app
  (#050f68 navy, #820933 burgundy). Fonts are self-hosted
  `@fontsource-variable/fraunces` (opsz axis) + `@fontsource-variable/geist`
  — the brief's Fraunces+Geist combo finally renders for real (was
  silently falling back to `ui-serif`/`system-ui` until 2026-05).
- **Editorial vocabulary**: `.display`, `.display-tight`, `.accent-italic`,
  `.section-num`, `.eyebrow`, `.lead` — the same primitives the portals
  and journal use. `SectionHeader.astro` is the shared masthead component
  for the homepage sections; each section's eyebrow goes through
  `.section-num` (with leading hairline rule) or `.eyebrow` for callouts.
- **External APIs**: contact form POSTs to
  `https://api.tracht-digital.de/contact`. Journal teaser fetches
  from `https://api.tracht-digital.de/content/blog?limit=3` at
  build time (Astro frontmatter, not at runtime).

## SEO + structured data

- **`src/lib/seo.ts`** is the single source of truth for org/person
  identity (name, email, founder, areaServed, address city,
  socials). The Impressum placeholders (street, phone, USt-IdNr,
  social URLs from #5/#6/#7) are deliberately **kept off** the
  config so Google + AI engines don't cache wrong data. When real
  data lands, flip the `streetAddress`/`telephone`/`vatID`/
  `socials` fields on in `seo.ts` and the JSON-LD layer below
  picks it up everywhere.
- **`src/lib/jsonld.ts`** renders Schema.org graphs
  (Organization+ProfessionalService, Person, WebSite,
  Service+OfferCatalog for `/preise`, BreadcrumbList). All entities
  share stable `@id`s (`tracht-digital.de/#organization`,
  `/#person`) so tds-blog can reference them by id instead of
  duplicating.
- **`src/components/JsonLd.astro`** is the head-injected
  `<script type="application/ld+json">` utility — `<Layout
  jsonLd={...} />` passes through.
- **`src/og/render.ts` + `src/pages/og/default.png.ts`** — Satori
  pipeline mirroring tds-blog. Builds a static 1200×630 brand
  card at `/og/default.png` used as the fallback OG image. Fonts
  live under `src/og/fonts/` (TTFs, copied from tds-blog).
- **`public/robots.txt`** explicitly allows GPTBot, OAI-SearchBot,
  PerplexityBot, ClaudeBot, Google-Extended (etc.) and points
  at the sitemap.
- **`public/llms.txt`** is the llmstxt.org-convention markdown
  directory of services + pages for AI crawlers.

## Don't

- Don't add `output: "server"` — Webhosting 8000 has no Node runtime.
  This site MUST stay `output: "static"`.
- Don't add per-frontend brand tokens. Always edit `tds-shared/src/brand/`
  and bump the version.
- Don't fetch the journal teaser at runtime. Build-time fetch in
  `index.astro` frontmatter so the rendered HTML ships static.
- Don't reintroduce the navy→burgundy `linear-gradient` pill buttons.
  Hero + Header CTAs are flat `bg-[var(--color-primary)]` with
  `hover:bg-[var(--color-accent)]`. The PricingTeaser dark callout
  *block* keeps its gradient on purpose — that's a deliberate
  editorial card, not a button.
- Don't inline `text-xs font-medium tracking-widest uppercase` for
  section eyebrows. Use `.section-num` (with leading rule) for
  numbered chapter labels and `.eyebrow` for field labels.
- Don't bake Impressum placeholder data (street, phone, USt-IdNr,
  social URLs) into the JSON-LD layer — once Google + AI engines
  cache it, the wrong data sticks until they re-crawl. The
  `src/lib/seo.ts` TODO block is the only place to flip it on.
- Don't import `~/og/render` from a React island — Satori + Resvg
  pull native deps and are build-time only.
- Don't anchor the OG font dir to `import.meta.url` (or any path
  derived from it). Astro bundles `src/og/render.ts` into
  `dist/pages/og/`, so `new URL("./fonts/", import.meta.url)` ends
  up pointing at `dist/pages/og/fonts/` and the build crashes with
  ENOENT. Keep the cwd-anchored `path.join(process.cwd(), "src/og/fonts")`.
  `npm run og:smoke` is the cheapest way to catch this regression.
- Don't write `WithContext<object>` on Schema.org node builders.
  TypeScript treats `object` as too narrow to accept additional
  named property literals (`@type`, `@graph`), and the type-check
  fails with "Object literal may only specify known properties".
  The alias now defaults the generic to `Record<string, unknown>`
  — just write `WithContext` (no explicit type argument). Same
  pattern lives in tds-blog/src/lib/jsonld.ts.
