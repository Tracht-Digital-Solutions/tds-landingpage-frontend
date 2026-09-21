/**
 * Motion that answers the visitor rather than decorating the page — each item
 * tells them something:
 *
 * 1. **Where am I?** A pill glides behind the header link of the section on
 *    screen (home page, desktop bar only). The link also gets
 *    `aria-current="location"`, so the answer is not visual alone.
 * 2. **What can I pick?** Price and package cards arrive one after another
 *    and lift on a spring under the pointer.
 * 3. **Where do I start?** The contact form's rows — the reason dropdown
 *    with them — arrive as one staggered group (`[data-motion-stagger]`).
 */
type Dom = typeof import("@tracht-digital-solutions/tds-shared/motion/dom");

function onScreen(el: Element): boolean {
  const box = el.getBoundingClientRect();
  return box.bottom > 0 && box.top < window.innerHeight;
}

function mountNavIndicator({ animate, pointerSpring }: Dom) {
  const bar = document.querySelector<HTMLElement>("[data-nav-links]");
  const pill = bar?.querySelector<HTMLElement>("[data-nav-pill]");
  if (!bar || !pill) return;
  const links = Array.from(bar.querySelectorAll<HTMLAnchorElement>("a[data-section]"));
  const sections = links
    .map((link) => document.getElementById(link.dataset.section ?? ""))
    .filter((el): el is HTMLElement => el !== null);
  if (sections.length === 0) return;

  let current: HTMLAnchorElement | null = null;
  const show = (link: HTMLAnchorElement | null) => {
    if (link === current) return;
    current?.removeAttribute("aria-current");
    current = link;
    if (!link) {
      void animate(pill, { opacity: 0 }, { duration: 0.2 });
      return;
    }
    link.setAttribute("aria-current", "location");
    const first = pill.style.opacity === "" || pill.style.opacity === "0";
    const target = { x: link.offsetLeft, width: link.offsetWidth };
    if (first) void animate(pill, target, { duration: 0 });
    void animate(pill, { ...target, opacity: 1 }, pointerSpring);
  };

  const visible = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      // The LAST listed section in the band wins, matching reading order.
      const active = [...links].reverse().find((l) => visible.has(l.dataset.section ?? ""));
      show(active ?? null);
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );
  sections.forEach((s) => observer.observe(s));
}

function mountCards({ animate, inView, hover, stagger, pointerSpring, hasFinePointer }: Dom) {
  const groups = document.querySelectorAll<HTMLElement>("[data-motion-cards]");
  const fine = hasFinePointer();
  groups.forEach((group) => {
    const cards = Array.from(group.children) as HTMLElement[];
    if (cards.length === 0) return;
    if (!onScreen(group)) {
      void animate(cards, { opacity: 0, y: 28 }, { duration: 0 });
      inView(
        group,
        () => {
          void animate(cards, { opacity: 1, y: 0 }, { duration: 0.55, delay: stagger(0.08), ease: [0.2, 0.8, 0.2, 1] });
        },
        { amount: 0.2 },
      );
    }
    if (fine) {
      for (const card of cards) {
        hover(card, () => {
          void animate(card, { y: -6 }, pointerSpring);
          return () => void animate(card, { y: 0 }, pointerSpring);
        });
      }
    }
  });
}

function mountStagger({ animate, inView, stagger }: Dom) {
  document.querySelectorAll<HTMLElement>("[data-motion-stagger]").forEach((group) => {
    if (onScreen(group)) return;
    // Hidden helpers (the form's honeypot) are not rows and must never be
    // faded IN.
    const rows = Array.from(group.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el.getAttribute("aria-hidden") !== "true",
    );
    if (rows.length === 0) return;
    void animate(rows, { opacity: 0, y: 18 }, { duration: 0 });
    inView(
      group,
      () => {
        void animate(rows, { opacity: 1, y: 0 }, { duration: 0.5, delay: stagger(0.07), ease: [0.2, 0.8, 0.2, 1] }).then(() => {
          // Leave no transform behind: the rows hold focus rings and the
          // select's picker, which should not sit in a transformed box.
          rows.forEach((row) => row.style.removeProperty("transform"));
        });
      },
      { amount: 0.15 },
    );
  });
}

export function mountUx(dom: Dom): void {
  mountNavIndicator(dom);
  mountCards(dom);
  mountStagger(dom);
}
