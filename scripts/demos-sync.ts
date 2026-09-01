/**
 * Harvest what each demo site says about itself.
 *
 * Run: `npm run demos:sync`
 *
 * Writes `src/lib/demoData.json` plus the assets under `public/demos/`, both
 * committed. The site then renders from that snapshot: a page render never
 * parses a demo's HTML, never takes a screenshot and never guesses a headline.
 * Everything a visitor reads on a demo card came from the demo itself.
 *
 * ### Availability is decided here, and it is strict
 *
 * Three failures look identical from the marketing site — a working link — and
 * all three are disqualifying:
 *
 * 1. **Invalid certificate.** Checked with TLS verification ON and with no
 *    insecure retry, on purpose. A host whose certificate the visitor's
 *    browser rejects is a host the visitor cannot reach; retrying with
 *    `rejectUnauthorized: false` would only teach this script to disagree with
 *    every browser on earth.
 * 2. **A hosting panel instead of a site.** Plesk answers `200 OK` for a
 *    subdomain with no document root, serving either its "Hier entsteht eine
 *    neue Webseite" placeholder or the control-panel login. Both are a
 *    perfectly healthy HTTP response and neither is a website.
 * 3. **Too little to show.** A page with no heading, or under a few hundred
 *    characters of text, cannot be presented as a finished demo.
 *
 * A disqualified demo is recorded with the reason and carries no assets, so
 * `getDemos()` drops it and the section renders one card fewer — or, if none
 * qualify, renders nothing at all.
 *
 * The script exits 0 even when every demo fails. That is a fact about the
 * hosts, not a fault in the run; the printed table is the to-do list.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import sharp from "sharp";
import { chromium, type Browser } from "playwright-core";
import {
  DEMO_ASSET_DIR,
  DEMO_PREVIEW,
  demoDefinitions,
  type DemoDefinition,
} from "../src/lib/demoCatalog.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const assetDir = path.join(root, "public", DEMO_ASSET_DIR);
const snapshotFile = path.join(root, "src", "lib", "demoData.json");

const FETCH_TIMEOUT_MS = 15_000;
const NAVIGATION_TIMEOUT_MS = 30_000;
/** A favicon larger than this is not a favicon; do not commit it. */
const MAX_FAVICON_BYTES = 100 * 1024;
/** Below this much visible text a page is a placeholder, not a site. */
const MIN_TEXT_LENGTH = 400;

interface Harvest {
  status: string;
  title: string | null;
  description: string | null;
  siteLang: string | null;
  favicon: string | null;
  preview: string | null;
  previewWidth: number | null;
  previewHeight: number | null;
  checkedAt: string;
  /** Printed in the report, not written to the snapshot. */
  note?: string;
}

// ─── Reachability ────────────────────────────────────────────────────────────

/**
 * TLS failures reach `fetch` as an opaque `TypeError: fetch failed`; the real
 * reason is a `code` somewhere down the `cause` chain.
 */
const TLS_CODES = new Set([
  "CERT_HAS_EXPIRED",
  "CERT_NOT_YET_VALID",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "ERR_TLS_CERT_ALTNAME_INVALID",
  "ERR_SSL_WRONG_VERSION_NUMBER",
  "EPROTO",
]);

function errorCodes(error: unknown): string[] {
  const codes: string[] = [];
  let current: unknown = error;
  for (let depth = 0; current && depth < 5; depth += 1) {
    const code = (current as { code?: unknown }).code;
    if (typeof code === "string") codes.push(code);
    current = (current as { cause?: unknown }).cause;
  }
  return codes;
}

function describe(error: unknown): string {
  const codes = errorCodes(error);
  if (codes.length > 0) return codes.join(" / ");
  return error instanceof Error ? error.message : String(error);
}

// ─── Classification ──────────────────────────────────────────────────────────

/** Titles a hosting panel serves when a subdomain has no site behind it. */
const PLACEHOLDER_TITLES = [
  /hier entsteht eine neue web(seite|site)/i,
  /default web ?site page/i,
  /apache2?.{0,20}default page/i,
  /welcome to nginx/i,
  /coming soon/i,
  /under construction/i,
  /^index of \//i,
  /site not found/i,
];

/** The control panel itself, reached because the subdomain points at it. */
const PANEL_TITLES = [/webhostingcontrolpanel/i, /\bplesk\b/i, /\bcpanel\b/i, /\bwcp\b/i];

function visibleText(doc: Document): string {
  const body = doc.body;
  if (!body) return "";
  for (const node of Array.from(body.querySelectorAll("script, style, noscript, template"))) {
    node.remove();
  }
  return (body.textContent ?? "").replace(/\s+/g, " ").trim();
}

function firstMeta(doc: Document, selectors: string[]): string | null {
  for (const selector of selectors) {
    const value = doc.querySelector(selector)?.getAttribute("content");
    if (value && value.trim() !== "") return value.replace(/\s+/g, " ").trim();
  }
  return null;
}

// ─── Assets ──────────────────────────────────────────────────────────────────

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/svg+xml": ".svg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/jpeg": ".jpg",
  "image/gif": ".gif",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
};

