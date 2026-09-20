# TA-LLM website — project memory

## Project
Website of the research project **TA-LLM — Large Language Models: a matter of time?**
- PI: Prof. Luca Cagliero, DAUIN, Politecnico di Torino
- Funding: MUR, Fondo Italiano per la Scienza (FIS 2), project code FIS-01152, CUP E53C25001820001
- Duration: 18/08/2026 – 17/08/2029
- Goals: (1) LLMs + time series, (2) temporal misalignment in multimodal data, (3) time-aware LLM approaches with drift detection.
- Four starting research themes (non-binding), each with a PhD student, supervisor and co-supervisor.
  Site order and numbering (set 2026-09-18, the reverse of the original call):
  1. Agentic AI for Advanced Temporal Reasoning (co-supervisor: S. Chiusano; PhD: Giorgio Bongiovanni)
  2. Topology-Aware Temporal Reasoning (co-supervisor: F. Vaccarino; PhD: Enrico Maria Ferrari)
  3. Continual Learning for Generative Models (co-supervisor: E. Baralis; PhD: Michele Pantaleo)
  4. Time-Aware RLAIF (co-supervisor: P. Garza; PhD: Davide Benotto)
- Postdoctoral researcher: Lorenzo Vaiani (added 2026-09-19; no theme assigned yet).
- People profile links (`polito`, `linkedin` in the people collection): PoliTo staff pages
  checked on polito.it; LinkedIn added only when the profile is verifiably that person
  (faculty so far). Project code: GitHub organization https://github.com/TA-LLM (footer).
- Portraits (2026-09-19): photos supplied by the user in `images/people/` (git-ignored), cut
  out by the user with rembg (`u2net_human_seg`) into `images/people/nobg/`, then
  `scripts/prepare-portraits.mjs` crops a square around each face and keeps the cut-out
  transparent (edge alpha tightened against halos) → `src/assets/people/*.webp`, set in the
  card's circle via `astro:assets` (1x/2x). One ground for everyone (user), tried white first,
  then chosen: the circle's `--surface-raised` (#1A1F2A on ink, #EAE5DC on paper). Six so far: the five faculty and L. Vaiani.

## Sources (read before writing content)
- `sources/private/general_project_info.txt` — official abstract and project data
- `sources/private/research-themes/*.pdf` — draft descriptions of the four themes
- `research/moodboard/` — screenshots of reference sites
- `research/notes/` — design and content analyses
Files in `sources/private/` are drafts: NEVER copy them into the public site verbatim
and never publish them. Rewrite content and ask before publishing.
**Exception (user decision, 2026-09-18):** the four theme descriptions are published
with the **exact text** of `research-themes/*.pdf` (two typos fixed: innovative, interpret) (opening paragraph, Context,
Challenges, Research objectives, Tentative work plan, Bibliography) in
`src/content/themes/`. The PDFs themselves, contacts, skills and venues stay private.
**Exception (user decision, 2026-09-20):** /about publishes the **exact text** of the
abstract in `general_project_info.txt` — its first sentence as the lede, the rest of the
abstract in "The project", and the three goals verbatim under "Three goals" (two typos
fixed: "How ever" -> "However", "and and promptly" -> "and promptly"). The file itself and
the other project data in it stay private.

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
- Type: display face **decided (D6, 2026-09-18): Gelasio 400** — an OFL serif
  metric-compatible with Georgia, chosen for Georgia's qualities: solid bracketed serifs,
  low stroke contrast (2.3–2.7:1), generous x-height (0.48 em); authoritative, not
  editorial. **Weight 400 in both themes**, no heavier cut for light. Georgia is the
  unadjusted fallback (same metrics, no shift). Fraunces was tested and rejected: at
  `opsz` auto its display cut reaches 13:1 contrast, and its `g`/`a` stay too
  characterful even at low `opsz`. Text sans **still open** among five OFL candidates — Public Sans,
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
  - Hero object (**D5 revised 2026-09-18**, replaces the data ring): **a looping
    video of an hourglass in the right column** (AI-generated with ElevenLabs, 5 s,
    seamless, muted, no audio track), cropped to 2:3, poster = its first frame. It sits
    on an ink ground with `mix-blend-mode: lighten`, which lifts its darker background
    to exactly ink: never a visible rectangle. The hero is an ink surface in both
    themes. The ring, its UCI data and credits were removed (`taste.md` D5).
  - Hero motion: plays only when on-screen in a visible tab (`IntersectionObserver` +
    `visibilitychange`); reduced motion checked in JS at start **and on change** —
    paused on the poster frame. Any future hero canvas stays **2D, not WebGL**, with
    DPR capped (`taste.md` D7).
