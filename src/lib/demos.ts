/**
 * The website demos shown on the home page and on the Webauftritt service page.
 *
 * Three parts, deliberately separated:
 *
 * 1. `demoCatalog.ts` — identity, order and URL. Code-owned, like
 *    `ServiceDefinition.slug`: the CMS may never name a host this site sends
 *    visitors to.
 * 2. `demoData.json` — what each demo *said about itself* the last time
 *    `npm run demos:sync` ran: title, description, favicon, screenshot. A
 *    committed snapshot, so rendering a page costs no screenshot and no HTML
 *    parse, and so nothing about a demo can be invented at runtime.
 * 3. `getDemos()` — that snapshot, filtered by a short live reachability probe.
 *
 * ### The rule this file exists to enforce
 *
 * A demo that is not available is not loaded and not shown. "Available" is
 * strict on purpose, because three quite different failures all look like a
 * working link from here:
 *
 * - the host answers, but with a hosting-panel placeholder rather than a site;
 * - the host answers over a certificate the visitor's browser rejects;
 * - the host was fine at sync time and is down now.
 *
 * The first two are decided by `scripts/demos-sync.ts` and frozen into the
 * snapshot; the third is decided here, per render generation. There is no
 * "show it anyway" path — a card that leads to a certificate warning or to
 * "Hier entsteht eine neue Webseite" costs more than an absent card.
 *
 * ### Why the import is `./contentCache` and not `./cache`
 *
 * The same trap `cms.ts` documents: `cache.ts` imports the service catalog to
 * build its route lists, so reaching the memo through it would close
 * `services.ts` → … → `cache.ts` → `services.ts`. That throws at module
 * evaluation and `astro check` cannot see it.
 */

import snapshot from "./demoData.json";
import { contentCache } from "./contentCache";
import { DEMO_PREVIEW, demoDefinitions, type DemoDefinition } from "./demoCatalog";
import type { Lang } from "./i18n";

export { DEMO_PREVIEW, demoDefinitions };
export type { DemoDefinition, DemoId } from "./demoCatalog";

/**
 * Why a demo is or is not presentable, as recorded by the sync script.
 *
 * Only `ok` renders. The rest stay distinct values rather than one boolean
 * because they call for different fixes — `tls-invalid` is a certificate task
 * in Plesk, `placeholder` is a "there is no site here yet" task — and
 * `npm run demos:sync` prints them straight back as that to-do list.
 */
export type DemoStatus =
  | "ok"
  | "placeholder"
  | "control-panel"
  | "tls-invalid"
  | "unreachable"
  | `http-${number}`;

export interface DemoSnapshotEntry {
  /** A {@link DemoStatus}, but typed loosely: the JSON is data, not code. */
  status: string;
  /** The site's own name. `null` when it never became presentable. */
  title: string | null;
  /** The site's own meta description. `null` when it has none — never invented. */
  description: string | null;
  /** The `lang` the demo declares, so the card can carry `hreflang`. */
  siteLang: string | null;
  /** Public path under `/demos/`, or `null`. */
  favicon: string | null;
  /** Public path under `/demos/`, or `null`. */
  preview: string | null;
  previewWidth: number | null;
  previewHeight: number | null;
  checkedAt: string | null;
}

export interface DemoSnapshot {
  generatedAt: string;
  demos: Record<string, DemoSnapshotEntry>;
}

/** One demo, resolved and safe to render. */
export interface ResolvedDemo {
  definition: DemoDefinition;
  title: string;
  description: string | null;
  siteLang: string | null;
  favicon: string | null;
  preview: string;
  previewWidth: number;
  previewHeight: number;
}

export const demoSnapshot = snapshot as DemoSnapshot;

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * The snapshot half of the decision: which demos were presentable at sync time.
 *
 * Pure and synchronous, so the rule is testable without a network. A card
 * needs a status of exactly `ok`, a title and a screenshot; anything else —
 * including an unknown status string from an outdated or hand-edited JSON — is
 * treated as unavailable. Refusing an unrecognised value rather than trusting
 * it is what stops a future status like `redirect-loop` from rendering as a
 * working card on an old build.
 */
