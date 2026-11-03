# Ratgeber

Titelbilder der Artikel (`src/lib/editorialCovers.json`, gleiche Datei im Blog). Die Landingpage liefert sie auch für den Blog aus, die Namen bleiben deshalb.

**Zugleich im Shop und in Tools.** Vier Motive tragen auch die Affiliate-Kategorien des Shops, eines die Tools-Kategorie Sicherheit. Sie werden einmal erzeugt und zusätzlich exportiert:

| Motiv | Shop (`tds-shop-frontend/public/images/editorial/`) | Shop-Kategorien | Tools |
|---|---|---|---|
| `wifi` | `network-2026` | netzwerk, technik | – |
| `video` | `workplace-2026` | peripherie, ausstattung | – |
| `backup` | `backup-2026` | datensicherung | – |
| `mobile` | `mobile-2026` | mobiles-arbeiten | – |
| `keys` | – | – | `security-2026` (Kategorie Sicherheit) |

Im Shop erscheinen sie als Regalband über der Kategorie: volle Breite, nur 7–11rem hoch, Ausschnitt bei 45 % der Höhe. Das Motiv muss deshalb auch als flacher Streifen um die Bildmitte lesbar sein. In Tools: Karte 16:9 und Anleitung 2:1, beide mittig.

- **Format:** 3:2, mindestens 1440 × 960
- **Verwendung:** Artikelkarten und Artikelkopf, in voller Stärke
- **Aufbau:** Motiv mittig, ein klarer Gegenstand pro Bild
- **Pfad:** `public/images/editorial/<name>-2026.webp`
- **Blog-Altlasten:** `tds-blog-frontend/public/covers/` enthält drei Cover aus 2026-06 (`drei-prozesse-automatisierung`, `individuelle-software-kosten`, `warum-ich-nicht-skaliere`, 4:3, 1200 × 900). Nur ersetzen, wenn die Artikel noch veröffentlicht sind; Motive am Ende dieser Datei.
- **Bleiben:** `pi-imager-android-2026` und `wparted-2026` (seit 0.95) zeigen eigene Projekte und werden nicht neu erzeugt. Die übrigen Artikel nutzen Leistungsbilder, siehe [03-leistungsseiten.md](03-leistungsseiten.md).

## power — Stromausfall und Überspannung

- **Alt:** „Steckerleiste mit Überspannungsschutz auf einem Holzboden." / „A surge-protected power strip on a wooden floor."

> A matte white surge-protected power strip with two plugged-in cables on a light oak floor beneath a desk, one small unlit indicator lamp. A navy cable curves away in a clean line. Calm and orderly.

## mobile — Mobiles Arbeiten

- **Alt:** „Ausgeschalteter Laptop, Notizbuch und Ladegerät in einer Tasche." / „A switched-off laptop, notebook and charger in a bag."

> A canvas work bag open on a train-window table, holding a closed laptop, a navy notebook, a compact charger and a neatly coiled cable. Soft daylight from the window, the landscape outside a calm blur.

## paper — Papierloses Büro

- **Alt:** „Leeres Regalbrett neben einem einzelnen Dokumentenscanner." / „An empty shelf beside a single document scanner."

> A compact document scanner on an oak sideboard, one blank sheet feeding in. Beside it an almost empty shelf with a single slim bordeaux binder where many used to stand, faint marks on the wood showing where they were.

## video — Videocall und Homeoffice

- **Artikel:** „besser-klingen-und-aussehen-im-videocall“ und „homeoffice-arbeitsplatz-einrichten“ teilen sich das Bild.

- **Alt:** „Schreibtisch mit Mikrofon, Kamera und Licht am Fenster." / „A desk with microphone, camera and window light."

> A tidy home office desk facing a window: a small desk microphone on a stand, a compact webcam on a closed laptop and a simple paper-shade lamp. Soft even light. A navy cushion on a plain chair. No people, no readable screen.

## keys — Passkeys und Sicherheitsschlüssel

- **Alt:** „Zwei Hardware-Sicherheitsschlüssel auf einem Schlüsselring." / „Two hardware security keys on a key ring."

> Two small matte hardware security keys without any marking on a simple brass key ring, lying on a navy felt mat on an oak desk beside an ordinary house key. Close but calm, sharp on the keys.

## backup — Datensicherung nach der 3-2-1-Regel

- **Alt:** „Drei Festplatten nebeneinander, eine davon in einer Schutzhülle." / „Three drives side by side, one in a protective case."

> Three plain external drives in a row on an oak shelf: two identical matte grey drives and a third in a bordeaux protective case ready to leave the building. Clear visual rhythm of two plus one. No labels.

## wifi — Büro-WLAN

- **Alt:** „Flacher WLAN-Zugangspunkt an einer hellen Bürodecke." / „A flat Wi-Fi access point on a pale office ceiling."

> A flat round white Wi-Fi access point mounted on a pale ceiling above a small office, seen from below at an angle. A clean line of cable duct leads away. Daylight on the wall, an oak shelf at the frame edge. One small navy accent on a pinned paper square without writing.

## inventory — Produktpflege und Webshop

- **Artikel:** „produktpflege-per-handy“ und „lohnt-sich-ein-webshop“
- **Auch:** Kopf der Plattformseiten WooCommerce und Shopware (`DetailHero`, 36 % unter Papierschleier). Deshalb das linke Drittel ruhig halten.

- **Alt:** „Versandkarton und Produkte auf einem Packtisch." / „A shipping box and products on a packing table."

> A packing table in a small shop's back room: an open plain cardboard box, a handmade ceramic cup being placed inside by a cropped hand, tissue paper and a roll of tape without print. Shelves softly out of focus behind. Box and hand sit centre-right, the left third is calm table and wall. Warm, honest, small-business scale.

## Optional: alte Blog-Cover

Nur erzeugen, wenn der Artikel noch online ist. Format 4:3, 1200 × 900, Ziel `tds-blog-frontend/public/covers/<slug>.webp`.

### drei-prozesse-automatisierung

- **Alt:** „Drei Papierstapel, einer davon zu einer schlanken Mappe gebündelt.“ / „Three paper stacks, one bundled into a slim folder.“

> Three tidy stacks of blank paper in a row on an oak desk. The third stack is already bundled into one slim ochre folder, visibly lighter than the other two. A pencil lies across the first stack. Centred. Accent: ochre.

### individuelle-software-kosten

- **Alt:** „Maßband und gefertigtes Holzteil neben einem Notizblock.“ / „A tape measure and a hand-made wooden part beside a notepad.“

> A carpenter's folding rule laid along a hand-made oak part on a workbench, a blank notepad with a navy pencil beside it. The feeling of measuring before building something made to fit. Centred. Accent: navy.

### warum-ich-nicht-skaliere

- **Alt:** „Ein einzelner Arbeitsplatz mit Werkzeug in Reichweite.“ / „A single workplace with tools within reach.“

> A single small workbench seen from the side: one chair, one lamp, a few well-kept tools within reach, a closed laptop. Deliberately one place for one person, nothing more. Calm and warm. Accent: bordeaux on one tool handle.
