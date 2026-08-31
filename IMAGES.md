# Open image work

The logo, portrait, favicon and process images are complete. Journal cards use
an uploaded cover when one exists and the shared abstract cover otherwise.

Every task below is **optional**: the page is complete without it. Service
cards and service hero bands already carry a constructed geometry background
from the shared decoration layer, and `image: null` in
`src/lib/services.ts` renders no `<img>` at all — no 404, no empty box. A
photograph is an extra layer over that ground, not a missing piece.

Do not add placeholder customer screenshots or infer assets from anonymised
references. A generated photograph is decoration; it must never be presentable
as a picture of a real client, a real project or a real result.

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

`services.test.ts` checks the path shape; nothing else has to change.

## What the slot does to the picture

This is the part that decides whether a photograph works here, and it is not
obvious from looking at the file on its own.

- **The card renders it at 18 % opacity** (12 % in dark mode) under a scrim of
  the card's own fill; the service hero band renders it at 20 % (13 %). At that
  strength fine detail does not read as detail — it reads as grain. A picture
  survives only if it is built from a few LARGE tonal shapes: one bright
  window, one dark mass, one clear silhouette.
- **The quiet area is in a different place per slot.** The card's scrim is
  strongest at the bottom, so the lower third is nearly covered — put the
  subject in the upper two thirds. The hero band's scrim runs left to right, so
  the left half sits under the headline — put the subject on the right.
- **Mid-key beats dramatic.** A very dark or very contrasty frame turns into a
  dirty smear at 18 %; a bright, airy frame with one confident dark accent
  keeps its shape.
- **No legible screens, no signage, no faces.** A readable interface would look
  like a product screenshot of something that does not exist, and a recognisable
  face on a service card reads as "this is my customer". Hands, backs, cropped
  figures and turned-away monitors carry the same meaning without the claim.

## Generation prompts

Written for a photorealistic image model (Midjourney, Flux, Imagen, DALL·E).
Each prompt below is the SUBJECT; append the two shared blocks to every one of
them.

*(An earlier set of prompts produced flat vector geometry rather than
photographs. That is what the CSS decoration layer already draws underneath, so
the two would only compete — the flat set is in this file's git history if it
is ever wanted back.)*

### Shared style block — append to every prompt

> Editorial documentary photograph, real place, unstaged. Natural available
> light only. 50mm prime lens at f/2.0, shallow depth of field, subject sharp
> and background softly out of focus. Muted warm-neutral colour grade: warm
> off-white highlights, slightly cool navy-leaning shadows, low saturation,
> soft matte contrast, gentle natural film grain. Calm, quiet, patient mood.
> Composed from a few large tonal shapes with generous empty space, not from
> fine detail.

### Shared negative block — append to every prompt

> no text, no lettering, no signage, no logos, no watermark, no legible screen
> content, no user interface, no charts or dashboards, no recognisable faces,
> no eye contact with the camera, no smiling stock-photo poses, no handshakes,
> no business suits, no open-plan startup office, no bean bags, no neon, no
> teal-and-orange grade, no lens flare, no heavy vignette, no HDR, no
> tilt-shift, no clutter, no crowds.

---

### 1 · Beratung & Konzeption — `services/01-beratung.webp`

The conversation before anything gets built.

> Two people sitting at the corner of a plain wooden table in the small back
> office of a family trade business, seen from the side and cropped at chest
> height so no face is visible. Between them a printed A4 sheet with
> hand-drawn pencil marks, a closed laptop pushed aside, two coffee cups. One
> hand rests on the paper mid-explanation. Daylight from a window on the left.
> Subject in the upper two thirds, the lower third an empty stretch of table.
> 16:10.

### 2 · Prozessoptimierung — `services/02-prozesse.webp`

The daily routine that costs an hour a week.

> A worn counter in a small workshop, photographed slightly from above. A stack
> of paper delivery notes weighed down by a metal clip, an open ring binder, a
> tablet lying flat and switched off, a ballpoint pen. Everything in the upper
> half; the lower third is empty counter surface with soft daylight falling
> across it. No hands, no people. 16:10.

