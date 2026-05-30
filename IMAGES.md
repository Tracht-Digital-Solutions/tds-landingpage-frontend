# Image swap guide

Every visible image on the site currently renders as an
`<ImagePlaceholder />` box (description text on a soft-coloured tile)
or — for the header logo — an inline gradient placeholder. This guide
lists each spot, the aspect ratio the layout expects, and the exact
swap pattern.

When real assets land, drop them under `public/images/` (or import
from `src/assets/` if you want Astro's `<Image />` optimisation
pipeline) and swap the placeholder component for an `<img>` or
`<Image />`.

## Conventions

- **Where to put files.** Anything in `public/images/<name>.webp`
  ships verbatim to `/images/<name>.webp` at the deployed origin.
  Files in `src/assets/<name>.webp` flow through Astro's image
  optimiser when used with `import` + `<Image />` — recommended for
  raster assets so you get format negotiation (AVIF / WebP) and
  responsive sizes for free.
- **Format.** WebP for raster, SVG for marks / icons / vector. AVIF
  is fine if you control the encode pipeline.
- **Alt text.** Always required. The current placeholders carry a
  `description` prop that already reads like an alt text — reuse the
  intent when writing real alt copy.
- **Aspect ratio.** Match the box the placeholder occupies so the
  layout doesn't reflow when the image lands.
- **DPR / retina.** Treat every "display size" below as the **CSS
  pixel size** the image renders at. Always export the **source
  asset at 2× CSS px** so retina displays don't blur it; Astro's
  `<Image />` widths/sizes contract takes care of generating the
  smaller derivatives. Recommended quality: WebP 82, AVIF 55,
  JPEG 80.

## The list

### 1. Header logomark — gradient placeholder

| | |
|---|---|
| **File** | `src/components/Header.astro` |
| **Current** | Inline gradient tile (primary→accent) with a Fraunces-italic "T" |
| **Aspect** | Square (1:1) |
| **Display size** | `28 × 28 px` (mobile) / `32 × 32 px` (desktop) |
| **Source asset** | **SVG**, no nominal size (vector). If you must ship raster, export a **128 × 128 px** PNG (4× the desktop size to cover up to 3× DPR) |
| **Format** | SVG preferred (scales cleanly); 32-bit PNG with transparency acceptable |
| **Drop file at** | `public/images/logo.svg` |

**Swap pattern** — replace the placeholder `<span>` with an `<img>`:

```astro
<a href={homeHref} class="flex items-center gap-2 px-2 lg:px-2.5 py-1 lg:py-1 ..." aria-label="Tracht Digital Solutions">
  <img
    src="/images/logo.svg"
    alt=""
    width="32"
    height="32"
    class="w-7 h-7 lg:w-8 lg:h-8 rounded-[8px]"
  />
  <span class="font-[var(--font-display)] text-lg lg:text-base font-medium leading-none">
    TDS
  </span>
</a>
```

(Keep `aria-label` on the anchor and `alt=""` on the mark — the
wordmark next to it carries the accessible name.)

### 2. Portrait photo — About section

