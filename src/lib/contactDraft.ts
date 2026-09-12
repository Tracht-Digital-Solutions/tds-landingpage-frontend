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

export function handOffContactDraft(draft: string): void {
  try {
    window.sessionStorage.setItem(CONTACT_DRAFT_KEY, draft);
  } catch {
    // Storage blocked (private mode, site data off): the event still reaches a live form.
  }
  window.dispatchEvent(new CustomEvent(CONTACT_DRAFT_EVENT, { detail: draft }));
}
