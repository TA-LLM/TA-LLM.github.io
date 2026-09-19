/**
 * Prepares the team portraits for /people from the photos in
 * images/people/nobg/ (git-ignored): the user's photos (2026-09-19) with
 * their backgrounds removed by rembg (u2net_human_seg), so every portrait is
 * set on the same plain white ground.
 *
 * Run: node scripts/prepare-portraits.mjs
 *
 * Each photo is cropped to a square around the face — `cx`/`cy` the square's
 * centre and `size` its side, as fractions of the photo's shorter side
 * (cx, cy of width and height) — and written as a 320px WebP in
 * src/assets/people/, from which Astro builds the sizes the card needs. The
 * card shows it in a circle, so the crop leaves room for the head and a
 * little of the shoulders. The cut-out is flattened onto white; the
 * person's colours are left as they are.
 */
import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAW = fileURLToPath(new URL("../images/people/nobg/", import.meta.url));
const OUT = fileURLToPath(new URL("../src/assets/people/", import.meta.url));

const PORTRAITS = {
  "elena-baralis": { file: "baralis-300x300.png", cx: 0.52, cy: 0.4, size: 0.78 },
  "luca-cagliero": { file: "cagliero-300x300.png", cx: 0.5, cy: 0.4, size: 0.76 },
  "paolo-garza": { file: "garza-292x300.png", cx: 0.5, cy: 0.49, size: 1 },
  "silvia-chiusano": { file: "silvia_chiusano.png", cx: 0.5, cy: 0.5, size: 1 },
  "francesco-vaccarino": { file: "vaccarino.png", cx: 0.53, cy: 0.38, size: 1 },
  "lorenzo-vaiani": { file: "vaiani.png", cx: 0.5, cy: 0.46, size: 0.72 },
};

mkdirSync(OUT, { recursive: true });

for (const [slug, { file, cx, cy, size }] of Object.entries(PORTRAITS)) {
  const input = `${RAW}${file}`;
  if (!existsSync(input)) {
    console.log(`skip ${slug}: images/people/nobg/${file} not found`);
    continue;
  }
  const { width, height } = await sharp(input).metadata();
  const side = Math.round(Math.min(width, height) * size);
  const left = Math.min(Math.max(0, Math.round(cx * width - side / 2)), width - side);
  const top = Math.min(Math.max(0, Math.round(cy * height - side / 2)), height - side);
  const info = await sharp(input)
    .extract({ left, top, width: side, height: side })
    .flatten({ background: "#ffffff" })
    .resize(320, 320)
    .webp({ quality: 88 })
    .toFile(`${OUT}${slug}.webp`);
  console.log(`${slug}: ${side}px crop -> ${info.width}x${info.height}, ${Math.round(info.size / 1024)} kB`);
}
