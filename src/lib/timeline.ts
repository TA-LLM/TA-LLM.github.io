import { PROJECT } from "../config/site";

const DAY = 24 * 60 * 60 * 1000;

/** Project span in UTC milliseconds: start of the first day, end of the last. */
export const PROJECT_START = Date.parse(`${PROJECT.start}T00:00:00Z`);
export const PROJECT_END = Date.parse(`${PROJECT.end}T00:00:00Z`) + DAY;

const startDate = new Date(PROJECT_START);
export const PROJECT_MONTHS =
  (new Date(PROJECT_END).getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
  (new Date(PROJECT_END).getUTCMonth() - startDate.getUTCMonth());

/** Fraction of the project elapsed at `now`, clamped to [0, 1]. */
export function projectProgress(now: number): number {
  const p = (now - PROJECT_START) / (PROJECT_END - PROJECT_START);
  return Math.min(1, Math.max(0, p));
}

/** 1-based project month at `now` (month 1 starts on the start date). */
export function projectMonth(now: number): number {
  const d = new Date(now);
  let months =
    (d.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
    (d.getUTCMonth() - startDate.getUTCMonth());
  if (d.getUTCDate() < startDate.getUTCDate()) months -= 1;
  return Math.min(PROJECT_MONTHS, Math.max(1, months + 1));
}

export function progressLabel(now: number): string {
  const pct = Math.round(projectProgress(now) * 100);
  return `Project timeline: month ${projectMonth(now)} of ${PROJECT_MONTHS}, ${pct}% elapsed (18 August 2026 to 17 August 2029)`;
}
