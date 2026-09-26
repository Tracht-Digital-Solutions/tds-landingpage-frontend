import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The accessibility contract of the 2026-09 redesign, as source rules.
 *
 * Read as TEXT, like `previewLightbox.test.ts` and `header.test.ts`: every rule
 * below was broken on the live site and none of them produced an error, a
 * warning or a red build — axe, a keyboard and a screen reader found them. A
 * DOM test in jsdom could not see most of it (no layout, no top layer, no
 * accessibility tree), and a rule that is silent when broken is the kind that
 * comes back in the next redesign.
 */
const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

/** The template part of an `.astro` file (after the frontmatter), comments removed. */
function template(source: string): string {
  const end = source.indexOf("---", 3);
  const body = end > -1 ? source.slice(end + 3) : source;
  return body.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/<!--[\s\S]*?-->/g, "");
}

/**
 * Source without its comments. The components explain what they replaced —
 * `style="opacity:0"`, `tabindex="0"`, the old failure message — and a rule
 * must match the code, never the note that warns against bringing it back.
 */
function code(source: string): string {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

function filesUnder(dir: string, pattern: RegExp): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(resolve(process.cwd(), dir))) {
    const path = join(dir, entry);
    if (statSync(resolve(process.cwd(), path)).isDirectory()) out.push(...filesUnder(path, pattern));
    else if (pattern.test(entry)) out.push(path);
  }
  return out;
}

