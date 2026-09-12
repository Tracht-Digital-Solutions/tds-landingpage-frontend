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
- **The home page is `components/HomePage.astro`**, for both language trees;
  `pages/index.astro` and `pages/en/index.astro` are wrappers. Since the 2026-09
  redesign its order follows the questions a visitor has, in sequence:
  Hero (benefit + trust card) → Wieso ich? → Leistungen → Kundenprojekte
  (`sections/CustomerCases.astro`) → Vorgehen (with the first-conversation card)
  → Beispielseiten (`sections/Showcase.astro`) → compact Journal → Preise
  (`sections/Pricing.astro`) → FAQ → Kontakt. The positioning band, the pricing
  teaser with its drawer and the hero slider were removed, not unmounted; do not
  bring them back. The old TechMarquee and Currently sections do not belong on
  the home page, and Portfolio stays hidden.
- **Client work and samples are separate sections.** Approved reference cases
  render on the detail page of each service they belong to and in
  `CustomerCases` (badge "Kundenprojekt"); the demos and the business card
  render in `Showcase`, each with an origin badge (`DEMO_ORIGINS`: "Demo ·
  fiktives Beispiel" / "Eigenes Projekt"). They shared one carousel until
  2026-09 and nothing on a card told a client's project from a fictional demo
  — do not merge them again. `CustomerCases` renders nothing without a case;
  `Showcase` always has at least the business card.
- **One primary call to action per section**, "Erstgespräch vereinbaren": in
  the hero, beside the process steps (`ui/FirstCall.astro`), under the prices,
  and the contact form itself. The floating CTA (`FloatingCta.astro`) stands
  down while `#hero` or `#contact` is on screen, and on short viewports while
  the cookie notice is open; it publishes `--lp-floating-lane` so
  `scroll-padding-bottom` keeps focused elements above it.
- **The hero is `sections/Hero.astro` — server-rendered, no island.**
  - The eyebrow names the audience, the H1 the benefit, the sub (`#hero-sub`)
    the problems and the outcome, followed by two real anchors, one of them
    primary. The brand motto no longer leads the hero; it said nothing a
    visitor could check.
  - The right column is a trust card with at most THREE checkable facts
    (`home_trust`, `resolveTrustFacts` in `lib/homeContent.ts`): name and town
    from `siteConfig`, the lowest rate from the pricing block, each linking to
    the section that proves it. The cases fact drops out when no case is
    published. No unverifiable claims, logos or counters there.
  - Nothing in the hero may ship at `opacity: 0`. The former React island
    rendered its copy with motion's start state in the SSR markup, so the most
    important screen was blank until hydration and the cookie notice became the
    mobile LCP element (4.1 s on the live site). The entrance is a
    transform-only CSS rise, opt-in under `prefers-reduced-motion:
    no-preference`.
  - There is no showcase slider any more: it auto-rotated, put a demo's title
    in the page's first `<h2>` and gave real cases and fictional demos the same
    card.
  - Decoration lives only in the hero's negative space (lower left, lower
    right), never behind the copy, the trust card or the fixed header;
    `npm run audit:ux` measures the overlap. The navy capsule, the bordeaux
    quarter and the conduit start at `xl`: at 768 and 1024 px the actions and
    the trust card reach down into exactly that space (measured).
  - The photo is a `<picture>` whose source applies from `48rem`; phones get a
    1×1 inline GIF and download nothing (the old `<img class="hidden md:block">`
    cost every phone 60 KB it never showed).
- **Stylesheets are inlined** (`build.inlineStylesheets: "always"`). With
  `"auto"` every stylesheet was larger than Vite's 4 KB limit, so nothing was
  inlined and the home page waited on three render-blocking CSS requests.
  Measured 2026-09-12 with Lighthouse on mobile: LCP 3.6 s → 2.6 s, performance
  84 → 95. Each document now carries its CSS (about 40 KB brotli); do not
  switch back without measuring. Measure through compression: `astro preview`
  sends none, and an uncompressed run charges seconds the host never pays.
- Public service detail routes are `/leistungen/[slug]` and
  `/en/services/[slug]`. Route IDs and localized slugs are code-owned; never
  accept a slug or href from CMS content.
