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

Hero → Leistungen (five product tiles with the assistant as sixth tile) → Projekte und Referenzen
(`sections/ProjectReferences.astro`) → Zeitersparnis (`sections/TimeSavings.astro`) → Vorgehen (with the first-conversation card) → compact Journal → Wieso ich? (with the qualifications teaser) →
Preise (`sections/Pricing.astro`, with the assistant's second button) → FAQ → Kontakt.

- The FAQ stays directly above the navy contact block.
- Removed for good (don't bring back): positioning band, pricing teaser with drawer, hero slider,
  TechMarquee, Currently. Portfolio stays hidden.
- **Client work and samples share one section, told apart by badges** (2026-11-02). `ProjectReferences` shows six
  tiles (three on a phone, `selectHomeProjects` in `lib/projects.ts`): cases with the badge "Kundenprojekt", then
  samples with an origin badge (`DEMO_ORIGINS`). "Mehr Projekte" leads to `/projekte`, `/en/projects`
  (`components/ProjectsPage.astro`), every tile in four groups. No origin label may name a client, not even to
  deny one (`demos.test.ts`). The heading is code-owned: a stored `references_home` headline says "für Kunden".
- **Seams between sections** are `ui/SectionSeam.astro` elements in `HomePage.astro` (content width, faded
  ends, the small brand bar in the middle), not borders on the sections. None under the hero or above the navy
  contact block; two in a row collapse to one.
- **Own projects** (`lib/ownProjects.ts`, `ui/OwnProjectCard.astro`) carry the badge "Eigenes Projekt" and never go
  into `references.ts`.
- `references_home` no longer renders on the home page; the block stays in the content shape so it keeps loading.
- **Vorgehen is a horizontal stepper** (`sections/Process.astro`, 2026-10-11): only the step titles, side by side
  on one rail from 48rem, each a `<button aria-expanded aria-controls>`; the open step's card shows under the row
  with a notch at its step (hover with 140 ms intent, focus, tap, arrow keys). Without JavaScript every panel
  shows; on a phone it is an accordion. No lead sentence and no `FirstCall` card any more: step 01's card carries
  "Erstgespräch vereinbaren" to `#contact`.
- **One primary CTA per section**, "Erstgespräch vereinbaren" (hero, in the first process step, the contact
  form); under the prices "Individuelle Lösungen – auf Anfrage" with the price calculator's button beside it.
- **Not rendered, fields kept** (2026-10-11) so stored blocks load: `pricing.sub`, package `description` (still in
  the JSON-LD offers), `servicesOverview.intro`, the explorer's `tagline`, the showcase `intro`, `process.body`,
  the `why_me` reasons' `description`, `footer.tagline`.

- **Zeitersparnis** (2026-11-03, questionnaire since 0.97.0): three questions with fixed answers (radios, no
  number fields) in `lib/savingsCalculator.ts`; each answer stands for a mid value, × 46 working weeks. The
  estimate (hours per year, working days) shows once all three are answered; it is labelled a rough estimate,
  never a promise. "Erstgespräch vereinbaren" hands the chosen answers over as a `contactDraft`.
  Since 2026-11-03: no lead sentence and no question numbers; each question has an icon disc in a brand colour
  (coral, gold, periwinkle), an unchosen answer is a pressed-in well like the contact fields, the chosen one is
  filled in its question's colour. Since 0.101.0 the card is light (`--lp-surface-card`), each question a row
  tinted in its colour, and the result a rosé plate with a donut chart (SVG ring, `stroke-dasharray`, no
  gradient): the hours saved as a slice of one working year (`WORK_YEAR_HOURS`, 46 × 40 h), the working days
  saved in its middle, saved and remaining hours in a legend (0.101.1, asked for). `savings()` returns
  `yearShare` and `rest` for it.
- **Vorgehen** (0.97.0): the step title sits in the navy head. From 40rem all four steps show; on a phone
  the heads are buttons of an accordion, one open at a time (`hidden` only set by the script; on desktop the
  heads are disabled buttons, no tab stop). No "Schritt n" label; an arrow points from step to step (right in
  the row, down when stacked); the outcome "Ergebnis: …" is the card's footer behind a 1px rule.
- **Blog für Betriebe** (0.97.0): without a curated `journal` block the newest 24 posts are ranked by
  `lib/journalRelevance.ts` (business categories and keywords), not by date alone.

## Hero (`sections/Hero.astro`)

- **The slogan and two buttons, nothing else.** The H1 is `footer.slogan` ("Digitale Lösungen, die passen."),
  read from the `footer` block (one source); button labels stay in `home_hero`. Eyebrow, sub, ctaNote and the
  trust card no longer render; their fields stay so stored blocks load.
- The page is written for businesses that **already have** a website or shop: taking over, repairing and
  maintaining it is the lead story.
- The copy is server-rendered. The hero has no background of its own since 2026-11-03 (no photo, no shapes):
  the page ground's 3D shapes show through and lean toward the pointer there (`lib/motion/groundScroll.ts`).
  No React on a page unless a visitor needs it: see "Page chrome without React" below.
  **Nothing in the hero ships at `opacity: 0`** (an SSR start state once made the cookie notice the mobile
  LCP at 4.1 s). The entrance is a transform-only CSS rise under `prefers-reduced-motion: no-preference`.
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

- Way in: the last tile of the services row (`ui/AssistantCard.astro`). Questions and results follow the Shop's categories and
  products (`lib/serviceFinder.ts`); a new Shop product it should recommend is added there. Cards marked `[data-assistant-open]` ship `hidden` until `showModal` exists. `/#leistungsassistent`
  and the old `/#leistungsfinder` open it directly.
- Focus returns to the opener, except after a same-page link or the hand-off to the contact form.
- The island is `client:idle` (a closed dialog never becomes visible, so `client:visible` would never hydrate,
  and "Weiter" before hydration would submit natively).
- It asks topic, recognised starting points and stage, and recommends one or more services with the visitor's
  answers as the reason and the price (Webauftritt: "Festpreise ab" the lowest package; others "auf Anfrage").
  Never empty, never a price estimate or range. `SERVICE_ORDER` breaks ties.
- Each recommended product shows an estimated time saved as a band (`savingsLevel`: low < 1 h, medium
  1–5 h, high > 5 h a month), with the note that it is a rough estimate, not a promise.
- Starting points are the services' `situations`, resolved on the server; the island never imports the catalog.
- It sends nothing: the result becomes a draft in the contact form (`lib/contactDraft.ts`: sessionStorage for a
  later-hydrating form, an event for a live one), never replacing typed text.

## Contact form

- **A three-step stepper** (0.97.0): Kontaktdaten → Anliegen → Nachricht, one step at a time with a
  progress row; "Weiter" validates the step's fields, a failed submit jumps to the first step with an error.
  "Weiter" and "Senden" carry distinct React keys, or React reuses the element and submits on "Weiter".
  The progress row is one track with three stops that fills up to the current step; the last step opens
  with a summary of everything entered so far, each line with "Ändern" back to its step.
- **Phone numbers** (2026-11-03): `siteConfig.telephone` is the landline +49 4151 8788264 (JSON-LD, card,
  vCard, Impressum); `siteConfig.mobile` / the CMS `contact.phone` is the mobile for WhatsApp and emergencies.
  The landline shows a desk telephone, the mobile a handset (`ui/PhoneIcon.astro`), in the card and the footer;
  the footer gives each number its own row, without "(mobil)".
  A complete, valid field is filled periwinkle (`[data-filled]`), like the ticked emergency row but not pink.
- A reason dropdown above the message posts as `subject` (declared in tds-shared's `ContactSchema`, because
  `zodResolver` forwards only known keys). Reasons come from `contact.reasons` and ship committed. Optional on
  purpose.
- Layout (2026-10-11): name/e-mail and company/reason are pairs (`.contact-form-pair`, two columns from 40rem);
  every field is a rounded, pressed-in dark well with no underline; the send button is a solid pink pill.
  Since 2026-10-12 form and contacts are **one card** (`.contact-panel`, lifted navy, hard coral offset), side by
  side from `lg` with a vertical 1px seam (horizontal when stacked). `contact.sub` is no longer rendered.
  From `lg` the message field grows to fill the form column down to the contacts' height (every wrapper
  between the column and the form, `<astro-island>` included, is a flex column).
- The closed dropdown wears the text fields' class (`fieldClass` + `.contact-select`); only the open list keeps
  its frosted `::picker(select)`.
- The message field is guided by an element tied with `aria-describedby` (not a placeholder).
- The four "what happens next" points are the confirmation's content. `ui/FirstCall.astro` keeps its `contact`
  variant for stored blocks but has no caller on the home page.
- **Emergencies** (2026-10-11): an "Auch für Notfälle" badge beside the phone number and a "Notfall" checkbox in the form. The "Notfall?" row across the top of the card was removed in 0.101.0 (asked for). The checkbox is local state, not a form
  field (`ContactSchema` has no such key and zodResolver drops unknown ones): ticked, the request goes out with
  `subject` = "Notfall – <reason>" (max 200). Copy in `lib/contactCopy.ts`.
- The card's grid (2026-11-03): the emergency row on top; the form and "Direkt erreichbar" (e-mail, landline,
  mobile, then "Messenger und Profile") side by side from `lg`; one row across the bottom (`.contact-foot`) with
  the map (`ui/PlaceBubble.astro` with `inline`: the drawn map, the live OSM map over it from the first hover,
  focus or tap), the town (no postal code, `contactForm.test.ts`) and the business card and .vcf buttons. The map
  moved out of the right column because the stepper left a large empty field beside it. The footer uses the same component as a
  bubble behind "21493 Schwarzenbek". Leaflet's CSS is imported `?inline` (`lib/placeMap.ts`): a dynamic CSS
  chunk is never emitted under `inlineStylesheets: "always"` and 404'd.
