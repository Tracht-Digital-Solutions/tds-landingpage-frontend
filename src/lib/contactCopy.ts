import { translations } from "@tracht-digital-solutions/tds-shared/i18n";
import type { Lang } from "./i18n";

/**
 * The contact form's words, for this site.
 *
 * Labels, placeholders and the consent sentence come from tds-shared, like
 * before — they address nobody ("Name", "Nachricht senden", "Ich willige …
 * ein"). The sentences that DO address the visitor are overridden here: the
 * shared bundle says "Bitte geben Sie …" for every site, and since 2026-09-15
 * this one says "du". Overriding them locally keeps the other sites' tone
 * untouched and needs no shared release.
 *
 * **Runtime import allowed:** the island bundles this, and it already bundled
 * the translations it reads.
 */
/** The shared bundle's shape with its literal types widened to `string`. */
type Words<T> = { [K in keyof T]: string };

export interface ContactFormCopy {
  form: Words<(typeof translations)["de"]["contact"]["form"]>;
  errors: Words<(typeof translations)["de"]["errors"]>;
  /** Shown above the email address when sending failed. */
  failure: string;
  email: string;
  /**
   * The reason dropdown. `reasonEmpty` is its first option — a prompt, not a
   * value: picking nothing sends no subject at all, which is a legitimate
   * answer for someone whose request fits none of the entries.
   */
  reasonLabel: string;
  reasonEmpty: string;
  /**
   * The line under the message field that says what belongs in it.
   *
   * Its own field rather than the shared `messagePlaceholder`: a placeholder
   * disappears the moment someone starts typing, which is exactly when they
   * still need to know what to write. Every other site keeps the shared
   * placeholder untouched.
   */
  messageHint: string;
}

export function contactFormCopy(lang: Lang): ContactFormCopy {
  const t = translations[lang];
  if (lang === "en") {
    return {
      form: t.contact.form,
      errors: t.errors,
      failure: "The message could not be sent just now. Please try again later or email me directly: ",
      email: t.contact.info.email,
      reasonLabel: "What is it about?",
      reasonEmpty: "Please choose",
      messageHint:
        "Two or three sentences are enough: what is not working, since when, and the address of the site.",
    };
  }
  return {
    form: {
      ...t.contact.form,
      successMessage: "Danke für deine Nachricht. Ich melde mich in der Regel innerhalb von 24 Stunden.",
      errorMessage: "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
    },
    reasonLabel: "Worum geht es?",
    reasonEmpty: "Bitte auswählen",
    messageHint:
      "Zwei, drei Sätze genügen: was nicht funktioniert, seit wann, und die Adresse der Seite.",
    errors: {
      ...t.errors,
      name: "Bitte gib deinen Namen an.",
      email: "Bitte gib eine gültige E-Mail-Adresse an.",
      message: "Mindestens 20 Zeichen, bitte.",
      consent: "Bitte bestätige die Einwilligung.",
    },
    failure:
      "Die Nachricht konnte gerade nicht gesendet werden. Bitte versuch es später noch einmal oder schreib mir direkt: ",
    email: t.contact.info.email,
  };
}
