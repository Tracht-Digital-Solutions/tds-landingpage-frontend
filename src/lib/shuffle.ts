/**
 * A shuffled copy (Fisher–Yates). Used where a render draws a fresh order of
 * our own examples: the hero carousel and the showcase shelf. The page cache
 * keeps one draw until it renders again — after a content change, a deploy or
 * at the latest the next day (tds-shared's daily gate).
 */
export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
