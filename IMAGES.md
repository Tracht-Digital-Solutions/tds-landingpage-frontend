# Open image work

The logo, portrait, favicon and process images are complete. Journal cards use
an uploaded cover when one exists and the shared abstract cover otherwise.

Every task below is **optional**: the page is complete without it. Service
cards and service hero bands already carry a constructed geometry background
from the shared decoration layer, and `image: null` in
`src/lib/services.ts` renders no `<img>` at all — no 404, no empty box. An
image is an extra layer over that ground, not a missing piece.

Do not add placeholder customer screenshots or infer assets from anonymised
references.

## Conventions

| | |
|---|---|
| Service backgrounds | `public/images/services/<nr>-<slug>.webp`, **1600 × 1000** (16:10) |
| Section backgrounds | `public/images/sections/<name>.webp`, **2000 × 900** |
| Format | WebP, quality 82 (AVIF 55 where a second source is added) |
| Alt text | none — these are decorative grounds and render `alt=""` + `aria-hidden` |

**To switch one on**, set its path on the matching entry in
`serviceDefinitions` (`src/lib/services.ts`):

```ts
image: "/images/services/05-webauftritt.webp",
```

`services.test.ts` checks the path shape; nothing else has to change. The card
renders the photo at 18 % opacity (12 % in dark mode) under a scrim of the
card's own fill, and the hero band at 20 % (13 % dark) — they are grounds, so
they are quiet on purpose. A picture that only works at full strength is the
wrong picture for this slot.

## Generation prompts

Written for an image model. Every prompt states the same non-negotiables
because models drop them otherwise:

> **no text, no logos, no people, no user interfaces, no stock-photo look, no
> colourful SaaS gradients, no organic blobs, no heavy shadows.**

The brand is "Digitale Maßarbeit": constructed geometry, warm paper, flat.
Palette — put the hex values in the prompt verbatim:

`#050f68` navy · `#820933` burgundy · `#ff7a9c` coral/pink ·
`#b9791c` ochre · `#fafaf7` warm white · `#f1efe8` sand · `#0b0a07` near-black

### 1 · Beratung & Konzeption — `services/01-beratung.webp`

