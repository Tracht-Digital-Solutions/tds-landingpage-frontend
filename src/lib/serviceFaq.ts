import type { Lang } from "~/lib/i18n";
import type { ServiceId } from "~/lib/services";

/**
 * Three questions per service page (2026-10-12).
 *
 * For answer engines first: each answer's FIRST sentence answers the question
 * on its own, so it can be quoted without the page around it. The same items
 * render visibly (`DetailFaq.astro`) and as the page's `FAQPage` node — markup
 * and page cannot disagree.
 *
 * Code-owned, in the service pages' neutral voice (no "du", no "Sie"). No
 * price that is not already published on the page, no promise of a result.
 */
export interface ServiceFaqItem {
  q: string;
  a: string;
}

const FAQ: Record<ServiceId, Record<Lang, ServiceFaqItem[]>> = {
  panels: {
    de: [
      {
        q: "Was ist ein Verwaltungspanel?",
        a: "Ein Verwaltungspanel ist eine Weboberfläche, in der ein Betrieb Projekte, Aufgaben, Kunden und Unterlagen an einem Ort verwaltet. Team und Kunden erhalten eigene Zugänge mit passenden Rechten. Es läuft im Browser und auf dem Handy.",
      },
      {
        q: "Was lässt sich in einem Panel automatisieren?",
        a: "Wiederkehrende Schritte wie Erinnerungen, Status-Mails, Aufgaben nach festen Regeln oder das Ablegen von Unterlagen. Was automatisiert wird, ergibt sich aus den Abläufen des Betriebs.",
      },
      {
        q: "Ersetzt das Panel die Buchhaltungssoftware?",
        a: "Nein. Buchhaltung und Lohn bleiben in den dafür gemachten Programmen. Das Panel strukturiert Projekte, Kunden und Abläufe rund herum.",
      },
    ],
    en: [
      {
        q: "What is an admin panel?",
        a: "An admin panel is a web interface in which a business manages projects, tasks, customers and documents in one place. Team and customers get their own logins with suitable permissions. It runs in the browser and on the phone.",
      },
      {
        q: "What can be automated in a panel?",
        a: "Recurring steps such as reminders, status emails, tasks created by fixed rules or filing documents. What gets automated follows from the business's workflows.",
      },
      {
        q: "Does the panel replace accounting software?",
        a: "No. Accounting and payroll stay in the programs made for them. The panel structures the projects, customers and workflows around them.",
      },
    ],
  },
  process: {
    de: [
      {
        q: "Was bedeutet „Abläufe digitalisieren“?",
        a: "Abläufe digitalisieren heißt, Arbeit von Papier, Mails und Tabellen in passende digitale Werkzeuge zu verlagern. Typische Beispiele sind digitale Buchführung und ein Projektmanagementsystem. Auswahl, Einrichtung und die Einführung im Team gehören dazu.",
      },
      {
        q: "Welche Werkzeuge kommen infrage?",
        a: "Das hängt vom Betrieb ab. Für die Buchführung zählt, was die Kanzlei unterstützt; für Projekte, wie das Team arbeitet. Empfohlen wird erst nach dem Blick auf die bestehenden Abläufe.",
      },
      {
        q: "Übernimmt Tracht Digital Solutions die Buchführung?",
        a: "Nein. Eingerichtet wird die Technik: der Weg von Belegen und Rechnungen bis zur Kanzlei. Buchführung und Steuerberatung bleiben bei der Kanzlei.",
      },
    ],
    en: [
      {
        q: "What does “digitalizing workflows” mean?",
        a: "Digitalizing workflows means moving work from paper, emails and spreadsheets into suitable digital tools. Typical examples are digital bookkeeping and a project management system. Selection, setup and team onboarding are part of it.",
      },
      {
        q: "Which tools are an option?",
        a: "That depends on the business. For bookkeeping, what the accountant supports counts; for projects, how the team works. A recommendation comes only after looking at the existing workflows.",
      },
      {
        q: "Does Tracht Digital Solutions do the bookkeeping?",
        a: "No. What gets set up is the technology: the path of receipts and invoices to the accountant. Bookkeeping and tax advice stay with the accountant.",
      },
    ],
  },
  consulting: {
    de: [
      {
        q: "Was umfasst Beratung und Konzeption?",
        a: "Die Beratung klärt, was ein Betrieb digital braucht, was es kostet und in welcher Reihenfolge es sinnvoll ist. Ergebnis ist ein Konzept mit umsetzbarem Fahrplan.",
      },
      {
        q: "Für wen lohnt sich eine Beratung?",
        a: "Für Betriebe vor einer größeren Anschaffung, mit vielen Ideen ohne Reihenfolge oder mit mehreren Systemen, die zusammenarbeiten müssen. Auch ein „noch nicht“ ist ein Ergebnis.",
      },
      {
        q: "Muss die Umsetzung danach bei Tracht Digital Solutions liegen?",
        a: "Nein. Die Umsetzung wird getrennt vereinbart. Der Fahrplan ist so geschrieben, dass ihn auch ein anderer Dienstleister umsetzen kann.",
      },
    ],
    en: [
      {
        q: "What does consulting and planning cover?",
        a: "Consulting works out what a business needs digitally, what it costs and in which order it makes sense. The result is a concept with an actionable roadmap.",
      },
      {
        q: "Who benefits from consulting?",
        a: "Businesses before a larger investment, with many ideas but no order, or with several systems that have to work together. A “not yet” is a result too.",
      },
      {
        q: "Does the implementation have to stay with Tracht Digital Solutions?",
        a: "No. Implementation is agreed separately. The roadmap is written so that another provider can carry it out as well.",
      },
    ],
  },
  solutions: {
    de: [
      {
        q: "Was ist Auftragsprogrammierung?",
        a: "Auftragsprogrammierung heißt, dass Software für einen bestimmten Zweck eines Betriebs entwickelt wird. Bei Tracht Digital Solutions sind das vor allem Tools und Automatisierungsskripte, die stumpfe Datenverarbeitung und wiederkehrende Klickarbeit übernehmen.",
      },
      {
        q: "Welche Aufgaben eignen sich für ein Skript?",
        a: "Aufgaben, die regelmäßig gleich ablaufen: Daten von einem Programm ins andere übertragen, Listen abgleichen, Berichte erstellen oder immer gleiche Schritte im Browser. Je öfter eine Aufgabe anfällt, desto eher lohnt sich ein Skript.",
      },
      {
        q: "Was kostet ein individuelles Tool?",
        a: "Das hängt vom Umfang ab. Bei festem Umfang gibt es Festpreise für einzelne Etappen, alles andere auf Anfrage.",
      },
    ],
    en: [
      {
        q: "What is contract programming?",
        a: "Contract programming means software developed for a specific purpose of a business. At Tracht Digital Solutions that is mostly tools and automation scripts that take over dull data handling and repetitive clicking.",
      },
      {
        q: "Which tasks suit a script?",
        a: "Tasks that run the same way again and again: moving data from one program to another, matching lists, building reports or the same steps in a browser. The more often a task comes up, the sooner a script pays off.",
      },
      {
        q: "What does a custom tool cost?",
        a: "That depends on the scope. With a fixed scope there are fixed prices for single stages, everything else on request.",
      },
    ],
  },
  "web-presence": {
    de: [
      {
        q: "Was unterscheidet eine Website nach Maß von einer Vorlage?",
        a: "Eine Website nach Maß wird für einen bestimmten Betrieb und seine Kunden entworfen: Gestaltung passend zum Firmenbild, Aufbau und Texte aus Sicht der Kunden. Eine Vorlage ist für viele gleich und wird nur angepasst.",
      },
      {
        q: "Werden die Texte mit KI geschrieben?",
        a: "Nicht ungeprüft. KI ist ein Werkzeug für Recherche und Routine; was online geht, ist geprüft und auf den Betrieb abgestimmt.",
      },
      {
        q: "Was kostet eine Website?",
        a: "Es gibt Festpreise ab 390 € netto, alles andere auf Anfrage.",
      },
    ],
    en: [
      {
        q: "How does a made-to-measure website differ from a template?",
        a: "A made-to-measure website is designed for one business and its customers: design true to the brand, structure and copy from the customers' point of view. A template is the same for many and only gets adjusted.",
      },
      {
        q: "Is the copy written by AI?",
        a: "Not unchecked. AI is a tool for research and routine; what goes online is checked and fitted to the business.",
      },
      {
        q: "What does a website cost?",
        a: "There are fixed prices from €390 net, everything else on request.",
      },
    ],
  },
};

export function serviceFaq(id: ServiceId, lang: Lang): ServiceFaqItem[] {
  return FAQ[id]?.[lang] ?? [];
}
