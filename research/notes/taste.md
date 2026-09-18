# Taste — reading the personal moodboard

What the images saved in `research/moodboard/_taste/` say about the taste behind this
project, how each component reconciles with `synthesis.md`, and which conflicts need a
decision. Decisions are collected at the end (§4) so they can be answered in one pass.

> **The source images are local only and not committed.** `research/moodboard/` is
> git-ignored because it holds third-party material; the paths below will not resolve in a
> fresh clone. Shared on request.

**Method, and its limit.** 26 screenshots across 11 folders, viewed one folder at a time,
no more than eight images per pass. Unlike the reference-site notes, these are **static
screenshots, not live sites**: every observation here is visual, and colours are
approximate. Nothing is measured. Where a value matters (contrast, sizes) it is flagged to
be computed during the mockup, not asserted here.

**Inventory.**

| Folder | Images | Prompts |
|---|---|---|
| `cards/` | 9 | 6 (for `cards`, `_2`, `_3`, `_7`, `_8`, `_9`) |
| `hero/` | 5 | 3 (for `_2`, `_3`, `_4`) |
| `comparison_table/` | 2 | 1 (`_2`); `comparison_table_prompt.txt` is **empty** |
| `filter_ui/` | 2 | 2 |
| `timeline/` | 2 | 1; `timeline_2_prompt.txt` is **empty** |
| `case_study_pages/`, `footer/`, `logos_list/`, `navbar/`, `people/`, `shiny_button/` | 1 each | 1 each, except `case_study_pages/` (none) |

No folder contains a `notes.md`. Images with no prompt at all: `cards_4`, `cards_5`,
`cards_6`, `hero`, `hero_5`, `case_study_pages`.

---

## 1. What runs through the whole moodboard

Counts are over the 26 images.

1. **Dark for atmosphere, light for data.** Every atmospheric image is dark — all five
   heroes, `people`, `shiny_button`, `cards_3`, `cards_7`. Every data-dense image is light —
   both filter tables, both comparison tables, both timelines, `logos_list`, the blog list in
   `cards_6`. Not one data-dense reference sits on a dark ground. This is the most
   consequential finding here, because `synthesis.md` makes the whole site ink by default
   and uses paper only for three blocks. → **D1**

2. **One thing in focus, the rest recedes** — 7 images. `cards_3` dims its side cards,
   `cards_4` keeps one card in colour and the rest greyscale, `cards_9` blurs everything but
   the hovered card, `cards_2` is a coverflow, `people` spotlights one person,
   `comparison_table` lifts one column, `filter_ui_2` colours only the one overdue invoice.
   This is "one accent per view" as an *interaction* principle, not only a colour rule —
   and it fits `synthesis.md §1.3–1.4` exactly.

3. **Warm light on near-black** — `hero`, `hero_2`, `cards_3`, `shiny_button`, and amber as
   the single button colour in `comparison_table`. Five images reach for amber, bronze or
   cream against dark. The palette in `CLAUDE.md` is already this taste.

4. **Circles and rings** — 6 images: the portal in `hero`, the photon ring in `hero_2`, the
   lunar horizon in `hero_5`, the round portraits in `people`, the node markers in both
   timelines. `CLAUDE.md` names "persistence rings" in the concept; the moodboard wants
   them in the hero. → **D5**

5. **Hairlines and ruled grids** — 8 images: the 1px-ruled logo grid, the ruled comparison
   rows, both filter tables, the kinetic grid in `hero_3`, the faint grid behind `people`,
   the hairline rail of the nav in `hero_5`, the bordered mega-menu panel. The 1px-gap
   decision (`synthesis.md §1.1`) is squarely this taste.

6. **Tracked uppercase and mono for metadata** — 7 images: `BEST SELLERS` in `cards_3`, the
   tags in `cards_6`, the eyebrow in `cards_9`, `APPROACH` and `THIS ONE` in
   `comparison_table`, the mono invoice IDs in `filter_ui_2`, the address block and nav in
   `hero_5`, `OUR` in `people`. Matches `synthesis.md §1.12`.