> A flat vector-style abstract composition on a warm off-white paper ground
> (#fafaf7). Overlapping translucent geometric planes: one large deep navy
> (#050f68) rounded rectangle cut off by the left edge of the frame, one
> burgundy (#820933) quarter circle entering from the bottom right, and three
> thin 1.5px navy connector lines drawn at exact 90-degree angles with rounded
> corners, with small filled dots where they meet. A single ochre (#b9791c) dot
> as the one warm accent. Extremely minimal, architectural, print-poster
> quality. No gradients, no shadows, no texture, no text, no icons, no people.
> Keep the lower third generous and empty so overlaid type stays readable.
> 16:10.

### 2 · Prozessoptimierung — `services/02-prozesse.webp`

> Flat abstract diagram of flow on warm off-white paper (#fafaf7). Four navy
> (#050f68) capsule shapes of decreasing width arranged along one horizontal
> axis, connected by a single continuous thin line with rounded right-angle
> turns and small filled circles at each junction. One coral (#ff7a9c) capsule
> among the navy ones marks the step that changed. Strictly orthogonal, flat
> colour. No perspective, no gradient, no shadow, no text, no arrowheads, no
> people. Large calm empty area on the left. 16:10.

### 3 · Individuelle Lösungen — `services/03-loesungen.webp`

> Flat constructed composition on a warm sand ground (#f1efe8). Several
> rectangles and one quarter circle of different sizes fitted together like cut
> paper, in deep navy (#050f68), burgundy (#820933) and a pale coral (#ff7a9c
> at low opacity), leaving one deliberate empty notch where a piece is missing.
> Hard edges, 2px corner radius, no outlines except a single thin navy hairline
> frame around one shape. Swiss graphic design, poster-like, completely flat.
> No shadow, no gradient, no text, no people. 16:10.

### 4 · Auftragsprogrammierung — `services/04-programmierung.webp`

> Flat abstract circuit routing on warm off-white paper (#fafaf7). Five thin
> 1.5px navy (#050f68) lines running horizontally and vertically with rounded
> 90-degree corners, branching and rejoining, with small filled navy node dots
> and one burgundy (#820933) node at a branch point. No board, no chip, no
> device, no code, no text. The lines occupy the right two thirds; the left
> third is empty warm paper. Precise technical-drawing feel, flat. No shadow,
> no gradient, no glow. 16:10.

### 5 · Webauftritt — `services/05-webauftritt.webp`

> Flat abstract page-structure composition on warm off-white (#fafaf7): stacked
> rectangles of varying width suggesting a layout grid — one wide navy
> (#050f68) band at the top, three equal sand (#f1efe8) blocks below it, one
> burgundy (#820933) rectangle offset to the right breaking the grid, and a
> coral (#ff7a9c) horizontal rule. Absolutely no letters, no lorem ipsum, no
> browser chrome, no cursor, no device frame — only the abstract rhythm of a
> layout. Flat, hard-edged, 2px radius. No shadow, no gradient. 16:10.

### 6 · Komplette IT — `services/06-komplette-it.webp`

> Flat abstract composition of one whole made of many parts, on a deep navy
> ground (#050f68). Twelve small warm-white (#fafaf7) squares and capsules of
> equal visual weight on an invisible grid, all connected by thin warm-white
> lines at right angles into a single closed network; two nodes highlighted in
> coral (#ff7a9c), one in ochre (#b9791c). Calm and orderly, with no centre
> point and no hierarchy pyramid. No cloud shape, no server, no icons, no text,
> no people. Flat. No shadow, no gradient, no glow. 16:10.

### 7 · "Wieso ich" section ground — `sections/why-me.webp`

Very quiet backdrop behind the reasons column. 2000 × 900.

> Extremely subtle flat background texture on warm off-white (#fafaf7): three
> very large geometric shapes — a navy (#050f68) capsule cut off by the left
> edge, a burgundy (#820933) quarter circle cut off by the bottom right corner,
> and a thin navy outlined rounded rectangle — all at 6–9 % opacity so the
> ground stays almost white. Nothing in the centre. No text, no fine detail, no
> gradient, no shadow, no noise. 2000×900.

### 8 · Pricing teaser ground — `sections/pricing.webp`

2000 × 900.

> Flat abstract composition on deep navy (#050f68): a stepped arrangement of
> five warm-white capsules of increasing height along the bottom edge, cut off
> by the frame, at 10–18 % opacity, plus one coral (#ff7a9c) quarter circle
> entering from the top right at 20 % opacity. No numbers, no currency symbols,
> no chart axes, no text. Flat. No gradient, no shadow. 2000×900.

### 9 · Contact section ground — `sections/contact.webp`

2000 × 900.

> Flat abstract composition on deep navy (#050f68): two thin warm-white conduit
> lines entering from opposite edges, turning at rounded right angles and
> meeting at one single filled coral (#ff7a9c) node in the lower left third.
> Everything else empty navy. No envelope, no phone, no speech bubble, no text,
> no people. Flat. No gradient, no shadow, no glow. 2000×900.

### 10 · Hero ground (optional) — `sections/hero.webp`

2400 × 1400. Only if the pure CSS geometry ever reads as too empty; the hero
composition is currently deliberate and complete without it.

> Very large, very quiet flat geometric composition on warm off-white
> (#fafaf7). One deep navy (#050f68) capsule cut off by the left edge, one
> burgundy (#820933) quarter circle cut off by the bottom right corner, one
> thin navy outlined rounded rectangle upper right, one single diagonal navy
> hairline, and a short run of right-angled conduit with three dots in the
> lower right. All shapes at 7–10 % opacity. The middle-left half must stay
> completely empty for the headline. No text, no people, no gradient, no
> shadow, no noise. 2400×1400.

## Adding a task here

Record its owner, approval/privacy status, target component, source path,
aspect ratio, minimum dimensions, format and alt-text intent.
