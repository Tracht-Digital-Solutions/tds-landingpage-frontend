/**
 * The design studies on the showcase shelf — code-owned, like `demoCatalog.ts`.
 *
 * ### Why these are not demos
 *
 * A demo is a running site: `demos.ts` probes it before a card renders, and
 * everything a card says about it was harvested from the site itself. A design
 * study is a PICTURE. There is no host to probe, no `<title>` to read and no
 * address to send a visitor to — the whole of it is the capture and what we
 * say about our own work. Putting one through the availability check would be
 * a statement about its nature that is not true, so it has its own catalog and
 * its own card.
 *
 * They still share the shelf, the origin vocabulary (`DEMO_ORIGINS.study`) and
 * the genre etiquette (`DEMO_KINDS`) with the demos, because a visitor
 * scanning one row should not have to learn two labelling systems. What the
 * badge has to make unmissable is the one thing that matters: none of these
 * was a client's order. Every capture carries that in the picture as well —
 * the studies were made with a watermark saying so.
 *
 * ### What a description may say
 *
 * These are OUR OWN studies, so unlike a demo's harvested text the sentences
 * below are written here. They describe what the study shows — the trade, the
 * structure, the number of blocks. They never claim a result, a client or a
 * commission, and `designStudies.test.ts` keeps a URL out of them.
 *
 * The brands are invented. Their own footers say so ("fiktive Marke zu
 * Demonstrationszwecken"), and no address, telephone number or person on any
 * of these captures belongs to anybody.
 */
import type { DemoKind } from "./demoCatalog";
import { STUDY_ASSET_DIR, studyImageSrc } from "./designStudyMeta";
import type { Lang } from "./i18n";

export { STUDY_ASSET_DIR, studyImageSrc };

/**
 * One capture of a study.
 *
 * Several studies have a second one — the same page on a phone, or a second
 * screen of the same site. They are views of ONE study rather than separate
 * cards: two cards for one piece of work would make the shelf say there is
 * more of it than there is.
 */
export interface StudyView {
  /** Stable id inside its study, and the suffix of the file. */
  id: string;
  label: Record<Lang, string>;
  /** Site-absolute path under `public/`. */
  src: string;
  /** The committed file's own size, for the box a card reserves. */
  width: number;
  height: number;
}

export interface DesignStudy {
  /** Stable, code-owned identity, and the basename of its assets. */
  id: string;
  /** Genre etiquette, from the closed set in `demoCatalog.ts`. */
  kind: DemoKind;
  /** The invented brand, as it appears in the capture. */
  title: string;
  /** Trade and sector — the caption where a demo card shows its host. */
  sector: Record<Lang, string>;
  description: Record<Lang, string>;
  /** At least one. `views[0]` is the card's picture. */
  views: readonly StudyView[];
}

const VIEW_LABELS = {
  desktop: { de: "Am Rechner", en: "On a desktop" },
  mobile: { de: "Auf dem Telefon", en: "On a phone" },
  home: { de: "Startseite", en: "Home page" },
  advisor: { de: "Produktberater", en: "Product finder" },
} as const;

