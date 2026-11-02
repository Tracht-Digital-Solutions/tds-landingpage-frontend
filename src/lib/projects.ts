/**
 * The project overview: its address, its copy and the home page's selection.
 *
 * The home page shows a handful of tiles under one heading and links to
 * `/projekte`, where every piece of work stands in four groups. Client work and
 * samples share a section, so the origin badge on each tile is what keeps them
 * apart. A tile without one would mislead.
 *
 * Type-only imports: `sitemap.ts` and `cache.ts` read the slug from here, and
 * `cache.ts` must not reach the content modules at runtime (docs/agents/content-cms.md).
 */
import type { ReferenceCardData } from "./caseCards";
import type { ResolvedDemo } from "./demos";
import type { DesignStudy } from "./designStudies";
import type { Lang } from "./i18n";
import type { OwnProject } from "./ownProjects";

export const PROJECTS_SLUG: Record<Lang, string> = {
  de: "/projekte",
  en: "/en/projects",
};

export function projectsHref(lang: Lang): string {
  return PROJECTS_SLUG[lang];
}

/** The "Stand" line, `dateModified` and the sitemap's `lastmod`. Raise it when the page's copy changes. */
export const PROJECTS_UPDATED_AT = "2026-11-02";

/** Six divides into the one, two and three columns the home grid uses, so no row is left half empty. */
export const HOME_PROJECT_LIMIT = 6;

export type ProjectEntry =
  | { kind: "case"; key: string; card: ReferenceCardData }
  | { kind: "project"; key: string; project: OwnProject }
  | { kind: "demo"; key: string; demo: ResolvedDemo }
  | { kind: "study"; key: string; study: DesignStudy }
  | { kind: "business-card"; key: string };

export interface ProjectPool {
  cases: readonly ReferenceCardData[];
  projects: readonly OwnProject[];
  demos: readonly ResolvedDemo[];
  studies: readonly DesignStudy[];
}

export const caseEntry = (card: ReferenceCardData): ProjectEntry => ({ kind: "case", key: `case:${card.id}`, card });
export const projectEntry = (project: OwnProject): ProjectEntry => ({ kind: "project", key: `project:${project.id}`, project });
export const demoEntry = (demo: ResolvedDemo): ProjectEntry => ({ kind: "demo", key: `demo:${demo.definition.id}`, demo });
export const studyEntry = (study: DesignStudy): ProjectEntry => ({ kind: "study", key: `study:${study.id}`, study });

/**
 * The tiles on the home page: client work first, then one own project, running
 * demos, and one design study last. A demo host that is down gives its place
 * to the next piece of work, so the grid stays full.
 */
export function selectHomeProjects(pool: ProjectPool, limit = HOME_PROJECT_LIMIT): ProjectEntry[] {
  const cases = pool.cases.map(caseEntry);
  const [firstProject, ...moreProjects] = pool.projects.map(projectEntry);
  const [firstStudy, ...moreStudies] = pool.studies.map(studyEntry);
  const demos = pool.demos.map(demoEntry);

  const leading = [...cases, ...(firstProject ? [firstProject] : [])].slice(0, limit);
  const closing = firstStudy && leading.length < limit ? [firstStudy] : [];
  const room = limit - leading.length - closing.length;
  const filling = [...demos, ...moreProjects, ...moreStudies].slice(0, Math.max(room, 0));
  return [...leading, ...filling, ...closing];
}

export const projectsCopy = {
  de: {
    home: {
      headline: "Projekte und",
      headlineAccent: "Referenzen.",
      more: "Mehr Projekte",
    },
    page: {
      back: "Zurück zur Startseite",
      backNav: "Seitenpfad",
      home: "Startseite",
      name: "Projekte und Referenzen",
      headline: "Projekte und",
      headlineAccent: "Referenzen.",
      answer:
        "Tracht Digital Solutions aus Schwarzenbek bei Hamburg zeigt hier Kundenprojekte, eigene Projekte, Beispielseiten und Designstudien. Jede Kachel nennt ihre Herkunft.",
      jump: "Zu den Gruppen springen",
      ctaLead: "Was steht als Nächstes an?",
      cta: "Erstgespräch vereinbaren",
    },
    groups: {
      cases: { title: "Kundenprojekte", lead: "Abgeschlossene Arbeit, veröffentlicht mit Freigabe." },
      own: { title: "Eigene Projekte", lead: "Eigene Programme und Seiten, öffentlich im Einsatz." },
      demos: { title: "Beispielseiten", lead: "Laufende Demos zum Durchklicken, keine Kundenaufträge." },
      studies: { title: "Designstudien", lead: "Entwürfe für erfundene Marken, keine Kundenaufträge." },
    },
  },
  en: {
    home: {
      headline: "Projects and",
      headlineAccent: "references.",
      more: "More projects",
    },
    page: {
      back: "Back to the home page",
      backNav: "Breadcrumb",
      home: "Home",
      name: "Projects and references",
      headline: "Projects and",
      headlineAccent: "references.",
      answer:
        "Tracht Digital Solutions, based in Schwarzenbek near Hamburg, shows client projects, own projects, example sites and design studies here. Every tile states its origin.",
      jump: "Jump to a group",
      ctaLead: "What comes next?",
      cta: "Arrange an initial consultation",
    },
    groups: {
      cases: { title: "Client projects", lead: "Finished work, published with approval." },
      own: { title: "Own projects", lead: "Own programs and pages, publicly in use." },
      demos: { title: "Example sites", lead: "Running demos to click through, not client work." },
      studies: { title: "Design studies", lead: "Drafts for invented brands, not client work." },
    },
  },
} as const;
