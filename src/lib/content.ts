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
