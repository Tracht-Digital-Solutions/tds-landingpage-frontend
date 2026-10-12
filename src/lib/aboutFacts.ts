import type { Lang } from "~/lib/i18n";
import { siteConfig } from "~/lib/seo";

/**
 * The two facts under "Wieso ich?" (2026-10-12): years of programming and
 * self-employed since. Code-owned like the certificates teaser — they are
 * claims about the person, and an editor must not be able to retype them.
 *
 * The years are COMPUTED from `codingSince`, never written down, so the number
 * cannot go stale. The page cache is gated per build and day, so a cached page
 * picks up the new count on the first render of a new year.
 */
export interface AboutFact {
  value: string;
  label: string;
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
        { value: `${years} Jahre`, label: `Programmiererfahrung seit ${since}` },
        { value: `Seit ${founded}`, label: "selbstständig mit Tracht Digital Solutions" },
      ]
    : [
        { value: `${years} years`, label: `of programming experience since ${since}` },
        { value: `Since ${founded}`, label: "self-employed with Tracht Digital Solutions" },
      ];
}
