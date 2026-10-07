# Motion

Motion is the Motion library on plain markup (tds-shared ≥ 0.40). `lib/motion/boot.ts`, mounted once from
`Layout.astro`, loads `tds-shared/motion/dom` (vanilla Motion) with `import()` at idle (immediately only after
an internal navigation), and nothing under reduced motion. `src/__tests__/motion.test.ts` holds the rules.

## Rules

- **Start states are written from JS, only onto elements that are off screen**; an element on screen when Motion
  mounts is never reset.
- **Pass explicit keyframes (`[0, 1]`)** when a start state comes from CSS; Motion otherwise reads the resting
  computed value and the animation jumps.
- **Nothing a visitor reads animates from `opacity: 0`.** The headline rises as one block; a per-word split once
  fragmented the H1 and stole the LCP element.
- Every JS motion path also respects the site's motion switch (`lessMotion()` / `data-a11y-motion`).
- The shared React motion entry re-exports only `m` and `AnimatePresence`; a bare `motion` import is forbidden.

## What moves

| Element | Module | Behaviour |
|---|---|---|
| CTAs (`[data-cta]`) | `cta.ts` | Magnetic pull (14 px) under a fine pointer with a bouncing return, press squeeze, one light sweep on arrival. The floating pill is **not** a `[data-cta]` |
| Floating pill | `floatingCta.ts` | Springs its slots |
| Bookmarks | `propertyTabs.ts` | Slide-in springs, neighbours lean |
| Brand bars | `brandbar.ts` | Each `.tds-brandbar` is split into three `aria-hidden` key spans coloured from the bar's computed layers (`.lp-brandbar-keys` hides the layers) and played like keys: the key under the pointer jumps and stretches on a stiff spring, neighbours follow, all drop back with a crisp bounce. Only the spans' `transform` is written |
| Drawn cursor | `islands/CustomCursor.tsx`, `lib/cursorAbsorb.ts` | See below |
| Page scroll bar | `pageScrollbar.ts`, `components/PageScrollbar.astro` | See below |
| Generated photos (`[data-motion-image]`) | `images.ts` | Settle from a larger scale on scroll-in, then drift ±20 px; transform only |
| Page transitions | `pageTransition.ts` | `<main>` animates out on a same-site click and the next `<main>` in. The header is fixed outside `<main>`. Hand-over via a sessionStorage flag read by an inline head script (`PAGE_ENTER_SCRIPT`), CSS failsafe after 1.5 s; a first visit never carries it. The native cross-document View Transition was removed |
| Business card | `businessCard.ts` | Docked card spring |
| UX cues | `ux.ts` | A pill glides behind the header link of the section on screen (`aria-current="location"`); price cards arrive staggered and lift on hover; contact form rows arrive as one staggered group (`[data-motion-stagger]`, honeypot skipped) |
| Modals | `dialog.ts` | Bounce in and out (Escape included; `cancel` is intercepted), always ending in `dialog.close()` behind a timeout. One flat navy backdrop, one flat dialog colour, a bare close cross |

Scroll reveal stays `lib/reveal.ts` (`[data-reveal]`).

### Drawn cursor

While it runs (`data-cursor-absorb` on `<html>`) the native pointer is `cursor: none !important` on the whole
page; the dot is the hotspot.

- Dot and ring are `popover="manual"` and re-shown when a dialog or popover opens, or a modal would cover them.
- Over an action control (button, `[role=button]`, submit, `summary`, `.btn`, `[data-cta]`) it turns white on a
  dark control and brand blue on a light one, and stays on the pointer. The ring follows at 0.5 per frame.
- It listens to **pointer** events: a `preventDefault()` on `pointerdown` (the floating scroll bar) suppresses
  mouse events for the whole press.
- Colours are read through a 1×1 canvas; computed fills come back as `oklab()` / `color()`.
- Touch and reduced motion keep the native pointer.

### Floating page scroll bar

With a mouse the native bar is switched off in `<head>` (`data-page-scrollbar`), and
`components/PageScrollbar.astro` floats an arrow–thumb–arrow bar over the content, invisible until the pointer is
within 72 px of the right edge.

- `data-state` hidden / shown / active works in CSS alone (also under reduced motion); Motion slides it in and
  widens the thumb and arrows quickly (≤ 0.18 s).
- Navy pill with the hard shadow, bordeaux while held. Hidden, it slides only to the window edge (6 px).
- Touch and `bare` pages keep the native bar.

## Hero

- The hero's **copy** stays plain Astro. Its decorative geometry is `islands/HeroDecor.tsx` (`client:idle`).
- The decoration arrives visibly, drifts at about 5–10 px/s and follows the pointer about 60 px.
- The scroll-linked part is CSS (`animation-timeline: view()`), not a hook.
- **On a phone the shapes keep to measured bands:** smaller, less drift (`narrow` in `HeroDecor.tsx`, never in
  `initial`, which is server-rendered; a width-dependent start state was a hydration mismatch), no scroll drift.
  `audit:ux` at 360 × 740 is the tightest case.
- `npm run audit:perf` measures 390 px and 1440 px and pins `h1#hero-heading` as the LCP element on both.

## The service explorer and assistant

- The explorer's navy marker slides behind the open title on desktop.
- The assistant dialog: a segmented progress, questions sliding in from their side (`AnimatePresence` with
  `initial={false}`, focus via a stable callback ref), round answer cards that lift and pop a tick, staggered
  result cards (best fit navy, hand-off CTA pink).

## Showcase drift

See [website-demos.md](website-demos.md#the-showcase-shelf).