- **The digital business card is a STANDALONE page** — `/visitenkarte` and
  `/en/business-card`, both five-line wrappers around
  `components/BusinessCardPage.astro`. It is the one route that renders
  `bare`: no Header, no Footer, no FloatingCta, no cursor, no scroll bar, no
  live-chat widget. It is reached by a phone camera pointed at a printed code,
  not by browsing, so the site's navigation chrome answers a question the
  visitor did not ask and the floating CTA covers the first link. What the page
  draws instead is a link hub — portrait, the vCard action, a stack of contact
  and reference rows, the QR code — plus the three things a page with no chrome
  still owes a visitor: a language switch, a theme switch and the legal links.
  Those legal links are **not decoration**: with the site footer gone this page
  is the only one that has to draw its own Impressum, and
  `src/lib/businessCard.test.ts` fails if they disappear. Do not reintroduce
  Header/Footer here, and do not fork more of them than that strip.
  - The rows live in `businessCardLinks()` (`lib/businessCard.ts`), not in the
    component: contact values come from `siteConfig`, like the vCard and the
    JSON-LD, so the card cannot drift from the Impressum. The postal address
    stays off it, matching `kontakt.vcf.ts`. Row ids key the icons and the
    tests, so they carry no copy.
  - It renders **no CMS block at all**, which is why it is not in
    `cache.ts#contentPages` — only in `alwaysPaths`. A block save must not
    rebuild it.
  - `scripts/business-card-sync.ts` captures the screenshot the showcase tile
    shows. Re-run it (`npm run businesscard:sync`) after changing how the page
    looks, or the tile advertises the old design.
- **Prices are the home section `#preise`** (`sections/Pricing.astro`): all
  four rates, what each includes, and "So entsteht Ihr Preis" — visible without
  a click. `/preise`, `/en/preise` and `/en/pricing` answer with a 301 to it;
  `/kontakt` and `/en/contact` with a 301 to `#contact`. The section keeps an
  alias anchor `pricing-teaser` for old deep links. Redirects stay out of the
  sitemap and out of `alwaysPaths` (the page cache only stores 200 responses).
  `src/lib/routes.test.ts` holds the targets. Legal routes stay outside the
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

A service `summary` is the detail page's lead, its `<meta name="description">`
and the price card's text. Keep overrides between 80 and 160 characters — a
shorter one silently degrades an indexable page's description, and only the
committed defaults are covered by tests. The home page's service tile does not
show it: it shows `situations[0]` (typical starting point), `outcomes[0]`
(result), the keywords (scope) and a next step, and its link is the title,
stretched over the tile.

The redesigned page-level blocks are `home_hero`, `why_me`,
`services_overview`, `digital_responsibility`, `pricing_services` and `faq_v2`.
Since the 2026-09 redesign `digital_responsibility`, `why_me.reasons` and
`home_hero.scrollHint` have no renderer (kept so stored blocks keep loading),
and three blocks were added with no Website-CMS schema yet — `home_trust`,
`first_call`, `pricing_logic` — which fall back to `lib/homeContent.ts` the way
`references_home` and `website_demos` do.

**Copy rules held by `homeContent.test.ts`** — Julian's decisions, not style:
no free and no time-boxed first conversation ("kostenlos", "kostenfrei",
"gratis", minutes); the one sentence about its cost is "Kosten entstehen erst,
wenn wir einen Auftrag vereinbaren."; no project price ranges, only the cost
logic.
The flat pricing block owns the page/teaser copy, four numeric hourly rates,
notes and CTA. Every service has a rate, so there is no custom-rate label and
no highlighted card any more. Legacy `hero`, `about`, `services`,
`consulting`, `pricing` and `faq` rows remain readable in the editor for stored
content but have no active home/pricing renderer; do not wire them back. The
`tech` and `portfolio` blocks were removed from the CMS schema together with
their renderers — any stored rows are inert and must not be reintroduced.

The four service blocks are:

- `service_consulting`
- `service_process`
- `service_solutions`
- `service_web_presence` — websites, online shops AND marketing

Contract development was folded into Individuelle Lösungen, marketing into
Webauftritt, and Komplette IT was withdrawn. Their retired URLs answer with a
301 from `retiredServiceTargets` in `src/lib/services.ts`; do not turn those
back into 404s and do not reuse a retired slug for a new service.

