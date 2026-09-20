/**
 * Renders the "Dark gitter gold" gradient of
 * research/moodboard/_taste/background (21st.dev) as a still image, from the
 * parameters in its prompt file: a Bayer-dithered grid of cells whose palette
 * runs Slate → Charcoal → deep gold → gold → Ink along a 20° diagonal, with
 * wave, grain and a light vignette.
 *
 * Run: node scripts/prepare-texture.mjs
 *
 * The CSS in the prompt is only an approximation (it cannot draw the dithered
 * cells or the grain), so the band is rasterised here once, at build time, and
 * used as a still: no canvas, no animation loop on the page.
 * Output: src/assets/textures/gold-grid.webp (TextureBand.astro).
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT = fileURLToPath(new URL("../src/assets/textures/", import.meta.url));

const WIDTH = 1600;
const HEIGHT = 420;

/** The palette of the reference, by position along the ramp (0–1). */
const STOPS = [
  [0.0, [0x55, 0x55, 0x55]],
  [0.23, [0x1b, 0x1b, 0x1b]],
  [0.44, [0x28, 0x1f, 0x03]],
  [0.68, [0x6f, 0x58, 0x26]],
  [0.81, [0x00, 0x00, 0x00]],
  [1.0, [0x00, 0x00, 0x00]],
];

const COLS = 36 * 2; // the reference's grid, doubled for a band this wide
const ROWS = 41;
const ANGLE = (20 * Math.PI) / 180;
const GAP = 0.21;
const VIGNETTE = 0.09;
const GRAIN = 0.1;

/** 8×8 Bayer matrix, normalised to (-0.5, 0.5): the ordered dither. */
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

function ramp(t) {
  const x = Math.min(1, Math.max(0, t));
  for (let i = 1; i < STOPS.length; i += 1) {
    const [p1, c1] = STOPS[i];
    const [p0, c0] = STOPS[i - 1];
    if (x <= p1) {
      const k = (x - p0) / (p1 - p0 || 1);
      return c0.map((v, j) => v + (c1[j] - v) * k);
    }
  }
  return STOPS.at(-1)[1];
}

/** A cheap, deterministic value noise: the prompt's distortion and grain. */
function hash(x, y, seed) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 0.013) * 43758.5453;
  return n - Math.floor(n);
}

function noise(x, y, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

mkdirSync(OUT, { recursive: true });

const data = Buffer.alloc(WIDTH * HEIGHT * 3);
const cellW = WIDTH / COLS;
const cellH = HEIGHT / ROWS;

for (let y = 0; y < HEIGHT; y += 1) {
  for (let x = 0; x < WIDTH; x += 1) {
    // The cell this pixel belongs to, and where it sits inside it.
    const col = Math.floor(x / cellW);
    const row = Math.floor(y / cellH);
    const inX = x / cellW - col;
    const inY = y / cellH - row;

    // Gutters between the cells: the grid of the reference.
    const gutter = inX < GAP / 2 || inX > 1 - GAP / 2 || inY < GAP || inY > 1 - GAP;

    // The ramp is read at the cell's centre, along the 20° diagonal, with
    // the prompt's wave and distortion.
    const cx = (col + 0.5) / COLS;
    const cy = (row + 0.5) / ROWS;
    let t = cx * Math.cos(ANGLE) + cy * Math.sin(ANGLE) * 0.6;
    t += 0.12 * Math.sin(cy * Math.PI * 2.2 + cx * 1.6);
    t += 0.28 * (noise(col * 0.22, row * 0.22, 311382517) - 0.5);
    // Kept inside the ramp's gold half: at full range most cells fall in
    // the black end and the band goes flat.
    t = 0.18 + ((t - 0.05) / 0.95) * 0.72;

    // Ordered dithering, on the cell's own place in the Bayer matrix.
    t += BAYER[row % 8][col % 8] * 0.22;

    let [r, g, b] = ramp(t);

    if (gutter) {
      // The gutters keep the backdrop of the reference (#111111).
      r = r * 0.12 + 0x11 * 0.88;
      g = g * 0.12 + 0x11 * 0.88;
      b = b * 0.12 + 0x11 * 0.88;
    }

    // Grain, then a light vignette.
    const grain = (noise(x * 0.7, y * 0.7, 7) - 0.5) * GRAIN * 255;
    const dx = x / WIDTH - 0.5;
    const dy = y / HEIGHT - 0.5;
    const fall = 1 - VIGNETTE * (dx * dx * 4 + dy * dy * 4);

    const i = (y * WIDTH + x) * 3;
    data[i] = Math.min(255, Math.max(0, (r + grain) * fall));
    data[i + 1] = Math.min(255, Math.max(0, (g + grain) * fall));
    data[i + 2] = Math.min(255, Math.max(0, (b + grain) * fall));
  }
}

const info = await sharp(data, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } })
  .webp({ quality: 90 })
  .toFile(`${OUT}gold-grid.webp`);

console.log(`gold-grid: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} kB`);
