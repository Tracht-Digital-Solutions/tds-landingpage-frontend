import { cmsFor, fetchBlocks } from "./cms";
import { hasBannedWord } from "./copyRules";
import type { Lang } from "./i18n";

/**
 * Pricing copy and the fixed-price packages.
 *
 * **No hourly rates** (decided 2026-09-22). The site used to publish four
 * rates beside the packages; now it shows the packages and says that
 * everything else is quoted individually. The rate fields are gone from this
 * block, so a panel block that still carries them is simply ignored — cmsFor()
 * merges only the keys the defaults know.
 *
 * `*asterisks*` mark a word for emphasis (see `./emphasis`); a CMS override
 * without them renders as plain text.
 */

/**
 * German VAT, for the net/gross switch in the price list. The published
 * figures are net; gross is derived, never stored.
 */
export const VAT_RATE = 0.19;

/** A net amount with VAT added, rounded to the cent. */
export function grossPrice(net: number): number {
  return Math.round(net * (1 + VAT_RATE) * 100) / 100;
}

/**
 * One fixed-price package.
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
    sub: "Drei Pakete zum *Festpreis*. Alles andere bekommst du als eigenes Angebot.",
    notesTitle: "Gut zu wissen",
    // Festpreis and Angebot are steps of `pricing_logic` (homeContent.ts),
    // rendered in the same box as these notes — listing them here as well
    // printed each of them twice.
    notes: [],
    ctaTitle: "Individuelle Lösungen",
    ctaSub: "Passt dein Vorhaben in kein Paket? Dann gibt es den Preis auf Anfrage.",
    ctaButton: "Anfrage stellen",
    back: "Zurück zur Startseite",
  },
  en: {
    label: "— Pricing",
    headline: "Pricing without",
    headlineAccent: "surprises.",
    sub: "Three packages at a *fixed price*. Everything else gets its own quote.",
    notesTitle: "Good to know",
    notes: [],
    ctaTitle: "Custom solutions",
    ctaSub: "Your project fits no package? Then the price is on request.",
    ctaButton: "Send a request",
    back: "Back to the homepage",
  },
};

/**
 * The committed fixed-price packages (decided 2026-09-21).
 *
 * Checked against the market that day: freelance web rates 60–120 €/h,
 * one-pagers 700–1,500 €, a takeover audit well under an agency's. The middle
 * package became "Website-Optimierung" at 780 € on 2026-09-22 (12 h × 65 €):
 * freelance page-speed work runs 299–799 €, an on-page SEO package 499–999 €.
 *
 * Not `cmsFor`-merged (see `ResolvedPricing`): a valid panel list REPLACES
 * this one as a whole, an empty or malformed one falls back to it.
 */
const defaultPackages: Record<Lang, PricePackage[]> = {
  de: [
    {
      title: "Website-Check",
      price: 390,
      description: "Ich prüfe deine Seite und sage dir, was zuerst dran ist.",
      includes: [
        "Technik, Sicherheit und Ladezeit geprüft",
        "Schriftlicher Bericht mit Prioritäten",
        "Besprechung der Ergebnisse",
      ],
    },
    {
      title: "Website-Optimierung",
      price: 780,
      description: "Ich mache deine bestehende Seite schneller, sicherer und besser auffindbar.",
      includes: [
        "Ladezeit optimiert: Bilder, Caching, Code",
        "Technische Fehler behoben, Updates eingespielt",
        "Titel und Beschreibungen für Google überarbeitet",
      ],
    },
    {
      title: "Onepager",
      price: 1040,
      description: "Eine neue Seite, die alles Wichtige auf einen Blick zeigt.",
      includes: [
        "Bis zu fünf Abschnitte",
        "Kontaktformular, Impressum und Datenschutz eingebunden",
        "Für Handy und Desktop gebaut",
      ],
    },
  ],
  en: [
    {
      title: "Website check",
      price: 390,
      description: "I review your site and tell you what to fix first.",
      includes: [
        "Tech, security and load time reviewed",
        "Written report with priorities",
        "Walk-through of the results",
      ],
    },
    {
      title: "Website optimisation",
      price: 780,
      description: "I make your existing site faster, safer and easier to find.",
      includes: [
        "Load time optimised: images, caching, code",
        "Technical faults fixed, updates applied",
        "Titles and descriptions reworked for Google",
      ],
    },
    {
      title: "One-pager",
      price: 1040,
      description: "A new site that shows everything important at a glance.",
      includes: [
        "Up to five sections",
        "Contact form, imprint and privacy policy included",
        "Built for phone and desktop",
      ],
    },
  ],
};

export function getDefaultPackages(lang: Lang): PricePackage[] {
  return defaultPackages[lang];
}

export function getPricingDefault(lang: Lang): PricingContent {
  return defaults[lang];
}

/**
 * The pricing block plus its fixed-price packages.
 *
 * `packages` is deliberately NOT a field of `PricingContent`. The panel list
 * replaces the committed one AS A WHOLE when it validates — a field-by-field
 * `cmsFor()` merge could pair a panel title with a committed price, which
 * would publish a figure nobody set for that package.
 */
export type ResolvedPricing = PricingContent & { packages: PricePackage[] };

export async function getPricingContent(lang: Lang): Promise<ResolvedPricing> {
  const resolved = await cmsFor("pricing_services", lang, getPricingDefault(lang));
  const blocks = await fetchBlocks(lang);
  const block = blocks["pricing_services"];
  const fromPanel = isRecord(block) ? validatePricePackages(block.packages) : [];
  const packages = fromPanel.length > 0 ? fromPanel : getDefaultPackages(lang);
  return { ...resolved, packages };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validate the panel's fixed-price packages (`pricing_services.packages`).
 *
 * The raw block field, outside `cmsFor()` — see `ResolvedPricing`. An empty
 * or invalid list means "use the committed packages".
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
    if (hasBannedWord(title) || hasBannedWord(description)) return [];

    // The bullet list may legitimately be absent; a package is still a package
    // without one. Anything non-textual in it, though, means the item is not
    // what it claims to be.
    const includesRaw = candidate.includes;
    let includes: string[] = [];
    if (Array.isArray(includesRaw)) {
      for (const entry of includesRaw) {
        if (typeof entry !== "string" || entry.trim() === "" || hasBannedWord(entry)) return [];
        includes.push(entry.trim());
      }
    } else if (includesRaw !== undefined && includesRaw !== null) {
      return [];
    }

    packages.push({ title, price, description, includes });
  }
  return packages;
}