Each block exposes `label`, `title`, `summary`, `intro`; titled lists for
`situations`, `responsibilities`, `outcomes`, `boundaries` and `process`;
`priceLabel`/`priceText`; `referencesLabel`/`referencesHeadline`; references
with `title`, `context`, `challenge`, `solution`, `result` and optional
`metric`; and `ctaTitle`, `ctaText`, `ctaButton`. Do not add editable IDs,
slugs or URLs — never render placeholders or invent customer names, quotes,
screenshots, metrics or outcomes.

The published cases themselves live in `src/lib/references.ts`, code-owned like
`demoCatalog.ts`, because a card links to a service page, to a journal article
and — on a named case — to the customer's own site, and the CMS must not name a
destination. `ServiceReference.articleUrl` and `.siteUrl` are therefore
**unreachable from the CMS**: `validateServiceReferences` rebuilds each item
field by field and never copies them, and `mergeReferences` strips both off the
override before restoring them from the committed case.
`resolveServiceContent` resolves three distinct states, and the third is easy
to break:

- no `references` key, or a malformed list ⇒ the committed cases render;
- a valid non-empty list ⇒ it overrides the TEXT position by position, links
  unchanged, extra entries kept without links;
- an **explicitly empty array** ⇒ the whole section disappears. This is the way
  to pull a reference off the site without a deploy. It is detected by the key
  being present, not by the validated result being empty — a length check would
  silently take the ability away now that a committed base exists.

Reference copy is **anonymised by default**: no customer name, no link to a
customer's own site. A case may be published under a customer's name only with
that customer's approval, and it must then be marked `disclosure: "named"` and
carry their address in `siteUrl`. `references.test.ts` enforces the whole rule,
because every part of it is a standing instruction a string edit could
otherwise undo unnoticed: an anonymous case is grepped for customer vocabulary,
no case may carry a URL in its prose, `disclosure` and `siteUrl` must agree in
**both** directions, and a `siteUrl` may not point at any origin of ours.

While a named case is published, no surface may still promise that references
appear anonymised without exception — that sentence lives in `homeContent.ts`
(`referencesHome.label`) **and twelve times in `services.ts`**
(`referencesLabel`, four services × two languages), rendered directly above the
cards. A test ties the copy to the catalog so the promise and the cards cannot
drift apart.

Two asymmetries to know before hunting for them:

- `sections/References.astro` reads `referenceCases` directly, not
  `resolveServiceContent`. The empty-array off-switch below therefore does
  **not** reach the home page: removing a named customer from there is a code
  change and a deploy.
- `mergeReferences` maps over the CMS list, so a stored `references` array
  shorter than the committed list hides committed cases on that service page
  while the home page still shows them. Check the stored block when adding a
  case.

The home section's framing is the `references_home` block, defaulting to
`homeContent.ts`. Like `website_demos` it has no Website-CMS schema yet and
falls back cleanly until it does; `block` cache events already rebuild the home
and service pages for any block id, so no event mapping was added for it.

Home cards, pricing and detail pages resolve from one service catalog/default;
DE and EN are edited separately. Change fallbacks, the Website-CMS
structured schema, validation tests and renderers together.

The contact form and public runtime connection use `src/lib/connection.ts`.
`TDS_SITE_KEY` and `TDS_CACHE_TOKEN` are server-only credentials; never rename
them to `PUBLIC_*`. Public variables are browser-visible or compiled into the
bundle. Content/API failures may fall back to committed content, but a rejected
configured site key must be surfaced by the existing guard.

## Website demos

The demo sites (`demo1`…`demo5.tracht-digital.de`, plus `shop`) render on the
home page through `sections/Showcase.astro` and on the Webauftritt service page
through `sections/WebsiteDemos.astro`. Three files own them and the split is
load-bearing:

- `src/lib/demoCatalog.ts` — id, order, host, URL and genre. Code-owned like
  `ServiceDefinition.slug`; the CMS must never name a host this site sends a
  visitor to. Imported by the sync script, so it has no other imports — not
  even a type-only one.
  - **`shop.tracht-digital.de` went in before it had a site, and that worked.**
    While the host served the panel's placeholder the sync recorded it as
    `placeholder` and no card rendered; `tds-shop-frontend` is deployed now and
    a sync turned it into a card — as TDShop — with no code change. Keep the
    pattern for the next host: a catalog entry ahead of its site is not dead
    weight, it is what the availability check is for.
  - **A demo's URL is not always its bare host.** `demo2`'s root is a 330-byte
    language gate — one link, no heading — which the sync rejects as a
    placeholder, correctly, because that is what the root serves. Its entry
    points at `/de/`. A demo that gates its own front door is linked past the
    gate.
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

