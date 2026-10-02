import { contentApiBase } from "./connection";
import { readContentJson } from "./contentFetch";

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
 * Fetch of the most recent published posts, used by the Journal section
 * when no curated slug list is configured. Returns `[]` on any failure so
 * consumers can render their own fallback — a render never breaks if the
 * content API is unreachable.
 */
export async function fetchTopics(
  lang: "de" | "en",
  limit = 3,
): Promise<ContentPost[]> {
  // Demo build: skip the API so consumers fall back to their baked copy
  // (the in-sync demo topics) — no backend required.
  if (import.meta.env.PUBLIC_DEMO_MODE === "true") return [];

  try {
    const url = new URL(`${contentApiBase()}/blog`);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("lang", lang);
    const data = await readContentJson<{ posts?: ContentPost[] }>(url);
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
        // Encoded: a curated slug is panel-entered text, and a `/` or `?` in
        // it would otherwise address a different endpoint.
        const url = new URL(`${contentApiBase()}/blog/${encodeURIComponent(slug)}`);
        url.searchParams.set("lang", lang);
        const data = await readContentJson<{ post?: ContentPost }>(url);
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
