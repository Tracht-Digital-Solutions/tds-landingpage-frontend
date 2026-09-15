#!/usr/bin/env node
/**
 * IndexNow — tell Bing and the other IndexNow engines (Yandex, Seznam, Naver,
 * Yep) which pages changed, instead of waiting for their next crawl. Bing's
 * index also feeds Copilot and ChatGPT search, so this is the quickest way for
 * a changed page to reach AI answers as well.
 *
 *   npm run indexnow -- --dry-run            list what would be sent, send nothing
 *   npm run indexnow                         every URL of the live sitemap
 *   npm run indexnow -- <url> [<url> …]      only these URLs
 *   npm run indexnow -- --sitemap=<url>      URLs from another sitemap (e.g. a local build)
 *
 * The key is the file `public/<key>.txt` whose content is its own name: the
 * proof of ownership IndexNow fetches from the site root. It is public by
 * design, not a secret — but it must be DEPLOYED before a submission, or every
 * engine answers 403.
 *
 * A manual command on purpose, never part of the build or the release: a
 * submission tells outside search engines about the live site, so it runs
 * after a deploy, by whoever deployed.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://tracht-digital.de";
const ENDPOINT = "https://api.indexnow.org/indexnow";
/** The protocol's limit per request. */
const MAX_URLS = 10_000;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const sitemap = args.find((arg) => arg.startsWith("--sitemap="))?.slice("--sitemap=".length);
const explicit = args.filter((arg) => !arg.startsWith("--"));

function fail(message) {
  console.error(`indexnow: ${message}`);
  process.exit(1);
}

/** The one `public/<32 hex>.txt` that contains its own name. */
function findKey() {
  const dir = join(process.cwd(), "public");
  const keys = readdirSync(dir)
    .filter((name) => /^[a-f0-9]{32}\.txt$/.test(name))
    .map((name) => ({ key: name.slice(0, -4), content: readFileSync(join(dir, name), "utf8").trim() }))
    .filter((file) => file.content === file.key);
  if (keys.length !== 1) fail(`expected exactly one key file public/<key>.txt, found ${keys.length}`);
  return keys[0].key;
}

async function sitemapUrls(location) {
  const res = await fetch(location, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) fail(`${location} answered ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replace(/&amp;/g, "&"));
}

const key = findKey();
const urls = [...new Set(explicit.length > 0 ? explicit : await sitemapUrls(sitemap ?? `${SITE}/sitemap-0.xml`))];

// IndexNow rejects a request whose URLs are not all on the key's host (422).
const foreign = urls.filter((url) => {
  try {
    return new URL(url).origin !== SITE;
  } catch {
    return true;
  }
});
if (foreign.length > 0) fail(`not on ${SITE}:\n  ${foreign.join("\n  ")}`);
if (urls.length === 0) fail("no URLs to submit");
if (urls.length > MAX_URLS) fail(`${urls.length} URLs; IndexNow takes at most ${MAX_URLS} per request`);

const payload = {
  host: new URL(SITE).host,
  key,
  keyLocation: `${SITE}/${key}.txt`,
  urlList: urls,
};

console.log(`${urls.length} URL(s) for ${payload.host}, key file ${payload.keyLocation}`);
for (const url of urls) console.log(`  ${url}`);

if (dryRun) {
  console.log("\n--dry-run: nothing sent.");
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(30_000),
});
const meaning =
  {
    200: "accepted",
    202: "accepted, key verification still pending",
    400: "bad request",
    403: "key not valid — is the key file deployed?",
    422: "a URL is not on the host, or the key does not match it",
    429: "too many requests — try again later",
  }[res.status] ?? "unexpected answer";
console.log(`\nIndexNow answered ${res.status}: ${meaning}`);
if (res.status !== 200 && res.status !== 202) process.exit(1);