export const designStudies: readonly DesignStudy[] = [
  {
    id: "nordholz-tischlerei",
    kind: "website",
    title: "Nordholz Tischlerei",
    sector: { de: "Handwerk · Tischlerei", en: "Trade · joinery" },
    description: {
      de: "Handwerk, das man sieht: Werkstattfotos, fünf Leistungen, ein Team mit Namen. Die Anfrage steht am Ende der Seite.",
      en: "Craft you can see: workshop photos, five services, a team with names. The enquiry sits at the end of the page.",
    },
    views: [
      { id: "desktop", label: VIEW_LABELS.desktop, src: studyImageSrc("nordholz-tischlerei"), width: 949, height: 1658 },
    ],
  },
  {
    id: "kinderarztpraxis-sonnengarten",
    kind: "website",
    title: "Kinderarztpraxis Sonnengarten",
    sector: { de: "Gesundheit · Arztpraxis", en: "Health · medical practice" },
    description: {
      de: "Eine Praxisseite für Eltern: Leistungen, Sprechzeiten, Anfahrt. Die zweite Ansicht zeigt dieselbe Seite auf dem Telefon.",
      en: "A practice page for parents: services, opening hours, directions. The second view shows the same page on a phone.",
    },
    views: [
      {
        id: "desktop",
        label: VIEW_LABELS.desktop,
        src: studyImageSrc("kinderarztpraxis-sonnengarten"),
        width: 1024,
        height: 1536,
      },
      {
        id: "mobile",
        label: VIEW_LABELS.mobile,
        src: studyImageSrc("kinderarztpraxis-sonnengarten-mobil"),
        width: 862,
        height: 1825,
      },
    ],
  },
  {
    id: "mira-markt",
    kind: "shop",
    title: "Mira Markt",
    sector: { de: "Handel · Lebensmittelmarkt", en: "Retail · grocery store" },
    description: {
      de: "Ein Markt mit Onlinebestellung und Abholung vor Ort. Drei Sprachen im Kopf, die Kategorien als Bildkacheln.",
      en: "A grocery with online ordering and pickup in store. Three languages in the header, the categories as picture tiles.",
    },
    views: [
      { id: "home", label: VIEW_LABELS.home, src: studyImageSrc("mira-markt"), width: 1440, height: 810 },
    ],
  },
  {
    id: "prisma-coat",
    kind: "website",
    title: "PRISMA COAT",
    sector: { de: "Industrie · Beschichtung", en: "Industry · coating" },
    description: {
      de: "Ein Industriebetrieb mit sechs Leistungen und fünf Branchen. Das Anfrageformular steht neben der Vorstellung, nicht auf einer eigenen Seite.",
      en: "An industrial supplier with six services and five sectors. The enquiry form sits beside the introduction rather than on a page of its own.",
    },
    views: [
      { id: "home", label: VIEW_LABELS.home, src: studyImageSrc("prisma-coat"), width: 1254, height: 1254 },
    ],
  },
  {
    id: "mkb-beratung",
    kind: "website",
    title: "MKB · Psychosoziale Beratung",
    sector: { de: "Gesundheit · Beratung", en: "Health · counselling" },
    description: {
      de: "Eine ruhige Seite für eine Beratungspraxis. Der Ablauf in fünf Schritten, die Qualifikationen, die häufigen Fragen.",
      en: "A quiet page for a counselling practice. The process in five steps, the qualifications, the common questions.",
    },
    views: [
      { id: "home", label: VIEW_LABELS.home, src: studyImageSrc("mkb-beratung"), width: 724, height: 2172 },
    ],
  },
  {
    id: "serverspace24",
    kind: "website",
    title: "ServerSpace24",
    sector: { de: "IT · Hosting und Domains", en: "IT · hosting and domains" },
    description: {
      de: "Ein Hoster mit dichter Tarifübersicht und Domainsuche. Die zweite Ansicht ist der Produktberater.",
      en: "A hosting provider with a dense tariff table and a domain search. The second view is the product finder.",
    },
    views: [
      { id: "home", label: VIEW_LABELS.home, src: studyImageSrc("serverspace24"), width: 1024, height: 1536 },
      {
        id: "advisor",
        label: VIEW_LABELS.advisor,
        src: studyImageSrc("serverspace24-produktberater"),
        width: 1024,
        height: 1536,
      },
    ],
  },
  {
    id: "jurisblick",
    kind: "website",
    title: "Jurisblick.de",
    sector: { de: "Recht · Informationsportal", en: "Law · information portal" },
    description: {
      de: "Ein Rechtsportal mit viel Inhalt und wenig Platz. Die Navigation trägt die Struktur, die Startseite nur den Einstieg.",
      en: "A legal portal with a lot of content and little room. The navigation carries the structure, the home page only the way in.",
    },
    views: [
      { id: "home", label: VIEW_LABELS.home, src: studyImageSrc("jurisblick"), width: 1024, height: 1536 },
    ],
  },
];

/** The card's picture — `views[0]`, named so nothing indexes the array by hand. */
export function coverView(study: DesignStudy): StudyView {
  return study.views[0];
}

/** This site's own words about its own cards. Not editable copy. */
export const studyUi: Record<Lang, { open: string; sectorLabel: string; viewsLabel: string }> = {
  de: {
    open: "Design ansehen",
    sectorLabel: "Branche",
    viewsLabel: "Ansichten",
  },
  en: {
    open: "View the design",
    sectorLabel: "Sector",
    viewsLabel: "Views",
  },
};