Everything a visitor reads on a demo card came from that demo, with **two
exceptions**. `DemoDefinition.origin` is the badge on the screenshot that says
whose site it is — "Demo · fiktives Beispiel", or "Eigenes Projekt" for the
shop, which is a real site of ours and not a fiction; its vocabulary is closed
too and may never say "Kunde"/"client". And `DemoDefinition.kind`, the genre
etiquette above the title.
It is code-owned, its vocabulary is closed (`DEMO_KINDS`: Webseite ·
Landingpage · Onlineshop) and `demos.test.ts` holds it shut. The exception is
narrow on purpose — it applies to our OWN demos, it names the genre and never
the subject ("Onlineshop", not "Streetwear-Shop"), and it exists because a
visitor scanning the shelf wants to know which of these is a shop and which is
a page. Adding a label means adding it to the vocabulary, in both languages,
deliberately. Everything else still comes from the demo: `homeContent.ts` owns
only the section's own framing, overridable through the `website_demos` block
(no Website-CMS schema yet; falls back cleanly until there is one). Never write
a description for someone's site — a demo without a meta description simply
shows none.

The card is **not a wrapper `<a>` any more**. It carries a magnifier that opens
the full 1440 × 900 capture in `ui/PreviewLightbox.astro`, and a `<button>`
inside an `<a>` is invalid. The full-card hit area, the hover response and the
focus ring are the invariant and all survive; the anchor was only how they used
to be provided. The lightbox is one native `<dialog>` per section — Escape, the
focus trap and the inert background come from the platform — and the magnifiers
ship `hidden`, revealed only once the script has confirmed `showModal`.
`previewLightbox.test.ts` guards the nesting, the stretched link, the focus
ring, the hidden default and the focus restore.

**Every card on the shelf ends in the same footer bar**, `ui/CardActions.astro`
— a tinted strip bound edge to edge across the bottom of the card, with the
same 1px seam a screenshot band has. It carries exactly **two links**: the
service the card is evidence for, and the card's own destination ("Demo
ansehen", "Mehr erfahren", "Webseite ansehen").

Three rules hold it together, and each is silent when broken:

- The bar is a **sibling of the card body**, never inside it — inside, it
  inherits the body's padding and stops being bound to the card.
- The **call to action carries the stretched `::after`**, so the card keeps its
  full-area hit target; the card root must therefore be `position: relative`.
  The service link is lifted above that layer with `z-index`, exactly as the
  magnifier is. Without that lift it renders, hovers, and silently opens the
  card's other destination.
- No card may wrap the bar in an `<a>`. `BusinessCardTile` was one wrapping
  anchor until it gained a second link; a nested anchor is invalid and browsers
  recover by closing the outer one early.

The service link is a **prop, not a lookup**: on the Webauftritt detail page the
demos and the business card already sit on their service, and there it is
`null`. `cardActions.test.ts` guards the geometry, that absence, and that a
reference card never repeats its primary service as a badge.

On the home page the shelf gives **two tracks to its lead card**, the first
demo. Both card families answer the extra width through a container query, and the
extra width is width, not height — the slides stretch to the tallest card, so a
taller lead card would pad every other card's body with the difference. The
band goes to `32 / 10`, exactly twice `16 / 10` at the same height.

The framing exists **twice, for one card and for several** (`headlineSingle`,
`introSingle`, `serviceIntroSingle`), and `demosCopy()` picks by the number
that survived the availability check. Availability is not editorial: four of
five demos can drop out overnight, and plural copy over a single card promises
a shelf that is not there. For the same reason the grid caps its own width —
`auto-fit` hands the whole container to a lone card, which turns a card into a
poster.

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
  cover them in `src/lib/sitemap.test.ts`.
- **`SITEMAP_ENTRIES` stays the FULL inventory; `sitemapEntries()` is what the
  document renders.** The panel maintains a per-site list of paths to leave out
  (`src/lib/sitemapExclusions.ts`, read from `/content/sitemap-exclusions`), and
  an excluded page is also served `noindex` by `Layout.astro`. `cache.ts`
  derives `alwaysPaths` from the unfiltered constant on purpose — a rebuild must
  still be able to render a page that is merely hidden from search.
