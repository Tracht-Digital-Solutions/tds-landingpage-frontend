# Image work

All image slots on the site are filled. The logo, portrait, favicon and process
images were always there; the ten photographic grounds below — six service
grounds and four section grounds — were added in the image pass. Journal cards
use an uploaded cover when one exists and the shared abstract cover otherwise.

The mechanism that made them optional is unchanged and stays: `image: null` in
`src/lib/services.ts` renders no `<img>` at all — no 404, no empty box — and
service cards and service hero bands still carry a constructed geometry
background from the shared decoration layer underneath. A photograph is an
extra layer over that ground, not a load-bearing piece. Remove one and the page
is still complete.

Do not add placeholder customer screenshots or infer assets from anonymised
references. A generated photograph is decoration; it must never be presentable
as a picture of a real client, a real project or a real result.

## Conventions

| | |
|---|---|
| Service grounds | `public/images/services/<nr>-<slug>.webp`, **1586 × 992** (16:10) |
| Section grounds | `public/images/sections/<name>.webp`, **1870 × 841** (≈2.22:1); hero **1642 × 958** (≈1.71:1) |
| Format | WebP, quality 82 (AVIF 55 if a second source is ever added) |
| Alt text | none — these are decorative grounds and render `alt=""` + `aria-hidden` |
| Weight | 41–86 KB each; ~500 KB for all ten |

The dimensions are the SOURCE dimensions. Nothing is upscaled: the generated
sources came in just under the sizes this file used to ask for, at the same
aspect ratio, and every consumer uses `object-cover`, so exact pixel counts
only decide sharpness and weight, never layout. The sources live in
`stuff/Landingpage/*.png` in the workspace (not in this repo) and are
re-encoded with `sharp`, which is already installed here:

```js
await sharp(png).webp({ quality: 82 }).toFile(webp);
```

## Where each ground is rendered

| Ground | Rendered by | Opacity (light / dark) |
|---|---|---|
| `services/*.webp` | `ui/ServiceCard.astro` — `.service-card__photo` | 0.18 / 0.12, 0.26 on hover |
| `services/*.webp` | `services/ServiceDetailPage.astro` — `.service-hero__photo` | 0.20 / 0.13 |
| `sections/hero.webp` | `islands/Hero.tsx` — `.hero-photo`, CSS in `styles/global.css` | 0.16 / 0.10 |
| `sections/why-me.webp` | `sections/About.astro` — `.about-photo` | 0.19 / 0.12 |
| `sections/pricing.webp` | `sections/PricingTeaser.astro` — `.pricing-photo` | 0.30, no dark variant |
| `sections/contact.webp` | `sections/Contact.astro` — `.contact-photo` | 0.22, no dark variant |

The two navy blocks run higher and have no dark-mode variant on purpose: their
surface is `--color-surface-navy` in both themes, and a nearly black photograph
disappears into it below roughly 0.2.

Each of the four section grounds sits in a `.tds-decor` span as the section's
first child. That is the shared primitive (`tds-shared/styles/primitives.css`):
`position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:0`,
plus the rule `.tds-decor ~ *` that lifts every following sibling to
`z-index:1`. So the content sits above the ground without a single hand-written
`relative z-10`, and nothing can produce horizontal overflow.

Two consequences worth knowing before editing one of them:

* `.tds-decor` needs a **positioned ancestor**. `.tds-wash` brings
  `position:relative`; `.tds-tone-navy` does not — that is why `Contact.astro`
  carries an extra `relative`.
* Where a section already had loose `.tds-shape` children (`PricingTeaser`),
  they were moved INTO the same `.tds-decor`. Left outside, they would have
  been caught by `.tds-decor ~ *` themselves.

**To switch a service ground off again**, set `image: null` on its entry in
`serviceDefinitions` (`src/lib/services.ts`). `services.test.ts` checks the
path shape; nothing else has to change.

## What the slot does to the picture

This is the part that decides whether a photograph works here, and it is not
obvious from looking at the file on its own.

- **Everything renders far below full strength** (see the table above). At that
  strength fine detail does not read as detail — it reads as grain. A picture
  survives only if it is built from a few LARGE tonal shapes: one bright
  window, one dark mass, one clear silhouette.
- **The quiet area is in a different place per slot.** The card's scrim is
  strongest at the bottom, so the lower third is nearly covered — put the
  subject in the upper two thirds. The hero band's scrim runs left to right, so
  the left half sits under the headline — put the subject on the right.
- **Every scrim is the slot's OWN fill fading out**, never a grey wash: paper
  on the light surfaces, `--color-surface-navy` on the two dark blocks. That is
  what keeps the surface its own colour instead of turning it muddy.
- **`object-cover` decides what actually survives.** A wide ground in a tall
  section is cropped horizontally, not scaled — which is why `About` uses
  `object-left` and `Contact` `object-right-bottom`, so the composed subject is
  in the part that stays. Centring them would have kept only the empty half.
- **Mid-key beats dramatic.** A very dark or very contrasty frame turns into a
  dirty smear at 18 %; a bright, airy frame with one confident dark accent
  keeps its shape.
- **No legible screens, no signage, no faces.** A readable interface would look
  like a product screenshot of something that does not exist, and a recognisable
  face on a service card reads as "this is my customer". Hands, backs, cropped
  figures and turned-away monitors carry the same meaning without the claim.

## Generation prompts

The prompts every current ground was generated from — kept because they are the
reproduction instructions, not a backlog. Written for a photorealistic image
model (Midjourney, Flux, Imagen, DALL·E). Each prompt below is the SUBJECT;
append the two shared blocks to every one of them.

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

Behind the reasons column. Very quiet. Rendered with `object-left`, so the
objects stay in frame and the empty right two thirds fall under the scrim.

> The corner of a wooden desk in early morning light: a closed notebook, a pair
> of glasses folded on top, a half-full glass of water, one pencil. Shot from a
> low oblique angle with a long soft shadow reaching across the frame. The
> right two thirds are empty desk and wall. Extremely calm, almost still-life.
> No people, no devices. 2000×900.

### 8 · Pricing teaser ground — `sections/pricing.webp`

Behind the navy price panel, so it has to read as a dark picture. The panel is
much wider than the source, so only the vertical axis is cropped.

> A single printed one-page document lying on a dark table beside a fountain
> pen, photographed from above in low warm side light so most of the frame
> falls away into deep shadow. The paper is the one bright shape, positioned in
> the right third; the left two thirds are almost black table. Restrained,
> serious, no props, no hands, no readable text on the page. 2000×900.

### 9 · Contact section ground — `sections/contact.webp`

Behind the navy contact block. The scrim runs to the bottom right and stays
fully opaque over the headline and the form, so the block reads as textured
navy rather than as a picture — "keine konkurrierenden Farbverläufe hinter dem
Formular" still holds.

> A mobile phone lying face down on a wooden table next to a closed notebook,
> in warm low evening light from a window off to the right. Long soft shadows
> across the wood. Most of the frame is empty table falling into shadow; the
> objects sit in the lower right quarter. Quiet, end-of-day, no people, no
> screen visible. 2000×900.

### 10 · Hero ground — `sections/hero.webp`

Full-bleed behind the hero, under the constructed geometry. **The left half is
empty because the headline sits there** — that is the whole composition, and it
is the reason the image is `hidden md:block`: in portrait, `object-cover` keeps
only a middle strip in which that empty half no longer exists.

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
