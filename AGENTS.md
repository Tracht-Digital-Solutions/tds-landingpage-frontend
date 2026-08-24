# Agent notes — tds-landingpage-frontend

Astro 6 + React islands + Tailwind v4. Static-rendered marketing site.
Deploys to **the production host** at `tracht-digital.de`.

> Status: **required, not superseded.** Still deployed. Its editable section content is
> fetched at build time from `tds-content-api`'s `/landing` block API today; after the
> frontend-platform cutover that source becomes `tds-ext-website-cms-pkg` (`/cms/...`), read the
> same way. See the root `MIGRATION-STATUS.md`.

## Status

Phase 5 ported. Homepage sections, `/preise`, `/legal/{impressum,datenschutz}`
all shipped. As of 2026-05-28: upgraded to Astro 6, swapped Tailwind from
the `@tailwindcss/vite` plugin to `@tailwindcss/postcss` (rolldown
incompatibility with Vite 7 — withastro/astro#16542), wired real Astro
i18n routing (DE at `/`, EN at `/en/`), swapped the heading family to
the shared Lato display face, dropped SectionSnap in favour of native scroll +
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
  burgundy). Type stack is `@fontsource/lato` (display, 400/700/900),
  `@fontsource-variable/plus-jakarta-sans` (body) and
  `@fontsource-variable/jetbrains-mono` (mono) — all imported in
  `Layout.astro` frontmatter, NOT via CSS `@import` (see the fontsource
  entry in "Don't" below). **Lato** is the canonical display face; any note
  claiming Hanken Grotesk is stale. Body/mono moved off Geist when the
  design library unified the three surfaces: this site was the outlier, and
  its `--font-mono` resolved to *nothing at all* because
  `@fontsource-variable/geist` is sans-only and Geist Mono was never
  installed.
- **This app is the `marketing` surface of the shared design library.**
  `<html data-surface="marketing">` in `Layout.astro` selects
  `tds-shared/styles/surfaces/marketing.css`, which owns the geometry: round
  pill buttons, 6px cards, the only card elevation of the three surfaces,
  and the 700 display voice. `global.css` imports
  `base.css` → `primitives.css` → `surfaces/marketing.css` and authors **no
  font token, no `.display` weight and no radius of its own** — all three
  used to be duplicated here. To change how this surface looks, edit the
  surface layer in tds-shared-pkg and bump; never re-declare a shared class
  here.
- **Backgrounds and decoration come from the shared decoration layer
  ("Digitale Maßarbeit", tds-shared ≥0.23.0).** This site does not author a
  background of its own any more. What it uses:
  - `.tds-tone-sand` / `.tds-tone-navy` / `.tds-tone-ink` for a section's
    ground, replacing hand-written `bg-[var(--color-soft)]` /
    `bg-[var(--color-surface-navy)]` utilities. The two dark tones re-map
    ink/muted/line/card for their children, which is why the contact block's
    hairlines need no override.
  - `.tds-wash` (Hero, About, Services `--calm`, Process `--mirror`) for the
    soft brand fields at a section's outer edges.
  - `.tds-decor` + `.tds-shape*` + `.tds-circuit` for the hero composition and
    the two navy callouts.
  - `.tds-brandbar` under three headlines only (Services, Prozess, Kontakt)
    plus the footer — **not** in every section; it is punctuation.
  - **`CircuitRun.astro`** (`components/ui/`) — the conduit run, promoted out
    of `Hero.tsx` once a second consumer appeared. `Hero.tsx` keeps a React
    twin on purpose: an `.astro` cannot be imported into an island, and making
    the hero's decoration a second island just to share nine lines of SVG costs
    more than the duplication. Change the path data in one, change it in both.
  - **It sits in the FAQ section, not the Journal one.** The Journal was the
    first choice and was wrong: it has no negative space, so the run landed
    behind the CTA card. The FAQ's answer column is short and the area below it
    is genuinely empty at `lg`+. A decorative shape that has to compete for its
    own space is the "Dekoration hinter Inhalt" the brand direction rules out —
    put it where there is room or leave it out.

  **What this replaced, so nobody restores it:** the hero's three-blob aurora
  (cursor-springs + scroll parallax + infinite drift + a rotating conic
  gradient + fractal noise), the blurred pink ellipse behind the H1's accent
  word, the blurred radial behind the About portrait, and the 135°
  navy→bordeaux gradient with a corner glow that the pricing teaser, the
  consulting callout and the process image placeholder all shared. Every one
  of those is on the brand direction's do-not-use list. **Also removed with
  them: a `mousemove` listener and eight motion values on every page load.**
- **Editorial vocabulary**: `.display`, `.display-tight`, `.accent-italic`,
  `.eyebrow`, `.lead` — all from `base.css`; **`.brand-wordmark` comes from
  `primitives.css`**, which is why that file is imported. `app.css` is
  deliberately not imported — that is dashboard chrome — but the
  cross-surface primitives are. The bespoke section styles (accent-letters,
  hero, marquee, cursor, floating CTA, glass nav pill) stay local.
  `SectionHeader.astro` is the shared masthead component for the homepage
  sections: **headline only, no eyebrow slot.**
  > **The numbered chapter marks are GONE from this site (0.14.3).** Every
  > section used to open with `.section-num` — "— 01 / Über mich" + a 24px
  > gold rule — via `SectionHeader` (6 sections), four inline copies
  > (About, Contact, Consulting, PricingTeaser) and two hand-rolled twins
  > that skipped the class entirely (Journal, `/preise` DE+EN). The
  > headline now opens each section. `.section-num` itself **stays in
  > tds-shared** — the blog and the legacy customer portal still render it,
  > so this was a landingpage change with no library release.
  > The `label` fields were NOT deleted from the data: every section's
  > `cmsFor(...)` default must keep the shape the API validator expects,
  > `FAQ.astro` names its tablist with `content.label`, and the pricing
  > pages build their `<title>` + breadcrumb JSON-LD from `pricing.label`.
