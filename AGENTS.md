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
  `.section-num`, `.eyebrow`, `.lead`. `.display*` / `.eyebrow` / `.lead`
  come from `base.css`; **`.section-num` and `.brand-wordmark` come from
  `primitives.css`** — they previously lived only in `app.css`, which this
  site deliberately skips, so both shipped **completely unstyled** here
  despite 7 components using them (verified: 0 occurrences in the built
  `dist/_astro/Layout.*.css`). `app.css` is still not imported — that is
  dashboard chrome — but the cross-surface primitives now are. The bespoke
  section styles (accent-letters, hero, marquee, cursor, floating CTA, glass
  nav pill) stay local.
  `SectionHeader.astro` is the shared masthead component
  for the homepage sections; each section's eyebrow goes through
  `.section-num` (with leading hairline rule) or `.eyebrow` for callouts.
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
  posts. `localCovers` in the component still maps those slugs to
  `/journal/*.webp` when a post has no live `coverHint`.
- **Consulting section** (`src/components/sections/Consulting.astro`):
  Gradient card matching `PricingTeaser`'s visual language so the
  two callouts pair as a system. Two CTAs — primary
  "Erstgespräch buchen" / "Book a discovery call" → `#contact`,
  secondary "Leistungen ansehen" / "See services" → `/preise`. Copy
  via `t.consulting.*` in tds-shared-pkg 0.2.5+.
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
  white, the rim is a warm hairline and the scrolled shadow is a
  suggestion (`0 8px 22px -16px`). Depth comes from the fill contrast
  against the page, not from the drop. Below
  `lg` the pill docks against the top edge (`top: 0`, flat top
  border, 24px-rounded bottom), is always rendered with chrome,
  spans `left-3 right-3`, and ends in a 44px hamburger that
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
- **Hero composition**: three stacked title tiers in addition to
  the data-driven pill.
  - **Pill**: when `featuredTopic` is passed it renders as an `<a>`
    to the live blog article (pulse-dot · "Im Journal" / "In the
    journal" · title · ↗). When absent, falls back to the static
    availability + location pill.
  - **H1** (display): `t.hero.headline + headlineAccent +
    headlineSuffix` — currently **"Software, die mit Ihrem
    *Unternehmen* wächst." / "Software that grows with *your*
    business."** (tds-shared-pkg 0.2.7). Italic accent on the personal
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
  logomark, shared verbatim with tds-blog-frontend / admin / customer so the
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
- **`siteConfig.description` is capped at 160 characters, both languages.**
  Google renders roughly the first 155–160 and truncates the rest. Both
  descriptions overflowed until 2026-07-29 (181 de / 175 en) and silently lost
  their trailing Germany-wide qualifier in the SERP; they were shortened by
  dropping one service from each list. `seo.test.ts` enforces the cap and also
  asserts that both keyword targets — the exact phrase "Digitalisierung für
  Unternehmen" and the town — still land *inside* the rendered window. When the
  copy changes, trim the service list before either keyword.
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
