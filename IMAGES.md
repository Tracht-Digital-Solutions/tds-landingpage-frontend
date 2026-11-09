# Image work

## Image series 2026-11 — 2026-11-09

The service, contact, process and journal photos were regenerated from
`stuff/03-Materialien/Bildserie-2026-11/` (prompts, originals and
`export.mjs`). The five product tiles have their own artwork in
`public/images/products/<name>.webp` (1440 × 900, 480/800/960 copies, WebP and
AVIF), each in its shop category colour; `serviceProducts.ts` points at them.
`imageCatalog.json` holds the refreshed sizes and fingerprints from the
export report. The unused process photos `step-02` to `step-04` are gone.

## Search and responsive image pass — 2026-10-18

The 16 active editorial subjects now ship WebP and AVIF exports at 480, 800,
960, 1440 and original width where applicable. `src/lib/imageCatalog.json`
records exact dimensions, bilingual descriptions and content fingerprints.
`imageCatalog.ts` supplies responsive attributes and ImageObject metadata;
decorative grounds retain empty alt text. The hero preserves its mobile GIF
fallback. XMP identifies generated editorial artwork as trainedAlgorithmicMedia.
The journal consumes this catalog against the marketing image origin.


## Editorial series — 2026-10-16

All five active service photos use `*-editorial.webp` (1536 × 960) plus 800 px
variants. The hero uses `hero-editorial.webp` (1642 × 924); About and Contact
use `why-me-editorial.webp` / `contact-editorial.webp` (1860 × 840). Platform
heroes reuse web-presence or inventory artwork. Previous files remain archived
in place; the historical briefs below describe that earlier series.

Eight topic photos in `public/images/editorial/*-2026.webp` (1440 × 960)
and selected service motifs cover all 15 published journal articles. The explicit
slug catalog is `src/lib/editorialCovers.json`, identical in the blog repository.
Both surfaces use the landing site's absolute image URLs. Uploaded CMS artwork
wins; unknown slugs retain the shared abstract cover. No topic guessing.

This series was replaced by the 2026-11 series (top of this file). Its
originals are no longer kept; the files it shipped are in git history. All
images were generated with the built-in image tool and visually inspected; they
are illustrative scenes, never client evidence.

## Shared favicon

The approved TD monogram with a coral offset is retained in
`src/assets/branding/tds-favicon-master.png`. Run
`node scripts/generate-favicons.mjs` to regenerate this site's PNG, multi-size ICO
and Apple touch icon. The versioned PNG URL refreshes previously cached tab icons;
`favicon.png` and `favicon.ico` remain compatibility paths. Export identical files
to another frontend's public directory by passing that directory as the first
argument; add `--pwa` for journal, tools and shop app icons. Maskable exports keep
the artwork inside the safe circle on an opaque navy canvas.

## Site imagery

All image slots on the site are filled. The logo, portrait, favicon and process
images were always there; the eight photographic grounds below — four service
grounds and four section grounds — were added in the image pass. Journal cards
use an uploaded cover when one exists and the shared abstract cover otherwise.

**The service grounds are no longer grounds.** Since the services section
became a gapless mosaic they render as a 16:10 band at the top of each tile, at
full strength and cropped from the top — `object-position: top`, because every
brief below composes the subject into the upper two thirds and leaves the lower
third empty. A band cropped from the bottom shows table. The detail-page hero
still uses the same file as a ground behind the headline, so each photo has to
survive both readings.

The mechanism that made them optional is unchanged and stays: `image: null` in
`src/lib/services.ts` renders no `<img>` at all — no 404, no empty box. On the
detail hero the constructed geometry underneath carries the band on its own. On
a mosaic tile there is now no band at all: the tile is copy only, and the
neighbouring seams still hold the composition together. Remove one and the page
is still complete — it is just quieter.

Do not add placeholder customer screenshots or infer assets from anonymised
references. A generated photograph is decoration; it must never be presentable
as a picture of a real client, a real project or a real result.

There are exactly **two** exceptions, and both are machine-made screenshots of
a page anyone can open for themselves, captured from the live site by a sync
script that owns its folder and deletes what no longer qualifies. Neither
stands in for a client, a project or a result: they ARE the thing they show.

`public/demos/` — screenshots of **our own** demo sites, by
`npm run demos:sync`. Nothing about them belongs to anyone else.

`public/references/` — screenshots of a **customer's** site, by
`npm run references:sync`. This one is new, and it is the reason the paragraph
above needed a second exception rather than a quiet workaround. It carries
three conditions that the demos do not:

1. The case is `named` — an anonymised customer's site would identify them,
   which is the whole thing anonymity exists to prevent.
2. `previewAllowed` on the case is `true`. Approval to be named and linked is
   not approval to have your site reproduced as a picture on someone else's
   page. It is a separate field with no default, so the decision is made, not
   inherited.
3. The site still answers a live probe at render time. A screenshot outlives
   the page it was taken from; without the probe the card would keep showing a
   site that is gone.

Withdrawing consent is one boolean: set `previewAllowed: false` and the picture
stops rendering immediately, before the asset is even deleted. Run the sync to
remove the file as well.

Never hand-place a picture into either folder.

A re-captured screenshot keeps its file name, and browsers keep `/demos`,
`/references`, `/designstudien`, `/zertifikate` and `/images` for a week. So
the page never links the bare name:
`mediaSrc()` appends a hash of the file's bytes (`?v=…`, computed at build time
by `scripts/media-versions.mjs`). After a sync, a rebuild is all it takes for
the new picture to show on the next reload.