- **The site is BORDERLESS: separation comes from fill, tone and spacing.**
  Almost nothing here draws a 1px box around itself any more — cards,
  buttons, chips, image frames, the pricing cards, the language dropdown,
  the mobile menu, and every list/section divider (FAQ, Currently, About's
  stat row, the footer bar, the pricing card feet). A card that used to be
  outlined is now a tone against its section's ground (paper on
  `.tds-tone-sand`, `--color-soft` on paper); a divider became spacing.
  **The rule that actually bites: a fill only separates against a DIFFERENT
  ground.** Once the border is gone, a card is visible only if its own token
  differs from the section tone behind it — and three shipped invisible for
  exactly one release because they didn't:
  - the pricing cards were `--color-paper` on the pricing page's
    `--color-paper` ground (every card but the navy highlight vanished, on a
    page where the card edge is what says which features belong to which rate);
  - the Journal teaser was `--color-soft` inside a `.tds-tone-sand` section,
    and sand IS `--color-soft`;
  - `ImagePlaceholder` was `--color-soft` too, and it renders on BOTH grounds
    (inside a paper card and directly on a sand section), so it now uses
    `--color-card`, the only fill that reads against both.
  The ladder is `--color-paper` (page) → `--color-soft` (sand tone) →
  `--color-card` (elevated). Pick the card's fill by looking at the SECTION's
  tone class, not by picking a nice-looking token.
  **This is invisible to every gate in the repo** — `astro check` passes, the
  build passes, the tests pass, and the page merely looks empty. Judge it in a
  browser, or measure it: walk each card up to its first opaque ancestor and
  compare the two `backgroundColor`s (a `playwright-core` script against the
  built `dist/` does it in a few lines, no API needed).

  Two rules when touching this:
  - **A control that recoloured its BORDER on hover must recolour its
    FILL instead.** Several buttons (the secondary hero CTA, the service
    tag chips, the Journal teaser, the AGB link) had
    `hover:border-[…primary]` as their only hover feedback — drop the
    border alone and the control reacts to the pointer with nothing.
  - **A state carried by a border needs a replacement, not a deletion.**
    The FAQ's selected question was a 2px accent left edge; it is now a
    filled row (`color-mix` with `--color-accent`) plus the accent text it
    already had, so the state never rests on colour alone.
  What deliberately keeps a line: focus rings (never remove one — the
  global `:focus-visible` ring is a WCAG requirement and tds-shared's
  `design.test.ts` enforces it), the Process timeline rail (a `w-px`
  gradient graphic that connects the steps, not a border) and the contact
  form's own `:focus-within` underline treatment.
  The shared half of this is `--tds-border-hairline: 0` on the marketing
  surface (tds-shared) — which changes nothing on this site today, since
  it uses no border-bearing shared primitive, but stops the next one from
  arriving outlined.
- **The contact form's field wrapper is `.contact-field-row`** (with
  `.contact-field-line` / `.contact-field-label`), not `.field`.
  `primitives.css` owns `.field` as the *input element*, while the old local
  `.field` was a *wrapper div* with an `::after` baseline rule — two
  incompatible semantics under one name. Renaming it is what unblocked
  importing the shared primitives here at all.
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
  recent posts (`fetchTopics`) → else the **tds-shared-pkg i18n placeholder posts**
  (`t.blog.posts`). So the placeholder articles appear whenever the API returns
  no published posts — NOT only when the API is down: a reachable-but-empty
  `blog_post` table (e.g. seeds never ran on prod) yields `[]` and triggers the
  same fallback, and any `PUBLIC_DEMO_MODE=true` build short-circuits the fetch
  to `[]` by design. The three placeholder slugs
  (`individuelle-software-kosten`, `drei-prozesse-automatisierung`,
  `warum-ich-nicht-skaliere`) are now seeded into `tds-content-api` by its
  `SeedInitialBlogPosts` migration (DE + EN), so a migrated prod shows the real
  posts.
  - **A post with no uploaded cover gets the SAME abstract brand cover the blog
    draws for it** — `AbstractCover` from `tds-shared/components`, keyed by a
    hash of the slug, rendered without a `client:` directive so it costs no
    JavaScript. What that replaced: three stock photos hosted here under
    `public/journal/*.webp` (which the blog never showed) and, for everything
    else, a grey box captioned with a *prose description* of the picture that
    was meant to go there. The same article looked like two different things on
    the two public properties. Those webp files are deleted; `ImagePlaceholder`
    stays, but only `PortfolioCard` uses it now.
  - **`coverHint` is resolved to an absolute URL at the data layer**
    (`lib/content.ts` `resolveCoverHint`, the twin of the blog's). The CMS
    persists an uploaded cover as a storage-relative `/uploads/…` path; rendered
    as-is here it resolves against `tracht-digital.de` and 404s — a broken image
    the build never sees, because the build never makes the request.
  - **Never pass `t.blog.posts[].imagePlaceholder` to an `<img src>`.** It is a
    German sentence describing the intended cover, not a URL. The i18n fallback
    branch passes `coverHint: null` on purpose.
- **Consulting section** (`src/components/sections/Consulting.astro`):
  Gradient card matching `PricingTeaser`'s visual language so the
  two callouts pair as a system. Two CTAs — primary
  "Unverbindlich anfragen" / "Get in touch" → `#contact`,
  secondary "Leistungen ansehen" / "See services" → `/preise`. Copy
  via `t.consulting.*` in tds-shared-pkg 0.2.5+.
  **The section deliberately promises no free or time-boxed initial
  consultation** — the Kleinanzeigen carry that offer, the website does
  not. Don't reintroduce "kostenfrei"/"30 Minuten" here, in `t.hero.cta1`
  or in `lib/faq.ts`.
  **Seit 0.16.0 gilt das für die GANZE Site, auch `t.pricing`.** Die
  Preise-Seite nannte weiterhin ein „Erstgespräch (kostenfrei, bis 60
  Min.)" und warb mit „unverbindlich, kostenfrei und ohne Sales-Pitch"
  — eine vorbestehende Ausnahme, die die Vorgabe an der Stelle aushebelte,
  an der es ums Geld geht. Ersetzt durch „Aufnahme und Sortierung Ihrer
  Anforderungen" bzw. „Schreiben Sie mir kurz, worum es geht."; der
  Button heißt jetzt überall **„Unverbindlich anfragen"**.
  Prüfbar im gebauten `dist/` per Suche nach `kostenlos` / `kostenfrei` /
  `30 Minuten` / `60 Min` / `free`. **Ein legitimer Treffer bleibt:**
  „your choice is free and can be changed at any time" in
  `cookieNotice.consentText` — das ist die Freiwilligkeit der
  AdSense-Einwilligung und ein geteilter Key, kein Angebot.
- **FAQ section** (`src/components/sections/FAQ.astro`): Native
  `<details>`/`<summary>` accordions — zero JS, accessible,
  keyboard-navigable. Eleven items, written for the audience the
  Kleinanzeigen address — freelancers, small businesses, local trades
  (unclear requirements, first step, what drives the price, duration,
  small jobs, taking over an existing site, ongoing maintenance,
  website vs. online shop, self-service editing, GDPR, working outside
  the region). Scoped
  `<style>` uses `@supports (interpolate-size: allow-keywords)`
  so modern browsers get a smooth height animation on open/close;
  older browsers fall back to the default `<details>` snap. Copy
  is inlined per the same rule as Currently — FAQ answers drift
  faster than the rest of the bundle.
  **Antworten bleiben bei höchstens zwei Sätzen** (0.16.0 kürzte sie von
  je drei bis vier). Elf Fragen mit je vier Sätzen liest niemand, und
  eine FAQ, die nicht gelesen wird, nimmt keiner Anfrage die Hürde —
  sie ist nur Seitenlänge. Die Antworten sind 1:1 das FAQPage-JSON-LD,
  eine Kürzung wirkt also auch im Suchergebnis.
- **Textlänge ist eine Entscheidung, kein Zufall** (0.16.0). Die Seite
  las sich wie eine Agentur, nicht wie ein Freelancer: Leistungskarten
  ~300 Zeichen, About-Absätze ~250, Hero-Untertext 220. Richtwerte
  seither: Hero-Untertext ≤ 130, Leistungsbeschreibung ≤ 170,
  About-Absatz ≤ 170, Prozessschritt ≤ 110, FAQ-Antwort ≤ 150.
  Ein Gedanke pro Satz, Ich-Stimme, **„Sie"-Form** (die Zielgruppe sind
  Handwerk, Läden und kleine Betriebe — der Freelancer-Charakter kommt
  über kurze Sätze, nicht über Duzen). **Nichts davon ist getestet** —
  kein Build und kein Test sieht einen zu langen Absatz, anders als bei
  der Meta-Description (`seo.test.ts`, 80–160). Wer Copy anfasst, prüft
  sie im Browser.
