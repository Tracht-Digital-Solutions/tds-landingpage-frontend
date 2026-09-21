/**
 * Performance audit for the public site — the numbers, as a repeatable tool.
 *
 *   npm run audit:perf -- http://localhost:4399
 *   npm run audit:perf -- https://tracht-digital.de --paths=/,/en/
 *   npm run audit:perf -- http://localhost:4399 --runs=7 --json
 *
 * In Git Bash prefix it with `MSYS_NO_PATHCONV=1`, or `--paths=/` is rewritten
 * into a Windows path and the run navigates to `http://host C:/Program Files/`.
 *
 * ### Why this exists
 *
 * Every performance number in `AGENTS.md` was taken by hand in Lighthouse on a
 * particular afternoon — "LCP 3.6s → 2.6s", "588 ms vs 592 ms". None of them
 * can be reproduced, so none of them can be regressed against: a change that
 * doubled the JavaScript on the home page would pass `type-check`, `test:run`,
 * `audit:ux` and `audit:seo` without a word. This is the missing gate.
 *
 * ### What it measures, and why THESE numbers
 *
 * - **LCP, median of N.** The median and not the mean: one slow cold run
 *   otherwise decides the comparison. Measured through a `PerformanceObserver`
 *   with `buffered: true` — `getEntriesByType("largest-contentful-paint")`
 *   returns nothing, the entries only ever reach an observer.
 * - **The LCP ELEMENT.** A number without it is unreadable. When the hero's
 *   headline stops being the LCP element, something took its place — that is
 *   exactly how the cookie notice became the LCP at 4.1 s once.
 * - **CLS and TTFB**, from the same load.
 * - **Transfer weight per resource type**, from the Resource Timing API rather
 *   than `content-length`: compressed responses frequently omit that header,
 *   which silently reports scripts as 0 KB.
 * - **Uncompressed JS**, because parse and execute cost scales with the
 *   decoded size, not the transferred one.
 *
 * Throttled to 390 px and 4× CPU, cache disabled — the device the one real
 * incident was measured on, not a desktop with a warm cache.
 *
 * ### Budgets
 *
 * `perf-budget.json` beside this file. A budget is exceeded → exit code 1, the
 * same contract `audit:ux` and `audit:seo` keep. Budgets are set ABOVE the
 * current measurement with deliberate headroom; they are a tripwire against a
 * regression, not a target to optimise towards.
 *
 * Drives the locally installed Chrome through playwright-core
 * (`PERF_AUDIT_CHANNEL` to override). It only loads the pages it is pointed at
 * — never point it at an API.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright-core";

const here = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:4321").replace(/\/$/, "");
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const paths = flag("paths", "/,/en/").split(",");
const runs = Number(flag("runs", "5"));
const asJson = args.includes("--json");

const budgets = JSON.parse(readFileSync(join(here, "perf-budget.json"), "utf8"));

const kb = (bytes) => Math.round(bytes / 1024);
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

/** One throttled load. Returns the timings and the byte weight. */
async function measure(browser, url) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await session.send("Network.setCacheDisabled", { cacheDisabled: true });

  await page.goto(url, { waitUntil: "load", timeout: 90000 });
  // Long enough for `client:idle` islands to have loaded and for a late LCP
  // candidate (a lazily decoded image) to have replaced an early one.
  await page.waitForTimeout(5000);

  const result = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = null;
        let cls = 0;
        const onLcp = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          lcp = entries[entries.length - 1] ?? lcp;
        });
        onLcp.observe({ type: "largest-contentful-paint", buffered: true });
        const onCls = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) cls += entry.value;
        });
        onCls.observe({ type: "layout-shift", buffered: true });

        setTimeout(() => {
          onLcp.disconnect();
          onCls.disconnect();

          const nav = performance.getEntriesByType("navigation")[0];
          const resources = performance.getEntriesByType("resource");
          const weight = {};
          const count = {};
          let jsDecoded = 0;
          for (const entry of resources) {
            const kind = /\.woff2?($|\?)/.test(entry.name)
              ? "font"
              : /\.js($|\?)/.test(entry.name)
                ? "script"
                : /\.css($|\?)/.test(entry.name)
                  ? "style"
                  : /\.(png|jpe?g|webp|avif|gif|svg)($|\?)/.test(entry.name)
                    ? "image"
                    : "other";
            weight[kind] = (weight[kind] ?? 0) + (entry.encodedBodySize || 0);
            count[kind] = (count[kind] ?? 0) + 1;
            if (kind === "script") jsDecoded += entry.decodedBodySize || 0;
          }

          const el = lcp?.element;
          resolve({
            lcp: lcp ? lcp.startTime : -1,
            lcpElement: el
              ? `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}`.slice(0, 40)
              : "(keines)",
            cls,
            ttfb: nav ? nav.responseStart : -1,
            // The document itself is not a resource entry; take it from nav.
            documentBytes: nav ? nav.encodedBodySize || 0 : 0,
            weight,
            count,
            jsDecoded,
          });
        }, 400);
      }),
  );

  await context.close();
  return result;
}

