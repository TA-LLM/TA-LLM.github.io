/**
 * Prepares the data behind the hero ring (taste.md D5) from:
 *
 *   Trindade, A. (2015). ElectricityLoadDiagrams20112014 [Dataset].
 *   UCI Machine Learning Repository. https://doi.org/10.24432/C58C86
 *   Licence: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
 *
 * Run once:   node scripts/prepare-hero-data.mjs
 *
 * 1. Downloads the official UCI archive into data/raw/ (git-ignored) unless it
 *    is already there. The raw file is never committed.
 * 2. Streams the 15-minute readings of the 370 clients, keeping in memory only
 *    the last DAYS days.
 * 3. Sums all clients per timestamp (total demand, kW), averages pairs of
 *    15-minute readings into 30-minute values, and normalises the window to
 *    integers 0–1000.
 * 4. Writes src/data/electricity-ring.ts (a few KB), read by the site at build
 *    time only — nothing is fetched at runtime.
 *
 * Dataset conventions, quoted from the UCI page:
 * - "Values are in kW of each 15 min."
 * - "All time labels report to Portuguese hour." "All days present 96 measures (24*4)."
 * - "Every year in March time change day (which has only 23 hours) the values
 *   between 1:00 am and 2:00 am are zero for all points." → those readings are
 *   interpolated from their neighbours.
 * - "Every year in October time change day (which has 25 hours) the values
 *   between 1:00 am and 2:00 am aggregate the consumption of two hours." →
 *   those readings are halved.
 * A reading labelled hh:mm covers the 15 minutes that END at hh:mm, so the
 * label "yyyy-mm-dd 00:00:00" closes the previous day.
 */
import { createHash } from "node:crypto";
import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { Unzip, UnzipInflate } from "fflate";

const URL_ARCHIVE = "https://archive.ics.uci.edu/static/public/321/electricityloaddiagrams20112014.zip";
const DATA_FILE = "LD2011_2014.txt";
const RAW_DIR = fileURLToPath(new URL("../data/raw/", import.meta.url));
const ZIP_PATH = `${RAW_DIR}electricityloaddiagrams20112014.zip`;
const OUT_PATH = fileURLToPath(new URL("../src/data/electricity-ring.ts", import.meta.url));

const DAYS = 14; // rings drawn: the last 14 complete days of the dataset
const READINGS_PER_DAY = 96; // 15-minute readings
const SAMPLES_PER_DAY = 48; // 30-minute values after averaging pairs

async function download() {
  if (existsSync(ZIP_PATH)) return;
  mkdirSync(RAW_DIR, { recursive: true });
  console.log(`Downloading ${URL_ARCHIVE} …`);
  const response = await fetch(URL_ARCHIVE);
  if (!response.ok || !response.body) throw new Error(`Download failed: HTTP ${response.status}`);
  await pipeline(Readable.fromWeb(response.body), createWriteStream(ZIP_PATH));
}

/** Streams the archive and returns the last `keep` rows as { label, total }. */
function readLastRows(keep) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let pending = "";
    let header = true;
    let clients = 0;
    const decoder = new TextDecoder();

    const handleLine = (line) => {
      if (!line.trim()) return;
      const cells = line.split(";");
      if (header) {
        header = false;
        clients = cells.length - 1;
        return;
      }
      const label = cells[0].replaceAll('"', "");
      let total = 0;
      for (let i = 1; i < cells.length; i += 1) total += Number.parseFloat(cells[i].replace(",", ".")) || 0;
      rows.push({ label, total });
      if (rows.length > keep) rows.shift();
    };

    const unzip = new Unzip();
    unzip.register(UnzipInflate);
    unzip.onfile = (file) => {
      // Exact name: the archive also carries "__MACOSX/._LD2011_2014.txt",
      // Apple metadata that must not be read as data.
      if (file.name !== DATA_FILE) return;
      file.ondata = (error, chunk, final) => {
        if (error) return reject(error);
        pending += decoder.decode(chunk, { stream: !final });
        const lines = pending.split(/\r?\n/);
        pending = lines.pop() ?? "";
        for (const line of lines) handleLine(line);
        if (final) {
          handleLine(pending);
          resolve({ rows, clients });
        }
      };
      file.start();
    };

    createReadStream(ZIP_PATH)
      .on("data", (chunk) => unzip.push(chunk))
      .on("end", () => unzip.push(new Uint8Array(0), true))
      .on("error", reject);
  });
}

