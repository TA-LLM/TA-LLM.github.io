/**
 * Prepares the two theme icons the user supplied (2026-09-20) in
 * research/moodboard/_taste/icons/ — an AI agent's head and a reinforcement
 * loop — for ThemeGlyph.astro, which draws them as masks so they take the
 * theme's colour and nothing else about them changes.
 *
 * Run: node scripts/prepare-theme-icons.mjs
 *
 * The artwork is black on transparency, so its alpha is the shape: the mask
 * is that alpha on white (a luminance mask inside the glyph's <svg>). Each is
 * trimmed to its artwork and centred in a square with a small margin, so it
 * carries the same weight as the drawn glyphs beside it.
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
  agentic: "ai_agent.png",
  rlaif: "reinforcement-learning.png",
};

mkdirSync(OUT, { recursive: true });

for (const [theme, file] of Object.entries(ICONS)) {
  const { data, info } = await sharp(`${RAW}${file}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // White artwork, alpha from the source: the shape, ready to be a mask.
  const rgba = Buffer.alloc(info.width * info.height * 4, 255);
  for (let p = 0; p < info.width * info.height; p += 1) {
    const a = data[p * 4 + 3];
    // Some exports carry white padding at full alpha; keep only the ink.
    const lum = (0.2126 * data[p * 4] + 0.7152 * data[p * 4 + 1] + 0.0722 * data[p * 4 + 2]) / 255;
    rgba[p * 4 + 3] = Math.round(a * (1 - lum));
  }

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

  console.log(`${theme}: ${info2.width}x${info2.height}, ${Math.round(info2.size / 1024)} kB`);
}