- **An exclusion drops the PAIR, never one URL.** Every entry here carries
  reciprocal alternates, so removing one side would leave the other naming a
  page no longer offered, and a single dangling alternate invalidates the whole
  set. `hreflangGroup()` reads the pairing from the inventory because
  `/leistungen/<slug.de>` ↔ `/en/services/<slug.en>` is neither a prefix nor a
  slug match.
- **`/sitemap-0.xml` renders on demand** (it was prerendered until the exclusion
  list arrived, which would have frozen the exclusions at build time). It is in
  `alwaysPaths` and on the `sitemap` cache event; `/sitemap-index.xml` stays
  prerendered because its only variable content is `lastmod`.
- Keep page titles and descriptions distinct, truthful and within the limits
  enforced by `src/lib/seo.test.ts`. `Layout.astro` must use the route's actual
  title rather than a hard-coded tab title.
- JSON-LD must match visible content after CMS resolution. FAQ answers must use
  the same resolved values as the rendered section. Pricing structured data may
  include numeric hourly offers only. There is no `HowTo` node any more: Google
  retired those rich results, and the process is not a set of instructions.
- Service cards are semantic links with a full-card hit area, a visible
  keyboard focus and meaningful accessible text. Prefer native links,
  headings, lists, `<details>/<summary>` and form controls over scripted
  substitutes.
- Keep the skip link (in the page's language), logical heading order, labelled
  controls, keyboard mobile navigation, theme no-flash bootstrap and
  `prefers-reduced-motion` behavior. Entrance-motion visible states must
  explicitly restore opacity/position even when transition duration becomes
  zero.
- The accessibility contract of the 2026-09 redesign is pinned by
  `src/lib/a11yContract.test.ts`; every rule in it was broken on the live site
  once, and none of them produced an error:
  - `AccentLetters` reads its word from an `sr-only` copy. Never `aria-label`
    on a span or div (axe `aria-prohibited-attr`).
  - The FAQ is ONE native `<details name="faq">` accordion at every width — not
    a tablist (a `ul[role=tablist]` with `li` children was axe-critical) and not
    a second hidden copy for phones.
  - Fixed bottom chrome never hides focus: `scroll-padding-bottom` in
    `global.css` adds `--tds-bottom-lane` (cookie notice) and
    `--lp-floating-lane` (floating CTA). Scroll padding cannot scroll past the
    end of a page, so the footer adds both lanes to its own bottom padding —
    without it the legal row stayed under the notice. The header stops being
    fixed below `max-height: 30rem` (400 % zoom, landscape phones).
  - Any link inside a card whose bar CTA stretches over it (the service badges
    of `ReferenceCard`) needs `position: relative; z-index: 1`. Without it the
    link renders and reacts to hover, and a tap opens the card's destination.
  - The language switch (`LanguageSwitch.astro`) is one link, rendered only
    when `alternatePath()` finds the page's twin in the route inventory. The old
    dropdown glued `/en` onto the path whenever alternates were missing.
  - Touch targets are at least 44px on `pointer: coarse` (footer links, card
    bars, breadcrumb, language link, trust links); process steps are not focus
    stops; the contact form ties each error to its field and never renders its
    fields invisible before hydration.

## Verification

Use the repository scripts:

```text
npm run type-check   # Astro/TypeScript correctness
npm run test:run     # Vitest unit and contract tests
npm run og:smoke     # render the default social card for inspection
npm run demos:sync   # re-harvest the demo sites; prints why each one is hidden
npm run images:variants  # regenerate the committed pre-sized image copies
npm run build        # SSR build plus deployable release assembly/verification
npm run preview      # production-style local inspection
npm run audit:ux -- <url>  # overflow, targets, fixed chrome, focus, axe, deep links
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
- Do not reintroduce Komplette IT or Auftragsprogrammierung as offers; a test
  greps the committed prose for both.
- Do not publish a screenshot of a customer site without `previewAllowed` on
  the case; see IMAGES.md.
- Do not put secrets in source, `PUBLIC_*` variables, browser code or generated
  runtime JSON.
