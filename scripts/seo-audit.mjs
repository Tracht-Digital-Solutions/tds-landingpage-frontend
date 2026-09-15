/**
 * SEO and answer-engine audit for the public site — what a crawler reads.
 *
 *   npm run audit:seo -- http://127.0.0.1:4411
 *
 * Deliberately NO browser. Search engines render JavaScript late and many AI
 * crawlers not at all, so every check here runs against the raw server HTML a
 * plain request returns. What only a browser can see (overflow, focus, axe)
 * is `ux-audit.mjs`.
 *
 * It starts from `robots.txt` and the sitemap, exactly like a crawler, and for
 * every listed URL checks:
 *
 * - status 200, no `noindex`, `html[lang]`;
 * - title present, distinct, at most 65 characters; description present,
 *   distinct, 80–160 characters;
 * - exactly one `<h1>`; heading levels that do not skip (reported);
 * - canonical = the page's own URL; hreflang de/en/x-default present and
 *   reciprocal between the two language twins;
 * - Open Graph title, description and an image that answers as a PNG;
 * - JSON-LD that parses, with the types the page kind needs; a `WebPage`
 *   `dateModified` repeated by a visible `<time datetime>`, and an author link;
 * - every internal link resolves (4xx/5xx fail, redirects are reported);
 * - every `<img>` carries an `alt` attribute;
 * - detail pages: a lead paragraph, a byline to the "about" section, and — on
 *   pages with a decision table — at least one outside source;
 * - `robots.txt` admits the search and user agents of Google, Bing, OpenAI,
 *   Anthropic and Perplexity, and keeps `/install/` closed in every group;
 * - `llms.txt` names every page of the sitemap.
 *
 * Exit code 1 on a hard failure; warnings are printed for judgement.
 *
 * It only loads the site it is pointed at — never point it at an API, and
 * never at production from a development machine.
 */

const args = process.argv.slice(2);
const base = (args.find((arg) => !arg.startsWith("--")) ?? "http://localhost:4321").replace(/\/$/, "");
/** The origin the markup names in canonicals, alternates and the sitemap. */
const SITE = "https://tracht-digital.de";

const failures = [];
const warnings = [];
const fail = (where, message) => failures.push(`${where}: ${message}`);
const warn = (where, message) => warnings.push(`${where}: ${message}`);

const toLocal = (url) => url.replace(SITE, base);
const pathOf = (url) => new URL(url, SITE).pathname;

const decode = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

/** Attributes of one tag as a plain object. */
function attrs(tag) {
  const out = {};
  for (const match of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*"([^"]*)"/g)) {
    out[match[1].toLowerCase()] = decode(match[2]);
  }
  return out;
}

