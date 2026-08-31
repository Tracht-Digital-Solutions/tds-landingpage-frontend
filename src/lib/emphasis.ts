/**
 * Word emphasis inside otherwise plain copy.
 *
 * The brief asks for "klare Wörter hervorheben", and the copy this site
 * renders is not markdown — it is plain strings that an admin can override
 * field by field through the CMS. So the marker has to survive a round trip
 * through a text input, be invisible when nobody uses it, and never turn a
 * stray character into markup.
 *
 * `*asterisks*` it is: one character, no nesting, no escaping rules. A
 * string with none of them yields exactly one plain segment, which is what
 * every CMS-overridden field will produce — the fail-soft default of the
 * whole content chain, kept here too.
 *
 * NOT a markdown parser, deliberately. `tds-shared/markdown` exists for the
 * legal pages, where the content really is markdown; running it over a
 * headline's subtitle would also honour `#`, `_`, `[]()` and backticks in
 * copy nobody wrote as markdown.
 */

export interface EmphasisSegment {
  text: string;
  /** True for the text that was wrapped in asterisks. */
  strong: boolean;
}

/**
 * Split `Ich plane und *setze um*.` into
 * `[{ text: "Ich plane und ", strong: false }, { text: "setze um", strong: true }, …]`.
 *
 * An unpaired asterisk is not an error and not emphasis: it stays in the
 * text exactly as written. Anything else would let one typo in the panel
 * swallow the rest of a sentence into a `<strong>`.
 */
export function splitEmphasis(text: string): EmphasisSegment[] {
  const segments: EmphasisSegment[] = [];
  // Matches a *…* run that contains no asterisk of its own, so the pairing
  // is always the nearest one and an odd asterisk cannot span sentences.
  const pattern = /\*([^*]+)\*/g;
  let cursor = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), strong: false });
    }
    segments.push({ text: match[1], strong: true });
    cursor = start + match[0].length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), strong: false });
  }

  // An empty input still has to render as something addressable, so callers
  // can map without a length check.
  return segments.length > 0 ? segments : [{ text, strong: false }];
}

/** The plain reading of a marked-up string — for `alt`, `title`, JSON-LD. */
export function stripEmphasis(text: string): string {
  return splitEmphasis(text)
    .map((segment) => segment.text)
    .join("");
}
