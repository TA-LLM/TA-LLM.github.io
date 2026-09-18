import { existsSync, readFileSync } from "node:fs";

const BIB_PATH = "src/content/publications.bib";

/**
 * Loader for the `publications` collection.
 *
 * The project started on 18/08/2026 and has no publications yet, so this
 * returns an empty list. The BibTeX parser is implemented in Phase 4, together
 * with the Publications page; until then a non-empty .bib file fails the build
 * loudly instead of being silently ignored.
 */
export async function loadPublications(): Promise<Array<{ id: string } & Record<string, unknown>>> {
  if (!existsSync(BIB_PATH)) return [];
  const source = readFileSync(BIB_PATH, "utf8");
  const hasEntries = /@\w+\s*\{/.test(source);
  if (hasEntries) {
    throw new Error(
      `${BIB_PATH} contains entries, but the BibTeX parser is not implemented yet (Phase 4).`,
    );
  }
  return [];
}
