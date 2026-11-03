# Shop: Produktbilder der eigenen Leistungen

Ein Symbolbild je Leistung. Quelle der Produkte: `tds-ext-shop-pkg/php/db/seed/own-*.php` (50 Leistungen) und die fünf Leistungspakete. Fünf Motive stehen in [02](02-leistungskacheln.md), weil sie auch auf der Landingpage als Kachel erscheinen; sie sind hier nur verwiesen.

**Neu:** 12 Leistungen haben bisher **kein** Bild (markiert mit ✚). Sie fallen heute auf den Platzhalter zurück.

- **Repo:** `tds-shop-frontend`
- **Pfad:** `public/images/products/<de-slug>.{webp,avif}` und `-480`, `-960`, `-1440`
- **Katalog:** `src/lib/productImages.json` (ein Eintrag je Leistung, mit beiden Slugs und Alt-Texten); der Blog spiegelt die Datei in `tds-blog-frontend/src/lib/productImages.json` für `{{produkt:slug}}`
- **Format:** 3:2, mindestens 1536 × 1024, Export 1440 × 960
- **Rahmen:**
  - Produktkarte: 4:3, Bild **ganz** gezeigt (`contain`) auf hellem Grund, 25–100 % Breite
  - Produktseite: 3:2 gefüllt, bis 60 % Breite
  - Blog-Ratgeber: als Produktkarte im Artikel
- **Aufbau:** Produkt-Serie (siehe README): dieselbe helle Eichenplatte, Kamera etwa 35° von oben, Licht von links, Motiv kompakt in der Mitte, ruhiger Rand ringsum. Kein Gegenstand berührt den Bildrand.
- **Kennzeichnung:** Der Shop schreibt unter das Bild, dass es ein KI-generiertes Symbolbild ist. XMP `trainedAlgorithmicMedia` setzen.
- **Akzent je Kategorie** (hält die Regale ruhig): Webauftritt navy, SEO bordeaux, E-Mail und Domain coral pink, Recht navy, Schulung coral pink, Wartung ochre, Digitalisierung ochre, Pakete bordeaux. Ausnahme: der Onepager behält coral pink aus 02, damit die Kachelreihe der Landingpage nicht zweimal navy trägt.

Jeder Prompt unten wird ergänzt um: Stilblock + Ausschlüsse + `Product series: same pale oak desk, camera about 35 degrees from above, daylight from the left, subject compact in the centre with quiet desk all around, nothing touching the frame edge. Landscape 3:2.`

---

## Webauftritt (Akzent navy)

### Onepager-Website — `onepager-website` / `one-page-website`

