/**
 * Motion for page images (backdrops and the Collaborate picture):
 * `[data-media-motion="flow|push|turn|drift"]`, styled in base.css.
 *
 * - Once, as the image enters, it comes into focus (`.is-in`).
 * - Then it plays its own slow movement, only while on-screen in a visible
 *   tab (`[data-playing]`), and never under reduced motion — checked at
 *   start and on change; with reduced motion the image simply shows.
 */
import { onReducedMotionChange, prefersReducedMotion, whenVisible } from "./motion";

export function initMediaMotion(): void {
  for (const el of document.querySelectorAll<HTMLElement>("[data-media-motion]")) {
    let reduced = prefersReducedMotion();
    let visible = false;
    const update = () => el.toggleAttribute("data-playing", visible && !reduced);
    whenVisible(el, (isVisible) => {
      visible = isVisible;
      if (isVisible) el.classList.add("is-in");
      update();
    });
    onReducedMotionChange((isReduced) => {
      reduced = isReduced;
      el.classList.add("is-in");
      update();
    });
  }
}
