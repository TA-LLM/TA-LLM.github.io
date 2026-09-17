# Reference site analysis — Frontier labs: Google DeepMind & Anthropic

**Date of capture:** 2026-09-17
**Method:** Playwright 1.64 driving system Chrome in an isolated persistent context
(separate from the shared MCP browser), viewports 1440x900 and 390x844,
`deviceScaleFactor: 1`, `--hide-scrollbars`.
All numeric values below were read from the live DOM/CSSOM via `evaluate` (computed
styles, `:root` custom properties, concatenated `cssRules` text, WebGL context
parameters, `HTMLMediaElement` state, resource origins), never estimated from the
screenshots. Contrast ratios were computed from the extracted hex values with the WCAG 2.x
relative-luminance formula; alpha colours were composited over their measured backdrop
before the ratio was taken.
Statements that go beyond what was directly measured are marked **(inference)**.

**Scope note:** these are the second batch, category *frontier labs*. Neither site is a
model for our stack — DeepMind runs Google's internal "glue" design system, Anthropic's
home page is **Webflow** and its `/research` section is a separate application. Only their
design and content decisions are relevant to us.

**Cookie consent.** Both sites gate the page behind a consent dialog and both had to be
dismissed before the screenshots were usable:
- DeepMind: a Material dialog with a single **"OK, got it"** button. No reject option was
  offered in that dialog.
- Anthropic: a `<dialog class="show">`, `position: fixed`, 271px tall, with four buttons —
  **Customize cookie settings · Reject all cookies · Accept all cookies · Privacy
  choices**. Reject is offered at the same level as accept.
All captures in the index were taken *after* dismissal; the first exploratory pass, where
the banner was still visible, was discarded and re-shot.

**Loading issues:** none. Every page rendered. On DeepMind 3 of 5 stylesheets were
cross-origin and unreadable from script (`fonts.googleapis.com`); the CSS statistics below
therefore cover the 729KB of same-origin CSS only. **(inference: the blocked sheets are
Google Fonts `@font-face` declarations and carry no layout rules.)**

---

## 1. Google DeepMind — deepmind.google

### 1.1 Palette

The opposite extreme from Aionic's four tokens: **335 custom properties on `:root`, 199 of
them colour**. It is a full Material-style ramp system.

```
--grey-0    #ffffff   --grey-10  #f8f9fc   --grey-20  #eff2f7   --grey-50  #e6eaf0
--grey-100  #e1e6ec   --grey-200 #cdd4dc   --grey-500 #9aa0a6   --grey-700 #5f6368
--grey-800  #45474d   --grey-850 #22232b   --grey-950 #101218   --grey-1200 #121317
--grey-1000-{0,2,4,6,8,12,16,20,40}   ← the same ink at nine alpha steps
--grey-50-{0,2,4,6,8,12,16,20}        ← the same light at eight alpha steps
--blue-0 … --blue-1000  (#f4faff → #1e2867, 14 steps)
```

Measured in use: body text `#121317` on `#ffffff`; secondary text `#45474D`; the
alternate surface `#F8F9FC`; inverted cards `#121317` with white and white-at-72% text.

- **Light only.** `<html class="deepai deepai--light">`. No theme toggle was found and
  `prefers-color-scheme` appears **0 times** in the readable CSS. Dark is a *section*
  treatment (8 elements with a `#121317` background), not a page theme — the inverse of
  our system, where dark is the page and light is the alternative.
- The alpha ramps do all the tinting work, exactly as Aionic does with `oklab(… / α)`,
  but declared as named tokens rather than written inline.

**Contrast (computed):**

| Pair | Ratio | Verdict |
|---|---|---|
| `#121317` on `#ffffff` | 18.56:1 | AAA |
| `#45474D` on `#ffffff` | 9.29:1 | AAA |
| `#45474D` on `#F8F9FC` | 8.82:1 | AAA |
| white on `#121317` (inverted card) | 18.56:1 | AAA |
| white @72% on `#121317` | 9.48:1 | AAA |
| `--blue-700 #336EF3` on white | **4.50:1** | AA — exactly on the floor |

Everything passes. The blue link/accent sits precisely at the 4.5:1 boundary, which is a
deliberate-looking but zero-margin choice.

### 1.2 Typography

- **Google Sans Flex** (variable) for everything, **Google Sans** for the consent dialog,
  **Roboto** as a fallback, and a **Google Symbols** icon font.
- All four are served from **`fonts.gstatic.com`** — a CDN, not the site's own origin.
  This is the opposite of both batch-1 references, which self-hosted every font and made
  zero third-party requests.
- Note the use of **weight 450** on buttons and links — an intermediate axis value only a
  variable font can give.

Measured scale:

| Role | Family | 1440px | 390px | Weight | Letter-spacing (1440) |
|---|---|---|---|---|---|
| h1 (home) | — | **absent** | absent | — | — |
| h1 (interior) | Google Sans Flex | 42px / 43.68px (1.04) | — | 450 | −0.98px (−0.023em) |
| h2 | Google Sans Flex | 32px / 33.92px (1.06) | 26px / 28.08px | 500 | −0.544px (−0.017em) |
| h3 | Google Sans Flex | 20px / 29px (1.45) | 18px / 26.1px | 500 | −0.089px |
| Body p | Google Sans Flex | 17.5px / 25.375px (1.45) | **17.5px (unchanged)** | 400 | **+0.208px** |
| Nav link | Google Sans Flex | 17.5px / 25.375px | — | 400 | +0.208px |
| Button | Google Sans Flex | 14.5px / 14.5px | — | 450 | +0.208px |

Two things stand out. **Body text carries positive tracking (+0.208px)** while display
type carries negative tracking — a deliberate split, the opposite of treating tracking as
one global setting. And **body size never changes**: 17.5px at 1440 and at 390. Only the
headings step down.

**`clamp()` appears 0 times** in 729KB of readable CSS. The scale steps at breakpoints,
exactly like Agentic Systems Lab. Of the four reference sites analysed so far, only
Anthropic has real fluid type.

### 1.3 Grid, spacing, components

- **Spacing is a named 16-step ramp**, and it is not a strict 4- or 8-point system:
  `--space-0…15` = 0 / .25 / .5 / 1 / 1.5 / 1.75 / 2.25 / 2.5 / 3 / 3.75 / 4 / 4.5 / 5 /
  5.5 / 7.5 / 11.25 rem. The irregular steps (1.75, 2.25, 3.75, 11.25) are the interesting
  part: the ramp is tuned by eye, not generated.
