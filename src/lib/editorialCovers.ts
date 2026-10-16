import covers from './editorialCovers.json';

/** Explicit article artwork; uploaded CMS covers always take precedence. */
export function editorialCover(slug: string): string | null {
  const path = (covers as Record<string, string>)[slug];
  return path ? `https://tracht-digital.de/images/${path}` : null;
}
