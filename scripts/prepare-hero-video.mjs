/**
 * Prepares the hero video (taste.md D5) from the raw AI-generated clip.
 *
 * Run once:   node scripts/prepare-hero-video.mjs <raw.mp4>
 * ffmpeg must be on PATH, or its path given in the FFMPEG environment variable.
 *
 * The raw clip (1280×720, 5 s, with an audio track) stays out of the repository.
 * This script:
 * 1. crops the 2:3 column around the hourglass (480×720 from x = 388, the
 *    glass centred at x = 628 in the source);
 * 2. drops the audio track;
 * 3. writes public/hero/hourglass.webm (AV1) and public/hero/hourglass.mp4
 *    (H.264 fallback, faststart), both without audio;
 * 4. writes the first frame to src/assets/hero/hourglass-poster.png, the
 *    poster shown before playback and under reduced motion.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const input = process.argv[2];
if (!input) {
  console.error("usage: node scripts/prepare-hero-video.mjs <raw.mp4>");
  process.exit(1);
}

const FFMPEG = process.env.FFMPEG ?? "ffmpeg";
const CROP = "crop=480:720:388:0";
const OUT_DIR = fileURLToPath(new URL("../public/hero/", import.meta.url));
const POSTER = fileURLToPath(new URL("../src/assets/hero/hourglass-poster.png", import.meta.url));

function ffmpeg(args) {
  const result = spawnSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", "-i", input, ...args], {
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

mkdirSync(OUT_DIR, { recursive: true });

ffmpeg([
  "-an", "-vf", CROP,
  "-c:v", "libsvtav1", "-crf", "30", "-preset", "4", "-pix_fmt", "yuv420p",
  `${OUT_DIR}hourglass.webm`,
]);

ffmpeg([
  "-an", "-vf", CROP,
  "-c:v", "libx264", "-crf", "20", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  `${OUT_DIR}hourglass.mp4`,
]);

ffmpeg(["-vf", CROP, "-frames:v", "1", POSTER]);

console.log("hero video written to public/hero/ (webm, mp4) and poster to src/assets/hero/.");
