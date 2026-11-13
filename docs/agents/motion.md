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
  and its pointer listener stop when `#hero` leaves the viewport, the Lenis loop in `lib/smoothScroll.ts` runs only
  while Lenis scrolls (parks after 30 still frames; `lenis.time = 0` before a wake), the
  brand-bar keys use `inView`, the cursor parks when settled, the pill's chevrons loop only while the swipe track
  shows. Check: count `requestAnimationFrame` calls over 2 s at the page bottom — it must be 0.
- The shared React motion entry re-exports only `m` and `AnimatePresence`; a bare `motion` import is forbidden.
- **Mouse drags coast on release** (2026-10-12, `lib/momentum.ts`): the speed of the last 100 ms carries on and
  decays exponentially (τ 325 ms, like a native fling); a hold before letting go throws nothing. The hero wheel
  adds the projected distance before it picks the card. Touch keeps its native momentum.
- **Gentle section snap** (2026-10-12, `lib/sectionSnap.ts`, both paths in `lib/smoothScroll.ts`): a scroll that
  comes to rest within min(140 px, 16 % vh) of a top-level `main section[id]` start settles onto it in 520 ms;
  anywhere else the page stays. Not after a click-jump, while a pointer is held, a dialog is open, a field has
  focus, or under reduced motion. No CSS root `scroll-snap-type` (it would fight Lenis).
- **Hero scroll timelines are live** (2026-10-12): `#hero` is `overflow: clip` (was `hidden`, a scroll
  container, so every `view()` inside sat at progress 0), and so is its `.tds-decor` layer. The copy and the
  carousel share one named timeline (`--hero-copy`, `timeline-scope` on the section), so they leave together.
  Never put `overflow: hidden` on an ancestor of a `view()` subject.
