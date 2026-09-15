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
}

export function contactFormCopy(lang: Lang): ContactFormCopy {
  const t = translations[lang];
  if (lang === "en") {
    return {
      form: t.contact.form,
      errors: t.errors,
      failure: "The message could not be sent just now. Please try again later or email me directly: ",
      email: t.contact.info.email,
    };
  }
  return {
    form: {
      ...t.contact.form,
      successMessage: "Danke für deine Nachricht. Ich melde mich in der Regel innerhalb von 24 Stunden.",
      errorMessage: "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
    },
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