/**
 * Favicon candidates, best first.
 *
 * SVG wins because it stays sharp at any size; after that the largest declared
 * raster, then the apple-touch icon, then the conventional `/favicon.ico` that
 * every server answers whether or not the HTML mentions it.
 */
function faviconCandidates(doc: Document, base: URL): string[] {
  const links = Array.from(doc.querySelectorAll<HTMLLinkElement>("link[rel]"));
  const rel = (link: Element) => (link.getAttribute("rel") ?? "").toLowerCase().split(/\s+/);
  const size = (link: Element) => {
    const raw = link.getAttribute("sizes") ?? "";
    const match = /(\d+)x(\d+)/i.exec(raw);
    return match ? Number(match[1]) : 0;
  };

  const icons = links.filter((link) => rel(link).includes("icon"));
  const svg = icons.filter((link) => (link.getAttribute("type") ?? "").includes("svg"));
  const raster = icons
    .filter((link) => !(link.getAttribute("type") ?? "").includes("svg"))
    .sort((a, b) => size(b) - size(a));
  const apple = links.filter((link) => rel(link).includes("apple-touch-icon"));

  const hrefs = [...svg, ...raster, ...apple]
    .map((link) => link.getAttribute("href"))
    .filter((href): href is string => Boolean(href && href.trim()));

  const resolved: string[] = [];
  for (const href of [...hrefs, "/favicon.ico"]) {
    try {
      const url = new URL(href, base).toString();
      if (!resolved.includes(url)) resolved.push(url);
    } catch {
      // A malformed href is one candidate lost, not a failed harvest.
    }
  }
  return resolved;
}

/**
 * Download the first candidate that is actually an image of sane size.
 *
 * Rasters are normalised to a 64 px PNG so five demos cannot each impose their
 * own icon weight on the section; SVG and ICO are stored verbatim because
 * `sharp` decodes neither.
 */
async function fetchFavicon(demo: DemoDefinition, candidates: string[]): Promise<string | null> {
  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
      if (!res.ok) continue;

      const type = (res.headers.get("content-type") ?? "").split(";")[0]!.trim().toLowerCase();
      const extension = IMAGE_EXTENSIONS[type];
      if (!extension) continue;

      const bytes = Buffer.from(await res.arrayBuffer());
      if (bytes.length === 0 || bytes.length > MAX_FAVICON_BYTES) continue;

      if (extension === ".svg" || extension === ".ico") {
        const file = `${demo.id}-favicon${extension}`;
        await fs.writeFile(path.join(assetDir, file), bytes);
        return `/${DEMO_ASSET_DIR}/${file}`;
      }

      const file = `${demo.id}-favicon.png`;
      await sharp(bytes)
        .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(path.join(assetDir, file));
      return `/${DEMO_ASSET_DIR}/${file}`;
    } catch {
      // Try the next candidate. A missing favicon is not a missing demo.
    }
  }
  return null;
}

/**
 * Screenshot the demo as a visitor first sees it.
 *
 * `reducedMotion: "reduce"` so an entrance animation is not caught halfway
 * through, and the capture is viewport-sized rather than full-page: the card
 * shows the top of the site, not a metre-long strip scaled into illegibility.
 */
async function capturePreview(browser: Browser, demo: DemoDefinition): Promise<string | null> {
  const context = await browser.newContext({
    viewport: { ...DEMO_PREVIEW },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    colorScheme: "light",
    locale: "de-DE",
  });

  try {
    const page = await context.newPage();
    try {
      await page.goto(demo.url, { waitUntil: "networkidle", timeout: NAVIGATION_TIMEOUT_MS });
    } catch {
      // A site that polls never goes idle. `load` plus the settle below is
      // enough for a screenshot, and is better than no preview at all.
      await page.goto(demo.url, { waitUntil: "load", timeout: NAVIGATION_TIMEOUT_MS });
    }
    await page.waitForTimeout(1_000);

    const png = await page.screenshot({ type: "png" });
    const file = `${demo.id}.webp`;
    await sharp(png).webp({ quality: 82 }).toFile(path.join(assetDir, file));
    return `/${DEMO_ASSET_DIR}/${file}`;
  } finally {
    await context.close();
  }
}

// ─── Harvest ─────────────────────────────────────────────────────────────────

function unavailable(status: string, note?: string): Harvest {
  return {
    status,
    title: null,
    description: null,
    siteLang: null,
    favicon: null,
    preview: null,
    previewWidth: null,
    previewHeight: null,
    checkedAt: new Date().toISOString(),
    note,
  };
}

