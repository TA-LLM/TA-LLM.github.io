/**
 * Entrance reveals, once per element.
 *
 * - `[data-reveal]` rises and fades in; `[data-reveal="mask"]` (headings) is
 *   unveiled from a mask; `[data-reveal="line"]` (rules) draws from the left.
 * - `[data-reveal-children]` marks each of its element children as
 *   `[data-reveal]`: used where the markup is not ours (rendered Markdown).
 * - Elements that enter together are staggered on the site's single stagger
 *   primitive, counted within that batch — so a long list scrolled into view
 *   never waits seconds for its last row. `data-reveal-delay` (ms) adds an
 *   offset, e.g. to follow the hero headline.
 * - The hidden state exists only under `html.motion` (set in Head.astro when
 *   motion is allowed); on reduced motion, now or later, everything shows.
 * - A masked element is fully clipped, which IntersectionObserver counts as
 *   invisible: its parent is observed in its place.
 */
import { onReducedMotionChange, staggerDelay } from "./motion";

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

const root = document.documentElement;

function show(element: Element): void {
  element.classList.add("is-revealed");
}

export function initReveal(): void {
  for (const parent of document.querySelectorAll("[data-reveal-children]")) {
    for (const child of parent.children) {
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "");
    }
  }

  const items = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)")];
  window.__revealReady = true;

  if (!root.classList.contains("motion")) {
    items.forEach(show);
    return;
  }

  const watched = new Map<Element, HTMLElement[]>();
  const observer = new IntersectionObserver(
    (entries) => {
      const entering = entries
        .filter((entry) => entry.isIntersecting)
        .flatMap((entry) => {
          observer.unobserve(entry.target);
          return watched.get(entry.target) ?? [];
        })
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      entering.forEach((element, index) => {
        const offset = Number(element.dataset.revealDelay ?? 0);
        element.style.setProperty("--reveal-delay", `${staggerDelay(Math.min(index, 8)) + offset}ms`);
        show(element);
      });
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
  );
  for (const item of items) {
    const target = item.dataset.reveal === "mask" && item.parentElement ? item.parentElement : item;
    watched.set(target, [...(watched.get(target) ?? []), item]);
    observer.observe(target);
  }

  onReducedMotionChange((reduced) => {
    if (!reduced) return;
    root.classList.remove("motion");
    observer.disconnect();
    items.forEach(show);
  });
}
