# Languages, SEO, AI search and accessibility

## Languages

- Every indexable German page has a real English twin with reciprocal canonical and hreflang. Preserve the locale
  when linking between home, service and pricing pages.
- The language switch (`LanguageSwitch.astro`) is one link, rendered only when `alternatePath()` finds the page's
  twin in the route inventory.

## Sitemap

- `src/lib/sitemap.ts` is the explicit route inventory (SSR routes aren't emitted at build). Add both locale paths
  together and cover them in `src/lib/sitemap.test.ts`.
- **`SITEMAP_ENTRIES` stays the full inventory; `sitemapEntries()` is what renders.** The panel maintains per-site
  exclusions (`src/lib/sitemapExclusions.ts`, from `/content/sitemap-exclusions`); an excluded page is also served
  `noindex` by `Layout.astro`. `cache.ts` derives `alwaysPaths` from the unfiltered constant.
- **An exclusion drops the pair, never one URL.** `hreflangGroup()` reads pairing from the inventory, since
  `/leistungen/<slug.de>` ↔ `/en/services/<slug.en>` is neither a prefix nor a slug match.
- Sectioned: `sitemap-{pages,services,platforms}.xml` (`src/lib/sitemapSections.ts`), service pages with their photo
  as `image:image`. The index is server-rendered (the panel's exclusions decide which sections exist).
  `/sitemap-0.xml` renders on demand and is in `alwaysPaths` and on the `sitemap` cache event.
- Redirects and legal routes stay out of the public sitemap.

## Titles and descriptions

Distinct, truthful and within the limits enforced by `src/lib/seo.test.ts`, `services.test.ts` and
`platforms.test.ts`. `Layout.astro` uses the route's actual title. Titles: search term first,
"— Tracht Digital" last.

## JSON-LD

- Must match visible content after CMS resolution; FAQ answers use the same resolved values as the section.
- Pricing: each package is a plain `PriceSpecification` without a unit. A `UnitPriceSpecification` with
  `unitCode: "HUR"` would publish a four-figure hourly rate (`pricing.test.ts`). Figures are net.
- No `HowTo` node (retired rich result).
- Subpages emit one `@graph` (`lib/jsonld.ts`): `WebPage` (author, publisher, visible date as `dateModified`),
  `Service` (an `Offer` only where the page states it), `BreadcrumbList`, `FAQPage` where questions show.
  Organization, Person and WebSite live on the home page; subpages reference them by `@id`.
- No opening hours (`jsonld.test.ts`).

## AI search

AI Overviews, ChatGPT, Copilot, Perplexity and Claude read the same pages; write for people. What helps is what
the detail pages already do: an answer-first paragraph (who, what, for whom, where), real question headings
answered in their first sentences, fact tables linking sources, a visible "Stand" and named author, consistent
names. No extra "AI files", Markdown copies, keyword lists or fragmented content.

### `/llms.txt`

Generated (`src/lib/llmsTxt.ts` + `src/pages/llms.txt.ts`, `prerender = false`): URLs from `sitemapEntries()`,
amounts from the resolved price list, titles from `resolveServiceContent`.

- **`public/llms.txt` must stay deleted**; a static asset shadows the route (`llmsTxt.test.ts`).
- Not in `alwaysPaths` and on no cache event (the page cache stores no `text/plain`). One file, ≤ 8 KB, no
  `llms-full.txt`.

### `robots.txt`

`public/robots.txt` names sixteen agents in three ranks (the answer engines of OpenAI, Anthropic, Perplexity,
Google, Apple, Meta AI, DuckDuckGo and Mistral, plus two retired Anthropic names); every group repeats
`Disallow: /install/` and `Disallow: /tds/` (`robotsTxt.test.ts`). Dataset-only crawlers stay under the
permissive `*` group.

### Geo audit and IndexNow

- **`scripts/geo-audit.mjs` is the same file in all four public repos**; only `PROFILE` differs. **This repo
  maintains the generic body.** `src/lib/geoAudit.test.ts` reads `CHECK_IDS` as text (the script fetches on its
  first line). `PROFILE` carries refused types: `SearchAction`, `HowTo`, `Review`, `AggregateRating`,
  `openingHoursSpecification`.
- **IndexNow** (`npm run indexnow`) tells IndexNow engines which URLs changed. Key: `public/<key>.txt`. Manual,
  after a deploy, never from the build; `-- --dry-run` lists without sending.

## Accessibility

- Service cards are semantic links with a full-card hit area, visible focus and meaningful text. Prefer native
  links, headings, lists, `<details>/<summary>` and form controls.
- Keep the skip link (in the page's language), logical headings, labelled controls, keyboard mobile navigation,
  the no-flash theme bootstrap and reduced-motion behaviour. Entrance states must restore opacity/position even at
  zero duration.

### The redesign contract (`src/lib/a11yContract.test.ts`)

Every rule was broken on the live site once, silently:

- `AccentLetters` reads its word from an `sr-only` copy; never `aria-label` on a span or div.
- The FAQ is **one** native `<details name="faq">` accordion at every width (not a tablist, not a second hidden copy).
- **Fixed bottom chrome never hides focus:** `scroll-padding-bottom` adds `--tds-bottom-lane` (cookie notice) and
  `--lp-floating-lane`; the footer adds both lanes to its bottom padding. The header stops being fixed below
  `max-height: 30rem` (400 % zoom, landscape phones).
- A link inside a card whose bar CTA stretches over it needs `position: relative; z-index: 1`.
- The language switch is one link, only when the twin exists.
- Touch targets ≥ 44 px on `pointer: coarse` (footer links, card bars, breadcrumb, language link, trust links);
  process steps are not focus stops; the contact form ties each error to its field and never renders fields
  invisible before hydration.