- **Editable content via `src/lib/cms.ts`**: `fetchBlocks(lang)` does a
  single build-time GET of `PUBLIC_CONTENT_API_URL/landing?lang=` (memoised)
  and `cmsFor(section, lang, fallback)` merges the admin-edited block for that
  section over its baked default, guarded by a shallow shape-check and
  graceful fallback to `{}` so the build never breaks if the API is down.
  Editable sections today: hero, about, services, pricing, consulting,
  contact, footer, faq, process — edited in tds-admin's Landingpage editor.
  **tds-shared-pkg i18n (and the local `lib/faq.ts` / `lib/processDetails.ts`)
  remain the default/fallback**; a content block only *overrides* it. Honours
  the "content baked at build time, never at runtime" rule — a `/landing` edit
  goes live only after the API triggers a rebuild. (Hero is a `client:load`
  island, so `index.astro` resolves its block and passes it as a prop.)
- **Cookie banner (admin-toggleable)**: `cookieBannerEnabled()` in `cms.ts`
  reads the language-agnostic `cookie_banner` block (always `lang=de`, like
  the Journal selection) and `Layout.astro` bakes the shared `CookieNotice`
  island (tds-shared-pkg ≥0.8.8, `client:idle`, local `/legal/datenschutz` link)
  on every non-bare page when `{ enabled: true }`. Absent block / demo mode /
  API down = banner off. Toggled in tds-admin (Landingpage → Cookie-Banner);
  a save rebuilds landingpage **and** blog. Dismissal persists per origin in
  localStorage (`tds-cookie-notice`) — no cookies involved, which is what the
  banner itself states.
- **AGB page + PDF via `src/lib/legal.ts`**: `/legal/agb` and `/en/legal/agb`
  (both `<LegalDocPage>`) render the document as a real page — heading, "Stand",
  a download button and a desktop-only inline `<object>` viewer — while the
  prerendered endpoints `src/pages/{,en/}legal/agb.pdf.ts` emit the bytes
  themselves at `/legal/agb.pdf`. The document is **uploaded in the frontend**
  (Website-CMS → Rechtsdokumente) and fetched at build time from
  `PUBLIC_CONTENT_API_URL/legal/agb.pdf?lang=`; an upload fires the rebuild, so
  the same build-time rule as the content blocks applies.
  Three things worth keeping:
  - **The fallback is stronger than `cms.ts`'s.** A section quietly reverting to
    its baked default is invisible; an AGB that disappears is a legal problem.
    So `legalDocBytes()` falls back to the committed
    `src/assets/legal/agb.pdf` on *any* failure — unreachable API, 404, or a 200
    whose body is not a PDF (which is what a misrouted request to a static host
    looks like). `/legal/agb.pdf` therefore can be stale, never absent.
  - **The committed copy must NOT live in `public/legal/`.** It used to; a file
    there and the `agb.pdf.ts` route both claim `/legal/agb.pdf`. It lives in
    `src/assets/legal/` and is read via `process.cwd()`, the same anchoring the
    OG renderer and `kontakt.vcf.ts` need.
  - **EN is a separate upload, not a translation.** Legal text never goes
    through DeepL, so `lang=en` is its own document; with none uploaded the
    German fallback is served rather than a dead link.
  Page copy lives in `legalCopy` in the same module, with a TODO to promote it
  to tds-shared-pkg — the two other legal pages inline their copy the same way,
  and moving it now would drag this repo's `tds-shared` pin across five
  unrelated minors.
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
  On desktop the timeline pairs with a sticky detail frontend: hovering or
  keyboard-focusing a step reveals its longer copy (`src/lib/processDetails.ts`,
  kept local like the FAQ copy) over a per-step photo
  (`public/images/process/step-0N.webp`) with the brand gradient as a
  fallback when an image is missing.
- **Section rhythm**: paper → paper → sand → DARK → paper → sand →
  paper → paper → sand → paper → sand → DARK. Paper-backed
  narrative sections (About, Portfolio, Currently, PricingTeaser
  inner card, Consulting) alternate with **`.tds-tone-sand`** callout
  sections (Services, Process, Journal, FAQ) and **`.tds-tone-navy`**
  chrome sections (Tech, Contact). The tone classes replaced
  hand-written `bg-[var(--color-soft)]` / `bg-[var(--color-surface-navy)]`
  utilities so a section NAMES its ground instead of re-guessing it, and
  so the dark ones re-map the page tokens for their children. The Currently + PricingTeaser paper
  pair sits inside the soft Process / Journal frame so the
  gradient pricing card lands in a calm space; Consulting's
  gradient card and the soft FAQ both buffer the dark Contact
  closing.
