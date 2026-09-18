/**
 * Utility icons: a 20×20 grid, 1.5px stroke, round caps and joins, no fills —
 * the same drawing as the header's menu and theme-toggle icons. Each entry is
 * the inner markup of an <svg viewBox="0 0 20 20">, drawn in currentColor, so
 * an icon always takes the colour of the text beside it.
 *
 * Icons are neutral by rule: colour belongs to the theme glyphs
 * (ThemeGlyph.astro), one accent per view.
 */
export const ICONS = {
  "arrow-right": `<path d="M3.5 10h12.5M11.5 5.5 16 10l-4.5 4.5"/>`,
  external: `<path d="M6 14 14.5 5.5M7.5 5.5h7v7"/>`,
  calendar: `<rect x="3" y="4.5" width="14" height="12.5" rx="1.5"/><path d="M3 8.5h14M7 2.5v4M13 2.5v4"/><path d="M6.5 12h1M9.5 12h1M12.5 12h1M6.5 14.5h1M9.5 14.5h1"/>`,
  paper: `<path d="M5 2.5h7l3.5 3.5v11.5H5z"/><path d="M12 2.5V6h3.5M7.5 10h5.5M7.5 12.75h5.5M7.5 15.5h3"/>`,
  dataset: `<ellipse cx="10" cy="5" rx="6" ry="2.5"/><path d="M4 5v10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5M4 10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5"/>`,
  people: `<circle cx="7.5" cy="7" r="2.75"/><path d="M2.5 16.5c.6-2.8 2.6-4.5 5-4.5s4.4 1.7 5 4.5"/><circle cx="14" cy="7.75" r="2.25"/><path d="M14.25 12c1.8.1 3 1.5 3.25 3.75"/>`,
  news: `<path d="M3 4.5h10.5V16H5a2 2 0 0 1-2-2z"/><path d="M13.5 8H17v6a2 2 0 0 1-2 2h-1.5M6 8h4.5M6 10.75h4.5M6 13.5h2.5"/>`,
  mail: `<rect x="2.5" y="4.5" width="15" height="11" rx="1.5"/><path d="m3 5.5 7 5.5 7-5.5"/>`,
  collaborate: `<circle cx="7.5" cy="10" r="4.75"/><circle cx="12.5" cy="10" r="4.75"/>`,
  hourglass: `<path d="M5 2.5h10M5 17.5h10"/><path d="M6.5 2.5c0 4 7 4.5 7 7.5s-7 3.5-7 7.5M13.5 2.5c0 4-7 4.5-7 7.5s7 3.5 7 7.5"/>`,
} as const;

export type IconName = keyof typeof ICONS;
