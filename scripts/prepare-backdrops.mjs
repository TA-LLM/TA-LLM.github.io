/**
 * Prepares the page backdrops (taste.md D4 exception) from the raw files in
 * images/ (git-ignored). Sources: research.jpg is a Pexels photo (light
 * trails), used under the Pexels licence — free use, modification allowed,
 * credit optional (checked at pexels.com/license, 2026-09-19).
 *
 * Run: node scripts/prepare-backdrops.mjs
 *
 * Each raw image is optionally cropped (fractions of its width and height),
 * optionally gradient-mapped into the site's palette (its luminance mapped
 * through ink → deep amber → amber → pale gold, so any source reads as one of
 * ours), resized to 1600px wide and written as a WebP source in
 * src/assets/backdrops/, from which Astro builds AVIF/WebP at display sizes.
 * On the page the image is blended with `lighten` over the ink surface and
 * faded out by masks, so it never shows an edge (Backdrop.astro).
 */
import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAW = fileURLToPath(new URL("../images/", import.meta.url));
const OUT = fileURLToPath(new URL("../src/assets/backdrops/", import.meta.url));

/**
 * name → source in images/, optional crop {left, top, width, height} as
 * fractions of the source, optional `grade` (gradient map into the palette).
 */
const BACKDROPS = {
  research: { file: "research.jpg", crop: { left: 0.45, top: 0.3, width: 0.55, height: 0.4757 }, grade: true },
  publications: { file: "publications-bg.png" },
  resources: { file: "resources-bg.png" },
};

/** Luminance stops (0–1) → sRGB colour: ink, a warm shadow, deep amber,
    amber, pale gold. Gradual in the shadows so mid-tones keep their depth. */
const STOPS = [
  [0.0, [15, 20, 32]],
  [0.12, [15, 20, 32]],
  [0.32, [58, 42, 26]],
  [0.55, [138, 90, 16]],
  [0.8, [230, 162, 60]],
  [1.0, [250, 232, 196]],
];

function mapLuminance(l) {
  for (let i = 1; i < STOPS.length; i += 1) {
    const [l1, c1] = STOPS[i];
    const [l0, c0] = STOPS[i - 1];
    if (l <= l1) {
      const t = (l - l0) / (l1 - l0 || 1);
      return c0.map((v, k) => Math.round(v + (c1[k] - v) * t));
    }
  }
  return STOPS[STOPS.length - 1][1];
}

mkdirSync(OUT, { recursive: true });

for (const [name, { file, crop, grade }] of Object.entries(BACKDROPS)) {
  const input = `${RAW}${file}`;
  if (!existsSync(input)) {
    console.log(`skip ${name}: images/${file} not found`);
    continue;
  }

  let image = sharp(input);
  if (crop) {
    const { width, height } = await image.metadata();
    image = image.extract({
      left: Math.round(crop.left * width),
      top: Math.round(crop.top * height),
      width: Math.round(crop.width * width),
      height: Math.round(crop.height * height),
    });
  }
  image = image.resize({ width: 1600, withoutEnlargement: true });

  if (grade) {
    const { data, info } = await image.removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const out = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i += 3) {
      const l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      const [r, g, b] = mapLuminance(l);
      out[i] = r;
      out[i + 1] = g;
      out[i + 2] = b;
    }
    image = sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } });
  }

  const info = await image.webp({ quality: 86 }).toFile(`${OUT}${name}.webp`);
  console.log(`${name}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} kB`);
}
