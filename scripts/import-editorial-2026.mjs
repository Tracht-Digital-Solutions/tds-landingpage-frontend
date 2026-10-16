import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const archive = '../stuff/03-Materialien/Bildserie-2026-10-16';
const assets = JSON.parse(await fs.readFile(path.join(archive, 'Prompts-und-Verwendung.json'), 'utf8'));
const records = [];
for (const asset of assets) {
  const folder = path.join(archive, asset.group);
  await fs.mkdir(folder, {recursive: true});
  const source = path.join(archive, asset.source);
  const target = path.join('public/images', asset.target);
  await fs.mkdir(path.dirname(target), {recursive: true});
  const isService = asset.group === 'Leistungen';
  const width = isService ? 1536 : asset.key === 'hero' ? 1642 : asset.group === 'Blog' ? 1440 : 1860;
  const height = isService ? 960 : asset.key === 'hero' ? 924 : asset.group === 'Blog' ? 960 : 840;
  await sharp(source).resize(width, height, {fit:'cover', position: 'centre', withoutEnlargement:true}).webp({quality:82}).toFile(target);
  await fs.copyFile(target, path.join(folder, `${asset.name}.webp`));
  if (isService) await sharp(target).resize({width:800}).webp({quality:82}).toFile(target.replace('.webp','-800.webp'));
  records.push({...asset, source: path.relative(archive,path.join(folder,`${asset.name}.png`)), bytes:(await fs.stat(target)).size});
}
await fs.writeFile(path.join(archive,'Prompts-und-Verwendung.json'), JSON.stringify(records,null,2)+'\n');
console.log(`${records.length} originals archived; web exports ${records.reduce((s,r)=>s+r.bytes,0)} bytes`);
