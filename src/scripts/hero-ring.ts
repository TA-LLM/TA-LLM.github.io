/**
 * The hero ring (taste.md D5): a luminous ring built from a real time series.
 *
 * Geometry — each day of data is one closed ring. The angle runs through the
 * day (00:00 at the top, clockwise); the RADIUS is modulated by the value, so
 * the shape of each ring is the shape of that day's demand. Earlier days are
 * faint traces, the most recent is the amber ring — the "now" marker, which is
 * the last day in the dataset, not today's date (see src/data/electricity-ring.ts).
 *
 * Motion — one stagger primitive (motion.ts): day k starts tracing at
 * staggerDelay(k); the amber ring is traced last. At steady state a point runs
 * along the amber ring, one day per REVOLUTION_MS. Nothing loops faster than that.
 *
 * Rules (synthesis §6.1–6.2, taste.md D7): 2D canvas; reduced motion checked in
 * JS at start AND on change, drawing one static frame; device pixel ratio
 * capped; the loop runs only while the canvas is on-screen and the tab visible.
 */
import { onReducedMotionChange, prefersReducedMotion, staggerDelay, whenVisible } from "./motion";

export interface RingData {
  samplesPerDay: number;
  days: readonly { date: string; values: readonly number[] }[];
}

const MAX_DPR = 2;
const TRACE_MS = 1600; // time to trace one day's ring
const REVOLUTION_MS = 24_000; // steady state: one day of data every 24 s
// Radius of a 0 value, as a fraction of the outer radius. The mapping stays
// linear; 0.40 (rather than a near-circle 0.64) makes the night trough and the
// daytime peak legible as a shape, not a wobble.
const INNER = 0.4;
const TAIL = 0.08; // bright tail behind the moving point (≈ 2 hours of 24)
const MAX_STEP_MS = 64; // longest time step per frame

interface Colours {
  trace: [number, number, number];
  now: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (x: number) => 1 - (1 - x) ** 3;

export function mountHeroRing(canvas: HTMLCanvasElement, data: RingData): () => void {
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  const ctx = context;

  const days = data.days;
  const n = days.length;
  const samples = data.samplesPerDay;
  const introMs = staggerDelay(n - 1) + TRACE_MS;

  let width = 0;
  let height = 0;
  let colours = readColours();
  let reduced = prefersReducedMotion();
  let visible = false;
  let started = false;
  let clock = 0; // ms of animation time, advances only while visible
  let last = -1; // previous rAF timestamp; -1 = not yet set
  let raf = 0;

  function readColours(): Colours {
    const style = getComputedStyle(canvas);
    return {
      trace: hexToRgb(style.getPropertyValue("--ring-trace").trim() || "#F3EEE4"),
      now: style.getPropertyValue("--ring-now").trim() || "#E6A23C",
    };
  }

  function point(dayValues: readonly number[], position: number, cx: number, cy: number, outer: number) {
    // `position` in samples, fractional; wraps around the day.
    const i = Math.floor(position) % samples;
    const j = (i + 1) % samples;
    const f = position - Math.floor(position);
    const value = dayValues[i] + (dayValues[j] - dayValues[i]) * f;
    const radius = outer * (INNER + (1 - INNER) * (value / 1000));
    const angle = -Math.PI / 2 + (2 * Math.PI * position) / samples;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)] as const;
  }

  /** Strokes the fraction [from, to] of a day's ring (0..1 of the day). */
  function trace(dayValues: readonly number[], from: number, to: number, cx: number, cy: number, outer: number) {
    if (to <= from) return;
    const steps = Math.max(2, Math.ceil((to - from) * samples * 4));
    ctx.beginPath();
    for (let s = 0; s <= steps; s += 1) {
      const position = (from + ((to - from) * s) / steps) * samples;
      const [x, y] = point(dayValues, position, cx, cy, outer);
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    if (from === 0 && to >= 1) ctx.closePath();
    ctx.stroke();
  }

  function draw(t: number, withPlayhead: boolean) {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const outer = Math.min(width, height) * 0.46;
    const [r, g, b] = colours.trace;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Earlier days: faint, older ones fainter.
    for (let k = 0; k < n - 1; k += 1) {
      const progress = easeOut(clamp01((t - staggerDelay(k)) / TRACE_MS));
      if (progress <= 0) continue;
      const alpha = 0.1 + 0.32 * (k / Math.max(1, n - 2));
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      trace(days[k].values, 0, progress, cx, cy, outer);
    }

    // The most recent day: the luminous amber ring.
    const now = days[n - 1].values;
    const progress = easeOut(clamp01((t - staggerDelay(n - 1)) / TRACE_MS));
    if (progress > 0) {
      ctx.strokeStyle = colours.now;
      ctx.shadowColor = colours.now;
      ctx.shadowBlur = 12;
      ctx.lineWidth = 1.75;
      trace(now, 0, progress, cx, cy, outer);
    }

    // Steady state: a point runs along the amber ring, with a short bright tail.
    if (withPlayhead && t > introMs) {
      const phase = ((t - introMs) % REVOLUTION_MS) / REVOLUTION_MS;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 16;
      if (phase >= TAIL) trace(now, phase - TAIL, phase, cx, cy, outer);
      else {
        trace(now, 0, phase, cx, cy, outer);
        trace(now, 1 - (TAIL - phase), 1, cx, cy, outer);
      }
      const [x, y] = point(now, phase * samples, cx, cy, outer);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = colours.now;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  function drawStatic() {
    draw(introMs, false);
  }

  /** Repaints without advancing time: static under reduced motion, the current
   *  frame once started, and nothing before the intro — so the finished ring
   *  never flashes before being traced. */
  function redrawCurrent() {
    if (reduced) drawStatic();
    else if (started) draw(clock, true);
    else ctx.clearRect(0, 0, width, height);
  }

  function frame() {
    // One time source only: performance.now(), read inside the frame. The
    // first frame after a (re)start sets the reference; each step is capped,
    // so a throttled tab resumes smoothly instead of jumping ahead.
    const now = performance.now();
    if (last < 0) last = now;
    clock += Math.min(MAX_STEP_MS, Math.max(0, now - last));
    last = now;
    draw(clock, true);
    raf = requestAnimationFrame(frame);
  }

  function update() {
    cancelAnimationFrame(raf);
    if (reduced) {
      drawStatic();
      return;
    }
    if (!visible) return; // paused: time does not advance off-screen
    if (!started) {
      started = true;
      clock = 0;
    }
    last = -1; // the next frame sets the reference
    raf = requestAnimationFrame(frame);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redrawCurrent();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  // Theme switches recolour the ring immediately.
  const themeObserver = new MutationObserver(() => {
    colours = readColours();
    redrawCurrent();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const stopVisibility = whenVisible(canvas, (isVisible) => {
    visible = isVisible;
    update();
  });
  const stopReduced = onReducedMotionChange((isReduced) => {
    reduced = isReduced;
    if (!reduced) started = true; // resuming after a reduced phase skips the intro
    if (!reduced && clock < introMs) clock = introMs;
    update();
  });

  update();

  return () => {
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    themeObserver.disconnect();
    stopVisibility();
    stopReduced();
  };
}
