/**
 * The certificates shown on the qualifications page — code-owned, like
 * `demoCatalog.ts` and `references.ts`.
 *
 * ### Why these live in code and not in the CMS
 *
 * Every field below is printed on a document: the title, the partner, the day
 * it was completed, the hours it took, the skills it names and the certificate
 * id. A content editor may rewrite the words this site says about itself; a
 * record of what somebody completed is not that, and an editable one would be
 * a claim nobody could check. The page shows the certificate ITSELF as a
 * picture for the same reason — the paper is the evidence, the text beside it
 * is only a caption.
 *
 * ### What these are, and what they are not
 *
 * All thirteen are completed LinkedIn Learning paths. Several carry a
 * partner's logo — Microsoft, Atlassian, Docker, Moz — and that partner wrote
 * the content; none of them is a vendor exam or an academic degree. The page
 * says so in one sentence directly under the lead, and `credentials.test.ts`
 * checks the sentence is still there. Without it the Microsoft wordmark on the
 * paper reads as a certification it is not.
 *
 * ### The order
 *
 * Groups first, in the order below, and inside a group by how close the
 * subject is to the work this business sells. That is a judgement, so it is
 * written down once here rather than re-decided in every component: the page
 * renders the groups in this order, and the "Wieso ich?" teaser takes the
 * first three entries of the flat list.
 *
 * `durationMinutes` and `completedAt` are transcribed from the PDF, never
 * derived. The PDFs are committed beside the images they produced
 * (`src/assets/certificates/`), so any line here can be checked against its
 * source without leaving the repository.
 */
import { CREDENTIAL_ASSET_DIR, credentialImageSrc } from "./credentialMeta";
import type { Lang } from "./i18n";

export { CREDENTIAL_ASSET_DIR, credentialImageSrc };

/** Localized route segments. Both trees really serve these — see `sitemap.ts`. */
export const CREDENTIALS_SLUG: Record<Lang, string> = {
  de: "/qualifikationen",
  en: "/en/qualifications",
};

export function credentialsHref(lang: Lang): string {
  return CREDENTIALS_SLUG[lang];
}

export type CredentialGroupId = "web" | "projects" | "operations" | "data";

/**
 * The four headings, in display order.
 *
 * Closed, like `DEMO_KINDS`: a certificate whose subject fits none of these
 * means the list is wrong, not that a fifth heading should be invented at the
 * call site.
 */
export const CREDENTIAL_GROUPS = {
  web: {
    de: { title: "Web & Sichtbarkeit", lead: "Damit die Seite gefunden wird." },
    en: { title: "Web & visibility", lead: "So the site gets found." },
  },
  projects: {
    de: { title: "Projekte & Prozesse", lead: "Damit ein Vorhaben ankommt." },
    en: { title: "Projects & processes", lead: "So a project lands." },
  },
  operations: {
    de: { title: "Technik & Betrieb", lead: "Damit es danach läuft und sicher bleibt." },
    en: { title: "Engineering & operations", lead: "So it keeps running, and stays safe." },
  },
  data: {
    de: { title: "Daten & KI", lead: "Damit Entscheidungen auf Zahlen stehen." },
    en: { title: "Data & AI", lead: "So decisions stand on numbers." },
  },
} as const satisfies Record<CredentialGroupId, Record<Lang, { title: string; lead: string }>>;

/** The groups in display order — one list, so nothing can iterate them differently. */
export const CREDENTIAL_GROUP_ORDER: readonly CredentialGroupId[] = [
  "web",
  "projects",
  "operations",
  "data",
];

export interface Credential {
  /** Stable identity, and the basename of the image and the source PDF. */
  id: string;
  group: CredentialGroupId;
  /**
   * The official title, exactly as printed.
   *
   * NOT translated, and not localizable: it is the name of a document. The
   * German page shows the English title and explains it in the note beside it,
   * which is what a translated title would only pretend to do.
   */
  title: string;
  /** Who issued it and, where there is one, whose content it is. */
  issuer: string;
  /** The day the path was completed, as printed (YYYY-MM-DD, UTC). */
  completedAt: string;
  /** Course length in minutes, as printed. */
  durationMinutes: number;
  /** "Top skills covered", in the order the certificate lists them. */
  skills: readonly string[];
  /** The certificate id printed at the foot of the document. */
  certificateId: string;
  /** One sentence, in the language of the page: what it is good for here. */
  note: Record<Lang, string>;
}

