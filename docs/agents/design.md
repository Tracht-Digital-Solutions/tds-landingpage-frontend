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
- **Subpages carry no numbering.** Service pages and pricing cards show no chapter number; the process stepper
  uses dots (the `<ol>` and connector carry the sequence). `ServiceDefinition.number` orders the catalog but
  isn't display text. The home page's Process section is the one place that numbers.

## One ground

`.page-ground` in `Layout.astro` is one viewport-anchored layer carrying the brand fields; `body` is
`--color-paper`. No section paints its own tone or `.tds-wash`. The navy contact block (`.tds-tone-navy`)
paints over it.

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
- **Never transition a `box-shadow`.**

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
- **The receiver can be swiped up** like answering a call (`lib/receiverSwipe.ts`): a tap follows the link; held,
  it shows a slide track; dragged to the top it opens the form immediately; released earlier it springs back.
  Capture starts only after the slop; `touch-action: none` sits on the receiver alone.

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

## Hero decoration

Decoration lives only in the hero's negative space, never behind the copy or the fixed header
(`npm run audit:ux` measures overlap). On a phone: a quarter in the top band and a capsule in the bottom band;
on short screens (`max-height: 46rem` below 80rem) none. Scroll drift and the conduit stay desktop-only (80rem).
Under the slogan a `.tds-brandbar` draws itself (transform only) and the copy drifts up on scroll-out. Motion
details: [motion.md](motion.md#hero).

## Dialogs and semantics

- **A `<dialog>` needs `margin: auto` spelled out**; Tailwind's preflight resets `margin: 0`, and the dialog opens
  top left. `previewLightbox.test.ts` checks every `.astro` file with a `<dialog>`.
- Keep `SectionHeader` and `AccentLetters` semantics; accent letters need one accessible label and stop
  transforming under reduced motion.
- Test desktop, 375 px, both themes and reduced motion. Overflow can be clipped invisibly; measure the rendered
  page.