- Motion system (2026-09-18, "premium, not mediocre"): one choreography, one easing
  (`--ease`), one stagger step. **Reveals** via `data-reveal` (rise), `="mask"` (headings
  unveiled), `="line"` (rules), `data-reveal-children` (rendered Markdown), staggered per
  batch in `src/scripts/reveal.ts`; hidden states only under `html.motion`, set before
  paint in `Head.astro` and never under reduced motion, with a 2.5 s fail-safe.
  **Cross-document view transitions**: header fixed (`site-header`), content crossfades,
  a theme's glyph and title travel between /research and its page (`glyph-*`,
  `title-*`, class `vt-title`). **Theme switch** = circular reveal from the toggle.
  Hover: underlines enter left and leave right; theme rows draw a rule in their colour
  and play their glyph. New pages should use these hooks, not new motion.
- Icons (added 2026-09-18 at the user's request, superseding the `taste.md` §2.2 note
  "no icon set is needed"): **utility icons** in `src/icons/icons.ts` via `Icon.astro` —
  20×20 grid, 1.5px stroke, round caps, `currentColor`, always neutral; **four theme
  glyphs** in `ThemeGlyph.astro` — 48×48, non-scaling 1.5px stroke, each drawn from the
  idea at the centre of its theme text (chosen by the user from three candidates each:
  agent loop + tool, filtration ring + barcode, task curves that stay high, preference
  checks along a drifting series), the only coloured marks (theme colour on focus in lists, as the page accent on
  theme pages, where they animate only under `prefers-reduced-motion: no-preference`).
  Links ending in an arrow use `.link-arrow` + the `arrow-right` icon, not a "→" glyph.
  **More icons (2026-09-19, user request, "like 21st.dev/community/icons"):** Lucide
  (listed there; ISC licence, verified at its repo, text in `src/icons/LICENSE-lucide.txt`)
  in `LUCIDE`, 24×24 grid with stroke 1.8 so it renders as our 1.5px at 20px; brand marks
  (GitHub, Simple Icons CC0) in `BRANDS`, filled. Same neutral rule. Used as pictograms
  that say the kind of a fact: Tag `icon` (hero, People, About), About funding list,
  Collaborate audiences and Open positions, footer Contact/Code. Credited in /about Credits.
- Badges (2026-09-19, from `research/moodboard/_taste/badges`): `Badge.astro` — a pill
  (the one fully rounded shape on the site) with name + mono role on a solid surface and a
  smoke texture at the right end (`--badge-smoke`: seamless SVG turbulence, gradient-mapped
  ink → ink-blue → deep amber → amber; paper → deep amber in light). Not a live shader;
  it drifts only on hover/focus/active and never under reduced motion; text never sits on
  the smoke. Used for supervisors, co-supervisors and PhD students (research list, theme
  pages linking to `/people/#id`, home accordion) and the PI tag (`label` variant).
- Amber tags (2026-09-19, user asked for a livelier site): `Tag.astro` — short facts in
  the mono label style on an amber pill, in a `ul.tags` row. `solid` (amber fill, ink text,
  8.41:1) at most one per row, for the key fact; `soft` (default: amber wash + amber text
  and rule, `--tag-soft-*`, 6.3:1+, in the contrast gate); `dot` for open/live states,
  breathing only without reduced motion. Used on Home hero (MUR · FIS 2, dates, PoliTo),
  Research, People, Collaborate (open to researchers/companies, calls via PoliTo), About
  funding and every empty state ("Coming soon"). Not on theme pages or the themes
  accordion, whose accent is the theme colour. Facts only, never invented claims.
- Page backdrops (2026-09-19, `Backdrop.astro` + `scripts/prepare-backdrops.mjs`): one
  illustration per page, top-right behind the opening, on Research, Publications and
  Events (Collaborate and Resources use a full-page picture instead, below). Sources: AI-generated images or free-licence photos (Pexels, licence checked
  at the source), cropped and gradient-mapped into the palette (ink → deep amber → amber →
  pale gold). Blended with `lighten` over ink (inverted + `multiply` over paper), masked
  on all four sides, never under text: no edge may ever be visible. Lists over a backdrop
  use transparent rows ruled with borders, not a 1px gap over a rule-coloured ground.
  **Image motion** (2026-09-19, `src/scripts/media-motion.ts` + base.css,
  `data-media-motion`): each page image comes into focus once as it enters (fade 1.8 s,
  sharpening 3 s, gentle curves) and then plays one slow movement chosen for its subject —
  Research `flow` (along the trails), Publications `push` (lean in to the letter), Events
  `turn` (the clock spiral, one turn per 4 min), Collaborate `drift` (clouds). Transforms
  on the `<img>` only; on-screen and visible tab only; nothing under reduced motion. Reframe
  an image by cropping the asset (prep script), never by a CSS zoom: a scaled image inside
  a masked, blended frame leaks 1px past the mask at fractional edges in Chrome.
  **Full-page pictures** (`PageScene.astro`; Collaborate, then Resources — a hand touching a
  dissolving clock, `push`) are the exception to the grading (user decision, 2026-09-19): the
  AI-generated picture (upscaled 4x with Topaz, encoded at 2400px) is used in its **original colours**, unblended, in both themes,
  filling the page (desktop: sticky behind the content, text on the left over a veil of
  `--surface` that clears towards the figure; phones: a full-width opening image the
  content rises over). The text may overlap the picture slightly. Page blocks go in a
  `.scene-content` wrapper. `veil="narrow"` (short page, subject mid-picture) applies only to
  dark pictures on ink; the light theme keeps the wide veil.
  `fit="height"` (Collaborate, 2026-09-19: "zoom much less, show it almost whole"): on desktop
  the portrait picture stands at the screen's height on the right (zoom 1.1), its left edge
  fading into the page, instead of filling the width.
  Home hero: the video has no loop of its own on top (it already moves): it comes into
  focus like the others (`focus`), its poster fades out once it plays, and leaving the
  hero it recedes with the scroll (CSS `animation-timeline: scroll()`, longhands only —
  the `animation` shorthand resets the timeline; the poster never takes the dimming).
  The amber "?" (2026-09-19; a scale-and-glow beat and then a gilded sheen were rejected):
  its dot is a grain of sand — drawn as a second "?" clipped to the dot, it sinks 0.16em and
  fades once per loop of the glass, then re-forms in place; locked to the video's clock,
  still when paused or under reduced motion.
