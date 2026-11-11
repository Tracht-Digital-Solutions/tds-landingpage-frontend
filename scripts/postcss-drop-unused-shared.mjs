/**
 * Drops tds-shared component styles this site never renders (2026-11-11).
 *
 * Every page inlines its stylesheet (`inlineStylesheets: "always"`), and
 * tds-shared's primitives.css carries the components of ALL sites — the
 * tools' drop zone, the shop's product card, the panel's dropdowns. Measured
 * across all 41 rendered pages (sitemap, legal, /install, 404) and every client
 * bundle, the blocks below never occur here.
 *
 * What is removed, and nothing else:
 * - a top-level selector that names a dropped block;
 * - an argument of `:is()` / `:where()` that names one (`:is(.tds-card,
 *   .tds-widget, .cookie-notice)` keeps the other two);
 * - a rule left with no selector.
 * A block inside `:not()` or `:has()` is left alone: dropping it there would
 * change what the selector matches. Keeping a rule is always safe.
 *
 * Generic or CMS-reachable classes (`tds-table`, `tds-empty`, `tds-tone-*`,
 * `tds-reveal`, skeletons) stay, because content can bring them in without
 * code changing. `src/lib/unusedSharedCss.test.ts` fails if the site's source
 * starts using a dropped block — take it off this list in the same change.
 */
export const DROPPED_BLOCKS = [
  "tds-dropzone",
  "tds-dropdown",
  "tds-filterbar",
  "tds-sitebar",
  "tds-product-card",
  "tds-product-offer",
  "tds-product-strip",
  "tds-product-price",
  "tds-product-grid",
  "tds-product-badge",
  "tds-avatar",
  "tds-lang-toggle",
  "tds-thread",
  "tds-widget",
  "tds-nav-progress",
  "tds-skip-link",
  "tds-toast-host",
  "tds-toast-region",
  "tds-settings-section",
  "tds-toggle-row",
  "tds-compose",
  "tds-tab-indicator",
  "tds-grid-auto",
];

const escape = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
// `.block`, `.block__element`, `.block--modifier`; never a longer name that
// merely starts with it (`.tds-product-cards` would not match `tds-product-card`).
const BLOCK = new RegExp(`\\.(?:${DROPPED_BLOCKS.map(escape).join("|")})(?=$|__|--|[^\\w-])`);

/** Split on commas at depth 0 of the given string. */
export function splitTop(list) {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "," && depth === 0) {
      out.push(list.slice(start, i));
      start = i + 1;
    }
  }
  out.push(list.slice(start));
  return out.map((s) => s.trim());
}

/** Index of the parenthesis closing the one opened at `open`. */
function closing(s, open) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")" && --depth === 0) return i;
  }
  return -1;
}

/**
 * One top-level selector with dropped blocks taken out of every `:is()` /
 * `:where()`, or null when it can no longer match anything we keep.
 */
export function pruneSelector(selector) {
  let out = "";
  let i = 0;
  while (i < selector.length) {
    const fn = /^:(is|where|not|has)\(/.exec(selector.slice(i));
    if (!fn) {
      out += selector[i++];
      continue;
    }
    const open = i + fn[0].length - 1;
    const close = closing(selector, open);
    if (close < 0) return selector; // malformed: leave untouched
    const inner = selector.slice(open + 1, close);
    if (fn[1] === "is" || fn[1] === "where") {
      const kept = splitTop(inner)
        .map((arg) => pruneSelector(arg))
        .filter((arg) => arg !== null);
      if (kept.length === 0) return null; // matches nothing that stays
      out += `:${fn[1]}(${kept.join(",")})`;
    } else {
      out += selector.slice(i, close + 1); // :not()/:has(): untouched
    }
    i = close + 1;
  }
  // A dropped block outside any functional pseudo now decides the selector.
  const outside = out.replace(/:(?:not|has)\((?:[^()]|\([^()]*\))*\)/g, "");
  return BLOCK.test(outside) ? null : out;
}

/** @type {import("postcss").PluginCreator<void>} */
export default function dropUnusedShared() {
  return {
    postcssPlugin: "tds-drop-unused-shared",
    Rule(rule) {
      if (!BLOCK.test(rule.selector)) return;
      const parent = rule.parent;
      if (parent?.type === "atrule" && /keyframes$/i.test(parent.name)) return;
      const kept = splitTop(rule.selector)
        .map(pruneSelector)
        .filter((s) => s !== null);
      if (kept.length === 0) rule.remove();
      else rule.selector = kept.join(",\n");
    },
  };
}
dropUnusedShared.postcss = true;
