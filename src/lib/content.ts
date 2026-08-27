import { siteConfig } from "~/lib/seo";
import { assertKeyAccepted, siteKeyHeaders } from "./siteKey";
import { contentApiBase } from "./connection";

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

/**
 * Make an uploaded cover URL absolute. The CMS persists `coverHint` as a
 * storage-relative `/uploads/…` path; rendered as-is in an `<img src>` here it
 * would resolve against `tracht-digital.de` and 404 — a broken image in the
 * Journal row with nothing to say so, since the build never sees the request.
 * Anchor it to the content API's origin at the data layer, exactly as
 * `tds-blog-frontend`'s `resolveCoverHint` does, so every consumer downstream
 * just works. Absolute or empty values pass through unchanged.
 */
export function resolveCoverHint(coverHint?: string | null): string | null {
  if (!coverHint) return null;
  if (/^https?:\/\//i.test(coverHint)) return coverHint;
  if (coverHint.startsWith("/")) return `${contentApiBase()}${coverHint}`;
  return coverHint;
}

const withResolvedCover = (p: ContentPost): ContentPost => ({
  ...p,
  coverHint: resolveCoverHint(p.coverHint),
});

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
  // Demo build: skip the API so consumers fall back to topicFallback()
  // (the in-sync demo topics) — no backend required.
  if (import.meta.env.PUBLIC_DEMO_MODE === "true") return [];

  try {
    const url = new URL(`${contentApiBase()}/blog`);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("lang", lang);
    const res = await fetch(url, { headers: siteKeyHeaders(), signal: AbortSignal.timeout(10_000) });
    assertKeyAccepted(res, url);
    if (!res.ok) return [];
    const data = (await res.json()) as { posts?: ContentPost[] };
    return (data.posts ?? []).map(withResolvedCover);
  } catch (err) {
    console.warn(
      "[tds-landingpage] topics fetch failed, falling back to empty list:",
      err,
    );
    return [];
  }
}

/**
 * Build-time fetch of specific posts by slug, in the given order — used by
 * the Journal section to render the admin-curated selection (max 4). Each
 * slug is fetched via `GET /blog/{slug}?lang=…`; missing/unpublished posts
 * (404) or transient failures are skipped so a stale curated slug never
 * breaks the build. Returns the found posts in the requested order.
 */
export async function fetchPostsBySlug(
  slugs: string[],
  lang: "de" | "en",
): Promise<ContentPost[]> {
  if (import.meta.env.PUBLIC_DEMO_MODE === "true" || slugs.length === 0) return [];

  const results = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const url = new URL(`${contentApiBase()}/blog/${slug}`);
        url.searchParams.set("lang", lang);
        const res = await fetch(url, { headers: siteKeyHeaders(), signal: AbortSignal.timeout(10_000) });
        assertKeyAccepted(res, url);
        if (!res.ok) return null;
        const data = (await res.json()) as { post?: ContentPost };
        return data.post ? withResolvedCover(data.post) : null;
      } catch (err) {
        console.warn(
          `[tds-landingpage] curated post "${slug}" fetch failed, skipping:`,
          err,
        );
        return null;
      }
    }),
  );

  return results.filter((p): p is ContentPost => p !== null);
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
 *
 * The slugs must be real articles on the blog — they are rendered as links
 * to `blogUrl/<slug>`. They therefore mirror the seed migration in
 * `tds-ext-blog-cms-pkg`, which is what a fresh installation publishes;
 * inventing a slug here produces a section full of 404s that nothing in the
 * build would flag.
 */
export function topicFallback(lang: "de" | "en"): ContentPost[] {
  return lang === "de"
    ? [
        {
          slug: "digitalisierung-faengt-klein-an",
          category: "Digitalisierung",
          title: "Digitalisierung fängt nicht beim Großprojekt an",
          excerpt:
            "Sie fängt bei dem einen Ablauf an, der jede Woche Stunden kostet — und den außer Ihnen niemand sieht.",
          publishedAt: "",
          coverHint: null,
        },
        {
          slug: "lohnt-sich-ein-webshop",
          category: "Webshop",
          title: "Lohnt sich ein Webshop für mein Ladengeschäft?",
          excerpt:
            "Nicht für jedes Sortiment. Vier Fragen, die die Antwort meist schon vorwegnehmen.",
          publishedAt: "",
          coverHint: null,
        },
        {
          slug: "produktpflege-per-handy",
          category: "Werkzeuge",
          title: "Warum Produktpflege nicht am Schreibtisch hängen muss",
          excerpt:
            "Wer Ware annimmt, steht selten am Rechner. Was sich ändert, wenn Artikel und Bestand vom Handy aus gepflegt werden.",
          publishedAt: "",
          coverHint: null,
        },
      ]
    : [
        {
          slug: "digitalisierung-faengt-klein-an",
          category: "Digitalization",
          title: "Digitalization doesn't start with a big project",
          excerpt:
            "It starts with the one routine that costs hours every week — the one nobody but you can see.",
          publishedAt: "",
          coverHint: null,
        },
        {
          slug: "lohnt-sich-ein-webshop",
          category: "Online shop",
          title: "Is an online shop worth it for my local business?",
          excerpt:
            "Not for every range of products. Four questions that usually answer it for you.",
          publishedAt: "",
          coverHint: null,
        },
        {
          slug: "produktpflege-per-handy",
          category: "Tools",
          title: "Why product upkeep doesn't have to be tied to a desk",
          excerpt:
            "People taking in stock are rarely at a computer. What changes when items and stock can be maintained from a phone.",
          publishedAt: "",
          coverHint: null,
        },
      ];
}
