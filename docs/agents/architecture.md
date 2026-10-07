# Architecture

## Application shape

- Prefer `.astro` components; add a React island only for state, browser APIs or event-driven interaction.
- `src/layouts/Layout.astro` owns fonts, theme bootstrap, metadata, canonical/hreflang, optional JSON-LD and
  global islands.
- Locales: resolve copy with `resolveLang()` / `tFor()` and build internal links with `localizePath()`
  (`src/lib/i18n.ts`).

## Home page (`components/HomePage.astro`)

Used by both trees (`pages/index.astro`, `pages/en/index.astro` are wrappers). The order follows a visitor's
questions:

Hero → Leistungen (Webauftritt first, systems strip, assistant button) → Kundenprojekte
(`sections/CustomerCases.astro`) → Vorgehen (with the first-conversation card) → Beispielseiten und
Designstudien (`sections/Showcase.astro`) → compact Journal → Wieso ich? (with the qualifications teaser) →
Preise (`sections/Pricing.astro`, with the assistant's second button) → FAQ → Kontakt.

- The FAQ stays directly above the navy contact block.
- Removed for good (don't bring back): positioning band, pricing teaser with drawer, hero slider,
  TechMarquee, Currently. Portfolio stays hidden.
- **Client work and samples are separate sections.** Approved cases render on their service's detail page and
  in `CustomerCases` (badge "Kundenprojekt"); demos, design studies and the business card render in
  `Showcase` with an origin badge (`DEMO_ORIGINS`). No origin label may name a client, not even to deny one
  (`demos.test.ts`). `CustomerCases` renders nothing without a case; `Showcase` always has the business card.
- **One primary CTA per section**, "Erstgespräch vereinbaren" (hero, beside the process steps via
  `ui/FirstCall.astro`, the contact form); under the prices "Individuelle Lösungen – auf Anfrage".

## Hero (`sections/Hero.astro`)

- **The slogan and two buttons, nothing else.** The H1 is `footer.slogan` ("Digitale Lösungen, die passen."),
  read from the `footer` block (one source); button labels stay in `home_hero`. Eyebrow, sub, ctaNote and the
  trust card no longer render; their fields stay so stored blocks load.
- The page is written for businesses that **already have** a website or shop: taking over, repairing and
  maintaining it is the lead story.
- Copy and photo are server-rendered; only the decoration is an island (`islands/HeroDecor.tsx`, `client:idle`).
  **Nothing in the hero ships at `opacity: 0`** (an SSR start state once made the cookie notice the mobile
  LCP at 4.1 s). The entrance is a transform-only CSS rise under `prefers-reduced-motion: no-preference`.
- The photo is a `<picture>` whose source applies from `48rem`; phones get a 1×1 inline GIF.
- Decoration placement: see [design.md](design.md#hero-decoration).

## Services

- **The services section is an interactive list** (`ui/ServiceExplorer.astro`, `lib/serviceExplorer.ts`): an
  `<h3><button aria-expanded aria-controls>` per service (title + code-owned `tagline`) and its panel (photo,
  "Das mache ich" = `summary`, starting point, outcome, scope, "Details & Ablauf"). From 64rem titles left and
  one panel right (click, or hover with 140 ms intent); on a phone an accordion. Without JavaScript every panel
  shows (`hidden` is only set by the script; the desktop grid needs `[data-enhanced]`). `ServiceCard.astro`
  remains for related services.
- **Detail routes** `/leistungen/[slug]` and `/en/services/[slug]` resolve, in order: a service, a platform
  page, a retired slug (301), else 404. Each service has a code-owned `seoTitle` (search term first,
  "— Tracht Digital" last, ≤ 65 characters, distinct) and `updatedAt` (visible "Stand" and JSON-LD
  `dateModified`; raise it only when content changes).
- **Platform pages** (WooCommerce, Shopware 6, WordPress, TYPO3, STRATO) at `/leistungen/<system>` and
  `/en/services/<system>` are code-owned in `lib/platforms.ts`, rendered by
  `components/platforms/PlatformDetailPage.astro` from the `components/detail/` bands. One page per system
  with anchored offer sections. Rules (`platforms.test.ts`): no amount (the cost box links to `/#preise`; no
  JSON-LD `offers`); an answer-first paragraph naming Tracht Digital Solutions, Julian Tracht and Schwarzenbek;
  question headings; a comparison table linking sources with a "Stand" date; "Unabhängig, kein offizieller
  Partner"; no manufacturer logos; only `disclosure: "named"` cases listing the platform
  (`referencesForPlatform`); re-check facts and raise `updatedAt` when one changes.

## Leistungsassistent (button + dialog)

`components/ServiceAssistant.astro` renders one native `<dialog id="leistungsassistent">` around
`islands/ServiceFinder.tsx`; questions, weights and copy live in `lib/serviceFinder.ts`.

- Ways in: a navy card with a compass (`ui/AssistantCard.astro`) under the services list and, compact, under the
  prices. Cards marked `[data-assistant-open]` ship `hidden` until `showModal` exists. `/#leistungsassistent`
  and the old `/#leistungsfinder` open it directly.
- Focus returns to the opener, except after a same-page link or the hand-off to the contact form.
- The island is `client:idle` (a closed dialog never becomes visible, so `client:visible` would never hydrate,
  and "Weiter" before hydration would submit natively).
- It asks topic, recognised starting points and stage, and recommends one or more services with the visitor's
  answers as the reason and the price (Webauftritt: "Festpreise ab" the lowest package; others "auf Anfrage").
  Never empty, never an estimate or range. `SERVICE_ORDER` breaks ties.
- Starting points are the services' `situations`, resolved on the server; the island never imports the catalog.
- It sends nothing: the result becomes a draft in the contact form (`lib/contactDraft.ts`: sessionStorage for a
  later-hydrating form, an event for a live one), never replacing typed text.

## Contact form

- A reason dropdown above the message posts as `subject` (declared in tds-shared's `ContactSchema`, because
  `zodResolver` forwards only known keys). Reasons come from `contact.reasons` and ship committed. Optional on
  purpose.
- The closed dropdown wears the text fields' class (`fieldClass` + `.contact-select`); only the open list keeps
  its frosted `::picker(select)`.
- The message field is guided by an element tied with `aria-describedby` (not a placeholder).
- The four "what happens next" points are the confirmation's content. `ui/FirstCall.astro` keeps its `contact`
  variant for stored blocks but has no caller on the home page.
- `contactForm.test.ts` holds all of this. The form uses `src/lib/connection.ts`.

## Prices (`#preise`, `sections/Pricing.astro`)

"Festpreise" with a Netto/Brutto switch, "So entsteht dein Preis", then "Individuelle Lösungen – auf Anfrage".

- **No hourly rates anywhere** (price list, service price box, assistant, JSON-LD, `/llms.txt`). The rate fields
  are gone from `PricingContent`; `pricing.test.ts`, `llmsTxt.test.ts` and `serviceFinder.test.ts` fail on
  "Stunde" / "hour".
- **Three fixed-price packages** in `lib/pricing.ts` (net): Website-Check 390 €, Website-Optimierung 780 €,
  Onepager 1.040 €. `seo.test.ts` holds "ab 390 €" in the meta description. A valid
  `pricing_services.packages` list in the panel replaces them as a whole; an empty or broken one falls back.
- **Net/gross** (`PricingList.astro`): prices render net with `data-gross` (`grossPrice()`, `VAT_RATE` 0.19);
  the switch ships `hidden`, remembers `tds-price-mode` in localStorage and counts figures over with Motion. On a
  phone the packages are a snap row, focusable only while it overflows.
- Redirects: `/preise`, `/en/preise`, `/en/pricing` → 301 to `#preise`; `/kontakt`, `/en/contact` → 301 to
  `#contact`. Alias anchor `pricing-teaser` stays. Redirects stay out of the sitemap and `alwaysPaths`.
  `src/lib/routes.test.ts` holds the targets.

## Standalone pages

- **Qualifications** `/qualifikationen`, `/en/qualifications` (`components/CredentialsPage.astro`): thirteen
  LinkedIn Learning paths shown as the rendered PDF (`object-fit: contain`, never cropped). Catalog, priority
  and groups are decided once in `lib/credentials.ts`; titles aren't translated. **The sentence under the lead
  stays** (learning paths, not vendor exams or a degree; `credentials.test.ts`). `sections/About.astro` teases
  the first three in code, not via `cmsFor("why_me", …)`. `npm run certificates:render` rebuilds the images.
- **Digital business card** `/visitenkarte`, `/en/business-card` (`components/BusinessCardPage.astro`): the one
  `bare` route (no header, footer, floating CTA, cursor, scroll bar or live chat), reached by a phone camera.
  It draws a link hub, a language switch, a theme switch and **its own legal links**
  (`src/lib/businessCard.test.ts`).
  - Rows come from `businessCardLinks()` (`lib/businessCard.ts`) using `siteConfig`, so the card can't drift
    from the Impressum. No postal address (matching `kontakt.vcf.ts`).
  - On wide screens with a mouse the card is docked on the contact section's right edge; its tab slides out on a
    spring within 160 px of the pointer (`lib/motion/businessCard.ts`, closes beyond 240 px), on hover and on
    focus (the latter two also via CSS). The section is `overflow-x: clip` there.
  - The contact section links to it as a drawn **mini card** (`.mini-card` in `sections/Contact.astro`): drawn
    from `--color-paper`, `--color-primary` and `--color-accent` only (`.tds-tone-navy` remaps the other tokens
    for dark grounds); muted text mixed at a measured 75 %; the QR via `BUSINESS_CARD_QR_PATH` on a white plate;
    one anchor with an `aria-label` (`miniBusinessCard.test.ts`).
  - It renders no CMS block, so it is only in `alwaysPaths`, not `cache.ts#contentPages`.
  - `npm run businesscard:sync` recaptures the showcase tile after visual changes.

## SSR, page cache and deployment

`src/middleware.ts` wraps responses with the shared page cache. On production `public/.htaccess` serves a
stored file before Passenger reaches Node; a miss renders once and stores the response. **No personalised,
cookie-, session- or `Accept-Language`-dependent content on a cached route.**

- `src/lib/cache.ts` maps CMS and blog events to affected URLs and lists `alwaysPaths` for a cold rebuild.
- `src/lib/pageCache.ts` owns the cache instance and invalidates the generation-scoped content memo first.
- `/tds/cache/{status,rebuild,purge}` is the token-gated control plane.
- A shared block affecting service, pricing and home pages must map to all of them. A new public route updates
  event mapping, `alwaysPaths`, sitemap data and tests in the same change.
- `npm run build` emits server and client output and assembles `release/`. Keep the Node adapter, `app.cjs`, the
  release verifier and first-party bundling via `vite.ssr.noExternal`.
- **Every production deploy restarts Node**; otherwise uncached routes 500 from replaced server chunks.
- `.htaccess` compresses responses.
- Credentials: `TDS_SITE_KEY` and `TDS_CACHE_TOKEN` are server-only; never `PUBLIC_*`. Content failures may fall
  back to committed content, but a rejected configured site key must surface through the guard.

## Performance decisions

- **Stylesheets are inlined** (`build.inlineStylesheets: "always"`): with `"auto"` nothing was inlined and the
  home page waited on three render-blocking requests (mobile LCP 3.6 s → 2.6 s). Measure through compression
  before switching back.
- **Nothing in the shared chrome hydrates at `client:load`.** `ThemeToggle` and `SmoothScroll` are `client:idle`
  and the logo is a pre-sized lossless WebP (`LOGO` in `lib/imageVariants.ts`).
- Republished screenshots carry a content hash (`scripts/media-versions.mjs` → `virtual:media-versions`;
  `mediaSrc()` appends `?v=<hash>`), because those paths are cached for a week.
