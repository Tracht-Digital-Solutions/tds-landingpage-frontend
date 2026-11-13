# Design invariants

This site uses tds-shared's `marketing` surface. Preserve its language rather than rebuilding it locally.

## Foundations

- Lato display, Plus Jakarta Sans body, JetBrains Mono for technical microcopy. Import Fontsource packages from
  layout frontmatter; a CSS `@import` breaks their relative URLs.
- Navy, burgundy, warm white, sand and coral/pink; light and dark themes; borderless hierarchy; 6 px cards;
  pill buttons; washes, brand bars, circuit lines, constructed geometry.
- Shared tokens, primitives, geometry and surface behaviour belong in tds-shared. Local styles are for
  composition unique to this site.
- A borderless card's fill must differ from its ground; keep a visible hover response and `:focus-visible`.
  Never remove a focus ring.
- Avoid generic SaaS styling, new palettes, glows, organic blobs, blurred shadows, strong gradients, gratuitous
  motion and tech-stack diagrams.
- **Nothing is numbered.** Service pages and pricing cards show no chapter number; both process steppers (home
  and detail) use icon dots (the `<ol>` and the rail carry the sequence; since 2026-10-12 the home page too).
  `ServiceDefinition.number` orders the catalog but isn't display text.

## One ground

`.page-ground` (`components/PageGround.astro`, mounted in `Layout.astro`) is one viewport-anchored layer: paper
plus generated 3D brand shapes (2026-11-03). `body` is `--color-paper`. No section paints its own tone, `.tds-wash`
or photo ground; the navy contact block (`.tds-tone-navy`) paints over it.

- **The shapes are generated, not placed**: `lib/groundShapes.ts` seeds three depth planes (far/mid/near), each a
  tile drawn three times so the loop has no seam. Same seed on every render (cache-safe). Few and large: five
  bodies per tile (6–22 rem), all in the outer bands, three outline rings each. Below 48rem they shrink to 62 % and
  the near plane is off; print and `bare` pages get plain paper.
- **Quiet on purpose**: the layer sets its own `--tds-decor-shape-alpha` / `--tds-decor-line-opacity`. Raising them
  needs `audit:contrast`.
- **No photo on the page ground**: hero, "about" and detail-head photo grounds were removed because they covered
  the shapes.

- **Nothing between `body` and that layer may create a stacking context** (a `transform`, `filter` or `opacity`
  on `<body>` hides the ground silently).
- Check every borderless card's fill against `--color-paper`.
- `--lp-surface-card` is the card fill; both numbers in it are measured (see the comment in
  `styles/global.css`): it must separate from paper **and** keep `--color-muted` above 4.5:1. Re-measure both and
  run `npm run audit:ux` before touching it.

## Full width

Every section, the header and footer sit in `.lp-container`: full width, gutter
`clamp(1.5rem, 1rem + 3vw, 5rem)`, no max-width. Text blocks keep their own `max-w-*`. Check 375, 1920 and
2560 px for overflow.

## Arrows and seams (0.101.0)

- **One arrow: a chevron without a shaft.** `components/ui/Arrow.astro` (islands: `ui/Arrow.tsx`, paths in
  `lib/arrowPaths.ts`) replaces every "→", "←", "↗", "↓" glyph and every drawn arrow with a middle stroke. New
  arrows use it; don't type the glyphs again.
- **Section seams are short and centred** (`ui/SectionSeam.astro`): a few rem of hairline either side of the
  small brand bar, not a rule across the content width.

## Home cards (0.101.0)

- Services: masthead "Digitale Lösungen" (code-owned in `Services.astro`), link "Mehr Leistungen", tiles 4:5 from
  `md`. The tile body is exactly eyebrow plus two title lines, the words at its bottom, so a one-line title leaves
  no padding under the text.
- Projects (`ui/ProjectCard.astro`): 16:9 shot, text clamped to two lines, `labels` as chips at the foot of the
  body. Labels are code-owned: `DemoDefinition.labels`, `OwnProject.labels`, a study's sector split at " · ", the
  business card's two. Demos no longer show their host as a caption.

## Mastheads (2026-11-03)

Every section heading is left-aligned from `md` (phones centre them), "Projekte und Referenzen" included. An
alternating left/right order was tried and dropped the same day; don't bring it back.

