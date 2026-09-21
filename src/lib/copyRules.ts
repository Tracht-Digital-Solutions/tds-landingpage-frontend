/**
 * Words the site never says (decided 2026-09-21): "echt" and "wirklich", in any
 * inflection. A claim that something is REAL or TRULY so is the one claim a
 * visitor cannot check.
 *
 * Enforced in three places, one per way a word can reach a page:
 * - committed copy: `bannedWords.test.ts`;
 * - panel overrides: `cms.ts` refuses a string that contains one and keeps the
 *   committed default, so a block saved before the rule cannot bring it back;
 * - everything rendered: `npm run audit:seo`.
 *
 * No imports — `cms.ts` sits at the bottom of the module graph.
 */
export const BANNED_WORDS = /\b(echt|wirklich)[a-zäöüß]*/i;

export function hasBannedWord(text: string): boolean {
  return BANNED_WORDS.test(text);
}
