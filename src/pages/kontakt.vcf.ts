import type { APIRoute } from "astro";
import { siteConfig } from "~/lib/seo";

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

export const GET: APIRoute = () => {
  const { name, url, email, telephone, vatID, founder, address, geo, socials } =
    siteConfig;
  const tel = telephone.replace(/\s/g, ""); // → E.164, e.g. +491788224022

  // ADR (v3): PO;ext;street;locality;region;postcode;country
  const adr = [
    "",
    "",
    esc(address.streetAddress),
    esc(address.addressLocality),
    esc(address.addressRegion),
    address.postalCode,
    "Deutschland",
  ].join(";");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Tracht;Julian;;;",
    `FN:${esc(founder.name)}`,
    `ORG:${esc(name)}`,
    `TITLE:${esc(founder.jobTitle)}`,
    `TEL;TYPE=WORK,VOICE:${tel}`,
    `EMAIL;TYPE=WORK,PREF:${email}`,
    `ADR;TYPE=WORK:${adr}`,
    `URL:${url}`,
    socials.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${socials.linkedin}` : "",
    socials.github ? `X-SOCIALPROFILE;TYPE=github:${socials.github}` : "",
    `GEO:${geo.latitude};${geo.longitude}`,
    `NOTE:${esc(`USt-IdNr. ${vatID}`)}`,
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