- **Header / navigation**: a floating **paper** capsule on desktop (≥lg)
  with `data-scrolled` morphing the chrome on scroll past 8px. It used to
  be glass — `blur(40px) saturate(185%)`, a bright white inset rim and a
  50px navy drop plume. "Digitale Maßarbeit" calls for "helle, schwebende
  Kapselfläche · keine starke Glasoptik · keine ausgeprägten Schatten", so
  the blur is 16–20px at ~115% saturation, the fill is a near-opaque warm
  white and the scrolled shadow is a suggestion (`0 8px 22px -16px`).
  Depth comes from the fill contrast against the page, not from the drop.
  **It is a FULL pill in every state** — `var(--tds-radius-pill)`, declared
  once. It used to be 24px on mobile, 22px docked and `9999px` only once
  the desktop bar had scrolled, i.e. a rounded rectangle almost everywhere
  it was actually seen. Because all states now share the radius, it is no
  longer in the transition list; `max-width` + `top` still tween the morph.
  **It also has no rim.** The warm hairline is gone with the borderless
  pass — and note what carried it in light mode was an INSET `box-shadow`,
  not a `border`, so a grep for `border` finds nothing and the rim is
  still there. The dark-mode fill was raised (55% → 88% of `--color-card`,
  92–94% scrolled) *because* the rim went: that hairline was the only
  thing keeping the bar from dissolving into the dark hero, so don't lower
  the tint without looking at the scrolled bar over that hero.
  Below `lg` the pill docks against the top edge, is always rendered with
  chrome, spans `left-3 right-3`, and ends in a 44px hamburger that
  animates three CSS bars into an × via the `[aria-expanded]`
  attribute. **Those bars are `.tds-menu-bar*` from tds-shared
  `primitives.css`** — the blog header carried the same rules under
  `.jnl-menu-bar*`, so they were promoted. The 2px bar radius is
  `--tds-radius-bar` (the marketing-surface default), and the shared
  block also supplies the `prefers-reduced-motion` rule this header
  never had. Don't re-add a local `.menu-bar` block.
  Mobile menu frontend mounts as a separate fixed div
  below the pill — Astro inline `<script>` toggles state and
  body scroll-lock. The "TDS" wordmark is paired with the real
  logomark at `public/images/logo.webp` (the with-text variant
  `logo-with-text.webp` sits alongside it).
- **Floating chrome shares the corner via LANES, not z-index.**
  `.floating-cta-group` is fixed bottom-right at `z-index: 35`. Two shared
  components can occupy that same spot: the live-chat launcher
  (`z-index: 95`, so it covers this outright) and — on a phone, where it spans
  the full width — the cookie notice (`z-index: 90`). The CTA therefore adds
  **`--tds-right-lane`** (published by `LiveChatCta`) and
  **`--tds-bottom-lane`** (published by `CookieNotice`) to its own `bottom`,
  plus `env(safe-area-inset-bottom)` it never had.
  Both fall back to `0px`, so with neither component on screen the position is
  the plain `1rem`/`1.5rem` it always was — verified by measurement, not by
  eye: the gap to the viewport floor is 16px at 375 and 24px at 1440 with and
  without the change.
  **Don't "fix" this with a z-index instead.** Raising the CTA above the
  launcher would just swap which of two persistent CTAs is buried, and the
  brand direction rules out competing floating CTAs outright.
- **Service icons**: `ServiceIcon.astro` renders a small inline
  SVG keyed off the service `number` ("01" → browser-window,
  "02" → smartphone, "03" → stacked layers, "04" → connected
  nodes, "05" → sparkles). The mapping is editorial and intentionally
  not derived from the title — titles can change in tds-shared-pkg
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
- **Hero background — STATIC, constructed geometry**
  (`src/components/islands/Hero.tsx`). A `.tds-wash` ground, a large
  capsule cut by the left edge (`hidden md:block` — at 38rem it spans a
  375px viewport and the headline would sit on it), a quarter circle cut
  by the bottom-right corner, an outlined rounded rectangle, one diagonal
  logomark reference, a single gold node, and one `CircuitRun` (the
  conduit lines). The ONLY motion is the copy's entrance fade
  (0.45s / 12px) and the conduit's one-shot draw.

  **Superseded — do not reintroduce.** Until 2026-08-15 this was a
  three-blob aurora: three blurred radial gradients on
  `mix-blend-multiply`, each spring-following the cursor on X and
  parallaxing on Y at staggered rates (-160 / -260 / -360 over 800px)
  with per-layer scale, over a conic gradient that rotated 60° with
  scroll and pulsed its opacity on a 12s loop, under a fractal-noise
  overlay. It was documented here as a feature; it is the brand
  direction's do-not-use list almost item for item (organische Blobs,
  generischer bunter Verlauf, starke Parallax-Effekte, dauerhaftes
  Pulsieren), and it cost a `mousemove` listener plus eight motion values
  on every load.