7. **Where the taste pulls away from the decisions:**
   - **large radii and soft shadows** on ~11 images, against 0 radius and no shadows → **D2**
   - **carousels** on 4 images → **D3**
   - **photography** leading 10 images, for a project that will have almost none → **D4**
   - **sans-serif display** on all 5 heroes; a serif display appears in exactly one image
     (`comparison_table`), and serif as a *secondary* voice in two more (`cards_3`,
     `cards_8`) → **D6**

---

## 2. Component by component

Each entry: what the images say (composition, palette, type, space, motion) → how it
reconciles with `synthesis.md` → what conflicts, pointing to §4.

### 2.1 Hero — `hero/` (5)

**What emerges.**
- *Composition*: one dominant object and one large headline. Three of five are a single
  luminous round object — the portal ring (`hero`), the lensed accretion ring (`hero_2`), the
  moon rising from the bottom edge (`hero_5`). `hero` splits the title across the full width
  on two offset lines (`PARALLEL` left, `UNIVERSE` right).
- *Palette*: 5/5 dark. `hero` is warm cream text on slate with bronze light in the ring — the
  closest palette in the whole moodboard to paper `#F3EEE4` on ink `#0F1420`. `hero_2` is
  amber on black. `hero_3` (blue) and `hero_4` (pink/purple) are the outliers.
- *Type*: 5/5 sans — extended wide (`hero`), thin light (`hero_2`, `hero_5`), heavy bold
  (`hero_3`, `hero_4`). `hero_5` sets its address and nav in tracked mono.
- *Space*: the object frames the page; very little else above the fold.
- *Motion*: a WebGL shader (`hero_2`), a canvas grid that warps toward the pointer and
  ripples on click (`hero_3`), a framer-motion aurora (`hero_4`).

**Reconciles with the synthesis.**
- Dark default, amber, paper-on-ink: all confirmed.
- `hero_2`'s subtitle *explains what is on screen* ("the ring above the shadow is the far
  side of the disc…"). That is `batch1 §5.22` — the diagram is the argument — applied to the
  hero copy. Worth copying as a register: our hero line should describe what the animation
  shows.
- `hero_5`'s bottom navigation — labelled stops on one hairline — is a time axis used as
  navigation, the same idea as the year rail in `synthesis.md §1.15`.
- **`hero_2`'s prompt is the technical reference for our canvas.** It is the only animated
  prompt that gets the lifecycle right: `matchMedia('(prefers-reduced-motion: reduce)')`
  in JS, device pixel ratio **capped** (`Math.min(devicePixelRatio, maxDpr)`), and the loop
  paused through `IntersectionObserver` plus `visibilitychange`. That matches
  `synthesis.md §6.1–6.2` and the off-screen pause in `CLAUDE.md`, and adds one thing we
  had not specified: **a DPR cap**, which keeps a full-bleed canvas affordable on 3× phones.
  (It reads the preference once at start; whether it also listens for changes was not
  verified.)

**Conflicts.**
- Sans display vs Fraunces → **D6**.
- CTAs: `hero_2` has two, `hero_5` one. **Already settled** — the hero carries no CTA
  (`synthesis.md §0`). Recorded as taste, not reopened.
- Rendered/photographic objects (`hero`, `hero_5`) vs a generative canvas → **D4**, **D5**.
- WebGL (`hero_2`) vs a 2D canvas → **D7**. Pointer-reactive background (`hero_3`) → **D8**.
- `hero_4`: nothing to take beyond the soft radial glow; the cartoon and pink are
  off-register.

### 2.2 Navigation — `navbar/` (1)

**What emerges.** A dark, fully monochrome mega-menu. The open item becomes a filled pill;
the panel has a 1px border and a large radius and holds three grouped columns under muted
headings. Each entry is an outlined icon tile, a bold title and a one-line muted
description.

**Reconciles.** This is `synthesis.md §1.18` — themes as named nav items — with a better
shape than any reference site offered: *Research* opens onto the four themes, each with
**its question as the one-line description**. Swap the icon tiles for the mono numerals
01–04 (`§1.12`) and a 1px rule in the theme colour, and no icon set is needed. Monochrome
panel = one accent per view.

