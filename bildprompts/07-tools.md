# Tools: Einstieg und Kategorien

Repo `tds-tools-frontend`, Zuordnung `src/lib/editorialImages.ts` (Kategorie → Bild), Katalog `src/lib/imageCatalog.json`. Ein Bild je Werkzeugkategorie; jedes Werkzeug zeigt das Bild seiner Kategorie.

- **Pfad:** `public/images/editorial/<id>-2026-{480,960,1440}.{webp,avif}`
- **Format:** 3:2, mindestens 1536 × 1024, Export 1440 × 960 (Einstieg: 16:9, 1440 × 810)
- **Rahmen:**
  - Werkzeugkarte im Katalog (`ToolCard.astro`): 16:9 mittig, bis 320 px breit, dekorativ; die Karte ist in der Kategoriefarbe getönt (22 %)
  - Anleitung unter dem Werkzeug (`ToolPage.astro`): 2:1, höchstens 20rem hoch, mit Alt-Text
- **Aufbau:** Ein Gegenstand, mittig, im mittleren Band der Höhe. Oberes und unteres Sechstel dürfen wegfallen.
- **Akzent:** die Farbe der Kategorie (aus `tds-shared`, helles Theme), damit Bild und Kartentönung zusammengehören. Nur auf einem Gegenstand, gedämpft.
- **Inhalt:** Werkzeuge laufen im Browser, ohne Upload und ohne Konto. Die Motive zeigen ruhige Handarbeit am eigenen Schreibtisch, nie Bildschirme mit Ergebnissen oder Versprechen.
- **Sicherheit** nutzt das Ratgeber-Motiv `keys` aus [04](04-ratgeber.md), Kategoriefarbe navy passt bereits.

## Einstieg und „Weitere“ — `hero`

- **Format:** 16:9, Export 1440 × 810
- **Verwendung:** Bild der Kategorie „Weitere“ (`other`) und allgemeines Vorschaubild
- **Alt:** „Aufgeräumter Schreibtisch mit Laptop und kleinem Werkzeug.“ / „A tidy desk with a laptop and small hand tools.“

> A tidy oak desk seen from the side at eye level: an open laptop seen from behind, and next to it a small set of everyday hand tools laid out on a cloth — a ruler, a pencil, scissors, a stamp, a magnifier. Small useful helpers, ready right away. Generous pale wall above. Accent: one muted grey-blue cloth (#5B6478).

## Inhalte — `content` (Texterkennung, Textwerkzeuge)

- **Kategoriefarbe:** teal `#0F766E`
- **Alt:** „Papierbogen, Füller und Lineal als Symbol für Text- und Dokumentwerkzeuge.“ / „A sheet of paper, a fountain pen and a ruler illustrating text and document tools.“

> A blank ivory sheet of paper on an oak desk, a fountain pen with a teal barrel lying across it, a steel ruler aligned with the edge and a small stack of index cards. Writing, counting and tidying text by hand. Accent: teal.

## Entwicklung — `developer` (JSON-Formatter, Entwicklerwerkzeuge)

- **Kategoriefarbe:** violet `#5B3FB0`
- **Alt:** „Tastatur und Feinwerkzeug als Symbol für Entwicklerwerkzeuge.“ / „A keyboard and precision tools illustrating developer tools.“

> A compact mechanical keyboard with blank keycaps on an oak desk, beside it a set of precision screwdrivers in a stand and a pair of fine tweezers, one tool handle violet. Precise, tidy, made for people who build. Accent: violet.

## Design — `design` (Kontrast-Checker, Designsystem-Studio)

- **Kategoriefarbe:** amber `#A85D12`
- **Alt:** „Farbmusterkarten im Fächer als Symbol für Design und Kontrastprüfung.“ / „A fan of colour swatch cards illustrating design and contrast checks.“

> A fan of blank paint swatch cards spread on an oak desk, mostly ivory, sand and navy, with one amber card raised slightly. A small black-and-white card lies beside the fan, as if comparing contrast. No printed text or numbers on the cards. Accent: amber.

## Marketing — `marketing` (QR-Code, UTM-Links, Visitenkarten)

- **Kategoriefarbe:** rose `#A4153F`
- **Alt:** „Visitenkarten, Briefumschlag und Stempel als Symbol für Marketingwerkzeuge.“ / „Business cards, an envelope and a stamp illustrating marketing tools.“

> A short stack of blank thick business cards, one rose-coloured on top, a plain envelope and a rubber stamp on an oak desk. Ready to hand out. No printed codes, no text. Accent: rose.

## Medien — `media` (Bilder und PDF komprimieren, umwandeln)

- **Kategoriefarbe:** cyan `#1F6F8B`
- **Alt:** „Kamera und Papierstapel im Klemmbinder als Symbol für Bild- und PDF-Werkzeuge.“ / „A camera and a clipped stack of paper illustrating image and PDF tools.“

> A compact camera lying on an oak desk beside a stack of blank paper held together by a cyan binder clip, and a few small photo prints showing only soft abstract tones. Pictures and documents made smaller and lighter. Accent: cyan.

## Büro — `business` (Stundenzettel, Etiketten, Anfahrtskosten)

- **Kategoriefarbe:** blue `#2F5FB0`
- **Alt:** „Stundenzettel, Etikettenbogen und Tischrechner als Symbol für Büro-Werkzeuge.“ / „A timesheet, a label sheet and a desk calculator illustrating office tools.“

> On an oak desk: a blank timesheet on a clipboard, a sheet of blank round labels, a desk calculator with blank keys and a blue pencil. The small everyday paperwork of a business. Accent: blue.

## Recht — `compliance` (Impressum, Datenschutz, Barrierefreiheitserklärung, KI-Kennzeichnung)

- **Kategoriefarbe:** green `#2F7D51`
- **Alt:** „Mappe mit Musterblatt und Füller als Symbol für Rechtstext-Generatoren.“ / „A folder with a template sheet and a pen illustrating legal text generators.“

> An open document folder with a green cover lying on an oak desk, a blank template sheet inside, a fountain pen beside it and a small stamp lying unused. Required pages filled in with care. Calm, not intimidating. Accent: green.