- **Hero composition: DREI Blöcke, das Motto führt** (seit 0.16.0 —
  vorher vier). Reihenfolge im DOM ist Motto → H1 → Untertext → CTAs,
  die `fadeUp`-Verzögerungen (0.05 / 0.08 / 0.1 / 0.15) laufen mit.
  - **Brand slogan / Motto** (display-tier, führt): `t.footer.slogan`
    ("Digitale Lösungen, die wirklich passen." / "Digital solutions
    that truly fit.") in kursivem Akzent. Es stand vorher als DRITTE
    von vier Zeilen zwischen Tagline und Untertext — begraben an der
    Stelle, an der es am wenigsten wirkt. Dass die Footer-Zeile
    wiederverwendet wird, hält das Markenversprechen über beide
    Flächen identisch, ohne einen hero-eigenen Key. Die OG-Karte
    (`src/og/render.ts`) trägt denselben Satz fest verdrahtet.
  - **H1** (display): `t.hero.headline + headlineAccent +
    headlineSuffix` — **"Digitalisierung, die *Arbeit* abnimmt." /
    "Digitalization that takes *work* off your hands."** Kursiver
    Akzent auf dem Wort, um das es geht.
  - **`t.hero.tagline` GIBT ES NICHT MEHR.** Die Zeile ("Beratung ·
    Konzept · Umsetzung — alles aus einer Hand.") sagte dasselbe wie
    der Untertext direkt darunter; der Key ist in beiden Sprachen
    entfernt, ebenso aus der `cmsFor`-Fallback-Form beider
    index-Seiten und aus der i18n-Formprüfung. **Das Feld „Tagline"
    im CMS-Editor** (`tds-ext-website-cms-pkg`, `SitesList.tsx`,
    Gruppe `hero`) zeigt seitdem ins Leere — es zu entfernen braucht
    einen eigenen Paket-Release und ist bewusst offen.
  - **Untertext**: `t.hero.sub`, auf zwei Zeilen gekürzt.
  - **Pill**: when `featuredTopic` is passed it renders as an `<a>`
    to the live blog article (pulse-dot · "Im Journal" / "In the
    journal" · title · ↗). When absent, falls back to the static
    availability + location pill.
  > **Gemessen, nicht geschätzt:** das Motto über der H1 wiegt bei
  > 1440 px 30 px gegen 72 px, bei 375 px 20 px gegen 32 px — es liest
  > als Eyebrow, nicht als Konkurrenz. Die Klassenlisten sind
  > unverändert; hier hat sich nur die DOM-Reihenfolge geändert. Wer
  > die Größen anfasst, fasst das Design an.
- **External APIs**: contact form POSTs to
  `https://api.tracht-digital.de/contact`. Journal teaser fetches
  from `https://api.tracht-digital.de/content/blog?limit=3` at
  build time (Astro frontmatter, not at runtime).
- **Dynamic document.title**: inline script at the bottom of
  `Layout.astro` observes every `<section id="…">` and prefixes the
  tab title with the section name as the user scrolls past it.
  Hero keeps the canonical page title; below-hero sections render
  as `<section name> · <brand>`. Label resolution falls back
  through `data-title` → the built-in id→name map → the
  `aria-labelledby` heading's text → aria-label → id. It used to
  read the section's eyebrow instead of the heading; with the
  chapter marks gone the only `.eyebrow`s left are FIELD labels,
  so that path would have titled Contact "E-Mail".
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
  touch scrolling stays fully native. Don't reinstate the old blanket
  `if (isCoarsePointer) return` early-out — it killed the bounce on mobile.
  Both paths plan the jump through **`src/lib/scrollJump.ts`** (DOM-free, unit
  tested), so the destination pixel and the curve are identical and only the
  thing writing the scroll position differs. Three rules that came out of the
  two defects it was extracted to fix — each was invisible to `astro check`,
  the build and the test suite, and each is provable only in a browser:
  - **The touch tween MUST write with `window.scrollTo({ top, behavior:
    "instant" })`, never the two-argument `window.scrollTo(x, y)` form.**
    tds-shared's base.css sets `html { scroll-behavior: smooth }`, and the
    positional form scrolls with behavior `auto`, which resolves to that CSS
    value — so every frame handed the browser a *new* native smooth scroll to
    retarget and the page crawled: measured on an emulated iPhone 13, a jump
    that wanted 4849px had moved **21px after 12 frames** and landed 1366px
    short. That is why section jumps did nothing on a phone. Desktop never
    showed it because Lenis writes its own position with `"instant"` too.
  - **An overshooting ease needs somewhere to overshoot INTO.** Past the top
    or bottom of the document the browser just clamps, so the fixed 1.05
    ease-out-back froze back-to-top at 0 for **38 of its 73 frames** (~630ms,
    over half the animation) while Lenis animated a phantom negative
    `animatedScroll`. `planJump` measures the runway beyond the destination
    *in the direction of travel* and fits the overshoot to it, degrading to a
    plain ease-out at a hard edge. Never hard-code the back constant again.
  - **The header clearance is `scroll-padding-top` on `<html>`**
    (`styles/global.css`), read back by the island — not a JS constant. One
    value then also covers the jumps JS never sees: the fragment landing on a
    cross-page `/#about` (every nav link is one, so every jump from `/preise`),
    back/forward restoration, find-in-page and keyboard focus. It is
    responsive, which the old `-88` was not. Consequence: `tdsScrollTo` hands
    Lenis a resolved **number**, because Lenis applies `scroll-padding-top`
    itself for *element* targets and the clearance would be doubled.
  - **A jump owns the scroll position for as long as it runs**
    (`src/lib/scrollLock.ts`, added 2026-08-24). Wheel, `touchmove` and the
    scroll keys are swallowed until it lands, so the visitor and the tween are
    never writing the same property in the same frame. The two paths used to
    disagree about this and both were wrong: on desktop Lenis simply kept
    overwriting the visitor's wheel, so the page felt stuck; on touch the tween
    **cancelled itself** on the first `touchstart`, so a finger still resting on
    the glass a frame after tapping a nav link abandoned the jump it had just
    asked for and the page stopped between two sections. Four things that must
    survive any edit here, each of which is a way to break a page silently:
    - **The listeners are `{ passive: false }`.** `wheel` and `touchmove` are
      passive by default on `window`, and `preventDefault()` in a passive
      listener does nothing at all — no error, no warning in a production
      build, just a lock that is not one.
    - **Ctrl/⌘ + wheel is ZOOM and is never blocked**, nor are arrows/Home/End
      inside an editable control (the contact form is on this page), nor Space
      on a button or link, nor Tab and Escape. A scroll lock that eats page
      zoom or traps focus is an accessibility bug, not a polish detail.
    - **It always ends.** The listeners come off on completion *and* on a
      safety timeout of the jump's own duration plus a margin. A lock that
      outlives its animation is a page that cannot be scrolled at all, with
      nothing anywhere to say why.
    - **Locked is not frozen: `lenis.scrollTo` is called with `force: true`.**
      A locked Lenis refuses a further `scrollTo`, and clicking a *different*
      nav link mid-jump is navigation, not a fight with the tween — without
      `force` that click did nothing on desktop while the touch path happily
      retargeted.
  `CustomCursor` is an additive dot +
  trailing ring that recolours from sampled background luminance and
  squash-stretches with pointer velocity — fine-pointer only, disabled under
  reduced motion. Both mount `client:idle`.
  Its rAF loop **parks itself** once the trailing ring has caught up and wakes
  on pointer movement, clicks *and scroll*. Scroll is in that list for a reason
  a diff cannot show: the pointer can sit perfectly still while the page moves
  a dark section underneath it, and that is exactly when the ring has to flip
  colour. Before this it ran for the entire life of the page — a wake-up every
  vsync plus an `elementsFromPoint` + `getComputedStyle` walk several times a
  second — on a decoration that is not even visible until the pointer first
  moves. `ScrollProgress` likewise writes its bar's transform **straight to the
  node**: as `useState` it cost a React render, reconciliation and commit on
  every frame of every scroll to move one transform by a fraction of a percent.
  `scrollable` stays state, because it changes about once per page and decides
  whether anything is mounted at all.
- **Favicon**: `public/favicon.png` (901 × 901) is the real TDS
  logomark, shared verbatim with tds-blog-frontend / admin / customer so the
  four properties read as one identity in browser tabs. Matches the
  header `public/images/logo.webp`.

## Server rendering + page cache (2026-08-24)

This site is `output: "server"` (`@astrojs/node`, standalone) behind a
**file-backed full-page cache**. It used to be a static build, and the only
cache between the CMS database and a visitor *was* that build: correcting one
sentence in a content block meant a full CI rebuild and redeploy of every page.
Now a page renders on demand, the result is stored as a plain file the web
server hands out directly, and a content change costs one page render triggered
from the admin panel.

**A cache hit is exactly as fast as the old static site, because it is the same
thing** — `public/.htaccess` serves the stored file and Node never wakes up.

### The moving parts

| Where | What |
|---|---|
| `src/lib/cache.ts` | This site's route table: which pages a content change dates, plus the shared `contentCache` memo |
| `src/lib/pageCache.ts` | The single `pageCache(...)` instance both halves share |
| `src/middleware.ts` | Serves hits, stores renders, refuses to store a bad-site-key render |
| `src/pages/tds/cache/[action].ts` | The control plane: `status`, `rebuild`, `purge` |
| `public/.htaccess` | Cache-first rewrite; ships to `dist/client/.htaccess`, the document root |
| `app.cjs` | Passenger startup file — CommonJS, deliberately |
| `scripts/pack-release.mjs` | Assembles + verifies `release/`, the tree the host checks out |

The mechanism itself lives in `@tracht-digital-solutions/tds-shared/cache`;
only the route table is local.

### Things that cost time to find, in the order they bite

- **`.htaccess` may not ask for `Options +FollowSymLinks`.** Plesk grants its
  vhosts a restricted `AllowOverride Options=…` that omits it, and an Option the
  host does not allow is **fatal rather than ignored**: Apache answers *every*
  request with 500 and logs `Option FollowSymLinks not allowed here` — the whole
  site, not just the rule that wanted it. It shipped that way with the SSR move
  on 2026-08-24 and took the domain down on every path. `Options -Indexes` is
  all this file may set. Nothing here needs more: per-directory rewriting
  already works under the vhost's own grant (`api.tracht-digital.de` rewrites
  everything with `-Indexes` alone), and the `_tds-cache` symlink is created by
  the same user that owns its target, which satisfies SymLinksIfOwnerMatch. If a
  cache hit ever answers 403, grant it at the **vhost** level in Plesk's
  *Additional Apache directives*, which `AllowOverride` does not restrict.
- **The control plane cannot be middleware.** Astro does not run middleware for
  a path no route matches — `App.render()` matches first and short-circuits into
  the 404 response. Mounted in middleware, every rebuild request came back as
  this site's own 404 page: HTML, no cache activity, and a status code that
  reads like a typo in the URL. It is a real route now. (And it cannot live
  under `_cache/` either: Astro excludes any path segment beginning with `_`
  from routing.)
- **A POST to that route must send `Content-Type: application/json`.** Astro's
  `security.checkOrigin` treats a cross-site POST with a form-ish content type
  as CSRF and answers *"Cross-site POST form submissions are forbidden"* —
  which says nothing about content types. The API client sends JSON.
- **Every module-level memo becomes permanent under SSR.** `cms.ts` and
  `legal.ts` both kept one; unchanged, the server would answer with whatever it
  read at boot forever, and a rebuild would faithfully re-render that and report
  success. They go through `contentCache`, which the rebuild invalidates.
- **`process.cwd()` is the project root during a build and the deploy tree at
  runtime.** The committed fallback AGB lived at `src/assets/legal/agb.pdf`, and
  the deploy tree has no `src/` — `/legal/agb.pdf` answered 404 in production,
  i.e. the exact outcome a committed fallback exists to prevent. It is copied to
  `assets/legal` by `tds.release.extraFiles`. The OG renderer has the same
  anchor, which is one of the two reasons its route stays prerendered.
- **A dependency left external must be shipped, and "external" is not
  obvious.** `motion` was, so island SSR resolved `react` by walking *up* out of
  the release tree into the development checkout and ran against a **second**
  React instance — every hook threw `Cannot read properties of null (reading
  'useState')` from a stack naming neither cause. On the host, with no parent
  `node_modules`, the same setup is a bare `ERR_MODULE_NOT_FOUND`.
  `pack-release.mjs` now resolves every external specifier against the release
  tree and fails the build naming the package.
- **`prerender = true` is what keeps satori, `@resvg/resvg-js` and their native
  addon out of the runtime.** Prerendered routes render during `astro build`,
  so their imports never enter the server bundle. The OG card, `404`, `500`,
  `/install`, `kontakt.vcf` and both sitemap routes are prerendered; everything
  else is on demand.
- **`@astrojs/sitemap` is gone.** It derives entries from the routes the build
  *emits*, and this site's two indexable pages are no longer emitted — it would
  have produced a sitemap containing only the pages its own `filter` used to
  exclude, with nothing red anywhere. `src/lib/sitemap.ts` +
  `src/pages/sitemap-{index,0}.xml.ts` replace it, keeping the exact filenames
  `robots.txt` and Search Console already know.

### Running it locally

```bash
npm run build                 # → dist/ + release/ (postbuild assembles + verifies)
cd release && node app.cjs    # the exact tree the host runs
curl -sI localhost:4321/      # X-TDS-Cache: MISS, then HIT
```

The control plane, with the token the app was started with:

```bash
curl -H 'x-tds-cache-token: …' localhost:4321/tds/cache/status
curl -X POST -H 'x-tds-cache-token: …' -H 'content-type: application/json' \
     -d '{"events":[{"type":"block","id":"hero","lang":"de"}]}' \
     localhost:4321/tds/cache/rebuild
```

`npm run dev` is unchanged and uses the same cache, so a stale page in dev is
the same `rebuild` call away.

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
- **`siteConfig.description` is capped at 160 characters, both languages.**
  Google renders roughly the first 155–160 and truncates the rest. Both
  descriptions overflowed until 2026-07-29 (181 de / 175 en) and silently lost
  their trailing Germany-wide qualifier in the SERP; they were shortened by
  dropping one service from each list. `seo.test.ts` enforces the cap and also
  asserts that both keyword targets — the exact phrase "Digitalisierung für
  Unternehmen" and the town — still land *inside* the rendered window. When the
  copy changes, trim the service list before either keyword.
- **Every OTHER indexable page's description is capped too, and now measured.**
  `siteConfig.description` is only the home page plus the fallback; `/preise`,
  `/en/preise`, `/legal/impressum` and `/legal/datenschutz` write their own
  literals, and those were unguarded — which is how both legal pages sat at
  **62 characters** until 2026-08-16. That is below the length at which a
  description carries information, so search engines discard it and synthesise
  their own from the page body. `seo.test.ts` now reads the literals back out
  of those pages and holds them to ONE budget (80 < n ≤ 160), requires each
  page's description to be distinct (a page repeating the home copy is a
  duplicate-content signal), and checks the Impressum description against the
  published NAP, since it doubles as a local-search signal.
  The two pricing pages each declare the same `{ de, en }` pair and select by
  locale, so the test models the SELECTION — reading every declared literal
  would report four strings where the site publishes two, and the duplicate
  check would fail on correct copy.
  `/legal/agb` is deliberately excluded: it renders `noindex`.
- **Footer NAP:** the footer renders `siteConfig.address.postalCode +
  addressLocality` ("21493 Schwarzenbek") hardcoded from `seo.ts`, NOT
  the CMS `contact.location` string — it must always match the
  Impressum and the JSON-LD PostalAddress (local-SEO NAP consistency).
  The street deliberately stays Impressum-only.
- **`src/lib/jsonld.ts`** renders Schema.org graphs
  (Organization+ProfessionalService with `geo` GeoCoordinates +
  `knowsAbout`, Person, WebSite, Service+OfferCatalog for `/preise`,
  BreadcrumbList). All entities share stable `@id`s
  (`tracht-digital.de/#organization`, `/#person`) so tds-blog-frontend can
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
  pipeline mirroring tds-blog-frontend. Builds a static 1200×630 brand
  card at `/og/default.png` used as the fallback OG image. The card
  renders in Lato (`src/og/fonts/Lato-Bold.ttf`) — the OG headline
  dropped the former Instrument Serif when the brand retired the serif.
- **`src/pages/kontakt.vcf.ts`** — build-time static endpoint → `/kontakt.vcf`.
  Generates a vCard 3.0 from `siteConfig` (single source of truth, so it never
  drifts from the Impressum / LocalBusiness JSON-LD), served as the "Kontakt
  speichern" / "Save contact" button in `Contact.astro`'s aside. The link has **no
  `download` attribute** — with the `text/vcard` MIME (`AddType text/vcard .vcf` in
  `public/.htaccess`) mobile opens the "add contact" flow while desktop downloads.
  Excluded from the sitemap (`astro.config.mjs` filter drops `.vcf`). The button
  label is inlined (`lang` ternary) with a `TODO: promote to tds-shared-pkg` — the only
  copy not yet in tds-shared-pkg. Embeds the portrait as a **base64 JPEG `PHOTO`**
  (`src/assets/portrait-vcard.jpg`, read at build via `process.cwd()` not
  `import.meta.url` — same bundling trap as the OG renderer; folded to ≤75 octets
  per RFC 2426). **No `ADR`/`GEO`** — the postal address is intentionally omitted
  (private home address).
- **`public/robots.txt`** explicitly allows GPTBot, OAI-SearchBot,
  PerplexityBot, ClaudeBot, Google-Extended (etc.) and points
  at the sitemap.
- **`public/llms.txt`** is the llmstxt.org-convention markdown
  directory of services + pages for AI crawlers.

## Mobile navigation (2026-08-18, tds-shared 0.25.0)

This header WAS the reference the blog and the tools site were aligned to, so it
moved into the library rather than being copied twice more. `Header.astro` keeps
its markup, its docked-pill look and its scroll morph; the menu's mechanics come
from `mountMobileNav` (`@tracht-digital-solutions/tds-shared/nav`) and the sheet
from `.tds-mobile-menu`.

- **The reference lacked two things and now has them:** focus moves into the
  panel on open, and Escape hands it back to the hamburger. The blog and the
  panel host already did this; the shared version is the union, not this file's
  old behaviour.
- **Never hide the toggle or the panel with `lg:hidden`.** tds-shared is
  unlayered CSS and Tailwind's utilities sit in `@layer utilities`, so `hidden`
  on an element wearing `.btn` loses outright — the breakpoint belongs to
  `.tds-menu-toggle` / `.tds-mobile-menu`. A utility here is a silent no-op.
- **`--tds-mobile-menu-inset` must match the panel's `top-[…]`**, because the
  shared `max-height` subtracts it. They agree at `5.25rem` today;
  `src/__tests__/header.test.ts` fails if they drift, since a fixed panel that
  overflows shows no scrollbar and throws no error.
- The `<script>` must stay non-`is:inline` — an inline script is not bundled and
  the import would reach the browser as a bare specifier.

## Dark mode

- All four frontends share a `data-theme="dark"` theme. A no-flash
  inline script in `Layout.astro` sets `data-theme` on `<html>` from
  the `tds-theme` localStorage key (or the OS `prefers-color-scheme`
  fallback); the `ThemeToggle` island flips and persists it.
- **That script is no longer hand-written here.** It is
  `themeBootstrapScript` from `@tracht-digital-solutions/tds-shared/astro`,
  shared with the blog and the frontend host (all three had their own copy).
  Inject it as `<script is:inline set:html={themeBootstrapScript} />` — as a
  template body (`{…}`) Astro would leak the literal braces into `dist/` and the
  script would never parse — and keep `is:inline`, or Astro defers it into a
  module and the theme lands after first paint, which is the flash it prevents.
  The storage key itself lives in `tds-shared/design` as `THEME_STORAGE_KEY`.
- Tokens live in `src/styles/global.css`. The structural tokens
  (`--color-primary`, `--color-black`, `--color-paper`, …) **flip**
  in dark mode so they read as foreground accents on a dark ground.
  Anything that must stay a fixed dark surface in both themes uses
  `--color-surface-navy` (brand navy frontends/buttons),
  `--color-surface-accent` (burgundy, gradient end) or
  `--color-surface-ink` (footer). Elevated cards/glass use
  `--color-card` (white → dark), referenced via `color-mix()` for
  translucent glass so the light look is unchanged.
- The dark ground is a deliberate deep-navy family (not a warm black)
  with warm-ivory text — keep new dark surfaces in that family so the
  palette stays cohesive.

## The cache must not outlive the build (2026-08-24)

The hero section disappeared from the live site a few minutes after a release,
and the cause was neither the hero nor the release. Worth knowing in full,
because every symptom pointed away from it:

`public/.htaccess` serves a stored page straight off disk, and the store is
deliberately built to survive a deploy (it lives outside the deploy tree, with
a symlink re-created on every boot). That is right for the store and wrong for
its contents: a stored page is HTML, and that HTML names the build's assets by
content hash. **A deploy rotates every one of those names**, so the cached
document asked for `/_astro/Hero.CXaElEfT.js` while the host had
`Hero.xeQNzAUp.js`.

Every island's JS 404ed, so nothing hydrated — and the *only* section that
disappears when hydration dies is this one, because the hero's headline and
slogan are `motion` elements whose SSR markup carries the `initial` state
(`opacity: 0`) and are revealed by the entrance animation. Every other section
is plain Astro HTML and rendered normally. Nothing was red: `200`,
`x-tds-cache: HIT`, healthy server, and all the new assets present under their
new names.

Fixed in **tds-shared 0.32.0** (`resolveCacheDirs` fingerprints the asset
filenames and empties the store when they change; an absent marker counts as a
mismatch). Two consequences here:

- **Keep the `tds-shared` pin at `^0.32.0` or newer.** A 0.x caret is
  minor-locked, so pinning back below it silently restores the bug.
- **After a deploy the first visitor to each page pays one render.** That is
  the correct price and it is what the old static build charged on every
  content change instead.

## Toolchain + tests (2026-08-24)

TypeScript **6**, vitest **4**, jsdom **30**, satori **0.33**, Astro **7.2.6**,
motion **13** — the same line `tds-blog-frontend` and `tds-tools-frontend` are
on, which this repo had fallen behind. `npm run type-check` (astro check) stays
the correctness gate for `.astro`; `npm run test:run` covers `src/lib` and the
islands. Three things worth knowing before touching either:

- **`tsconfig.json` excludes `release/` and `var/`.** `release/` is the
  deployable tree `scripts/pack-release.mjs` assembles out of `dist/` —
  bundled, minified dependency code, not source. It is gitignored, so it is
  invisible in a diff and absent in CI, and present on any machine that has run
  `npm run build`: `astro check` was type-checking ~40 bundled chunks of every
  dependency and reporting *their* internal deprecations as hints. 131 files
  checked became 83, and 155 hints became 0. The same trap has already been
  fixed in the blog and is still open in `tds-tools-frontend`, where it makes
  `astro check` run out of V8 heap.
- **The default vitest environment is `node`, not jsdom.** It was jsdom "so
  island tests work", but not one suite in this repo ever touched a DOM global,
  and building a jsdom per test file cost **127 of the run's 130 seconds**. A
  suite that genuinely needs a document opts in per file with
  `// @vitest-environment jsdom` — which is also the only place a reader can
  see that it needs one. `src/lib/scrollLock.test.ts` is the current example.
  The run is now ~0.5s.
- **motion 13's only breaking change is the removal of
  `@emotion/is-prop-valid`**, which affects CSS-in-JS consumers. Nothing here
  is one — every island is styled with Tailwind classes — which is why the
  upgrade needed no code change. Verified by a pixel diff of both languages at
  desktop and mobile widths against a build of the previous code and the
  previous deps: identical dimensions on every page, and a residual difference
  no larger than the noise floor of loading the *same* build twice (the
  `TechMarquee` animation offset).

## Don't

- **Don't revert to `output: "static"`.** This entry used to say the opposite —
  *"the production host has no Node runtime, this site MUST stay static"* — and
  it was true until 2026-08-24. The Plesk host now runs this site as a Node app
  under Passenger, and the site is `output: "server"` behind a file-backed page
  cache. See "Server rendering + page cache" below before changing anything in
  `astro.config.mjs`, `src/middleware.ts` or `scripts/pack-release.mjs`.
- Don't add a route that renders per-visitor state on the server. Every page
  here is cached by path, so anything derived from a cookie, a session or an
  `Accept-Language` header would be served to the next visitor as well.
  `AccountMenu` is `client:idle` and reads `/me` in the browser precisely for
  this reason — keep it that way.
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
- Don't add per-frontend brand tokens, hand-author a radius, or duplicate
  the shared design CSS. Geometry belongs to
  `tds-shared/styles/surfaces/marketing.css`; tokens to `base.css`;
  cross-surface components to `primitives.css`. Edit there and bump the
  version. (The old convention was the opposite — "geometry stays
  app-local" — and that is exactly what let one design drift into three
  separately-maintained variations.)
- Don't fetch the journal teaser at runtime. Build-time fetch in
  `index.astro` frontmatter so the rendered HTML ships static.
- Don't judge a mobile layout from the diff. `body { overflow-x: hidden }`
  (base.css) *clips* horizontal overflow — no scrollbar, no console warning,
  the content on the right simply is not there. The AGB heading overflowed
  375px by 61px on the first pass because "Geschäftsbedingungen" is one
  unbreakable 20-character word at `text-4xl`; a green build and a clean
  `astro check` both said nothing. Render the page at 375px and measure
  `document.documentElement.scrollWidth - window.innerWidth`.
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
- Don't put a label above a section headline at all — no
  `.section-num` chapter mark, and no hand-inlined
  `text-xs font-medium tracking-widest uppercase` stand-in (that
  inline form is exactly how Journal and `/preise` kept theirs after
  the class was dropped everywhere else). `.eyebrow` is for FIELD
  labels — contact details, footer columns, the Currently
  sub-headings — not for naming a section.
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
  (as of the 2026-06-04 build refactor on tds-shared-pkg 0.4.0). It pins the
  Safari floor so lightningcss keeps the `-webkit-backdrop-filter` prefix
  on the frosted header; a hand-copied array drifts and the blur silently
  dies in Safari ≤17. See tds-shared-pkg#10.
- Don't read `translations.de` (or `.en`) directly from an .astro
  file. The `tFor(Astro.currentLocale)` helper is what makes the
  EN route actually render EN; bypassing it puts the file back
  into the "language toggle does nothing" pre-i18n era.
- Don't inline service titles, descriptions, or form copy in the
  `.astro` files. Editable copy lives in `tds-shared-pkg` so the same
  string ships to every front-end. Short-lived inlining is fine
  during prototyping — wrap it in a `TODO: promote to tds-shared-pkg`
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
  pattern lives in tds-blog-frontend/src/lib/jsonld.ts.

## Site key (`TDS_SITE_KEY`)

The credential this site presents to the composed API for its **build-time**
content reads. Issued in the admin portal under *Einstellungen →
Site-Verbindungen*; `src/lib/siteKey.ts` reads it and every fetch in
`src/lib/` carries it.

Optional: unset, the build behaves exactly as before, and the public read routes
stay open unless an admin switched enforcement on.

Four things here were each learned by breaking:

- **`process.env`, never `import.meta.env`.** Astro/Vite inline only `PUBLIC_`
  names there, and this repo declares no `envField` schema, so
  `import.meta.env.TDS_SITE_KEY` would be `undefined` in every build with
  nothing to say so. That is exactly how `TOOLS_REGISTRY_TOKEN` spent its whole
  life. And the obvious "fix" — a `PUBLIC_` prefix — is worse: it inlines the
  credential into the shipped bundle.
- **A `throw` from the fetch helper does NOT fail the build.** Every content
  fetch is wrapped in a fail-soft `try/catch` that warns and returns the baked
  fallback. The first version threw from `assertKeyAccepted`; a real build
  against a 401 stub printed "the build stops here" five times and then
  completed **green**. No source-scanning test could see it.
- **So the guarantee is the `siteKeyGuard()` integration** in
  `astro.config.mjs`, which throws in `astro:build:done` — outside every
  `try/catch`, including one somebody adds later.
- **The rejection list hangs off `globalThis`.** `astro.config.mjs` and the page
  modules are two separate module graphs, so a module-scoped array gives the
  integration its own empty one: the guard reads zero while the pages record
  several. That was the second version and it failed identically — green build,
  message printed, nothing stopped.

Verified as a matrix, because three of the four cells must NOT fail: rejected
key → exit 1; no key against a 401 → exit 0; key set but API unreachable →
exit 0 (an API hiccup must never fail a deploy). `src/lib/siteKey.test.ts` pins
the structural half.
