# Shop: Einstieg und Kategorien

Repo `tds-shop-frontend`, Komponente `src/components/Catalogue.astro`, Zuordnung `src/lib/editorialImages.ts`. Alle Bilder sind dekorativ (`alt=""` im Markup); die Alt-Texte unten gehen in `src/lib/imageCatalog.json` (ImageObject).

Bisher teilen sich die eigenen Kategorien Bilder aus anderen Serien (Webauftritt → `web`, SEO → `planning`, E-Mail → `documents`, Wartung → `backup`, Digitalisierung → `process`), und **Schulung hat gar keins**. Neu bekommt jede eigene Kategorie ein eigenes Motiv. Die Affiliate-Kategorien nutzen die Ratgeber-Motive aus [04](04-ratgeber.md).

- **Pfad:** `public/images/editorial/<id>-2026-{480,960,1440}.{webp,avif}`
- **Format:** 3:2, mindestens 1536 × 1024, Export 1440 × 960 (Einstieg: 16:9, 1440 × 810)
- **Rahmen:**
  - Kategorie oben im Katalog: 3:2 in voller Stärke, bis 384 px breit
  - „Bald im Shop“-Kacheln: 3:2, ein Viertel bis halbe Breite
  - Regalband über der Kategorie: volle Breite, nur 7–11rem hoch, Ausschnitt bei 45 % der Höhe
- **Aufbau:** Motiv mittig und flach gehalten, damit es auch als schmales Band um die Mitte lesbar bleibt. Oberes und unteres Drittel ruhig.
- **Serie:** Themen-Serie, kleine Betriebe als Szene, Licht von links.

## Code-Änderung in `editorialImages.ts`

```ts
const categories: Record<string, string> = {
  webauftritt: 'web', 'seo-sichtbarkeit': 'seo', 'e-mail-domain': 'email',
  'wartung-betrieb': 'maintenance', 'recht-datenschutz': 'legal',
  digitalisierung: 'digital', schulung: 'training', leistungspakete: 'packages',
  netzwerk: 'network', technik: 'network', peripherie: 'workplace', ausstattung: 'workplace',
  datensicherung: 'backup', 'mobiles-arbeiten': 'mobile',
};
```

`soonArtwork` auf die neuen Namen umstellen. `documents`, `planning` und `process` entfallen danach.

## Einstieg — `hero`

- **Format:** 16:9, Export 1440 × 810
- **Rahmen:** Oben im Katalog neben „Auf einen Blick“, ab Desktop leicht gedreht und klein (bis 384 px). Daher wenige große Formen.
- **Alt:** „Ausgewählte Leistungen und Arbeitsmittel für kleine Betriebe auf einer Werkbank.“ / „Selected services and work equipment for small businesses on a workbench.“

> A modest oak workbench in a small independent business, seen slightly from above. Arranged with care in the centre: a closed laptop, a slim navy folder, a compact backup drive, a small kraft parcel tied with string and a set of keys. Each object has space around it, like a selection rather than a display. Plain pale wall behind. No people. Accent: deep navy folder.

## Webauftritt — `web`

- **Alt:** „Laptop und Telefon von hinten, davor Layoutklötze aus Papier.“ / „A laptop and a phone from behind with paper layout blocks in front.“

> On an oak desk, an open laptop and a phone on a small stand, both seen from behind, and in front of them a few cut paper blocks of different sizes arranged like a page layout, one block navy. Building a web presence piece by piece. Centred. Accent: navy.

## SEO und Sichtbarkeit — `seo`

- **Alt:** „Ein Wegweiser aus Holz auf einem Schreibtisch.“ / „A small wooden signpost on a desk.“

> A small hand-made wooden signpost standing on an oak desk, its blank arms pointing in two directions, one arm painted bordeaux. Behind it a folded paper map without any labels. A clear sense of being found. Centred. Accent: bordeaux.

## E-Mail und Domain — `email`

- **Alt:** „Briefkasten mit leerem Namensschild an einer hellen Wand.“ / „A letterbox with a blank name plate on a pale wall.“

> A simple ivory metal letterbox mounted on a pale plaster wall beside a door frame, with a blank brass name plate and a few blank envelopes visible in the slot. A coral pink tag hangs from the small key in its lock. Centred, straight on. Accent: coral pink.

## Wartung und Betrieb — `maintenance`

- **Alt:** „Ölkännchen und Werkzeug neben einem Laptop auf der Werkbank.“ / „An oil can and tools beside a laptop on a workbench.“

> On a clean workbench, a closed laptop resting on a soft cloth, beside it a small brass oil can, a precision screwdriver and a folded maintenance log with blank lines. Regular care, nothing broken. Centred, slightly from above. Accent: ochre cloth.

## Recht und Datenschutz — `legal`

- **Alt:** „Kleine Messingwaage auf einem Regal neben Ordnern.“ / „A small brass balance on a shelf beside binders.“

> A small brass balance scale standing in equilibrium on a light oak shelf, beside it a short row of slim navy binders with blank spines. Calm daylight on a pale wall. Rules kept, nothing intimidating. Centred. Accent: navy.

## Digitalisierung — `digital`

- **Alt:** „Ein ordentlicher Büroplatz mit leerer Ablage und Laptop.“ / „A tidy office desk with an empty tray and a laptop.“

> A small office desk in a workshop: an empty wire letter tray, an open laptop seen from behind and an ochre ceramic cup. Clean surfaces, one plant at the edge. A desk where paperwork no longer piles up. Centred. Accent: ochre cup.

(Bewusst anders als die Produkte dieser Kategorie: kein Papier-Tablet-Paar, keine Zahnräder.)

## Schulung — `training`

- **Alt:** „Kleiner Besprechungstisch mit Notizbüchern und aufgeklapptem Laptop.“ / „A small meeting table with notebooks and an open laptop.“

> A small round oak table set for a short training session: two open blank notebooks, two pencils, a laptop turned away from the camera, two ceramic cups and a plant. Two cropped pairs of hands, one pointing to a notebook. Friendly, unhurried, at the customer's own desk. Accent: coral pink cup.

## Leistungspakete — `packages`

- **Alt:** „Sorgfältig gepacktes Paket mit Mappe, Prüfliste und Stift.“ / „A carefully packed box with a folder, a checklist and a pen.“

> An open plain cardboard box on an oak desk, neatly packed with a navy folder, a blank checklist card and a pencil, tissue paper folded around them. Everything a small business needs to get started, ready to hand over. Centred, slightly from above. Accent: bordeaux ribbon around the box.
