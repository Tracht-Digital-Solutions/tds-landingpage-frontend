import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import covers from './editorialCovers.json';
import { editorialCover } from './editorialCovers';

describe('editorial article artwork', () => {
  it('ships every assigned cover, including all 15 launch articles', () => {
    expect(Object.keys(covers)).toHaveLength(15);
    for (const [slug, path] of Object.entries(covers)) {
      expect(existsSync(`public/images/${path}`), slug).toBe(true);
      expect(editorialCover(slug)).toBe(`https://tracht-digital.de/images/${path}`);
    }
  });
  it('keeps unknown articles on the abstract fallback', () => {
    expect(editorialCover('future-article')).toBeNull();
  });
});
