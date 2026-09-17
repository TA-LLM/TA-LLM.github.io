# Reference site analysis — Aionic Labs & Agentic Systems Lab

**Date of capture:** 2026-09-17
**Method:** Playwright (Chromium), viewports 1440x900 and 390x844, `scale: css`.
All numeric values below were read from the live DOM/CSSOM via `browser_evaluate`
(computed styles, `:root` custom properties, fetched stylesheet text, resource timing),
not estimated from the screenshots. Contrast ratios were computed from the extracted hex
values using the WCAG 2.x relative-luminance formula.
Statements that go beyond what was directly measured are marked **(inference)**.

**Scope note:** both sites are Next.js apps deployed on Vercel. Neither is Astro, so their
build stack is not a model for ours — only their design and content decisions are.

**Loading issues:** one console error was logged on the first load of
agenticsystemslab.org. It did not reproduce on any subsequent load (0 errors), so it is
recorded here as transient and unidentified rather than characterised. No page in either
site failed to render.

---

## 1. Aionic Labs — aioniclabs.ai

Closest thematic reference: Time Series Language Models, OpenTSLM.

### 1.1 Palette

The entire site runs on **four** custom properties. This is the most striking finding
about it — there is no sprawling token system.

```
:root  --bg #faf9f5   --ink #000   --acc #00b3a4   --panel #fbfbfb
.dark  --bg #000      --ink #fff   --acc #00b3a4
```

- Light is the default: `<html class="… light">` with `style="color-scheme: light"`.
- A **theme toggle exists**: a header button with `aria-label="Switch to dark mode"`.
  Dark is the alternative, not the default — the inverse of our system.
- The accent `#00b3a4` (teal) is the *only* hue on the site. Everything else is black,
  off-white, or black at reduced alpha.
- Text tints are done with alpha rather than extra tokens: `oklab(0 0 0 / 0.8)`, `/0.75`,
  `/0.65`, `/0.6`, `/0.5`. Borders likewise: `oklab(0 0 0 / 0.2)` dominates (21 uses).
- Footer background is simply `oklab(0 0 0 / 0.05)` — a 5% ink wash, not a new colour.

**Contrast (computed):**
- Black on `#faf9f5` ≈ **20.1:1** — far above AA.
- Teal `#00b3a4` on `#faf9f5` ≈ **2.5:1** — **fails WCAG AA** for normal text. The teal is
  used for the 12.8px uppercase eyebrow labels ("OUR MISSION") and for accent borders.
  This is a genuine accessibility defect in an otherwise careful site, and a direct
  warning for how we place amber on paper.

### 1.2 Typography

Two families, both **self-hosted** (`/_next/static/media/*.woff2`, three files).
**Zero third-party origins were requested on page load** — no Google Fonts, no analytics,
no external CDN of any kind. For a project with our "no cookies / no tracking" rule this
is the reference behaviour.

- **Jost** (geometric sans, weights 300/400/500/600/700) — headings and body.
- **IBM Plex Mono** (500) — navigation, eyebrow labels, buttons, metadata.

Measured type scale (home, 1440px):

| Role | Family | Size | Line-height | Weight | Letter-spacing |
|---|---|---|---|---|---|
| h1 | Jost | 30.4px | 34.96px (1.15) | 600 | −0.304px (−0.01em) |
| h2 | Jost | 28.8px | 33.12px (1.15) | 600 | −0.288px (−0.01em) |
| Lead p | Jost | 17px | 25.5px (1.5) | 400 | normal |
| Emphasis p | Jost | 20px | 27.5px | 600 | normal |
| Eyebrow p | IBM Plex Mono | 12.8px | 19.2px | 500 | 1.28px (0.1em) |
| Tagline p | Jost | 17px | 25.5px | 300 | 5.44px (0.32em), uppercase |
| Nav / buttons | IBM Plex Mono | 12.8px | 19.2px | 500 | 0.64px (0.05em), uppercase |

On interior pages (`/research`, `/research/opentslm`) h1 rises to 35.2px.

**The type scale is not fluid.** `clamp()` appears exactly **3 times** in the whole
52.9KB stylesheet — `clamp(220px,30vw,360px)`, `clamp(20px,2.2vw,26px)`,
`clamp(44px,6.5vw,92px)` — and none of them drives h1/h2. Measured at 390px, the home h1
is **still 30.4px**, identical to desktop. Breakpoints are Tailwind defaults
(40/48/64/80rem). The headline is therefore deliberately small and near-constant: a
30.4px h1 on a 1440px viewport reads as a document heading, not a billboard.

### 1.3 Grid, spacing, components

- **Content max-width: 880px**, and it is the *only* max-width on the site (6 uses).
  Side padding 24px at 390px. Sections are full-bleed; the 880px column is the constant.
- Section padding observed: 56px top / 64px bottom on the main section.
- Flex gaps cluster at 8 / 10 / 14 / 16 / 20 / 24 / 28px — a loose 2px-ish scale rather
  than a strict 4- or 8-point system.
- **`border-radius` is `0px` everywhere. `box-shadow` is `none` everywhere.** Not a single
  rounded corner or shadow was found on the home page or `/research`. Every panel is
  defined by a hairline border (`0.8px`) or a flat tint.

**Buttons** (from `/research/opentslm`):

