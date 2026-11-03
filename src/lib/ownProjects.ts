/**
 * Own projects on the showcase shelf — code-owned, like `demoCatalog.ts`.
 *
 * WParted is not client work, so it stays out of `references.ts`, whose section
 * says "Umgesetzt für Kunden". It stands on the shelf with the origin badge
 * "Eigenes Projekt": the program and its website are two pieces of work, so they
 * are two cards.
 *
 * What a card may say about the program follows WParted's own documentation: a
 * beta, an alternative to GParted, independent of it. The developer is named,
 * because he builds it as a private individual and not for this company.
 */
import type { Lang } from "./i18n";
import type { ServiceId } from "./services";

export interface OwnProject {
  id: string;
  /** Every card picture is 1440×900 (`DEMO_PREVIEW`), one per language. */
  image: Record<Lang, string>;
  href: Record<Lang, string>;
  /** Language of the destination, when it differs by page or is fixed. */
  hreflang: Record<Lang, string>;
  /** The service page this card is evidence for. */
  service: ServiceId;
  copy: Record<Lang, { title: string; kind: string; text: string; cta: string; alt: string; highlights?: { label: string; items: string[] } }>;
}

export const ownProjects: readonly OwnProject[] = [
  {
    id: "wparted",
    image: { de: "/projects/wparted-programm-de.webp", en: "/projects/wparted-programm-en.webp" },
    // The program's card leads to its website (2026-11-03, asked for); the
    // source code is linked from there.
    href: { de: "https://wparted.tracht-digital.de/", en: "https://wparted.tracht-digital.de/en/" },
    hreflang: { de: "de", en: "en" },
    service: "solutions",
    copy: {
      de: {
        title: "WParted",
        kind: "Software",
        text: "Freier Partitionsmanager für Windows 11, eine GParted-Alternative. Open Source, entwickelt von Tracht Digital Solutions. Beta: physische Datenträger bleiben gesperrt.",
        cta: "Zur WParted-Webseite",
        alt: "WParted mit Datenträgerkarte, Partitionsliste und einer ausstehenden Operation",
        highlights: {
          label: "Das Besondere",
          items: [
            "Läuft direkt unter Windows, ohne Installation und ohne Linux-Live-System",
            "Erst planen, dann anwenden; jeder Schritt wird zurückgelesen und geprüft",
            "Eigene Umsetzung von NTFS, exFAT und ext4, geprüft mit unabhängigen Werkzeugen",
          ],
        },
      },
      en: {
        title: "WParted",
        kind: "Software",
        text: "Free partition manager for Windows 11, a GParted alternative. Open source, developed by Tracht Digital Solutions. Beta: physical disks stay locked.",
        cta: "Visit the WParted website",
        alt: "WParted showing a disk map, a partition list and one pending operation",
        highlights: {
          label: "What is special",
          items: [
            "Runs directly on Windows, with no installation and no Linux live system",
            "Plan first, then apply; every step is read back and verified",
            "Own implementation of NTFS, exFAT and ext4, checked with independent tools",
          ],
        },
      },
    },
  },
  {
    id: "pi-imager-android",
    // The app's captures exist in German only, so both languages share the picture.
    image: { de: "/projects/pi-imager-android.webp", en: "/projects/pi-imager-android.webp" },
    href: { de: "https://github.com/jtracht/rpi-imager-android", en: "https://github.com/jtracht/rpi-imager-android" },
    hreflang: { de: "de", en: "de" },
    service: "solutions",
    copy: {
      de: {
        title: "Pi Imager für Android",
        kind: "App",
        text: "Freie Android-App, die Raspberry-Pi-Images ohne PC und ohne Root über USB-OTG schreibt und jeden Sektor prüft. Unabhängiges Open-Source-Projekt, bisher auf Emulatoren geprüft.",
        cta: "Quellcode ansehen",
        alt: "Pi Imager für Android auf Tablet und Handy, mit fertig vorbereitetem Image und Modellauswahl",
      },
      en: {
        title: "Pi Imager for Android",
        kind: "App",
        text: "Free Android app that writes Raspberry Pi images over USB OTG, with no PC and no root, and verifies every sector. Independent open-source project, tested on emulators so far.",
        cta: "View the source",
        alt: "Pi Imager for Android on tablet and phone, with a prepared image and the model picker (German interface)",
      },
    },
  },
  {
    id: "wparted-website",
    image: { de: "/projects/wparted-webseite-de.webp", en: "/projects/wparted-webseite-en.webp" },
    href: { de: "https://wparted.tracht-digital.de/", en: "https://wparted.tracht-digital.de/en/" },
    hreflang: { de: "de", en: "en" },
    service: "web-presence",
    copy: {
      de: {
        title: "WParted-Webseite",
        kind: "Webseite",
        text: "Die Projektseite zu WParted: zweisprachig, auf Suchmaschinen und KI-Antworten ausgerichtet und an die eigene Plattform angebunden.",
        cta: "Webseite ansehen",
        alt: "Startseite der WParted-Webseite mit dem Maskottchen Parti und einer Datenträgerleiste",
      },
      en: {
        title: "WParted website",
        kind: "Website",
        text: "The project page for WParted: in two languages, set up for search engines and AI answers, and connected to our own platform.",
        cta: "View the website",
        alt: "Home page of the WParted website with the mascot Parti and a disk bar",
      },
    },
  },
];