Motiv und Alt-Text: [02 → Onepager](02-leistungskacheln.md#onepager).

### Firmenwebsite bis 5 Seiten — `firmenwebsite-bis-5-seiten` / `business-website-up-to-5-pages`

Motiv und Alt-Text: [02 → Firmenwebsite](02-leistungskacheln.md#firmenwebsite).

### Landingpage für ein Angebot — `landingpage-fuer-ein-angebot` / `landing-page-for-one-offer`

- **Alt:** „Eine einzelne Karte mit einer farbigen Lasche als Symbol für eine Landingpage.“ / „A single card with one coloured tab illustrating a landing page.“

> One single blank ivory card standing upright in a small oak card stand, with one solid navy paper tab fixed at its lower centre like a single clear button. Nothing else on the desk except a pencil laid exactly parallel. One offer, one action. Accent: navy.

### Relaunch-Konzept — `relaunch-konzept` / `website-relaunch-plan`

- **Alt:** „Alter und neuer Papierbogen mit Markierungen als Symbol für ein Relaunch-Konzept.“ / „An old and a new sheet with markers illustrating a relaunch plan.“

> Two ivory sheets side by side: on the left an older sheet, slightly creased and yellowed, with three small navy paper markers placed on parts of it; on the right a fresh blank sheet with the same layout of empty boxes drawn in pencil. A ruler lies between them. Planning what stays, what goes and what is new. Accent: navy.

### Zweite Sprache für Ihre Website — `zweite-sprache-fuer-ihre-website` / `second-language-for-your-website`

- **Alt:** „Zwei gleiche Kartenstapel, verbunden durch eine Klammer, als Symbol für eine zweite Sprache.“ / „Two matching card stacks joined by a clip illustrating a second language.“

> Two identical neat stacks of blank ivory cards side by side, one stack with navy edges and one with natural edges, the top cards joined by a single brass clip that bridges both stacks. Same content, two versions. Accent: navy.

### Kontaktformular mit Spamschutz — `kontaktformular-mit-spamschutz` / `contact-form-with-spam-protection`

- **Alt:** „Briefablage und Sieb als Symbol für ein Kontaktformular mit Spamschutz.“ / „A letter tray and a sieve illustrating a contact form with spam protection.“

> A small oak letter tray holding a few neat blank envelopes, the top one navy. Beside it a fine brass kitchen sieve resting on a sheet of paper, with a few crumpled paper scraps caught outside it. Only the right messages get through. Accent: navy.

### Online-Terminbuchung einbinden — `online-terminbuchung-einbinden` / `online-booking-on-your-website`

- **Alt:** „Leerer Wochenplan mit einem markierten Feld neben einem Telefon.“ / „A blank weekly planner with one marked slot beside a phone.“

> A blank paper weekly planner grid without any numbers or words lying flat, one single slot covered by a small navy paper tab. A smartphone lies face-down beside it and a ceramic cup at the edge. A booked appointment, quietly in place. Accent: navy.

### Referenzseite anlegen ✚ — `referenzseite-anlegen` / `portfolio-page-setup`

- **Alt:** „Vier Fotoabzüge in einem Raster auf einer offenen Mappe.“ / „Four photo prints in a grid on an open portfolio.“

> An open navy linen portfolio folder lying flat, with four blank ivory photo prints arranged in a tidy two-by-two grid on it, one print lifted slightly at the corner by a cropped hand. The prints show only soft, abstract tones of wood and paper, no recognisable content. Showing finished work with pride. Accent: navy.

---

## SEO und Sichtbarkeit (Akzent bordeaux)

### Keyword-Plan für Ihre Leistungen — `keyword-plan-fuer-ihre-leistungen` / `keyword-plan-for-your-services`

- **Alt:** „Sortierte Karteikarten in drei Reihen als Symbol für einen Keyword-Plan.“ / „Index cards sorted into three rows illustrating a keyword plan.“

> Blank ivory index cards sorted into three short rows on the desk. At the head of each row stands one slim card, the first of them bordeaux, and a thin thread links each head card to its row. A pencil lies beside. Order in what customers search for. Accent: bordeaux.

### Einträge in Branchenverzeichnissen ✚ — `eintraege-in-branchenverzeichnissen` / `business-directory-listings`

- **Alt:** „Karteikasten mit mehreren gleichen, farbig markierten Karten.“ / „A card index box with several identical, colour-marked cards.“

> An open wooden card index drawer full of blank cards. At regular intervals five cards stand up slightly higher, all exactly alike with a bordeaux top edge: the same business entry, consistent everywhere. Seen from the front and slightly above. Accent: bordeaux.

### KI-Sichtbarkeit (GEO) verbessern — `ki-sichtbarkeit-geo-verbessern` / `improve-ai-visibility-geo`

Motiv und Alt-Text: [02 → KI-Sichtbarkeit](02-leistungskacheln.md#ki-sichtbarkeit).

### Technische SEO-Grundlagen umsetzen — `technische-seo-grundlagen` / `technical-seo-basics`

- **Alt:** „Wasserwaage und Winkel an einem Papierstapel als Symbol für technische SEO.“ / „A spirit level and a square against a paper stack illustrating technical SEO.“

> A small wooden spirit level lying on top of a neat stack of blank paper, a steel try square set against its edge, everything exactly straight and aligned. The bubble sits centred. The foundation is in order. Accent: bordeaux handle on the try square.

### Strukturierte Daten einbauen — `strukturierte-daten-einbauen` / `add-structured-data`

- **Alt:** „Sortierkasten mit Holzklötzen als Symbol für strukturierte Daten.“ / „A sorting tray with wooden blocks illustrating structured data.“

> A shallow wooden sorting tray with square compartments, each holding small plain wooden blocks sorted by shape and size, one compartment filled with bordeaux blocks. A cropped hand places the last block. Information sorted so a machine can read it. Accent: bordeaux.

### Ladezeit optimieren — `ladezeit-optimieren` / `website-speed-optimisation`

- **Alt:** „Stoppuhr ohne Ziffern neben einer Feder als Symbol für kurze Ladezeiten.“ / „A stopwatch without digits beside a feather illustrating fast loading.“

> A classic brass stopwatch with a blank dial and no digits lying on the desk, beside it a single light feather and, further back, a heavy grey stone. Light beats heavy. Accent: bordeaux strap on the stopwatch.

### Google Search Console einrichten — `google-search-console-einrichten` / `google-search-console-setup`

- **Alt:** „Handgezeichnetes Balkendiagramm ohne Zahlen neben einem Laptop.“ / „A hand-drawn bar chart without numbers beside a laptop.“

> A sheet of ivory paper with a simple hand-drawn chart of five rising bars, no axes, no numbers, no words, held flat by a small brass weight. One bar is coloured bordeaux. A closed laptop at the back edge and a pencil. Seeing how a site is found. Accent: bordeaux.

---

## E-Mail und Domain (Akzent coral pink)

### Domain und E-Mail einrichten — `domain-und-e-mail-einrichten` / `domain-and-email-setup`

- **Alt:** „Briefumschläge und Schlüssel mit Anhänger auf dem Schreibtisch.“ / „Envelopes and a key with a tag on the desk.“

> A small fan of blank ivory envelopes on the desk, a brass key with a coral pink tag without writing lying on top, and a closed laptop behind. One's own address, ready to use. Accent: coral pink.

### Microsoft 365 einrichten ✚ — `microsoft-365-einrichten` / `microsoft-365-setup`

- **Alt:** „Laptop, Kalenderblatt, Umschläge und Mappe auf einem Tablett.“ / „A laptop, calendar sheet, envelopes and a folder on one tray.“

> One shallow oak tray holding a closed laptop, a blank paper calendar sheet without numbers, a few envelopes and a slim folder, all aligned. Email, calendar and files in one place. No brand colours, no logos. Accent: coral pink folder.

### Google Workspace einrichten ✚ — `google-workspace-einrichten` / `google-workspace-setup`

- **Alt:** „Umschlag, Kalenderblatt und Mappe an einer Pinnwand.“ / „An envelope, a calendar sheet and a folder on a pin board.“

> A small cork pin board leaning against the wall on the desk, with one blank envelope, one blank calendar sheet and one slim folder pinned side by side with coral pink pins, a closed laptop in front. Shared mail, calendar and files for a team. No brand colours, no logos. Accent: coral pink.

### SPF, DKIM und DMARC einrichten — `spf-dkim-dmarc-einrichten` / `spf-dkim-dmarc-setup`

- **Alt:** „Versiegelter Umschlag neben einem Siegelstempel.“ / „A sealed envelope beside a seal stamp.“

> A single ivory envelope closed with a coral pink wax seal with a plain, blank surface, lying beside a brass seal stamp with an empty face. Mail that arrives and can be trusted. Accent: coral pink.

### E-Mail-Umzug zu neuem Anbieter — `e-mail-umzug` / `email-migration`

- **Alt:** „Gebündelte Briefe wandern aus einer alten Kiste in eine neue Box.“ / „Bundled letters moving from an old crate into a new box.“

> Bundles of blank envelopes tied with string being moved from an old wooden crate on the left into a clean new archive box on the right. A cropped hand holds one bundle in mid-transfer, its string coral pink. Nothing left behind. Accent: coral pink.

### Einheitliche E-Mail-Signaturen — `einheitliche-e-mail-signaturen` / `consistent-email-signatures`

- **Alt:** „Fünf gleich gestempelte Karten neben einem Stempel.“ / „Five identically stamped cards beside a stamp.“

> Five identical blank ivory cards in a straight row, each with the same small abstract coral pink stamp mark in the lower corner. The rubber stamp lies beside them. The same for the whole team. Accent: coral pink.

### Domain-Umzug zu neuem Anbieter — `domain-umzug` / `domain-transfer`

- **Alt:** „Ein Schlüssel wechselt von einem Haken zum nächsten.“ / „A key moving from one hook to the next.“

> A small oak key board with two brass hooks. A cropped hand moves a brass key on a coral pink tag from the left hook to the right one. Calm, no rush, nothing falls. Accent: coral pink.

---

## Recht und Datenschutz (Akzent navy)

### Impressum und Datenschutzerklärung einbinden — `impressum-und-datenschutz-einbinden` / `legal-notice-and-privacy-policy-setup`

- **Alt:** „Zwei Mappen in einem Briefhalter, eine Seite halb herausgezogen.“ / „Two folders in a letter holder, one page half pulled out.“

> Two slim navy document folders standing upright in a small oak letter holder, one blank page half pulled out of the front folder. Always within reach, easy to read. Accent: navy.

### Cookie-Banner einrichten — `cookie-banner-einrichten` / `cookie-consent-banner-setup`

- **Alt:** „Verschlossenes Keksglas mit Schleife.“ / „A closed biscuit jar tied with a ribbon.“

> A clear glass jar of plain round biscuits standing on the desk, its lid closed and held by a navy ribbon tied in a simple bow: opened only when asked. A small folded ivory card leans against it. Accent: navy.

### Barrierefreiheits-Check (BFSG) — `barrierefreiheits-check-bfsg` / `accessibility-check`

- **Alt:** „Lupe und Prüfliste mit abgehakten Feldern.“ / „A magnifier and a checklist with ticked boxes.“

> A large magnifying glass lying on a blank checklist sheet with a column of empty boxes, three of them ticked in navy pencil, and the pencil beside it. A careful review with clear priorities. Accent: navy.

### Barrierefreiheit verbessern — `barrierefreiheit-verbessern` / `improve-accessibility`

- **Alt:** „Holzmodell mit Rampe statt Stufe.“ / „A wooden model with a ramp instead of a step.“

> A desk-sized architectural model in light oak: a doorway with a single step, and a gentle new ramp placed beside the step. A carpenter's pencil and a small navy block lie next to it. Barriers removed. Accent: navy.

### Google Fonts lokal einbinden — `google-fonts-lokal-einbinden` / `host-google-fonts-locally`

- **Alt:** „Bleisatz-Lettern im eigenen Setzkasten.“ / „Metal type in one's own type case.“

> A small wooden type case drawer on the desk, filled with metal type blocks shown from the side so that no letter faces are visible. A cropped hand puts one block into its compartment. The navy-painted drawer front. One's own type, kept at home. Accent: navy.

### Externe Dienste prüfen — `externe-dienste-pruefen` / `external-services-check`

- **Alt:** „Schnüre mit Anhängern führen aus einer Holzkiste, daneben eine Lupe.“ / „Strings with tags leading out of a wooden box, a magnifier beside them.“

> A small oak box on the desk with several thin cords leading out of it towards the frame edge, each cord ending in a blank paper tag. One tag carries a navy dot. A magnifying glass lies beside the tags. Knowing where every connection goes. Accent: navy.

### Erklärung zur Barrierefreiheit einbinden — `erklaerung-zur-barrierefreiheit` / `accessibility-statement-setup`

- **Alt:** „Aufgeschlagenes Dokument auf einem Lesepult, davor eine Rückmeldekarte.“ / „An open document on a reading stand with a feedback card in front.“

> An open document with a plain navy cover resting on a small oak reading stand, its pages blank. In front lies an ivory reply card with a pencil. Openly stated, with a way to respond. Accent: navy.

---

## Schulung (Akzent coral pink) — alle ✚

### Website selbst pflegen: Einweisung ✚ — `website-selbst-pflegen-einweisung` / `maintain-your-website-yourself`

- **Alt:** „Zwei Hände an einem Laptop, eine zeigt, eine tippt.“ / „Two people's hands at a laptop, one pointing, one typing.“

> Two cropped pairs of hands at a laptop whose screen faces away from the camera: one hand rests on the keyboard, the other points helpfully towards it. A blank printed cheat sheet and a coral pink pen lie beside. Learning on one's own website. Accent: coral pink.

### KI im Büro: Praxis-Workshop ✚ — `ki-im-buero-workshop` / `ai-at-work-workshop`

- **Alt:** „Haftnotizen in Reihen, Notizbuch und geschlossener Laptop am Arbeitstisch.“ / „Sticky notes in rows, a notebook and a closed laptop on a work table.“

> A work table with rows of blank square sticky notes laid out in a simple grid, two of them coral pink, an open blank notebook, a pencil and a closed laptop. Everyday tasks sorted before trying a new tool. No robots, no glowing elements. Accent: coral pink.

### IT-Sicherheit für Mitarbeitende ✚ — `it-sicherheit-fuer-mitarbeitende` / `it-security-awareness-training`

- **Alt:** „Angelhaken auf einem Briefumschlag neben einem Schloss.“ / „A fishing hook on an envelope beside a padlock.“

> A single small fishing hook resting on a sealed blank ivory envelope, beside it a closed brass padlock. A coral pink thread runs from the hook. Recognising a phishing message at a glance. Calm, not scary. Accent: coral pink.

### Google-Unternehmensprofil selbst pflegen ✚ — `google-unternehmensprofil-selbst-pflegen` / `maintain-your-google-business-profile`

- **Alt:** „Leeres Ladenschild, Fotoabzug und fünf kleine Papiersterne.“ / „A blank shop sign, a photo print and five small paper stars.“

> On a shop counter: a small blank wooden shop sign, a blank instant photo print and five small coral pink paper stars laid in a row. A cropped hand adjusts the sign. Keeping one's own business profile up to date. No map pins, no brand colours. Accent: coral pink.

### Social-Media-Grundlagen für Betriebe ✚ — `social-media-grundlagen-fuer-betriebe` / `social-media-basics-for-businesses`

- **Alt:** „Wochenplan mit drei aufgelegten Fotoabzügen.“ / „A weekly planner with three photo prints laid on it.“

> A blank paper weekly planner without any numbers or words, with three small square instant photo prints placed in three of its slots, the prints showing only soft abstract tones. A coral pink pen lies beside. A simple plan for little time. Accent: coral pink.

### E-Mail-Postfach im Griff ✚ — `e-mail-postfach-im-griff` / `get-your-inbox-under-control`

- **Alt:** „Dreistöckige Briefablage, sortiert, das Eingangsfach leer.“ / „A three-tier letter tray, sorted, with the in-tray empty.“

> A three-tier oak letter tray: the top tier empty, the lower two holding neatly sorted blank envelopes, a coral pink clip on one bundle. A clear desk around it. An inbox that no longer overflows. Accent: coral pink.

### Microsoft 365 und Teams: Einführung ✚ — `microsoft-teams-einfuehrung` / `microsoft-teams-introduction`

- **Alt:** „Besprechungsecke mit Konferenzlautsprecher, Laptop und gemeinsamer Mappe.“ / „A meeting corner with a conference speaker, a laptop and a shared folder.“

> A small oak meeting table with a round conference speaker puck in the centre, a closed laptop, two cups and one shared folder lying open between two cropped pairs of hands. One place for chat, meetings and files. No brand colours, no logos. Accent: coral pink folder.

---

## Wartung und Betrieb (Akzent ochre)

### Website-Wartung für 3 Monate — `website-wartung-3-monate` / `website-maintenance-3-months`

- **Alt:** „Kleine Werkzeugtasche und ein Kalenderstreifen mit drei Feldern.“ / „A small tool pouch and a calendar strip with three squares.“

> A small, half-size canvas tool pouch with three precision screwdrivers laid out in front of it, and beside it a strip of paper with three empty squares, one already ticked in ochre pencil. Short-term care, no commitment. Accent: ochre.

### Website-Wartung für 12 Monate — `website-wartung-12-monate` / `website-maintenance-12-months`

Motiv und Alt-Text: [02 → Website-Wartung](02-leistungskacheln.md#website-wartung) (Akzent ochre, passend zur Kategorie).

### Sicherheits-Update für WordPress — `sicherheits-update-wordpress` / `wordpress-security-update`

- **Alt:** „Neues Vorhängeschloss mit Schlüssel, das alte liegt daneben.“ / „A new padlock with its key, the old one lying beside it.“

> A bright new brass padlock with its key standing on the desk, the old, scratched padlock lying open beside it. An ochre cloth beneath the new one. Brought up to date, safely. No brand marks. Accent: ochre.

### Website-Backup einrichten und testen — `backup-einrichten-und-testen` / `website-backup-setup-and-test`

- **Alt:** „Ein Laufwerk in einer offenen Schublade, ein zweites wird angeschlossen.“ / „One drive in an open drawer, a second being connected.“

> A small open oak drawer holding one plain external drive; on the desk a second identical drive being connected with a cable by a cropped hand, as if testing a restore. An ochre key rests on the drawer. Stored in a second place and actually tested. Accent: ochre.

### Website-Umzug zu neuem Hoster — `website-umzug-zu-neuem-hoster` / `website-move-to-new-host`

- **Alt:** „Umzugskarton mit eingewickeltem Laptop und Kabeln.“ / „A moving box with a wrapped laptop and cables.“

> An open sturdy cardboard moving box on the desk, carefully packed with a closed laptop wrapped in an ochre cloth and neatly coiled cables. A roll of plain tape beside it. Moving house without losing anything. Accent: ochre.

### Gehackte Website bereinigen — `gehackte-website-bereinigen` / `hacked-website-clean-up`

- **Alt:** „Eine Hand kehrt Späne von einer sauberen Holzplatte, daneben ein neues Schloss.“ / „A hand brushing shavings off a clean board, a new lock beside it.“

> A cropped hand with a soft ochre brush sweeping dark splinters and dust off a clean oak board into a small dustpan. A new closed padlock waits at the side. Cleaned, secured, back in order. Calm rather than alarming. Accent: ochre.

### HTTPS-Umstellung mit SSL-Zertifikat — `https-umstellung` / `https-switch-with-ssl`

- **Alt:** „Geschlossenes Vorhängeschloss an einer kleinen Holzkiste.“ / „A closed padlock on a small wooden box.“

> A small oak box with a brass hasp closed by a padlock, its key on an ochre tag lying in front. A sealed, protected connection. Accent: ochre.

---

## Digitalisierung (Akzent ochre)

### Online-Formular statt Papier ✚ — `online-formular-statt-papier` / `online-form-instead-of-paper`

Motiv und Alt-Text: [02 → Online-Formular](02-leistungskacheln.md#online-formular).

### Rechnungen digital schreiben — `rechnungen-digital-schreiben` / `digital-invoicing-setup`

- **Alt:** „Leerer Rechnungsblock neben Laptop und Rechner ohne Ziffern.“ / „A blank invoice pad beside a laptop and a calculator without digits.“

> A blank invoice pad with empty ruled lines, half its top sheet torn off and placed into a slim ochre document tray, a closed laptop and a desk calculator with blank keys beside it. The paper habit giving way. Accent: ochre.

### Digitale Ablage einrichten — `digitale-ablage-einrichten` / `digital-filing-system-setup`

- **Alt:** „Hängeregister mit gleichen Reitern, eine Hand zieht eine Mappe.“ / „Hanging files with matching tabs, a hand pulling one out.“

> An open filing drawer of identical hanging folders with blank ochre tabs in a perfect row. A cropped hand pulls one folder halfway out. Everyone finds everything. Accent: ochre.

### Anfragen automatisch als Ticket — `anfragen-automatisch-als-ticket` / `enquiries-as-tickets`

- **Alt:** „Tischglocke und aufgespießte Zettel.“ / „A desk bell and notes on a spike.“

> A brass counter bell and, next to it, a neat stack of identical blank paper slips on a desk spike, the top slip ochre. Every request caught, none lost. Accent: ochre.

### Kundendaten zusammenführen (CRM-Start) — `kundendaten-zusammenfuehren` / `customer-data-consolidation`

- **Alt:** „Verstreute Visitenkarten links, ein ordentlicher Karteikasten rechts.“ / „Scattered business cards on the left, a tidy card index on the right.“

> On the left a loose scatter of blank business cards and sticky notes, on the right one tidy card index box with the same cards neatly filed, an ochre divider among them. A cropped hand carries the last card across. Accent: ochre.

### Einen Arbeitsablauf automatisieren — `einen-ablauf-automatisieren` / `automate-one-workflow`

- **Alt:** „Zwei Zahnräder aus Holz greifen ineinander.“ / „Two wooden gears meshing together.“

> Two hand-made wooden gears meshing on the desk, a small ochre gear driving a larger natural one. A cropped hand has just let go. A task that now runs by itself. Accent: ochre.

### Passwortmanager für das Team — `passwortmanager-fuer-das-team` / `password-manager-for-your-team`

- **Alt:** „Offener Schlüsseltresor mit Schlüsseln an Anhängern.“ / „An open key safe with keys on tags.“

> A small steel key safe with a blank dial and its door open, several keys hanging inside on ochre tags without writing. Beside it a crumpled sticky note in a small wire basket. One shared vault instead of notes. Accent: ochre.

---

## Leistungspakete (Akzent bordeaux)

### Website-Check mit Maßnahmenliste — `website-check-mit-massnahmenliste` / `website-check-with-action-list`

- **Alt:** „Laptop von hinten, Lupe und kurze Prüfliste.“ / „A laptop from behind, a magnifier and a short checklist.“

> A slim open laptop seen from behind, a magnifying glass resting across a short blank checklist card with three empty boxes, one ticked in bordeaux. Diagnosing first, then a clear list. Accent: bordeaux.

### Digital-Check für Ihren Betrieb — `digital-check-fuer-ihren-betrieb` / `digital-check-for-your-business`

- **Alt:** „Klemmbrett mit Prüfliste auf einem Ladentisch.“ / „A clipboard with a checklist on a shop counter.“

> A clipboard with a blank checklist lying on the counter of a small shop, a bordeaux pen clipped to it, a till drawer and a closed laptop softly out of focus behind. Looking at the whole business once. Accent: bordeaux.

### Google-Unternehmensprofil einrichten — `google-unternehmensprofil-einrichten` / `google-business-profile-setup`

- **Alt:** „Leeres Ladenschild und eine Stecknadel auf einer gefalteten Karte.“ / „A blank shop sign and a pin on a folded map.“

> A small blank wooden shop sign leaning against the wall, in front of it a folded paper map without labels with one bordeaux map pin pushed in. Being found locally. No brand colours. Accent: bordeaux.

### Ablauf-Analyse für einen Arbeitsablauf — `ablauf-analyse-ein-arbeitsablauf` / `workflow-analysis-one-process`

- **Alt:** „Papierstreifen mit Kästchen und Pfeilen, ein Kästchen umkreist.“ / „A paper strip with boxes and arrows, one box circled.“

> A long strip of paper taped across the desk with simple pencil boxes connected by arrows, no words. One box is circled in bordeaux pencil: the step that costs the most time. Accent: bordeaux.

### Machbarkeitsprüfung Schnittstelle — `machbarkeitspruefung-schnittstelle` / `integration-feasibility-check`

- **Alt:** „Zwei unterschiedliche Stecker und ein Adapter dazwischen.“ / „Two different plugs with an adapter between them.“

> Two different plugs, one round and one square, lying a hand's width apart, and a cropped hand holding a small bordeaux adapter between them, checking whether they fit together. Accent: bordeaux.
