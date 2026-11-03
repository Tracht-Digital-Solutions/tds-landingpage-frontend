# Leistungskacheln auf der Startseite

Fünf neue Motive, je eins pro Produkt. Bisher teilen sich die Kacheln Bilder mit anderen Leistungen, die teils nicht zum Produkt passen.

**Zugleich Shop-Produktbilder.** Die fünf Kacheln sind Produkte des Shops. Jedes Motiv wird einmal erzeugt und doppelt exportiert: auf die Landingpage (16:10) und in den Shop als Produktbild (3:2, Dateiname = Shop-Slug, siehe [06](06-shop-produkte.md)).

- **Verwendung:**
  - Landingpage: `sections/Services.astro`, oben in der Kachel, in voller Stärke; darunter Typ und Titel auf massivem Navy
  - Shop: Produktkarte (4:3, ganz gezeigt auf hellem Grund) und Produktseite (3:2, gefüllt)
- **Format:** Erzeugen in 3:2, mindestens 1536 × 1024. Export Landingpage 1536 × 960 (mittig geschnitten), Shop 1440 × 960.
- **Aufbau:** Zugeschnitten wird mittig (`object-fit: cover`, ohne Ausrichtung). Ab Tablet stehen die Kacheln in einer Reihe, 3:4 hoch; das Bild bekommt davon etwa 1,2:1, rund 200 Pixel breit. Auf dem Handy stehen zwei Kacheln nebeneinander (ebenfalls etwa 1,2:1), die erste Kachel liegt quer und zeigt nur einen Streifen von etwa 3:1. Das Motiv sitzt deshalb kompakt in der Bildmitte, höchstens im mittleren Drittel der Höhe.
- **Unterkante:** Das Bild stößt direkt an die Navy-Fläche. Der untere Rand bleibt ruhig und eher hell, kein dunkler Schatten, der mit dem Navy verschwimmt.
- **Serie:** Gleiche Kamerahöhe (leicht von oben), gleiche Eichenplatte, gleiches Licht von links. Nebeneinander sollen die Bilder wie eine Reihe wirken. Jedes trägt genau einen Farbakzent.
- **Einbau:** Pfad in `src/lib/serviceProducts.ts` eintragen. Bis dahin zeigen die Kacheln die Leistungsbilder (Firmenwebsite → Webauftritt, Onepager → Individuelle Lösungen, Wartung → Kundenportale, KI-Sichtbarkeit → Beratung, Online-Formular → Prozesse).

## Firmenwebsite

- **Ziel:** Landingpage `public/images/products/firmenwebsite.webp` · Shop `firmenwebsite-bis-5-seiten`
- **Alt:** „Fünf Papierbögen, angeordnet wie die Seiten einer Website." / „Five sheets of paper arranged like the pages of a website."

> Five blank ivory paper sheets laid out on an oak desk like a website sitemap: one sheet on top, four in a row below, connected by thin navy thread. A navy pencil rests beside them. Slightly from above, centred. Accent: navy.

## Onepager

- **Ziel:** Landingpage `public/images/products/onepager.webp` · Shop `onepager-website`
- **Alt:** „Ein langer Papierstreifen, gefaltet in fünf Abschnitte." / „One long strip of paper folded into five sections."

> One single long strip of ivory paper running vertically through the frame across an oak desk, softly folded into five equal sections, like one page you scroll through. A small coral pink paper clip holds the top section. Slightly from above, centred. Accent: coral pink.

## Website-Wartung

- **Ziel:** Landingpage `public/images/products/wartung.webp` · Shop `website-wartung-12-monate`
- **Alt:** „Geordnetes Feinwerkzeug in einer Rolle auf einem Eichentisch." / „Tidy precision tools in a roll on an oak desk."

> A neatly unrolled ochre canvas tool roll on an oak desk holding small precision screwdrivers and tweezers in a perfect row, one screwdriver lifted out and lying in front of it next to a tiny brass screw. A sense of regular, careful care over a whole year. Slightly from above, centred. Accent: ochre.

## KI-Sichtbarkeit

- **Ziel:** Landingpage `public/images/products/ki-sichtbarkeit.webp` · Shop `ki-sichtbarkeit-geo-verbessern`
- **Alt:** „Ein Papierbogen unter einer Lupe, ein Satz ist markiert." / „A sheet of paper under a magnifying glass, one line highlighted."

> A brass magnifying glass resting on a stack of blank ivory index cards on an oak desk. Under the lens one single card stands out, marked with a solid bordeaux bookmark tab, the one source being found among many. No writing on any card. Slightly from above, centred. Accent: bordeaux.

## Online-Formular

- **Ziel:** Landingpage `public/images/products/online-formular.webp` · Shop `online-formular-statt-papier`
- **Alt:** „Ein Papierformular neben einem ausgeschalteten Tablet." / „A paper form beside a switched-off tablet."

> A blank printed paper form with empty ruled boxes and no words lying next to a matte, switched-off tablet on an oak desk, both the same size and perfectly parallel. A rubber stamp lies aside, out of use. A small ochre pencil rests on the paper. Slightly from above, centred. Accent: ochre.
