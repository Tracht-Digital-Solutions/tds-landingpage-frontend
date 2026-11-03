# Bildprompts für alle TDS-Seiten

Prompts für eine neue, einheitliche Bildserie. Sie ersetzt **alle KI-generierten Bilder** auf Landingpage, Shop, Tools und Blog. Jedes Motiv ist auf seine Seite, sein Produkt oder seine Leistung zugeschnitten. Ein Motiv, das an mehreren Stellen erscheint, wird nur einmal erzeugt und in jedes Repo exportiert.

Stand: 2026-11-03. Geprüft gegen Landingpage 0.99.1, Shop-Frontend 0.20.0, Shop-Paket 0.6.9 (50 eigene Leistungen und 5 Pakete), Tools 0.51.0 und Blog 0.56.0. Formate, Zuschnitte und Deckkräfte stammen aus dem Code. Ändert sich ein Bildrahmen, hier mitziehen.

**Ablauf vom Erzeugen bis zum Release:** [ABLAUF.md](ABLAUF.md)

## Dateien

| Datei | Seite | Inhalt | Neu zu erzeugen |
|---|---|---|---|
| [01-hero-und-abschnitte.md](01-hero-und-abschnitte.md) | Landingpage | Hero, Wieso ich, Kontakt, Erstgespräch | 4 |
| [02-leistungskacheln.md](02-leistungskacheln.md) | Landingpage + Shop | Fünf Kacheln, zugleich Shop-Produktbilder | 5 |
| [03-leistungsseiten.md](03-leistungsseiten.md) | Landingpage + Blog | Leistungsseiten, zugleich Ratgeber-Titelbilder | 5 |
| [04-ratgeber.md](04-ratgeber.md) | Blog + Landingpage + Shop + Tools | Ratgeber-Titelbilder, zugleich Shop-Regale und Tools-Kategorie Sicherheit | 8 |
| [05-shop-katalog.md](05-shop-katalog.md) | Shop | Einstieg und ein Bild je eigener Kategorie | 9 |
| [06-shop-produkte.md](06-shop-produkte.md) | Shop + Blog | Ein Bild je Leistung (ohne die fünf aus 02) | 50 |
| [07-tools.md](07-tools.md) | Tools | Einstieg und Kategoriebilder | 8 |
| | | **Summe** | **89** |

## Wo die Bilder liegen

| Seite | Repo | Pfad | Katalog im Code |
|---|---|---|---|
| Landingpage | `tds-landingpage-frontend` | `public/images/{sections,process,products,services,editorial}/` | `src/lib/imageCatalog.json` |
| Ratgeber (Blog) | lädt vom Landingpage-Host | `public/images/editorial/`, `public/images/services/` | `src/lib/editorialCovers.json` (Landingpage **und** Blog, identisch) |
| Shop | `tds-shop-frontend` | `public/images/products/`, `public/images/editorial/` | `src/lib/productImages.json`, `src/lib/imageCatalog.json`, `src/lib/editorialImages.ts` |
| Shop-Produkte im Blog | lädt vom Shop-Host | – | `tds-blog-frontend/src/lib/productImages.json` (Spiegel des Shops) |
| Tools | `tds-tools-frontend` | `public/images/editorial/` | `src/lib/imageCatalog.json`, `src/lib/editorialImages.ts` |

**Bleiben unverändert** (keine KI-Bilder oder bewusst echt): Demos, Referenzen, Designstudien, eigene Projekte und ihre Titelbilder (`pi-imager-android-2026`, `wparted-2026`), Zertifikate, Visitenkarte, Portrait, Logos, Favicons, Händlerbilder der Affiliate-Produkte, das abstrakte Ersatz-Cover des Blogs.

**Veraltet:** `tds-ext-shop-pkg/docs/product-image-prompts.md` (flache Illustrationen, 16:10). Diese Serie ersetzt sie; die Datei wird im Shop-Paket entfernt oder auf diesen Ordner verwiesen.

## So wird ein Prompt zusammengesetzt

Motiv + **Stilblock** + **Ausschlüsse** + Format des Motivs. Prompts und Blöcke sind englisch, weil Bildmodelle damit am verlässlichsten arbeiten.

### Stilblock (für jedes Bild)

> Editorial photograph for a German digital studio that serves small businesses. Calm, precise, tactile and honest. Natural daylight from the left with soft, clean shadows. Warm ivory and sand surfaces, light oak wood, matte paper. Colour accents only on real objects and used sparingly. Built from a few large, simple shapes with generous quiet space. Modern small-studio, workshop or small-shop setting in Germany, not a corporate office. Realistic optics, 35–50 mm lens, natural depth of field, fine natural texture.

### Farbakzent

Jedes Motiv trägt **genau einen** Akzent, im Prompt als `Accent: …` angegeben. Erlaubt:

- Landingpage, Shop, Blog: deep navy `#050F68`, bordeaux `#820933`, coral pink `#FF7A9A`, ochre `#B9772A`
- Tools: die Farbe der Kategorie, weil die Karte in dieser Farbe getönt ist (siehe [07](07-tools.md))

Den Akzent als Farbbeschreibung in den Prompt schreiben, z. B. `Accent: one deep navy (#050F68) object.`

### Ausschlüsse (für jedes Bild)

> No text, no letters, no numbers, no logos, no brand marks, no watermark. No readable screens: every display is off, turned away or out of focus. No recognisable faces and no eye contact: hands, backs and cropped figures only. No handshakes, no suits, no stock-photo poses, no holograms, no glowing lines, no neon, no robots, no AI brains. No gradient backgrounds, no colour washes, no vignette, no lens flare, no HDR look, no clutter.

### Serien

Damit die Seiten ruhig wirken, teilen sich Gruppen dieselbe Einstellung:

- **Produkt-Serie** (02 und 06): dieselbe helle Eichenplatte, Kamera leicht von oben (etwa 35°), Licht von links, Motiv kompakt in der Bildmitte, rundherum ruhige Platte.
- **Grund-Serie** (01, 03, Shop-Einstieg, Tools-Einstieg): weite Aufnahme, große ruhige Flächen, Motiv an einer Seite.
- **Themen-Serie** (04, 05, 07): ein klarer Gegenstand pro Bild, mittig, Szene im kleinen Betrieb.

## Regeln

- **Keine Verläufe:** Kein Bild trägt einen Farbverlauf als Gestaltungsmittel.
- **Kein Beweisfoto:** Jedes Motiv ist Illustration. Es darf nie wie ein echter Kunde, ein echtes Projekt oder ein echtes Ergebnis wirken. Der Shop kennzeichnet die Produktbilder als KI-generierte Symbolbilder.
- **Keine Marken:** Microsoft, Google, WordPress und andere nur über neutrale Gegenstände andeuten, nie mit Logo, Farbe oder Form der Marke.
- **Grundbilder liegen unter einem Schleier:** Große Formen zählen, feine Details gehen unter.
- **Kacheln und Produktbilder sind Inhalt:** Sie stehen in voller Stärke und oft klein, das Motiv muss in der Mitte sofort lesbar sein.
- **Ein Bild, mehrere Rahmen:** Jede Datei nennt je Motiv, wo es noch steht und wie es dort zugeschnitten wird.
- **Alt-Texte** stehen je Motiv dabei (deutsch / englisch). Grundbilder bleiben dekorativ (`alt=""`).
