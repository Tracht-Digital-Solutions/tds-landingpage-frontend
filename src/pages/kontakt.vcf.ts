import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { APIRoute } from "astro";
import { siteConfig } from "~/lib/seo";

/**
 * Prerendered: the card is built from `siteConfig`, which only changes with a
 * deploy. It also reads a file relative to `process.cwd()`, which is the
 * project root during the build and a deploy tree without `src/` at runtime.
 */
export const prerender = true;

/**
 * Build-time vCard endpoint → `/kontakt.vcf`. Prerendered under
 * `output: "static"`, so it ships as a plain file (no runtime).
 *
 * Generated from `siteConfig` (src/lib/seo.ts), the single source of truth for
 * the business NAP — so the card never drifts from the Impressum / LocalBusiness
 * JSON-LD. One canonical, language-neutral card serves both the DE and EN pages.
 *
 * vCard 3.0 for the widest client support (iOS/Android/Outlook). The contact
 * aside links here without a `download` attribute: with the `text/vcard` MIME
 * (set here for dev, and via public/.htaccess in prod) mobile opens the
 * "add contact" flow while desktop downloads the file.
 */

/** Escape the vCard-special characters in a free-text value (RFC 6350 §3.4). */
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

/**
 * Fold a long content line to ≤75 octets with CRLF + single-space continuation
 * (RFC 2426 §2.6) — required so the base64 PHOTO parses in stricter clients
 * (Outlook) instead of being truncated.
 */
function fold(line: string): string {
  const out = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) {
    out.push(" " + line.slice(i, i + 74));
  }
  return out.join("\r\n");
}

/**
 * The contact portrait, embedded as a base64 JPEG so the card is self-contained
 * (many contacts apps don't fetch a remote PHOTO URI, and few render WebP). Read
 * at build time from the committed 400×400 JPEG; anchored to `process.cwd()` (the
 * project root during `astro build`) rather than `import.meta.url`, which ENOENTs
 * once Astro bundles the endpoint (same trap as the OG renderer). Missing file →
 * the card just ships without a photo.
 */
function photoLine(): string | null {
  try {
    const bytes = readFileSync(join(process.cwd(), "src/assets/portrait-vcard.jpg"));
    return fold(`PHOTO;ENCODING=b;TYPE=JPEG:${bytes.toString("base64")}`);
  } catch {
    return null;
  }
}

export const GET: APIRoute = () => {
  const { name, url, email, telephone, vatID, founder, socials } = siteConfig;
  const tel = telephone.replace(/\s/g, ""); // → E.164, e.g. +491788224022

  // Deliberately no ADR / GEO — the postal address is intentionally omitted from
  // the vCard (it's a private home address).
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Tracht;Julian;;;",
    `FN:${esc(founder.name)}`,
    `ORG:${esc(name)}`,
    `TITLE:${esc(founder.jobTitle)}`,
    `TEL;TYPE=WORK,VOICE:${tel}`,
    `EMAIL;TYPE=WORK,PREF:${email}`,
    `URL:${url}`,
    socials.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${socials.linkedin}` : "",
    socials.github ? `X-SOCIALPROFILE;TYPE=github:${socials.github}` : "",
    `NOTE:${esc(`USt-IdNr. ${vatID}`)}`,
    photoLine() ?? "",
    "REV:2026-07-11T00:00:00Z",
    "END:VCARD",
  ].filter((line) => line !== "");

  // RFC 6350 mandates CRLF line breaks; trailing CRLF closes the last line.
  const body = lines.join("\r\n") + "\r\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard;charset=utf-8",
      "Content-Disposition": 'inline; filename="julian-tracht.vcf"',
    },
  });
};