- **Footer contact** shows an icon per line, no labels (2026-10-12); "21493 Schwarzenbek" is a button that opens a
  bubble (hover, focus, tap; Escape closes). The first open loads Leaflet and **OpenStreetMap tiles**
  (`lib/placeMap.ts`, asked for on hover without a consent step; the privacy policy names it under "Externe
  Dienste" — an edited policy in the CMS needs the same paragraph). Draggable and zoomable, a pin on Schwarzenbek,
  the dashed area reaching Bergedorf. The drawn `ui/PlaceMap.astro` stays underneath as the no-JS picture.
- `contactForm.test.ts` holds all of this. The form uses `src/lib/connection.ts`.

## Prices (`#preise`, `sections/Pricing.astro`)

"Webseitenpreise zum Festpreis" with a Netto/Brutto switch, then "Individuelle Lösungen – auf Anfrage" with the
request button and the price calculator's button (slot `cta-actions` in `PricingList.astro`). No sub under the
heading, no description on the package cards (2026-10-11). "So entsteht dein Preis" (`pricing_logic`) no longer renders; its content stays so a
stored block loads, and the notes box renders only with notes.

- **Price calculator** (`components/PriceCalculator.astro`, native `<dialog id="preisrechner">`, plain script):
  it only ADDS the packages the cards show (same `getPricingContent` list) and lists code-owned extras (shop,
  language, panel, care) as "individuelles Angebot" — no other figure, no estimate or range. It follows and
  sets `tds-price-mode`. "Mit dieser Auswahl anfragen" hands the selection to the form via `contactDraft`
  (`service: "web-presence"`), sends nothing. The trigger (`[data-calc-open]`) ships `hidden`.

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
  the first three in code, not via `cmsFor("why_me", …)`. Above the motivation it shows two code-owned facts
  (`lib/aboutFacts.ts`), each a one-word heading and a figure that counts up on scroll-in: years of programming
  COMPUTED from `founder.codingSince` (2018) and self-employed since `foundingYear` (2024, counted up from 2018;
  also the Organization's `foundingDate`). The `why_me.reasons` tiles are no longer rendered (2026-10-12). `npm run certificates:render` rebuilds the images.
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
- **Page chrome without React (2026-10-22).** Theme toggle and consent link are `tds-shared/dom` markup; smooth
  scroll, cursor and reading progress are modules started at idle by `lib/chrome.ts`. The consent banner and chat
  use `client:when` (`consent`, `chat:…`), the service finder `client:when="intent:[data-assistant-open]"` (hover,
  focus or press of an opener). Don't add a React island to every page; the contact form is `client:visible`.
  The logo is a pre-sized lossless WebP (`LOGO` in `lib/imageVariants.ts`).
- Republished screenshots carry a content hash (`scripts/media-versions.mjs` → `virtual:media-versions`;
  `mediaSrc()` appends `?v=<hash>`), because those paths are cached for a week.

## Services and prices (2026-11-02)

- The home page shows the most important services as products (`lib/serviceProducts.ts`) and states no amount. The Pricing section, its calculator and the `pricingSchema` call are gone; `/preise` and its twins 301 to the Shop.
- "Alle Leistungen" leads to the shop's `?art=own`. A tile links to its product page only when the API lists the slug; otherwise to that filtered list.
- The shop's "Angebot anfordern" arrives as `?anfrage=` (`lib/quoteRequest.ts`) and becomes a draft in the contact form. It never changes what the server renders.
- `/bildrechte` is where every image's `license` points (tds-shared `imageRights`).
