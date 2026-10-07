# Content, copy rules and CMS

## Copy rules

- **Short and clear:** one statement per sentence, about three points per list, four questions on a platform
  page, six on the home page, no filler. Cut before adding. SEO duties stay: summaries 81–160 characters, an
  answer-first paragraph (who, what, where), question headings, sources for facts.
- **The site says "du"**, lowercase, in every text addressing the visitor. Only the legal register stays formal
  (Impressum, Datenschutzerklärung, AGB, tds-shared's consent dialog). Formal sentences shipped by tds-shared
  are overridden locally (`lib/contactCopy.ts`, `lib/processContent.ts`). `addressForm.test.ts` fails on
  "Sie/Ihnen/Ihr…" outside `pages/legal/`. Panel blocks saved before the switch override defaults until cleared.
- **"echt" and "wirklich" never appear**, in any inflection. `bannedWords.test.ts` scans copy sources and the
  tds-shared strings; `cms.ts` refuses a panel string containing one (`lib/copyRules.ts`); `npm run audit:geo`
  scans rendered pages.
- **Positioning (`homeContent.test.ts`):** no free or time-boxed first conversation ("kostenlos",
  "kostenfrei", "gratis", minutes); the one sentence about its cost is "Kosten entstehen erst, wenn wir einen
  Auftrag vereinbaren."; no project price ranges, only the cost logic; no hourly rates.
- **No opening hours** on the page or in the schema (work is by arrangement; `jsonld.test.ts`).
- Don't reintroduce Komplette IT or Auftragsprogrammierung as offers (a test greps the prose).

## How CMS content is read

`src/lib/cms.ts` reads all blocks for one language from `GET /content/landing?lang=…`.
`cmsFor(section, lang, fallback)` treats the committed fallback as its runtime schema and applies only useful,
type-compatible values. Missing, blank, unknown or malformed values keep the default; new list items need a
complete valid shape; a malformed list falls back as a unit. **Preserve this fail-soft contract.**

- Reads are server-side and generation-scoped through `contentCache` (`src/lib/contentCache.ts`). **Don't restore
  a process-lifetime memo**: after invalidation it would render stale content into a fresh cache entry.
- `contentCache` must stay out of `cache.ts`: `cache.ts` imports the service catalog, so importing it from a
  content fetch closes the cycle `services.ts` → `cms.ts` → `cache.ts` → `services.ts`, which throws at module
  evaluation and is invisible to `astro check`.
- **A CMS-editable list needs a non-empty committed fallback.** `mergeCmsValue` refuses overrides for a list
  whose default is empty, so `[]` makes the panel field inert. Exceptions validate the raw block field outside
  `cmsFor`: service references (`validateServiceReferences` in `lib/services.ts`, default empty) and price
  packages (`validatePricePackages` in `lib/pricing.ts`, replaced as a whole). Contact `reasons` ship committed.
- **Every block this site renders has a panel schema** in `tds-ext-website-cms-pkg/islands/sections.ts`. Check
  that repo before claiming otherwise. Change fallbacks, the structured schema, validation tests and renderers
  together.

## Blocks

- Page-level: `home_hero`, `why_me`, `services_overview`, `digital_responsibility`, `pricing_services`,
  `faq_v2`, plus `home_trust`, `first_call`, `pricing_logic`, `references_home`, `website_demos`, `footer`,
  `contact`. `digital_responsibility`, `why_me.reasons` and `home_hero.scrollHint` have no renderer (kept so
  stored blocks load).
- Legacy `hero`, `about`, `services`, `consulting`, `pricing`, `faq` stay readable in the editor but have no
  renderer; don't wire them back. `tech` and `portfolio` were removed.
- **Four service blocks:** `service_consulting`, `service_process`, `service_solutions`, `service_web_presence`
  (websites, shops and marketing). Contract development folded into Individuelle Lösungen, marketing into
  Webauftritt, Komplette IT withdrawn; retired URLs answer 301 from `retiredServiceTargets`
  (`src/lib/services.ts`). Never turn those into 404s or reuse a retired slug.
- Each service block exposes `label`, `title`, `summary`, `intro`; titled lists `situations`,
  `responsibilities`, `outcomes`, `boundaries`, `process`; `priceLabel` / `priceText`;
  `referencesLabel` / `referencesHeadline`; references (`title`, `context`, `challenge`, `solution`, `result`,
  optional `metric`); `ctaTitle`, `ctaText`, `ctaButton`. No editable ids, slugs or URLs.
- A service `summary` is the detail page's lead, its meta description and the price card's text: keep overrides
  80–160 characters. The home explorer panel leads with it, then `situations[0]`, `outcomes[0]`, keywords, a
  next step.
- Home cards, pricing and detail pages resolve from one catalog; DE and EN are edited separately.

## References (`src/lib/references.ts`)

Code-owned, because a card links to a service page, a journal article and, for a named case, the customer's site.
`ServiceReference.articleUrl` and `.siteUrl` are **unreachable from the CMS**: `validateServiceReferences`
rebuilds items field by field and `mergeReferences` restores both from the committed case.

`resolveServiceContent` resolves three states:

- no `references` key, or a malformed list ⇒ committed cases render;
- a valid non-empty list ⇒ overrides the **text** position by position, links unchanged, extra entries without
  links;
- an **explicitly empty array** ⇒ the section disappears (the way to pull a case without a deploy). Detected by
  the key being present, not by an empty validated result.

**Anonymised by default:** no customer name, no link to a customer's site. A named case needs the customer's
approval, `disclosure: "named"` and their address in `siteUrl`. `references.test.ts` enforces it (customer
vocabulary in anonymous cases, no URLs in prose, `disclosure` ↔ `siteUrl` both ways, no `siteUrl` at our own
origins). Screenshots of a customer site need `previewAllowed` (see IMAGES.md).

While a named case is published, no surface may promise that references are always anonymised; that sentence
lives in `homeContent.ts` (`referencesHome.label`) and in `services.ts` (`referencesLabel`, 4 services × 2
languages). A test ties the copy to the catalog.

Asymmetries:

- `sections/References.astro` reads `referenceCases` directly, so the empty-array switch doesn't reach the home
  page; removing a named customer there is a code change.
- `mergeReferences` maps over the CMS list, so a stored list shorter than the committed one hides committed cases
  on that service page. Check the stored block when adding a case.

The home framing is the `references_home` block (defaults in `homeContent.ts`); `block` cache events already
rebuild home and service pages for any block id.
