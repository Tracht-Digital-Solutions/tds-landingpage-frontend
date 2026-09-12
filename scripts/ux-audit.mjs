/**
 * UX audit for the public site — the measurements the 2026-09 redesign was
 * planned and verified against, as a repeatable tool.
 *
 *   npm run audit:ux -- https://tracht-digital.de
 *   npm run audit:ux -- http://localhost:4321 --paths=/,/en/
 *
 * Every check here needs a real browser, and most of them are silent when
 * broken (see AGENTS.md, "Test desktop, 375 px mobile …"):
 *
 * - horizontal overflow, measured with the body's `overflow-x: clip` LIFTED and
 *   a 900px self-check — a clamped `scrollWidth` always says "fits";
 * - the header's controls inside the viewport; touch targets under 44px;
 * - how much of the viewport fixed chrome covers, and whether keyboard focus
 *   lands behind it (WCAG 2.4.11);
 * - decoration overlapping the hero's copy, actions or trust card;
 * - axe-core (WCAG 2.0/2.1/2.2 A+AA and best practice);
 * - redirects and deep links landing on their anchor, below the header;
 * - the language switch pointing at a page that answers;
 * - server-rendered markup that ships visible content at `opacity: 0`.
 *
 * Exit code 1 when a HARD rule fails: overflow, axe critical/serious, a focus
 * stop completely hidden, hero decoration over content, a header control
 * outside the viewport, a redirect or language link that lands wrong, content
 * shipped invisible. Everything else is reported for judgement.
 *
 * Drives the locally installed Chrome through playwright-core
 * (`UX_AUDIT_CHANNEL` to override). It only loads the pages it is pointed at —
 * never point it at an API.
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const base = (args.find((arg) => !arg.startsWith("--")) ?? "http://localhost:4321").replace(/\/$/, "");
const pathsArg = args.find((arg) => arg.startsWith("--paths="));
const paths = pathsArg
  ? pathsArg.slice("--paths=".length).split(",")
  : ["/", "/en/", "/leistungen/webauftritt", "/en/services/web-presence"];
// Git Bash rewrites an argument's leading "/" into a Windows path
// ("C:/Program Files/Git/"), which used to surface as "Invalid URL" mid-run.
const badPaths = paths.filter((path) => !path.startsWith("/"));
if (badPaths.length > 0) {
  console.error(
    `--paths takes site paths starting with "/", got: ${badPaths.join(", ")}\n` +
      "In Git Bash, run with MSYS_NO_PATHCONV=1.",
  );
  process.exit(2);
}

const require = createRequire(import.meta.url);
let axeSource = null;
try {
  axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
} catch {
  // Not installed: fall back to the CDN build below.
}

/** [width, height, touch] — the brief's widths plus 200 % and 400 % zoom. */
const SIZES = [
  [320, 568, true],
  [360, 740, true],
  [390, 844, true],
  [412, 915, true],
  [768, 1024, true],
  [1024, 768, true],
  [1280, 800, false],
  [1440, 900, false],
  [720, 450, false],
  [320, 256, false],
];

const failures = [];
const fail = (message) => {
  failures.push(message);
  console.log(`  ✗ ${message}`);
};
const info = (message) => console.log(`  · ${message}`);