| | Primary | Secondary |
|---|---|---|
| Background | `#000` | `#fbfbfb` @ 0.8 |
| Text | `#faf9f5` | `#000` |
| Border | none | 0.8px solid `oklab(0 0 0 / 0.3)` |
| Radius | 0px | 0px |
| Padding | 14px 32px | 12px 20px |
| Type | IBM Plex Mono 12.8px, 0.05em, uppercase | same |
| Transition | `opacity 0.3s` | `all 0.3s` |

### 1.4 Motion

- **Header:** `position: fixed`, 57px tall, `background: oklab(… / 0.8)` with
  `backdrop-filter: blur(12px)`, `z-index: 50`.
- **Hero background:** a single `<canvas>`, **2D context** (confirmed: `getContext('2d')`
  returns a context, `getContext('webgl')` returns null), `class="pointer-events-none
  fixed inset-0 z-0 h-screen w-screen"` — a full-viewport particle field *fixed behind the
  whole document*, not just the hero. The JS draws `arc()` circles with
  `rgba(255,255,255,α)`. Canvas is sized 1:1 with CSS pixels (1440x900), i.e. not
  DPR-scaled, so it will be soft on retina displays.
- **No scroll-triggered reveals.** Scrolling the home page in 700px steps and re-measuring
  found **zero** elements with `opacity: 0` awaiting reveal and **zero** running CSS
  animations. Content is simply present. This is a deliberate restraint worth noting.
- **Transitions** are short and property-scoped: colour-family transitions at 0.2s,
  `opacity` at 0.15s and 0.3s, all on `cubic-bezier(0.4, 0, 0.2, 1)`.
- `scroll-behavior: smooth` is set on the document.

**Where the real motion lives.** The stylesheet defines 11 bespoke keyframes —
`chartGrow`, `drawLine`, `streamFlow`, `bitPulse`, `cloudDrift`, `rainFall`, `boltFlash`,
`powerFlicker`, `typeShift`, `letterIn`, `pillIn`. None of them run on the home,
`/research`, `/research/opentslm` or `/use-cases`. They run on the **sector pages**.
Measured on `/use-cases/energy`:

| Animation | Element | Duration | Timing | Iterations |
|---|---|---|---|---|
| `streamFlow` | `<path>` ×10 | 2.6s / 2.9s / 3.0s / 3.2s / 3.4s / 3.5s / 3.6s / 3.8s / 4.0s / 4.4s | linear | infinite |
| `sensorPing` | `<circle>` | 2s | ease-out | infinite |
| `alertPingBig` | `<circle>` | 2.2s | ease-out | infinite |
| `corePulse` | `<circle>` | 1.1s | ease-in-out | infinite |
| `blink` / `dfBlink` | `<span>` | 1.1s / 1.6s | steps(1) / ease-in-out | infinite |

These are **animated inline SVG diagrams**: dashes flowing along signal paths at
deliberately desynchronised durations, pings on sensor nodes, a blinking terminal caret.
The motion *is* the subject matter — a signal moving through a system — rather than
decoration applied to it. They start immediately on load, not on scroll.

**Reduced motion: handled properly, in both layers.**
1. CSS contains one global block:
   `@media (prefers-reduced-motion:reduce){*,:before,:after{scroll-behavior:auto!important;
   transition-duration:.001ms!important;animation-duration:.001ms!important;
   animation-iteration-count:1!important}}`
2. The canvas JS independently checks
   `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and, when true,
   **renders one static frame and returns** — re-rendering only on resize, with no
   animation loop. This is the correct pattern: a still image, not a blank box.

### 1.5 Navigation, hero, IA

- **Nav (desktop):** 7 items, mono uppercase — Overview · Use Cases · How It Works ·
  Research · Press · Contact · Careers (external ↗). Plus a theme-toggle button.
- **Nav (390px):** every link is hidden; a single "Open menu" hamburger remains.
- **Hero composition** (observed in `home-hero-desktop-1440.png`): centred wordmark →
  a wide cinematic landscape photograph (a figure on a hilltop at sunrise, strong gold and
  amber tones) → the spaced-out mono tagline "IT'S ABOUT TIME." → then the h1 as a plain
  document heading with a body paragraph. There is **no button in the hero at all**.
- A **left-rail sticky section index** (TSLMS / VISION / TEAM / COLLABORATIONS) tracks
  position with an active-state indicator bar.
- A **persistent bottom-right "CAREERS ↗" button** floats above the page.
- **`/research` is a reverse-chronological timeline grouped by year**: `<h2>` = the year
  ("2026", "2025") set in IBM Plex Mono 21.6px; each paper is an `<h3>` at **17px,
  weight 400** — the same size as body text. Titles are not visually promoted. No cards,
  no thumbnails, no radii. Just a dated list at 880px.
- `/research/opentslm` is a long-form article (5070px) with h2 section breaks, an
  architecture SVG, a collaborator logo row and repeated "READ THE PAPER" CTAs.
- **Alt text is exemplary.** The architecture diagram carries a ~320-character alt
  describing the actual data flow (prompt tokenisation, frozen embeddings, time-series
  patches, Perceiver resampler, gated cross-attention). Every partner logo is labelled.
- **Footer** (558px): "PROUDLY BUILT AND TRAINED IN EUROPE", a **"SUPPORTED BY"** funder
  block (Next Frontier AI, SPRIND), then four link columns — Explore · Industries ·
  Research · Company.

### 1.6 Tone of voice

Declarative and compact. Short sentences, concrete nouns ("Every heartbeat, price tick,
and sensor stream"). The tagline puns on the domain ("IT'S ABOUT TIME."). Mono-uppercase
labels give an instrument-panel register without the copy itself becoming technical.

---

## 2. Agentic Systems Lab — agenticsystemslab.org

Academic lab (ETH Zürich) with a startup-style site.

### 2.1 Palette

The opposite approach: the full **shadcn/ui token scaffold**, 32 properties on `:root`.

```
--background #0a0a0a   --foreground #fafafa   --card #111      --popover #111
--primary #fafafa      --primary-foreground #0a0a0a            --secondary #1a1a1a
--muted #1a1a1a        --muted-foreground #888  --accent #2a2a2a
--border #222          --input #1a1a1a          --ring #444
--destructive #ef4444
--chart-1..5 #fafafa / #888 / #555 / #333 / #1a1a1a
--radius .5rem         --sidebar* (8 further tokens)
```

**The decisive fact: there is no chromatic accent anywhere.** Every token is a neutral —
`#0a0a0a, #111, #1a1a1a, #222, #2a2a2a, #333, #444, #555, #888, #fafafa`. The only colour
in the system is `--destructive: #ef4444`, which is the untouched shadcn default and was
not observed in use **(inference: it is dead scaffolding)**. Even the five chart tokens
are a greyscale ramp. The site's entire identity is carried by typography, scale and
hairlines — not hue.

