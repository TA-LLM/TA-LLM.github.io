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
deepmind.google, anthropic.com, aioniclabs.ai (closest topic: Time Series Language
Models, OpenTSLM), agenticsystemslab.org (academic lab with startup-style site).

## Stack
- Astro (static), content collections for `people`, `publications`, `events`, `news`, `themes`
- Publications generated from `src/content/publications.bib`
- Deploy: GitHub Actions → GitHub Pages, org `ta-llm`, repo `ta-llm.github.io`
- Custom domain (ta-llm.io) added later via `public/CNAME`
- No cookies / no tracking without consent. English first.

## Design system
- Concept: "Time, made visible" — flowing time series, persistence rings/barcodes, token streams.
- Colors (define as CSS tokens on :root, dark default + light theme):
  - ink `#0F1420` (bg), paper `#F3EEE4` (text / light bg), amber `#E6A23C` (brand accent, the "?")
  - theme colors: RLAIF amber `#E6A23C`, CL sage `#7FB3A0`, Topology violet `#8E7CC3`, Agentic ice `#6FA8DC`
- Type: display serif (Instrument Serif or Fraunces), text sans (Inter or Geist), mono (JetBrains Mono). Self-host fonts.
- Layout: restrained UI, strong hierarchy through size and spacing; one accent per view.
- Motion: subtle, purposeful; always honor `prefers-reduced-motion`; no layout shift;
  hero animation on canvas, lazy-started, paused when off-screen.
- Accessibility: WCAG AA contrast, keyboard navigation, alt text on every image.

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
- Use Context7 for up-to-date Astro and library docs instead of guessing APIs.
- Commands: `npm run dev`, `npm run build`, `npm run preview`.
- Commit messages in English, conventional commits (feat:, fix:, content:, style:).