describe("names come from text, not from labels on generic elements", () => {
  it("AccentLetters reads its word from a visually hidden copy", () => {
    // `aria-label` on a role-less span is prohibited ARIA (axe, serious): a
    // screen reader may ignore it, and the letters beside it were hidden.
    const t = template(read("src/components/ui/AccentLetters.astro"));
    expect(t).not.toMatch(/<span[^>]*aria-label=/);
    expect(t).toMatch(/<span class="sr-only">\{text\}<\/span>/);
    expect(t).toMatch(/class="accent-letters__glyphs" aria-hidden="true"/);
  });

  it("no component names a plain span or div with aria-label", () => {
    const offenders: string[] = [];
    for (const file of filesUnder("src/components", /\.(astro|tsx)$/)) {
      for (const match of read(file).matchAll(/<(span|div)\b[^>]*>/g)) {
        const tag = match[0];
        if (/\baria-label=/.test(tag) && !/\brole=/.test(tag)) {
          offenders.push(`${file}: ${tag.slice(0, 90)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("the FAQ", () => {
  const faq = template(read("src/components/sections/FAQ.astro"));
  // The accordion is shared with the platform pages since 2026-09-15.
  const accordion = template(read("src/components/ui/FaqAccordion.astro"));

  it("is one native accordion", () => {
    expect(faq).toMatch(/<FaqAccordion[^>]*name="faq"/);
    expect(accordion).toMatch(/<details[^>]*name=\{name\}/);
    expect(accordion).toMatch(/<summary/);
  });

  it("carries no tab roles", () => {
    // A `ul[role=tablist]` with `li` children was reported CRITICAL
    // (aria-required-children / aria-required-parent) on every desktop view.
    expect(faq).not.toMatch(/role="tab(list|panel)?"/);
    expect(accordion).not.toMatch(/role="tab(list|panel)?"/);
  });

  it("renders every question exactly once", () => {
    // The previous version kept a second, hidden copy for phones.
    expect(faq.match(/<FaqAccordion/g)?.length).toBe(1);
    expect(accordion.match(/items\.map/g)?.length).toBe(1);
  });
});

describe("the page frame", () => {
  it("labels the skip link in the page's language", () => {
    const layout = read("src/layouts/Layout.astro");
    expect(layout).toMatch(/a11y\.skipToContent/);
    expect(template(layout)).not.toMatch(/>\s*Skip to content\s*</);
  });

  it("puts the floating call to action in a labelled landmark", () => {
    // axe `region`: it floated outside every landmark.
    const cta = template(read("src/components/FloatingCta.astro"));
    expect(cta).toMatch(/<aside\s+class="floating-cta-group"\s+aria-label=/);
  });

  it("keeps focused elements clear of the fixed bottom chrome", () => {
    // WCAG 2.4.11: 11 of 80 focus stops sat completely behind the cookie
    // notice or the floating bar on a phone.
    const css = read("src/styles/global.css");
    expect(css).toMatch(
      /scroll-padding-bottom:\s*calc\(\s*var\(--tds-bottom-lane[^;]*--lp-floating-lane/,
    );
    expect(read("src/components/FloatingCta.astro")).toMatch(/--lp-floating-lane/);
  });

  it("leaves room to scroll the last links above that chrome", () => {
    // scroll-padding cannot scroll past the end of a page: the footer's legal
    // row stayed under the notice at 720×450 and under the floating button at
    // 390×844 until the footer made room for both lanes.
    expect(read("src/components/Footer.astro")).toMatch(
      /padding-bottom:\s*calc\([^;]*--tds-bottom-lane[^;]*--lp-floating-lane/,
    );
  });

  it("does not keep the header fixed on a short viewport", () => {
    // 400 % zoom: header, notice and button covered 94 % of the screen.
    expect(read("src/components/Header.astro")).toMatch(
      /@media \(max-height: 30rem\)\s*\{\s*\.site-header\s*\{\s*position:\s*absolute/,
    );
  });

  it("gives the language switch nothing to point at but a real page", () => {
    const header = read("src/components/Header.astro");
    expect(header).toMatch(/<LanguageSwitch \/>/);
    expect(header).not.toMatch(/LanguageToggle/);
    expect(read("src/components/LanguageSwitch.astro")).toMatch(/alternatePath\(/);
  });
});

describe("the hero", () => {
  const home = read("src/components/HomePage.astro");
  const hero = code(read("src/components/sections/Hero.astro"));

  it("is server-rendered, not an island", () => {
    expect(home).toMatch(/import Hero from "~\/components\/sections\/Hero\.astro"/);
    expect(template(home)).not.toMatch(/<Hero[^>]*client:/);
  });

  it("never ships its copy invisible", () => {
    // The island's SSR markup carried `opacity:0` until hydration.
    expect(hero).not.toMatch(/from "motion/);
    expect(hero).not.toMatch(/opacity:\s*0\s*[;"]/);
  });

  it("keeps its entrance transform-only", () => {
    const keyframes = hero.match(/@keyframes hero-rise\s*\{[\s\S]*?\n {2}\}/)?.[0] ?? "";
    expect(keyframes).toContain("transform");
    expect(keyframes).not.toContain("opacity");
  });

  it("does not download its photograph on a phone", () => {
    expect(hero).toMatch(/<source media="\(min-width: 48rem\)"/);
  });

  it("has no rotating slider", () => {
    expect(template(hero)).not.toMatch(/Slider|role="tabpanel"/);
  });
});

describe("the rest of the home page", () => {
  it("does not make process steps focus stops", () => {
    expect(code(read("src/components/sections/Process.astro"))).not.toMatch(/tabindex/);
  });

  it("does not render the contact form invisible before hydration", () => {
    const form = read("src/components/islands/ContactForm.tsx");
    expect(form).not.toMatch(/from "motion/);
  });

  it("ties every contact form error to its field", () => {
    const form = read("src/components/islands/ContactForm.tsx");
    expect(form).toMatch(/"aria-describedby": errorId\(field\)/);
    expect(form).toMatch(/"aria-invalid": true/);
    expect(form).toMatch(/role="alert"/);
  });

  it("addresses the visitor with du, also when something fails", () => {
    // The shared bundle still says "Sie" for every other site, so the sentences
    // that address the visitor come from this site's own copy module.
    const form = code(read("src/components/islands/ContactForm.tsx"));
    expect(form).toMatch(/contactFormCopy\(lang\)/);
    const copy = code(read("src/lib/contactCopy.ts"));
    expect(copy).toMatch(/Bitte versuch es später noch einmal oder schreib mir direkt/);
    expect(copy).not.toMatch(/\b(Sie|Ihnen|Ihr|Ihre)\b/);
  });

  it("gives the service tiles a name, not a paragraph", () => {
    // The tile used to be one <a> around heading, text and list — its
    // accessible name was the whole card read aloud.
    const tile = template(read("src/components/ui/ServiceCard.astro"));
    expect(tile).toMatch(/<h3[^>]*>\s*<a href=\{href\} class="service-tile__link">\{title\}<\/a>/);
    expect(tile).not.toMatch(/<a\s[^>]*class="service-tile\b/);
  });

  it("keeps a reference card's service badges above its stretched link", () => {
    // The bar's CTA stretches over the whole card. A badge without a stacking
    // level of its own sent every tap to the card's destination — measured,
    // "Prozessoptimierung" opened the journal article.
    expect(code(read("src/components/ui/ReferenceCard.astro"))).toMatch(
      /\.reference-card__service\s*\{[^}]*position:\s*relative;[^}]*z-index:\s*1;/,
    );
  });
});

describe("the service assistant", () => {
  const island = code(read("src/components/islands/ServiceFinder.tsx"));
  const assistant = read("src/components/ServiceAssistant.astro");
  const markup = template(assistant.slice(0, assistant.indexOf("<style")));
  const script = code(assistant.slice(assistant.lastIndexOf("<script")));

  it("asks every question as a fieldset whose legend is the question", () => {
    expect(island).toMatch(/<fieldset/);
    expect(island).toMatch(/<legend[^>]*className="finder__question"/);
  });

  it("answers with native checkboxes and radios inside their labels", () => {
    expect(island).toMatch(/type="checkbox"/);
    expect(island).toMatch(/type="radio"/);
    expect(island).not.toMatch(/role="(checkbox|radio|option|listbox)"/);
  });

  it("moves focus to the next question and to the result, but not on hydration", () => {
    expect(island).toMatch(/tabIndex=\{-1\}/);
    expect(island).toMatch(/firstRender\.current/);
    expect(island).toMatch(/\.focus\(\)/);
  });

  it("says a missing answer in words", () => {
    expect(island).toMatch(/role="alert"/);
    expect(island).not.toMatch(/disabled=\{/);
  });

  it("hydrates when the browser is idle — a closed dialog never becomes visible", () => {
    // `client:visible` inside a closed <dialog> never fires, and the
    // server-rendered first question is a real form: "Weiter" before
    // hydration would submit it natively and reload the page.
    expect(markup).toMatch(/<ServiceFinderIsland[^>]*client:idle/);
    expect(markup).not.toMatch(/client:(load|visible)/);
  });

  it("is one native, labelled dialog", () => {
    expect(markup.match(/<dialog\b/g)?.length).toBe(1);
    expect(markup).toMatch(/<dialog[^>]*id="leistungsassistent"[^>]*aria-labelledby="assistant-title"/);
    expect(markup).toMatch(/id="assistant-title"/);
    expect(markup).not.toMatch(/role="dialog"|aria-modal/);
    // Opened through the bouncing wrapper, which calls showModal() itself.
    expect(script).toMatch(/modal\.open\(\)/);
    expect(read("src/lib/motion/dialog.ts")).toMatch(/dialog\.showModal\(\)/);
  });

  it("gives focus back to the button that opened it, or to where a link moved the page", () => {
    // On close the platform returns focus to whatever had it before
    // `showModal` — also after a link inside the dialog moved the page on, so
    // a keyboard user sat on the services button while looking at the contact
    // form (measured in Chrome). Focus follows the page instead.
    expect(script).toMatch(/if \(restoreFocus\) \{\s*opener\?\.focus\(\);/);
    expect(script).toMatch(/destination\.focus\(\{ preventScroll: true \}\)/);
    expect(script).toMatch(/CONTACT_DRAFT_EVENT/);
    expect(script.match(/restoreFocus = false/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps its buttons hidden until the dialog can open", () => {
    // A button that cannot open anything is never shown. The display utility
    // on the button beats the UA's `[hidden]` rule, hence the unlayered rule.
    // Since 2026-09-22 both ways in are the highlighted card, used in both
    // sections.
    expect(template(read("src/components/ui/AssistantCard.astro"))).toMatch(
      /<button\s+type="button"\s+data-assistant-open\s+hidden/,
    );
    for (const file of ["src/components/sections/Services.astro", "src/components/sections/Pricing.astro"]) {
      expect(template(read(file)), file).toMatch(/<AssistantCard\b/);
    }
    expect(script).toMatch(/typeof dialog\.showModal === "function"/);
    expect(script).toMatch(/button\.hidden = false/);
    expect(assistant).toMatch(/:global\(\[data-assistant-open\]\[hidden\]\)\s*\{\s*display:\s*none;/);
  });

  it("opens from its own address and from the old section anchor", () => {
    expect(script).toMatch(/"#leistungsassistent"/);
    expect(script).toMatch(/"#leistungsfinder"/);
  });

  it("sends nothing itself and hands its result to the contact form", () => {
    expect(island).not.toMatch(/fetch\(/);
    expect(island).toMatch(/handOffContactDraft\(/);
    expect(read("src/components/islands/ContactForm.tsx")).toMatch(/CONTACT_DRAFT_EVENT/);
  });

  it("is on the home page exactly once, and no longer a section", () => {
    const home = template(read("src/components/HomePage.astro"));
    expect(home.match(/<ServiceAssistant \/>/g)?.length).toBe(1);
    expect(home).not.toMatch(/<ServiceFinder \/>/);
  });
});
