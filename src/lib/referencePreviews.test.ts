import { describe, expect, it } from "vitest";
import { referenceCases } from "./references";
import {
  resolveSnapshotPreviews,
  type ReferencePreviewSnapshot,
} from "./referencePreviews";

/**
 * Publishing a picture of somebody else's website.
 *
 * The consent rule is the point of this file. A screenshot says more than a
 * link does, so it needs its own permission, and that permission has to be
 * checked where the picture is RESOLVED — not only in the sync script that
 * writes it. Otherwise a consent withdrawn after a capture would keep
 * rendering from the committed asset until someone remembered to delete it.
 */
describe("reference preview consent", () => {
  it("only ever allows a preview on a named case with a site", () => {
    for (const entry of referenceCases) {
      if (!entry.previewAllowed) continue;
      expect(entry.disclosure, entry.id).toBe("named");
      expect(entry.siteUrl, entry.id).toBeTruthy();
    }
  });

  it("gives every case an explicit decision", () => {
    // The field has no default on purpose: a missing one is a compile error,
    // not a silent `false` that nobody ever revisits.
    for (const entry of referenceCases) {
      expect(typeof entry.previewAllowed, entry.id).toBe("boolean");
    }
  });
});

describe("resolveSnapshotPreviews", () => {
  const named = {
    id: "named-case",
    services: ["web-presence"] as const,
    articleSlug: null,
    disclosure: "named" as const,
    siteUrl: "https://kunde.example/",
    previewAllowed: true,
    content: {} as never,
  };
  const shot = {
    status: "ok" as const,
    preview: "/references/named-case.webp",
    width: 1440,
    height: 900,
  };
  const snapshot: ReferencePreviewSnapshot = {
    previews: { "named-case": shot },
  };

  it("resolves a captured preview for a consenting named case", () => {
    expect(resolveSnapshotPreviews(snapshot, [named])).toEqual([
      { id: "named-case", src: shot.preview, width: 1440, height: 900 },
    ]);
  });

  it("withholds the picture the moment consent is withdrawn", () => {
    // The asset is still on disk and still in the snapshot. Only the case
    // changed, and that alone has to be enough.
    const withdrawn = { ...named, previewAllowed: false };
    expect(resolveSnapshotPreviews(snapshot, [withdrawn])).toEqual([]);
  });

  it("never previews an anonymised case", () => {
    const anonymous = {
      ...named,
      disclosure: "anonymous" as const,
      siteUrl: null,
      previewAllowed: true,
    };
    expect(resolveSnapshotPreviews(snapshot, [anonymous])).toEqual([]);
  });

  it("refuses an unrecognised or failed status rather than trusting it", () => {
    for (const status of ["unreachable", "not-allowed", "future-status"]) {
      const source = {
        previews: { "named-case": { ...shot, status: status as never } },
      };
      expect(resolveSnapshotPreviews(source, [named]), status).toEqual([]);
    }
  });

  it("renders nothing when the sync has never run", () => {
    expect(resolveSnapshotPreviews({ previews: {} }, [named])).toEqual([]);
    expect(resolveSnapshotPreviews({}, [named])).toEqual([]);
  });
});
