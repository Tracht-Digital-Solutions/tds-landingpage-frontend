import { describe, expect, it } from "vitest";
import { readQuoteRequest } from "./quoteRequest";

describe("readQuoteRequest", () => {
  it("reads the draft and keeps its line breaks", () => {
    expect(readQuoteRequest("?anfrage=Guten%20Tag%0AOnepager")).toBe("Guten Tag\nOnepager");
  });

  it("is null without a usable text", () => {
    expect(readQuoteRequest("")).toBeNull();
    expect(readQuoteRequest("?anfrage=%20%20")).toBeNull();
  });

  it("drops control characters and caps the length", () => {
    expect(readQuoteRequest("?anfrage=a%00b")).toBe("ab");
    expect(readQuoteRequest(`?anfrage=${"x".repeat(3000)}`)).toHaveLength(2000);
  });
});