**Conflicts.** Large radius → **D2**. Desktop only: at 390 the synthesis already chose
ELLIS's full-screen overlay. Built on framer-motion → **D12**.

### 2.3 Cards — `cards/` (9)

**What emerges.**
- *Composition*: focus-and-recede on four (`_2`, `_3`, `_4`, `_9`); a bento grid (`_7`);
  a 2×2 audience grid (`_5`); alternating editorial rows (`_6`); a testimonial with a large
  numeric headline (`_8`).
- *Palette*: a colour tint per item (`cards` overlays green and purple; `_5` uses pastel
  surfaces — peach, pale blue, lavender, mint); dark with amber (`_3`); iridescent
  multicolour (`_7`).
- *Type*: bold sans titles; tracked uppercase eyebrows (`_3`, `_6`, `_9`); **serif as the
  secondary voice** — an italic serif description in `_3`, a serif pull-quote in `_8`; a
  label/value metadata table under the carousel in `_2` (Year · Producer · Length).
- *Space*: large radius (~20–28px) and soft drop shadows on 8 of 9.
- *Motion*: 3D coverflow, hover-to-expand, hover-to-focus with blur on the rest.

**Reconciles.**
- **`cards_4` is the grammar for the four themes 01–04**: the focused theme takes its colour,
  the other three stay paper/greyscale. That is `synthesis.md §1.4` (theme colour is a band
  property) turned into a hover-and-focus state.
- **`cards_5` is the grammar for Collaborate**: one tinted surface per audience, a status
  pill with a dot ("Open to visiting researchers"), a title, two lines, one text link. The
  pastel surfaces are exactly the `-100` light-theme tints of `§1.5`. Two cards, not four:
  researchers and companies (`§0`).
- `cards_2`'s label/value table is the metadata block of a paper page — Year · Venue ·
  Authors · DOI — set in mono.
- `cards_6`'s editorial rows are the News list: mono tags as eyebrows, ruled rather than
  carded, the image column dropped.
- `cards_8`'s large numeric headline is the stat band of `§1.24`.
- `cards_3` is the single card closest to our system: dark, one amber accent, a tracked
  eyebrow flanked by hairlines, ink text on an amber pill.

**Conflicts.**
- Radius and shadows → **D2**. Carousels (`_2`, `_3`, `_8`) → **D3**. Photography → **D4**.
- Serif as the secondary voice (`_3`, `_8`) bears on **D6**.
- Not adopted, no decision needed: the iridescent multicolour of `_7` (contradicts one
  accent per view, which is settled); frosted `backdrop-filter` captions over photos
  (`_7`, `_9` — contrast cannot be guaranteed over an arbitrary image); the 3D clay
  illustrations of `_5`.
- Any hover-only reveal (`_4`, `_9`) must also trigger on keyboard focus and work on touch.

### 2.4 People — `people/` (1)

**What emerges.** Dark, with a faint background grid. An oversized uppercase heading with a
grey gradient fill. Three round portraits with uppercase names and muted roles; hovering a
person raises a lighter half-disc behind them and reveals their social links.

**Reconciles.** Dark ✓, faint grid ✓, round portraits echo the ring motif, the spotlight is
focus-and-recede again. It suits the **home Team preview** (`synthesis.md §3`, home row 10).
The `/people` page itself stays a row per person with a link, role and theme
(`institutes §6 avoid 5`), with one consistent portrait treatment (`identity §5.11`).

**Conflicts (minor, no decision).** Gradient-filled heading text — contrast cannot be
computed to ≥4.5:1 across a gradient, so not adopted. Facebook/Instagram/YouTube are the
wrong networks: Google Scholar, ORCID, GitHub, Hugging Face, LinkedIn, Bluesky/Mastodon.

### 2.5 Case-study pages — `case_study_pages/` (1)

**What emerges.** A horizontal carousel of tall cards with a peek of the next one, arrows
and dots. Architectural photography of **repeating modular façades**, all sharing one cool
teal sky — a single colour treatment across every image. Title, excerpt and "Read more →"
over a dark scrim.

**Reconciles.** The unified treatment is `identity §5.11` (one photographic commission).
The repeating façade modules are rhythm — a barcode, a sampled series — and are a good
brief for generative theme-header art. In our IA a "case study" is a key-paper page or a
theme page.