const browser = await chromium.launch({ channel: process.env.PERF_AUDIT_CHANNEL ?? "chrome" });
const report = [];
let failed = 0;

for (const path of paths) {
  const url = `${base}${path}`;
  const samples = [];
  for (let i = 0; i < runs; i++) samples.push(await measure(browser, url));

  const lcpMedian = Math.round(median(samples.map((s) => s.lcp)));
  const last = samples[samples.length - 1];
  const totalBytes =
    last.documentBytes + Object.values(last.weight).reduce((sum, n) => sum + n, 0);

  const page = {
    path,
    lcpMedian,
    lcpAll: samples.map((s) => Math.round(s.lcp)).sort((a, b) => a - b),
    lcpElement: last.lcpElement,
    cls: Number(last.cls.toFixed(4)),
    ttfb: Math.round(last.ttfb),
    documentKb: kb(last.documentBytes),
    jsDecodedKb: kb(last.jsDecoded),
    totalKb: kb(totalBytes),
    weight: Object.fromEntries(
      Object.entries(last.weight)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => [k, `${last.count[k]}× ${kb(v)} KB`]),
    ),
  };
  report.push(page);

  if (asJson) continue;

  console.log(`\n${url}`);
  console.log(
    `  LCP        ${page.lcpMedian} ms (Median aus ${runs}: ${page.lcpAll.join(", ")}) → ${page.lcpElement}`,
  );
  console.log(`  TTFB       ${page.ttfb} ms     CLS ${page.cls}`);
  console.log(`  Dokument   ${page.documentKb} KB      JS entpackt ${page.jsDecodedKb} KB`);
  console.log(`  Uebertragen gesamt ${page.totalKb} KB`);
  for (const [kind, text] of Object.entries(page.weight)) {
    console.log(`    ${kind.padEnd(8)} ${text}`);
  }

  // Budgets are per page path, falling back to the shared default.
  const budget = budgets.pages?.[path] ?? budgets.default;
  for (const [key, limit] of Object.entries(budget)) {
    const value = page[key];
    if (typeof value !== "number") continue;
    if (value > limit) {
      console.log(`  ✗ ${key} ${value} ueber dem Budget ${limit}`);
      failed++;
    }
  }
  if (budgets.lcpElement && page.lcpElement !== budgets.lcpElement) {
    console.log(
      `  ✗ LCP-Element ist ${page.lcpElement}, erwartet ${budgets.lcpElement} — etwas hat die Ueberschrift verdraengt`,
    );
    failed++;
  }
}

await browser.close();

if (asJson) {
  console.log(JSON.stringify(report, null, 1));
} else {
  console.log(failed ? `\n✗ ${failed} Budget(s) ueberschritten` : "\n✓ alle Budgets eingehalten");
}

process.exit(failed ? 1 : 0);
