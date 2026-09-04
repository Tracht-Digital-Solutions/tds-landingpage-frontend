/**
 * Screenshots of customer sites shown on reference cards.
 *
 * The same shape as `demos.ts` and for the same reason: a picture of a site is
 * only honest while that site still answers. The snapshot says what was
 * capturable at sync time; a live probe says whether it is still there. A
 * reference whose site has since gone dark loses its band and keeps its text,
 * rather than showing a photograph of something that no longer exists.
 *
 * The extra gate this has and the demos do not is consent. A demo is our own
 * site; a customer's is theirs, so `previewAllowed` on the case has to be true
 * as well — and it is checked HERE, not only in the sync script, so a stale
 * asset left in `public/` after a permission was withdrawn still cannot render.
 */
import { contentCache } from "./contentCache";
import { referenceCases, type ReferenceCase } from "./references";
import snapshot from "./referencePreviewData.json";
import { PREVIEW_SIZE } from "./referencePreviewMeta";

export interface ReferencePreviewEntry {
  status: "ok" | "unreachable" | "not-allowed";
  preview: string | null;
  width?: number;
  height?: number;
  capturedAt?: string;
}

export interface ReferencePreviewSnapshot {
  /** `null` in the committed empty snapshot: the sync has never run. */
  generatedAt?: string | null;
  previews?: Record<string, ReferencePreviewEntry | undefined>;
}

export interface ResolvedPreview {
  id: string;
  src: string;
  width: number;
  height: number;
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Which cases have a usable screenshot, by the snapshot alone.
 *
 * Pure and synchronous so the rule is testable without a network. Consent is
 * re-checked against the committed case rather than trusted from the JSON:
 * the snapshot is generated output, the case is the record of the decision.
 */
export function resolveSnapshotPreviews(
  source: ReferencePreviewSnapshot = snapshot as ReferencePreviewSnapshot,
  cases: readonly ReferenceCase[] = referenceCases,
): ResolvedPreview[] {
  const resolved: ResolvedPreview[] = [];

  for (const entry of cases) {
    if (!entry.previewAllowed) continue;
    if (entry.disclosure !== "named" || !entry.siteUrl) continue;

    const shot = source.previews?.[entry.id];
    if (!shot || shot.status !== "ok" || !isNonEmpty(shot.preview)) continue;

    resolved.push({
      id: entry.id,
      src: shot.preview,
      width: shot.width ?? PREVIEW_SIZE.width,
      height: shot.height ?? PREVIEW_SIZE.height,
    });
  }

  return resolved;
}

/** How long one site gets to answer before its preview is withheld. */
const PROBE_TIMEOUT_MS = 3_000;

export type PreviewProbe = (url: string) => Promise<boolean>;

const defaultProbe: PreviewProbe = async (url) => {
  const res = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
  });
  return res.ok;
};

export interface GetReferencePreviewsOptions {
  snapshot?: ReferencePreviewSnapshot;
  cases?: readonly ReferenceCase[];
  probe?: PreviewProbe;
  /** Skip the memo — the tests need every case to actually run. */
  cache?: boolean;
}

/**
 * A map of case id → preview, for the cards to look themselves up in.
 *
 * Memoised through the generation-scoped content cache, so the home page and
 * the service page share one round of probes per render. Only the ids cross
 * the memo, for the same reason as in `demos.ts`: caching the resolved objects
 * would pin one render's snapshot read into the next generation's result.
 */
export async function getReferencePreviews(
  options: GetReferencePreviewsOptions = {},
): Promise<Map<string, ResolvedPreview>> {
  const resolved = resolveSnapshotPreviews(options.snapshot, options.cases);
  if (resolved.length === 0) return new Map();

  const cases = options.cases ?? referenceCases;
  const urlFor = (id: string) => cases.find((entry) => entry.id === id)?.siteUrl ?? null;

  const run = async () => {
    const probe = options.probe ?? defaultProbe;
    const results = await Promise.allSettled(
      resolved.map((preview) => {
        const url = urlFor(preview.id);
        return url ? probe(url) : Promise.resolve(false);
      }),
    );
    return resolved.filter((_, index) => {
      const result = results[index];
      return result !== undefined && result.status === "fulfilled" && result.value === true;
    });
  };

  if (import.meta.env?.PUBLIC_DEMO_MODE === "true") {
    return new Map(resolved.map((preview) => [preview.id, preview]));
  }

  let live: ResolvedPreview[];
  if (options.cache === false) {
    live = await run();
  } else {
    const ids = new Set<string>(
      await contentCache.get("references:previews", async () =>
        (await run()).map((preview) => preview.id),
      ),
    );
    live = resolved.filter((preview) => ids.has(preview.id));
  }

  return new Map(live.map((preview) => [preview.id, preview]));
}

/**
 * The same previews, keyed by the customer's site address.
 *
 * The service detail page renders `ServiceReference` objects, which carry a
 * `siteUrl` but not the case id — the id is deliberately not part of the shape
 * the CMS can influence. The address is unique per case (a case has one site,
 * and `references.test.ts` forbids two cases sharing one), so it is a safe key.
 */
export async function getReferencePreviewsBySiteUrl(
  options: GetReferencePreviewsOptions = {},
): Promise<Map<string, ResolvedPreview>> {
  const byId = await getReferencePreviews(options);
  const cases = options.cases ?? referenceCases;

  const bySite = new Map<string, ResolvedPreview>();
  for (const entry of cases) {
    const preview = entry.siteUrl ? byId.get(entry.id) : undefined;
    if (entry.siteUrl && preview) bySite.set(entry.siteUrl, preview);
  }
  return bySite;
}