## Hard 2D shadows (tds-shared ≥ 0.42)

- Boxes take `--tds-shadow-hard`, controls `--tds-shadow-hard-sm` and press into it with `translate`. The tokens
  come from the marketing surface; `global.css` applies them through a zero-specificity `:where()` list (cards by
  class and `rounded-[6px]`, pill links, CTAs).
- A scroll track keeps padding for the offset (showcase, packages); a seam mosaic takes **one** shadow on its
  container.
- Hover and keyboard focus lift an interactive element 2 px up-left while the offset grows
  (`--tds-shadow-hard(-sm)-hover`, tds-shared ≥ 0.42.2). FAQ rows are round cards that lift the same way.
- **A control's hard shadow is a dark shade of its own fill:** each control names its fill `--lp-fill` (rest and
  hover), and the `:where()` list at the end of `global.css` re-declares the shadow tokens on it. A new control
  joins that list (or takes `.lp-ink`). Twins over dark bands keep black ink.
- **No navy shadow under a navy fill** (0.73.0): navy 45 % into black is still navy. Every navy-family
  `--lp-fill` (surface-navy, primary and its mixes) sets `--lp-shade: var(--color-accent-pink)`; every other
  fill sets `--lp-shade: initial` so no coral leaks down from an ancestor. In the dark theme an unshaded fill
  takes the dark ink (`rgb(147 167 255 / .32)`), never a darker copy of a dark fill.
- **Focused fields show no ring**; tds-shared colours their pressed-in well (coral in the navy contact
  section). **Errors shake** through tds-shared's `errorBounceScript` in `Layout.astro`.
- **Never transition a `box-shadow`.**
- **Form controls are pressed in, not lifted:** fields, checkboxes, radios and switch tracks (`.vat-switch`) take an
  inset (`--tds-shadow-inset`), never the outer offset. Only buttons and boxes join the `:where()` lists.

## The floating pill (`FloatingCta.astro`)

One navy pill with pill radius and a hard shadow, holding three transparent 3rem buttons in slots: "Nach oben",
the accessibility tools, and a telephone receiver that leads **only** to the contact form
(`aria-label` "Zum Kontaktformular", no `tel:`).

- A slot folds with `grid-template-rows: 1fr ↔ 0fr`, so the pill grows and shrinks upwards. "Nach oben" opens
  after a viewport of scroll; the receiver folds while `#hero` or `#contact` is on screen and on short viewports
  while the cookie notice is open; the tools never fold. Motion only pops the icon of an opening slot
  (`lib/motion/floatingCta.ts`).
- Hover turns the whole pill bordeaux. The receiver is a pink disc (navy on hover).
- **The colour changes exactly at a dark band's line:** an inverted twin (`makeTwin`, `lib/darkSplit.ts`:
  `aria-hidden`, `inert`, no ids, links or popover; links become spans) lies over the pill, and both are clipped
  per scroll frame (`splitClip`). The twin mirrors fold attributes and, via `+`, hover and press; its tokens are
  re-declared (a `var()` in a custom property resolves where it is declared).
- It publishes `--lp-floating-lane` so `scroll-padding-bottom` keeps focused elements above it. The lane offset is
  a `translate`, not `bottom` (a `bottom` change after the cookie notice measured 0.033 CLS).
- **The receiver is swiped LEFT** like answering a call (`lib/receiverSwipe.ts`, sideways since 2026-10-18): a tap
  follows the link; held, a track runs out of the pill to the left (72–144 px, 16 px from the window edge); dragged
  to its end it opens the form immediately; released earlier it springs back. Capture starts only after the slop;
  the receiver has `touch-action: pan-y`, so a vertical swipe over it still scrolls. While swiping, the twin's clip
  reaches left over the track (`splitClip(…, reachLeft)`).
- The pill never hides on scroll, on any width (2026-10-19, asked for): the phone-only tuck to the right while
  scrolling down was removed — the contact action vanished exactly while someone was reading.

## Accessibility tools (`components/A11yTools.astro`, `lib/a11yPrefs.ts`)

Larger text, higher contrast, motion off: `aria-pressed` switches in a native popover docked to the pill's left,
stored in localStorage and applied by an inline head script before first paint. Every JS motion path asks
`lessMotion()` (or `data-a11y-motion`) as well as the media query.

