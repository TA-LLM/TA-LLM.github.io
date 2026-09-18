import type { APIRoute } from "astro";
import { LAUNCHED } from "../config/site";

/** While unlaunched, nothing is crawled; at launch the sitemap is advertised. */
export const GET: APIRoute = ({ site }) => {
  const body = LAUNCHED
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap-index.xml", site)}\n`
    : "User-agent: *\nDisallow: /\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