/** Day a reading belongs to: the label marks the END of its 15 minutes. */
function dayOf(label) {
  const [date, time] = label.split(" ");
  if (time !== "00:00:00") return date;
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function isLastSunday(date, month) {
  const d = new Date(`${date}T00:00:00Z`);
  if (d.getUTCMonth() !== month || d.getUTCDay() !== 0) return false;
  const next = new Date(d);
  next.setUTCDate(d.getUTCDate() + 7);
  return next.getUTCMonth() !== month;
}

/** Applies the documented daylight-saving conventions (see header). */
function correctDaylightSaving(rows) {
  const inDstWindow = (label) => /\s0(1:(15|30|45)|2:00):00$/.test(label);
  for (const row of rows) {
    const date = row.label.slice(0, 10);
    if (inDstWindow(row.label) && isLastSunday(date, 9)) row.total /= 2; // October: two hours summed
  }
  for (let i = 0; i < rows.length; i += 1) {
    const date = rows[i].label.slice(0, 10);
    if (rows[i].total === 0 && inDstWindow(rows[i].label) && isLastSunday(date, 2)) {
      // March: the missing hour reads zero for every client → interpolate.
      let a = i - 1;
      let b = i + 1;
      while (a >= 0 && rows[a].total === 0) a -= 1;
      while (b < rows.length && rows[b].total === 0) b += 1;
      const left = rows[a]?.total ?? rows[b].total;
      const right = rows[b]?.total ?? left;
      rows[i].total = (left + right) / 2;
    }
  }
}

await download();
const sha256 = createHash("sha256").update(readFileSync(ZIP_PATH)).digest("hex");
console.log(`Archive sha256 ${sha256}`);
console.log("Reading the archive (streaming, last days only) …");
const { rows, clients } = await readLastRows((DAYS + 1) * READINGS_PER_DAY + 1);
correctDaylightSaving(rows);

// Group into complete days.
const byDay = new Map();
for (const row of rows) {
  const day = dayOf(row.label);
  if (!byDay.has(day)) byDay.set(day, []);
  byDay.get(day).push(row.total);
}
const complete = [...byDay.entries()].filter(([, values]) => values.length === READINGS_PER_DAY);
const window = complete.slice(-DAYS);
if (window.length !== DAYS) throw new Error(`Expected ${DAYS} complete days, found ${window.length}.`);

// 15-minute → 30-minute: average consecutive pairs.
const halfHourly = window.map(([date, values]) => ({
  date,
  values: Array.from({ length: SAMPLES_PER_DAY }, (_, i) => (values[2 * i] + values[2 * i + 1]) / 2),
}));

const all = halfHourly.flatMap((d) => d.values);
const min = Math.min(...all);
const max = Math.max(...all);
const days = halfHourly.map((d) => ({
  date: d.date,
  values: d.values.map((v) => Math.round(((v - min) / (max - min)) * 1000)),
}));

const first = days[0].date;
const last = days.at(-1).date;
const fmt = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const source = `/**
 * GENERATED by scripts/prepare-hero-data.mjs — do not edit by hand.
 *
 * Source: Trindade, A. (2015). ElectricityLoadDiagrams20112014 [Dataset].
 *         UCI Machine Learning Repository. https://doi.org/10.24432/C58C86
 * Licence: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
 * Archive: ${URL_ARCHIVE}
 *          sha256 ${sha256}
 * Changes made: the ${clients} clients were summed into total demand, 15-minute
 * readings were averaged into 30-minute values, and the window was normalised
 * to integers 0–1000 (0 = ${min.toFixed(0)} kW, 1000 = ${max.toFixed(0)} kW).
 *
 * Window: the last ${DAYS} complete days of the dataset, ${fmt(first)} to ${fmt(last)}.
 * Each entry is one day, ${SAMPLES_PER_DAY} values from 00:00 to 24:00 (Portuguese time).
 *
 * THE AMBER RING (the "now" marker) is the LAST entry: ${fmt(last)}, the final
 * complete day of the dataset. It is NOT today's date.
 */
export interface RingDay {
  date: string;
  values: readonly number[];
}

export const RING = {
  dataset: "UCI ElectricityLoadDiagrams20112014",
  citation: "Trindade, A. (2015). ElectricityLoadDiagrams20112014 [Dataset]. UCI Machine Learning Repository.",
  doi: "10.24432/C58C86",
  licence: "CC BY 4.0",
  clients: ${clients},
  unit: "kW",
  minKw: ${Math.round(min)},
  maxKw: ${Math.round(max)},
  samplesPerDay: ${SAMPLES_PER_DAY},
  first: "${first}",
  last: "${last}",
  days: [
${days.map((d) => `    { date: "${d.date}", values: [${d.values.join(",")}] },`).join("\n")}
  ] as readonly RingDay[],
} as const;
`;

mkdirSync(fileURLToPath(new URL("../src/data/", import.meta.url)), { recursive: true });
writeFileSync(OUT_PATH, source);
console.log(`Wrote ${OUT_PATH}: ${DAYS} days, ${first} → ${last}, ${source.length} bytes.`);