**Conflicts.** Carousel → **D3**. Photography → **D4**. Text over a photo scrim fails the
computed-contrast rule unless the scrim is close to solid.

### 2.6 Comparison table — `comparison_table/` (2)

**What emerges.**
- `comparison_table`: warm off-white ground close to our paper; a **serif display
  headline**; sans body; **mono** labels (`APPROACH`, a `THIS ONE` pill); ruled rows on
  1px hairlines; ticks and em-dashes; one column lifted onto a lighter panel with a 1px
  border; **one amber button with dark text** as the only colour on the page; wry,
  essayistic copy in full sentences.
- `comparison_table_2`: SaaS pricing — a blue radial glow, bold sans, a dashed selection box
  drawn around one word, a monthly/yearly toggle, three cards with the middle one lifted
  ("Popular"), glossy buttons with drop shadows.

**Reconciles.** **`comparison_table` is the single image closest to the entire design
system** — it *is* our light theme: paper, serif display, sans text, mono labels,
hairlines, one amber accent with ink on it. It is also, almost literally, the "Why TA-LLM"
comparison of `synthesis.md §3` (home row 5): a TA-LLM column lifted against the
alternatives. Ink on an amber fill is the FAIR positive control (`networks §7.7`) and
measures the same **8.41:1** as amber on ink. The dashed box in `_2`, together with the
dashed construction lines in `logos_list`, suggests an optional "blueprint" detail.

**Conflicts.** `_2`'s blue, glow and shadows are not adopted (settled rules). Its prompt uses
`@number-flow/react` for animated numerals — if the stat band ever counts up, it must be
static under reduced motion. No decision needed.

### 2.7 Filters and data tables — `filter_ui/` (2)

**What emerges.**
- `filter_ui`: a search field and filter pills (All · Location · Min · Max · Joined after)
  above a ruled table; bold names; grey status pills with one red exception; a total-count
  footer row.
- `filter_ui_2`: the most refined image in the set. An uppercase eyebrow, title and
  subtitle; a KPI set top-right (label + large figure); a hairline; a search field with
  **"18 Results"** right-aligned; tracked uppercase sortable column headers; **mono IDs**;
  greyscale avatars; monochrome status chips with one red "Overdue"; right-aligned numbers;
  a footer "18 INVOICES" with a pager whose disabled direction is visibly muted; and a
  provenance line — **"Last updated Jun 17, 2026."**

**Reconciles.** `filter_ui_2` matches the Publications data layer point for point: the
printed result count (`§1.16`), mono identifiers — DOIs, arXiv IDs (`§1.12`), monochrome
with one accent for the exception (`§1.3`), a pager with a real disabled state (`§6.3`),
and a *last updated* line, which on our site becomes the build date in `<time datetime>` —
time made visible, again.

**Conflicts.**
- A multi-column table with a pager vs the year-timeline rows with a year rail and no pager
  (`§1.14–1.15`), and columns cannot survive 390px (`§3`: stacked, never a horizontal
  scroll) → **D9**.
- Admin affordances (row checkboxes, kebab menus) do not belong on a public page.
- The heaviest dependency stack in the set (TanStack Table, Radix, react-day-picker,
  next-themes, sonner), for a list `§6.3` wants rendered statically with its state in the
  URL → **D12**.

### 2.8 Timeline — `timeline/` (2)

**What emerges.**
- `timeline`: a vertical rail with round nodes; large year headings; the rail **fills with
  a gradient beam as the reader scrolls**; content to the right.
- `timeline_2`: a line with avatar nodes; cards carrying a title, *category · ISO date*
  (`2024-01-15`), a description, a "Completed" pill and a progress bar.

**Reconciles.** The year as the unit of organisation is `synthesis.md §1.14–1.15`. The
scroll-filled rail is `§1.3`'s amber "now" marker made literal: the rail is a hairline, and
the stretch up to the present is amber. `timeline_2`'s visible ISO dates are
machine-readable time shown to humans. And `timeline_2`'s milestones suggest a component
we had not planned: **a project timeline from 18/08/2026 to 17/08/2029 on About**, with
milestones and the elapsed fraction filled — "Time, made visible" applied to the project
itself.

