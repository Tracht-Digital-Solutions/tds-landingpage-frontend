# Agent notes — tds-landingpage

Astro 5 + React islands + Tailwind v4. Static-rendered marketing site.
Deploys to **netcup Webhosting 8000** at `tracht-digital.de`.

## Status

Scaffolded with one placeholder hero section that proves the
shared-package + i18n + Tailwind setup wires up. **Sections still
need to be ported from `tds-lp/app/components/sections/`.**

## Port checklist (Phase 5)

Static sections → `.astro` files in `src/components/sections/`:
- [ ] Hero
- [ ] About
- [ ] Services
- [ ] PricingTeaser
- [ ] TechMarquee
- [ ] Portfolio
- [ ] Process
- [ ] Journal (with build-time fetch from `tds-content-api`)

Interactive bits → React islands in `src/components/islands/`
(use `client:load` or `client:visible`):
- [ ] ContactForm (POST to `tds-contact-api`)
- [ ] SmoothScroll (Lenis)
- [ ] SectionSnap (existing snap controller)
- [ ] LanguageToggle (uses `LanguageProvider` from
      `@tracht-digital-solutions/tds-shared/i18n/react`)
- [ ] Header / Footer / MagneticButton

Pages still to create:
- [ ] `src/pages/preise.astro`
- [ ] `src/pages/legal/impressum.astro`
- [ ] `src/pages/legal/datenschutz.astro`

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
