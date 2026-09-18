import { getCollection } from "astro:content";

export interface NewsItem {
  id: string;
  title: string;
  date: Date;
  type: "announcement" | "blog";
  summary: string;
  isFixture: boolean;
}

/**
 * News entries, newest first. Real content only in production; in the dev
 * server, clearly-marked fixtures are appended so empty sections can be
 * designed. The dynamic import sits behind a compile-time constant, so the
 * fixture module is dropped from production builds.
 */
export async function getNews(): Promise<NewsItem[]> {
  const real: NewsItem[] = (await getCollection("news")).map((entry) => ({
    id: entry.id,
    title: entry.data.title,
    date: entry.data.date,
    type: entry.data.type,
    summary: entry.data.summary,
    isFixture: false,
  }));

  let items = real;
  if (import.meta.env.DEV) {
    const { news } = await import("../fixtures/news");
    items = [...real, ...news];
  }
  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}