## Bookmarks (`PropertyTabs.astro`)

Journal, Tools, Kundenportal, Shop on the left edge (`propertyLinks()` in `lib/navigation.ts`: `propertyHome`
from tds-shared, the portal from `siteConfig.portalUrl`).

- Parked with only the icon out (`translate: calc(-100% + peek)`); they slide in on hover or focus (CSS, or a
  Motion spring with neighbours leaning out, `lib/motion/propertyTabs.ts`).
- Desktop with a mouse only (`(min-width: 64rem) and (hover: hover) and (pointer: fine)`); on a phone the same
  links are the mobile menu's second block. No "Journal" in the desktop header bar.
- The nav is `overflow: clip`, or parked parts count as overflow in `audit:ux`.
- Over a dark band the colour changes at the line like the pill (twin + `splitClip`, hover mirrored with `:has()`).

## Hero background

None of its own (2026-11-03): the photo, the capsule, the quarter and the conduit are gone. The hero lies on the
page ground ([One ground](#one-ground)), whose bodies are built the same way — a filled face plus outline rings
(`translateZ` steps in `transform-style: preserve-3d`); outline rings, not filled layers, because stacked
translucent fills darken the face. Under the slogan a `.tds-brandbar` draws itself by a round `clip-path` (never a scale: every brand-bar segment stays a pill, tds-shared ≥ 0.54) and the copy drifts up on scroll-out. Motion
details: [motion.md](motion.md#hero).

## Header: two islands (2026-10-12)

`Header.astro` is a click-through frame (`pointer-events: none`) holding two `.site-island` pills: the logo on
the left, links + theme + language (+ burger on a phone) on the right, aligned to the page gutter. Each island
paints its own glass (`::before`) and hard-shadow plate (`::after`); docked at the top both are transparent,
scrolled they fill and the plate clicks in (`audit:nav` samples the first island). The island's content needs
`position: relative; z-index: 1` through `:global` — child components and `<astro-island>` (`display:
contents`) otherwise paint under the glass and vanish.

## Section offsets (2026-10-12)

A section jump lands with the section's top edge on the top of the screen, not under the header: `main
section[id]` has `scroll-margin-top: calc(-1 * var(--lp-header-clearance))`, which cancels the header's
`scroll-padding-top` for sections only (focused links keep it). `lib/smoothScroll.ts` adds a target's
`scroll-margin-top`, so jumps, the section snap and fragment links land on the same pixel. Every home section's
upper padding is at least `--lp-section-top` (header + 1rem, `HomePage.astro`), so its heading clears the
header.

## Dialogs and semantics

- **A `<dialog>` needs `margin: auto` spelled out**; Tailwind's preflight resets `margin: 0`, and the dialog opens
  top left. `previewLightbox.test.ts` checks every `.astro` file with a `<dialog>`.
- **An open modal owns the scroll** (2026-10-12): `lib/motion/dialog.ts` sets `html[data-modal-open]`
  (`overflow: hidden`, dialogs `overscroll-behavior: contain`) and clears it on `close`; Lenis' `prevent`
  skips every wheel while it is set. Before, Lenis turned the wheel inside a dialog into a scroll of the page.
- Section headings are plain text (`lib/heading.ts`, 2026-11-13): no italic accent word, no closing full stop.
  Only the hero keeps a display treatment.
- Test desktop, 375 px, both themes and reduced motion. Overflow can be clipped invisibly; measure the rendered
  page.

## No gradients

No surface on this site uses a gradient (`noGradients.test.ts`): scrims are flat veils, the page ground is one colour, and the
brand bar's hard-edged segments are its only `linear-gradient`, in tds-shared. Tooltips are tds-shared's `hoverTipScript`, at the pointer.

## Dark rules and the theme hover preview (0.97.0)

Never write `:root[data-theme="dark"] X`: the hover preview's copy carries its own `data-theme`, so such a
rule misses a dark copy and leaks into a light one. Use
`:is(:root, .tds-theme-preview__page)[data-theme="dark"] X:not(:where([data-theme="dark"] [data-theme="light"] *))`
(`themePreviewSelectors.test.ts`; pattern documented in tds-shared `docs/agents/theme-motion-app.md`).
