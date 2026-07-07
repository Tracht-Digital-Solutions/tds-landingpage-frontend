# Agent notes — tds-landingpage

Astro 6 + React islands + Tailwind v4. Static-rendered marketing site.
Deploys to **the production host** at `tracht-digital.de`.

## Status

Phase 5 ported. Homepage sections, `/preise`, `/legal/{impressum,datenschutz}`
all shipped. As of 2026-05-28: upgraded to Astro 6, swapped Tailwind from
the `@tailwindcss/vite` plugin to `@tailwindcss/postcss` (rolldown
incompatibility with Vite 7 — withastro/astro#16542), wired real Astro
i18n routing (DE at `/`, EN at `/en/`), swapped the heading family to
the shared Hanken Grotesk grotesk, dropped SectionSnap in favour of native scroll +
a thin ScrollProgress bar, and replaced the DE/EN pill toggle with a
flag dropdown (inline-SVG flags — Win32 doesn't ship colour flag
glyphs). Closing pill below `lg` docks flush against the top edge
with full mobile menu (animated hamburger ↔ ×) and the section
order has been reshuffled so PricingTeaser sits after Process.
Outstanding work is content (real phone, portrait, portfolio
screenshots, social URLs) — tracked as repo issues, not ports.
See README's "Replace examples before go-live" section.

## Mental model

- **Astro components** for non-interactive markup. Cheap, no JS.
- **React islands** only when state or DOM events are needed.
  Don't reach for an island when an `.astro` will do.
- **i18n strings**: `import { tFor, resolveLang, localizePath } from "~/lib/i18n"`.
  In server-side Astro, call `const t = tFor(Astro.currentLocale)` — the
  helper maps the route-resolved locale onto the shared translations
  bundle. React islands receive `lang` as a prop from the .astro
  mount, so server-rendered text and client hydration agree without
  a flash. Never re-introduce `translations.de` direct access — that
  was the bug that made the language toggle a no-op.
- **i18n routing**: `astro.config.mjs` declares `defaultLocale: "de"`,
  `locales: ["de", "en"]`, `prefixDefaultLocale: false`. EN entry
  pages live under `src/pages/en/` and are intentionally identical
  to their DE counterparts because Astro injects the right
  `currentLocale` from the URL. Internal links go through
  `localizePath()` so /preise stays in the active locale tree.
- **Brand tokens**: defined as the `@theme` block in
  `@tracht-digital-solutions/tds-shared/styles/base.css`, which
  `src/styles/global.css` imports (Tailwind v4 processes the imported
  `@theme`). Same brand colors as the legacy app (#050f68 navy, #820933
  burgundy). Heading family is self-hosted `@fontsource-variable/hanken-grotesk`;
  body is `@fontsource-variable/geist` — both imported in `Layout.astro`
  frontmatter, NOT via CSS `@import` (see the fontsource entry in "Don't"
  below). Hanken Grotesk is the single canonical
  display font across all frontends — a flat, modern grotesk (it replaced
  Instrument Serif, which read too editorial/serif for the brand).
- **Editorial vocabulary**: `.display`, `.display-tight`, `.accent-italic`,
  `.section-num`, `.eyebrow`, `.lead` — shared primitives from
  tds-shared's `base.css`, the same the portals and journal use. The
  marketing site imports only `base.css` (not `app.css`) and keeps its
  bespoke section styles (accent-letters, hero, marquee) local.
  `SectionHeader.astro` is the shared masthead component
  for the homepage sections; each section's eyebrow goes through
  `.section-num` (with leading hairline rule) or `.eyebrow` for callouts.
- **Interactive accent letters** (`src/components/ui/AccentLetters.astro`
  + a React mirror in `Hero.tsx`): every italic `headlineAccent` word is
  rendered as per-character spans so each letter can react to pointer
  hover — colour cycles through the brand palette by `:nth-child(4n+x)`,
  letter lifts -3 px / tilts -2° / scales 1.06, siblings tilt 0.5° / fade
  to 0.94 on group hover. Pass `tone="dark"` on dark-blue sections
  (Tech / Contact / PricingTeaser inner card) so the hover palette
  switches to white + bright pink. Styles live in `global.css` under
  `.accent-letters / .accent-letter` so the .astro and React paths
  render identically. `aria-label` carries the whole word on the wrapper
  so screen readers don't read letter-by-letter; transforms collapse on
  `prefers-reduced-motion: reduce`.
- **Section order** (`src/pages/index.astro`): Hero → About →
  Services → Tech → Portfolio → Process → Currently → PricingTeaser
  → Journal → **Consulting** → **FAQ** → Contact. Narrative arc
  reads as hook → who → what → capability → proof → method → now
  → cost → thinking → invitation → objection-handling → convert.
  Consulting + FAQ close the funnel before the contact form: the
  consulting card invites a discovery call, FAQ clears the small
  doubts a mid-market visitor usually has before clicking through.
- **Currently section** (`src/components/sections/Currently.astro`):
  "Now page" convention. Section masthead reads "Aktuelle *Themen*"
  / "Current *topics*". Left column now pulls the 3 most recent
  posts from `tds-content-api` via `src/lib/content.ts`'s
  `fetchTopics(lang, limit)` — each card renders category eyebrow
  · title · excerpt · date · "Weiterlesen ↗" and links to
  `topicHref(slug)` on blog.tracht-digital.de. Hand-curated
  fallback in the same file when the API returns `[]` so the
  section still ships meaningfully on first-deploy or transient
  outage. Right column ("Im Fokus" / "Focused on") still lists
  4 intentions / principles with accent "→" arrow
  markers, `md:sticky` so they stay visible while the topics list
  scrolls past. Intentions copy stays inlined; topics are live.
- **Journal section** (`src/components/sections/Journal.astro`): the "Gedanken
  & Artikel" row. Fetch chain at build time: the admin-curated `journal` content
  block (`{ slugs: [...] }`, max 4, via `fetchPostsBySlug`) → else the 3 most
  recent posts (`fetchTopics`) → else the **tds-shared i18n placeholder posts**
  (`t.blog.posts`). So the placeholder articles appear whenever the API returns
  no published posts — NOT only when the API is down: a reachable-but-empty
  `blog_post` table (e.g. seeds never ran on prod) yields `[]` and triggers the
  same fallback, and any `PUBLIC_DEMO_MODE=true` build short-circuits the fetch
  to `[]` by design. The three placeholder slugs
  (`individuelle-software-kosten`, `drei-prozesse-automatisierung`,
  `warum-ich-nicht-skaliere`) are now seeded into `tds-content-api` by its
  `SeedInitialBlogPosts` migration (DE + EN), so a migrated prod shows the real
  posts. `localCovers` in the component still maps those slugs to
  `/journal/*.webp` when a post has no live `coverHint`.
- **Consulting section** (`src/components/sections/Consulting.astro`):
  Gradient card matching `PricingTeaser`'s visual language so the
  two callouts pair as a system. Two CTAs — primary
  "Erstgespräch buchen" / "Book a discovery call" → `#contact`,
  secondary "Leistungen ansehen" / "See services" → `/preise`. Copy
  via `t.consulting.*` in tds-shared 0.2.5+.
- **FAQ section** (`src/components/sections/FAQ.astro`): Native
  `<details>`/`<summary>` accordions — zero JS, accessible,
  keyboard-navigable. Six items (project timeline, remote/on-site,
  NDA, first step, tech stacks, workshop/audit-only). Scoped
  `<style>` uses `@supports (interpolate-size: allow-keywords)`
  so modern browsers get a smooth height animation on open/close;
  older browsers fall back to the default `<details>` snap. Copy
  is inlined per the same rule as Currently — FAQ answers drift
  faster than the rest of the bundle.
- **Editable content via `src/lib/cms.ts`**: `fetchBlocks(lang)` does a
  single build-time GET of `PUBLIC_CONTENT_API_URL/landing?lang=` (memoised)
  and `cmsFor(section, lang, fallback)` merges the admin-edited block for that
  section over its baked default, guarded by a shallow shape-check and
  graceful fallback to `{}` so the build never breaks if the API is down.
  Editable sections today: hero, about, services, pricing, consulting,
  contact, footer, faq, process — edited in tds-admin's Landingpage editor.
  **tds-shared i18n (and the local `lib/faq.ts` / `lib/processDetails.ts`)
  remain the default/fallback**; a content block only *overrides* it. Honours
  the "content baked at build time, never at runtime" rule — a `/landing` edit
  goes live only after the API triggers a rebuild. (Hero is a `client:load`
  island, so `index.astro` resolves its block and passes it as a prop.)
- **Cookie banner (admin-toggleable)**: `cookieBannerEnabled()` in `cms.ts`
  reads the language-agnostic `cookie_banner` block (always `lang=de`, like
  the Journal selection) and `Layout.astro` bakes the shared `CookieNotice`
  island (tds-shared ≥0.8.8, `client:idle`, local `/legal/datenschutz` link)
  on every non-bare page when `{ enabled: true }`. Absent block / demo mode /
  API down = banner off. Toggled in tds-admin (Landingpage → Cookie-Banner);
  a save rebuilds landingpage **and** blog. Dismissal persists per origin in
  localStorage (`tds-cookie-notice`) — no cookies involved, which is what the
  banner itself states.
- **Live topics via `src/lib/content.ts`**: `fetchTopics(lang, limit)`
  is a build-time fetch from `PUBLIC_CONTENT_API_URL/blog?…` that
  returns `[]` on any failure. Consumers fall back to their own
  static content so the build never breaks on a content-API hiccup.
  `index.astro` and `en/index.astro` use it twice — once for the
  Hero `featuredTopic` (top 1 post), once independently inside
  Currently for the full 3-post list — so the pill still renders
  when Currently's fetch is empty.
- **Process timeline** (`src/components/sections/Process.astro` +
  `ProcessStep.astro`): vertical timeline with a continuous
  `bg-gradient-to-b` spine (accent/40 → line → accent/20) sitting
  absolute behind all step markers, plus an accent-coloured start
  cap and a primary-coloured end cap. Each step's circular icon
  marker carries a `ring-4 ring-[--color-soft]` so it punches
  through the spine cleanly. Steps wrapped in an `<ol>` for
  semantic order; the visual numbering already lives in each
  step's title row. Replaces an earlier per-step gradient connector
  design that read as four chained cards instead of one arc.
  On desktop the timeline pairs with a sticky detail panel: hovering or
  keyboard-focusing a step reveals its longer copy (`src/lib/processDetails.ts`,
  kept local like the FAQ copy) over a per-step photo
  (`public/images/process/step-0N.webp`) with the brand gradient as a
  fallback when an image is missing.
- **Section rhythm**: paper → paper → soft → DARK → paper → soft →
  paper → paper → soft → paper → soft → DARK. Paper-backed
  narrative sections (About, Portfolio, Currently, PricingTeaser
  inner card, Consulting) alternate with `--color-soft` callout
  sections (Services, Process, Journal, FAQ) and dark-blue chrome
  sections (Tech, Contact). The Currently + PricingTeaser paper
  pair sits inside the soft Process / Journal frame so the
  gradient pricing card lands in a calm space; Consulting's
  gradient card and the soft FAQ both buffer the dark Contact
  closing.
- **Header / navigation**: floating pill on desktop (≥lg) with
  `data-scrolled` morphing the chrome on scroll past 8px. Below
  `lg` the pill docks against the top edge (`top: 0`, flat top
  border, 24px-rounded bottom), is always rendered with chrome,
  spans `left-3 right-3`, and ends in a 44px hamburger that
  animates three CSS bars into an × via the `[aria-expanded]`
  attribute. Mobile menu panel mounts as a separate fixed div
  below the pill — Astro inline `<script>` toggles state and
  body scroll-lock. The "TDS" wordmark is paired with the real
  logomark at `public/images/logo.webp` (the with-text variant
  `logo-with-text.webp` sits alongside it).
- **Service icons**: `ServiceIcon.astro` renders a small inline
  SVG keyed off the service `number` ("01" → browser-window,
  "02" → smartphone, "03" → stacked layers, "04" → connected
  nodes, "05" → sparkles). The mapping is editorial and intentionally
  not derived from the title — titles can change in tds-shared
  without breaking the visuals. ServiceCard wraps the icon in an
  accent-tinted chip that flips to the full accent fill on hover.
- **Contact form focus**: each input/textarea is wrapped in a
  `.field` div. The wrapper paints a static `::after` baseline rule
  and a `.field-line` brand-pink overlay that's preserved in code
  but kept collapsed (`scaleX(0)`) on focus per user feedback —
  the pink line read as a "border lighting up" which is the cue
  the user wants removed. Current focus indicator: the baseline
  `::after` rule flips to a fully opaque white underline
  (`white/0.9`); the input content area picks up a brighter wash
  (`white/0.2`) plus a white-tinted inset highlight and drop-shadow
  glow. The label brightens to near-white (no accent-pink shift)
  and tightens its tracking. `.field--error` paints the baseline
  pink immediately so a broken field still reads at a glance.
  Scoped via `<style is:global>` in Contact.astro because the React
  island can't carry the styles itself.
- **Hero background motion** (`src/components/islands/Hero.tsx`):
  three concentric layers translate + scale at staggered rates as
  the user scrolls (back -160 / mid -260 / front -360 over 800 px,
  with scale 1.15 / 0.9 / 1.25 respectively); the base conic
  gradient rotates 60° over 1200 px of scroll and pans -80 px so
  even the field behind the blobs drifts. Cursor parallax owns the
  X axis only, scroll owns Y + scale + rotate — separating axes
  reads as 3D drift rather than uniform zoom. Bumped from a much
  subtler 2026-05-29 starting point because the original was too
  quiet to notice.
- **Hero composition**: three stacked title tiers in addition to
  the data-driven pill.
  - **Pill**: when `featuredTopic` is passed it renders as an `<a>`
    to the live blog article (pulse-dot · "Im Journal" / "In the
    journal" · title · ↗). When absent, falls back to the static
    availability + location pill.
  - **H1** (display): `t.hero.headline + headlineAccent +
    headlineSuffix` — currently **"Software, die mit Ihrem
    *Unternehmen* wächst." / "Software that grows with *your*
    business."** (tds-shared 0.2.7). Italic accent on the personal
    pronoun ("Unternehmen" / "your") so the brand-distinctive
    emphasis lands on what the reader cares about.
  - **Tagline strapline**: `t.hero.tagline` ("Beratung · Konzept ·
    Code — alles aus einer Hand." / "Consulting · concept · code
    — all from one source."). Sized text-base → md:text-xl in muted
    body colour. Sits directly under the H1 and picks up secondary
    SEO weight the H1 deliberately doesn't carry.
  - **Brand slogan** (display-tier): `t.footer.slogan` ("Digitales
    Handwerk für den Mittelstand." / "Digital craft for the
    mid-market.") in italic accent — sized text-2xl → md:text-4xl
    so it reads as a banner. Reusing the footer slogan keeps the
    brand-tier promise consistent across both surfaces without a
    separate hero-only key.
- **External APIs**: contact form POSTs to
  `https://api.tracht-digital.de/contact`. Journal teaser fetches
  from `https://api.tracht-digital.de/content/blog?limit=3` at
  build time (Astro frontmatter, not at runtime).
- **Dynamic document.title**: inline script at the bottom of
  `Layout.astro` observes every `<section id="…">` and prefixes the
  tab title with the section name as the user scrolls past it.
  Hero keeps the canonical page title; below-hero sections render
  as `<section name> · <brand>`. Label resolution falls back
  through `data-title` → `.section-num`/`.eyebrow` text (strips
  the "— 02 / " prefix) → aria-labelledby target → aria-label → id.
  IntersectionObserver `rootMargin: "-30% 0px -60% 0px"` so the
  "active section" band sits ~30 % from the top — matches where
  the eye rests under smooth scroll. No-ops on pages with fewer
  than two sections.
- **Scroll + cursor** (`src/components/islands/SmoothScroll.tsx`,
  `CustomCursor.tsx`): Lenis smooths the wheel with a plain expo ease-out; the
  playful ease-out-back *bounce* is reserved for click-to-section jumps via a
  global `window.tdsScrollTo` (used by the logo, hero CTAs, back-to-top, and a
  delegated in-page anchor-click handler). **On coarse-pointer (touch) devices
  Lenis is skipped** — it fights native momentum-scroll on iOS/Android — but
  `tdsScrollTo` + the anchor-click handler are still installed via a
  self-contained `requestAnimationFrame` tween that reuses the *same* bounce
  easing, so mobile section-jumps bounce exactly like desktop while normal
  touch scrolling stays fully native (the tween aborts on the first
  `touchstart`/`wheel`). Don't reinstate the old blanket `if (isCoarsePointer)
  return` early-out — it killed the bounce on mobile.
  `CustomCursor` is an additive dot +
  trailing ring that recolours from sampled background luminance and
  squash-stretches with pointer velocity — fine-pointer only, disabled under
  reduced motion. Both mount `client:idle`.
- **Favicon**: `public/favicon.png` (901 × 901) is the real TDS
  logomark, shared verbatim with tds-blog / admin / customer so the
  four properties read as one identity in browser tabs. Matches the
  header `public/images/logo.webp`.

## SEO + structured data

- **`src/lib/seo.ts`** is the single source of truth for org/person
  identity (name, email, founder, areaServed, full address, phone,
  vatID, socials, `geo` coordinates, `knowsAbout` keyword topics).
  These are the real verified values (they match the Impressum) and
  flow into the JSON-LD layer below.
- **Keyword strategy:** the home titles are keyword-first
  ("Digitalisierung für Unternehmen — Tracht Digital Solutions",
  ≤60 chars); the local qualifier (Schwarzenbek bei Hamburg) lives in
  the descriptions, schema `geo`/NAP, footer and body copy — not the
  title. Keep new page titles keyword-first + brand-second.
- **Footer NAP:** the footer renders `siteConfig.address.postalCode +
  addressLocality` ("21493 Schwarzenbek") hardcoded from `seo.ts`, NOT
  the CMS `contact.location` string — it must always match the
  Impressum and the JSON-LD PostalAddress (local-SEO NAP consistency).
  The street deliberately stays Impressum-only.
- **`src/lib/jsonld.ts`** renders Schema.org graphs
  (Organization+ProfessionalService with `geo` GeoCoordinates +
  `knowsAbout`, Person, WebSite, Service+OfferCatalog for `/preise`,
  BreadcrumbList). All entities share stable `@id`s
  (`tracht-digital.de/#organization`, `/#person`) so tds-blog can
  reference them by id instead of duplicating. Don't invent
  `openingHours` — there are no verified hours.
- **Sitemap** (`astro.config.mjs`) runs with an `i18n` option (emits
  hreflang alternates into the sitemap — safe only because every
  indexable route has an exact `/en/` twin; don't copy the option to
  the blog) and a `filter` that drops `/legal/` (noindex), `/og/` and
  the error pages.
- **`src/components/JsonLd.astro`** is the head-injected
  `<script type="application/ld+json">` utility — `<Layout
  jsonLd={...} />` passes through.
- **`src/og/render.ts` + `src/pages/og/default.png.ts`** — Satori
  pipeline mirroring tds-blog. Builds a static 1200×630 brand
  card at `/og/default.png` used as the fallback OG image. The card
  renders in Geist (`src/og/fonts/Geist-Medium.ttf`) — the OG headline
  dropped the former Instrument Serif when the brand retired the serif.
- **`public/robots.txt`** explicitly allows GPTBot, OAI-SearchBot,
  PerplexityBot, ClaudeBot, Google-Extended (etc.) and points
  at the sitemap.
- **`public/llms.txt`** is the llmstxt.org-convention markdown
  directory of services + pages for AI crawlers.

## Dark mode

- All four frontends share a `data-theme="dark"` theme. A no-flash
  inline script in `Layout.astro` sets `data-theme` on `<html>` from
  the `tds-theme` localStorage key (or the OS `prefers-color-scheme`
  fallback); the `ThemeToggle` island flips and persists it.
- Tokens live in `src/styles/global.css`. The structural tokens
  (`--color-primary`, `--color-black`, `--color-paper`, …) **flip**
  in dark mode so they read as foreground accents on a dark ground.
  Anything that must stay a fixed dark surface in both themes uses
  `--color-surface-navy` (brand navy panels/buttons),
  `--color-surface-accent` (burgundy, gradient end) or
  `--color-surface-ink` (footer). Elevated cards/glass use
  `--color-card` (white → dark), referenced via `color-mix()` for
  translucent glass so the light look is unchanged.
- The dark ground is a deliberate deep-navy family (not a warm black)
  with warm-ivory text — keep new dark surfaces in that family so the
  palette stays cohesive.

## Don't

- Don't add `output: "server"` — the production host has no Node runtime.
  This site MUST stay `output: "static"`.
- Don't loosen the exact `motion` pin back to a `^` range. CI installs with
  `npm install --no-package-lock`, so a caret range floats to whatever npm
  published that morning — an untested framer-motion lands straight in a
  production build. Bump `motion` deliberately: change the pinned version,
  build locally, and verify the Hero + ContactForm entrances (including
  with `prefers-reduced-motion: reduce` emulated) before releasing.
- Don't give a motion island an entrance variant whose *visible* state is
  empty. The SSR HTML bakes the `hidden` state (e.g. `opacity:0`) into the
  markup, so a reduced-motion branch like `{ hidden: {}, show: {} }` never
  clears it and the content stays invisible for reduced-motion users —
  that's how the contact form vanished. `show` must always target
  `{ opacity: 1, y: 0 }`; only the *transition* may collapse to
  `{ duration: 0 }` (see `ContactForm.tsx`).
- Don't add per-frontend brand tokens or duplicate the shared design CSS.
  Always edit `tds-shared/styles/base.css` (tokens, base) or `app.css`
  (shared chrome) and bump the version.
- Don't fetch the journal teaser at runtime. Build-time fetch in
  `index.astro` frontmatter so the rendered HTML ships static.
- Don't reintroduce the navy→burgundy `linear-gradient` pill buttons.
  Hero + Header CTAs are flat `bg-[var(--color-surface-navy)]` with
  `hover:bg-[var(--color-surface-accent)]`. The Consulting /
  PricingTeaser dark callout *blocks* keep their navy→burgundy
  gradient on purpose — that's a deliberate editorial card, not a
  button — and use the same `--color-surface-*` tokens.
- Don't use the *flipping* structural tokens (`--color-primary`,
  `--color-black`) as a fixed dark backdrop, or a `bg-white` surface
  on the page ground — both invert/break in dark mode. Use the fixed
  `--color-surface-navy/-accent/-ink` for brand-dark surfaces and
  `--color-card` (via `color-mix()` for glass) for elevated/glass
  surfaces. See "Dark mode" above and `src/styles/global.css`.
- Don't inline `text-xs font-medium tracking-widest uppercase` for
  section eyebrows. Use `.section-num` (with leading rule) for
  numbered chapter labels and `.eyebrow` for field labels.
- Don't bake a *fake* USt-IdNr into the JSON-LD layer — once Google
  + AI engines cache it, the wrong data sticks until they re-crawl.
  Street, phone and socials are real and already in `src/lib/seo.ts`;
  `vatID` is the one field to flip on there once a real one exists.
- Don't move the `@fontsource-variable/*` imports from `Layout.astro`
  into a CSS `@import` in `global.css`. `@tailwindcss/postcss` inlines
  CSS `@import`s without rebasing the packages' relative
  `url(./files/*.woff2)` references, so Vite never emits the font
  files — the build ships **zero** woff2 assets and every font 404s
  at runtime (shipped broken until 2026-07-07; all frontends silently
  rendered the system fallback). Font faces are imported as JS-style
  imports in the layout frontmatter, where Vite resolves and emits
  them with hashed URLs.
- Don't reintroduce `@tailwindcss/vite`. Astro 6 ships Vite 7 with
  the rolldown bundler, and the Vite plugin's build hook hits
  `oxcResolvePlugin` with an incomplete `BindingViteResolvePluginConfig`
  (withastro/astro#16542). Use `@tailwindcss/postcss` via
  `postcss.config.mjs` — same compiler, no rolldown contract.
- Don't hand-author the lightningcss `cssTarget` in `astro.config.mjs`.
  Spread the shared `tdsViteBuild` preset from
  `@tracht-digital-solutions/tds-shared/astro` into `vite.build`
  (as of the 2026-06-04 build refactor on tds-shared 0.4.0). It pins the
  Safari floor so lightningcss keeps the `-webkit-backdrop-filter` prefix
  on the frosted header; a hand-copied array drifts and the blur silently
  dies in Safari ≤17. See tds-shared#10.
- Don't read `translations.de` (or `.en`) directly from an .astro
  file. The `tFor(Astro.currentLocale)` helper is what makes the
  EN route actually render EN; bypassing it puts the file back
  into the "language toggle does nothing" pre-i18n era.
- Don't inline service titles, descriptions, or form copy in the
  `.astro` files. Editable copy lives in `tds-shared` so the same
  string ships to every front-end. Short-lived inlining is fine
  during prototyping — wrap it in a `TODO: promote to tds-shared`
  comment and fold it into the next 0.2.x bump (see
  `services.items` and `contact.form.*Placeholder` in 0.2.2).
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