export const credentials: readonly Credential[] = [
  // ── Web & Sichtbarkeit ────────────────────────────────────────────────────
  {
    id: "seo-moz",
    group: "web",
    title: "Search Engine Optimization Professional Certificate by Moz",
    issuer: "LinkedIn Learning · Moz",
    completedAt: "2026-09-27",
    durationMinutes: 292,
    skills: ["AI for Marketing", "Search Engine Optimization (SEO)", "SEO Copywriting"],
    certificateId: "cae4d56b67d967880a57a63d13fea751f8eef40b2f29447f0f918a80347f511c",
    note: {
      de: "Suchmaschinen, Inhalte und Technik — die Grundlage der Arbeit an Sichtbarkeit.",
      en: "Search engines, content and the technical side — the groundwork for being found.",
    },
  },

  // ── Projekte & Prozesse ───────────────────────────────────────────────────
  {
    id: "project-management-microsoft",
    group: "projects",
    title: "Career Essentials in Project Management by Microsoft and LinkedIn",
    issuer: "LinkedIn Learning · Microsoft",
    completedAt: "2026-09-16",
    durationMinutes: 878,
    skills: ["Budget Development", "Project Management", "Project Communications"],
    note: {
      de: "Vorhaben planen, Budgets führen, Beteiligte auf dem Laufenden halten.",
      en: "Planning work, running a budget, keeping everyone informed.",
    },
    certificateId: "d971058a0ce9b44f0a16f414250eea69547513dab7ff331e7074b8748435aabe",
  },
  {
    id: "business-analysis-microsoft",
    group: "projects",
    title: "Career Essentials in Business Analysis by Microsoft and LinkedIn",
    issuer: "LinkedIn Learning · Microsoft",
    completedAt: "2026-09-17",
    durationMinutes: 779,
    skills: ["Requirements Gathering", "Project Management", "Business Analysis"],
    certificateId: "f7757a4cdaf249fc4bde9f7b6f8d6b74f4c6d93d38af20132d107b717a8c8e19",
    note: {
      de: "Anforderungen sauber aufnehmen, bevor irgendjemand etwas baut.",
      en: "Getting the requirements straight before anybody builds anything.",
    },
  },
  {
    id: "agile-project-management-atlassian",
    group: "projects",
    title: "Atlassian Agile Project Management Professional Certificate",
    issuer: "LinkedIn Learning · Atlassian",
    completedAt: "2026-08-30",
    durationMinutes: 471,
    skills: ["Jira", "Agile Methodologies", "Agile Project Management"],
    certificateId: "2c2909c060e7c4c8a019cfc5548bcb4b23a2ffeaef91b1cd72042f7148565c8a",
    note: {
      de: "In kurzen Schritten liefern statt einmal am Ende.",
      en: "Delivering in short steps instead of once at the end.",
    },
  },
  {
    id: "itsm-atlassian",
    group: "projects",
    title: "Atlassian IT Service Management (ITSM) Professional Certificate",
    issuer: "LinkedIn Learning · Atlassian",
    completedAt: "2026-08-30",
    durationMinutes: 339,
    skills: ["IT Service Management", "IT Management Monitoring", "Change Management"],
    certificateId: "4de1f4d0f9d06c7cf63acb4814ce796954c363f584e002e4914a4761634dd713",
    note: {
      de: "Störungen, Änderungen und Zuständigkeiten in geordnete Bahnen bringen.",
      en: "Putting faults, changes and responsibilities into an orderly track.",
    },
  },
  {
    id: "product-management-aha",
    group: "projects",
    title: "Aha! Product Management Professional Certificate",
    issuer: "LinkedIn Learning · Aha!",
    completedAt: "2026-09-16",
    durationMinutes: 337,
    skills: ["Product Management", "Product Road Mapping", "Product Strategy"],
    certificateId: "25d633b13b4728fb458fed1edf67a1b4ebcc05ba3ce47cba9993160916067284",
    note: {
      de: "Entscheiden, was zuerst gebaut wird — und was gar nicht.",
      en: "Deciding what gets built first, and what does not get built at all.",
    },
  },

  // ── Technik & Betrieb ─────────────────────────────────────────────────────
  {
    id: "penetration-testing-cybrary",
    group: "operations",
    title: "Penetration Testing Professional Certificate by Cybrary",
    issuer: "LinkedIn Learning · Cybrary",
    completedAt: "2026-09-28",
    durationMinutes: 735,
    skills: ["Ethical Hacking", "Penetration Testing"],
    certificateId: "9a2b2e6c565cea7034b57f0f880598942e11ab0e1c0e1e47f7a83fd648ee421d",
    note: {
      de: "Die Seite aus der Sicht eines Angreifers ansehen, bevor es jemand anders tut.",
      en: "Looking at a site the way an attacker would, before somebody else does.",
    },
  },
  {
    id: "github-career-essentials",
    group: "operations",
    title: "Career Essentials in GitHub Professional Certificate",
    issuer: "LinkedIn Learning · GitHub",
    completedAt: "2026-08-30",
    durationMinutes: 260,
    skills: ["GitHub"],
    certificateId: "d1a879fb782c650064bc202b63def3ab42c6b1bd657f5f1e6d2c0d91b2a726be",
    note: {
      de: "Jede Änderung ist nachvollziehbar und lässt sich zurücknehmen.",
      en: "Every change is traceable, and every change can be taken back.",
    },
  },
  {
    id: "docker-foundations",
    group: "operations",
    title: "Docker Foundations Professional Certificate",
    issuer: "LinkedIn Learning · Docker",
    completedAt: "2026-08-30",
    durationMinutes: 222,
    skills: ["Containerization", "Docker Products"],
    certificateId: "55ca84d7121bbebb26e2f14d8a157b17d9b857e1b8ee7d206653dd43622976c9",
    note: {
      de: "Eine Anwendung läuft auf dem Server so wie auf meinem Rechner.",
      en: "An application runs on the server the way it runs on my machine.",
    },
  },
  {
    id: "azure-essentials-microsoft",
    group: "operations",
    title: "Microsoft Azure Essentials Professional Certificate by Microsoft and LinkedIn",
    issuer: "LinkedIn Learning · Microsoft",
    completedAt: "2026-08-28",
    durationMinutes: 154,
    skills: ["Microsoft Azure", "Cloud Computing"],
    certificateId: "076b9073ba155aead6499fb42bab73365bd905202fe346a29615ab5f2e748e1a",
    note: {
      de: "Wann eine Cloud die passende Antwort ist — und wann ein Server genügt.",
      en: "When the cloud is the right answer, and when a server will do.",
    },
  },

  // ── Daten & KI ────────────────────────────────────────────────────────────
  {
    id: "data-analysis-microsoft",
    group: "data",
    title: "Career Essentials in Data Analysis by Microsoft and LinkedIn",
    issuer: "LinkedIn Learning · Microsoft",
    completedAt: "2026-09-28",
    durationMinutes: 738,
    skills: ["Data Analysis", "Data Visualization", "Data Analytics"],
    certificateId: "2ca3cbf97b5820837b7bcea578e816274c3ca1bd70a5d5e8447b6c31b48790ef",
    note: {
      de: "Aus Zahlen im Betrieb eine Auswertung machen, die jemand lesen kann.",
      en: "Turning a company's numbers into a report somebody can read.",
    },
  },
  {
    id: "data-science-knime",
    group: "data",
    title: "Data Science Professional Certificate by KNIME",
    issuer: "LinkedIn Learning · KNIME",
    completedAt: "2026-09-16",
    durationMinutes: 881,
    skills: ["AI for Business", "Data Science", "Artificial Intelligence (AI)"],
    certificateId: "97a8d55346fc711c5b3c5888ad985b62a1081802ad0e11c8fdf517f61dd0e24d",
    note: {
      de: "Größere Datenmengen aufbereiten, ohne dafür ein Programm zu schreiben.",
      en: "Preparing larger sets of data without writing a program for it.",
    },
  },
  {
    id: "generative-ai-microsoft",
    group: "data",
    title: "Build Your Generative AI Productivity Skills with Microsoft and LinkedIn",
    issuer: "LinkedIn Learning · Microsoft",
    completedAt: "2026-08-28",
    durationMinutes: 339,
    skills: ["AI for Business", "AI Productivity", "Generative AI"],
    certificateId: "b38e4a4843623e7474d286baf88563bf7711f8bac463d9ec7f2c3d98246e5130",
    note: {
      de: "Wo KI im Alltag Zeit spart — und wo sie nur Arbeit verlagert.",
      en: "Where AI saves time day to day, and where it only moves the work.",
    },
  },
];