- `--max-width-container: 1440px`, `--header-height: 64px`, `--cover-height: 852px`.
  Measured content column on the publications page: **1296px**.
- **A real 12-column grid**: `grid-template-columns` of 12 × 100.656px with `gap: 8px` at
  1296px. 12-column grids were counted 9 times on the home page and 34 times on the
  publications page.
- Flex gaps cluster hard at **8px** (248 uses), then 4, 24, 16, 36, 12, 48.
- **Radii:** 16px (164 uses) dominates, then 4px (76), pill `9999px` (68), 24px (20),
  8px (19). Nothing like Aionic's uniform 0px.
- **Shadows:** the most-used `box-shadow` is `rgba(33,34,38,0.12) 0 0 0 1px` on 23
  elements — **a shadow used as a hairline ring, not as depth**. Only one genuine drop
  shadow exists on the whole page, and it belongs to the consent dialog. So: flat, like
  both batch-1 sites, but reached by a third route.
- **Borders:** 1px rgba(33,34,38,0.12) (39) and 1px rgba(33,34,38,0.06) (34).

**Buttons** — every variant is a pill:

| | Filled | Tinted | Surface |
|---|---|---|---|
| Background | `#121317` | `rgba(255,255,255,.18)` | `#F8F9FC` |
| Text | `#ffffff` | `#121317` | `#121317` |
| Radius | 9999px | 9999px | 9999px |
| Padding | 8px 16px | 8px 16px | 8px 16px |
| Type | 14.5px / 450 | same | same |
| Transition | **`all 0s`** | **`all 0s`** | **`all 0s`** |

**DeepMind's buttons have no transition at all.** State changes are instant. Transitions
exist elsewhere — `color 0.2s ease` (40 elements), `opacity 0.3s` (19),
`opacity, background-color 0.15s` (11), `grid-template-rows 0.15s` (4, an accordion) —
but the primary interactive control is deliberately un-eased.

### 1.4 Motion

**There is no canvas on the site.** Not 2D, not WebGL. This breaks the pattern of both
batch-1 references.

The motion is **nine autoplaying `<video>` elements**: `.webm`, `autoplay loop muted
playsinline preload="metadata"`, durations 5s and 10s, rendered at **400×600 CSS px**
(portrait cards in a grid). Four were confirmed playing (`currentTime` advancing 0.87 →
2.06 → 3.28 over 2.4s and wrapping at the loop point); the rest sat at `currentTime: 0,
paused: true` **(inference: lazily started when scrolled into view)**. Because the clips
have different lengths and start times, the grid desynchronises on its own — the same
effect Aionic gets by hand-tuning ten SVG animation durations, achieved here for free.

- **0 running CSS animations** were measured on the home page. Keyframes are defined —
  `wireReveal`, `trace-border-in`, `fade-border-in/out`, `slideDownFadeIn`,
  `slideIn{Left,Right,Top,Bottom}`, `fadeIn` — but none were running.
- **No scroll-gated content.** 16 elements sit at `opacity: 0` before scrolling and the
  same 16 after scrolling the full page — they are menus and lightboxes, not content.
- **The header hides on scroll.** `position: fixed`, 65px, `z-index: 2000`, background
  **fully transparent at every scroll position measured**, no backdrop filter, no border.
  At y=1400 it reads `top: -80px` with `transform: matrix(1,0,0,1,0,-80)` — translated
  out of view rather than restyled. A pure hide-on-scroll, with no scrolled state at all.

**Reduced motion: handled, and in the layer that matters here.** One
`@media (prefers-reduced-motion: reduce)` block in CSS. More importantly, with
`reducedMotion: 'reduce'` emulated, **all nine videos reported `paused: true`** where four
were playing without it. Autoplay video is genuinely gated on the user's OS preference —
the single most valuable thing measured on this site, because autoplay video is exactly
the case authors usually forget.

### 1.5 Navigation, hero, IA

- **Nav:** a Google-wide product switcher panel (Google AI, Google DeepMind, Google Labs,
  Google Research, Gemini app, Google AI Studio, Google Antigravity), then four submenu
  buttons — **Models · Research · Science · About** — and two CTAs, "Build with Gemini"
  and "Try Gemini". At 390px everything collapses behind "Open the site navigation".
- **Hero composition** (`hero-phase-*-desktop-1440.png`): the first block inside `<main>`
  is `section--carousel`, 708px tall, transparent — a full-width row of tall portrait
  cards, each an autoplaying looping video with an h3 and a 17.5px dek over it. I
  confirmed it is **not a moving carousel**: track `transform` stayed `none` and
  `scrollLeft` stayed 0 across six samples over 9 seconds. The movement is entirely
  inside the video cards.
- **The home page has zero `<h1>` elements** (measured: `document.querySelectorAll('h1')
  .length === 0`). The outline begins at H2. This is a real accessibility and SEO defect
  on one of the most visible AI sites there is.
- Section headings are full mission statements, not labels: "Explore our next generation
  AI systems", "Our latest AI breakthroughs and updates from the lab", "Unlocking a new
  era of discovery with AI", "Our mission is to build AI responsibly to benefit humanity".
- 83 `<img>`, **0 missing `alt`**.
- **Footer** is 1162px tall — taller than a viewport — white, 40 links, an email signup
  ("Get the latest updates"), and columns Models · Research · Science · Products ·
  Learn more.
- Home page height: **5933px at 1440, 10183px at 390**.
- **Third-party origins during load: 14**, including `googleads.g.doubleclick.net` (10
  requests), `static.doubleclick.net`, `www.googletagmanager.com` and
  `region1.google-analytics.com`, plus `youtube.com` (54 requests). For a project with a
  no-tracking rule this is the anti-reference: a page that cannot be loaded without a
  consent dialog because of what it loads.

### 1.6 Interior page — `/research/publications/` (chosen)

**Why this page.** It is the pure publication-list case at a scale we will never reach —
the page states **263 publications** — and our IA puts a filterable Publications section at
the centre of the site. It shows both the pattern to copy and, precisely, the failures to
avoid.

