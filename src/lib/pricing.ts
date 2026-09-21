import { cmsFor, fetchBlocks } from "./cms";
import type { Lang } from "./i18n";
import type { ServiceId } from "./services";

/**
 * Pricing copy and the four numeric hourly rates.
 *
 * `pricing.test.ts` pins the rates. Every service has one, so the pricing
 * JSON-LD carries an `Offer` for all four — there is no rate-less service
 * left to omit, and none may be given an invented number.
 *
 * `*asterisks*` mark a word for emphasis (see `./emphasis`); a CMS override
 * without them renders as plain text.
 */

/**
 * One fixed-price package, beside the hourly rates.
 *
 * `price` is a number, not prose: it is formatted as currency for the page and
 * emitted as a numeric `Offer` in structured data. A string here would put an
 * unparseable value into both.
 */
export interface PricePackage {
  title: string;
  /** Net EUR, a single figure. Never a range — see `homeContent.test.ts`. */
  price: number;
  description: string;
  includes: string[];
}

export interface PricingContent {
  label: string;
  headline: string;
  headlineAccent: string;
  sub: string;
  teaserHeadline: string;
  teaserHeadlineAccent: string;
  teaserSub: string;
  teaserCta: string;
  teaserFromLabel: string;
  hourSuffix: string;
  includesLabel: string;
  rateConsulting: number;
  rateProcess: number;
  rateSolutions: number;
  rateWebPresence: number;
  notesTitle: string;
  notes: string[];
  ctaTitle: string;
  ctaSub: string;
  ctaButton: string;
  back: string;
}

const defaults: Record<Lang, PricingContent> = {
  de: {
    label: "— Preise",
    headline: "Preise ohne",
    headlineAccent: "Überraschungen.",
    sub: "Du siehst vorher, was jede Leistung pro Stunde kostet. Bei klarem Umfang geht auch ein *Festpreis*.",
    teaserHeadline: "Planbare Sätze,",
    teaserHeadlineAccent: "passende Modelle.",
    teaserSub:
      "Ab 65 € netto pro Stunde. Steht der Umfang vorher fest, rechne ich auch zum Festpreis ab.",
    teaserCta: "Preise ansehen",
    teaserFromLabel: "ab",
    hourSuffix: "/ Stunde",
    includesLabel: "Enthalten:",
    rateConsulting: 75,
    rateProcess: 70,
    rateSolutions: 70,
    rateWebPresence: 65,
    notesTitle: "Gut zu wissen",
    // Festpreis and Monatsmodelle are steps of `pricing_logic`
    // (homeContent.ts), rendered in the same box as these notes — listing them
    // here as well printed each of them twice.
    notes: [
      "Alle Preise netto, zuzüglich Mehrwertsteuer.",
      "Bei Anzeigen kommt dein Werbebudget dazu. Es geht direkt an Google.",
    ],
    ctaTitle: "Welcher Rahmen passt zu dir?",
    ctaSub: "Das klären wir im Erstgespräch.",
    ctaButton: "Erstgespräch vereinbaren",
    back: "Zurück zur Startseite",
  },
  en: {
    label: "— Pricing",
    headline: "Pricing without",
    headlineAccent: "surprises.",
    sub: "You can see up front what each service costs per hour. When the scope is clear, a *fixed price* works too.",
    teaserHeadline: "Predictable rates,",
    teaserHeadlineAccent: "models that fit.",
    teaserSub:
      "From €65 net per hour. When the scope is settled up front, I work to a fixed price too.",
    teaserCta: "View pricing",
    teaserFromLabel: "from",
    hourSuffix: "/ hour",
    includesLabel: "Included:",
    rateConsulting: 75,
    rateProcess: 70,
    rateSolutions: 70,
    rateWebPresence: 65,
    notesTitle: "Good to know",
    notes: [
      "All prices are net, plus VAT.",
      "Ads come with your own media budget. It goes to Google directly.",
    ],
    ctaTitle: "Which setup fits you?",
    ctaSub: "We work that out in the first conversation.",
    ctaButton: "Arrange an initial consultation",
    back: "Back to the homepage",
  },
};

