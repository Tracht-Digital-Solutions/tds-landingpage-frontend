import { siteConfig } from "~/lib/seo";

/**
 * Shared shape of a published post as returned by tds-content-api's
 * `/blog?limit=…&lang=…` endpoint. Mirrored from the API spec —
 * keep in sync if the upstream shape changes.
 */
export interface ContentPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverHint: string | null;
}

/** Resolved at build time from env, with the production default. */
const CONTENT_API_URL =
  (import.meta.env.PUBLIC_CONTENT_API_URL as string | undefined) ??
  "https://api.tracht-digital.de/content";

/**
 * Build-time fetch of the most recent published posts. Used by both
 * the Hero pill (the first / "main-theme" post) and the Currently
 * section (the full list). Returns `[]` on any failure so consumers
 * can render their own fallback — the build never breaks if the
 * content API is unreachable.
 */
export async function fetchTopics(
  lang: "de" | "en",
  limit = 3,
): Promise<ContentPost[]> {
  try {
    const url = new URL(`${CONTENT_API_URL}/blog`);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("lang", lang);
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];
    const data = (await res.json()) as { posts?: ContentPost[] };
    return data.posts ?? [];
  } catch (err) {
    console.warn(
      "[tds-landingpage] topics fetch failed, falling back to empty list:",
      err,
    );
    return [];
  }
}

/** Build the public URL where a single post is read on the blog. */
export function topicHref(slug: string): string {
  return `${siteConfig.blogUrl}/${slug}`;
}

/**
 * Hand-written fallback list of "current topics" — used when the live
 * content API returns nothing (first deploy / transient outage) so the
 * Currently section *and* the Hero pill both still surface meaningful,
 * in-sync topics. The **first entry is the most important one**: it is
 * what the Hero pill links to, and it leads the Currently list.
 */
export function topicFallback(lang: "de" | "en"): ContentPost[] {
  return lang === "de"
    ? [
        {
          slug: "tds-customer-portal",
          category: "Build-Log",
          title: "TDS Customer Portal",
          excerpt:
            "Self-Service-Zugang für Mittelstandskunden — Projekte, Rechnungen, Dokumente. In aktiver Entwicklung.",
          publishedAt: "",
          coverHint: null,
        },
        {
          slug: "ki-prozessanalyse",
          category: "Case Study",
          title: "KI-Prozessanalyse",
          excerpt:
            "Datenpipelines mit Claude und n8n für eine Manufaktur — von der Bestellannahme bis zur Auslieferung.",
          publishedAt: "",
          coverHint: null,
        },
        {
          slug: "tracht-digital-journal",
          category: "Meta",
          title: "Tracht Digital Journal",
          excerpt:
            "Längere Texte zu Architektur, Mittelstand und KI im täglichen Einsatz.",
          publishedAt: "",
          coverHint: null,
        },
      ]
    : [
        {
          slug: "tds-customer-portal",
          category: "Build log",
          title: "TDS Customer Portal",
          excerpt:
            "Self-service access for mid-market clients — projects, invoices, documents. In active development.",
          publishedAt: "",
          coverHint: null,
        },
        {
          slug: "ai-process-analysis",
          category: "Case study",
          title: "AI process analysis",
          excerpt:
            "Data pipelines with Claude and n8n for a manufactory — from order intake to delivery.",
          publishedAt: "",
          coverHint: null,
        },
        {
          slug: "tracht-digital-journal",
          category: "Meta",
          title: "Tracht Digital Journal",
          excerpt:
            "Longer-form writing on architecture, mid-market work, and AI in daily use.",
          publishedAt: "",
          coverHint: null,
        },
      ];
}