const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => attrs(m[0]));
const text = (fragment) => decode(fragment.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

async function get(url, { redirect = "manual" } = {}) {
  const res = await fetch(url, { redirect, headers: { "User-Agent": "tds-seo-audit" } });
  return res;
}

// ── robots.txt ────────────────────────────────────────────────────────────
const AGENTS = [
  "*",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

{
  const res = await get(`${base}/robots.txt`);
  if (res.status !== 200) {
    fail("robots.txt", `status ${res.status}`);
  } else {
    const body = await res.text();
    const groups = new Map();
    let current = [];
    let lastWasAgent = false;
    for (const raw of body.split(/\r?\n/)) {
      const line = raw.replace(/#.*$/, "").trim();
      if (!line) continue;
      const [key, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      if (/^user-agent$/i.test(key)) {
        if (!lastWasAgent) current = [];
        current.push(value);
        groups.set(value, groups.get(value) ?? []);
        lastWasAgent = true;
        continue;
      }
      lastWasAgent = false;
      for (const agent of current) groups.get(agent).push(`${key.toLowerCase()}:${value}`);
    }
    for (const agent of AGENTS) {
      const rules = groups.get(agent);
      if (!rules) {
        fail("robots.txt", `no group for ${agent}`);
        continue;
      }
      if (rules.includes("disallow:/")) fail("robots.txt", `${agent} is shut out of the whole site`);
      if (!rules.includes("disallow:/install/")) fail("robots.txt", `${agent} may crawl /install/`);
    }
    if (!/^Sitemap:\s*https:\/\/tracht-digital\.de\/sitemap-index\.xml/im.test(body)) {
      fail("robots.txt", "does not advertise the sitemap index");
    }
  }
}

// ── sitemap ───────────────────────────────────────────────────────────────
const indexRes = await get(`${base}/sitemap-index.xml`);
if (indexRes.status !== 200) {
  console.error(`sitemap-index.xml answered ${indexRes.status} — nothing to audit.`);
  process.exit(1);
}
const sitemapUrls = [...(await indexRes.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const pageUrls = [];
for (const sitemapUrl of sitemapUrls) {
  const res = await get(toLocal(sitemapUrl));
  if (res.status !== 200) {
    fail(sitemapUrl, `status ${res.status}`);
    continue;
  }
  pageUrls.push(...[...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
}
if (pageUrls.length === 0) fail("sitemap", "lists no page");

// ── pages ─────────────────────────────────────────────────────────────────
const pages = new Map();
const internalLinks = new Map(); // path -> first page linking to it
const imageUrls = new Set();

for (const url of pageUrls) {
  const path = pathOf(url);
  const res = await get(toLocal(url));
  if (res.status !== 200) {
    fail(path, `status ${res.status} for a URL listed in the sitemap`);
    continue;
  }
  const html = await res.text();
  const head = html.slice(0, html.indexOf("</head>") + 7);
  const metas = tags(head, "meta");
  const links = tags(head, "link");
  const meta = (key, value) => metas.find((m) => m[key] === value)?.content;

  const title = text(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description = meta("name", "description") ?? "";
  const robots = meta("name", "robots") ?? "";
  const canonical = links.find((l) => l.rel === "canonical")?.href ?? "";
  const alternates = Object.fromEntries(
    links.filter((l) => l.rel === "alternate" && l.hreflang).map((l) => [l.hreflang, l.href]),
  );
  const lang = attrs(html.match(/<html\b[^>]*>/i)?.[0] ?? "").lang ?? "";

  if (!lang) fail(path, "html has no lang");
  if (/noindex/i.test(robots)) fail(path, "listed in the sitemap but served noindex");

  if (!title) fail(path, "no <title>");
  else if (title.length > 65) fail(path, `title is ${title.length} characters: ${title}`);
  if (!description) fail(path, "no meta description");
  else if (description.length < 80 || description.length > 160) {
    fail(path, `description is ${description.length} characters: ${description}`);
  }

  const expectedCanonical = new URL(path, SITE).href;
  if (canonical !== expectedCanonical) fail(path, `canonical is ${canonical || "missing"}`);
  for (const key of ["de", "en", "x-default"]) {
    if (!alternates[key]) fail(path, `no hreflang ${key}`);
  }

  const ogImage = meta("property", "og:image");
  if (!meta("property", "og:title") || !meta("property", "og:description")) fail(path, "Open Graph title or description missing");
  if (!ogImage) fail(path, "no og:image");
  else imageUrls.add(ogImage);

  // Headings
  const body = html.slice(html.indexOf("<body"));
  const headings = [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: text(m[2]),
  }));
  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length !== 1) fail(path, `${h1s.length} <h1> elements`);
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i].level > headings[i - 1].level + 1) {
      warn(path, `heading skips from h${headings[i - 1].level} to h${headings[i].level} ("${headings[i].text.slice(0, 50)}")`);
    }
  }

  // Structured data
  const types = new Set();
  const nodes = [];
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]);
      const walk = (node) => {
        if (Array.isArray(node)) return node.forEach(walk);
        if (!node || typeof node !== "object") return;
        if (node["@graph"]) walk(node["@graph"]);
        const type = node["@type"];
        if (type) {
          nodes.push(node);
          for (const t of [].concat(type)) types.add(t);
        }
      };
      walk(data);
    } catch (error) {
      fail(path, `JSON-LD does not parse: ${error.message}`);
    }
  }

  const isHome = path === "/" || path === "/en/";
  const isDetail = /^\/(leistungen|en\/services)\/[^/]+$/.test(path);
  const need = isHome
    ? ["Organization", "Person", "WebSite", "WebPage", "FAQPage"]
    : isDetail
      ? ["WebPage", "Service", "BreadcrumbList"]
      : [];
  for (const type of need) if (!types.has(type)) fail(path, `JSON-LD lacks ${type}`);

  const webPage = nodes.find((n) => [].concat(n["@type"]).includes("WebPage"));
  if (webPage?.dateModified) {
    if (!html.includes(`datetime="${webPage.dateModified}"`)) {
      fail(path, `dateModified ${webPage.dateModified} is not shown as a <time> on the page`);
    }
  } else if (isDetail) {
    fail(path, "detail page without dateModified");
  }

  if (isDetail) {
    if (!/class="lead\b/.test(body)) fail(path, "no lead paragraph under the headline");
    if (!/href="(\/en)?\/#about"/.test(body)) fail(path, "no byline linking to the person behind the page");
    if (/<table\b/.test(body)) {
      const outside = [...body.matchAll(/<a\b[^>]*href="(https:\/\/[^"]+)"/g)]
        .map((m) => m[1])
        .filter((href) => !/tracht-digital\.de/.test(href));
      if (outside.length === 0) fail(path, "a decision table without an outside source");
    }
  }

  // Images
  for (const img of tags(body, "img")) {
    if (!("alt" in img)) fail(path, `<img src="${img.src}"> has no alt attribute`);
  }

  // Internal links
  for (const a of tags(body, "a")) {
    const href = a.href;
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/.test(href)) continue;
    let target;
    try {
      target = new URL(href, new URL(path, SITE));
    } catch {
      fail(path, `unparsable link ${href}`);
      continue;
    }
    if (target.origin !== SITE) continue;
    if (!internalLinks.has(target.pathname)) internalLinks.set(target.pathname, path);
  }

  const words = text(body.slice(body.indexOf("<main"), body.indexOf("</main>"))).split(" ").length;
  if (words < 300) warn(path, `only ${words} words in <main>`);

  pages.set(path, { title, description, alternates, words });
}

