/**
 * DEV-ONLY FIXTURES — obviously fake content used to design sections that are
 * still empty. Loaded exclusively behind `import.meta.env.DEV`, so production
 * builds never include them; scripts/check-dist.mjs fails the build if the
 * FIXTURE marker ever reaches dist/.
 */
import type { NewsItem } from "../lib/entries";

export const news: NewsItem[] = [
  {
    id: "fixture-1",
    title: "FIXTURE — Placeholder announcement for layout testing",
    date: new Date("2026-09-01"),
    type: "announcement",
    summary: "FIXTURE — not real news. Exists only in the development server.",
    isFixture: true,
  },
  {
    id: "fixture-2",
    title: "FIXTURE — Placeholder explanatory post with a longer title that wraps",
    date: new Date("2026-08-20"),
    type: "blog",
    summary: "FIXTURE — not real content. Tests wrapping and the blog type label.",
    isFixture: true,
  },
];
