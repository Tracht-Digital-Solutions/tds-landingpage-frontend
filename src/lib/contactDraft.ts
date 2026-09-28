/**
 * The hand-over from the service finder to the contact form.
 *
 * Text for the message field, nothing more: it is never sent by itself. Two
 * channels, because the contact form hydrates `client:visible` — when the
 * finder's link jumps down to it, the form usually is not live yet:
 *
 * - `sessionStorage` holds the draft until the form mounts and reads it;
 * - the event reaches a form that is already hydrated.
 *
 * Whichever applies it removes the stored copy, so a later visit in the same
 * tab does not find an old draft in the field.
 */
export const CONTACT_DRAFT_KEY = "tds-contact-draft";
export const CONTACT_DRAFT_EVENT = "tds:contact-draft";

/**
 * What the finder hands over.
 *
 * `service` is the id of the strongest recommendation, NOT a reason and not a
 * title. The dropdown's options are written in `sections/Contact.astro` and are
 * CMS-editable on top of that, and they share no wording with the service
 * names — "Webauftritt" against "Bestehende Website übernehmen", so any text
 * match between the two would simply never fire. The file that owns the
 * options owns the mapping from a service to one of them; this carries the id
 * across and nothing more.
 */
export interface ContactDraft {
  message: string;
  service?: string;
}

/**
 * Read a stored or dispatched draft back.
 *
 * Accepts the bare string the finder used to send as well: a draft written to
 * `sessionStorage` before an update is still in the tab when the new form
 * mounts, and a visitor mid-enquiry should not lose what they answered.
 */
export function parseContactDraft(value: unknown): ContactDraft | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    // A stored object arrives as JSON; anything else is the old plain text.
    if (trimmed.startsWith("{")) {
      try {
        return parseContactDraft(JSON.parse(trimmed));
      } catch {
        return { message: value };
      }
    }
    return { message: value };
  }
  if (typeof value === "object" && value !== null) {
    const { message, service } = value as Partial<ContactDraft>;
    if (typeof message !== "string" || message.trim() === "") return null;
    return typeof service === "string" && service.trim() !== "" ? { message, service } : { message };
  }
  return null;
}

export function handOffContactDraft(draft: ContactDraft): void {
  try {
    window.sessionStorage.setItem(CONTACT_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage blocked (private mode, site data off): the event still reaches a live form.
  }
  window.dispatchEvent(new CustomEvent(CONTACT_DRAFT_EVENT, { detail: draft }));
}