**Conflicts.** Blue→purple gradient → amber only (settled). Scroll-linked motion must be
static under reduced motion; the prompt uses framer-motion with no guard. The screenshot
thumbnails in `timeline` are fine for a project timeline and not for Publications (`§1.14`:
no thumbnails). Cards and shadows in `_2` → **D2**. Whether to build the beam and the
project timeline → **D10**.

### 2.9 Logo list — `logos_list/` (1)

**What emerges.** A 3×2 grid of logos in 1px-ruled cells with an alternating, barely
visible checkerboard fill, and **dashed construction lines running past the grid edges**.
Logos in their native colours. A centred caption.

**Reconciles.** This *is* the 1px-gap grid of `§1.1`, applied to logos — and it is the right
geometry for the funder plinth of `§4`: fixed cells, `object-fit: contain`, **native colour,
no filter** on MUR and PoliTo. The construction lines are the same blueprint detail as the
dashed box in `comparison_table_2`.

**Conflicts (minor).** "Trusted by…" is social-proof framing; a funder strip needs an
attribution line — the mono funding line of `§4`. With two or three logos the checkerboard
may read as sparse; to test in the mockup.

### 2.10 Footer — `footer/` (1)

**What emerges.** A conventional dark four-column footer: brand and tagline, links, social,
newsletter sign-up. The least distinctive image in the set.

**Reconciles.** Fits the footer of `synthesis.md §3` — nav, contacts by audience, legal
line — with the funder plinth above the legal line (`§4`). Social links become research
networks (see §2.4).

**Conflicts.** A newsletter sign-up needs a third-party service and collects email
addresses, against `§6.4` (zero third-party origins, no cookies) → **D11**.

### 2.11 Shiny button — `shiny_button/` (1)

**What emerges.** A black pill with copper-amber light sweeping through it, a halftone dot
texture in the lit part, and a highlight travelling along a thin border.

**Reconciles.** Amber light on black, a fifth time. Its prompt is one of only two in the set
that honour reduced motion, and it does both halves — `matchMedia` in JS and an
`@media (prefers-reduced-motion: reduce)` block in CSS — which is the `§6.1` pattern. The
halftone dot field is a texture idea for the hero canvas.

**Conflicts.** It is decorative looping motion on a control, where `§1.20–1.21` reserves
motion for the concept itself; and the hero has no CTA, so the only place it could live is
the primary action in Collaborate. White text over the brightest part of the sweep must be
computed → **D13**.

---

## 3. The saved prompts

