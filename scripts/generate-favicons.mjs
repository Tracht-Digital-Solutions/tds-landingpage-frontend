import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// This approved master is shared unchanged across the TDS frontend products.
// Optional output directory allows exporting the same assets for another site.
const master = fileURLToPath(new URL('../src/assets/branding/tds-favicon-master.png', import.meta.url));
const output = resolve(process.argv[2] ?? fileURLToPath(new URL('../public', import.meta.url)));
await mkdir(output, { recursive: true });
const art = await sharp(master).trim().png().toBuffer();
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const icon = (size) => sharp(art).resize(size, size, { fit: 'contain', background: transparent }).png().toBuffer();

const favicon = await icon(64);
await writeFile(resolve(output, 'favicon.png'), favicon);
await writeFile(resolve(output, 'favicon-tds-2026.png'), favicon);

// PNG-compressed ICO entries retain alpha and provide native small tab sizes.
const sizes = [16, 32, 48, 256];
const images = await Promise.all(sizes.map(icon));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((data, i) => {
  const entry = 6 + i * 16;
  header[entry] = sizes[i] === 256 ? 0 : sizes[i];
  header[entry + 1] = header[entry];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(data.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += data.length;
});
await writeFile(resolve(output, 'favicon.ico'), Buffer.concat([header, ...images]));

const square = async (size, inset) => sharp({
  create: { width: size, height: size, channels: 4, background: '#050F68' },
}).composite([{ input: await icon(size - inset * 2), left: inset, top: inset }]).png().toBuffer();
const apple = await square(180, 10);
await writeFile(resolve(output, 'apple-touch-icon.png'), apple);
if (process.argv.includes('--pwa')) {
  await mkdir(resolve(output, 'icons'), { recursive: true });
  await writeFile(resolve(output, 'icons/apple-touch-icon.png'), apple);
  await writeFile(resolve(output, 'icons/icon-192.png'), await icon(192));
  await writeFile(resolve(output, 'icons/icon-512.png'), await icon(512));
  // Maskable icons have an opaque full canvas and keep the mark in the safe circle.
  await writeFile(resolve(output, 'icons/maskable-512.png'), await square(512, 96));
}
console.log(`Exported approved TDS favicon and app icons to ${output}`);
