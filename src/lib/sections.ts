/** All section IDs on the homepage in scroll order. Single source of truth. */
export const sectionIds = [
  "hero",
  "about",
  "services",
  "pricing-teaser",
  "tech",
  "portfolio",
  "process",
  "blog",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];
