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
  (#050f68 navy, #820933 burgundy).
- **External APIs**: contact form POSTs to
  `https://api.tracht-digital.de/contact`. Journal teaser fetches
  from `https://api.tracht-digital.de/content/blog?limit=3` at
  build time (Astro frontmatter, not at runtime).

## Don't

- Don't add `output: "server"` — Webhosting 8000 has no Node runtime.
  This site MUST stay `output: "static"`.
- Don't add per-frontend brand tokens. Always edit `tds-shared/src/brand/`
  and bump the version.
- Don't fetch the journal teaser at runtime. Build-time fetch in
  `index.astro` frontmatter so the rendered HTML ships static.
