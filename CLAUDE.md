# TA-LLM website — project memory

## Project
Website of the research project **TA-LLM — Large Language Models: a matter of time?**
- PI: Prof. Luca Cagliero, DAUIN, Politecnico di Torino
- Funding: MUR, Fondo Italiano per la Scienza (FIS 2), project code FIS-01152, CUP E53C25001820001
- Duration: 18/08/2026 – 17/08/2029
- Goals: (1) LLMs + time series, (2) temporal misalignment in multimodal data, (3) time-aware LLM approaches with drift detection.
- Four starting research themes (non-binding), each with a PhD student, supervisor and co-supervisor:
  1. Time-Aware RLAIF (co-supervisor: P. Garza)
  2. Continual Learning for Generative Models (co-supervisor: E. Baralis)
  3. Topology-Aware Temporal Reasoning (co-supervisor: F. Vaccarino)
  4. Agentic AI for Advanced Temporal Reasoning (co-supervisor: S. Chiusano)

## Sources (read before writing content)
- `sources/private/general_project_info.txt` — official abstract and project data
- `sources/private/research-themes/*.pdf` — draft descriptions of the four themes
- `research/moodboard/` — screenshots of reference sites
- `research/notes/` — design and content analyses
Files in `sources/private/` are drafts: NEVER copy them into the public site verbatim
and never publish them. Rewrite content and ask before publishing theme details.

## Reference sites (visual benchmark)
Closest to us, already analysed in detail — see Decisions below:
- aioniclabs.ai — closest topic (Time Series Language Models, OpenTSLM); light, multi-page
- agenticsystemslab.org — academic lab with a startup-style site; dark, single-page

Second batch, by category:
- Frontier labs: deepmind.google, anthropic.com
- Labs with a strong identity: sakana.ai, isomorphiclabs.com
- Research institutes: allenai.org, mila.quebec, vectorinstitute.ai
- University labs: bair.berkeley.edu, hai.stanford.edu
- Networks and funded projects: ellis.eu, future-ai-research.it

## Stack
- Astro (static), content collections for `people`, `publications`, `events`, `news`, `themes`
- Implementation: **Astro components + CSS custom properties + small vanilla TypeScript**.
  No React, no Tailwind. Component prompts saved from React/shadcn registries are
  behavioural specs to rebuild, never code to port (`research/notes/taste.md` D12).
- Publications generated from `src/content/publications.bib`
- Repo: org `TA-LLM`, repository `TA-LLM/TA-LLM.github.io`
- Deploy: GitHub Pages. Currently on **legacy build type** (Jekyll from `main` root),
  which renders `README.md` as the homepage. Switch it to GitHub Actions on the first
  Astro deploy, otherwise Jekyll processes the repo instead of publishing the build output.
- Branch `main`: **deliberately left unprotected** while the repository has a single
  contributor (checked 2026-09-17 — no ruleset, no classic protection, force push still
  possible). TODO: add a ruleset blocking force push and branch deletion as soon as other
  people start contributing to the site.
- Custom domain (ta-llm.io) added later via `public/CNAME`
- No cookies / no tracking without consent. English first.

## Design system
- Concept: "Time, made visible" — flowing time series, persistence rings/barcodes, token streams.
- Colors (define as CSS tokens on :root, dark default + light theme):
  - **ink is the default everywhere**, data-dense pages included; `/publications` gets an
    ink vs paper A/B in the mockup before this is final. The **light theme is a real
    alternative** reachable from the theme toggle, designed and checked component by
    component — never a derived fallback (`taste.md` D1).
  - ink `#0F1420` (bg), paper `#F3EEE4` (text / light bg), amber `#E6A23C` (brand accent, the "?")
  - theme colors: RLAIF amber `#E6A23C`, CL sage `#7FB3A0`, Topology violet `#8E7CC3`, Agentic ice `#6FA8DC`
  - light theme: the colours above are for fills, borders and graphics only — never for
    text, where they all fail AA on paper (1.89:1 to 3.12:1). For text use the darkened
    variants: amber `#8A5A10` (5.11:1), sage `#356B58` (5.35:1), violet `#6A55A8`
    (5.22:1), ice `#2F6DA3` (4.73:1). Ratios measured against paper `#F3EEE4`.
  - dark theme: amber on ink is 8.4:1 and paper on ink 15.9:1, so no variants needed.
