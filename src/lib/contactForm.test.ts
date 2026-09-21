import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { contactFormCopy } from "./contactCopy";

/**
 * The contact form's 2026-09-21 contract, read as source text.
 *
 * Source text rather than a rendered DOM for the same reason
 * `previewLightbox.test.ts` is: the island is a `client:visible` React tree
 * whose interesting parts (a native `<select>`, `aria-describedby`, a payload
 * key) would each need a different piece of jsdom that jsdom does not have.
 *
 * Every rule below is silent when broken. A dropdown that registers under the
 * wrong name still opens and still closes; the request simply arrives in the
 * panel with no subject, exactly as it did before the field existed.
 */
const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const form = read("src/components/islands/ContactForm.tsx");
const section = read("src/components/sections/Contact.astro");

/** Comments explain these rules, so a grep over them finds its own prose. */
const code = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

describe("the reason dropdown", () => {
  it("registers under the key the backend stores as the subject", () => {
    // `POST /contact` has accepted and stored a `subject` all along —
    // `ContactRepository` even notes "the public form has no subject field".
    // Registering under any other name posts a key `ContactSchema` does not
    // declare, and zodResolver drops it before the request is built.
    expect(code(form)).toMatch(/register\("subject"\)/);
    expect(code(form)).toMatch(/id="subject"/);
  });

  it("opens on a prompt, not on a pre-selected answer", () => {
    // An optional field whose first option is a real reason submits that
    // reason for everyone who never touched it.
    expect(code(form)).toMatch(/<option value="">\{copy\.reasonEmpty\}<\/option>/);
    expect(code(form)).toMatch(/defaultValue=""/);
  });

  it("renders nothing when the list is empty", () => {
    // The list is CMS-editable and can be emptied in the panel. An empty
    // dropdown is worse than none.
    expect(code(form)).toMatch(/reasons\.length > 0 &&/);
  });

  it("ships committed reasons in both languages", () => {
    // Load-bearing, and the whole reason this assertion exists:
    // `mergeCmsValue` REFUSES an override for a list whose committed fallback
    // is empty — with no local item there is no runtime shape to validate the
    // incoming ones against. Ship `reasons: []` and every edit Julian makes in
    // the panel is discarded in silence, permanently.
    const reasons = section.slice(section.indexOf("reasons:"), section.indexOf("});"));
    for (const marker of ["Bestehende Website übernehmen", "Take over an existing website"]) {
      expect(reasons, `committed fallback must contain ${marker}`).toContain(marker);
    }
  });
});

describe("the message field says what belongs in it", () => {
  it("guides with an element, not a placeholder", () => {
    // A placeholder disappears on the first keystroke — precisely when the
    // visitor still needs to know what to write.
    expect(code(form)).toMatch(/id="contact-message-hint"/);
    expect(code(form)).not.toMatch(/placeholder=\{copy\.form\.messagePlaceholder\}/);
  });

  it("ties the hint to the field, with the error when there is one", () => {
    expect(code(form)).toMatch(/aria-describedby=\{[\s\S]*?contact-message-hint/);
    expect(code(form)).toMatch(/contact-message-hint \$\{errorId\("message"\)\}/);
  });

  it("asks for a short description in both languages", () => {
    expect(contactFormCopy("de").messageHint).toMatch(/Zwei, drei Sätze/);
    expect(contactFormCopy("en").messageHint).toMatch(/Two or three sentences/);
    for (const lang of ["de", "en"] as const) {
      expect(contactFormCopy(lang).messageHint.length).toBeLessThan(120);
    }
  });
});

describe("the next steps moved behind the send button", () => {
  it("no longer stands above the form", () => {
    // It said the same four things as the process section, verbatim, and it
    // pushed the form itself below the fold.
    expect(section).not.toMatch(/<FirstCall/);
    expect(section).not.toMatch(/from "~\/components\/ui\/FirstCall.astro"/);
  });

  it("fills the confirmation instead", () => {
    const success = form.slice(form.indexOf("const success ="), form.indexOf("const submitting"));
    expect(success).toMatch(/nextSteps/);
    expect(success).toMatch(/nextSteps\.items\.map/);
    // Still focused as it mounts, not from an effect keyed on the state: the
    // form fades out first, so the heading does not exist yet when an effect
    // would run.
    expect(success).toMatch(/ref=\{\(el\) => el\?\.focus\(\)\}/);
  });

  it("is handed down as a prop, because an island cannot resolve a block", () => {
    expect(section).toMatch(/cmsFor\("first_call"/);
    expect(section).toMatch(/nextSteps=\{\{/);
  });
});