Treated as reference material only: none was executed, and their own instructions ("copy
this component to `/components/ui`", "set up via the shadcn CLI") were **not** followed.

**All 16 non-empty prompts target React + TypeScript + Tailwind CSS + shadcn/ui. None
mentions Astro.** They share one boilerplate header — integrate an existing React component
into a shadcn project, copy the `.tsx` into `/components/ui`, import `cn` from
`@/lib/utils` — so none can be used as-is in this Astro site.

| Prompt | Component | Describes | Extra dependencies | Reduced motion |
|---|---|---|---|---|
| `cards/cards_prompt` | `card-21.tsx` | destination card, tinted photo, CTA bar | lucide-react | n/a |
| `cards/cards_2_prompt` | `coverflow-carousel.tsx` | 3D coverflow + metadata table | lucide-react | none (rAF loop) |
| `cards/cards_3_prompt` | `3-d-coverflow-carousel.tsx` | dark coverflow, amber accents | — | none |
| `cards/cards_7_prompt` | `bento.tsx` | dark bento grid, iridescent art | **framer-motion**, clsx | none |
| `cards/cards_8_prompt` | `connected-carousel.tsx` | testimonial carousel | **framer-motion**, **next** | none (rAF loop) |
| `cards/cards_9_prompt` | `cards.tsx` | hover-focus cards, blur on the rest | — | none |
| `comparison_table/comparison_table_2_prompt` | `pricing-section.tsx` | pricing cards + toggle | **motion**, @number-flow/react, lucide-react | none |
| `filter_ui/filter_ui_prompt` | `flexi-filter-table.tsx` | filterable user table | Radix ×4, react-day-picker, cva, lucide-react | n/a |
| `filter_ui/filter_ui_2_prompt` | `table-2.tsx` | invoices table | **@tanstack/react-table**, Radix ×5, next-themes, sonner, cva | n/a |
| `footer/footer_prompt` | `footer.tsx` | four-column footer + newsletter | Radix slot, cva | n/a |
| `hero/hero_2_prompt` | `blackhole-hero-section.tsx` | raw-WebGL black hole | — | **yes** — JS `matchMedia`, capped DPR, `IntersectionObserver` + `visibilitychange` |
| `hero/hero_3_prompt` | `kinetic-grid.tsx` | pointer-reactive 2D canvas grid | — | none, no DPR handling |
| `hero/hero_4_prompt` | `aurora-background-2.tsx` | aurora gradient | **framer-motion** | none |
| `logos_list/logos_list_prompt` | `logo-cloud-10.tsx` | ruled logo grid | — | n/a |
| `navbar/navbar_prompt` | `dorpdown-navigation.tsx` *(sic)* | mega-menu | **framer-motion**, lucide-react | none |
| `people/people_prompt` | `team-section-1.tsx` | team section | lucide-react | n/a |
| `shiny_button/shiny_button_prompt` | `shiny-button.tsx` | animated amber button | — | **yes** — JS `matchMedia` + CSS `@media` |
| `timeline/timeline_prompt` | `timeline.tsx` | scroll-filled timeline | **framer-motion**, **next** | none |

*Reduced motion*: "yes" = the prompt text handles `prefers-reduced-motion`; "none" = the
component animates and the prompt contains no such handling; "n/a" = essentially static.
Found by searching the prompt text, not by running the code.

What this means in practice:

- **Six prompts depend on a React animation library** (framer-motion or `motion`), and
  **none of the six uses its reduced-motion hook**. Across all sixteen, only **two**
  mention `prefers-reduced-motion` at all (`hero_2`, `shiny_button`), and neither uses an
  animation library — echoing what was measured on the reference sites (`synthesis.md §2`).
- **Two import from `next`** (`cards_8`, `timeline`), which is Next.js-specific and does not
  exist in Astro.
- The filter tables bring a client-side table engine and a date picker to do what `§6.3`
  wants done statically, with the state in the URL.
- The useful way to read them is as **behavioural specifications**: what the component
  does, its states, its timings. Rebuild the behaviour; do not port the code. The one piece
  worth lifting almost directly is `hero_2`'s canvas lifecycle. → **D12**

---

## 4. Decisions

### 4.1 Outcomes — decided 2026-09-18

| # | Decision | Outcome | Also recorded in |
|---|---|---|---|
| **D1** | Data on ink or on paper | **Ink everywhere**, data-dense pages included, with an **ink vs paper A/B of `/publications`** in the mockup. The **light theme is a real alternative**, reachable from the theme toggle and designed component by component — not a derived fallback | `CLAUDE.md` · synthesis §1.2 |
| **D2** | Radius and shadows | **No shadows anywhere.** Radius 0 inside ruled grids and rows, 8–12px on standalone surfaces (mega-menu panel, paper blocks, hero frame) | `CLAUDE.md` · synthesis §1.1 |
| **D3** | Carousels | **No carousels anywhere on the site, People included.** Static grids with focus-and-recede instead: one element in focus, the others recede. Carousels hide content, and on mobile they are almost always worse than a list | — |
| **D4** | Photography | **No stock photography, and no commissioned photo series for the theme headers.** The only photographs on the site are the real portraits in People, plus real photos of events where they exist. Theme headers use the animated concept SVGs, not photographs | — |
| **D5** | What the hero shows | **One luminous ring built from a real time series** — its radius modulated by the series values, not a generic decorative glow. Fallback: a field of flowing lines | `CLAUDE.md` · synthesis §1.21 |
| **D6** | Display face | **Serif: Gelasio 400** (OFL, metric-compatible with Georgia), 400 in both themes. Decided 2026-09-18 after the side-by-side test at hero size: the user preferred Georgia's solid, low-contrast, large-x-height serif to Fraunces and to the sans; Gelasio makes it self-hostable | `CLAUDE.md` · synthesis §5 |
| **D7** | 2D canvas or WebGL | **2D canvas.** Reduced motion checked in JS at start and on change, device pixel ratio capped, loop paused off-screen and on hidden tabs | `CLAUDE.md` · synthesis §6.2 |
| **D8** | Pointer-reactive background | **No** | — |
| **D9** | Publications: rows or table | **Rows grouped by year**, with the details of `filter_ui_2`: printed result count, mono identifiers, sort by year, monochrome with one accent for the exception, a *last updated* line | — |
| **D10** | Timeline components | **Home: only the amber bar that fills up to "today".** The full 2026→2029 project timeline with milestones goes on **`/about`** — on the home page in 2026 it would be almost empty | — |
| **D11** | Newsletter | **No newsletter.** RSS for News and Publications, iCal for Events | — |
| **D12** | Stack | **Astro components, CSS custom properties, vanilla TypeScript.** No React, no Tailwind; the React-island fallback was not adopted | `CLAUDE.md` · synthesis §6.8 |
| **D13** | Primary button | **Static amber button with dark text and a discreet hover** | — |

Where the outcome goes beyond or differs from the recommendation in §4.2:

- **D1** adds that the light theme is a first-class alternative, not a fallback.
- **D4** allows real photos of events alongside the People portraits.
- **D5** adds the constraint that the ring must be driven by real data, and names a
  fallback.
- **D6** was left open instead of settling on Fraunces up front; the test chose a
  Georgia-like serif (Gelasio), not Fraunces.
- **D10** puts the filling bar on the home page and the project timeline on `/about`,
  instead of the bar on the `/publications` year rail. *Still to place in the mockup:
  where on the home page the bar sits.*
- **D12** drops the React-island fallback.
- **D13** adds a discreet hover to the static button.

### 4.2 Options as proposed

Each conflict above, with the options and a recommendation. Settled matters (no hero CTA,
one accent per view, no iridescent multicolour) are not reopened.

| # | Decision | Options | Recommendation |
|---|---|---|---|
| **D1** | **Data on ink or on paper?** The moodboard puts every data-dense surface on light and every atmospheric one on dark; the synthesis is ink by default with three paper blocks | (a) ink everywhere, paper only for Why TA-LLM, the funder plinth and paper figures — as now; (b) atmosphere on ink (hero, themes, events), data on paper (Publications, Resources, comparison); (c) light default for interior pages, dark only for the home hero | **(a), with an A/B of `/publications` on ink vs on paper in the mockup.** Dark default is the most distinctive choice in the system and 15.91:1 reads well; but your taste is consistent enough on this that it deserves a visual test before it is dismissed |
| **D2** | **Radius and shadows** — ~11 images have large radii and soft shadows; the synthesis has none | (a) 0 radius, no shadows anywhere; (b) 0 radius inside ruled grids and rows, 8–12px on standalone surfaces (mega-menu panel, paper blocks, hero frame), no shadows anywhere; (c) adopt large radii and shadows | **(b).** Separation comes from surface change (ink ↔ paper) and 1px rules, never from shadow; a modest radius on floating surfaces keeps the softness you like without breaking the ruled grid |
| **D3** | **Carousels** — 4 images | (a) none: focus-and-recede on a static grid, every item in the HTML, keyboard focus behaves like hover; horizontal scroll-snap allowed on mobile only where every item stays reachable; (b) one carousel, for People or testimonials | **(a).** Carousels hide content, and focus-and-recede — which you chose seven times — gives the same sense of one thing at a time without hiding anything |
| **D4** | **Photography** — leads 10 images; the project has almost none | (a) no stock photography: generative SVG/canvas for themes, paper figures framed (`§1.25`), commissioned portraits in one treatment for People only; (b) also a commissioned architectural/texture series in one colour treatment for theme headers (`case_study_pages`) | **(a).** (b) only if a consistent commission is actually possible; stock imagery would undercut the scientific register |
| **D5** | **What the hero shows** — 3/5 heroes are one luminous round object | (a) **one luminous ring, drawn from data** — a time series wrapped into polar form, or a persistence barcode bent into a circle, amber on ink; (b) flowing time-series streams, as currently planned; (c) the 1px grid made kinetic (`hero_3`) | **(a).** It is where your taste and the concept meet exactly — "persistence rings" is already in `CLAUDE.md`, and a persistence diagram links the hero to theme 03. Drawn from data rather than rendered, it avoids reading as a copy of `hero_2` |
| **D6** | **Display face** — all 5 heroes use a sans; the one image that matches the whole system (`comparison_table`) uses a serif display, and `cards_3`/`cards_8` use serif as a secondary voice | (a) Fraunces for all display, including the hero; (b) sans for the hero only, Fraunces for section headings and editorial; (c) an extended or light sans for display, serif only for quotes and explanatory text | **(a), tested at hero size in the mockup**: a light-weight Fraunces at high `opsz` against one sans candidate. What your heroes share is *scale, light weight and warm light* rather than sans-ness, and a light Fraunces delivers all three. The synthesis measured 13/13 reference sites on a sans display; the serif is the differentiator |
| **D7** | **2D canvas or WebGL** — `hero_2` is WebGL and technically the best-behaved prompt | (a) 2D canvas; (b) WebGL; either way adopting `hero_2`'s lifecycle | **Prototype in 2D first** with the `algorithmic-art` skill; move to WebGL only if the ring (D5) cannot be convincing without shaders. Whichever path: JS reduced-motion check at start **and on change**, **DPR capped**, `IntersectionObserver` + `visibilitychange` pause |
| **D8** | **Pointer-reactive background** (`hero_3`) | (a) no; (b) a subtle response to the pointer | **(a).** No touch equivalent, it pulls attention away from the headline, and it makes the motion about the visitor instead of about time |
| **D9** | **Publications: timeline rows or data table** — `filter_ui_2` is the closest listing to your taste | (a) year-timeline rows with the year rail, borrowing `filter_ui_2`'s details — result count, mono IDs, sort by year, monochrome with one accent, a *last updated* line; (b) a columnar table on desktop, stacked on mobile, with a pager | **(a).** Everything you liked in `filter_ui_2` survives; what is dropped is the column grid, which cannot hold at 390px, and the pager, which the year rail replaces |
| **D10** | **Timeline components** (`timeline/`) | (a) scroll-filled rail on the `/publications` year rail, amber up to the present, static under reduced motion; (b) plus a **project timeline** 2026→2029 on About with milestones and elapsed fraction; (c) neither | **(a) + (b).** (b) is new scope, so it is your call: it is the most literal "Time, made visible" in the whole site and needs no content we do not already have |
| **D11** | **Newsletter** in the footer | (a) no — RSS for News and Publications, iCal for Events; (b) an institutional mailing list, as an outbound link to a PoliTo-hosted sign-up | **(a)** now, (b) later if there is demand. A sign-up form on our pages would break §6.4 and put personal data in our hands |
| **D12** | **Stack** — every prompt is React + Tailwind + shadcn | (a) Astro components, CSS custom properties, small vanilla TS, no React, no Tailwind; (b) as (a), plus a React island (`@astrojs/react`) only for the publications filter if vanilla proves unwieldy; (c) adopt Tailwind in Astro and port the components | **(a), with (b) as a fallback.** Every prompt needs rewriting anyway — shadcn paths, `next` imports, animation libraries with no reduced-motion guard — and the design system is a short list of tokens that `CLAUDE.md` already puts on `:root`. Tailwind would add a second vocabulary for the same tokens; it is a legitimate choice, but it is yours to make |
| **D13** | **Animated primary button** (`shiny_button`) | (a) no: a static ink-on-amber button, as in `comparison_table`; (b) yes, for the single primary action in Collaborate | **(a).** Keep the moving amber light where it carries meaning — in the hero canvas — and keep controls still |

The design-system decisions (D1, D2, D5, D6, D7, D12) are also written into `CLAUDE.md`
and `synthesis.md`; the others (D3, D4, D8, D9, D10, D11, D13) are recorded here only.
This note stays as the record of why.