## Conventions

| | |
|---|---|
| Demo previews | `public/demos/<id>.webp`, **1440 × 900** (16:10), plus `<id>-favicon.<ext>` |
| Reference previews | `public/references/<case-id>.webp`, **1440 × 900** (16:10) |
| Design studies | `public/designstudien/<id>[-<view>].webp`, full-page captures of whatever height, width capped at **1440**. Written by `npm run studies:import -- --from "<folder>"`; the PNG originals live in `stuff/03-Materialien/Designstudien/` in the workspace, not in this repo. The file-name map is `lib/designStudyMeta.ts` |
| Certificates | `public/zertifikate/<id>.webp`, **1584 × 1224** (US Letter landscape at scale 2). Rendered from the committed PDFs in `src/assets/certificates/` by `npm run certificates:render` (pdf.js in a headless Chromium — `sharp` cannot read PDF). Quality 88, not 82: these are pictures of small type |
| Service grounds | `public/images/services/<nr>-<slug>.webp`, **1586 × 992** (16:10) |
| Section grounds | `public/images/sections/contact-editorial.webp`, **1870 × 841** (≈2.22:1) — the only one left |
| Format | WebP, quality 82 (AVIF 55 if a second source is ever added) |
| Served sizes | Committed copies beside each original, named `<name>-<width>.webp`: screenshots `-480`/`-960` (written by `capture-preview.ts`), service photos `-800`, portrait `public/images/portrait/portrait-{360,720,1080}.webp`, header logo `public/images/logo/{mark,letters}-{width}.webp` (lossless, from `logo.webp` and `logo-letters.png`). Regenerate with `npm run images:variants`; `imageVariants.test.ts` fails when a `srcset` candidate is missing — a missing candidate breaks the image instead of falling back |
| Alt text | none — these are decorative grounds and render `alt=""` + `aria-hidden` |
| Weight | 41–86 KB each; ~350 KB for all eight |

The dimensions are the SOURCE dimensions. Nothing is upscaled: the generated
sources came in just under the sizes this file used to ask for, at the same
aspect ratio, and every consumer uses `object-cover`, so exact pixel counts
only decide sharpness and weight, never layout. The sources of that
earlier series are archived in the workspace under
`stuff/99-Archiv/Landingpage-Fotos-2026-09/` (not in this repo). They were
re-encoded with `sharp`, which is already installed here:

```js
await sharp(png).webp({ quality: 82 }).toFile(webp);
```

## Where each ground is rendered

**No photo lies on the page ground any more (2026-11-03).** The paper carries
the generated 3D shapes of `components/PageGround.astro`, and a photo ground
on top of it only covered them. The hero (`hero-editorial`), "Über mich"
(`why-me-editorial`) and the service and platform detail heads (the service
photo at 0.36) lost theirs; the files went with them. The contact photo stays:
it lies on the navy block, which covers the ground by its own colour.

| Ground | Rendered by | Opacity (light / dark) |
|---|---|---|
| `services/*.webp` | `ui/ServiceCard.astro` — `.service-tile__shot img` | **1.0 — content, not a ground** |
| `sections/contact-editorial.webp` | `sections/Contact.astro` — `.contact-photo` | 0.38, no dark variant |
| `demos/*.webp` | `ui/DemoCard.astro` — `.demo-card__shot img` | **1.0 — content, not a ground** |
| `references/*.webp` | `ui/ReferenceCard.astro`, `services/ServiceDetailPage.astro` — `.reference-card__shot img` | **1.0 — content, not a ground** |

The last three rows are the odd ones out on purpose. A section ground is
decoration under copy, which is why it runs at a third of its strength behind a
scrim with `alt=""`. A screenshot — and, since the mosaic, a service photo — is
the thing the visitor came to look at, so it sits in front at full opacity with
a real `alt` where one is warranted, in both themes. If a future pass dims
images site-wide, those rows are the ones to leave alone.

These values were raised twice after the first pass; the ratios between the
slots stayed put. The rule when a bump costs legibility is to strengthen the
SCRIM, not to weaken the photo — otherwise the two dials keep undoing each
other. Contrast is measured in the browser, not judged by eye.

The two navy blocks run higher and have no dark-mode variant on purpose: their
surface is `--color-surface-navy` in both themes, and a nearly black photograph
disappears into it below roughly 0.3.

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
  dirty smear at these strengths; a bright, airy frame with one confident
  dark accent keeps its shape.
- **No legible screens, no signage, no faces.** A readable interface would look
  like a product screenshot of something that does not exist, and a recognisable
  face on a service card reads as "this is my customer". Hands, backs, cropped
  figures and turned-away monitors carry the same meaning without the claim.

## Generation prompts

Prompts are not kept in this repository. The next series for all four sites
(landing page, shop, tools, blog) lives in the workspace at
`stuff/03-Materialien/Bildserie-2026-11/`: one ready-to-paste prompt file per
image, `ANLEITUNG.md`, and `export.mjs`, which writes the WebP/AVIF variants into
each repository. Earlier prompt sets are in this file's git history and in
`stuff/99-Archiv/`.

## Adding a task here

Record its owner, approval/privacy status, target component, source path,
aspect ratio, minimum dimensions, format and alt-text intent.
