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
- **Nothing runs off screen** (2026-10-11). Endless CSS/Web Animations are paused by tds-shared's
  `offscreenAnimationScript` (inline in `Layout.astro`). JavaScript loops gate themselves: the hero's Motion loops
  and its pointer listener stop when `#hero` leaves the viewport, the Lenis loop in `SmoothScroll.tsx` runs only
  while Lenis scrolls (parks after 30 still frames; `lenis.time = 0` before a wake), the showcase drift and the
  brand-bar keys use `inView`, the cursor parks when settled, the pill's chevrons loop only while the swipe track
  shows. Check: count `requestAnimationFrame` calls over 2 s at the page bottom — it must be 0.
- The shared React motion entry re-exports only `m` and `AnimatePresence`; a bare `motion` import is forbidden.

## What moves

| Element | Module | Behaviour |
|---|---|---|
| CTAs (`[data-cta]`) | `cta.ts` | Magnetic pull (14 px) under a fine pointer with a bouncing return, press squeeze, one light sweep on arrival. The floating pill is **not** a `[data-cta]` |
| Floating pill | `floatingCta.ts` | Springs its slots |
| Bookmarks | `propertyTabs.ts` | Slide-in springs, neighbours lean |
| Brand bars | `brandbar.ts` | Each `.tds-brandbar` is split into three `aria-hidden` key spans coloured from the bar's computed layers (`.lp-brandbar-keys` hides the layers) and played like keys: the key under the pointer jumps and stretches on a stiff spring, neighbours follow, all drop back with a crisp bounce. Only the spans' `transform` and `height` are written (height, not `scaleY`, so every key stays a pill) |
| Cards in depth (`[data-motion-tilt]`) | `tilt.ts` | Price packages and showcase cards lean up to 6° toward a fine pointer (`rotateX`/`rotateY`, perspective 900 px) and spring back flat with a light bounce. Delegated from `document`, so showcase clones tilt too; flat while the shelf is dragged. No glare, no shadow animation. Never on a seam mosaic cell (service tiles): the tilted cell tears the 1 px seams |
| Drawn cursor | `islands/CustomCursor.tsx`, `lib/cursorAbsorb.ts` | See below |
| Page scroll bar | `pageScrollbar.ts`, `components/PageScrollbar.astro` | See below |
| Generated photos (`[data-motion-image]`) | `images.ts` | Settle from a larger scale on scroll-in, then drift ±20 px; transform only |
| Page transitions | `pageTransition.ts` | `<main>` animates out on a same-site click and the next `<main>` in. The header is fixed outside `<main>`. Hand-over via a sessionStorage flag read by an inline head script (`PAGE_ENTER_SCRIPT`), CSS failsafe after 1.5 s; a first visit never carries it. The native cross-document View Transition was removed |
| Business card | `businessCard.ts` | Docked card spring |
| UX cues | `ux.ts` | A pill glides behind the header link of the section on screen (`aria-current="location"`); price cards arrive staggered and never rise on hover (2026-10-12; they only lean, `tilt.ts`); contact form rows arrive as one staggered group (`[data-motion-stagger]`, honeypot skipped) |
| Process stepper | `sections/Process.astro` (CSS + a small script) | One round pill glides behind the open step and the card's notch glides with it (`--lp-ease-spring`); the dot pops; the new card swings in from the chosen step's side while the old one leaves. All cards stay laid out in one cell, so the section never changes height; on a phone the accordion folds (`grid-template-rows`) |
| Hero carousel | `ui/HeroCarousel.astro` (CSS + a small script) | See [Hero](#hero) |
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
- The decoration arrives visibly, drifts at about 5–10 px/s and follows the pointer about 60 px. The bodies tilt
  toward the pointer (16–20°, springs on the outer span, `transformPerspective` 900) and sway on their own (inner
  `.hero-shape__body`, 14–17 s loops), so the depth shows on a phone too. Reduced motion renders one fixed turned
  pose in CSS (`.hero-shape--still`).
- The scroll-linked part is CSS (`animation-timeline: view()`), not a hook.
- **The carousel** (`ui/HeroCarousel.astro`, from 64rem): seven examples sampled per render from the demos and
  design studies, on a flat wheel right of the slogan (2026-10-12: flatter, slower, larger cards) — front card on
  top, neighbours lower at 50 % / 18 % opacity, the rest hidden. A turn every 5.2 s changes `--slot`; the
  registered `--hc-angle` derived from it transitions with `--lp-ease-swing` (1.5 s), and position, scale and tilt
  are `sin()`/`cos()` of that angle, so cards travel the arc and swing past their place. **Dragging** turns it with
  the hand (`--hc-drag`, capture only after a 6 px slop) and springs onto the nearest card on release, a flick one
  further; a click on a neighbour brings it forward. Plain Astro, no island; it sits behind the copy (only the
  hero's links take the pointer). Pauses under the pointer, with focus inside, while dragged, off screen, in a hidden
  tab, under reduced motion and the motion switch. Only the front card's link is in the tab order; the others are
  `aria-hidden` with `tabindex="-1"` but stay clickable.
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

- Hero carousel (2026-10-12): front card `--hc-focus` 0.18 (cos⁸ bump), flatter rim (`--hc-ry` 80svh,
  `--hc-tilt` 0.1), slower (`--hc-turn` 3000ms = `TURN_MS`, rest 8 s); shots are 16:10 and width-fitted, never `cover`-cropped. The left neighbour rises
  under the slogan on the flat rim, so it rests at opacity 0.3 (`data-side`).
