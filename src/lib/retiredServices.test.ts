import { describe, expect, it } from "vitest";
import {
  getServiceBySlug,
  retiredServiceTarget,
  retiredServiceTargets,
  serviceDefinitions,
  serviceHref,
} from "./services";

/**
 * The withdrawn service URLs.
 *
 * These were indexed and linked before the catalog was cut to four, so they
 * answer with a 301 rather than the 404 the dynamic route would otherwise
 * produce. Two things can rot here and neither shows up on the page: a target
 * that stops existing (the redirect then points at a 404), and a retired slug
 * that gets reused by a new service (the redirect would then shadow a live
 * page, which is much worse — the service becomes unreachable).
 */
describe("retired service redirects", () => {
  const LANGS = ["de", "en"] as const;

  it("never shadows a slug the catalog still serves", () => {
    for (const lang of LANGS) {
      for (const slug of Object.keys(retiredServiceTargets[lang])) {
        expect(
          getServiceBySlug(lang, slug),
          `${lang}/${slug} is both retired and live`,
        ).toBeUndefined();
      }
    }
  });

  it("points every redirect at something this site actually renders", () => {
    const live = new Set<string>();
    for (const lang of LANGS) {
      live.add(lang === "de" ? "/#services" : "/en/#services");
      for (const service of serviceDefinitions) {
        live.add(serviceHref(service, lang));
      }
    }

    for (const lang of LANGS) {
      for (const [slug, target] of Object.entries(retiredServiceTargets[lang])) {
        expect(live.has(target), `${lang}/${slug} → ${target}`).toBe(true);
      }
    }
  });

  it("keeps both languages retiring the same set of services", () => {
    // A pair half-retired leaves one language 404ing while the other
    // redirects, which is exactly the kind of asymmetry hreflang punishes.
    expect(Object.keys(retiredServiceTargets.de)).toHaveLength(
      Object.keys(retiredServiceTargets.en).length,
    );
  });

  it("resolves only the slug retired for the requested language", () => {
    expect(retiredServiceTarget("de", "auftragsprogrammierung")).toBe(
      "/leistungen/individuelle-loesungen",
    );
    expect(retiredServiceTarget("en", "auftragsprogrammierung")).toBeUndefined();
    expect(retiredServiceTarget("de", "webauftritt")).toBeUndefined();
    expect(retiredServiceTarget("de", undefined)).toBeUndefined();
  });
});
