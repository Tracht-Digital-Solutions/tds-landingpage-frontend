import { describe, expect, it } from "vitest";
import { parseContactDraft } from "./contactDraft";

/**
 * The hand-over from the service assistant to the contact form.
 *
 * It grew a second field (the suggested reason) after shipping as a bare
 * string, and a draft written to `sessionStorage` before that change is still
 * in the tab when the new form mounts. Losing it would drop what a visitor
 * had already answered, at the last step of the one flow the site asks them
 * to complete — so the old shape stays readable, and that is what these hold.
 */
describe("parseContactDraft", () => {
  it("reads the object the assistant sends now", () => {
    expect(parseContactDraft({ message: "Hallo", service: "web-presence" })).toEqual({
      message: "Hallo",
      service: "web-presence",
    });
  });

  it("reads a draft stored as JSON", () => {
    expect(parseContactDraft('{"message":"Hallo","service":"web-presence"}')).toEqual({
      message: "Hallo",
      service: "web-presence",
    });
  });

  it("still reads the bare string the old version stored", () => {
    expect(parseContactDraft("Hallo, ich brauche Hilfe.")).toEqual({
      message: "Hallo, ich brauche Hilfe.",
    });
  });

  it("drops an empty service rather than offering one", () => {
    expect(parseContactDraft({ message: "Hallo", service: "   " })).toEqual({ message: "Hallo" });
  });

  it("refuses anything without a message", () => {
    expect(parseContactDraft("")).toBeNull();
    expect(parseContactDraft("   ")).toBeNull();
    expect(parseContactDraft({ service: "web-presence" })).toBeNull();
    expect(parseContactDraft(null)).toBeNull();
    expect(parseContactDraft(42)).toBeNull();
  });

  it("treats malformed JSON as the text it is", () => {
    // A message a visitor typed that happens to start with a brace must not
    // vanish because it failed to parse.
    expect(parseContactDraft("{kein json")).toEqual({ message: "{kein json" });
  });
});