export function resolveSnapshotDemos(
  source: DemoSnapshot = demoSnapshot,
  definitions: readonly DemoDefinition[] = demoDefinitions,
): ResolvedDemo[] {
  const resolved: ResolvedDemo[] = [];

  for (const definition of definitions) {
    const entry = source.demos?.[definition.id];
    if (!entry || entry.status !== "ok") continue;
    if (!isNonEmpty(entry.title) || !isNonEmpty(entry.preview)) continue;

    resolved.push({
      definition,
      title: entry.title.trim(),
      description: isNonEmpty(entry.description) ? entry.description.trim() : null,
      siteLang: isNonEmpty(entry.siteLang) ? entry.siteLang : null,
      favicon: isNonEmpty(entry.favicon) ? entry.favicon : null,
      preview: entry.preview,
      // A snapshot written before these fields existed still has to render at
      // the right aspect ratio rather than at 0×0.
      previewWidth: entry.previewWidth ?? DEMO_PREVIEW.width,
      previewHeight: entry.previewHeight ?? DEMO_PREVIEW.height,
    });
  }

  return resolved;
}

/** How long one demo gets to answer before it counts as down. */
const PROBE_TIMEOUT_MS = 3_000;

export type DemoProbe = (demo: ResolvedDemo) => Promise<boolean>;

/**
 * Is the demo answering right now, over a certificate a browser accepts?
 *
 * `HEAD` rather than `GET`: this asks whether the visitor's click will land,
 * not what it will land on — the snapshot already answered that. TLS
 * verification stays on, so an expired or self-signed certificate rejects the
 * request and the demo drops out. That is the intended behaviour, not a
 * limitation: a link a browser greets with a full-page warning is not a link.
 */
const defaultProbe: DemoProbe = async (demo) => {
  const res = await fetch(demo.definition.url, {
    method: "HEAD",
    redirect: "follow",
    signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
  });
  return res.ok;
};

/**
 * Drop every demo that does not answer, without letting one failure take the
 * page with it.
 *
 * `allSettled`, so a DNS error, a timeout or a rejected certificate removes
 * one card and nothing else. The probes run in parallel: five sequential 3 s
 * timeouts would put fifteen seconds in front of a cache-filling render.
 */
export async function filterReachable(
  demos: ResolvedDemo[],
  probe: DemoProbe = defaultProbe,
): Promise<ResolvedDemo[]> {
  if (demos.length === 0) return [];

  const results = await Promise.allSettled(demos.map((demo) => probe(demo)));
  return demos.filter((_, index) => {
    const result = results[index];
    return result !== undefined && result.status === "fulfilled" && result.value === true;
  });
}

export interface GetDemosOptions {
  snapshot?: DemoSnapshot;
  definitions?: readonly DemoDefinition[];
  probe?: DemoProbe;
  /** Skip the memo — the tests need every case to actually run. */
  cache?: boolean;
}

/**
 * The demos to render: the snapshot, filtered by a live probe.
 *
 * Memoised through the generation-scoped content cache so the home page and
 * the Webauftritt page share one round of probes per render, and so a cache
 * rebuild re-checks instead of replaying a verdict from server boot. That memo
 * is also this feature's latency: a demo that goes down disappears at the next
 * rebuild of the pages it appears on, not at the next visitor.
 *
 * In demo mode there is no outbound network worth spending, so the snapshot is
 * trusted as-is — the shortcut `fetchBlocks()` takes for the same reason.
 */
export async function getDemos(options: GetDemosOptions = {}): Promise<ResolvedDemo[]> {
  const resolved = resolveSnapshotDemos(options.snapshot, options.definitions);
  if (resolved.length === 0) return [];

  if (import.meta.env?.PUBLIC_DEMO_MODE === "true") return resolved;

  const run = () => filterReachable(resolved, options.probe);
  if (options.cache === false) return run();

  // Only the ids cross the memo. Caching the resolved objects would pin one
  // render's snapshot read into the next generation's result.
  const reachable = await contentCache.get("demos:availability", async () =>
    (await run()).map((demo) => demo.definition.id),
  );

  const ids = new Set<string>(reachable);
  return resolved.filter((demo) => ids.has(demo.definition.id));
}

/** Card microcopy that belongs to this site, not to the demo. */
export const demoUi: Record<Lang, { newTab: string; visit: string; hostLabel: string }> = {
  de: { newTab: "öffnet in neuem Tab", visit: "Demo ansehen", hostLabel: "Adresse" },
  en: { newTab: "opens in a new tab", visit: "View demo", hostLabel: "Address" },
};
