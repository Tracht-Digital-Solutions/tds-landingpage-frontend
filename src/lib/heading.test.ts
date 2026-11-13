import { describe, expect, it } from "vitest";
import { headingText } from "./heading";

describe("headingText", () => {
  it("joins the two CMS parts and drops the closing full stop", () => {
    expect(headingText("Projekte und", "Referenzen.")).toBe("Projekte und Referenzen");
  });

  it("keeps a question mark", () => {
    expect(headingText("Womit fangen", "wir an?")).toBe("Womit fangen wir an?");
  });

  it("takes a single-part heading", () => {
    expect(headingText("Leistungen", "")).toBe("Leistungen");
    expect(headingText("  Ratgeber  ")).toBe("Ratgeber");
  });
});
