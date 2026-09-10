import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The price list as a drawer that slides in from the right and pushes the page
 * left.
 *
 * ### Behaviour only — the list itself is server-rendered
 *
 * The cards come in through `children`, rendered by `PricingList.astro` on the
 * server. This island holds the open state, the focus handling and the scroll
 * lock and nothing else. That is the repo's rule ("prefer `.astro` for
 * rendered content"), and here it also means the whole price list is in the
 * HTML for a crawler whether or not the drawer is ever opened.
 *
 * ### The opening sequence is two steps, in order
 *
 * A visitor asked for prices while looking at the top of the page would
 * otherwise get a panel referring to a section they cannot see. So: scroll to
 * the pricing band FIRST, and only once the page has come to rest let the
 * drawer spring open. The scroll runs through `window.tdsScrollTo`, the site's
 * own bounce-eased jump (see `lib/scrollJump.ts`) — the same curve the nav
 * links use, rather than a second one that would almost match.
 *
 * "Come to rest" is `scrollend` where the browser has it, with a timer as the
 * floor. The timer is not a fallback nobody hits: Lenis drives the desktop
 * scroll with its own rAF loop, and a smoothed programmatic scroll does not
 * always end in a `scrollend` the way a user gesture does.
 *
 * ### Why the push is a transform on three named elements
 *
 * `transform` on an ancestor makes that ancestor the containing block for any
 * `position: fixed` descendant — the fixed header would stop being fixed to
 * the viewport and start scrolling with the page. So nothing here wraps the
 * document. The shift is a custom property that three elements answer for
 * themselves in CSS (`.site-header`, `main`, `footer`); a transform on a fixed
 * element ITSELF is fine, it is only a transformed ancestor that breaks it.
 */

interface Props {
  lang: "de" | "en";
  /** The id of the section to bring into view before opening. */
  sectionId?: string;
  children?: React.ReactNode;
}

/** How long to wait for the jump to settle before opening regardless. */
const SETTLE_FALLBACK_MS = 900;

/** Nothing to wait for when the section is already in view. */
const ALREADY_IN_VIEW_PX = 120;

export default function PricingDrawer({
  lang,
  sectionId = "pricing-teaser",
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  /** Whoever opened it, so focus can go back there. Not a state: it must not re-render. */
  const openerRef = useRef<HTMLElement | null>(null);
  const timers = useRef<number[]>([]);

  const t =
    lang === "de"
      ? { title: "Preise", close: "Preisliste schließen", label: "Preisliste" }
      : { title: "Pricing", close: "Close the price list", label: "Price list" };

  const clearTimers = () => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  };

  /** Scroll the pricing band into view, then resolve once the page is still. */
  const scrollThenSettle = useCallback(
    (onSettled: () => void) => {
      const section = document.getElementById(sectionId);
      if (!section) {
        onSettled();
        return;
      }

      const distance = Math.abs(section.getBoundingClientRect().top);
      if (distance < ALREADY_IN_VIEW_PX) {
        // Already there. Jumping would be a lurch for no reason.
        onSettled();
        return;
      }

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        window.removeEventListener("scrollend", finish);
        onSettled();
      };

      // The site's own bounce-eased jump, so this lands with the same curve as
      // every nav link. Falls back to the platform when the island that
      // publishes it has not hydrated yet.
      if (window.tdsScrollTo) window.tdsScrollTo(section);
      else section.scrollIntoView({ behavior: "smooth", block: "start" });

      window.addEventListener("scrollend", finish, { once: true });
      timers.current.push(window.setTimeout(finish, SETTLE_FALLBACK_MS));
    },
    [sectionId],
  );

  const openDrawer = useCallback(
    (opener: HTMLElement | null) => {
      openerRef.current = opener;
      clearTimers();
      scrollThenSettle(() => setOpen(true));
    },
    [scrollThenSettle],
  );

  const closeDrawer = useCallback(() => {
    clearTimers();
    setOpen(false);
  }, []);

  /* Any link or button that asked for the price list. The markup keeps its
     real `href` so it still works with no JavaScript and so a middle-click
     opens the page it points at; the click is only intercepted here. */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-pricing-open]",
      );
      if (!target) return;
      event.preventDefault();
      // Stop the smooth-scroll island's own anchor handler from also acting on
      // this click; the sequence below owns the scroll.
      event.stopPropagation();
      openDrawer(target);
    };
    // Capture, so this runs before the document-level anchor handler in
    // `SmoothScroll.tsx` — otherwise both would scroll, on two schedules.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [openDrawer]);

  /* Escape, and a focus trap while it is open. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeDrawer]);

  /* The open flag lives on the root element, because the shift belongs to the
     page and not to this component's subtree. Everything that moves reads
     `--pricing-shift` from here. */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("pricing-open", open);
    return () => root.classList.remove("pricing-open");
  }, [open]);

  /* Focus into the panel when it opens, and back to the opener when it closes.
     Returning focus matters more than it looks: without it the next Tab starts
     from the top of the document, and a keyboard visitor who opened the prices
     from the footer is thrown back to the header. */
  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
      return;
    }
    const opener = openerRef.current;
    openerRef.current = null;
    // Only if focus is still somewhere we moved it; never steal it back from
    // wherever the visitor has since gone.
    if (opener && document.activeElement === document.body) opener.focus();
  }, [open]);

  useEffect(() => () => clearTimers(), []);

  return (
    <>
      {/* The scrim closes the drawer and dims the page. `aria-hidden`, because
          the button inside the panel is the accessible way to close: a screen
          reader user does not need a second, unlabelled one. */}
      <div
        className="pricing-scrim"
        aria-hidden="true"
        data-open={open ? "" : undefined}
        onClick={closeDrawer}
      />

      <div
        ref={panelRef}
        className="pricing-drawer"
        data-open={open ? "" : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={t.label}
        // Hidden from assistive tech while closed. The markup stays in the DOM
        // — a crawler and a no-JS visitor both still get the price list — but
        // an off-canvas panel a screen reader could tab into is a trap.
        aria-hidden={open ? undefined : "true"}
        inert={!open}
      >
        <div className="pricing-drawer__head">
          <h2 className="pricing-drawer__title">{t.title}</h2>
          <button
            ref={closeRef}
            type="button"
            className="pricing-drawer__close"
            onClick={closeDrawer}
          >
            <span className="sr-only">{t.close}</span>
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <div className="pricing-drawer__body">{children}</div>
      </div>
    </>
  );
}