| | |
|---|---|
| **File** | `src/components/sections/About.astro` (line ~21) |
| **Current** | `<ImagePlaceholder aspect="aspect-[3/4]" label="Portrait" description={t.about.portraitPlaceholder} />` |
| **Aspect** | **3:4 portrait** (taller than wide) |
| **Display size** | Roughly **384 × 512 px** on desktop (max-w-sm column at ≥md), `60vw × 80vw` on phones |
| **Source asset** | **1200 × 1600 px** WebP — 3× the largest CSS render so retina + responsive widths have headroom. Astro `<Image />` generates 300 / 450 / 600 / 900 derivatives from this single source |
| **Format** | WebP (q ≈ 82) primary, JPEG (q ≈ 80) fallback if the export pipeline needs it |
| **Drop file at** | `src/assets/portrait.webp` (use Astro's `<Image />` for responsive variants) |
| **Briefing hint** | The placeholder description reads "Schwarz-Weiß-Portrait von Julian — schräg sitzend am Schreibtisch, leicht zur Kamera gewandt, naturnahes Licht." — keep the editorial feel (black-and-white, natural light) when shooting. |
| **Tracker** | [#8](https://github.com/Tracht-Digital-Solutions/tds-landingpage/issues/8) |

**Swap pattern:**

```astro
---
import { Image } from "astro:assets";
import portrait from "~/assets/portrait.webp";
---

<Image
  src={portrait}
  alt="Portrait of Julian Tracht"
  widths={[300, 450, 600, 900]}
  sizes="(min-width: 768px) 24rem, 60vw"
  class="rounded-[2px] aspect-[3/4] object-cover w-full"
/>
```

(Remove the matching `<ImagePlaceholder />` line + the
`portraitPlaceholder` import.)

### 3. Portfolio screenshots — × 4

| | |
|---|---|
| **File** | `src/components/sections/Portfolio.astro` → `src/components/ui/PortfolioCard.astro` |
| **Current** | `<ImagePlaceholder aspect="aspect-[4/3]" label={placeholderLabel} description={imagePlaceholder} />` per card |
| **Aspect** | **4:3 landscape** |
| **Display size** | `~600 × 450 px` on desktop (2-col grid at sm+), full-width on mobile (`~400 × 300 px`) |
| **Source asset** | **1600 × 1200 px** WebP — covers 2× DPR at desktop + headroom for future hero treatments. Astro `<Image />` generates 400 / 600 / 800 / 1200 widths |
| **Format** | WebP (q ≈ 82) for product shots / UI mockups |
| **Drop files at** | `src/assets/portfolio/<slug>.webp` (one per portfolio item) |
| **Briefing hint** | Each placeholder carries a `coverHint` style description in the i18n bundle. Match the composition the copy describes (e.g., "Screenshot des Dashboards mit zentraler KPI-Übersicht, links Sidebar-Navigation, rechts ein Detailpanel.") |
| **Tracker** | [#9](https://github.com/Tracht-Digital-Solutions/tds-landingpage/issues/9) |

**Swap pattern** — add a `coverImage` field to each portfolio item
in `tds-shared/src/i18n/translations.ts` (next 0.2.x bump) or read by
slug. Inside `PortfolioCard.astro`:

```astro
---
import { Image } from "astro:assets";
// import maps slug → asset
const cover = await import(`~/assets/portfolio/${slug}.webp`);
---

<Image
  src={cover.default}
  alt={imageAlt}
  widths={[400, 600, 800, 1200]}
  sizes="(min-width: 640px) 50vw, 100vw"
  class="aspect-[4/3] object-cover w-full"
/>
```

(Then remove the `<ImagePlaceholder />` line.)

### 4. Journal cover images — × 3

| | |
|---|---|
| **File** | `src/components/sections/Journal.astro` → `src/components/ui/BlogPostCard.astro` |
| **Current** | `<ImagePlaceholder aspect="aspect-[4/3]" label={placeholderLabel} description={imagePlaceholder} />` per teaser |
| **Aspect** | **4:3 landscape** |
| **Display size** | `~400 × 300 px` on desktop (3-col grid at sm+), full-width on mobile |
| **Source asset** | **1200 × 900 px** WebP at the API origin — 2× the desktop render. Smaller than Portfolio because covers live on the content-api CDN, not in the landingpage build. |
| **Format** | WebP (q ≈ 82) or AVIF (q ≈ 55) at the content-api side |
| **Live source** | The blog API (`tds-content-api`) returns a `coverHint` per post; production builds receive an image URL. The static fallback list in tds-shared carries the placeholder descriptions. |
| **Tracker** | [#10](https://github.com/Tracht-Digital-Solutions/tds-landingpage/issues/10) |

**Swap pattern** — `BlogPostCard.astro` already accepts `imagePlaceholder` as a string. Wire a `coverImage` URL through from the API response in `Journal.astro` and pass it to the card; the card then renders an `<img>` when present, falling back to `<ImagePlaceholder />` when absent.

```astro
---
// BlogPostCard.astro
interface Props {
  // …existing
  coverImage?: string;
}
---

{coverImage ? (
  <img src={coverImage} alt={title} class="aspect-[4/3] object-cover w-full rounded-[2px]" loading="lazy" />
) : (
  <ImagePlaceholder aspect="aspect-[4/3]" label={placeholderLabel} description={imagePlaceholder} />
)}
```

### 5. Open Graph default card

| | |
|---|---|
| **Generator** | `src/og/render.ts` → emitted at `dist/og/default.png` |
| **Source** | Satori SVG with Fraunces + Geist TTFs in `src/og/fonts/` |
| **Dimensions** | **1200 × 630 px** (Open Graph spec — also satisfies Twitter `summary_large_image`). LinkedIn / WhatsApp pull the same file. |
| **Status** | Generated at build time — no manual swap needed for the default card. If you want a per-page OG card later, add a new endpoint under `src/pages/og/` mirroring the default pipeline. |

### 6. Favicon

| | |
|---|---|
| **File** | `public/favicon.svg` |
| **Current** | Whatever ships in the file today — verify before launch. |
| **Recommended set** | A small bundle covering modern + legacy + mobile + PWA: |

| File | Size | Purpose |
|---|---|---|
| `public/favicon.svg` | viewBox `0 0 32 32` (scalable) | Primary, modern browsers |
| `public/favicon.ico` | 32 × 32 (multi-resolution 16 + 32 + 48) | IE / legacy fallback |
| `public/apple-touch-icon.png` | **180 × 180** | iOS home-screen, Safari tab |
| `public/icon-192.png` | **192 × 192** | Android home-screen, generic PWA |
| `public/icon-512.png` | **512 × 512** | PWA splash, generic high-res |

The single SVG handles ~95% of modern browsers; the PNG bundle is
worth shipping if the site is added to home screens or used as a
PWA later. Reference them in `Layout.astro`'s `<head>`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="32x32" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

## Once a real asset lands

1. Drop the file at the path listed above.
2. Replace the `<ImagePlaceholder />` line with the swap pattern.
3. Remove any now-unused `*Placeholder` translation field from `tds-shared` (and bump 0.2.x). Until that bump lands, the field is harmless — only the rendered card stops calling it.
4. Update this guide if you change paths or aspect ratios.
5. Close the related tracker issue.

## Tracker

| # | Asset |
|---|---|
| #8 | Portrait |
| #9 | Portfolio screenshots (× 4) |
| #10 | Journal cover images (× 3) |
| — | Header logomark (no dedicated issue yet — open one when sourcing) |
| — | `public/legal/agb.pdf` placeholder (PDF, not image — listed for completeness) |
