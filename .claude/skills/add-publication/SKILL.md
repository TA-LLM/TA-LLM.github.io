---
name: add-publication
description: Add a new paper to the TA-LLM website from a BibTeX entry, arXiv link or PDF. Use when someone asks to add, publish or announce a publication.
---
# Add a publication

1. Collect: BibTeX (required), venue and year, research theme(s) 01–04,
   links (PDF/arXiv, code, Hugging Face, project page, video, poster), a 2–3 sentence
   plain-English summary, one key figure if available.
2. Append the BibTeX entry to `src/content/publications.bib` with a stable key
   (`firstauthorYEARkeyword`). Do not duplicate existing keys.
3. Add the extra metadata (themes, links, summary, featured flag) to the
   publication's metadata file following the existing schema.
4. If the paper is featured, create its dedicated page and a News item
   announcing the acceptance.
5. Run `npm run build` and fix any error. Then take a Playwright screenshot of the
   Publications page and of the paper page.
6. Never invent authors, venues, or links: ask when something is missing.
