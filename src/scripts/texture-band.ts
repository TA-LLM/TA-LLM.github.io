/**
 * The animated "Dark gitter gold" band (TextureBand.astro, from
 * research/moodboard/_taste/background).
 *
 * The reference drives the gradient from a requestAnimationFrame clock and
 * slides the palette ramp along the grid diagonal; every modulation is
 * written so that it is exactly 0 at `ph = 0`, so nothing snaps when the
 * motion starts, and nothing is rounded per frame, which is what would make
 * it step.
 *
 * It is drawn cell by cell, not pixel by pixel: about 3,000 rectangles a
 * frame, on a 2D context with the device pixel ratio capped (CLAUDE.md).
 * The still image stays behind it as the ground, so the band is complete
 * before the first frame, without JavaScript, and under reduced motion —
 * where this loop never starts.
 */
import { prefersReducedMotion, whenVisible } from "./motion";

const STOPS: [number, [number, number, number]][] = [
  [0.0, [0x55, 0x55, 0x55]],
  [0.23, [0x1b, 0x1b, 0x1b]],
  [0.44, [0x28, 0x1f, 0x03]],
  [0.68, [0x6f, 0x58, 0x26]],
  [0.81, [0x00, 0x00, 0x00]],
  [1.0, [0x00, 0x00, 0x00]],
];

const COLS = 72;
const ROWS = 41;
const ANGLE = (20 * Math.PI) / 180;
const GAP = 0.21;
/** The reference's motion: speed 1.00, amount 0.15, reversed. */
const SPEED = 1;
const AMOUNT = 0.15;
const DIR = -1;

const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64 - 0.5));

/** The ramp, resolved once into 512 steps: no string built per cell, per
    frame. Finer than the eye or the dither can tell apart. */
const LUT: string[] = [];

function rampAt(t: number): string {
  const x = Math.min(1, Math.max(0, t));
  for (let i = 1; i < STOPS.length; i += 1) {
    const [p1, c1] = STOPS[i];
    const [p0, c0] = STOPS[i - 1];
    if (x <= p1) {
      const k = (x - p0) / (p1 - p0 || 1);
      const c = c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
      return `rgb(${c[0]} ${c[1]} ${c[2]})`;
    }
  }
  return "rgb(0 0 0)";
}

for (let i = 0; i < 512; i += 1) LUT.push(rampAt(i / 511));

function ramp(t: number): string {
  return LUT[Math.min(511, Math.max(0, Math.round(t * 511)))];
}

function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + 311382517 * 0.013) * 43758.5453;
  return n - Math.floor(n);
}

/** The same field as scripts/prepare-texture.mjs, read at each cell's centre. */
const field: number[] = [];
for (let row = 0; row < ROWS; row += 1) {
  for (let col = 0; col < COLS; col += 1) {
    const cx = (col + 0.5) / COLS;
    const cy = (row + 0.5) / ROWS;
    let t = cx * Math.cos(ANGLE) + cy * Math.sin(ANGLE) * 0.6;
    t += 0.12 * Math.sin(cy * Math.PI * 2.2 + cx * 1.6);
    t += 0.28 * (hash(col * 0.22, row * 0.22) - 0.5);
    t = 0.18 + ((t - 0.05) / 0.95) * 0.72;
    t += BAYER[row % 8][col % 8] * 0.22;
    field.push(t);
  }
}

export function initTextureBands(): void {
  for (const canvas of document.querySelectorAll<HTMLCanvasElement>("[data-band-canvas]")) {
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) continue;

    let width = 0;
    let height = 0;
    let frame = 0;
    let start = 0;
    let last = 0;
    /* The phase carries across pauses: coming back on screen the ramp picks
       up where it left off instead of snapping to its starting state. */
    let elapsed = 0;
    let now = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const box = canvas.getBoundingClientRect();
      width = Math.round(box.width);
      height = Math.round(box.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (phase: number) => {
      // Zero at phase 0: the ramp does not jump when the loop starts.
      const shift = Math.sin(phase * 0.9 * DIR) * 0.5 * AMOUNT;
      const cellW = width / COLS;
      const cellH = height / ROWS;
      const insetX = (cellW * GAP) / 2;
      const insetY = cellH * GAP;

      context.clearRect(0, 0, width, height);
      for (let row = 0; row < ROWS; row += 1) {
        for (let col = 0; col < COLS; col += 1) {
          context.fillStyle = ramp(field[row * COLS + col] + shift);
          context.fillRect(col * cellW + insetX, row * cellH + insetY, cellW - insetX * 2, cellH - insetY * 2);
        }
      }
    };

    /* The ramp slides slowly: 30 frames a second are plenty, and halve the
       work (about 3,000 rectangles a frame). */
    const tick = (stamp: number) => {
      if (!start) start = stamp;
      now = stamp;
      if (stamp - last >= 32) {
        last = stamp;
        draw(elapsed + ((stamp - start) / 1000) * SPEED);
      }
      frame = requestAnimationFrame(tick);
    };

    whenVisible(canvas, (visible) => {
      if (frame) {
        cancelAnimationFrame(frame);
        elapsed += ((now - start) / 1000) * SPEED;
        frame = 0;
        start = 0;
      }
      if (!visible || prefersReducedMotion()) return;
      resize();
      canvas.classList.add("is-live");
      frame = requestAnimationFrame(tick);
    });

    window.addEventListener(
      "resize",
      () => {
        if (!frame) return;
        resize();
      },
      { passive: true },
    );
  }
}