- **Dark only.** `<html lang="en">` carries no theme class and no `data-theme`; there is
  no toggle. No `prefers-color-scheme` alternative was found.
- Most-used text colour is `#888` (116 elements) — *more frequent than* `#fafafa` (80).
  The default reading state is mid-grey, with white reserved for headings.
- `#222` is the universal hairline (16 uses).

**Contrast (computed):** `#888` on `#0a0a0a` = **5.58:1** — passes AA for normal text
(and AAA for large text). The mid-grey body colour is a deliberate, *legal* choice, not a
careless one. Worth knowing: it is much closer to the AA floor than our
paper-on-ink (see §4).

### 2.2 Typography

Two families, both self-hosted (`/_next/static/media/*.woff2`, two files), both
**variable (100–900)**. Again, **zero third-party origins**.

- **Inter** — everything.
- **Geist Mono** — loaded, but not observed on any element sampled on the home page
  **(inference: reserved for code//metadata elsewhere, or loaded but unused)**.

Measured type scale:

| Role | 1440px | 390px | Weight | Letter-spacing (1440) |
|---|---|---|---|---|
| h1 (home) | **88px** / 96.8px lh | 36px / 39.6px | 700 | −2.2px (−0.025em) |
| h1 (interior) | 60px / 60px lh | — | 700 | −1.5px |
| h2 | 48px / **48px lh (1.0)** | 30px / 36px | 700 | −1.2px (−0.025em) |
| h3 | 24px / 32px | 20px / 28px | 600 | normal |
| Lead p | 20px / 32.5px | 18px / 29.25px | 400 | normal |
| Body p | 18px / 28px | — | 400 | normal |
| Small / meta | 14px / 20px | — | 400 | normal |
| Eyebrow | 14px, uppercase | — | 400 | **4.2px (0.3em)** |

- **`clamp()` appears 0 times** in 133KB of CSS. No fluid type at all; the scale steps at
  breakpoints. h1 drops 88px → 36px (a factor of 2.4) in one jump.
- h2 at `line-height: 1.0` with −0.025em tracking is the signature move: very large, very
  tight, heavy display text.
- The eyebrow pattern (small uppercase, ~0.3em tracking, grey) is *the same idea* as
  Aionic's, but executed in the sans rather than a mono.

### 2.3 Grid, spacing, components

- **Content max-width: 1280px** (14 uses), with 1024px for prose-width interior pages.
  Side padding 24px at 390px — identical gutter to Aionic despite the wider container.
- **Section padding is a uniform 128px top / 128px bottom** across 6 of 7 sections.
  Critically, **this does not change at 390px** — 128px of vertical padding is retained on
  a phone, which is a large part of why the mobile page is so long.
- **The hairline grid is the defining layout device.** Card grids use **`gap: 1px`** with
  the page background showing through, so cards butt together into a continuous ruled
  table. Observed at 2, 3, 4, 5, 7 and 8 columns (1440px), collapsing to 1–4 columns at
  390px — always with the same 1px gap. Separate, generously-gapped grids (40px, 64px)
  are used for prose-like content.
- **Radii:** `9999px` pills dominate (49 uses — avatars and tags), then 6px (21 uses,
  buttons), 8px, 12px. Compare Aionic's uniform 0px.
- **Shadows:** the only `box-shadow` found is the all-transparent Tailwind ring reset
  (48 elements). Effectively **no shadows** — the same flat conclusion as Aionic, reached
  by a different route.

**Buttons:** primary is inverted — `#fafafa` background, `#0a0a0a` text, radius 6px,
padding 12px 24px (8px 20px in the nav), 14px/500, `transition: all 0.2s`.

**Team card:** 255x189, transparent background, no border, no radius on the card itself;
a circular (`9999px`) avatar, then h3 14px/600 white, role p 12px `#888`, affiliation
span 10px uppercase at 60% alpha. Very compact, very dense.

**Partner logos:** normalised with **`filter: brightness(0) invert(1)`** — every logo is
forced to a flat white silhouette regardless of its source colours. This is the cleanest
solution observed across both sites for putting heterogeneous institutional logos on a
dark background.

### 2.4 Motion

- **Hero canvas:** one `<canvas>`, **2D context**, `class="absolute inset-0 w-full h-full"`
  — scoped to the hero section only (unlike Aionic's document-wide fixed canvas). Renders
  a faint dot grid with connecting lines (a network graph), at very low contrast. Sized
  1440x900 against a 1424.8px CSS width, i.e. not DPR-corrected.
- **The hero headline rotates.** The final phrase of the h1 is swapped on an infinite
  loop. Sampled every 400ms for 9.6s, transitions occurred at t ≈ 1200, 3200, 5200, 7200,
  9200ms — a clean **2.0-second cadence**. Observed sequence: *RAG → World Models →
  AI Benchmarks → AI models → AI transformation → AI talent → AI builders → AI
  researchers*. The rotating phrase is rendered with a grey-to-white gradient fill. There
  is no pause control.
- **Scroll-triggered reveals are used heavily.** Before any scrolling, **60 elements**
  inside `<section>`s sit at `opacity: 0`, revealed as they enter the viewport
  **(inference: Framer Motion `whileInView`; Framer Motion is confirmed present in the JS
  bundle)**. Consequence: if JS fails, 60 elements of content stay invisible — Aionic has
  no such dependency.
- **The nav transition is scroll-progress-driven, not a class toggle.** At the top the nav
  is fully transparent with no backdrop filter and a 0px border. Sampled mid-scroll at
  y=800 it read `background: oklab(… / 0.009574)`, `backdrop-filter: blur(0.255307px)`,
  `border-bottom: 0.4px #222` — fractional, interpolated values, i.e. the nav's opacity,
  blur and border width are continuously mapped to scroll position rather than switched.
  A genuinely refined detail.
- CSS keyframes present: `student-cta-glow`, `student-cta-halo`, `student-cta-ring`,
  `student-cta-arrow` (a bespoke glowing CTA treatment), plus shadcn defaults `spin`,
  `pulse`, `enter`, `exit`, `accordion-down/up`, `caret-blink`. None were observed running
  during scroll **(inference: the `student-cta-*` set is hover-triggered)**.

**Reduced motion: not handled.** `prefers-reduced-motion` appears **0 times** in 133KB of
CSS. The single occurrence found in 677KB of JS belongs to the **Framer Motion runtime's
own internal `shouldReduceMotion` plumbing**, not to any site-level guard. Neither the
hero canvas loop nor the 2-second infinite headline rotator is gated by the user's OS
preference. **This is the clearest thing on either site that we should not copy** — and
it is the exact inverse of Aionic's belt-and-braces handling.

### 2.5 Navigation, hero, IA

- **There is no `<header>` element**; a single `<nav>` is `position: fixed`, 68px, z-50.
- **Nav:** 6 in-page anchors — Lab Focus · Opportunities · Partners · Events · Team ·
  Contact — plus a filled "Contact" button. At 390px all links are hidden behind a single
  "Open menu" hamburger.
- **Hero composition** (observed in `home-hero-desktop-1440.png`): an **ETH Zürich ·
  Agentic Systems Lab co-branding lockup pinned top-left of the nav**, then centred:
  the lab wordmark, the 88px rotating headline, a 20px grey subhead naming the institution
  ("Based at ETH Zurich."), **two buttons** — primary white "Explore Research", secondary
  outlined "Join the Lab" — and a downward arrow scroll cue.
- **The home page is the whole site.** 10,379px tall at 1440px; **18,321px at 390px**.
  Section heights: hero 900 · lab-focus 1212 · opportunities 799 · partners 1372 ·
  events 1344 · **team 3620** · contact 749. The team roster alone is a third of the page.
- Only two kinds of real sub-page exist: ~45 `/team/<person>` profiles and 4
  `/events/<slug>` pages. There is no `/research` page and no publications list.
- **Each team profile re-renders the entire 41-person roster below the profile**, making
  every profile page ~3931px. The same roster markup is duplicated across ~45 URLs.
- A person's research output is represented by a **single Google Scholar link** — there is
  no publication data on the site at all.
- **Event pages carry no `<time>` element and no JSON-LD structured data**, so the dates
  are not machine-readable and the events are not eligible for rich results.
- **Footer** (378px): the ETH postal address and chair, then Navigation · Social
  (LinkedIn, X, GitHub, Discord) · Contact columns, a copyright line and "Founded July
  2025".
- 126 `<img>` elements on the home page.

### 2.6 Tone of voice

Ambitious and recruiting-led. "We enable the next generation of …", "Join us for your
thesis, semester, or research project", "Let's talk about what we can build together."
Headings are full sentences ending in full stops. The register is startup, not
departmental — the ETH affiliation supplies the credibility so the copy doesn't have to.

---

## 3. Comparison

### What they agree on

1. **Self-hosted fonts and zero third-party requests.** Both load every font from their
   own origin and requested **no external origin at all** during page load. No Google
   Fonts, no analytics on either. This is a real, measured convergence.
2. **Flat. No shadows.** Neither site has a meaningful `box-shadow`. Depth is
   communicated by hairlines and flat tints only.
3. **Exactly two type families**, one of them monospaced, with a small-uppercase
   wide-tracked eyebrow label to mark sections.
4. **Negative tracking on display type** (both −0.01 to −0.025em) and **tight display
   line-heights** (1.0–1.15).
5. **Identical mobile gutter (24px)** and identical mobile nav pattern (all links hidden
   behind a hamburger; zero visible nav links at 390px).
6. **A 2D canvas hero background** — neither uses WebGL. Both draw low-contrast particle
   or node fields behind the hero, and neither is DPR-corrected.
7. **The heaviest-churn content is pushed to Notion** (see §5).
8. **Institutional endorsement is displayed prominently** — Aionic's "SUPPORTED BY"
   funder block; ASL's ETH co-branding lockup.

### Where they diverge

| | Aionic Labs | Agentic Systems Lab |
|---|---|---|
| Default theme | **Light** `#faf9f5`, with a dark toggle | **Dark only** `#0a0a0a`, no toggle |
| Design tokens | **4** | **32** (shadcn scaffold) |
| Accent hue | Teal `#00b3a4` | **None — pure greyscale** |
| Content width | **880px** | **1280px** (1024px prose) |
| h1 at 1440 | **30.4px** | **88px** |
| h1 at 390 | 30.4px (unchanged) | 36px |
| Fluid type | 3 `clamp()`, none on headings | **0 `clamp()`** |
| Radius | **0px everywhere** | 6px buttons, 9999px pills |
| Grid device | 880px column, ordinary gaps | **1px-gap hairline grid** |
| Section rhythm | 56/64px | **128/128px, unchanged on mobile** |
| Scroll reveals | **None** | 60 elements at `opacity: 0` |
| Hero motion | Fixed full-page particle canvas | Scoped canvas + **2s headline rotator** |
| Domain motion | **Animated SVG signal diagrams** on sector pages | None |
| Nav on scroll | Blur applied from the start | **Continuously interpolated with scroll** |
| `prefers-reduced-motion` | **CSS global + JS canvas guard** | **Absent** |
| Architecture | True multi-page (`/research`, `/use-cases`, …) | **One 10k-px home** + team/event stubs |
| Publications | Dated timeline, grouped by year | **None — a Scholar link per person** |

The sharpest contrast is **880px / 30.4px / no-radius / light** against
**1280px / 88px / pills / dark**. Aionic reads as a scientific document that happens to be
a website; ASL reads as a product landing page that happens to be a lab. Both are
internally coherent. Our brief — an academic project that wants startup-grade polish —
sits between them, which is useful: we can take Aionic's restraint and information design
and ASL's institutional framing and confidence of scale.

---

## 4. Content architecture

### 4.1 How each site handles high-turnover content

**Aionic Labs.** Native pages for everything that is stable and worth indexing —
`/research` (the year-grouped paper timeline), `/research/opentslm`, `/research/ts-haystack`,
`/use-cases` plus five sector pages, `/press`, `/contact`. **Team and careers are the only
things offloaded**, both to `aioniclabs.notion.site`. So the split is: *scientific output
stays on-site; people and jobs go to Notion.*

**Agentic Systems Lab.** The inverse and far more aggressive. All six research areas
(Agentic AI, Multimodal AI, Next-Gen RAG, World Models, AI Evaluation Frameworks, AI
Transformation) are **links to Notion pages**. All four application tracks (AI Research,
AI Transformation, AI Founder, Affiliate/Visiting Researcher) are **links to Notion
forms**. What stays native is only the marketing home, the team roster and four event
pages. *The research description itself lives on Notion.*

### 4.2 What that buys and what it costs

**Gains** — one editing surface non-technical people already know; no build step, no PR,
no review; instant publishing; permissions handled by Notion; no repo access needed for a
rotating population of students.

**Losses**, in order of severity for us:

1. **SEO and indexability.** Notion pages sit on `*.notion.site`, a different origin. Link
   equity does not accrue to the project domain, and the content cannot rank for the
   project. For ASL this means **the lab's actual research descriptions are invisible to
   anyone searching the lab's own domain** — the single biggest cost observed.
2. **Visual incoherence.** Clicking "Agentic AI" moves the visitor from a carefully built
   88px-Inter dark page to generic Notion chrome. Every design decision in §2 stops at
   that boundary.
3. **No structured data.** Notion content cannot carry our schemas. Note that ASL's *own*
   event pages already lack `<time>` and JSON-LD; Notion would make that permanent and
   unfixable.
4. **No querying or reuse.** Content on Notion cannot be filtered, cross-linked,
   aggregated into "latest papers", or validated. Our IA depends on exactly that — a
   publication must be able to point at a theme and a person.
5. **Link rot and lock-in.** Notion URLs carry opaque hashes (`320b0f8bfec080cc…`) and
   `?source=copy_link`. They break silently when a page is moved.
6. **Archival weakness.** A funded MUR project running to 2029 should have its record in a
   Git history, not in a third-party workspace tied to someone's account.

**Assessment for TA-LLM:** Aionic's split is defensible; ASL's is not, for us. Our
research themes, publications and people are precisely the content the project will be
judged and found by. **Putting research themes on Notion would be the single worst
content decision available to us**, and ASL demonstrates the failure mode concretely.

### 4.3 The hybrid: Astro content collections + a Git-based CMS

The proposal — native Astro content collections for everything public and indexable, plus
a Git-based CMS so PhD students and faculty can edit without touching Git — is sound, and
it is strictly better than either reference site's approach.

The Astro half is already settled by our stack. Collections are defined in
`src/content.config.ts` with a `loader` and a Zod `schema` (verified against current Astro
docs via Context7):

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const themes = defineCollection({
  loader: glob({ base: './src/content/themes', pattern: '**/*.md' }),
  schema: z.object({ title: z.string(), order: z.number(), accent: z.enum([...]) }),
});
```

Two points that matter for the CMS choice:
- The Zod schema is the **validation contract**. A CMS that writes malformed frontmatter
  produces a *build failure*, not a broken page — content errors are caught in CI before
  they reach GitHub Pages. This is the core safety argument for the hybrid.
- Astro's `reference()` helper expresses relations between collections (publication →
  theme, person → theme). The CMS must be able to express that too, or editors will break
  links by hand.

### 4.4 Pages CMS vs Decap CMS

| Criterion | **Pages CMS** | **Decap CMS** |
|---|---|---|
| Auth / backend | **Hosted app at app.pagescms.org; sign in with GitHub, install a GitHub App on the repo.** Nothing to host. | GitHub backend **requires an OAuth proxy on a separate domain** (`backend.base_url`), or `git-gateway`, which needs Netlify Identity or a self-hosted GoTrue + Git Gateway server. |
| Fit with GitHub Pages | **Direct.** Our repo is static and deployed by Actions; the CMS commits to the repo and the existing workflow rebuilds. No server anywhere in our infrastructure. | **Poor without extra hosting.** GitHub Pages cannot run the OAuth proxy. We would have to stand up and maintain a separate service purely to log in — on a project with no backend and a no-tracking policy. |
| Config | Single `.pages.yml` at repo root. | `config.yml` (typically `public/admin/config.yml`) plus the admin HTML entry point. |
| Field types | `string, text, rich-text, markdown, code, number, boolean, date, select, image, file, object, block, uuid`, and **`reference` for linking collections** — maps cleanly onto Astro `reference()`. | Comparable widget set (`string, markdown, datetime, image, list, object, relation`, …). Mature and well documented. |
| Astro collections | Writes plain Markdown + frontmatter into any path — exactly what `glob()` loads. | Also writes plain Markdown + frontmatter; equally compatible **at the file level**. The problem is auth, not format. |
| Onboarding for non-technical users | Sign in with GitHub, open the repo, edit. No local setup. Editors need a GitHub account (acceptable: PhD students at DAUIN will have or can get one). | Same editing UX once reachable, but reaching it depends on infrastructure we would own and debug. Local editing needs `npx decap-server`. |
| Maintenance status | Actively developed; hosted service maintained by the author. **(inference, from current docs and an actively served hosted app — not verified against commit history.)** | Long-established and widely deployed. Its recommended `git-gateway` path is tied to Netlify Identity, which is effectively legacy for new projects — the docs themselves now describe running your own GoTrue instance as the non-Netlify route. **(inference about "legacy": based on the documented requirement to self-host, not on a formal deprecation notice.)** |

**Recommendation: Pages CMS.**

The decisive factor is not the editing UI — the two are comparable — it is that
**Decap's GitHub backend needs an OAuth proxy we have nowhere to run.** Our deployment is
a static GitHub Pages site built by Actions, with an explicit no-backend, no-tracking
posture. Pages CMS's hosted GitHub App removes that requirement entirely: no server, no
secrets to rotate, no login service to keep alive for three years. Its `reference` field
also maps directly onto Astro's `reference()`, which our IA needs (publications → themes,
people → themes). Decap would be the right answer if we were on Netlify; on GitHub Pages
it imposes infrastructure that buys us nothing.

Two caveats to carry forward:
- Both tools commit directly to the repo, so **the Zod schemas are the only thing standing
  between an editor and a broken build.** Schemas should be strict, and the Actions
  workflow should run `npm run build` on PRs so a bad edit fails visibly.
- Editors need GitHub accounts. **(inference: acceptable for our population, but worth
  confirming with the PI before committing.)**

### 4.5 What should stay on external tools

**Application forms, unambiguously.** Both reference sites already do this — ASL routes
all four application tracks to Notion forms; Aionic routes careers to Notion and uses a
Google Form (`forms.gle`) for contact.

For us the argument is stronger than convenience: a Git-based CMS means **every submission
would be a commit in a public repository**. CVs, email addresses, nationalities,
transcripts and motivation letters must never transit `ta-llm.github.io`'s Git history,
where they would be permanent, public and effectively unerasable. Under GDPR that is not
a risk to manage — it is a design we must not build.

So: **"Join us" pages are native** (the positions, the requirements, the deadlines, the
supervisors — all indexable Astro content), and the **submit action is an outbound link**
to a PoliTo-hosted form or the official MUR/university application portal where one exists.
The same applies to any newsletter signup and to event registration.

Everything else — research themes, publications, people, events, news, resources — belongs
in Astro content collections on our own domain. Note also that **publications should keep
their BibTeX pipeline**: `publications.bib` → generated pages is a better source of truth
than CMS-entered frontmatter, and neither CMS handles `.bib` natively. **(inference: the
practical split is that the CMS manages news, events, people and theme prose, while
publications stay BibTeX-driven.)**

---

## 5. Takeaways for TA-LLM

Each item is checked against the design system in `CLAUDE.md` (ink `#0F1420`, paper
`#F3EEE4`, amber `#E6A23C`; display serif + sans + mono; "Time, made visible"; dark
default; one accent per view; WCAG AA).

### Adopt

1. **Self-host fonts and ship zero third-party requests.** Both references achieve
   literally zero external origins. `CLAUDE.md` already mandates self-hosted fonts; these
   sites confirm the whole-page discipline is achievable and is what a serious research
   site looks like. It also makes our "no cookies / no tracking without consent" rule true
   by construction rather than by policy.

2. **Keep the accent scarce and structural.** Aionic uses exactly one hue, on eyebrow
   labels and thin rules; ASL uses none. This directly validates our "one accent per view"
   rule. Amber should mark the "?" of the project title, section eyebrows, the active nav
   state and theme-colour coding — and essentially nothing else.

3. **Verify our amber's contrast — we are in a much better position than Aionic.**
   Computed: Aionic's teal on its cream is **2.5:1 and fails AA** at the 12.8px size it is
   actually used. Our **amber `#E6A23C` on ink `#0F1420` is 8.4:1** (AAA), and **paper on
   ink is 15.9:1**. Our dark-default choice is what makes the amber safe — the same amber
   on a light paper background would be around 2.4:1 and would fail exactly as Aionic's
   teal does. **Actionable: amber text is only permitted on ink; in the light theme amber
   must be restricted to rules, fills and borders, never to small text.**

4. **The hairline grid (`gap: 1px`).** ASL's cards butted together into a continuous ruled
   table is the most distinctive and most reusable layout device found. It suits our
   restrained-UI brief, needs no shadows, and reads as a data table — apt for a
   time-series project. Use it for the four themes 01–04 and for the publications list.

5. **The year-grouped timeline for publications.** Aionic's `/research` — year as a mono
   `<h2>`, each paper a plain `<h3>` at body size, no cards, no thumbnails — is exactly
   right for us and far better than ASL's non-existent publication story. It scales to
   hundreds of entries and reads as a scholarly record. Pairs naturally with our BibTeX
   pipeline.

6. **Mono for metadata, not for prose.** Aionic's IBM Plex Mono at 12.8px/0.05em uppercase
   for nav, eyebrows, buttons and dates gives an instrument-panel register while keeping
   the reading text humane. Our JetBrains Mono should take precisely that role — plus
   dates, DOIs, venue names and the project code (FIS-01152, CUP E53C25001820001).

7. **Force partner logos to a single tone.** ASL's `filter: brightness(0) invert(1)` turns
   any logo into a flat white silhouette. We need to place MUR, PoliTo and partner marks
   on ink without a ransom-note effect; this solves it in one line. **(Check first that
   MUR/PoliTo brand guidelines permit monochrome treatment — funder logos often have
   mandatory forms.)**

8. **Give funding its own footer block.** Aionic's "SUPPORTED BY" block and ASL's ETH
   lockup both make institutional backing structural rather than incidental. Our MUR / FIS
   2 / project-code block belongs in the footer of every page, not only on About.

9. **Honour `prefers-reduced-motion` in both layers.** Copy Aionic exactly: a global CSS
   block, *plus* a `matchMedia` check inside the canvas that renders **one static frame**
   and skips the animation loop. `CLAUDE.md` already requires this; Aionic shows the
   correct implementation, and ASL shows what its absence looks like.

10. **A left-rail sticky section index on long pages.** Aionic's TSLMS/VISION/TEAM rail
    with an active indicator is a cheap, elegant way to make a long page navigable. Ideal
    for our four theme pages and the Research overview.

### Avoid

11. **Do not put research themes behind Notion.** ASL's six research areas all link off to
    `*.notion.site`, so the lab's core scientific content earns the lab's own domain
    nothing and breaks its visual identity at the click. Our four themes are the heart of
    the site and must be native Astro pages.

12. **Do not build the whole site as one long home page.** ASL's home is 10,379px at
    desktop and **18,321px at mobile**, of which the team roster is 3,620px. Our IA in
    `CLAUDE.md` is already multi-page; this is confirmation, not a change. The home page
    should *summarise* themes, papers, events and team and link onward.

13. **Do not gate content behind scroll-reveal animations.** ASL holds 60 elements at
    `opacity: 0` pending JS. On a static, archival research site that is an unnecessary
    dependency. Aionic ships **zero** reveal animations and loses nothing. `CLAUDE.md`
    asks for "no layout shift" — the safest reading is content visible by default, with
    motion added only as enhancement.

14. **Do not animate a headline on an infinite loop.** ASL's h1 swaps its final phrase
    every 2.0s forever, with no pause control and no reduced-motion guard. Our hero must
    state what the project is and hold still. If we want motion in the hero it belongs in
    the canvas behind the type — which is what `CLAUDE.md` already specifies.

15. **Do not duplicate a full roster onto every profile page.** ASL repeats all 41 team
    members below each of ~45 profiles. Our people pages should link back to the index.

16. **Do not skip structured data on events.** ASL's event pages have no `<time>` and no
    JSON-LD. Ours should emit both — cheap in Astro, and it is how a seminar gets found.

17. **Do not adopt a 32-token scaffold we do not use.** ASL carries the full shadcn set
    including five chart tokens and an unused `--destructive`. Aionic runs on four. Define
    the tokens `CLAUDE.md` names — ink, paper, amber, the four theme colours — plus a small
    set of surface and border steps, and stop.

18. **Do not keep 128px section padding on mobile.** ASL does, and it is a major cause of
    its 18,321px phone page. Our section rhythm must step down at 390px.

### What differentiates us

19. **Dark by default with a warm paper text colour is genuinely distinct.** Aionic is
    light-default cream; ASL is dark but rigorously neutral (`#0a0a0a` / `#fafafa` / `#888`).
    Our ink `#0F1420` is a *blue-leaning* near-black and our paper `#F3EEE4` is a *warm*
    off-white. That warm-on-cool pairing sits in neither reference site's territory and
    costs nothing in contrast (15.9:1).

20. **The display serif is our clearest single differentiator.** Both references use a
    geometric or neo-grotesque sans for display (Jost, Inter). A display serif —
    Instrument Serif or Fraunces — set large against a mono metadata layer would look
    unlike either, and signals *research project* rather than *AI startup* while keeping
    the startup-grade craft. This is the highest-leverage choice in our system; it is
    worth committing to it deliberately rather than defaulting to the sans.

21. **Beat both of them on scale strategy with genuine fluid type.** Aionic has 3
    `clamp()` calls and a heading that never changes size; ASL has **none** and jumps
    88px → 36px at a breakpoint. A proper `clamp()`-based scale would give us a display
    serif that is imposing at 1440 and controlled at 390, with no jump. Neither reference
    does this.

22. **"Time, made visible" has a proven, specific execution available.** Aionic's
    `streamFlow` — dashes travelling along SVG signal paths at ten desynchronised
    durations (2.6s–4.4s, linear, infinite) — is the closest thing found to our concept,
    and it lives in *inline SVG diagrams*, not a background canvas. **Recommendation: use
    both layers.** A lazy-started, off-screen-paused 2D canvas behind the hero (as
    `CLAUDE.md` specifies), and animated inline SVG for the concepts themselves —
    persistence rings, barcodes, token streams, drift. The diagram *is* the argument.
    Aionic proves it works; nothing on ASL does anything comparable.

23. **We can own publications outright.** ASL has no publication list at all; Aionic has a
    good but non-filterable timeline. Our filterable, per-paper-page, BibTeX-driven
    Publications section — with theme colour-coding — would be the strongest feature on
    any of the three sites.

24. **Accessibility can be a genuine differentiator, not a checkbox.** Between them the
    references show one failing accent contrast (2.5:1) and one total absence of
    reduced-motion handling. Aionic's ~320-character alt text on its architecture diagram
    is the standard to match — a real description of the data flow, not "diagram". If our
    figures carry alt text of that quality, the site will be more accessible than both
    references combined.

---

## 6. Screenshot index

> **These screenshots are kept locally only and are not committed.** They are
> third-party reference material, so `research/moodboard/` is git-ignored and the files
> below will not be present in a fresh clone. They are shared on request.

All paths relative to the repository root.

### Aionic Labs — `research/moodboard/aioniclabs/`

| File | Page | Viewport |
|---|---|---|
| `home-hero-desktop-1440.png` | Home, hero viewport | 1440 |
| `home-desktop-1440.png` | Home, full page | 1440 |
| `home-scroll-tslm-desktop-1440.png` | Home at y=1400 (TSLM section) | 1440 |
| `home-scroll-team-partner-desktop-1440.png` | Home at y=3100 (team / partner) | 1440 |
| `home-mobile-390.png` | Home, full page | 390 |
| `research-desktop-1440.png` | `/research`, full page | 1440 |
| `research-mobile-390.png` | `/research`, full page | 390 |
| `opentslm-desktop-1440.png` | `/research/opentslm`, full page | 1440 |
| `opentslm-mobile-390.png` | `/research/opentslm`, full page | 390 |
| `use-cases-desktop-1440.png` | `/use-cases`, full page | 1440 |
| `use-cases-mobile-390.png` | `/use-cases`, full page | 390 |

### Agentic Systems Lab — `research/moodboard/agenticsystemslab/`

| File | Page | Viewport |
|---|---|---|
| `home-hero-desktop-1440.png` | Home, hero viewport | 1440 |
| `home-desktop-1440.png` | Home, full page (10,379px) | 1440 |
| `home-scroll-lab-focus-desktop-1440.png` | Home, `#lab-focus` | 1440 |
| `home-scroll-team-desktop-1440.png` | Home, `#team` | 1440 |
| `home-mobile-390.png` | Home, full page (18,321px) | 390 |
| `team-profile-desktop-1440.png` | `/team/robert-jakob`, full page | 1440 |
| `team-profile-mobile-390.png` | `/team/robert-jakob`, full page | 390 |
| `event-detail-desktop-1440.png` | `/events/agentic-hack-2026`, full page | 1440 |
| `event-detail-mobile-390.png` | `/events/agentic-hack-2026`, full page | 390 |

No text or assets were copied from either site; the screenshots are reference captures and
all analysis above is original description.
