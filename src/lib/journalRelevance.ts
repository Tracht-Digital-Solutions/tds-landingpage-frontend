/**
 * "Blog für Betriebe" on the home page shows the articles that matter most to a
 * small business, not simply the newest ones: a new open-source project post
 * should not push a guide on websites or backups out of the row.
 *
 * Relevance = category weight + a point per business keyword in title or
 * excerpt; newer wins on a tie. An admin-curated selection (`journal` block)
 * still takes precedence in `sections/Journal.astro`.
 */
export interface RankablePost {
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
}

/** Blog categories in both languages, lower-cased. Unlisted ones weigh 0. */
const CATEGORY_WEIGHT: Record<string, number> = {
  digitalisierung: 5,
  digitalization: 5,
  digitalisation: 5,
  webauftritt: 5,
  "web presence": 5,
  webshop: 4,
  "online shop": 4,
  "it-sicherheit": 4,
  "it security": 4,
  konzept: 3,
  concept: 3,
  werkzeuge: 2,
  tools: 2,
  ausstattung: 1,
  equipment: 1,
};

const KEYWORDS =
  /\b(betrieb\w*|business\w*|kleine?n?|small|website\w*|webseite\w*|shop\w*|kunden?\w*|customers?|digitali\w+|datensicherung|backup\w*|sicherheit|security|büro\w*|office|rechnung\w*|invoic\w*|ablauf\w*|workflow\w*|excel)\b/giu;

export function journalScore(post: RankablePost): number {
  const category = CATEGORY_WEIGHT[post.category.trim().toLowerCase()] ?? 0;
  const keywords = new Set(`${post.title} ${post.excerpt}`.toLowerCase().match(KEYWORDS) ?? []).size;
  return category + Math.min(keywords, 4);
}

/** The `limit` most relevant posts, newest first among equals. */
export function mostRelevantPosts<T extends RankablePost>(posts: readonly T[], limit = 3): T[] {
  const time = (post: T) => Date.parse(post.publishedAt) || 0;
  return [...posts]
    .sort((a, b) => journalScore(b) - journalScore(a) || time(b) - time(a))
    .slice(0, limit);
}
