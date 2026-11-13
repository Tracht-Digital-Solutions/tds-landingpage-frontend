import { describe, expect, it } from "vitest";
import { canonicalUrl, shareTargets } from "./share";

describe("canonicalUrl", () => {
  it("drops a trailing slash except on the two roots", () => {
    expect(canonicalUrl("/leistungen/webauftritt/", "https://tracht-digital.de")).toBe(
      "https://tracht-digital.de/leistungen/webauftritt",
    );
    expect(canonicalUrl("/", "https://tracht-digital.de")).toBe("https://tracht-digital.de/");
    expect(canonicalUrl("/en", "https://tracht-digital.de")).toBe("https://tracht-digital.de/en/");
  });
});

describe("shareTargets", () => {
  it("shares the page's own URL, encoded, without any tracking parameter", () => {
    const url = "https://tracht-digital.de/projekte";
    for (const target of shareTargets(url, "de")) {
      expect(target.href).toContain(encodeURIComponent(url));
      expect(target.href).not.toMatch(/utm_|fbclid/);
    }
  });

  it("names the email link in the page's language", () => {
    expect(shareTargets("https://x.test/", "de").at(-1)?.label).toBe("E-Mail");
    expect(shareTargets("https://x.test/", "en").at(-1)?.label).toBe("Email");
  });
});
