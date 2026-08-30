import { cmsFor } from "./cms";
import type { Lang } from "./i18n";
import type { ServiceId } from "./services";

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
    headline: "Klare Preise für",
    headlineAccent: "klare Verantwortung.",
    sub:
      "Sie sehen, welcher Stundensatz für welche Leistung gilt. Klar abgegrenzte Vorhaben können als Festpreis angeboten werden; laufende Betreuung wird passend zu Ihrem Betrieb vereinbart.",
    teaserHeadline: "Planbare Sätze,",
    teaserHeadlineAccent: "passende Modelle.",
    teaserSub:
      "Stundensätze ab 95 € netto. Für die komplette IT entsteht nach einer Bestandsaufnahme ein individuelles Monatsangebot.",
    teaserCta: "Preise ansehen",
    teaserFromLabel: "ab",
    hourSuffix: "/ Stunde",
    customRateLabel: "Individuelles Monatsangebot",
    includesLabel: "Typische Bestandteile:",
    rateConsulting: 120,
    rateProcess: 110,
    rateSolutions: 110,
    rateCustomDevelopment: 105,
    rateWebPresence: 95,
    notesTitle: "Gut zu wissen",
    notes: [
      "Alle genannten Preise sind Nettopreise zuzüglich gesetzlicher Umsatzsteuer.",
      "Ein Festpreis ist möglich, wenn Ziel, Umfang und Abnahme vorab klar abgegrenzt sind.",
      "Für laufende Betreuung sind individuelle Monatsmodelle möglich.",
      "Bei kompletter IT bestimmen unter anderem Arbeitsplätze, Geräte, Lizenzen, Sicherheitsumfang, Vor-Ort-Leistungen und vereinbarte Erreichbarkeit den Preis.",
    ],
    ctaTitle: "Lassen Sie uns den passenden Rahmen klären.",
    ctaSub:
      "Im Erstgespräch ordnen wir Ihr Vorhaben ein. Danach wissen Sie, welches Leistungs- und Preismodell sinnvoll ist.",
    ctaButton: "Erstgespräch vereinbaren",
    back: "Zurück zur Startseite",
  },
  en: {
    label: "— Pricing",
    headline: "Clear pricing for",
    headlineAccent: "clear ownership.",
    sub:
      "You can see which hourly rate applies to each service. Clearly bounded projects can be offered at a fixed price; ongoing support is tailored to your business.",
    teaserHeadline: "Predictable rates,",
    teaserHeadlineAccent: "models that fit.",
    teaserSub:
      "Hourly rates start at €95 excluding VAT. Complete IT is quoted as an individual monthly arrangement after an assessment.",
    teaserCta: "View pricing",
    teaserFromLabel: "from",
    hourSuffix: "/ hour",
    customRateLabel: "Individual monthly proposal",
    includesLabel: "Typical elements:",
    rateConsulting: 120,
    rateProcess: 110,
    rateSolutions: 110,
    rateCustomDevelopment: 105,
    rateWebPresence: 95,
    notesTitle: "Good to know",
    notes: [
      "All stated prices are net prices and exclude applicable VAT.",
      "A fixed price is possible when the goal, scope and acceptance criteria are clearly defined in advance.",
      "Individual monthly arrangements are available for ongoing support.",
      "For Complete IT, the price depends on factors such as users, devices, licences, security scope, on-site work and agreed availability.",
    ],
    ctaTitle: "Let us define the right setup.",
    ctaSub:
      "In the initial consultation we assess your needs. You will then know which service and pricing model makes sense.",
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
