import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { siteConfig } from "./seo";

/**
 * The mini business card in the contact aside.
 *
 * Read as source text: the card is plain Astro markup on a section whose
 * token values are re-mapped by a class, and both of the things worth
 * guarding — which tokens it uses and how many anchors it has — are visible in
 * the source and invisible in a rendered snapshot.
 *
 * Every rule here is silent when broken. A nested anchor still renders; a
 * re-mapped token still resolves, to white; a QR without its plate still shows
 * a neat square that no phone can read.
 */
const section = readFileSync(
  resolve(process.cwd(), "src/components/sections/Contact.astro"),
  "utf8",
);

/** The card's markup and its styles, with comments stripped. */
const code = section
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "");

/**
 * What is INSIDE the anchor — from the end of its opening tag to `</a>`.
 *
 * Deliberately not including the opening tag: the nested-anchor check below
 * greps for `<a`, and starting one character earlier makes it match the very
 * element it is inspecting.
 */
// Located by a regex, not `indexOf` on a literal: the opening tag spans
// several lines as soon as it carries more than two attributes, and a literal
// match breaks the moment one is added.
const anchorStart = code.search(/<a\s[^>]*href=\{businessCardHref\(lang\)\}/);
const anchorInner = (() => {
  expect(anchorStart, "the mini card anchor").toBeGreaterThan(-1);
  const openEnds = code.indexOf(">", anchorStart) + 1;
  return code.slice(openEnds, code.indexOf("</a>", openEnds));
})();
/** The anchor with its opening tag, for attribute checks. */
const anchor = code.slice(anchorStart, code.indexOf("</a>", anchorStart));

describe("the mini business card", () => {
  it("is one anchor, with no second one inside it", () => {
    // A nested `<a>` is invalid and browsers recover by closing the outer one
    // early — everything after it silently falls out of the link. The .vcf
    // pill above must stay a sibling.
    expect(anchorInner).not.toMatch(/<a[\s>]/);
    const toCard = code.match(/href=\{businessCardHref\(lang\)\}/g) ?? [];
    expect(toCard).toHaveLength(1);
  });

  it("says what following it does, beyond the name on it", () => {
    // The visible text is a NAME, so a content-derived accessible name is the
    // whole card read out and never states the action.
    expect(anchor).toMatch(/aria-label=/);
    expect(anchor).toMatch(/Digitale Visitenkarte von \$\{siteConfig\.founder\.name\} ansehen/);
    expect(anchor).toMatch(/Open the digital business card of \$\{siteConfig\.founder\.name\}/);
  });

  it("keeps the visible name inside the accessible one", () => {
    // WCAG "Label in Name": a label that replaces the content must still
    // contain the words on screen, or voice control cannot address the link
    // by what the user can see. Built from the same `siteConfig` value the
    // card prints, so the two cannot drift apart.
    expect(anchor).toMatch(/siteConfig\.founder\.name/);
    const label = anchor.slice(anchor.indexOf("aria-label="), anchor.indexOf(">"));
    expect(label).toContain("siteConfig.founder.name");
  });

  it("takes the QR as a path and never the encoder", () => {
    // `lib/businessCardQr.ts` imports `qrcode` at module scope; the package is
    // a devDependency missing from the release tree, and reaching for it from
    // a page answered 500 on the host. (`businessCardQr.test.ts` enforces this
    // across all of src/ — this pins the intent at the call site.)
    // Checked against the code with comments stripped: the import above NAMES
    // businessCardQr.ts to explain why it is not imported, and a naive grep
    // reads that explanation as the very violation it warns about.
    expect(code).toMatch(/BUSINESS_CARD_QR_PATH/);
    expect(code).not.toMatch(/businessCardQr/);
  });

  it("puts the QR on a white plate in both themes", () => {
    // The SVG is black on transparent. On the dark theme an unplated code is
    // black on near-black and simply stops scanning.
    const qrRule = code.slice(code.indexOf(".mini-card__qr {"));
    expect(qrRule.slice(0, qrRule.indexOf("}"))).toMatch(/background:\s*#ffffff/i);
  });

  it("marks the QR decorative", () => {
    // It encodes the destination the link already has.
    expect(anchor).toMatch(/class="mini-card__qr"[^>]*aria-hidden="true"/);
    expect(anchor).toMatch(/alt=""/);
  });

  it("never prints the street address", () => {
    // Same restraint the card page keeps (`businessCard.test.ts`): the card
    // names the town, never the street.
    expect(section).not.toContain(siteConfig.address.streetAddress);
    expect(anchor).toMatch(/address\.postalCode/);
    expect(anchor).toMatch(/address\.addressLocality/);
  });

  it("draws itself only from tokens the navy tone leaves alone", () => {
    // `.tds-tone-navy` re-maps these to white or to translucent whites so that
    // ordinary components read on a dark ground. A LIGHT card built from them
    // is white on white — the one place on this page where the tone's help is
    // the problem.
    const styles = code.slice(code.indexOf(".mini-card {"), code.indexOf(".contact-next {"));
    for (const token of ["--color-black", "--color-muted", "--color-card", "--color-soft"]) {
      expect(styles, `${token} is re-mapped by .tds-tone-navy`).not.toContain(`var(${token})`);
    }
    expect(styles).toContain("var(--color-paper)");
    expect(styles).toContain("var(--color-primary)");
  });

  it("keeps a visible focus ring", () => {
    // The FIRST `.mini-card:focus-visible` is the lift it shares with hover.
    // The ring is a rule of its own — find the one that draws an outline.
    const rules = code.split(".mini-card:focus-visible").slice(1);
    const ring = rules.map((r) => r.slice(0, r.indexOf("}"))).find((r) => r.includes("outline"));
    expect(ring, "a rule drawing the focus ring").toBeDefined();
    expect(ring).toMatch(/outline:\s*2px solid/);
  });

  it("replaced the plain text link, not added to it", () => {
    // The old row was an icon plus "Digitale Visitenkarte ansehen →" in the
    // flow. If it came back, the aside would offer the same destination twice.
    expect(code).not.toMatch(/text-white\/70[^"]*"[\s\S]{0,400}Digitale Visitenkarte ansehen/);
  });
});
