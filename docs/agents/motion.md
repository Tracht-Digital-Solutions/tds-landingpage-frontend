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
- **Mouse drags coast on release** (2026-10-12, `lib/momentum.ts`): the speed of the last 100 ms carries on and
  decays exponentially (τ 325 ms, like a native fling); a hold before letting go throws nothing. The showcase shelf
  glides with snap off, then snaps; the hero wheel adds the projected distance before it picks the card. A press
  catches a coasting shelf. Touch keeps its native momentum.
- **Gentle section snap** (2026-10-12, `lib/sectionSnap.ts`, both paths in `SmoothScroll.tsx`): a scroll that
  comes to rest within min(140 px, 16 % vh) of a top-level `main section[id]` start settles onto it in 520 ms;
  anywhere else the page stays. Not after a click-jump, while a pointer is held, a dialog is open, a field has
  focus, or under reduced motion. No CSS root `scroll-snap-type` (it would fight Lenis).
- **The shelf has no ends** (2026-10-12): `wrap()` in `Showcase.astro` folds drag, glide and hand scroll into
  `[1, loop + 1)`, so it runs backwards from the start too. Clones are NOT `inert` (that killed hover after the
  wrap); they stay `aria-hidden` with `tabindex="-1"`. While dragged and coasting, cards take no pointer, and
  `tilt.ts` lays a leaning card flat on any scroll.
- **Hero scroll timelines are live** (2026-10-12): `#hero` is `overflow: clip` (was `hidden`, a scroll
  container, so every `view()` inside sat at progress 0), and so is its `.tds-decor` layer. The copy and the
  carousel share one named timeline (`--hero-copy`, `timeline-scope` on the section), so they leave together.
  Never put `overflow: hidden` on an ancestor of a `view()` subject.
- **About facts count up** on scroll-in (Motion `animate`, 1.1 s, the prices' curve); the start value is
  written only onto an off-screen figure, the markup holds the final one.
- **The hero wheel turns several cards one step at a time** (`turnBy`, 180 ms apart): turned in one go, cards
  still in front rounded the back by jumping.

## Jank rules (measured 2026-10-12, CPU ×4)

- **No `:has()` on `html`/`body`/`:root` for state that changes.** `body:has(#hero)` re-ran on every DOM insertion
  (showcase clones, islands) and each time recalculated all ~1,700 elements (~100 ms at CPU ×4); a
  `:root:has([data-suppressed])` did the same on every fold of the pill. Mark the state with an attribute instead
  (`data-hero-start` is set by an inline script while parsing).
- **Never write an inherited custom property on `<html>` per frame.** `--lp-floating-lane` is registered
  `inherits: false` and written once the pill has settled (180 ms), not on every resize of its fold.
- Layout reads (`elementsFromPoint`, `getComputedStyle`, `getBoundingClientRect`) don't run inside rAF or an
  observer callback: the cursor samples in a task after the frame, only after movement; the pill's remeasure is
  coalesced into one frame; showcase clones are built in idle slices.
- Profile with LoAF + a trace with `disabled-by-default-devtools.timeline.invalidationTracking`; "Affected by
  :has()" on `HTML` is the signature of the first rule.

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
  the hand (`--hc-drag`, capture only after a 6 px slop) and springs onto the nearest card on release; a throw
  coasts on by its speed (`lib/momentum.ts`); a click on a neighbour brings it forward. Plain Astro, no island; it sits behind the copy (only the
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

- Hero carousel (2026-10-12): front card 24vw (`--hc-focus` 0.2), centred on the section's vertical middle
  (`top: 50%` + `translate(0, -50%)`), `--hc-center` 80 % / 77 % from 80rem (≥ 21 px clear of the slogan at
  1024–1920); earlier: `--hc-focus` 0.18 (cos⁸ bump), flatter rim (`--hc-ry` 80svh,
  `--hc-tilt` 0.1), snappy turn (`--hc-turn` 1400ms = `TURN_MS`, rest 11 s); shots are 16:10 and width-fitted, never `cover`-cropped. The left neighbour rises
  under the slogan on the flat rim, so it rests at opacity 0.3 (`data-side`).