- **About facts count up** on scroll-in (Motion `animate`, 1.1 s, the prices' curve); the start value is
  written only onto an off-screen figure, the markup holds the final one.
- **The hero wheel turns several cards one step at a time** (`turnBy`, 180 ms apart): turned in one go, cards
  still in front rounded the back by jumping.
- **Turns the hand asks for start with speed** (2026-10-18): release, throw and neighbour click set
  `data-hand`, which swaps in a 1 s spring with initial velocity (`--hc-ease`). `--lp-ease-swing` starts from
  rest (0.12° in the first frame, measured) and read as a hang after a moving hand. Autoplay clears `data-hand`.

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
| Brand bars | `brandbar.ts` | Each `.tds-brandbar` is split into three `aria-hidden` key spans coloured from the bar's computed layers (`.lp-brandbar-keys` hides the layers) and played like keys: the key under the pointer jumps and stretches on a stiff spring, neighbours follow, all drop back with a crisp bounce. Only the spans' `transform`, `height` and `box-shadow` are written (height, not `scaleY`, so every key stays a pill). A rising key casts the hard flat shadow in a dark shade of its colour and leans up-left into it (2026-11-03), drawn per frame, never transitioned |
| Cards in depth (`[data-motion-tilt]`) | `tilt.ts` | Price packages and project tiles lean up to 6° toward a fine pointer (`rotateX`/`rotateY`, perspective 900 px) and spring back flat with a light bounce. Delegated from `document`. No glare, no shadow animation. Never on a seam mosaic cell (service tiles): the tilted cell tears the 1 px seams |
| Drawn cursor | `lib/customCursor.ts`, `lib/cursorAbsorb.ts` | See below |
| Page scroll bar | `pageScrollbar.ts`, `components/PageScrollbar.astro` | See below |
| Generated photos (`[data-motion-image]`) | `images.ts` | Settle from a larger scale on scroll-in, then drift ±20 px; transform only |
| Page ground shapes | `groundScroll.ts`, `components/PageGround.astro` | A passive scroll listener writes `--lp-ground-y` (px, unitless) onto `.page-ground`, never `<html>`. CSS slides each depth plane by `mod(y × speed, tile)` (speeds 0.14/0.3/0.5: parallax, seamless) and turns each body 2.5–7° per 100 px. In the hero the pointer adds a lean (see [Hero](#hero)). The motion switch removes the listeners and the bodies return to their resting pose |
| Page transitions | `pageTransition.ts` | `<main>` animates out on a same-site click and the next `<main>` in. The header is fixed outside `<main>`. Hand-over via a sessionStorage flag read by an inline head script (`PAGE_ENTER_SCRIPT`), CSS failsafe after 1.5 s; a first visit never carries it. The native cross-document View Transition was removed |
| Business card | `businessCard.ts` | Docked card spring |
| UX cues | `ux.ts` | A pill glides behind the header link of the section on screen (`aria-current="location"`); price cards arrive staggered and never rise on hover (2026-10-12; they only lean, `tilt.ts`); contact form rows arrive as one staggered group (`[data-motion-stagger]`, honeypot skipped) |
| Process scenes | `ui/ProcessScene.astro`, script in `sections/Process.astro` | Each of the four step cards opens with a small drawn scene of its result (two cards slide into one with its plate; a sheet is written, signed, sealed; a page grows in three stages while the brand bar's three keys fill; a switch turns on, a status dot goes live). Built from cards, plates, pills and rings, tokens only. The markup is the finished picture; `data-scene="armed"` (first frame, paused) is written only while the row is off screen, `play` runs once with the cards 420 ms apart, then the attribute goes. On a phone a step's scene plays when it opens. No loops; reduced motion, the motion switch and no-JS show the finished picture |
| Zeitersparnis | `sections/TimeSavings.astro` (CSS + a small script) | One pill per question glides to the chosen answer (`--lp-ease-spring` on transform, size on `--lp-ease-soft`; measured from rects in the change handler, after a resize in a task). Answer dots pop, the ring sweeps (900 ms), days and hours count up in one rAF loop that stops at its end (`lessMotion()`: final values at once); only `aria-hidden` twins count, one hidden sentence is announced. Figures rise by `transform`, never from opacity 0; the CTA arrow nudges twice when the estimate arrives. On a phone `keepInView` shows the plate once after the third answer |
| Hero carousel | `ui/HeroCarousel.astro` (CSS + a small script) | See [Hero](#hero) |
| Modals | `dialog.ts` | Bounce in and out (Escape included; `cancel` is intercepted), always ending in `dialog.close()` behind a timeout. One flat navy backdrop, one flat dialog colour, a bare close cross. While open, `html[data-modal-open]` locks the page and Lenis lets the wheel through to the dialog ([design.md](design.md#dialogs-and-semantics)) |

Scroll reveal stays `lib/reveal.ts` (`[data-reveal]`).

## First-visit splash (2026-11-13)

`lib/splash.ts` + `components/Splash.astro`: an inline head script sets `html[data-splash]` once per browser
(`localStorage["lp-splash"]`), never under reduced motion, the motion switch, after an internal navigation, on
`bare` pages or without JS. A navy layer with the wordmark covers the finished page until fonts and the images in
the first screen have loaded (min 450 ms, max 1.6 s), then fades. It is a layer ON TOP: nothing underneath is hidden,
it holds no image and its type is small, so `h1#hero-heading` stays the LCP element (`audit:perf`). Tests:
`splash.test.ts`.

- **Switches slide by hand** (2026-10-19, `lib/slideSwitch.ts`): the net/gross switches (price list and
  calculator) and the accessibility toggles follow a sideways drag (mouse and touch, capture after 6 px,
  `touch-action: pan-y`) and settle on the nearer end; a tap stays a tap, the click a drag ends in is swallowed.
- **What opens on a phone stays on screen** (2026-10-19, `lib/keepInView.ts`): after a tap opens a process step,
  an explorer service or an FAQ row, the page scrolls (via `tdsScrollTo`) just enough to show the title and its
  content between header and pill, once the fold has played.
- **The receiver's swipe track grows out of the pill** (2026-10-19): same fill, hard shadow and bottom edge as the
  pill; at rest it is exactly the pill's bottom cap under the receiver, held it widens left on `--lp-ease-spring`
  (`width` + `margin-left`, right end fixed), so the pill becomes an L. No opacity or scale on the track; its shadow
  only while it reaches out; the twin's clip stays wide until it has shrunk back.
- **Hover colours on the floating pill's receiver live in `@media (hover: hover)`**: a touch screen keeps `:hover`
  after a swipe, and the navy hover disc vanished on the navy pill.

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

- The hero's **copy** stays plain Astro. The landing page loads React only for the consent banner, chat, the
  service finder (on intent) and the contact form (on view) — see architecture.md.
- **No decoration of its own since 2026-11-03** (`heroDecor.ts` is gone). While `#hero` is on screen and the pointer
  is fine, the page ground's bodies lean toward it (up to 16°/20°) and the planes shift by depth (14/30/52 px);
  one smoothing loop (τ 0.45 s, never a spring per pointer event: a restarted spring loses its velocity) parks when
  settled and eases back to the centre when the hero leaves. Reduced motion: the turned resting pose.
- **The carousel** (`ui/HeroCarousel.astro`, from 64rem): seven examples sampled per render. The wheel is one number, its position in cards (`lib/heroWheel.ts`); hand, spring and the own turn all move it and the script writes each card's `--slot`, so a press mid-turn holds the wheel. A swipe of 12 % of a card turns one card; a throw carries further. Only the fade is a CSS transition. No card is ever shown cut off (2026-11-04): the script fades each card to 0 over the last 48 px before the hero's box or the window edge, so cards fade out and in as they turn.
- `npm run audit:perf` measures 390 px and 1440 px and pins `h1#hero-heading` as the LCP element on both.

## The service explorer and assistant

- The explorer's navy marker slides behind the open title on desktop.
- **The explorer's cards change places** (2026-10-19, `animateSwitch` in `ui/ServiceExplorer.astro`, plain Web
  Animations): the old card leaves against the direction of travel (200 ms), the new one comes in with it on
  `--lp-ease-spring`, its photo settles from 1.08 and the facts follow 55 ms apart. CSS only holds the end states;
  a new switch cancels the running one.
- The assistant dialog: a segmented progress, questions sliding in from their side (`AnimatePresence` with
  `initial={false}`, focus via a stable callback ref), round answer cards that lift and pop a tick, staggered
  result cards (best fit navy, hand-off CTA pink).


- Hero carousel (2026-10-12): front card 24vw (`--hc-focus` 0.2), centred on the section's vertical middle
  (`top: 50%` + `translate(0, -50%)`), `--hc-center` 80 % / 77 % from 80rem (≥ 21 px clear of the slogan at
  1024–1920); earlier: `--hc-focus` 0.18 (cos⁸ bump), flatter rim (`--hc-ry` 80svh,
  `--hc-tilt` 0.1), snappy turn (`--hc-turn` 1400ms = `TURN_MS`, rest 11 s); shots are 16:10 and width-fitted, never `cover`-cropped. The left neighbour rises
  under the slogan on the flat rim, so it rests at opacity 0.3 (`data-side`).

## Project cards and the receiver (2026-11-02)

- `ui/ProjectCard.astro` is the one card template. Its hard shadow is a plate at z -28 in the tilt's 3D space, scaled 1.031 to cancel the perspective; `lib/motion/tilt.ts` slides it against the lean with `--tilt-shade-*`. A `box-shadow` on the tilting card leans with it.
- The receiver slides only on a smartphone (`isPhone()`, shorter screen side under 600 px). The track fills pink behind it; elsewhere it is a plain link.
- Tooltips sit at the pointer (`lib/pointerTooltip.ts`, 700 ms rest); a `title` moves to `data-tip` so the native one never opens.