// ── across pages ──────────────────────────────────────────────────────────
const seen = (key) => {
  const map = new Map();
  for (const [path, page] of pages) {
    const value = page[key];
    if (!value) continue;
    if (map.has(value)) fail(path, `same ${key} as ${map.get(value)}`);
    else map.set(value, path);
  }
};
seen("title");
seen("description");

for (const [path, page] of pages) {
  for (const key of ["de", "en"]) {
    const twinPath = page.alternates[key] ? pathOf(page.alternates[key]) : null;
    if (!twinPath) continue;
    const twin = pages.get(twinPath);
    if (!twin) {
      fail(path, `hreflang ${key} points at ${twinPath}, which the sitemap does not list`);
      continue;
    }
    for (const k of ["de", "en", "x-default"]) {
      if (twin.alternates[k] !== page.alternates[k]) {
        fail(path, `hreflang ${k} is not reciprocal with ${twinPath}`);
      }
    }
  }
}

for (const [linkPath, from] of internalLinks) {
  const res = await get(`${base}${linkPath}`);
  if (res.status >= 400) fail(from, `links to ${linkPath}, which answers ${res.status}`);
  else if (res.status >= 300) warn(from, `links to ${linkPath}, a redirect to ${res.headers.get("location")}`);
}

for (const image of imageUrls) {
  const res = await get(toLocal(image));
  const type = res.headers.get("content-type") ?? "";
  if (res.status !== 200 || !type.startsWith("image/")) fail(pathOf(image), `og:image answers ${res.status} ${type}`);
}

{
  const res = await get(`${base}/llms.txt`);
  if (res.status !== 200) fail("llms.txt", `status ${res.status}`);
  else {
    const body = await res.text();
    for (const url of pageUrls) {
      if (!body.includes(url)) fail("llms.txt", `does not name ${url}`);
    }
  }
}

// ── report ────────────────────────────────────────────────────────────────
console.log(`Audited ${pages.size} pages, ${internalLinks.size} internal link targets, ${imageUrls.size} social images.`);
for (const [path, page] of pages) {
  console.log(`  ${path}  (${page.title.length}/${page.description.length} chars, ${page.words} words)`);
}
if (warnings.length > 0) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const message of warnings) console.log(`  · ${message}`);
}
if (failures.length > 0) {
  console.log(`\nFailures (${failures.length}):`);
  for (const message of failures) console.log(`  ✗ ${message}`);
  process.exit(1);
}
console.log("\nNo hard failures.");
