import type { Lang } from "~/lib/i18n";
import { siteConfig } from "~/lib/seo";

/**
 * The two facts under "Wieso ich?" (2026-10-12): a one-word heading and a
 * figure, nothing else. Code-owned like the certificates teaser — they are
 * claims about the person, and an editor must not be able to retype them.
 *
 * The years are COMPUTED from `codingSince`, never written down, so the number
 * cannot go stale. The page cache is gated per build and day, so a cached page
 * picks up the new count on the first render of a new year.
 *
 * `from` is where the figure counts up from when the tile scrolls into view
 * (`sections/About.astro`, the same count as the prices'). The markup always
 * carries the final `value`; `sr` is the full sentence for screen readers.
 */
export interface AboutFact {
  label: string;
  value: number;
  from: number;
  prefix: string;
  /** Shown after the figure, e.g. " Jahre"; empty for a year. */
  unit: string;
  sr: string;
}

export function yearsSince(year: number, now: Date = new Date()): number {
  return Math.max(0, now.getFullYear() - year);
}

export function aboutFacts(lang: Lang, now: Date = new Date()): AboutFact[] {
  const since = siteConfig.founder.codingSince;
  const years = yearsSince(since, now);
  const founded = siteConfig.foundingYear;
  return lang === "de"
    ? [
        {
          label: "Programmiererfahrung",
          value: years,
          from: 0,
          prefix: "+",
          unit: years === 1 ? " Jahr" : " Jahre",
          sr: `Mindestens ${years} Jahre Programmiererfahrung, seit ${since}`,
        },
        {
          label: "Selbstständig",
          value: founded,
          from: since,
          prefix: "",
          unit: "",
          sr: `Selbstständig seit ${founded}`,
        },
      ]
    : [
        {
          label: "Experience",
          value: years,
          from: 0,
          prefix: "+",
          unit: years === 1 ? " year" : " years",
          sr: `At least ${years} years of programming experience, since ${since}`,
        },
        {
          label: "Self-employed",
          value: founded,
          from: since,
          prefix: "",
          unit: "",
          sr: `Self-employed since ${founded}`,
        },
      ];
}