- h1 "Publications" at 42px/450, followed by a "263 publications" counter at 17.5px.
- **30 rows are rendered.** Each row is an `<li>` of **1296×42px** containing a `<dl>` with
  `display: grid`, 12 columns × 100.656px, `gap: 8px`; inside it a `<dd>` with the date
  (`#45474D`) and a `<dd>` with the title (`#121317`). **Both are 17.5px/400** — the paper
  title is set at exactly body size and body weight, with no promotion whatsoever.
- The row separator is a 1px top border of `rgba(33,34,38,0.06)`, which composites to
  ≈`#F2F2F2` on white — **1.12:1 against the page**. A hairline at the edge of visibility.
- `padding: 0`, `border-radius: 0`, `box-shadow: none`, no thumbnails, no cards.
- **0 `<time>` elements.** The dates are plain text, not machine-readable.
- **JSON-LD is `WebPage` and `Organization` only** — no `ScholarlyArticle`, no
  `Dataset`, nothing per-publication.
- **No filter, search, sort, pagination or load-more control was found** anywhere in the
  visible DOM, and scrolling to the bottom twice with 2.5s pauses did not add rows: the
  `<dl>` count stayed at 30 and page height stayed at 3022px. So the page counts 263
  publications and offers 30. **(inference: the remaining entries are reachable some other
  way — a per-topic page or site search — but not from this page as measured.)**
- Page height 3022px.

### 1.7 Tone of voice

