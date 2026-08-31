import { cmsFor } from "./cms";
import type { Lang } from "./i18n";
import type { ServiceId } from "./services";

/**
 * Pricing copy and the five numeric hourly rates.
 *
 * `pricing.test.ts` pins the rates and the fact that Complete IT has none —
 * it is quoted monthly after an assessment, and inventing a number here
 * would also put an invented `Offer` price into the pricing JSON-LD.
 * `customRateLabel` must therefore keep saying "Monatsangebot" in German.
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
  customRateLabel: string;
  includesLabel: string;
  rateConsulting: number;
  rateProcess: number;
  rateSolutions: number;
  rateCustomDevelopment: number;
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
      "Ab 95 € netto pro Stunde. Für die komplette IT gibt es nach einer Bestandsaufnahme ein Monatsangebot.",
    teaserCta: "Preise ansehen",
    teaserFromLabel: "ab",
    hourSuffix: "/ Stunde",
    customRateLabel: "Monatsangebot",
    includesLabel: "Enthalten:",
    rateConsulting: 120,
    rateProcess: 110,
    rateSolutions: 110,
    rateCustomDevelopment: 105,
    rateWebPresence: 95,
    notesTitle: "Gut zu wissen",
    notes: [
      "Alle Preise sind netto, zuzüglich Mehrwertsteuer.",
      "Festpreis, wenn Ziel und Umfang vorher klar sind.",
      "Für laufende Betreuung gibt es Monatsmodelle.",
      "Bei kompletter IT bestimmen Arbeitsplätze, Geräte, Lizenzen, Sicherheit und Erreichbarkeit den Preis.",
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
      "From €95 net per hour. Complete IT is quoted monthly after an assessment.",
    teaserCta: "View pricing",
    teaserFromLabel: "from",
    hourSuffix: "/ hour",
    customRateLabel: "Monthly quote",
    includesLabel: "Included:",
    rateConsulting: 120,
    rateProcess: 110,
    rateSolutions: 110,
    rateCustomDevelopment: 105,
    rateWebPresence: 95,
    notesTitle: "Good to know",
    notes: [
      "All prices are net and exclude VAT.",
      "A fixed price works when the goal and scope are clear up front.",
      "Monthly arrangements are available for ongoing support.",
      "For Complete IT the price depends on workstations, devices, licences, security and agreed availability.",
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

export function getServiceRate(
  pricing: PricingContent,
  serviceId: ServiceId,
): number | undefined {
  const rates: Partial<Record<ServiceId, number>> = {
    consulting: pricing.rateConsulting,
    process: pricing.rateProcess,
    solutions: pricing.rateSolutions,
    "custom-development": pricing.rateCustomDevelopment,
    "web-presence": pricing.rateWebPresence,
  };
  return rates[serviceId];
}
