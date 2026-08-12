/**
 * Build-time fetch of the legal documents (AGB & co) uploaded in the admin
 * panel, from `tds-ext-website-cms-pkg`'s public read surface.
 *
 * Same model as `cms.ts`: the panel is the editing surface, a save fires a
 * rebuild, and this module bakes the result into the static `dist/`. Nothing
 * here runs in a visitor's browser — the PDF ships as a plain file.
 *
 * The graceful-fallback contract is stricter than `cms.ts`'s, because a legal
 * document that silently disappears is worse than a stale one: when the API is
 * unreachable, or no document has been uploaded yet, the endpoints serve the
 * committed copy in `src/assets/legal/`. So `/legal/agb.pdf` always resolves —
 * an API hiccup can make it out of date, never absent.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Resolved at build time from env, with the production default. */
const CONTENT_API_URL =
  (import.meta.env.PUBLIC_CONTENT_API_URL as string | undefined) ??
  "https://api.tracht-digital.de/content";

/** Metadata for one uploaded document, as `GET /content/legal` returns it. */
export interface LegalDocMeta {
  filename: string;
  sizeBytes: number;
  /** Free-text "Stand: 09/2025" set by the editor, or null. */
  versionLabel: string | null;
  updatedAt: string;
}

/** `{ agb: { de: {...}, en: {...} } }` */
export type LegalDocIndex = Record<string, Record<string, LegalDocMeta>>;

let indexCache: LegalDocIndex | null = null;

/**
 * Every uploaded document's metadata, fetched once per build. `{}` on any
 * failure or in demo mode — callers then fall back to the committed copy.
 */
export async function fetchLegalIndex(): Promise<LegalDocIndex> {
  if (import.meta.env.PUBLIC_DEMO_MODE === "true") return {};
  if (indexCache !== null) return indexCache;

  let docs: LegalDocIndex = {};
  try {
    const res = await fetch(`${CONTENT_API_URL}/legal`, { signal: AbortSignal.timeout(10_000) });
    if (res.ok) {
      const data = (await res.json()) as { docs?: LegalDocIndex };
      docs = data.docs ?? {};
    }
  } catch (err) {
    console.warn("[tds-landingpage] legal document index fetch failed, using committed fallback:", err);
  }
  indexCache = docs;
  return docs;
}

/** One document's metadata for a language, or null when none is uploaded. */
export async function legalDocMeta(key: string, lang: "de" | "en"): Promise<LegalDocMeta | null> {
  const index = await fetchLegalIndex();
  return index[key]?.[lang] ?? null;
}

/**
 * The committed fallback PDF for a document key. Anchored to `process.cwd()`
 * (the project root during `astro build`) rather than `import.meta.url`, which
 * ENOENTs once Astro bundles the endpoint — the same trap the OG renderer and
 * the vCard endpoint document.
 */
function fallbackBytes(key: string): Uint8Array | null {
  try {
    return readFileSync(join(process.cwd(), "src/assets/legal", `${key}.pdf`));
  } catch {
    return null;
  }
}

/**
 * The bytes to ship for a document: the uploaded PDF when the panel has one,
 * else the committed fallback. `null` only when neither exists, which for
 * `agb` cannot happen — the fallback is in the repository.
 *
 * Typed `Uint8Array` rather than `Buffer` because the value is handed straight
 * to a `Response`, and lib.dom's `BodyInit` does not accept Node's `Buffer`.
 */
export async function legalDocBytes(key: string, lang: "de" | "en"): Promise<Uint8Array | null> {
  if (import.meta.env.PUBLIC_DEMO_MODE !== "true" && (await legalDocMeta(key, lang)) !== null) {
    try {
      const url = new URL(`${CONTENT_API_URL}/legal/${key}.pdf`);
      url.searchParams.set("lang", lang);
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (res.ok) {
        const bytes = Buffer.from(await res.arrayBuffer());
        // A truthful PDF or nothing: an error page or an HTML SPA fallback
        // served with a 200 would otherwise be written out as "the AGB".
        if (bytes.subarray(0, 1024).includes("%PDF-")) return bytes;
        console.warn(`[tds-landingpage] /content/legal/${key}.pdf did not return a PDF — using committed fallback`);
      }
    } catch (err) {
      console.warn(`[tds-landingpage] legal document "${key}" fetch failed, using committed fallback:`, err);
    }
  }
  return fallbackBytes(key);
}

/** Reset the memoised index. Tests only. */
export function resetLegalCache(): void {
  indexCache = null;
}

/**
 * Page copy for the legal-document pages.
 *
 * TODO: promote to tds-shared-pkg (`t.legal`) on the next shared release —
 * kept local for now so this feature does not drag the landingpage's
 * `tds-shared` pin from ^0.14.0 across five unrelated minors. The existing
 * legal pages (impressum, datenschutz) inline their copy the same way.
 */
export const legalCopy = {
  de: {
    agbTitle: "Allgemeine Geschäftsbedingungen",
    agbShort: "AGB",
    agbDescription:
      "Allgemeine Geschäftsbedingungen von Tracht Digital Solutions — als Seite lesen oder als PDF herunterladen.",
    back: "← Zurück",
    download: "AGB als PDF herunterladen",
    viewerLabel: "AGB als PDF",
    // Shown where the browser will not render an embedded PDF (most phones).
    viewerFallback:
      "Ihr Browser kann das PDF nicht direkt anzeigen. Über die Schaltfläche oben öffnen bzw. laden Sie das Dokument herunter.",
    openInNewTab: "In neuem Tab öffnen",
  },
  en: {
    agbTitle: "Terms and Conditions",
    agbShort: "Terms",
    agbDescription:
      "Terms and Conditions of Tracht Digital Solutions — read them as a page or download the PDF.",
    back: "← Back",
    download: "Download the Terms as a PDF",
    viewerLabel: "Terms and Conditions as a PDF",
    viewerFallback:
      "Your browser cannot display the PDF inline. Use the button above to open or download the document.",
    openInNewTab: "Open in a new tab",
  },
} as const;