### 3 · Individuelle Lösungen — `services/03-loesungen.webp`

Parts that were made to fit each other.

> A wall of shallow labelled wooden storage drawers in a small workshop, most
> closed, one pulled halfway open showing sorted small parts. Warm side light
> grazes the fronts and makes a strong grid of light and shadow. Shot straight
> on, slightly off-centre. The lower third falls into soft shadow with no
> detail. No people. 16:10.

### 4 · Auftragsprogrammierung — `services/04-programmierung.webp`

The making itself, without pretending to show a product.

> A tidy desk at dusk in a small home office. A monitor turned away from the
> camera so only its edge and the glow spilling onto the desk are visible, a
> mechanical keyboard, a spiral notebook open at a page of pencil sketches, a
> desk lamp just out of frame casting warm light from the upper right. The
> screen glow is the brightest thing in the picture. Empty desk surface across
> the lower third. No people, no visible screen content. 16:10.

### 5 · Webauftritt — `services/05-webauftritt.webp`

The shopfront, seen from the owner's side.

> The counter of a small independent shop photographed from behind it, looking
> towards a large window with bright daylight flooding in. A laptop sits open
> on the counter facing away from the camera, a plant, a stack of paper bags. The
> window is a large bright rectangle in the upper half; the counter surface in
> the lower third is calm and mostly empty. Backlit, airy, slightly
> overexposed towards the window. No people, no readable screen. 16:10.

### 6 · Komplette IT — `services/06-komplette-it.webp`

Infrastructure that is supposed to be boring.

> A small wall-mounted network cabinet in a clean utility room, door open,
> patch cables neatly bundled and combed into parallel runs, one small status
> LED lit. Photographed straight on from a short distance in cool even
> daylight. The cable runs form strong parallel lines across the upper two
> thirds; painted wall fills the lower third. Orderly, understated, no
> data-centre drama, no blue glow, no server aisle. 16:10.

---

### 7 · „Wieso ich" section ground — `sections/why-me.webp`

Behind the reasons column. Very quiet. 2000 × 900.

> The corner of a wooden desk in early morning light: a closed notebook, a pair
> of glasses folded on top, a half-full glass of water, one pencil. Shot from a
> low oblique angle with a long soft shadow reaching across the frame. The
> right two thirds are empty desk and wall. Extremely calm, almost still-life.
> No people, no devices. 2000×900.

### 8 · Pricing teaser ground — `sections/pricing.webp`

Behind the navy price panel, so it has to read as a dark picture. 2000 × 900.

> A single printed one-page document lying on a dark table beside a fountain
> pen, photographed from above in low warm side light so most of the frame
> falls away into deep shadow. The paper is the one bright shape, positioned in
> the right third; the left two thirds are almost black table. Restrained,
> serious, no props, no hands, no readable text on the page. 2000×900.

### 9 · Contact section ground — `sections/contact.webp`

Behind the navy contact block. 2000 × 900.

> A mobile phone lying face down on a wooden table next to a closed notebook,
> in warm low evening light from a window off to the right. Long soft shadows
> across the wood. Most of the frame is empty table falling into shadow; the
> objects sit in the lower right quarter. Quiet, end-of-day, no people, no
> screen visible. 2000×900.

### 10 · Hero ground (optional) — `sections/hero.webp`

2400 × 1400. Only if the pure CSS geometry ever reads as too empty; the hero
composition is currently deliberate and complete without it. **The left half
must stay empty — the headline sits there.**

> Wide interior view of a small German craft workshop early in the morning,
> before work starts. Empty workbench in the middle distance, tools hanging in
> orderly rows on the right-hand wall, bright daylight coming through a large
> window on the right and falling across a swept concrete floor. Nobody
> present. The entire left half of the frame is empty floor and plain wall in
> soft even light with no detail. Wide angle but undistorted, shot from
> standing height. 2400×1400.

## Adding a task here

Record its owner, approval/privacy status, target component, source path,
aspect ratio, minimum dimensions, format and alt-text intent.
