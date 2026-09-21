/**
 * Prepares the theme icons the user supplied in
 * research/moodboard/_taste/icons/ — an AI agent's head, a reinforcement loop
 * (2026-09-20) and a gear-and-lightbulb loop (2026-09-21) — for
 * ThemeGlyph.astro, which draws them as masks so they take the theme's colour
 * and nothing else about them changes.
 *
 * Run: node scripts/prepare-theme-icons.mjs
 *
 * The artwork is black on transparency, so its alpha is the shape: the mask
 * is that alpha on white (a luminance mask inside the glyph's <svg>). Each is
 * trimmed to its artwork and centred in a square with a small margin, so it
 * carries the same weight as the drawn glyphs beside it.
 *
 * Stroke weight (2026-09-21). Measured, the three came in at three different
 * weights on the 48 grid: agentic 0.64, cl 0.86, rlaif 2.38 — rlaif because it
 * is a filled icon, not a line one. The user asked for all of them to be as
 * thick as rlaif, so each line icon's ink is **grown** here by `grow` source
 * pixels, a true (disc) dilation with a soft edge: the geometry is untouched,
 * only the weight of the line changes. The amounts land agentic and cl on the
 * same 1.38 units, which is as far as those drawings go before their own
 * detail closes up (the chip's pins, the bulb's rays); a line icon cannot
 * reach a filled one's mass. ThemeGlyph draws topology on the same 1.38.
 *
 * Output: src/assets/theme-icons/<theme>.webp
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAW = fileURLToPath(new URL("../research/moodboard/_taste/icons/", import.meta.url));
const OUT = fileURLToPath(new URL("../src/assets/theme-icons/", import.meta.url));
const SIZE = 256;
const MARGIN = 0.04;

const ICONS = {
  agentic: { file: "ai_agent.png", grow: 5 },
  rlaif: { file: "reinforcement-learning.png", grow: 0 },
  cl: { file: "continual_learning.png", grow: 4 },
};

/** One pass of the exact squared distance transform (Felzenszwalb & Huttenlocher). */
function edt1d(f, n) {
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;
  for (let q = 1; q < n; q += 1) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k -= 1;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k += 1;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q += 1) {
    while (z[k + 1] < q) k += 1;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
  return d;
}

/** Grows the ink by `r` pixels in every direction, keeping a soft edge: the
    distance to the nearest ink pixel, thresholded at r with one pixel of
    feather, so the dilation is round and not stair-stepped. */
function grow(cov, w, h, r) {
  if (!r) return cov;
  const INF = 1e12;
  const g = new Float64Array(w * h);
  for (let p = 0; p < g.length; p += 1) g[p] = cov[p] > 0.5 ? 0 : INF;

  const column = new Float64Array(h);
  for (let x = 0; x < w; x += 1) {
    for (let y = 0; y < h; y += 1) column[y] = g[y * w + x];
    const d = edt1d(column, h);
    for (let y = 0; y < h; y += 1) g[y * w + x] = d[y];
  }

  const row = new Float64Array(w);
  const out = new Float32Array(cov.length);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) row[x] = g[y * w + x];
    const d = edt1d(row, w);
    for (let x = 0; x < w; x += 1) {
      const distance = Math.sqrt(d[x]);
      const soft = Math.min(1, Math.max(0, r + 0.5 - distance));
      out[y * w + x] = Math.max(cov[y * w + x], soft);
    }
  }
  return out;
}

mkdirSync(OUT, { recursive: true });

for (const [theme, { file, grow: radius }] of Object.entries(ICONS)) {
  const { data, info } = await sharp(`${RAW}${file}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // The ink's coverage: some exports carry white padding at full alpha, so the
  // shape is the alpha times how dark the pixel is.
  const cov = new Float32Array(info.width * info.height);
  for (let p = 0; p < cov.length; p += 1) {
    const lum = (0.2126 * data[p * 4] + 0.7152 * data[p * 4 + 1] + 0.0722 * data[p * 4 + 2]) / 255;
    cov[p] = (data[p * 4 + 3] / 255) * (1 - lum);
  }

  // White artwork, the coverage as alpha: the shape, ready to be a mask.
  const grown = grow(cov, info.width, info.height, radius);
  const rgba = Buffer.alloc(info.width * info.height * 4, 255);
  for (let p = 0; p < grown.length; p += 1) rgba[p * 4 + 3] = Math.round(grown[p] * 255);

  const box = Math.round(SIZE * (1 - MARGIN * 2));
  const art = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
  const trimmed = await sharp(art).trim().resize(box, box, { fit: "contain", background: "#ffffff00" }).toBuffer();

  const info2 = await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: "#ffffff00" },
  })
    .composite([{ input: trimmed, gravity: "center" }])
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(`${OUT}${theme}.webp`);

  console.log(`${theme}: ${info2.width}x${info2.height}, +${radius}px, ${Math.round(info2.size / 1024)} kB`);
}