/** The certificates of one group, in catalog order. */
export function credentialsInGroup(group: CredentialGroupId): Credential[] {
  return credentials.filter((entry) => entry.group === group);
}

/**
 * Who issued these, split into the platform and the partners whose content it
 * was — read from the catalog rather than written into the page's copy.
 *
 * `issuer` is spelled "<platform> · <partner>", and a certificate that has no
 * partner is just "<platform>". The page's framing sentence is built from this,
 * so adding a certificate from a provider that is not LinkedIn Learning changes
 * the sentence by itself. That is the point: the page had "13 abgeschlossene
 * Lernpfade bei LinkedIn Learning" written into it, which would have been wrong
 * the day the fourteenth came from somewhere else.
 */
export function credentialIssuers(): { platforms: string[]; partners: string[] } {
  const platforms = new Set<string>();
  const partners = new Set<string>();
  for (const entry of credentials) {
    const [platform, partner] = entry.issuer.split("·").map((part) => part.trim());
    if (platform) platforms.add(platform);
    if (partner) partners.add(partner);
  }
  return { platforms: [...platforms], partners: [...partners] };
}

/**
 * "a, b und c" / "a, b and c" — for the framing sentence above.
 *
 * Here rather than at the call site because the page builds two of these and
 * the two languages join a list differently.
 */