/** Runs in the page. Keep it free of closures over Node values. */
function layoutAudit() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const text = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const name = (el) =>
    el.tagName.toLowerCase() +
    (el.id ? `#${el.id}` : "") +
    (typeof el.className === "string" && el.className.trim()
      ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}`
      : "");
  const shown = (el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.display !== "none" && cs.visibility !== "hidden" && Number(cs.opacity) > 0 && r.width > 0 && r.height > 0;
  };

  // 1. Overflow, with the clamp lifted — and a probe proving the measurement bites.
  const lift = document.createElement("style");
  lift.textContent = "html,body{overflow-x:visible !important}";
  document.head.appendChild(lift);
  void document.body.offsetWidth;
  const probe = document.createElement("div");
  probe.style.cssText = `width:${vw + 400}px;height:1px`;
  document.body.appendChild(probe);
  const probeBites = document.documentElement.scrollWidth > vw;
  probe.remove();
  const docWidth = document.documentElement.scrollWidth;
  const clippedByAncestor = (el) => {
    for (let a = el.parentElement; a && a !== document.body && a !== document.documentElement; a = a.parentElement) {
      if (getComputedStyle(a).overflowX !== "visible") return true;
    }
    return false;
  };
  const flagged = new Set();
  const overflow = [];
  for (const el of document.body.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    // Entirely off-screen to the left (a honeypot at -9999px) cannot be scrolled to.
    const offRight = r.right > vw + 1;
    const offLeftVisible = r.left < -1 && r.right > 0;
    if (!offRight && !offLeftVisible) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || clippedByAncestor(el)) continue;
    flagged.add(el);
    let nested = false;
    for (let a = el.parentElement; a; a = a.parentElement) if (flagged.has(a)) nested = true;
    if (!nested) overflow.push(`${name(el)} ${Math.round(r.left)}..${Math.round(r.right)}`);
  }
  lift.remove();

  // 2. Header controls.
  const controls = {};
  for (const [key, selector] of Object.entries({
    logo: "#logo-link",
    theme: ".tds-theme-toggle",
    language: "a[data-lang-switch]",
    menu: "#menu-toggle",
  })) {
    const el = document.querySelector(selector);
    if (!el || !shown(el)) {
      controls[key] = null;
      continue;
    }
    const r = el.getBoundingClientRect();
    controls[key] = { left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width), h: Math.round(r.height) };
  }

  // 3. Touch targets (inline links inside running text are exempt, WCAG 2.5.8).
  const small = [];
  for (const el of document.querySelectorAll("a[href], button, input:not([type=hidden]), select, textarea, summary")) {
    if (!shown(el) || el.closest("[inert], [aria-hidden='true']")) continue;
    const cs = getComputedStyle(el);
    const parent = el.parentElement;
    if (cs.display === "inline" && parent && text(parent.textContent).length > text(el.textContent).length + 15) continue;
    let r = el.getBoundingClientRect();
    // A stretched link — `::after` absolutely positioned over its card — is as
    // large as the card it covers, not as its own line of text.
    const after = getComputedStyle(el, "::after");
    if (after.content !== "none" && after.position === "absolute" && cs.position === "static" && el.offsetParent) {
      const card = el.offsetParent.getBoundingClientRect();
      if (card.width * card.height > r.width * r.height) r = card;
    }
    // A checkbox or radio is hit through its <label> as well, so the label's
    // box is the target (WCAG 2.5.8) — not the 18px control inside it.
    for (const label of el.labels ?? []) {
      const box = label.getBoundingClientRect();
      if (box.width * box.height > r.width * r.height) r = box;
    }
    if (r.width < 44 || r.height < 44) small.push(`${text(el.getAttribute("aria-label") || el.textContent).slice(0, 28)} ${Math.round(r.width)}×${Math.round(r.height)}`);
  }

  // 4. Fixed chrome coverage.
  const intervals = [];
  for (const selector of ["#site-header", ".cookie-notice", ".floating-cta", ".floating-cta-top"]) {
    const el = document.querySelector(selector);
    if (!el || !shown(el) || getComputedStyle(el).position === "absolute") continue;
    const r = el.getBoundingClientRect();
    intervals.push([Math.max(0, r.top), Math.min(vh, r.bottom)]);
  }
  intervals.sort((a, b) => a[0] - b[0]);
  let covered = 0;
  let current = null;
  for (const interval of intervals) {
    if (!current || interval[0] > current[1]) {
      if (current) covered += Math.max(0, current[1] - current[0]);
      current = [...interval];
    } else current[1] = Math.max(current[1], interval[1]);
  }
  if (current) covered += Math.max(0, current[1] - current[0]);

  // 5. Hero decoration over hero content or the header.
  const area = (a, b) =>
    Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
    Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const decor = [...document.querySelectorAll("#hero .tds-shape, #hero .tds-circuit")].filter(shown);
  const content = [
    ...document.querySelectorAll("#hero h1, #hero p, #hero a, #hero .hero-trust, #site-header"),
  ].filter(shown);
  const decorOverlaps = [];
  for (const d of decor) {
    const dr = d.getBoundingClientRect();
    for (const c of content) {
      const overlap = area(dr, c.getBoundingClientRect());
      if (overlap > 4) decorOverlaps.push(`${name(d)} over ${name(c)} (${Math.round(overlap)}px²)`);
    }
  }

  const h1 = document.querySelector("h1");
  return {
    vw,
    vh,
    docWidth,
    probeBites,
    overflow: overflow.slice(0, 8),
    controls,
    small: small.slice(0, 12),
    smallCount: small.length,
    coveragePct: Math.round((100 * covered) / vh),
    decorOverlaps: decorOverlaps.slice(0, 6),
    h1: h1 ? { size: getComputedStyle(h1).fontSize, opacity: getComputedStyle(h1).opacity } : null,
    languageHref: document.querySelector("a[data-lang-switch]")?.getAttribute("href") ?? null,
  };
}

async function runAxe(page) {
  if (axeSource) await page.addScriptTag({ content: axeSource });
  else await page.addScriptTag({ url: "https://cdn.jsdelivr.net/npm/axe-core@4/axe.min.js" });
  return page.evaluate(async () => {
    const result = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
    });
    return result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
    }));
  });
}

async function focusScan(page, stops) {
  let hidden = 0;
  let partly = 0;
  const examples = [];
  for (let i = 0; i < stops; i++) {
    await page.keyboard.press("Tab");
    // Focus scrolling honours `scroll-behavior: smooth`, so 120 ms after a Tab
    // the page is often still moving. That snapshot reported stops as hidden
    // behind the cookie notice that were clear once the scroll had landed —
    // wait until scrollY holds still for a few frames (at most 2 s).
    await page.waitForTimeout(60);
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          const started = performance.now();
          let last = window.scrollY;
          let still = 0;
          const tick = () => {
            if (window.scrollY === last) still++;
            else {
              still = 0;
              last = window.scrollY;
            }
            if (still >= 4 || performance.now() - started > 2000) resolve(true);
            else requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
    );
    const result = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const a = el.getBoundingClientRect();
      if (a.width === 0 || a.height === 0) return null;
      let worst = 0;
      let by = "";
      for (const selector of [".cookie-notice", ".floating-cta", ".floating-cta-top", "#site-header"]) {
        const cover = document.querySelector(selector);
        if (!cover || cover.contains(el)) continue;
        const cs = getComputedStyle(cover);
        if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
        const b = cover.getBoundingClientRect();
        const overlap =
          Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
          Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        const fraction = overlap / (a.width * a.height);
        // The skip link sits ABOVE the header on purpose (z-index).
        if (el.matches('a[href="#main"]')) continue;
        if (fraction > worst) {
          worst = fraction;
          by = selector;
        }
      }
      return { worst, by, label: String(el.getAttribute("aria-label") || el.textContent || el.tagName).replace(/\s+/g, " ").trim().slice(0, 30) };
    });
    if (!result) continue;
    if (result.worst >= 0.99) {
      hidden++;
      if (examples.length < 5) examples.push(`${result.label} ← ${result.by}`);
    } else if (result.worst > 0) partly++;
  }
  return { hidden, partly, examples };
}

const browser = await chromium.launch({ channel: process.env.UX_AUDIT_CHANNEL ?? "chrome", headless: true });
const contextFor = (width, height, touch, extra = {}) =>
  browser.newContext({
    viewport: { width, height },
    isMobile: touch,
    hasTouch: touch,
    deviceScaleFactor: 1,
    locale: "de-DE",
    ...extra,
  });

try {
  for (const path of paths) {
    console.log(`\n${path}`);

    // Server-rendered markup: nothing visible may ship at opacity 0.
    {
      const context = await contextFor(1440, 900, false);
      const response = await context.request.get(base + path);
      const html = await response.text();
      const invisible = [...html.matchAll(/<(h1|h2|p|a|button|form|input|label)\b[^>]*style="[^"]*opacity:\s*0\s*[;"][^>]*>/g)]
        .map((m) => m[0])
        .filter((tag) => !tag.includes("-9999px"));
      if (invisible.length > 0) fail(`${path}: ${invisible.length} element(s) server-rendered at opacity 0, e.g. ${invisible[0].slice(0, 80)}`);
      await context.close();
    }

    for (const [width, height, touch] of SIZES) {
      const context = await contextFor(width, height, touch);
      const page = await context.newPage();
      await page.goto(base + path, { waitUntil: "load", timeout: 60_000 });
      await page.waitForTimeout(2_500);
      const r = await page.evaluate(layoutAudit);
      const tag = `${path} @${width}×${height}${touch ? " touch" : ""}`;

      if (!r.probeBites && width < 1000) fail(`${tag}: overflow probe did not register — measurement unreliable`);
      if (r.overflow.length > 0) fail(`${tag}: horizontal overflow ${r.overflow.join("; ")}`);
      for (const [key, rect] of Object.entries(r.controls)) {
        if (rect && (rect.left < 0 || rect.right > r.vw)) fail(`${tag}: header ${key} outside the viewport (${rect.left}..${rect.right})`);
      }
      if (r.decorOverlaps.length > 0) fail(`${tag}: decoration over content — ${r.decorOverlaps.join("; ")}`);
      const controls = Object.entries(r.controls)
        .map(([key, rect]) => (rect ? `${key} ${rect.w}×${rect.h}` : `${key} –`))
        .join(", ");
      info(`${tag}: chrome ${r.coveragePct}% · targets<44 ${r.smallCount} · ${controls}${r.h1 ? ` · h1 ${r.h1.size}` : ""}`);
      if (touch && r.smallCount > 0) info(`  small targets: ${r.small.join(" | ")}`);

      if (width === 320 && height === 568 && path === "/" && r.coveragePct > 35) {
        fail(`${tag}: fixed chrome covers ${r.coveragePct}% of the first screen (target ≤ 35%)`);
      }

      if ((width === 390 || width === 1440) && !(width === 390 && path !== "/" && path !== "/en/")) {
        const violations = await runAxe(page);
        const blocking = violations.filter((v) => v.impact === "critical" || v.impact === "serious");
        for (const v of blocking) fail(`${tag}: axe ${v.impact} ${v.id} ×${v.nodes} (${v.targets.join(", ")})`);
        const other = violations.filter((v) => !blocking.includes(v));
        if (other.length > 0) info(`  axe other: ${other.map((v) => `${v.impact} ${v.id}×${v.nodes}`).join(", ")}`);
        // Said out loud, so a run in which axe never executed cannot pass for a clean one.
        if (violations.length === 0) info(`${tag}: axe 0 violations`);
      }

      if (r.languageHref && width === 1440) {
        const answer = await context.request.get(base + r.languageHref, { maxRedirects: 0 });
        if (answer.status() !== 200) fail(`${tag}: language switch → ${r.languageHref} answers ${answer.status()}`);
      }

      await context.close();
    }

    for (const [width, height, touch] of [[390, 844, true], [720, 450, false]]) {
      const context = await contextFor(width, height, touch);
      const page = await context.newPage();
      await page.goto(base + path, { waitUntil: "load" });
      await page.waitForTimeout(2_000);
      const scan = await focusScan(page, 80);
      const tag = `${path} focus @${width}×${height}`;
      if (scan.hidden > 0) fail(`${tag}: ${scan.hidden} focus stop(s) completely hidden — ${scan.examples.join("; ")}`);
      info(`${tag}: hidden ${scan.hidden} · partly ${scan.partly}`);
      await context.close();
    }
  }

  // Redirects and deep links.
  console.log("\nredirects & deep links");
  const deepLinks = [
    ["/preise", "/", "#preise"],
    ["/en/preise", "/en/", "#preise"],
    ["/en/pricing", "/en/", "#preise"],
    ["/kontakt", "/", "#contact"],
    ["/en/contact", "/en/", "#contact"],
    ["/#faq", "/", "#faq"],
  ];
  for (const [width, height, touch] of [[1440, 900, false], [390, 844, true]]) {
    for (const [from, pathname, hash] of deepLinks) {
      const context = await contextFor(width, height, touch);
      const page = await context.newPage();
      const response = await page.goto(base + from, { waitUntil: "load" });
      await page.waitForTimeout(2_000);
      const landed = await page.evaluate((id) => {
        const target = document.getElementById(id);
        const header = document.getElementById("site-header");
        return {
          pathname: location.pathname,
          hash: location.hash,
          top: target ? Math.round(target.getBoundingClientRect().top) : null,
          headerBottom: header ? Math.round(header.getBoundingClientRect().bottom) : 0,
        };
      }, hash.slice(1));
      const tag = `${from} @${width}`;
      if (!response || response.status() !== 200) fail(`${tag}: final status ${response?.status()}`);
      else if (landed.pathname !== pathname || landed.hash !== hash) fail(`${tag}: landed on ${landed.pathname}${landed.hash}`);
      else if (landed.top === null || landed.top < landed.headerBottom - 2) fail(`${tag}: ${hash} under the header (top ${landed.top}, header ${landed.headerBottom})`);
      else info(`${tag}: ${landed.pathname}${landed.hash} top ${landed.top}px`);
      await context.close();
    }
  }

  // Reduced motion: the headline is visible from the first frame.
  {
    const context = await contextFor(390, 844, true, { reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
    const early = await page.evaluate(() => getComputedStyle(document.querySelector("h1")).opacity);
    if (early !== "1") fail(`reduced motion: h1 opacity ${early} at DOMContentLoaded`);
    else info("reduced motion: h1 visible at DOMContentLoaded");
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(failures.length === 0 ? "\n✓ no hard failures" : `\n✗ ${failures.length} hard failure(s)`);
process.exit(failures.length === 0 ? 0 : 1);
