# Ablauf: neue Bildserie für alle Seiten

Schritt für Schritt, vom Erzeugen bis zum Release. 89 Motive für Landingpage, Shop, Tools und Blog, plus drei optionale Blog-Cover. Prompts in 01 bis 07, Stilblock, Akzente und Ausschlüsse in der [README](README.md).

Jedes Repo wird für sich geändert, geprüft und released (Workspace-Regel: ein Repo nach dem anderen).

## 1. Vorbereiten

1. [ ] Archivordner anlegen: `stuff/03-Materialien/Bildserie-<Datum>/` mit den Unterordnern `Landingpage`, `Ratgeber`, `Shop-Katalog`, `Shop-Produkte`, `Tools`. Originale kommen nie in ein Repo.
2. [ ] Stilblock und Ausschlüsse aus der README bereitlegen. Sie gehören unverändert an jeden Prompt, bei den Produkten zusätzlich der Serien-Satz aus [06](06-shop-produkte.md).
3. [ ] Probelauf mit drei Bildern: Kachel „Firmenwebsite“ (02), Shop-Kategorie „Schulung“ (05), Tools „Design“ (07). Licht, Eichenplatte, Kamerawinkel und Akzent prüfen. Erst dann die Serie.

## 2. Bilder erzeugen

Pro Motiv: Motivtext + Stilblock + Ausschlüsse + Format. Als PNG in der genannten Größe oder größer speichern, Dateiname = Zielname aus der Prompt-Datei. Eine Gruppe möglichst in einer Sitzung erzeugen, damit sie als Serie wirkt.

4. [ ] **Landingpage** ([01](01-hero-und-abschnitte.md)): `hero-editorial`, `why-me-editorial`, `contact-editorial`, `step-01` — 4
5. [ ] **Kacheln = Shop-Produkte** ([02](02-leistungskacheln.md)): Firmenwebsite, Onepager, Wartung, KI-Sichtbarkeit, Online-Formular — 5
6. [ ] **Leistungsseiten** ([03](03-leistungsseiten.md)): `01-beratung` bis `05-kundenportale` — 5
7. [ ] **Ratgeber** ([04](04-ratgeber.md)): `power`, `mobile`, `paper`, `video`, `keys`, `backup`, `wifi`, `inventory` — 8
8. [ ] **Shop-Katalog** ([05](05-shop-katalog.md)): `hero`, `web`, `seo`, `email`, `maintenance`, `legal`, `digital`, `training`, `packages` — 9
9. [ ] **Shop-Produkte** ([06](06-shop-produkte.md)), je Kategorie eine Sitzung:
   - [ ] Webauftritt — 6
   - [ ] SEO und Sichtbarkeit — 6
   - [ ] E-Mail und Domain — 7
   - [ ] Recht und Datenschutz — 7
   - [ ] Schulung — 7
   - [ ] Wartung und Betrieb — 6
   - [ ] Digitalisierung — 6
   - [ ] Leistungspakete — 5
