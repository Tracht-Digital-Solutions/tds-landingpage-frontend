# Website demos and the project grids

The demo sites (`demo1`…`demo5.tracht-digital.de`, plus `shop`) render on the home page in
`sections/ProjectReferences.astro`, on `/projekte` in `components/ProjectsPage.astro` and on the Webauftritt
service page in `sections/WebsiteDemos.astro`. `ui/ProjectTile.astro` picks the card family for the first two.

## Three files, load-bearing split

- **`src/lib/demoCatalog.ts`** — id, order, host, URL and genre. Code-owned; the CMS must never name a host this
  site sends visitors to. Imported by the sync script, so it has **no other imports** (not even type-only).
  - A catalog entry may precede its site: while a host serves a placeholder, the sync records `placeholder` and
    no card renders; once deployed, a sync turns it into a card with no code change.
  - A demo's URL isn't always its bare host: `demo2`'s root is a language gate rejected as a placeholder, so its
    entry points at `/de/`.
- **`src/lib/demoData.json`** — the committed snapshot written by `npm run demos:sync` (each demo's own title,
  description, favicon and screenshot). Never edit by hand.
- **Refreshed daily** (2026-10-19, `.github/workflows/refresh-previews.yml`, 04:17 UTC and by hand): CI runs
  `demos:sync` and `references:sync`, commits only when a picture or a card field changed (timestamps alone don't
  count) and then dispatches the Release workflow. Screenshots used to be taken only when somebody remembered to.
- **`src/lib/demos.ts`** — `getDemos()`, the snapshot filtered by a live probe.

## A demo that isn't available isn't shown

Only a snapshot entry with `status: "ok"`, a title and a screenshot can render, and it must answer a `HEAD`
request at render time. Disqualifying, because each looks like a working link from here:

- a **placeholder or control panel** (Plesk answers 200 for a subdomain without a document root);
- an **invalid certificate** (checked with TLS verification on, no insecure retry);
- a host that is **down now**.

Unknown statuses fail closed. There is no "show it anyway" path.

The probe is memoised per render generation, so the home and service pages share one round, and a demo that goes
down disappears at the next rebuild of the pages it appears on.

## Card content

Everything a visitor reads on a demo card comes from the demo, with **two exceptions**:

- `DemoDefinition.origin`, the badge on the screenshot ("Demo", "Designstudie", or "Eigenes Projekt" for the
  shop). Closed vocabulary; never "Kunde" / "client".
- `DemoDefinition.kind`, the genre label (`DEMO_KINDS`: Webseite · Landingpage · Onlineshop). Closed vocabulary,
  names the genre never the subject; adding one means adding it in both languages. `demos.test.ts` holds it.

`homeContent.ts` owns only the section framing, overridable via the `website_demos` block. Never write a
description for someone's site; a demo without one shows none.

The framing exists **for one card and for several** (`headlineSingle`, `introSingle`, `serviceIntroSingle`);
`demosCopy()` picks by the number that survived the probe. The grid caps its own width (`auto-fit` would turn a
lone card into a poster).

## Design studies

Seven studies (`lib/designStudies.ts`, `ui/StudyCard.astro`) follow the demos on `/projekte`: invented brands, no
host, no URL. Captures carry "DESIGNSTUDIE · eigenständig erstellt · kein Kundenauftrag" as a watermark and the
card's badge says only "Designstudie". Built to `DemoCard`'s measurements (16:10 band), shows the sector, no magnifier: the
bar's call to action opens the enlargement. Not in `sections/WebsiteDemos.astro`. `npm run studies:import`
writes the WebP; PNG originals stay out of the repo.

## Card structure

- **The screenshot never zooms on hover** (demo, study and business-card tiles, 2026-10-11); the card answers
  with its fill and title colour only.

- **The card is not a wrapper `<a>`** and has no magnifier (removed 2026-11-02); a study opens its enlargement through the bar's
  call to action in `ui/PreviewLightbox.astro`. `previewLightbox.test.ts` guards the stretched link, focus ring and focus restore.
- **Every card ends in the same bar**, `ui/CardActions.astro`, edge to edge with a 1 px seam, carrying exactly two
  links: the service the card is evidence for and the card's own destination.
  - The bar is a **sibling of the card body**, never inside it.
  - The **CTA carries the stretched `::after`** (card root `position: relative`); the service link is lifted above
    it with `z-index`, or it silently opens the other destination.
  - No card wraps the bar in an `<a>`.
  - The service link is a **prop**; on the Webauftritt page it is `null`. `cardActions.test.ts` guards geometry,
    that absence, and that a reference card never repeats its primary service as a badge.

## The project grids

No shelf any more (2026-11-02): everything is a grid in a `display: grid` cell, or a card root under
`container-type: inline-size` collapses. Column counts are explicit on the home page (1/2/3), so six tiles never
leave a half-empty row; `/projekte` uses `auto-fill`, so every group has one tile size. Tiles beside a neighbour stay
below 30rem, where only some card families widen their screenshot band.

## The demos' closing brand bar (`public/embed/tds-brand-bar.js`)

Each demo embeds only `<tds-brand-bar lang="…">` with a fallback link plus
`<script src="https://tracht-digital.de/embed/tds-brand-bar.js" defer>`.

- A **classic** script (a cross-origin module would need CORS), rendered in Shadow DOM so no host stylesheet can
  restyle it.
- One knob: `--tds-brand-bar-pad-bottom` for a host with a floating button over the bar.
- `.htaccess` caches `/embed/` for an hour.
- `brandBar.test.ts` holds the contract. **Edit the bar here, never in a demo.**

- The hero carousel's order is drawn per render (`src/lib/shuffle.ts`); the page cache keeps one draw until it
  renders again, at the latest the next day. The project grids use catalog order.

## Own projects

`src/lib/ownProjects.ts` holds WParted and its website: code-owned, one picture per language in
`public/projects/`, not probed and not synced. They carry the badge "Eigenes Projekt" and never
go into `references.ts`. Replace the pictures by hand when WParted or its website changes visibly.