export function getPricingDefault(lang: Lang): PricingContent {
  return defaults[lang];
}

/**
 * The pricing block plus its fixed-price packages.
 *
 * `packages` is deliberately NOT a field of `PricingContent`: that object is
 * the runtime schema `cmsFor()` merges against, and a list whose committed
 * default is empty is one it refuses outright. The packages therefore come off
 * the raw block, exactly as service references do.
 */
export type ResolvedPricing = PricingContent & { packages: PricePackage[] };

export async function getPricingContent(lang: Lang): Promise<ResolvedPricing> {
  const resolved = await cmsFor("pricing_services", lang, getPricingDefault(lang));
  const blocks = await fetchBlocks(lang);
  const block = blocks["pricing_services"];
  const packages = isRecord(block) ? validatePricePackages(block.packages) : [];
  return { ...resolved, packages };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validate the fixed-price packages, which default to an EMPTY list.
 *
 * Same boundary problem as `validateServiceReferences` in `./services`, for
 * the same reason: `cmsFor()` refuses to infer a schema from an empty fallback
 * list, and the committed default here has to be empty because nobody may
 * publish an invented price. So the raw block field is validated here instead.
 *
 * Strict on purpose, and one malformed item rejects the whole list — matching
 * `cmsFor()`'s own list behaviour. A package with a missing title or a price
 * of `0` is not a cheaper package, it is an unfinished one, and a page that
 * shows "0 €" beside a real figure is worse than a page that shows neither.
 */
export function validatePricePackages(value: unknown): PricePackage[] {
  if (!Array.isArray(value) || value.length === 0) return [];

  const packages: PricePackage[] = [];
  for (const candidate of value) {
    if (!isRecord(candidate)) return [];

    const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
    const description =
      typeof candidate.description === "string" ? candidate.description.trim() : "";
    const price = typeof candidate.price === "number" ? candidate.price : Number.NaN;
    if (title === "" || !Number.isFinite(price) || price <= 0) return [];

    // The bullet list may legitimately be absent; a package is still a package
    // without one. Anything non-textual in it, though, means the item is not
    // what it claims to be.
    const includesRaw = candidate.includes;
    let includes: string[] = [];
    if (Array.isArray(includesRaw)) {
      for (const entry of includesRaw) {
        if (typeof entry !== "string" || entry.trim() === "") return [];
        includes.push(entry.trim());
      }
    } else if (includesRaw !== undefined && includesRaw !== null) {
      return [];
    }

    packages.push({ title, price, description, includes });
  }
  return packages;
}

/**
 * The hourly rate for a service.
 *
 * Total, not partial. Complete IT used to be absent from this map on purpose —
 * that omission WAS the "no invented price" rule, and every caller carried an
 * `undefined` branch for it. With that service gone the branch was dead code
 * that still forced a null check at three call sites, so the map is now
 * exhaustive and the return type says so. A new rate-less service would fail
 * to compile here, which is the right place to notice it.
 */
export function getServiceRate(
  pricing: PricingContent,
  serviceId: ServiceId,
): number {
  const rates: Record<ServiceId, number> = {
    consulting: pricing.rateConsulting,
    process: pricing.rateProcess,
    solutions: pricing.rateSolutions,
    "web-presence": pricing.rateWebPresence,
  };
  return rates[serviceId];
}

/**
 * The lowest of the four rates — "ab …" wherever the site quotes a floor.
 *
 * Computed from the resolved block, never typed into copy: the hero's trust
 * card says "Stundensätze ab {rate} €", and a rate edited in the panel has to
 * move that sentence too.
 */
export function lowestRate(pricing: PricingContent): number {
  return Math.min(
    pricing.rateConsulting,
    pricing.rateProcess,
    pricing.rateSolutions,
    pricing.rateWebPresence,
  );
}

/**
 * The top of the published band, for the `priceRange` of the LocalBusiness
 * node. Derived rather than written down for the same reason `lowestRate` is:
 * the rates move, and a second place stating them would drift.
 */
export function highestRate(pricing: PricingContent): number {
  return Math.max(
    pricing.rateConsulting,
    pricing.rateProcess,
    pricing.rateSolutions,
    pricing.rateWebPresence,
  );
}