10. [ ] **Tools** ([07](07-tools.md)): `hero`, `content`, `developer`, `design`, `marketing`, `media`, `business`, `compliance` — 8
11. [ ] Optional: drei alte Blog-Cover ([04](04-ratgeber.md#optional-alte-blog-cover)), nur wenn die Artikel noch online sind.

## 3. Jedes Bild prüfen

12. [ ] Kein Text, keine Ziffern, kein Logo, keine Markenfarbe, auch nicht klein im Hintergrund.
13. [ ] Kein lesbarer Bildschirm, kein erkennbares Gesicht.
14. [ ] Kein Farbverlauf, keine Vignette, kein Neon, nichts Futuristisches.
15. [ ] Genau ein Akzent, und es ist der angegebene.
16. [ ] Zuschnitt simulieren, auf den kleinsten Rahmen der Datei:
    - Landingpage-Kachel 1,2:1 und 3:1 mittig
    - Leistungsbild 21:9 oben
    - Shop-Regalband als flacher Streifen bei 45 %
    - Tools-Anleitung 2:1 mittig

    Das Motiv muss erkennbar bleiben.
17. [ ] Grundbilder bei 20–38 % Deckkraft unter dem Schleier ansehen: Die Fläche hinter dem Text bleibt ruhig.
18. [ ] Serien nebeneinander legen: Kacheln, eine Shop-Kategorie, Tools-Kategorien. Gleiche Kamerahöhe, gleiches Licht. Ein Ausreißer wird neu erzeugt.
19. [ ] Ein Shop-Bild passt zu Titel und Teaser der Leistung und ist von den anderen Bildern seiner Kategorie klar zu unterscheiden.
20. [ ] Kein Bild wirkt wie ein echter Kunde, ein echtes Projekt oder ein echtes Ergebnis.

## 4. Exportieren

Mit `sharp` (wie `scripts/import-editorial-2026.mjs`): auf Zielgröße schneiden (`fit: cover`, mittig), WebP Qualität 82 und AVIF, dazu die Breitenvarianten. XMP mit deutscher und englischer Beschreibung und `trainedAlgorithmicMedia` setzen.

21. [ ] **Landingpage** (`tds-landingpage-frontend/public/images/`):
    - `sections/hero-editorial` 1642 × 924, `sections/why-me-editorial` und `sections/contact-editorial` 1860 × 840
    - `process/step-01` 1280 × 720
    - `products/<name>` 1536 × 960 (neu, aus 02)
    - `services/<name>` 1536 × 960
    - `editorial/<name>-2026` 1440 × 960

    Varianten `-480`, `-800`, `-960`, `-1440` wie bei den vorhandenen Dateien; danach `npm run images:variants`.
22. [ ] **Shop-Produkte** (`tds-shop-frontend/public/images/products/<de-slug>`): 1440 × 960 plus `-480`, `-960`, `-1440`, jeweils WebP und AVIF. Die fünf Motive aus 02 zusätzlich unter ihrem Shop-Slug.
23. [ ] **Shop-Katalog** (`tds-shop-frontend/public/images/editorial/<id>-2026-{480,960,1440}`): die neun aus 05, dazu `network`, `workplace`, `backup`, `mobile` aus den Ratgeber-Motiven `wifi`, `video`, `backup`, `mobile` (04).
24. [ ] **Tools** (`tds-tools-frontend/public/images/editorial/<id>-2026-{480,960,1440}`): die acht aus 07, dazu `security` aus dem Ratgeber-Motiv `keys` (04).
25. [ ] **Blog:** nur die optionalen Cover unter `public/covers/`. Alles andere lädt der Blog von Landingpage und Shop.

## 5. Im Code eintragen

Je Repo, in dieser Reihenfolge:

**Landingpage** (`tds-landingpage-frontend`)

26. [ ] `src/lib/imageCatalog.json`: Maße, Bytes, Prüfsummen aller Varianten; neue Einträge für die fünf Kacheln; Alt-Texte aus 02 bis 04.
27. [ ] `src/lib/serviceProducts.ts`: `image` der fünf Kacheln auf `/images/products/<name>.webp`.
28. [ ] `public/images/process/step-02` bis `step-04` löschen, falls nichts mehr darauf zeigt.
29. [ ] `IMAGES.md`: kurzer Abschnitt zur neuen Serie (Datum, Archivordner, Anzahl).

**Shop** (`tds-shop-frontend`)

30. [ ] `src/lib/productImages.json`: alle 55 Leistungen mit beiden Slugs, Maßen und Alt-Texten aus 02 und 06; die 12 neuen (✚) ergänzen.
31. [ ] `src/lib/editorialImages.ts`: neue Zuordnung aus [05](05-shop-katalog.md#code-änderung-in-editorialimagests), `soonArtwork` umstellen.
32. [ ] `src/lib/imageCatalog.json`: Einträge für die neuen Kategoriebilder, `documents`, `planning`, `process` entfernen.
33. [ ] Alte Dateien `editorial/{documents,planning,process}-2026-*` löschen.

**Shop-Paket** (`tds-ext-shop-pkg`)

34. [ ] `docs/product-image-prompts.md` und `scripts/image-prompts.php` als veraltet markieren oder entfernen; das Feld `prompt` in den Seeds verweist künftig auf diesen Ordner. Prüfen, ob die Seeds noch das Platzhalterbild der Landingpage setzen und ob eine Migration die Titelbilder umstellen muss.

**Tools** (`tds-tools-frontend`)

35. [ ] `src/lib/imageCatalog.json`: Maße, Prüfsummen und Alt-Texte aus 07 (und `security` aus 04).

**Blog** (`tds-blog-frontend`)

36. [ ] `src/lib/productImages.json` mit dem Shop gleichziehen (12 neue Leistungen, je zwei Slugs).
37. [ ] `src/lib/editorialCovers.json` bleibt gleich, solange die Namen bleiben; sonst identisch zur Landingpage ändern.

## 6. Prüfen (je Repo)

38. [ ] Typprüfung, Tests und Build nach dem `AGENTS.md` des Repos (Landingpage: `npm run type-check`, `npm run test:run`, `npm run build`).
39. [ ] Lokale Vorschau bei 390 px und 1440 px, hell und dunkel:
    - Landingpage: Hero, Wieso ich, Kacheln, Erstgespräch, Kontakt, eine Leistungsseite, die Plattformseite WooCommerce
    - Shop: Katalog-Einstieg, jede Kategorie mit Regalband, eine Produktkarte und eine Produktseite je Kategorie, „Bald im Shop“
    - Tools: Katalog, eine Werkzeugseite je Kategorie mit Anleitung
    - Blog: ein Artikel mit Titelbild und einer mit `{{produkt:slug}}`
40. [ ] Landingpage zusätzlich `npm run audit:contrast` und `npm run audit:perf`.

## 7. Veröffentlichen

41. [ ] Reihenfolge: Landingpage (liefert Ratgeber-Bilder), dann Shop, Shop-Paket, Tools, Blog. Jeweils Commit, Push und Release über den Workflow des Repos; die Version nicht selbst erhöhen.
42. [ ] Nach jedem Deploy live prüfen, ob die neuen Bilder ausgeliefert werden (`?nocache=1`). Im Blog einen Artikel mit Titelbild und einen mit Produktkarte öffnen.
43. [ ] Originale, finale Prompts, WebP-Kopien und Prüfsummen im Archivordner vollständig ablegen.
