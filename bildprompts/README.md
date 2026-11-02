# Bildprompts für tracht-digital.de

Prompts für eine neue, einheitliche Bildserie. Sie ersetzt alle generierten Bilder der Webseite.

**Bleiben unverändert:** Demos (`public/demos`), Referenzen (`public/references`), Designstudien (`public/designstudien`), eigene Projekte (`public/projects`), Zertifikate (`public/zertifikate`), die Vorschau der Visitenkarte (`images/business-card.webp`), das Portrait (`images/portrait`), Logos.

## Dateien

| Datei | Inhalt | Motive |
|---|---|---|
| [01-hero-und-abschnitte.md](01-hero-und-abschnitte.md) | Hero, Wieso ich, Kontakt, Erstgespräch | 4 |
| [02-leistungskacheln.md](02-leistungskacheln.md) | Die fünf Kacheln auf der Startseite (neu) | 5 |
| [03-leistungsseiten.md](03-leistungsseiten.md) | Leistungsseiten, zugleich Ratgeber-Titelbilder | 5 |
| [04-ratgeber.md](04-ratgeber.md) | Titelbilder im Ratgeber | 8 |

## So wird ein Prompt zusammengesetzt

Motiv + **Stilblock** + **Ausschlüsse** (beide unten) + das Format des Motivs. Prompts und Blöcke sind englisch, weil Bildmodelle damit am verlässlichsten arbeiten.

### Stilblock

> Editorial photograph for a German digital studio that serves small businesses. Calm, precise, tactile and honest. Natural daylight from one side with soft, clean shadows. Warm ivory and sand surfaces, oak wood, matte paper. Colour accents only from this palette, used sparingly on real objects: deep navy #050F68, bordeaux #820933, coral pink #FF7A9A, a small touch of ochre #B9772A. Built from a few large, simple shapes with generous quiet space. Modern small-studio or workshop setting in Germany, not a corporate office. Realistic optics, 35–50 mm lens, natural depth of field, fine natural texture.

### Ausschlüsse

> No text, no letters, no numbers, no logos, no watermark. No readable screens: every display is off, turned away or out of focus. No recognisable faces and no eye contact: hands, backs and cropped figures only. No handshakes, no suits, no stock-photo poses, no holograms, no glowing lines, no neon, no robots. No gradient backgrounds, no colour washes, no vignette, no lens flare, no HDR look, no clutter.

## Regeln der Seite

- **Keine Verläufe:** Die Seite hat keine Gradients mehr. Ein Bild darf keinen Farbverlauf als Gestaltungsmittel tragen.
- **Kein Beweisfoto:** Ein Motiv ist Illustration. Es darf nie wie ein echter Kunde, ein echtes Projekt oder ein echtes Ergebnis wirken.
- **Grundbilder liegen unter einem Schleier:** Hero und Wieso ich erscheinen sehr hell, Kontakt fast nur als Navy-Struktur. Deshalb zählen große Formen, feine Details gehen unter.
- **Die Kacheln sind Inhalt:** Sie stehen in voller Stärke und klein, das Motiv muss also in der Mitte sofort lesbar sein.

## Bilder einbauen

1. Original als PNG in der genannten Größe oder größer erzeugen und unter `stuff/03-Materialien/` ablegen, nicht in diesem Repo.
2. Als WebP (Qualität 82) und AVIF unter dem genannten Zielpfad in `public/images/` speichern. Bestehende Namen beibehalten, dann bleiben Links, Blog und Metadaten gültig.
3. `npm run images:variants` ausführen und die Einträge in `src/lib/imageCatalog.json` aktualisieren: Maße, Alt-Texte, Prüfsummen.
4. Die fünf neuen Kacheln in `src/lib/serviceProducts.ts` eintragen (`image`).
5. Alt-Texte stehen je Motiv dabei. Grundbilder bleiben dekorativ (`alt=""`).