export function listSentence(items: readonly string[], lang: Lang): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0]!;
  const last = items.at(-1)!;
  const rest = items.slice(0, -1).join(", ");
  return `${rest} ${lang === "de" ? "und" : "and"} ${last}`;
}

/**
 * The three the "Wieso ich?" section names.
 *
 * Derived from the catalog order rather than listed a second time: a teaser
 * with its own list drifts away from the page it teases the first time
 * somebody reorders one of them.
 */
export function featuredCredentials(): Credential[] {
  return credentials.slice(0, 3);
}

/**
 * The short name a teaser or a card caption uses.
 *
 * The full titles run to nine words ("…Professional Certificate by Microsoft
 * and LinkedIn"); three of those in a column beside a portrait is a wall. The
 * partner is already on the line below, so the trailing boilerplate goes.
 */
export function shortTitle(entry: Credential): string {
  return entry.title
    .replace(/^Career Essentials in /, "")
    .replace(/\s*Professional Certificate\b/, "")
    .replace(/\s*\bby [^,]+$/, "")
    .replace(/\s*with Microsoft and LinkedIn$/, "")
    .replace(/\s*by Microsoft and LinkedIn$/, "")
    .trim();
}

/** "4 Std. 52 Min." / "4 hrs 52 min", from the printed length. */
export function formatDuration(minutes: number, lang: Lang): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const unit = lang === "de" ? { h: "Std.", m: "Min." } : { h: "hrs", m: "min" };
  if (hours === 0) return `${rest} ${unit.m}`;
  if (rest === 0) return `${hours} ${unit.h}`;
  return `${hours} ${unit.h} ${rest} ${unit.m}`;
}

/** The completion date, spelled out in the page's language. */
export function formatCompleted(iso: string, lang: Lang): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(date);
}
