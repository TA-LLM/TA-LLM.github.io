/**
 * Motion utilities shared by every animated element on the site.
 *
 * - Reduced motion is read in JavaScript, at start AND on change: a CSS media
 *   query cannot stop a requestAnimationFrame loop (synthesis §6.1).
 * - `staggerDelay` is the site's single stagger primitive (synthesis §1.20):
 *   many elements, one behaviour, different phases. Words, cards, SVG paths
 *   and canvas particles all take their offset from it.
 * - `whenVisible` pauses work when an element is off-screen or the tab is
 *   hidden (CLAUDE.md: lazy-started, paused when off-screen).
 */

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;
}

/** Calls `listener` whenever the preference changes; returns an unsubscribe. */
export function onReducedMotionChange(listener: (reduced: boolean) => void): () => void {
  const query = window.matchMedia(REDUCED_QUERY);
  const handler = (event: MediaQueryListEvent) => listener(event.matches);
  query.addEventListener("change", handler);
  return () => query.removeEventListener("change", handler);
}

/**
 * Reads a time token (e.g. `--stagger-step`) from the root, in milliseconds.
 * Accepts both units: the CSS minifier rewrites `130ms` as `.13s` in production.
 */
export function readMsToken(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const match = raw.match(/^(-?\d*\.?\d+)(ms|s)$/);
  if (!match) return fallback;
  const value = Number.parseFloat(match[1]) * (match[2] === "s" ? 1000 : 1);
  return Number.isFinite(value) ? value : fallback;
}

/** The single stagger primitive: delay of the `index`-th element, in ms. */
export function staggerDelay(index: number, step = readMsToken("--stagger-step", 130), start = 0): number {
  return start + index * step;
}

/** Applies the primitive to elements as `--stagger-delay`, consumed by CSS. */
export function applyStagger(elements: Iterable<HTMLElement>, start = 0): void {
  const step = readMsToken("--stagger-step", 130);
  let index = 0;
  for (const element of elements) {
    element.style.setProperty("--stagger-delay", `${staggerDelay(index, step, start)}ms`);
    index += 1;
  }
}

/**
 * Reports whether `element` is both on-screen and in a visible tab, and calls
 * `onChange` whenever that changes. Returns a cleanup function.
 */
export function whenVisible(element: Element, onChange: (visible: boolean) => void): () => void {
  let intersecting = false;
  let last: boolean | undefined;

  const report = () => {
    const visible = intersecting && !document.hidden;
    if (visible !== last) {
      last = visible;
      onChange(visible);
    }
  };

  const observer = new IntersectionObserver((entries) => {
    intersecting = entries.some((entry) => entry.isIntersecting);
    report();
  });
  observer.observe(element);
  document.addEventListener("visibilitychange", report);

  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", report);
  };
}
