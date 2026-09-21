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
  `pages/index.astro` and `pages/en/index.astro` are wrappers. Its order follows
  the questions a visitor has, in sequence — reordered 2026-09-15, websites
  first: Hero (benefit + trust card) → Leistungen (Webauftritt first, the
  systems strip, the assistant's button) → Kundenprojekte
  (`sections/CustomerCases.astro`) → Vorgehen (with the first-conversation card)
  → Beispielseiten (`sections/Showcase.astro`) → compact Journal → Wieso ich? →
  Preise (`sections/Pricing.astro`, with the assistant's second button) → FAQ →
  Kontakt. The FAQ stays directly
  above the navy contact block. The positioning band, the pricing teaser with
  its drawer and the
  hero slider were removed, not unmounted; do not bring them back. The old
  TechMarquee and Currently sections do not belong on the home page, and
  Portfolio stays hidden.
- **Copy is short and clear** (asked for 2026-09-15): one statement per
  sentence, about three points per list, four questions on a platform page,
  six on the home page, no filler. When revising, cut before adding. The SEO
  duties stay: summaries 81–160 characters, an answer-first paragraph with
  who, what and where, question headings, sources for facts.
- **The site says "du"** (decided 2026-09-15), lowercase, in every text that
  addresses the visitor — copy modules, components, islands, error messages.
  Only the legal register stays formal: Impressum, Datenschutzerklärung, the
  AGB and tds-shared's consent dialog. Sentences that tds-shared still ships in
  the formal register are overridden locally (`lib/contactCopy.ts`,
  `lib/processContent.ts`), not changed for every site. `addressForm.test.ts`
  fails on "Sie/Ihnen/Ihr…" in any source outside `pages/legal/`. Panel blocks
  saved before the switch still override the defaults until they are cleared.
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
- **The contact form asks WHAT it is about and answers WHAT HAPPENS NEXT**
  (2026-09-21). A reason dropdown above the message posts as `subject`, which
  `POST /contact` has accepted and stored all along — it just needed declaring
  in tds-shared's `ContactSchema`, because `zodResolver` forwards only the keys
  the schema knows. The reasons come from `contact.reasons` in the panel and
  ship committed (see the empty-list rule under Content and CMS). Optional on
  purpose: a forced choice costs submissions from the people whose request
  fits no entry.
  The message field is guided by an element, not a placeholder — a placeholder
  vanishes on the first keystroke — tied to the textarea with
  `aria-describedby` alongside the error when there is one.
  The four "what happens next" points are the CONFIRMATION's content now. They
  used to stand above the form, where they repeated the process section word
  for word and pushed the form below the fold. `ui/FirstCall.astro` keeps its
  `contact` variant for stored blocks but has no caller on the home page.
  `contactForm.test.ts` holds all of it.
- **The Leistungsassistent is a button, not a section** (decided 2026-09-15) —
  for the visitor who does not know what they need or what it costs.
  `components/ServiceAssistant.astro` renders ONE native
  `<dialog id="leistungsassistent">` on the home page around
  `islands/ServiceFinder.tsx`; questions, weights and copy live in
  `lib/serviceFinder.ts`. The buttons in the services and the pricing section
  (`[data-assistant-open]`) ship `hidden` and are revealed only once
  `showModal` exists; `/#leistungsassistent` and the old `/#leistungsfinder`
  open the dialog directly. The script gives focus back to the button that
  opened it — except after a same-page link or the hand-off to the contact
  form, where focusing the opener would scroll the page back up. The island is
  `client:idle`: a closed dialog never becomes visible, so `client:visible`
  would never hydrate, and "Weiter" before hydration would submit the form
  natively.
  - It asks three things — topic, recognised starting points, stage — and
    recommends one or more services, each with the visitor's own answers as
    the reason, the published hourly rate (resolved from the pricing block on
    the server) and, for Webauftritt, the platform pages. It never comes back
    empty and never names an estimate or a range. `SERVICE_ORDER` is the
    catalogue order and breaks ties.
  - Its starting points are the services' `situations`, resolved on the server
    like everywhere else, so a panel edit changes the assistant too; the island
    never imports the catalogue.
  - It sends nothing: the result becomes a draft in the contact form's message
    field (`lib/contactDraft.ts` — sessionStorage for a form that hydrates
    later, an event for a live one), and text the visitor typed is never
    replaced. Its copy is code-owned (no CMS block) and follows the same rules
    as the rest: du, no free and no timed first conversation.
- **The hero is `sections/Hero.astro` — its copy and photo are
  server-rendered; only the decoration is an island.**
  - The eyebrow names the SITUATION the visitor is in, the H1 the benefit, the
    sub (`#hero-sub`) what is on offer, followed by two real anchors, one of
    them primary. The brand motto no longer leads the hero; it said nothing a
    visitor could check.
  - **The page is written for businesses that already HAVE a website or shop**
    (decided 2026-09-20). Taking one over, repairing it and maintaining it is
    the lead story — not a rebuild, and not "Digitalisierung" in the abstract.
    The service catalog is unchanged; only the narrative is. The
    Germany-wide keyword target stays in the meta description, where
    `seo.test.ts` holds it.
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
- **Nothing in the shared chrome hydrates at `client:load`.** `ThemeToggle` and
  `SmoothScroll` were the only two, and they alone pulled React and Lenis into
  the requests a phone waits on before the headline; the header logo was a
  1289px PNG. With both at `client:idle` and the logo served as pre-sized
  lossless WebP (`LOGO` in `lib/imageVariants.ts`), mobile LCP went
  2.6 s → 2.3 s and performance 95 → 98. An island above the fold needs a
  measured reason to be `client:load`.
- Public service detail routes are `/leistungen/[slug]` and
  `/en/services/[slug]`. Route IDs and localized slugs are code-owned; never
  accept a slug or href from CMS content. The same two dynamic routes resolve,
  in this order, a service, a platform page, a retired slug (301), else 404.
  Each service carries a code-owned `seoTitle` — the `<title>`: search term
  first, "— Tracht Digital" last, at most 65 characters, distinct site-wide —
  and `updatedAt`, the visible "Stand" and the JSON-LD `dateModified`. Raise
  the date only when the content changes.
- **Shop system and CMS pages** — WooCommerce, Shopware 6, WordPress, TYPO3 and
  STRATO at `/leistungen/<system>` and `/en/services/<system>` — are code-owned
  in `lib/platforms.ts` and rendered by
  `components/platforms/PlatformDetailPage.astro` from the same
  `components/detail/` bands as a service page. One page per system with its
  offers as anchored sections; a page per offer would split authority into thin
  pages. The Webauftritt page links all five as tiles, the footer in its own
  column. Rules held by `platforms.test.ts`:
  - **No amount** (decided 2026-09-15). The cost box explains how a price comes
    about and links to `/#preise`; the JSON-LD `Service` carries no `offers`.
  - An answer-first paragraph (`answer`) that names Tracht Digital Solutions,
    Julian Tracht and Schwarzenbek and still makes sense when quoted on its
    own; headings that are real questions; a comparison table whose facts link
    their original source, with the "Stand" date beside it.
  - "Unabhängig, kein offizieller Partner" among the boundaries, no
    manufacturer logos, du, and the site's copy rules.
  - Only `disclosure: "named"` cases that list the platform
    (`referencesForPlatform`). An anonymous case must never be tied to a
    system — the system can identify the client.
  - Version and support facts go stale. Re-check the sources, and raise
    `updatedAt` when a fact changes — never the date alone.
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
  - **The contact section links to it as a drawn MINI CARD**
    (`.mini-card` in `sections/Contact.astro`, 2026-09-21), not as a text link
    and not as a picture: `public/images/business-card.webp` is a 1440×900
    screenshot of the page, which shrunk to card size is a tiny web page.
    Three things hold it together, each silent when broken:
    - **It draws itself from `--color-paper`, `--color-primary` and
      `--color-accent` only.** The section carries `.tds-tone-navy`, which
      re-maps `--color-black` to white plus `--color-muted`, `--color-line`,
      `--color-card` and `--color-soft` to translucent whites — correct for
      components on a dark ground, fatal for a LIGHT card, which would come
      out white on white. Those three tokens are the ones the tone leaves
      alone. Muted text is mixed from them at 75 %, a measured value: 55 %
      failed contrast on the 10–11 px lines and `audit:ux` caught it as two
      serious axe violations while the card looked fine.
    - **The QR arrives as `BUSINESS_CARD_QR_PATH`, never the encoder** — see
      the firewall in `businessCardQr.test.ts` — on an explicit white plate in
      both themes, because the SVG is black on transparent.
    - **One anchor, with an `aria-label`.** The visible text is a name, so a
      content-derived accessible name reads the whole card out and never says
      what following it does; the label states the action and keeps the
      visible name inside it. `miniBusinessCard.test.ts` holds all of this.
  - It renders **no CMS block at all**, which is why it is not in
    `cache.ts#contentPages` — only in `alwaysPaths`. A block save must not
    rebuild it.
  - `scripts/business-card-sync.ts` captures the screenshot the showcase tile
    shows. Re-run it (`npm run businesscard:sync`) after changing how the page
    looks, or the tile advertises the old design.
- **Prices are the home section `#preise`** (`sections/Pricing.astro`): all
  four rates, what each includes, and "So entsteht dein Preis" — visible without
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
- **The page has ONE ground.** `.page-ground` in `layouts/Layout.astro` is a
  single viewport-anchored layer carrying the brand fields; `body` is
  `--color-paper`. No section paints a tone or a `.tds-wash` of its own — the
  alternating paper/sand bands were removed because the ground restarted at
  every section edge. The only different-coloured surface left is the navy
  contact block (`.tds-tone-navy`), which simply paints over the layer.
  Two consequences: nothing between `body` and that layer may create a
  stacking context (a `transform`, `filter` or `opacity` on `<body>` hides the
  ground with no error), and every borderless card's fill must be checked
  against `--color-paper`, not against a band.
- `--lp-surface-card` is the card fill and both numbers in it are measured —
  see the comment in `styles/global.css`. It has to separate from the paper
  ground AND keep `--color-muted` above 4.5 on top of it; the two pull in
  opposite directions. Re-measure both before touching it, and run
  `npm run audit:ux` — the contrast half of that pair fails silently.
- Motion (tds-shared ≥ 0.38.4): pages cross-fade via the shared
  `page-transitions.css` plus this site's own half in `global.css` (the header
  and footer carry `view-transition-name`, so they hold still while the
  content fades and rises — the two rules are one mechanism). FAQ answers grow
  open via `.tds-disclosure`, the contact form animates errors and the
  thank-you with `tds-shared/motion/react`.
  The hero's COPY and PHOTO stay plain Astro — its SSR start state was once the
  mobile LCP (4.1 s). Its decorative geometry is a `motion` island
  (`islands/HeroDecor.tsx`) mounted `client:media="(min-width: 64rem)"`:
  measured, `client:idle` cost a phone ~129 KB of JS for shapes that do not
  render below that width. LCP is unchanged at 390 px (588 ms vs 592 ms, median
  of 5, CPU ×4; LCP element `H1#hero-heading` either way). Scroll reveal stays
  `lib/reveal.ts` (`[data-reveal]`); do not add tds-shared's `.tds-reveal` on
  top of it. `src/__tests__/motion.test.ts` holds the rules, and a first-load
  measurement belongs in any change here.
- **Motion, after the 2026-09-21 pass.** It was measured at 1.7 px/s — under
  the threshold at which movement registers — and absent on phones entirely.
  Now the hero decoration arrives visibly, drifts at ~5–10 px/s, follows the
  pointer ~60 px, and the gold node walks the conduit (~49 px/s). The
  scroll-linked part is CSS (`animation-timeline: view()`), NOT a hook: the
  shared motion entry re-exports only `m` and `AnimatePresence`, and a bare
  `motion` import is forbidden. Three rules hold it together:
  - **The capsule and the quarter circle still start at `xl`.** Below that the
    hero has no negative space — measured, the only free bands at 390 px are
    100 px at the top and 56 px at the bottom, and the top one belongs to the
    fixed header. Placing them lower produced sixteen "decoration over
    content" failures in `audit:ux`. Only the small node renders below `xl`,
    in the bottom band, walking horizontally.
  - **The node is deliberately outside the scroll-drift rule.** Two travels on
    one axis read as a wobble, and the extra 56 px put it on the eyebrow.
  - **Nothing a visitor reads animates from `opacity: 0`.** The staged
    entrance is the elements AROUND the headline; the headline rises as one
    block. The note above its markup says what a per-word split broke.
- **No opening hours are published**, on the page or in the schema. Julian
  works by arrangement, and schema.org cannot express that — `opens`/`closes`
  would be an invented promise of availability. `jsonld.test.ts` fails if
  anyone adds them.
- **A `<dialog>` needs `margin: auto` spelled out.** Tailwind's preflight
  resets `margin: 0` on `*`, which beats the UA rule that centres a modal
  dialog, so it opens in the top left corner — working, focus-trapped and in
  the wrong place. Both dialogs shipped that way. `previewLightbox.test.ts`
  now checks every `.astro` file that contains a `<dialog>`.
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
`home_hero.scrollHint` have no renderer (kept so stored blocks keep loading).

**Every block this site renders has a panel schema** in
`tds-ext-website-cms-pkg/islands/sections.ts`. This section used to claim that
`home_trust`, `first_call`, `pricing_logic`, `references_home` and
`website_demos` had none; that was written before website-cms 0.4.x and stayed
wrong for months. Check the other repo before repeating a claim like this.

**A CMS-editable list needs a NON-EMPTY committed fallback.** `mergeCmsValue`
refuses an override for a list whose local default is empty — with no committed
item there is no runtime shape to validate the incoming ones against — so
shipping `[]` makes the panel field permanently inert, in silence. Two lists
here genuinely must default to empty (service references and the fixed-price
packages: nobody may publish an invented case or an invented price), and both
therefore validate the RAW block field themselves, outside `cmsFor` —
`validateServiceReferences` in `lib/services.ts` and `validatePricePackages` in
`lib/pricing.ts`. The contact form's `reasons` are the opposite case: they ship
committed, and must stay that way.

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
`homeContent.ts`, and it is editable in the panel like every other block;
`block` cache events already rebuild the home and service pages for any block
id, so no event mapping was added for it.

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
(editable in the panel, falling back to the committed copy). Never write
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
  enforced by `src/lib/seo.test.ts`, `services.test.ts` and `platforms.test.ts`.
  `Layout.astro` must use the route's actual title rather than a hard-coded tab
  title. Titles put the search term first and "— Tracht Digital" last.
- JSON-LD must match visible content after CMS resolution. FAQ answers must use
  the same resolved values as the rendered section. Pricing structured data
  carries hourly rates as `UnitPriceSpecification` with `unitCode: "HUR"`, and
  a fixed-price package as a plain `PriceSpecification` with no unit — pushing
  a package total through the hourly branch publishes a four-figure *hourly
  rate* to everything that parses the markup instead of reading the page
  (`pricing.test.ts` holds the two apart). There is no `HowTo` node any more: Google
  retired those rich results, and the process is not a set of instructions.
  Subpages emit one `@graph` (`lib/jsonld.ts`): `WebPage` with author,
  publisher and the visible date as `dateModified`; `Service`, with an `Offer`
  only where the page states the rate; `BreadcrumbList`; and `FAQPage` where
  the page shows questions. Organization, Person and WebSite live on the home
  page, and subpages reference them by `@id`.
- **AI search (AI Overviews, ChatGPT, Copilot, Perplexity, Claude) reads the
  same pages — write for people.** What helps is what the detail pages already
  do: an answer-first paragraph naming who, what, for whom and where; headings
  that are real questions, answered in their first sentences; tables of
  checkable facts that link their original sources; a visible "Stand" date and
  a named author; the same name for the same thing everywhere. What does not
  help: extra "AI files", Markdown copies, keyword lists, bought mentions,
  content chopped into fragments. `public/llms.txt` exists but earns little —
  keep it true (`llmsTxt.test.ts`), do not grow it.
- `public/robots.txt` names the search and fetch agents of OpenAI, Anthropic
  and Perplexity, and every group repeats `Disallow: /install/`
  (`robotsTxt.test.ts`). Blocking one of those agents removes the site from
  that engine's answers without any error.
- **IndexNow** (`npm run indexnow`) tells Bing and the other IndexNow engines
  which URLs changed. The key is `public/<key>.txt`. The command reads the live
  sitemap and is manual on purpose — run it after a deploy, never from the
  build or the release; `-- --dry-run` lists without sending.
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
npm run audit:seo -- <url> # every sitemap page: title, description, H1, canonical,
                           # hreflang, OG image, JSON-LD, Stand/author, sources,
                           # internal links, robots.txt, llms.txt
npm run audit:perf -- <url> # LCP median of 5 + the LCP ELEMENT, CLS, TTFB,
                           # byte weight by type, decoded JS. 390px, CPU x4,
                           # cache off. Budgets in scripts/perf-budget.json;
                           # over one = exit 1. In Git Bash prefix
                           # MSYS_NO_PATHCONV=1 or `--paths=/` is rewritten
                           # into a Windows path.
npm run indexnow -- --dry-run  # the URLs IndexNow would be told about; manual, after a deploy
```

**Every performance number in this file used to be a hand-taken Lighthouse
reading that nothing could reproduce, so nothing could regress against them.
`audit:perf` is that gate.** Its most load-bearing check is not a number: it
pins the LCP ELEMENT to `h1#hero-heading`. A per-word entrance on the headline
was built, and it fragmented the H1 into nine small candidates so the
paragraph below silently became the largest paint — no timing got worse, the
metric simply stopped watching the headline. Measure locally against locally;
the local server does not compress and its first requests are cold.

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
