/**
 * Prepares the institutional logos (MUR, DAUIN, MINDS) from the files in
 * images/ (git-ignored) as single-colour alpha masks for InstitutionLogos.astro:
 * the page fills them with one token, so the row reads as one set in both
 * themes and the artwork itself is never redrawn.
 *
 * Run: node scripts/prepare-logos.mjs
 *
 * - MUR and DAUIN are white artwork on transparency: their alpha is the mask.
 * - MINDS is full colour on white, without transparency: the mask is derived
 *   from how far each pixel is from white (so navy and red both become solid).
 * Each mask is trimmed to its artwork and written 240px tall to
 * src/assets/logos/<name>.webp.
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAW = fileURLToPath(new URL("../images/", import.meta.url));
const OUT = fileURLToPath(new URL("../src/assets/logos/", import.meta.url));
const HEIGHT = 240;

const LOGOS = {
  mur: { file: "logo_mur.png", source: "alpha" },
  dauin: { file: "logo_dauin.png", source: "alpha" },
  minds: { file: "logo_minds.png", source: "ink" },
};

mkdirSync(OUT, { recursive: true });

for (const [name, { file, source }] of Object.entries(LOGOS)) {
  const { data, info } = await sharp(`${RAW}${file}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alpha = Buffer.alloc(info.width * info.height);
  for (let p = 0, i = 0; p < alpha.length; p += 1, i += 4) {
    if (source === "alpha") {
      alpha[p] = data[i + 3];
    } else {
      const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      alpha[p] = Math.max(0, Math.min(255, Math.round((1 - lum) * 1.8 * 255 - 20)));
    }
  }
  // White artwork with the computed alpha, trimmed to its visible pixels.
  const rgba = Buffer.alloc(alpha.length * 4, 255);
  for (let p = 0; p < alpha.length; p += 1) rgba[p * 4 + 3] = alpha[p];
  const trimmed = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = await sharp(trimmed.data, {
    raw: { width: trimmed.info.width, height: trimmed.info.height, channels: 4 },
  })
    .resize({ height: HEIGHT })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(`${OUT}${name}.webp`);
  console.log(`${name}: ${out.width}x${out.height} (ratio ${(out.width / out.height).toFixed(3)}), ${Math.round(out.size / 1024)} kB`);
}
