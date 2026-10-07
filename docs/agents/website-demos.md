# Website demos and the showcase

The demo sites (`demo1`…`demo5.tracht-digital.de`, plus `shop`) render on the home page in
`sections/Showcase.astro` and on the Webauftritt service page in `sections/WebsiteDemos.astro`.

## Three files, load-bearing split

- **`src/lib/demoCatalog.ts`** — id, order, host, URL and genre. Code-owned; the CMS must never name a host this
  site sends visitors to. Imported by the sync script, so it has **no other imports** (not even type-only).
  - A catalog entry may precede its site: while a host serves a placeholder, the sync records `placeholder` and
    no card renders; once deployed, a sync turns it into a card with no code change.
  - A demo's URL isn't always its bare host: `demo2`'s root is a language gate rejected as a placeholder, so its
    entry points at `/de/`.
- **`src/lib/demoData.json`** — the committed snapshot written by `npm run demos:sync` (each demo's own title,
  description, favicon and screenshot). Never edit by hand.
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

- `DemoDefinition.origin`, the badge on the screenshot ("Demo · fiktives Beispiel", or "Eigenes Projekt" for the
  shop). Closed vocabulary; never "Kunde" / "client".
- `DemoDefinition.kind`, the genre label (`DEMO_KINDS`: Webseite · Landingpage · Onlineshop). Closed vocabulary,
  names the genre never the subject; adding one means adding it in both languages. `demos.test.ts` holds it.

`homeContent.ts` owns only the section framing, overridable via the `website_demos` block. Never write a
description for someone's site; a demo without one shows none.

The framing exists **for one card and for several** (`headlineSingle`, `introSingle`, `serviceIntroSingle`);
`demosCopy()` picks by the number that survived the probe. The grid caps its own width (`auto-fit` would turn a
lone card into a poster).

## Design studies

Seven studies (`lib/designStudies.ts`, `ui/StudyCard.astro`) follow the demos on the shelf: invented brands, no
host, no URL. Captures carry "DESIGNSTUDIE · eigenständig erstellt · kein Kundenauftrag" as a watermark and the
card repeats it as a badge. Built to `DemoCard`'s measurements (16:10 band), shows the sector, no magnifier: the
bar's call to action opens the enlargement. Not in `sections/WebsiteDemos.astro`. `npm run studies:import`
writes the WebP; PNG originals stay out of the repo.

## Card structure

- **The card is not a wrapper `<a>`.** It carries a magnifier that opens the 1440 × 900 capture in
  `ui/PreviewLightbox.astro` (one native `<dialog>` per section); a `<button>` inside an `<a>` is invalid.
  Magnifiers ship `hidden` until `showModal` is confirmed. `previewLightbox.test.ts` guards nesting, the stretched
  link, the focus ring, the hidden default and focus restore.
- **Every card ends in the same bar**, `ui/CardActions.astro`, edge to edge with a 1 px seam, carrying exactly two
  links: the service the card is evidence for and the card's own destination.
  - The bar is a **sibling of the card body**, never inside it.
  - The **CTA carries the stretched `::after`** (card root `position: relative`); the service link is lifted above
    it with `z-index`, or it silently opens the other destination.
  - No card wraps the bar in an `<a>`.
  - The service link is a **prop**; on the Webauftritt page it is `null`. `cardActions.test.ts` guards geometry,
    that absence, and that a reference card never repeats its primary service as a badge.

## The showcase shelf

Every card is one track wide. The shelf has **no arrows**: it drifts on its own (32 px/s, a seamless loop over one
set of `aria-hidden` / `inert` clones) and is swiped (touch natively, mouse by drag). It stops under the pointer,
with focus inside, during a drag or touch, off screen and in a hidden tab, and never drifts under reduced motion or
the site's motion switch. `showcaseDrag.test.ts` holds the drag rules and clones. Scroll snap needs
`scroll-padding`.

## The demos' closing brand bar (`public/embed/tds-brand-bar.js`)

Each demo embeds only `<tds-brand-bar lang="…">` with a fallback link plus
`<script src="https://tracht-digital.de/embed/tds-brand-bar.js" defer>`.

- A **classic** script (a cross-origin module would need CORS), rendered in Shadow DOM so no host stylesheet can
  restyle it.
- One knob: `--tds-brand-bar-pad-bottom` for a host with a floating button over the bar.
- `.htaccess` caches `/embed/` for an hour.
- `brandBar.test.ts` holds the contract. **Edit the bar here, never in a demo.**