- Type: display face **still open** — a serif or a sans, decided by a side-by-side test
  at hero size in the mockup (`taste.md` D6). If the serif wins it is **Fraunces**,
  preferred over Instrument Serif for its `opsz` axis, with its `SOFT` and `WONK` axes
  pinned to sober values. Text sans **still open** among five OFL candidates — Public Sans,
  Source Sans 3, IBM Plex Sans, Instrument Sans, Archivo — decided by comparing them at
  16px in the same mockup pass. Mono: JetBrains Mono.
- Fonts: self-hosted, **at most five faces** (display regular, sans regular, sans medium,
  mono regular, one italic only if the content needs it), **WOFF2 only**, **Latin subset**,
  `font-display: swap` with **metric-matched fallback** faces so the swap causes no layout
  shift.
- Layout: restrained UI, strong hierarchy through size and spacing; one accent per view.
  **No shadows anywhere** — separation comes from surface change (ink ↔ paper) and 1px
  rules. Radius **0** inside ruled grids and rows, **8–12px** on standalone surfaces
  (mega-menu panel, paper blocks, hero frame) (`taste.md` D2).
- Motion: subtle, purposeful; always honor `prefers-reduced-motion`; no layout shift;
  hero animation on canvas, lazy-started, paused when off-screen.
  - Hero object: **one luminous ring built from a real time series** — its radius
    modulated by the series values — amber on ink. Not a generic decorative glow.
    Fallback if the ring does not work: a field of flowing lines (`taste.md` D5).
  - Hero canvas is **2D, not WebGL**. Reduced motion checked in JS at start **and on
    change** (one static frame, no loop); device pixel ratio **capped**; loop paused by
    `IntersectionObserver` and `visibilitychange` (`taste.md` D7).
- Accessibility: WCAG AA contrast, keyboard navigation, alt text on every image.

## Decisions from the reference-site analysis
Taken from `research/notes/reference-sites-aionic-agenticsystemslab.md`:
- Grids use a **1px gap** so cards butt together and read as one ruled table — no shadows.
- **Publications** is a timeline grouped by year: year as a mono heading, each paper as
  plain body-size text. No cards, no thumbnails.
- **Fluid type** with `clamp()` across the whole scale — neither reference site has it.
- Motion in two layers: **canvas behind the hero**, **animated inline SVG** for the
  concepts themselves, where the movement is the subject.
- Editing: Astro content collections + **Pages CMS** (a hosted GitHub App, so no OAuth
  proxy to run — unlike Decap, which GitHub Pages cannot host).
- Research **themes are native Astro pages**, never external links: they are the project's
  core scientific content.
- **Applications go to an external form** (PoliTo-hosted): a Git-based CMS would turn every
  submission into a commit in a public repo, so CVs and personal data must never enter
  this repository's history.

## Information architecture
Home (hero, Why TA-LLM comparison, 3 goals, 4 themes 01–04, latest papers, opportunities,
events, team, partners + MUR funding, contact) · Research (+ one page per theme) ·
Publications (filterable, one page per key paper) · People · Resources · Events ·
News · Join us (students / researchers / industry) · About.

## Working rules
- Work in small, reviewable steps; propose a plan before structural changes.
- After any visual change: run the dev server and use the Playwright MCP to take
  desktop (1440px) and mobile (390px) screenshots, then self-review against this file.
- Save reference screenshots to `research/moodboard/<site>/`.
- Use the Astro Docs MCP for Astro documentation, and Context7 for other libraries,
  instead of guessing APIs.
- Use the Chrome DevTools MCP to check performance and the console.
- Prototype the animated hero background with the `algorithmic-art` skill.
- Explore palette variants with `theme-factory`; use `frontend-design` for aesthetic choices.
- Commands: `npm run dev`, `npm run build`, `npm run preview`.
- Commit messages in English, conventional commits (feat:, fix:, content:, style:).
