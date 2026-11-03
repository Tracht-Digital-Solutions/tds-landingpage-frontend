# Ablauf: neue Bildserie erzeugen und einbauen

Schritt für Schritt, von der Vorbereitung bis zum Release. Die Prompts stehen in den Dateien 01 bis 04, Stil- und Ausschlussblock in der [README](README.md).

## 1. Vorbereiten

1. [ ] Archivordner anlegen: `stuff/03-Materialien/Bildserie-<Datum>/` mit den Unterordnern `Heros-und-Abschnitte`, `Kacheln`, `Leistungen`, `Blog`. Originale kommen nie ins Repo.
2. [ ] Stilblock und Ausschlüsse aus der README bereitlegen. Sie gehören unverändert an jeden Prompt.
3. [ ] Zuerst ein Testbild erzeugen, am besten die Kachel „Firmenwebsite“. Prüfen, ob Licht, Eichenplatte und Farbakzent passen. Erst dann die Serie.

## 2. Bilder erzeugen

Pro Motiv: Motivtext + Stilblock + Ausschlüsse + Format des Motivs. Als PNG in der genannten Größe oder größer speichern, Dateiname = Zielname ohne Endung.

**Hero und Abschnitte** ([01](01-hero-und-abschnitte.md))

4. [ ] Hero, 16:9 → `hero-editorial`
5. [ ] Wieso ich, 2,2:1 → `why-me-editorial`
6. [ ] Kontakt, 2,2:1 → `contact-editorial`
7. [ ] Erstgespräch, 16:9 → `step-01`

**Leistungskacheln** ([02](02-leistungskacheln.md)). Alle fünf in einer Sitzung, damit sie als Reihe wirken.

8. [ ] Firmenwebsite → `firmenwebsite`
9. [ ] Onepager → `onepager`
10. [ ] Website-Wartung → `wartung`
11. [ ] KI-Sichtbarkeit → `ki-sichtbarkeit`
12. [ ] Online-Formular → `online-formular`

**Leistungsseiten** ([03](03-leistungsseiten.md)), 16:10

13. [ ] Kundenportale → `05-kundenportale-editorial`
14. [ ] Prozessoptimierung → `02-prozesse-editorial`
15. [ ] Beratung → `01-beratung-editorial`
16. [ ] Individuelle Lösungen → `03-loesungen-editorial`
17. [ ] Webauftritt → `04-webauftritt-editorial`

**Ratgeber** ([04](04-ratgeber.md)), 3:2

18. [ ] `power-2026`, `mobile-2026`, `paper-2026`, `video-2026`
19. [ ] `keys-2026`, `backup-2026`, `wifi-2026`, `inventory-2026`

`pi-imager-android-2026` und `wparted-2026` nicht neu erzeugen.

## 3. Jedes Bild prüfen

20. [ ] Kein Text, keine Ziffern, kein Logo, auch nicht klein im Hintergrund.
21. [ ] Kein lesbarer Bildschirm, kein erkennbares Gesicht.
22. [ ] Kein Farbverlauf, keine Vignette, kein Neon.
23. [ ] Genau ein Farbakzent aus der Palette, sparsam.
24. [ ] Zuschnitt simulieren: Bild auf den kleinsten Rahmen der Datei schneiden (z. B. Kachel 1,2:1 und 3:1 mittig, Leistungsbild 21:9 oben). Das Motiv muss erkennbar bleiben.
25. [ ] Grundbilder bei 32–38 % Deckkraft unter dem Schleier ansehen: Die Fläche hinter dem Text muss ruhig bleiben.
26. [ ] Kacheln nebeneinander legen: gleiche Kamerahöhe, gleiches Licht, gleiche Platte. Ein Ausreißer wird neu erzeugt.
27. [ ] Wirkt kein Bild wie ein echter Kunde oder ein echtes Ergebnis?

## 4. Exportieren

28. [ ] Jedes PNG mit `sharp` auf die Zielgröße schneiden (`fit: cover`, mittig) und als WebP mit Qualität 82 sowie als AVIF speichern. Zielgrößen: Hero 1642 × 924, Wieso ich und Kontakt 1860 × 840, Erstgespräch 1280 × 720, Kacheln und Leistungen 1536 × 960, Ratgeber 1440 × 960.
29. [ ] Ziele: `public/images/sections/`, `public/images/process/`, `public/images/products/` (neu), `public/images/services/`, `public/images/editorial/`. Bestehende Namen überschreiben, nicht umbenennen.
30. [ ] Breitenvarianten wie bisher anlegen: `-480`, `-800`, `-960`, `-1440` (soweit kleiner als das Original), jeweils WebP und AVIF. Vorbild sind die vorhandenen Dateien im selben Ordner.
31. [ ] `npm run images:variants` ausführen (Leistungsbilder, Portrait, Logos).
32. [ ] XMP-Kennzeichnung als KI-Bild (`trainedAlgorithmicMedia`) mit deutscher und englischer Beschreibung setzen, wie bei der Serie vom 2026-10-18.

## 5. Im Code eintragen

33. [ ] `src/lib/imageCatalog.json`: Maße, Bytes und Prüfsummen aller Varianten aktualisieren. Für die fünf Kacheln neue Einträge mit Alt-Texten aus [02](02-leistungskacheln.md) anlegen. Grundbilder bleiben ohne Alt-Text.
34. [ ] Alt-Texte der übrigen Motive mit den Texten in 03 und 04 abgleichen, weil sich das Motiv ändert.
35. [ ] `src/lib/serviceProducts.ts`: `image` der fünf Kacheln auf `/images/products/<name>.webp` umstellen.
36. [ ] `public/images/process/step-02` bis `step-04` löschen, falls nichts mehr darauf zeigt (`grep -rn "step-0" src`).
37. [ ] `editorialCovers.json` bleibt gleich, solange die Namen bleiben. Ändert sich ein Name, im Blog-Repo dieselbe Änderung machen.
38. [ ] `IMAGES.md` um einen kurzen Abschnitt zur neuen Serie ergänzen (Datum, Archivordner, Anzahl).

## 6. Prüfen

39. [ ] `npm run type-check` und `npm run test:run`.
40. [ ] `npm run build`.
41. [ ] Lokale Vorschau bei 390 px und 1440 px, hell und dunkel: Hero, Wieso ich, Kacheln, Erstgespräch, Kontakt, eine Leistungsseite, eine Plattformseite (WooCommerce).
42. [ ] `npm run audit:contrast` und `npm run audit:perf` auf der Vorschau.

## 7. Veröffentlichen

43. [ ] Commit, Push, Release über den Workflow des Repos (Version nicht selbst erhöhen).
44. [ ] Nach dem Deploy live prüfen, ob die neuen Bilder ausgeliefert werden (`?nocache=1`), auch im Blog bei einem Artikel mit Titelbild.
45. [ ] Originale, Prompts und WebP-Kopien im Archivordner vollständig ablegen.
