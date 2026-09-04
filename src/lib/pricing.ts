import { cmsFor } from "./cms";
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
    sub:
      "Sie sehen, was welche Leistung kostet. Steht der Umfang vorher fest, geht es auch zum *Festpreis*.",
    teaserHeadline: "Planbare Sätze,",
    teaserHeadlineAccent: "passende Modelle.",
    teaserSub:
      "Ab 65 € netto pro Stunde. Steht der Umfang vorher fest, rechne ich auch zum Festpreis ab.",
    teaserCta: "Preise ansehen",
    teaserFromLabel: "ab",
    hourSuffix: "/ Stunde",
    includesLabel: "Enthalten:",
    rateConsulting: 90,
    rateProcess: 80,
    rateSolutions: 80,
    rateWebPresence: 65,
    notesTitle: "Gut zu wissen",
    notes: [
      "Alle Preise sind netto, zuzüglich Mehrwertsteuer.",
      "Festpreis, wenn Ziel und Umfang vorher klar sind.",
      "Für laufende Betreuung gibt es Monatsmodelle.",
      "Bei Anzeigen kommt Ihr Mediabudget dazu; es geht direkt an Google.",
    ],
    ctaTitle: "Welcher Rahmen passt zu Ihnen?",
    ctaSub:
      "Im Erstgespräch ordnen wir Ihr Vorhaben ein. Danach wissen Sie, welches Modell passt.",
    ctaButton: "Erstgespräch vereinbaren",
    back: "Zurück zur Startseite",
  },
  en: {
    label: "— Pricing",
    headline: "Pricing without",
    headlineAccent: "surprises.",
    sub:
      "You can see what each service costs. When the scope is settled up front, a *fixed price* works too.",
    teaserHeadline: "Predictable rates,",
    teaserHeadlineAccent: "models that fit.",
    teaserSub:
      "From €65 net per hour. When the scope is settled up front, I work to a fixed price too.",
    teaserCta: "View pricing",
    teaserFromLabel: "from",
    hourSuffix: "/ hour",
    includesLabel: "Included:",
    rateConsulting: 90,
    rateProcess: 80,
    rateSolutions: 80,
    rateWebPresence: 65,
    notesTitle: "Good to know",
    notes: [
      "All prices are net and exclude VAT.",
      "A fixed price works when the goal and scope are clear up front.",
      "Monthly arrangements are available for ongoing support.",
      "Where ads are involved your media budget is extra; it goes to Google directly.",
    ],
    ctaTitle: "Which setup fits you?",
    ctaSub:
      "In the first conversation we place your project. After that you know which model fits.",
    ctaButton: "Arrange an initial consultation",
    back: "Back to the homepage",
  },
};

export function getPricingDefault(lang: Lang): PricingContent {
  return defaults[lang];
}

export async function getPricingContent(lang: Lang): Promise<PricingContent> {
  return cmsFor("pricing_services", lang, getPricingDefault(lang));
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