async function harvest(demo: DemoDefinition): Promise<Harvest> {
  let res: Response;
  try {
    res = await fetch(demo.url, {
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { "user-agent": "tds-landingpage demos-sync" },
    });
  } catch (error) {
    const codes = errorCodes(error);
    const status = codes.some((code) => TLS_CODES.has(code)) ? "tls-invalid" : "unreachable";
    return unavailable(status, describe(error));
  }

  if (!res.ok) return unavailable(`http-${res.status}`, res.statusText);

  const contentType = (res.headers.get("content-type") ?? "").toLowerCase();
  if (!contentType.includes("html")) {
    return unavailable("placeholder", `content-type ${contentType || "unknown"}`);
  }

  const html = await res.text();
  const base = new URL(res.url || demo.url);
  const doc = new JSDOM(html, { url: base.toString() }).window.document;

  const rawTitle = (doc.querySelector("title")?.textContent ?? "").replace(/\s+/g, " ").trim();
  const rootClass = doc.documentElement.getAttribute("class") ?? "";

  if (
    PANEL_TITLES.some((pattern) => pattern.test(rawTitle)) ||
    /\bsid-plesk\b/.test(rootClass) ||
    doc.querySelector("#forgery_protection_token") !== null
  ) {
    return unavailable("control-panel", rawTitle || "hosting control panel");
  }

  if (PLACEHOLDER_TITLES.some((pattern) => pattern.test(rawTitle))) {
    return unavailable("placeholder", rawTitle);
  }

  const text = visibleText(doc);
  const hasHeading = doc.querySelector("h1, h2") !== null;
  if (!hasHeading || text.length < MIN_TEXT_LENGTH) {
    return unavailable(
      "placeholder",
      `${text.length} chars of text, ${hasHeading ? "has" : "no"} heading`,
    );
  }

  const title =
    firstMeta(doc, ['meta[property="og:site_name"]', 'meta[property="og:title"]']) ||
    rawTitle ||
    null;
  if (!title) return unavailable("placeholder", "no title");

  // No description is a legitimate outcome. The card shows the title and the
  // screenshot; inventing a sentence about someone's site is not on the table.
  const description = firstMeta(doc, [
    'meta[name="description"]',
    'meta[property="og:description"]',
  ]);

  const declaredLang = (doc.documentElement.getAttribute("lang") ?? "").trim().toLowerCase();
  const siteLang = /^[a-z]{2}(-[a-z0-9]+)*$/.test(declaredLang) ? declaredLang : null;

  return {
    status: "ok",
    title,
    description,
    siteLang,
    favicon: await fetchFavicon(demo, faviconCandidates(doc, base)),
    preview: null,
    previewWidth: DEMO_PREVIEW.width,
    previewHeight: DEMO_PREVIEW.height,
    checkedAt: new Date().toISOString(),
  };
}

/** Remove assets belonging to a demo that no longer qualifies. */
async function removeAssets(demo: DemoDefinition): Promise<void> {
  let entries: string[];
  try {
    entries = await fs.readdir(assetDir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry === demo.id || entry.startsWith(`${demo.id}.`) || entry.startsWith(`${demo.id}-`)) {
      await fs.rm(path.join(assetDir, entry), { force: true });
    }
  }
}

// ─── Run ─────────────────────────────────────────────────────────────────────

await fs.mkdir(assetDir, { recursive: true });

const results = new Map<string, Harvest>();
for (const demo of demoDefinitions) {
  process.stdout.write(`  ${demo.id}  ${demo.host} … `);
  await removeAssets(demo);
  const result = await harvest(demo);
  results.set(demo.id, result);
  // eslint-disable-next-line no-console
  console.log(result.status === "ok" ? "ok" : `${result.status} (${result.note ?? ""})`);
}

// The browser starts only when something is worth photographing — which today
// means it does not start at all.
const photogenic = demoDefinitions.filter((demo) => results.get(demo.id)?.status === "ok");
if (photogenic.length > 0) {
  const browser = await chromium.launch();
  try {
    for (const demo of photogenic) {
      const result = results.get(demo.id)!;
      process.stdout.write(`  ${demo.id}  screenshot … `);
      try {
        result.preview = await capturePreview(browser, demo);
        // eslint-disable-next-line no-console
        console.log(result.preview ? "ok" : "failed");
      } catch (error) {
        // No screenshot means no card: the snapshot resolver requires one, so
        // a half-harvested demo cannot reach the page as a broken image.
        result.status = "unreachable";
        result.note = `screenshot failed: ${describe(error)}`;
        result.preview = null;
        await removeAssets(demo);
        // eslint-disable-next-line no-console
        console.log(`failed — ${result.note}`);
      }
    }
  } finally {
    await browser.close();
  }
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  demos: Object.fromEntries(
    demoDefinitions.map((demo) => {
      const { note: _note, ...entry } = results.get(demo.id)!;
      return [demo.id, entry];
    }),
  ),
};

await fs.writeFile(snapshotFile, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

const available = demoDefinitions.filter((demo) => results.get(demo.id)?.status === "ok");
// eslint-disable-next-line no-console
console.log(
  `\n${available.length}/${demoDefinitions.length} demo(s) presentable → ${path.relative(root, snapshotFile)}`,
);
if (available.length < demoDefinitions.length) {
  // eslint-disable-next-line no-console
  console.log("Not shown on the site:");
  for (const demo of demoDefinitions) {
    const result = results.get(demo.id)!;
    if (result.status === "ok") continue;
    // eslint-disable-next-line no-console
    console.log(`  ${demo.host.padEnd(26)} ${result.status.padEnd(14)} ${result.note ?? ""}`);
  }
}
