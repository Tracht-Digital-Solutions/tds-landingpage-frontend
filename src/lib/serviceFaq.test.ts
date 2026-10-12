import { describe, expect, it } from "vitest";

import { serviceFaq } from "./serviceFaq";
import { serviceDefinitions } from "./services";

describe("service page questions", () => {
  for (const service of serviceDefinitions) {
    for (const lang of ["de", "en"] as const) {
      it(`${service.id}/${lang}: three questions, answered in the first sentence, neutral voice`, () => {
        const items = serviceFaq(service.id, lang);
        expect(items).toHaveLength(3);
        for (const { q, a } of items) {
          expect(q.endsWith("?")).toBe(true);
          expect(a.length).toBeGreaterThan(40);
          // The service pages speak to nobody in particular (2026-10-12).
          if (lang === "de") expect(`${q} ${a}`).not.toMatch(/\b(du|dein\w*|dir|dich|Sie|Ihr\w*)\b/);
        }
      });
    }
  }
});
