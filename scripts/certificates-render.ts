/**
 * Rasterise the committed certificate PDFs into the WebP files the
 * qualifications page shows.
 *
 *   npm run certificates:render
 *
 * The certificates are displayed AS PICTURES — the document itself is the
 * evidence, so a visitor sees the paper rather than a retyped claim about it.
 * The PDFs under `src/assets/certificates/` are the source of truth and are
 * committed with the images they produce, so this is reproducible and a
 * replaced certificate is one `cp` plus one run.
 *
 * ### Why a browser
 *
 * `sharp` cannot read PDF — the prebuilt libvips has no PDF loader — and
 * poppler (`pdftoppm`) is not something this repository may assume is
 * installed. `playwright-core` and a Chromium are already here for the
 * screenshot syncs, and `pdfjs-dist` renders a page to a canvas in it.
 *
 * ### Why a local HTTP server and not `file://`
 *
 * `pdf.min.mjs` is an ES module, and Chromium blocks module imports over
 * `file://` as a cross-origin request from an opaque origin. A one-request
 * server on `127.0.0.1` costs four lines and makes the import an ordinary
 * same-origin one. Nothing here touches the network beyond that loopback —
 * `127.0.0.1` rather than `localhost`, which resolves to `::1` first on this
 * machine.
 *
 * Runs under plain Node (`tsx`), so it imports nothing from the render tree.
 */
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";
import sharp from "sharp";
import { writePreviewVariants } from "./capture-preview";
// No-import modules, shared with the page that renders what this writes.
import {
  CREDENTIAL_ASSET_DIR,
  CREDENTIAL_IMAGE,
  CREDENTIAL_PDF_DIR,
  CREDENTIAL_RENDER_SCALE,
} from "../src/lib/credentialMeta";

const root = process.cwd();
const pdfDir = path.join(root, CREDENTIAL_PDF_DIR);
const outDir = path.join(root, "public", CREDENTIAL_ASSET_DIR);

/**
 * The page pdf.js is loaded into.
 *
 * `renderPage` is put on `window` so `page.evaluate` can call it with one
 * certificate's bytes at a time — one browser, one module load, thirteen
 * renders.
 */
const HOST_PAGE = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>certificate render</title></head>
<body>
<script type="module">
  import * as pdfjs from "/pdf.min.mjs";
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  window.renderPage = async (base64, scale) => {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const loading = pdfjs.getDocument({ data: bytes });
    const doc = await loading.promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const context = canvas.getContext("2d");
    // A certificate is drawn on white paper; without this the transparent
    // canvas turns every unpainted pixel black in the WebP.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: context, viewport }).promise;
    // The LOADING TASK owns the worker's copy of the document; destroying the
    // document object is not the same thing and, in pdf.js 6, is not a method.
    await loading.destroy();
    return {
      width: canvas.width,
      height: canvas.height,
      data: canvas.toDataURL("image/png").slice("data:image/png;base64,".length),
    };
  };
  window.__pdfjsReady = true;
</script>
</body>
</html>`;

/** Serves the host page and the two pdf.js modules, and nothing else. */
async function startServer(): Promise<{ origin: string; close: () => Promise<void> }> {
  const modules = path.join(root, "node_modules/pdfjs-dist/build");

  const server = createServer(async (request, response) => {
    const url = request.url ?? "/";
    try {
      if (url === "/" || url.startsWith("/index")) {
        response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        response.end(HOST_PAGE);
        return;
      }
      if (/^\/pdf(\.worker)?\.min\.mjs$/.test(url)) {
        const body = await fs.readFile(path.join(modules, url.slice(1)));
        response.writeHead(200, { "content-type": "text/javascript; charset=utf-8" });
        response.end(body);
        return;
      }
      response.writeHead(404).end();
    } catch (error) {
      response.writeHead(500).end(String(error));
    }
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  return {
    origin: `http://127.0.0.1:${port}/`,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

async function main(): Promise<void> {
  const files = (await fs.readdir(pdfDir)).filter((name) => name.endsWith(".pdf")).sort();
  if (files.length === 0) throw new Error(`No certificate PDFs in ${CREDENTIAL_PDF_DIR}`);

  await fs.mkdir(outDir, { recursive: true });

  const server = await startServer();
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();
    await page.goto(server.origin, { waitUntil: "load" });
    await page.waitForFunction("window.__pdfjsReady === true", null, { timeout: 30_000 });

    for (const file of files) {
      const id = file.replace(/\.pdf$/, "");
      const base64 = (await fs.readFile(path.join(pdfDir, file))).toString("base64");

      const shot = await page.evaluate(
        ([data, scale]) =>
          (window as unknown as {
            renderPage: (d: string, s: number) => Promise<{ width: number; height: number; data: string }>;
          }).renderPage(data as string, scale as number),
        [base64, CREDENTIAL_RENDER_SCALE] as const,
      );

      if (shot.width !== CREDENTIAL_IMAGE.width || shot.height !== CREDENTIAL_IMAGE.height) {
        // Every certificate is the same US-Letter landscape page. One that is
        // not would silently render at a different size and break the card's
        // reserved box, so it stops the run instead.
        throw new Error(
          `${file}: rendered ${shot.width}×${shot.height}, expected ${CREDENTIAL_IMAGE.width}×${CREDENTIAL_IMAGE.height}`,
        );
      }

      const target = path.join(outDir, `${id}.webp`);
      await sharp(Buffer.from(shot.data, "base64")).webp({ quality: 88 }).toFile(target);
      const variants = await writePreviewVariants(target);

      // eslint-disable-next-line no-console
      console.log(`${id}  ${shot.width}×${shot.height}  +${variants.length} copies`);
    }
  } finally {
    await browser.close();
    await server.close();
  }
}

await main();