- Institution logos (2026-09-19, `InstitutionLogos.astro` + `scripts/prepare-logos.mjs`):
  MUR (funder), DAUIN–PoliTo lockup (host; it includes the PoliTo seal, so no separate
  PoliTo logo) and MINDS (group), as one-colour masks of their own artwork
  (`--institution-mark`: paper on ink, ink on paper). Same size = same area, centred on
  one line; one row on phones. In the footer (every page) and in /about Funding.
  Exception (user, 2026-09-19): the DAUIN–PoliTo lockup is boosted ×1.5 (×1.15 on phones),
  its fine type was unreadable at equal area. Every row sizes itself from its own width
  (container query) so it never wraps, from 320px up.
- Home vision (2026-09-20, `HomeVision.astro` + `GoalGlyph.astro`): right after the hero,
  the project in the record's own words (the heading "Making LLMs aware of time" is ours)
  and the three goals. Not cards: the three stand along **one rule that runs across the
  section** as a time axis, each ticked in amber, each opening with a **drawing of its own
  problem** — a sampled series, three tracks slipping around one instant, and (third one, after four attempts
  the user rejected) **the sum written out**, as the user asked: their two reference marks
  redrawn in the site's line — the LLM plate wired into a brain, and a solid hourglass with
  amber sand — a **+** between them, the reference's **merge arrow**, then the **result**:
  an hourglass whose upper chamber holds the brain, its knowledge falling as amber sand into
  the chamber below. All three drawings are set to one height (`.goal__art`, 5.5rem) so the
  section's rule stays continuous; this one is wider and takes the whole column. Bespoke inline SVG on the site's 1.5px non-scaling stroke, one amber accent each;
  drawn on reveal, looping only while on screen in a visible tab, nothing under reduced
  motion. /about keeps the full abstract.
- Texture band (2026-09-20, `TextureBand.astro` + `scripts/prepare-texture.mjs`): the
  "Dark gitter gold" gradient of `research/moodboard/_taste/background` (21st.dev),
  rasterised once from its parameters (Bayer-dithered cell grid, 20° ramp, grain, vignette)
  — the CSS in the prompt is only an approximation. A **separator, never a ground for
  text**: one band on Home, between the vision and the themes, top and foot faded to
  nothing. **Animated** (user, 2026-09-20), as the reference is: `src/scripts/texture-band.ts`
  redraws the ~3,000 cells on a 2D canvas from a rAF clock, the ramp sliding along the grid;
  drawn cell by cell (never pixel by pixel), colours from a 512-step LUT, 30 fps, DPR capped
  at 1.5, running only on screen in a visible tab, the phase carried across pauses, nothing
  under reduced motion. The still lies behind it (ground before the first frame, no-JS and
  reduced-motion state, and it carries the grain). Dark on ink; inverted + `multiply` on
  paper, like the backdrops.
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
  On every page assert no horizontal overflow with
  `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
  Do **not** compare with `innerWidth`: on desktop browsers it includes the classic
  scrollbar (15px in Chrome on Windows), so it fails even when nothing overflows. Under
  mobile emulation (`isMobile`, overlay scrollbars) `scrollWidth === innerWidth` also holds.
- Save reference screenshots to `research/moodboard/<site>/`.
- Use the Astro Docs MCP for Astro documentation, and Context7 for other libraries,
  instead of guessing APIs.
- Use the Chrome DevTools MCP to check performance and the console.
- Prototype the animated hero background with the `algorithmic-art` skill.
- Explore palette variants with `theme-factory`; use `frontend-design` for aesthetic choices.
- Commands: `npm run dev`, `npm run build`, `npm run preview`.
- Commit messages in English, conventional commits (feat:, fix:, content:, style:).