Institutional and mission-first. Headings are complete claims about purpose ("Our mission
is to build AI responsibly to benefit humanity") rather than section labels. Products are
proper nouns used without explanation. The register is a national-lab annual report
rendered as a product site — confident, corporate, slightly impersonal.

---

## 2. Anthropic — anthropic.com

**Two codebases, one identity.** This is the first structural fact and it matters for us.
`anthropic.com/` is a **Webflow** site (`data-wf-domain: website.anthropic.com`,
`data-wf-site`, `data-wf-intellimize-customer-id`) running **GSAP 3.15.0**.
`anthropic.com/research` is a separate application with its own token file — 169 `:root`
properties instead of 282, a 21-step slate ramp that the home page does not have, and font
families declared as `anthropicSans` / `anthropicSerif` rather than `"Anthropic Sans"` /
`"Anthropic Serif"`. The two are visually indistinguishable to a visitor. **(inference: a
marketing site and a content application sharing a design system but not a build.)**

### 2.1 Palette

282 `:root` properties on the home page, but only **24 of them are colours**, and they are
named after materials rather than numbered:

```
--swatch--clay        #d97757    --swatch--accent      #c6613f
--swatch--slate-dark  #141413    --swatch--slate-medium #3d3d3a   --swatch--slate-light #5e5d59
--swatch--cloud-dark  #87867f    --swatch--cloud-medium #b0aea5   --swatch--cloud-light #d1cfc5
--swatch--ivory-light #faf9f5    --swatch--ivory-medium #f0eee6   --swatch--ivory-dark  #e8e6dc
--swatch--oat #e3dacc   --swatch--olive #788c5d   --swatch--cactus #bcd1ca
--swatch--sky #6a9bcc   --swatch--heather #cbcadb --swatch--fig #c46686
--swatch--coral #ebcece --swatch--manilla #ebdbbc --swatch--kraft #d4a27f
--swatch--slate-faded-10/20   --swatch--ivory-faded-10/20
```

`/research` adds a full **`--color-slate-000 … --color-slate-1000` (21 steps,
`#fff → #0f0f0e`)** plus `--color-focus #2c84db` and `--color-error #bf4d43`.

- **Light only.** No toggle; `prefers-color-scheme` appears once. But **dark is used as a
  section inversion**: the entire footer and the hero "sky" panel are `#141413`. A light
  page with two deliberate dark blocks.
- The secondary hues (olive, cactus, sky, heather, fig, coral, manilla, kraft) form a
  categorical set. One clay accent leads; the others code categories.

**Contrast (computed).** This is where the site is weakest:

| Pair | Ratio | Verdict |
|---|---|---|
| `#141413` on `#FAF9F5` | 17.50:1 | AAA |
| `#FAF9F5` on `#141413` (footer) | 17.50:1 | AAA |
| `--cloud-medium #B0AEA5` on `#141413` (footer, 12px, 90 elements) | 8.29:1 | AAA |
| `--slate-light #5E5D59` on `#FAF9F5` | 6.26:1 | AA |
| `--slate-light #5E5D59` on `#F0EEE6` | 5.67:1 | AA |
| slate @60% α over ivory ≈ `#70706D` (measured at 14px/500, 14 elements) | 4.72:1 | AA, no margin |
| `--accent #C6613F` on `#FAF9F5` | **3.85:1** | large text only |
| `--cloud-dark #87867F` on `#FAF9F5` | **3.47:1** | large text only |
| `--clay #D97757` on `#FAF9F5` | **2.96:1** | **FAIL** |
| `--sky #6A9BCC` on `#FAF9F5` | **2.78:1** | **FAIL** |
| `--cloud-medium #B0AEA5` on `#FAF9F5` | **2.11:1** | **FAIL** |
| `--clay #D97757` on `#141413` | 5.90:1 | AA |
| `--color-focus #2C84DB` on `#FAF9F5` | 3.67:1 | AA for UI components only |
| `#D1CFC5` hairline on `#FAF9F5` | 1.48:1 | (border, not text) |

The brand clay fails on the brand ivory at 2.96:1 and passes on slate-dark at 5.90:1. A
census of every text-bearing element found the mid-greys used overwhelmingly *on the dark
footer*, where they pass — but the palette as declared contains several combinations that
would fail if an author reached for them on the light page. **This is the same failure
mode as Aionic's teal (2.5:1), and it is the exact risk `CLAUDE.md` already legislates
against for our amber.**

### 2.2 Typography

**Three bespoke typefaces** — Anthropic Sans, Anthropic Serif, Anthropic Mono — one woff2
each, all served from **`cdn.prod.website-files.com`** (Webflow's CDN), **not from
anthropic.com**. Like DeepMind, and unlike both batch-1 references, the fonts are not on
the site's own origin.

**The role assignment is inverted against convention, and it is the site's signature
move:** `<body>` is set in **Anthropic Serif**; body copy, lead paragraphs and the
navigation are the serif; **headings are the sans**. Most sites do the reverse.

| Role | Family | 1440px | 390px | Weight |
|---|---|---|---|---|
| h1 (home) | Sans | **60.8653px** / 66.95 (1.10) | **40.2939px** / 44.32 | 700 |
| h1 (`/research`) | Sans | 52px / 57.2 | — | 700 |
| Panel h2 (dark sky block) | **Serif** | **68.3429px** / 75.18 (1.10) | 31.2px / 34.32 | 500 |
| Section h2 | Sans | 24px / 31.2 | 24px (unchanged) | 600 |
| h2 (`/research`) | Sans | 32px / 38.4 | — | 600 |
| h3 | Sans | 24px / 31.2 | 24px | 600 |
| Lead p | **Serif** | 24px / 33.6 (1.40) | 24px | 400 |
| Body p | **Serif** | 18px / 25.2 (1.40) | 18px | 400 |
| Body p (`/research`) | **Serif** | 15px / 21 | — | 400 |
| Nav link | **Serif** | 16px / 22.4 | — | 400 |
| Footer | Sans | 12px / 16.8 | — | 400 |

- **`clamp()` appears 46 times** in 341KB of CSS (18 more on `/research`). The fractional
  measured sizes — 60.8653px, 68.3429px — prove the ramp is live, not decorative. Samples:
  `clamp(2rem, 1.0816rem + 3.9184vw, 5rem)`,
  `clamp(3.5rem, 2.7347rem + 3.2653vw, 6rem)`,
  `clamp(4.75rem, 3.6020rem + 4.8980vw, 8.5rem)` — a complete modular ramp in 0.25rem
  steps, each with its own slope. **Of the four reference sites analysed so far, this is
  the only one with genuine fluid type.** It is exactly the decision we already took.
- **The spacing scale is fluid too**, which neither batch-1 site attempted:
  `--size--2rem: clamp(1.75rem, 1.6735rem + 0.3265vw, 2rem)` and
  `--_spacing---space--6: var(--size--2rem)`. Measured grid gap **31.4776px at 1440 and
  28.049px at 390**, and a button padding of `12px 31.4776px`. The rhythm breathes with
  the viewport instead of stepping.
- **Optical trim is tokenised per family**:
  `--_typography---font--display-serif-trim-top: .48em` / `-trim-bottom: .3em`, with
  equivalents for display-sans (.34/.40), paragraph (.44/.27), detail (.34/.40) and mono
  (.19/.33). Cap-height trimming is baked into the token layer rather than fixed by hand
  per component. This is the most sophisticated typographic detail found across all four
  reference sites.
- Letter-spacing is `normal` on almost everything. Anthropic gets its display presence
  from size and the typefaces themselves, not from tracking — the opposite of Aionic and
  ASL, which both lean on negative tracking.

### 2.3 Grid, spacing, components

- `--site--width: 89.5rem` (1432px); measured container **1284.54px** on home, **1400px**
  on `/research`, and a **640px prose column** (15 uses) for reading text.
- `--nav--height: 4.25rem` (68px), `--nav--banner-height: 2.75rem` (44px),
  `--border-width--main: .0625rem` (1px), `--radius--main: .5rem` (8px),
  `--radius--large: 1rem` (16px).
- **Radii:** 8px (53 uses) dominates, then 16px (11), 24px (9), 12px (4) and 1600px (3).
- **Shadows: a real one exists**, and it is the only genuine drop shadow found on any of
  the four reference sites: `0 2px 2px rgba(0,0,0,.01), 0 4px 4px rgba(0,0,0,.02),
  0 16px 24px rgba(0,0,0,.04)` on 8 elements. Three stacked layers at 1–4% alpha —
  a shadow so soft it reads as a slight lift rather than depth.
- **Borders:** 1px `rgba(20,20,19,0.1)` (24), 1px `#F0EEE6` (9), 1px `#141413` (8), and on
  `/research` 1px `#D1CFC5` used as the row separator.
- **Transitions:** `color 0.2s ease` on **313** elements — the site's default — then
  `opacity 0.1s` (102), `transform 0.2s` (15),
  `opacity 0.4s cubic-bezier(0.77,0,0.175,1)` (15), and
  `opacity, transform 0.8s cubic-bezier(0.16,1,0.3,1)` (10), which is the hero reveal.

**Buttons:**

| | Home primary | `/research` primary | `/research` secondary |
|---|---|---|---|
| Background | `#FAF9F5` | `#0F0F0E` | `#F5F4ED` |
| Text | `#141413` | `#FAF9F5` | `#73726C` |
| Border | none | none | 1px `#D1CFC5` |
| Radius | **0px** | 8px | 8px |
| Padding | 12px **31.4776px** (fluid) | 8px 16px | 8px 16px 8px 24px |
| Type | 18px / 600 | 15px / 400 | 16px / 400 |
| Transition | `transform 0.2s, color 0.2s` | `background-color 0.2s` | `background-color, color 0.2s` |

### 2.4 Motion

Three distinct mechanisms, all measured.

**1. The hero headline reveals word by word, once.** Each word is a
`<span class="animate-word">` transitioning `opacity` and `transform` from
`translateY(24px)` to `0` over **0.8s** on **`cubic-bezier(0.16, 1, 0.3, 1)`**, with
per-word delays measured at **0.2107s / 0.3456s / 0.4705s** — a stagger of roughly
**0.13s**. Sampled every 350ms from page commit: words are at opacity 0 at 700ms, the
first is at 0.276 at 1050ms, all three are above 0.72 at 1400ms, and everything is settled
at **2100ms**. It runs once on load and **does not loop** — the opposite of Agentic
Systems Lab's infinite 2-second headline rotator.

**Critically, the whole sentence is also present as a `<span class="u-sr-only">`** —
"AI research and products that put safety at the frontier" — so the animated per-word spans
never change what a screen reader announces. This is the correct way to animate a headline
and it is directly copyable.

**2. A WebGL hero panel.** One `<canvas class="fable-sky-canvas is-on">`:
`getContext('webgl2')` returns **WebGL 2.0**; `getContext('2d')` returns null. It sits
inside `.big-cta_scroll-bg.is-manatee-new.fable-sky`, a `#141413` block 695px tall — the
dark section on a light page. **Its backing store is 862×490 for a 1437×817 CSS box —
0.6× resolution, deliberately undersampled.** (Both batch-1 canvases were 1:1 and
therefore soft on retina; this one is soft everywhere, by choice.)

Frame signatures taken with `toDataURL()`: three *distinct* frames while scrolling
y = 0 → 300 → 600, then **byte-identical at 600, 900, 1500, 2200 and 3000**, and identical
across two samples 1.8s apart at rest. So the sky renders as the section comes into view
and then holds a still frame. **(inference: a scroll- or visibility-driven render rather
than a continuous animation loop; the measured facts are the frame identity above plus
`ScrollTrigger.getAll().length === 1`.)**

**3. GSAP 3.15.0, minimally.** Only core plugins are registered (css, text, attr, snap,
modifiers, roundProps, endArray) and there is **exactly one ScrollTrigger on the page**.
No Framer Motion, no Three.js, no smooth-scroll library. The site's animation budget is
one headline reveal and one canvas.

**Reduced motion: the best handling of all four reference sites.**
`prefers-reduced-motion` appears **6 times** in the home CSS and **15 times** on
`/research`, and the blocks include
**`@media (prefers-reduced-motion: no-preference) { … }`** — motion declared as
*opt-in*, which is stronger than Aionic's opt-out global reset. With `reduce` emulated,
the canvas frame did not change and the single `<video>` reported `paused: true`.

**No content is gated behind reveals.** Elements at `opacity: 0` measured 19 at the top of
the page and 26 after scrolling to y = 900 / 1800 / 2700 — and the count *stays* at 26,
meaning the zero-opacity elements are closed menus and dialogs, not held-back content.
Compare Agentic Systems Lab's 60 content elements waiting on JS.

### 2.5 Navigation, hero, IA

- **Nav:** `.nav_component.is-desktop`, `position: sticky`, 68px, **fully transparent with
  no backdrop filter and no border at any scroll position measured**. There is no scrolled
  state at all — the same conclusion as DeepMind, reached differently (DeepMind hides its
  header; Anthropic just leaves it transparent).
- **Mega menu.** "Research" opens onto **Overview · Alignment · Economics · Engineering ·
  Frontier Red Team · Interpretability · Science · Societal Impacts**. The research
  taxonomy is in the primary navigation, not buried on a landing page. Also Commitments
  (Claude's Constitution, Policy on the AI Exponential, Transparency, Responsible Scaling
  Policy, Beneficial Deployments, Security and compliance), Learn, About (Leadership,
  Careers, Events, News) and a "Try Claude" CTA.
- **Hero composition** (`hero-phase-*-desktop-1440.png`): a 60.87px sans h1 —
  "AI **research** and **products** that put safety at the frontier", with two words as
  inline links — revealed word by word, over an `#F0EEE6` band. Below it the dark
  `fable-sky` WebGL panel carrying a **68.34px serif** h2 and a 24px serif lead. Then
  "Latest releases" as three h3 cards, then the mission statement h2 "At Anthropic, we
  build AI to serve humanity's long-term well-being."
- **0 `<img>` elements on the home page.** Every image is a CSS background, an SVG, the
  WebGL canvas or one `<video>` from `cdn.sanity.io`. Nothing to caption, and nothing to
  get wrong.
- **Footer is inverted** — `#141413`, 981px tall, **93 links** in ten columns (Products,
  Models, Solutions, Claude Platform, Resources, Programs, Help and security, Company,
  Terms and policies, Cookie Settings). Text is `#B0AEA5` at 12px, 8.29:1.
- Only **6 origins** loaded: `cdn.prod.website-files.com` (13 requests),
  `anthropic.com` (6), `hubspotonwebflow.com` (2),
  `d3e54v103j8qbb.cloudfront.net` (1), `cdn.sanity.io` (1), `claude.com` (1). Far leaner
  than DeepMind's 14, though still not the zero that Aionic and ASL achieve.
- Home page height: **3539px at 1440, 6667px at 390** — the most compact home page of the
  four reference sites.
- **Measured defect: the 390px full-page capture is 396px wide**, i.e. `scrollWidth`
  exceeds the viewport by 6px. There is horizontal overflow on the mobile home page.

### 2.6 Interior page — `/research` (chosen)

**Why this page.** It is the closest structural analogue to our own Research + Publications
IA that exists on any of the four reference sites: a **named research-team taxonomy** that
maps one-to-one onto our four themes, followed by a **searchable publication list**, on a
single page. DeepMind's publications page shows the list at scale; this one shows the list
*attached to a theme taxonomy*, which is our actual problem.

- h1 "Research" 52px/700 Sans; lead 20px/31 Serif; section h2 32px/38.4 w600.
- **Five research-team cards** — Alignment · Economics · Frontier Red Team ·
  Interpretability · Societal Impacts — each an h3 at 19px/22.8 w600 plus a 15px serif
  dek of two or three lines. Compact, text-only, no icons, no imagery.
- A featured item (837×113), then a **Publications grid**: rows **403px wide**, each
  carrying a **category eyebrow, a date, a title and a dek** —
  e.g. "Alignment · Sep 9, 2026 · An alignment assessment of recent cybersecurity
  incidents". Row treatment: `background: transparent`, `border-radius: 0`,
  `box-shadow: none`, `padding: 0 0 16px`, and a **bottom hairline `1px #D1CFC5`**
  (1.48:1 against ivory). No thumbnails.
- **A `Search` text input is present** — the filtering DeepMind's list lacks.
- **14 `<time>` elements**: the dates *are* machine-readable. But **0 JSON-LD blocks** —
  so no `ScholarlyArticle` markup either. Half-credit, and better than DeepMind's zero.
- Grids: 11 columns used 20 times, 12 columns 5 times; content 1400px, prose 640px.
- 0 elements at `opacity: 0` — nothing gated.
- Page height 3699px.

### 2.7 Tone of voice

First-person plural and ethically framed. "AI research and products that put safety at the
frontier." "At Anthropic, we build AI to serve humanity's long-term well-being." Headings
are complete sentences ending in full stops. The serif body gives the whole site an
essayistic register — it reads like a research institute that publishes essays, not a
company that ships features, even though the page is selling models. For a funded academic
project this is the closest match in register of all four references.

---

## 3. Comparison

### What they agree on

1. **Fonts are on a CDN, not self-hosted.** DeepMind loads from `fonts.gstatic.com`,
   Anthropic from Webflow's `cdn.prod.website-files.com`. Both batch-1 references
   self-hosted everything and made **zero** third-party requests. On this specific point
   the small sites are better engineered than the large ones, and `CLAUDE.md` already
   sides with the small sites.
2. **No scrolled nav state.** Neither header changes background, blur or border on scroll.
   DeepMind translates its header out of view; Anthropic leaves a transparent sticky bar.
   Neither does the blur-on-scroll that Aionic and ASL both do.
3. **Content is never gated behind scroll reveals.** Zero-opacity element counts are flat
   across the whole page on both sites. Between the four references, only Agentic Systems
   Lab holds content back.
4. **Publication titles are set at body size.** DeepMind at 17.5px/400, Anthropic in a
   compact row with an eyebrow and date. Neither promotes the title typographically.
   Aionic does the same at 17px/400. **Three of three sites that have a publication list
   agree**, which is about as strong a convergence as this kind of survey produces.
5. **Reduced motion is respected** — genuinely, in both cases, including the hard case
   (DeepMind's nine autoplay videos all pause).
6. **A mission statement is a heading, not a strapline.** Both sites put "our mission is
   …" / "we build AI to serve …" at h2 size in the page flow.
7. **Dark used as a section inversion inside a light page** — DeepMind's inverted cards,
   Anthropic's sky panel and footer.

### Where they diverge

| | Google DeepMind | Anthropic |
|---|---|---|
| Default theme | Light only `#ffffff` | Light only `#FAF9F5` |
| `:root` properties | **335** (199 colour) | 282 home / 169 `/research` (**24** colour swatches) |
| Palette logic | Numbered ramps + alpha steps | **Named materials** (clay, oat, olive, cactus…) |
| Accent | `--blue-700 #336EF3`, 4.50:1 | `--clay #D97757`, **2.96:1 on ivory** |
| Typefaces | 1 variable sans + icon font + Roboto | **3 bespoke: Sans + Serif + Mono** |
| Body type | Sans, 17.5px, **+0.208px tracking** | **Serif**, 18px, tracking normal |
| Display type | Sans, −0.017 to −0.023em | **Sans, tracking `normal`** |
| h1 at 1440 | **absent on home**, 42px interior | 60.87px home, 52px `/research` |
| Fluid type | **0 `clamp()`** | **46 `clamp()`** (+18 on `/research`) |
| Fluid spacing | no — 16-step fixed rem ramp | **yes — spacing tokens are `clamp()`** |
| Optical trim | not tokenised | **tokenised per family** (.19–.48em) |
| Container | 1440px / 1296px content | 1284.54px / **640px prose** |
| Grid | **true 12-col, gap 8px** | 11- and 12-col, **fluid gap 31.4776px** |
| Radius | 16px dominant, pills everywhere | **8px dominant**, 0px on the hero CTA |
| Shadow | a 1px ring pretending to be a shadow | **a real 3-layer shadow at 1–4% alpha** |
| Button transition | **`all 0s` — none** | `transform, color 0.2s` |
| Hero motion | **9 autoplay looping `<video>`** | **WebGL sky + 0.8s staggered word reveal** |
| Canvas | **none** | **WebGL 2.0, 0.6× resolution** |
| Animation library | none detected | **GSAP 3.15.0, 1 ScrollTrigger** |
| `prefers-reduced-motion` | 1 CSS block + video pause | **6 blocks incl. `no-preference`** |
| Third-party origins | **14**, incl. doubleclick + GA | **6**, no analytics domain at load |
| Cookie dialog | "OK, got it" only | **Reject all offered alongside Accept all** |
| `<img>` on home | 83 (0 missing alt) | **0** |
| Home height 1440 / 390 | 5933 / 10183 | **3539 / 6667** |
| Publication list | 263 counted, **30 shown, no filter** | grid + **search**, category eyebrow |
| `<time>` elements | **0** | **14** |
| JSON-LD | WebPage + Organization | **0** |

The sharpest contrast is **a 335-token numbered ramp with no fluid type and no canvas**
against **24 named swatches with a fully fluid type *and spacing* scale and one WebGL
panel**. DeepMind is a large institution's design system applied correctly; Anthropic is a
single art direction executed with unusual typographic care. For a project our size,
Anthropic is the more instructive and DeepMind's publications page is the more directly
reusable component.

---

## 4. How each handles research and publications

This is the part of the survey that bears directly on our IA.

**DeepMind** separates "Research" (Breakthroughs, Evals, Publications, Frontier safety)
from "Science" (AlphaFold, AlphaGenome, WeatherNext, AlphaEarth, AlphaEvolve) in the
primary nav. The publications list is a bare dated table of 30 rows with no filter, no
`<time>`, no per-paper structured data, and no visible route to the other 233 entries.
**It is the right visual pattern attached to the wrong information architecture.**

**Anthropic** puts the research taxonomy itself in the nav — eight named teams — and each
publication row carries **the team name as an eyebrow**. So a reader arriving at a paper
immediately sees which research area it belongs to, and the taxonomy is reinforced
everywhere the list appears. Dates are `<time>`. There is a search field. There is no
JSON-LD.

**For us the composite is obvious**, and it matches what `CLAUDE.md` already specifies:
our four themes (01–04) are Anthropic's research teams; the theme name is the eyebrow on
every publication row; the list is grouped by year as batch 1 decided; and we add the two
things neither site has — `<time>` *and* `ScholarlyArticle` JSON-LD — from the BibTeX
pipeline, where both are free.

---

## 5. Takeaways for TA-LLM

Each item is checked against the design system in `CLAUDE.md` (ink `#0F1420`, paper
`#F3EEE4`, amber `#E6A23C`; display serif + sans + mono; "Time, made visible"; dark
default; one accent per view; WCAG AA) and against the decisions already recorded from
batch 1 (1px grid gap, publications as a year timeline, fluid type with `clamp()`, canvas
hero + animated SVG, themes as native Astro pages).

### Adopt

1. **Anthropic vindicates our `clamp()` decision — copy the *shape* of its ramp.** It is
   the only one of four reference sites with genuine fluid type: 46 `clamp()` calls, each
   step with its own slope, e.g. `clamp(2rem, 1.0816rem + 3.9184vw, 5rem)`. Batch 1 chose
   fluid type as a differentiator on the grounds that *neither* reference had it; a
   frontier lab having it turns that from a gamble into a validated pattern. Build the
   whole display-serif scale this way.
   *Checks against `CLAUDE.md`:* "strong hierarchy through size and spacing" and "no
   layout shift" — a clamp ramp gives both.

2. **Make the spacing scale fluid as well, not just the type.** This is the single best
   idea found in this batch and no batch-1 site attempted it:
   `--size--2rem: clamp(1.75rem, 1.6735rem + 0.3265vw, 2rem)`, with the spacing tokens
   aliasing the size tokens. Measured effect: a grid gap of 31.4776px at 1440 and 28.049px
   at 390, with no breakpoint. It directly fixes the batch-1 "do not keep 128px section
   padding on mobile" problem **without writing a single media query**.
   *Caveat:* it must not touch our **1px grid gap**, which is a hairline and has to stay
   exactly 1px at every width.

3. **Tokenise optical trim per family.** Anthropic declares
   `--_typography---font--display-serif-trim-top: .48em` / `-bottom: .3em` and equivalents
   for sans, paragraph and mono. We are mixing a display serif with a sans and a mono —
   three different cap heights and baselines — and `CLAUDE.md` asks for hierarchy built
   from size and spacing. Trim tokens are what make a 1px-gap grid align across families
   instead of drifting.

4. **Animate the hero headline once, with a per-word stagger, and ship the sentence in an
   `sr-only` span.** Measured: `opacity` + `translateY(24px)` over **0.8s** on
   **`cubic-bezier(0.16, 1, 0.3, 1)`**, delays of 0.2107 / 0.3456 / 0.4705s (≈0.13s
   stagger), settled at 2.1s, never repeating. The `u-sr-only` duplicate means assistive
   technology reads the full sentence regardless of animation state.
   *Checks against `CLAUDE.md`:* "subtle, purposeful; no layout shift". It is also the
   direct rebuttal to batch 1's item 14 ("do not animate a headline on an infinite loop") —
   this is how to have headline motion *without* the ASL failure.

5. **Steal DeepMind's publication row wholesale, then fix its three defects.** The row is
   a `<dl>` on a 12-column grid, 42px tall, `padding: 0`, `radius: 0`, `shadow: none`, a
   1px top hairline, and **date and title both at 17.5px/400**. That is our batch-1 year
   timeline, already built. The three fixes, all free in Astro from `publications.bib`:
   emit a real **`<time datetime>`** (DeepMind has 0; Anthropic has 14), emit
   **`ScholarlyArticle` JSON-LD** (both have none), and provide **filtering and a route to
   every entry** (DeepMind counts 263 and offers 30).

6. **Put the four themes in the primary navigation, as Anthropic puts its research teams
   there.** "Research" opens onto eight named teams; every publication row then carries
   its team as an eyebrow. Ours: Research → Time-Aware RLAIF · Continual Learning for
   Generative Models · Topology-Aware Temporal Reasoning · Agentic AI for Advanced
   Temporal Reasoning, with the theme name as the eyebrow on every paper row, coloured with
   that theme's token.
   *Checks against `CLAUDE.md`:* "one accent per view" — the eyebrow is the one place the
   theme colour appears in a list; the row text stays paper.

7. **Use a dark section inside the page, not just a dark page.** Both sites invert a block:
   Anthropic's `fable-sky` panel and its `#141413` footer, DeepMind's inverted cards. Since
   we are **dark by default**, the move inverts: a **paper `#F3EEE4` block** on the ink
   page, for the "Why TA-LLM" comparison or the funding section. Remember our light-theme
   rule — inside a paper block, amber must become `#8A5A10` (5.11:1) for any text.

8. **Keep the amber-on-paper prohibition — this batch supplies the second proof.** Measured:
   Anthropic's brand clay `#D97757` is **2.96:1 on its ivory** (fails) and **5.90:1 on its
   slate-dark** (passes); even its darkened `--accent #C6613F` only reaches 3.85:1, large
   text only. Our amber `#E6A23C` on paper is **1.89:1** and on ink **8.41:1**. Two of two
   light-default reference sites ship an accent that fails AA on their own background.
   `CLAUDE.md` already has the darkened variants — this is the evidence that the rule is
   load-bearing, not pedantry.

9. **Offer "Reject all" at the same level as "Accept all", if any consent dialog is ever
   needed.** Anthropic's dialog has Customize · Reject all · Accept all · Privacy choices;
   DeepMind's has only "OK, got it". Our policy is no cookies and no tracking without
   consent, so the best outcome is **no dialog at all** — which the batch-1 sites achieve
   by making zero third-party requests. If one is ever unavoidable, Anthropic's is the
   model and DeepMind's is not.

10. **Declare motion as opt-in with `@media (prefers-reduced-motion: no-preference)`.**
    Anthropic does this alongside the `reduce` block — stronger than Aionic's global
    opt-out reset, because anything an author forgets to guard defaults to *still*.
    `CLAUDE.md` requires honouring the preference; this is the strictest way to satisfy it.

11. **Gate the hero canvas on visibility, not on a permanent loop.** Anthropic's WebGL sky
    produced three distinct frames while entering the viewport and then byte-identical
    frames at every deeper scroll position and across 1.8s at rest. `CLAUDE.md` already
    specifies "lazy-started, paused when off-screen"; this is that spec, shipped by a
    frontier lab, and it costs nothing at rest.

### Avoid

12. **Do not ship a home page without an `<h1>`.** DeepMind's has **zero**. Our home page
    must carry exactly one h1 — "Large Language Models: a matter of time?" — with the "?"
    in amber as the design concept requires.

13. **Do not load fonts from a CDN.** Both frontier labs do; both batch-1 references do
    not. `CLAUDE.md` says self-host, and self-hosting is what makes "no cookies / no
    tracking without consent" true by construction rather than by policy. DeepMind's 14
    origins — doubleclick, Google Analytics, GTM, YouTube — are the anti-reference.

14. **Do not build a 335-property token file.** DeepMind declares 199 colour tokens
    including nine alpha steps of the same ink and a 14-step blue ramp. Anthropic runs its
    entire identity on **24 named swatches**, and reads as the more designed of the two.
    Batch 1 reached the same conclusion from Aionic's four tokens versus ASL's 32. Define
    ink, paper, amber, the four theme colours, their light-theme darkened variants, and a
    short surface/border ramp — and stop.

15. **Do not remove transitions from buttons.** DeepMind's every button is `transition:
    all 0s`. On a restrained UI where the accent is scarce, the 150–200ms state change is
    most of what tells a keyboard user something is interactive. Anthropic's
    `background-color 0.2s` / `color 0.2s` is the right weight, and it is also the most
    common transition on three of the four reference sites.

16. **Do not publish a list that counts more than it shows.** "263 publications" above 30
    rows with no filter, no pagination and no load-more is the worst information-design
    failure measured in either batch. Our Publications page is generated from
    `publications.bib` — every entry must be reachable, and the year timeline gives us
    pagination for free.

17. **Do not let the mobile page overflow horizontally.** Anthropic's 390px full-page
    capture is **396px wide**. This is exactly the check our working rules already mandate
    after every visual change; it is worth adding `scrollWidth === innerWidth` to the
    390px screenshot step so it can never be missed.

18. **Do not make the section hairline invisible.** DeepMind's publication row separator
    composites to 1.12:1 against the page and Anthropic's to 1.48:1. Our **1px-gap grid**
    from batch 1 works because the *page background* shows through at full strength —
    keep it that way rather than dropping to a near-invisible tint.

### What differentiates us

19. **Anthropic proves a serif can carry a serious AI site — and we can go further.** Its
    `<body>` is set in Anthropic Serif; body, lead and navigation are serif and only the
    headings are sans. Batch 1 called the display serif our "highest-leverage choice" on
    the grounds that both references used a geometric sans. A frontier lab now shows the
    serif working at scale, which de-risks it. **Our variant is the mirror image:
    display serif for headings, sans for text, mono for metadata** — a combination none of
    the four references uses, and one that reads as *research project* rather than
    *AI company*.

20. **Dark default is still ours alone.** All four reference sites are light by default:
    Aionic `#faf9f5`, DeepMind `#ffffff`, Anthropic `#FAF9F5`, and only ASL is dark — and
    ASL is rigorously neutral greyscale. Our warm paper `#F3EEE4` on blue-leaning ink
    `#0F1420` at **15.91:1** sits in none of their territory and is comfortably AAA.

21. **"Time, made visible" now has two proven executions, and they stack.** Batch 1 found
    Aionic's `streamFlow` — dashes travelling along SVG signal paths at ten desynchronised
    durations. This batch adds DeepMind's grid of **nine looping videos of different
    lengths**, which desynchronise for free, and Anthropic's **staggered per-word reveal**
    (0.13s apart, `cubic-bezier(0.16, 1, 0.3, 1)`). All three are the same idea: *many
    elements on the same behaviour at slightly different phases*. That is literally a
    time series. Apply the stagger to the four theme cards, to the persistence-ring
    diagrams and to the hero canvas particles — one motion primitive serving the whole
    concept, in SVG and canvas rather than in video.

22. **We can be the only one with machine-readable publications.** Measured across four
    sites: DeepMind 0 `<time>` and no per-paper JSON-LD; Anthropic 14 `<time>` and 0
    JSON-LD; ASL no `<time>`, no JSON-LD and no publication list; Aionic a good timeline
    with no filtering. A BibTeX-driven list with `<time datetime>`, `ScholarlyArticle`
    JSON-LD, DOIs in mono, theme colour-coding and real filtering would be better
    structured than all four — and for a MUR-funded project running to 2029 that is not a
    vanity feature, it is how the record survives.

23. **Register: Anthropic's is the closest to ours, DeepMind's is not.** Full sentences
    ending in full stops, first-person plural, an essayistic serif — that is a research
    institute that publishes. DeepMind's mission-statement headings and proper-noun product
    names are a corporate annual report. We should write like Anthropic and structure like
    DeepMind's publications table, with the defects fixed.

---

## 6. Screenshot index

> **These screenshots are kept locally only and are not committed.** They are third-party
> reference material, so `research/moodboard/` is git-ignored
> (`.gitignore` line 15: `research/moodboard/*`) and the files below will not be present in
> a fresh clone. They are shared on request.

All paths relative to the repository root. All captures taken **after** the cookie dialog
was dismissed.

### Google DeepMind — `research/moodboard/deepmind/`

| File | Page | Viewport | Size |
|---|---|---|---|
| `hero-phase-1-desktop-1440.png` | Home, hero viewport, t≈0s | 1440 | 1440×900 |
| `hero-phase-2-desktop-1440.png` | Home, hero viewport, t≈1.6s | 1440 | 1440×900 |
| `hero-phase-3-desktop-1440.png` | Home, hero viewport, t≈3.2s | 1440 | 1440×900 |
| `home-desktop-1440.png` | Home, full page | 1440 | 1440×5933 |
| `home-scroll-mid-desktop-1440.png` | Home at y=1600 | 1440 | 1440×900 |
| `home-mobile-390.png` | Home, full page | 390 | 390×10183 |
| `research-publications-desktop-1440.png` | `/research/publications/`, full page | 1440 | 1440×3022 |
| `research-publications-list-detail-1440.png` | `/research/publications/` at y=600, row detail | 1440 | 1440×900 |

The three `hero-phase-*` frames differ only inside the nine looping video cards — the
carousel track itself does not move (measured: `transform: none`, `scrollLeft: 0` across
six samples over 9s).

### Anthropic — `research/moodboard/anthropic/`

| File | Page | Viewport | Size |
|---|---|---|---|
| `hero-phase-1-desktop-1440.png` | Home, hero viewport | 1440 | 1440×900 |
| `hero-phase-2-desktop-1440.png` | Home, hero viewport, +1.8s | 1440 | 1440×900 |
| `hero-phase-3-desktop-1440.png` | Home, hero viewport, +3.6s | 1440 | 1440×900 |
| `hero-webgl-sky-desktop-1440.png` | Home, `fable-sky` WebGL panel centred | 1440 | 1440×900 |
| `home-desktop-1440.png` | Home, full page | 1440 | 1440×3539 |
| `home-scroll-mid-desktop-1440.png` | Home at y=1400 | 1440 | 1440×900 |
| `home-mobile-390.png` | Home, full page | 390 | **396**×6667 (6px overflow) |
| `nav-megamenu-desktop-1440.png` | Home, "Research" mega menu open | 1440 | 1440×900 |
| `research-desktop-1440.png` | `/research`, full page | 1440 | 1440×3699 |
| `research-publications-detail-1440.png` | `/research` at y=1200, publication rows | 1440 | 1440×900 |

The three `hero-phase-*` frames are visually near-identical because the word reveal
completes at ~2.1s after page commit and the WebGL sky holds a still frame once rendered;
the animation itself was characterised by sampling computed styles every 350ms from page
commit (see §2.4), not from these stills.

No text or assets were copied from either site; the screenshots are reference captures and
all analysis above is original description.
