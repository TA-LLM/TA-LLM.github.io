# Reference site analysis — Sakana AI & Isomorphic Labs

**Category:** Labs with a strong identity (second batch of reference sites)
**Date of capture:** 2026-09-17
**Method:** a dedicated, isolated Playwright driver (`playwright-core` + the locally
installed Chrome, `channel: 'chrome'`, headless), not the shared Playwright MCP browser.
Viewports 1440x900 and 390x844, `deviceScaleFactor: 1`, mobile runs with an iPhone UA plus
`isMobile`/`hasTouch`.
All numeric values below were read from the live DOM/CSSOM inside the page (computed
styles, `:root` custom properties, parsed `CSSStyleSheet` rules, `document.getAnimations()`,
`performance.getEntriesByType('resource')`), never estimated from the screenshots.
Contrast ratios were computed from the extracted hex values with the WCAG 2.x
relative-luminance formula.
Statements that go beyond what was directly measured are marked **(inference)**.

**Scope note on stacks.** Neither site is Astro, so their build stacks are not a model for
ours — only their design and content decisions are. Confirmed from `meta[name=generator]`
and loaded scripts:

| | Home | Internal section |
|---|---|---|
| sakana.ai | hand-rolled static page; `p5.min.js` + `sketch.js`; Google Fonts stylesheet; GA4 `G-W770C6CJ1J` | **`Jekyll v4.2.2`** (`/blog/`), with `blazy.js` (lazy images) and `blog-filter.js` |
| isomorphiclabs.com | **Webflow** (`webflow.*.js`, jQuery 3.5.1, Webflow ix2 interactions), `model-viewer.min.js`, Cookiebot (`cc.js`/`uc.js`), `a11y.js`, GA4 `G-N7ZQCN1ZTS` | same Webflow project |

**Loading issues.** Nothing failed to render. One transient `404` console error was logged
on every load of the Isomorphic Labs **home** (not on `/our-team`); the failing resource was
not identified, so it is recorded as unidentified rather than characterised. Sakana logged
**zero** console errors on every page. Isomorphic Labs serves a **Cookiebot consent banner**
on first load; it was dismissed with **"No thanks"** (i.e. non-essential cookies declined)
before the screenshots, so the captures show the page in its declined-consent state.

**Internal page choice, and why.**

- **Sakana → `/blog/`.** Sakana's home has no research content at all (see §1.5), so the
  blog index *is* the research/news surface. It is the direct analogue of our Publications
  and News pages, it carries a category filter, and — as it turns out — it is the sharpest
  available test of how much identity survives a click.
- **Isomorphic Labs → `/our-team`.** Iso's identity is carried by illustration,
  photography and a container language; the roster page is where a visual system usually
  collapses into a generic grid of headshots. It maps directly onto our People page and it
  is the page where the "does the character survive?" question actually bites. `/our-tech`
  was captured only for a motion measurement (§2.4).

---

## 1. Sakana AI — sakana.ai

Tokyo. The most extreme case of identity-through-restraint found so far in this project.

### 1.1 Palette

Six custom properties. Fewer than Aionic's four-token system in spirit, and far fewer than
Agentic Systems Lab's 32.

```
:root  --bg #FFFFFF  --text #0D0D0D  --accent #CC2B2B
       --muted #5a5a5a  --light #9a9a9a  --border #E0E0E0
```

- **Light only.** `<html lang="en">` carries no theme class, no `data-theme`, no inline
  `color-scheme`. `prefers-color-scheme` appears **0 times** in the 7.7KB stylesheet. There
  is no theme toggle.
- The accent `#CC2B2B` is a **warm brush-stroke red** — Japanese vermilion rather than a
  UI red. It is the *only* hue on the page, and it appears in exactly three places
  (observed in `home-hero-desktop-1440.png`): the fish glyph in the wordmark, **one single
  red fish among the grey shoal** in the canvas animation, and the hand-drawn sunburst
  recruiting sticker bottom-right. Five elements on the whole page compute to
  `rgb(204, 43, 43)`.
- Everything else is `#0D0D0D` text (20 elements), `#5a5a5a` muted (5), `#9a9a9a` for the
  11px utility line (2), `#E0E0E0` hairlines (5 borders).

**Contrast (computed):**

| Pair | Ratio | Verdict |
|---|---|---|
| text `#0D0D0D` on `#FFFFFF` | **19.44:1** | AA/AAA |
| accent `#CC2B2B` on `#FFFFFF` | **5.32:1** | AA (unlike Aionic's teal at 2.5:1) |
| muted `#5a5a5a` on `#FFFFFF` | 6.90:1 | AA |
| **`--light` `#9a9a9a` on `#FFFFFF`** | **2.81:1** | **FAILS AA** |
| border `#E0E0E0` on `#FFFFFF` | 1.32:1 | (non-text, acceptable) |

`--light` is used for the 11px footer utility line ("Tokyo, Japan · © 2026 Sakana AI
株式会社") and for the nav's secondary descriptions. Small grey text at 2.81:1 is a genuine
AA failure. Note the pattern across all four reference sites so far: **the accent is fine;
it is the "quiet grey" that fails.**

### 1.2 Typography

Three families on the home, **all loaded from `fonts.googleapis.com`** — the home page is
**not** self-hosting its fonts.

- **Poppins** (geometric sans) — the tagline, weight 200.
- **Noto Sans JP** — navigation and Japanese text, weight 500.
- Fallback stack `"Helvetica Neue", Arial, sans-serif`.

Measured type scale on the home:

| Role | Family | 1440px | 390px | Weight | Letter-spacing |
|---|---|---|---|---|---|
| Tagline `p.tagline` | Poppins | **32px** | **22px** | 200 | normal |
| Nav label | Noto Sans JP | 15px | (hidden) | 500 | normal |
| Nav dropdown description | Noto Sans JP | 14px | — | 500 | normal |
| Utility line | Noto Sans JP | 11px | 10px | 400 | normal |

**There is no `<h1>` on the Sakana home page.** No heading element of any level. The
company name is an `<img>` (`sakana-logo-hero.png`, 547x150). The tagline is a plain `<p>`.
**(Inference: this is an SEO and screen-reader weakness — the page has no document outline
and the logo image's alt is `"Sakana Chat"`, which does not describe the mark.)**

**Fluid type: yes, and it is the cleanest example in either batch.** `clamp()` appears
**4 times** in the 7.7KB stylesheet, and *one of those four drives the tagline*:

```
clamp(22px, 2.6vw, 32px)     /* the tagline — measured 32px @1440, 22px @390 */
clamp(14px, 1.2vw, 18px)
clamp(280px, 38vw, 560px)    /* the wordmark image */
clamp(220px, 32vw, 440px)
```

So the two things that define the hero — the wordmark and the line under it — both scale
continuously, with no breakpoint jump. Compare Aionic (3 `clamp()`, none on headings) and
ASL (0). Sakana is the only reference site so far that uses `clamp()` where it matters.

### 1.3 Grid, spacing, components

- **There is no content container and no `max-width` anywhere on the home** (the
  `max-width` histogram is empty). The layout is centred by flex, edge to edge.
- The page is built from three stacked blocks: `nav.topnav` **77px**, `main.hero` **771px**,
  `div.utility` **52px** — total **exactly 900px**.
- Gaps: 2px (14 uses, inside nav dropdown rows), 6px, 18px, 4px, 48px. No spacing scale
  worth the name; the page is too small to need one.
- Radii: 5px (14, dropdown rows) and 8px (5, dropdown panels). 75 elements at `0px`.
- **Shadows: one, and only on the nav dropdowns** —
  `rgba(13,13,13,0.08) 0 12px 32px`. 89 elements at `none`. Effectively the same flat
  conclusion as both batch-1 sites, with a single soft-drop exception for overlay menus.
- Transitions are short and explicit: `background, color 0.15s ease` (14),
  `color 0.15s ease` (5), `transform 0.2s ease` (5),
  `opacity, transform, visibility 0.18s ease` (5, the dropdowns), `filter 0.25s ease` (1).
  Nothing above 0.25s.

### 1.4 Motion

**Hero: p5.js.** One `<canvas class="p5Canvas">`, **2D context** (`getContext('webgl')`
returns null), `position: absolute`, sized **1440x900 against a 1440px CSS width** —
1:1 with CSS pixels, so **not DPR-corrected** and soft on retina, exactly like both
batch-1 canvases. `window.p5.VERSION` = **1.4.1**.

What it draws (observed across `hero-phase-1/2/3-desktop-1440.png`): a **school of
hand-drawn, single-stroke outline fish** in thin grey line, scattered across the full page
and drifting. One fish is red. In the captured phases a dense shoal clusters in the upper
right and individual fish trail away across the page — the classic "many small agents,
one emergent school" illustration of Sakana's own nature-inspired research thesis. The
identity is the argument: *sakana* means *fish*.

**CSS keyframes: exactly one.**

| Animation | Element | Duration | Timing | Effect |
|---|---|---|---|---|
| `fugu-breathe` | `a.fugu-cta img` | **3200ms** | linear | `scale(1) → scale(1.1) → scale(1)` |

That is the red sunburst "Applied Team 特設採用ページ" recruiting sticker pinned
bottom-right at `[1211, 706]`, 198x161 — a **breathing badge**, the only looping motion in
the DOM.

**Reduced motion: partial, and the gap is measurable.** The stylesheet contains exactly one
`prefers-reduced-motion` block, and it covers **only the sticker**:

```css
@media (prefers-reduced-motion: reduce) {
  .fugu-cta img { animation: auto ease 0s 1 normal none running none; }
}
```

Verified: with `reducedMotion: 'reduce'` emulated, `document.getAnimations()` returns
**0 running animations** (normally 1) — the sticker does stop. But the p5 canvas was
probed separately by sampling its pixels: under `reduce`, the canvas contents **still
changed between t=0→1.5s and t=1.5s→3.0s**, identically to the normal run. **The p5 sketch
has no `matchMedia` guard and keeps animating for users who asked it not to.** This is the
same failure Agentic Systems Lab has, but half-fixed — and it is the exact opposite of
Aionic, whose canvas JS renders one static frame and returns.

**No scroll motion of any kind**, because the page does not scroll: `scrollHeight` is
**900px at 1440** and **844px at 390**, i.e. exactly one viewport at both widths. Zero
elements at `opacity: 0`, zero transformed elements.

### 1.5 Navigation, hero, IA

- **Nav (1440px):** five items, each a hover-dropdown — **Research · Solutions · Products ·
  Careers · About Sakana AI**, 15px Noto Sans JP weight 500, each with a 10px chevron SVG.
  Dropdown panels are 300px wide (380x338 for Products), white, 8px radius, with the soft
  shadow. Dropdown rows carry a title plus a 14px description ("Sakana Fugu — LLM
  orchestrating…"), so the nav doubles as the site map. `position: relative` — it is not
  sticky, but the page does not scroll, so the distinction is moot.
- **Nav (390px):** **all 19 links hidden**, one "Menu" button remains. Opening it reveals
  the full 19-link list (captured in `home-mobile-390-menu-open.png`). Identical pattern to
  both batch-1 sites.
- **Hero composition** (measured positions): centred wordmark image 547x150 at y=343 →
  tagline "Building Frontier AI in Japan" at y=520 → **nothing else**. No buttons, no
  scroll cue, no sections. The p5 canvas sits behind everything at `absolute` 0,77.
- **Footer: there is no `<footer>` element.** A 52px `div.utility` strip carries
  "Tokyo, Japan" and "© 2026 Sakana AI 株式会社" at 11px left, and two 13px social icons
  right. That is the entire footer of a company home page.
- **Total home content: one image, one sentence, one nav, one copyright line.** No mission
  statement, no products grid, no papers, no team, no funding block. Everything lives one
  click away behind the nav.

**`/blog/` — the research surface.** Content width **821px**. A single row of **9 category
filters**: All · Research · Product · Finance · Defense & Intel · Partnerships ·
Event & Media · Funding & IR · Inside Sakana AI, filtered client-side by `blog-filter.js`.

- **120 posts are rendered on one page** — `scrollHeight` **114,345px**. No pagination, no
  infinite scroll; every entry is in the initial HTML, with images lazy-loaded by `blazy`.
- Each entry: an `<h1>` at **26.656px weight 400** (so every post title is an `h1` —
  120 `h1` elements on one document), a `<time datetime="2026-09-17T00:00:00+09:00">` at
  15.68px in grey `#909194`, a full-width figure, and a **"read more"** button with a 1px
  `#6688FF` border, 2px radius, 6.272px/12.544px padding.
- **`<time>` with a real `datetime` attribute on all 120 entries** — machine-readable dates,
  which ASL's event pages lacked. No JSON-LD.
- **31 autoplay/loop/muted `<video>` elements** in the initial document (research result
  animations: `text-to-lora.mp4`, `circle-packing.mp4`, `diffusion-blocks.mp4`, …), plus
  91 `<img>`. **(Inference: 31 simultaneously-playing looping videos on a 114,000px page is
  a significant battery and bandwidth cost, and none of them is reduced-motion gated —
  the blog CSS contains 0 occurrences of `prefers-reduced-motion`.)**

**The identity does not survive the click — see §3.**

### 1.6 Tone of voice

Six words on the home page: *"Building Frontier AI in Japan."* Plus a place and a
copyright. The confidence is entirely in the withholding — the page states the ambition
and the nationality and refuses to elaborate. The wit is carried by the mascot, not the
copy: the fish, the pufferfish product names (Fugu, Namazu, Marlin), the hand-drawn sticker
in Japanese. Bilingual without a language switcher: the blog mixes English and Japanese
post titles in one feed.

---

## 2. Isomorphic Labs — isomorphiclabs.com

London, DeepMind spin-out. The opposite strategy: identity through a *manufactured
material* — pale biological tints, hairline containers, ultralight display type, 3D
molecular renders.

### 2.1 Palette

**165 custom properties on `:root`** — a full Webflow variable system, an order of
magnitude above Sakana. The colour subset is 26 properties, and the naming is where the
identity actually lives:

```
--_color---acid-green-100        #e9ffe9
--_color---alpha-chartreuse-100  #e8fac3
--_color---amino-azure-100       #e6f7ff
--_color---evo-pink-100          #ffecfc
--_color---genesis-orange-100    #ffe4cc
--_color---hydro-blue-100        #f5f8f9
--_color---hydro-blue-900        #304a57
--_color---carbon-black-400      #3a3a3a
--_color---carbon-black-500      #1e1e1e
--_color---calcium-white-800     #d8d8d8
--_color---card-label-background #62626280
```

Every hue is named from chemistry or biology — *amino*, *acid*, *carbon*, *calcium*,
*hydro*, *evo*, *genesis*, *alpha*. The design system is literally written in the
company's subject matter. And every chromatic token is a **`100`-step pastel**: these are
near-white section washes, not text colours. Text is black, `#1e1e1e` or white.

Nine further tokens ship with `<deleted|variable-…>` in their own names:

```
--background-color--background-primary<deleted|variable-9f6b6bb4-…> = #000
--base-color-brand--blue<deleted|variable-de000a4d-…>              = #2d62ff
--text-color--text-secondary<deleted|variable-0a60224d-…>          = #222
--base-color-system--error-red<deleted|variable-ad7a5e8d-…>        = #f8e4e4
…
```

These are Webflow variables deleted in the designer that still ship in the 205KB
production CSS. It is the same dead-scaffolding problem as ASL's unused `--destructive`,
but self-documenting: the tokens are *named* "deleted".

**Contrast (computed):**

| Pair | Ratio | Verdict |
|---|---|---|
| `#000` on `#FFF` | 21.00:1 | AAA |
| `carbon-black-500 #1E1E1E` on `#FFF` | 16.67:1 | AAA |
| `carbon-black-400 #3A3A3A` on `#FFF` | 11.37:1 | AAA |
| `#000` on `amino-azure #E6F7FF` | 19.11:1 | AAA |
| `#000` on `genesis-orange #FFE4CC` | 17.22:1 | AAA |
| `#FFF` on footer `#3A3A3A` | 11.37:1 | AAA |
| `calcium-white-800 #D8D8D8` on `#FFF` | 1.43:1 | hairline only — non-text |
| `hydro-blue-900 #304A57` on `#FFF` | 9.36:1 | AAA |

**Because every accent is a pastel used only as a background, the text contrast never
drops.** This is the single most transferable idea on the site: *tint the surface, not the
type.* It is exactly the rule `CLAUDE.md` already states for our light theme, arrived at
independently and applied at scale.

### 2.2 Typography

Two families, four weights, **all four self-hosted as `.woff2` — but on the Webflow CDN**
(`cdn.prod.website-files.com`), not on `isomorphiclabs.com`.

- **Söhne** (Klim Type Foundry) in three cuts, loaded as three separate files:
  `soehne-extraleicht.woff2`, `soehne-leicht.woff2`, `soehne-buch.woff2`.
- **Söhne Mono** — `sohne-mono.woff2`.

**(Inference: Söhne is a commercially licensed family; a licence like that is not
available to us and is not a model for our font choice, only for the *role structure*.)**

Measured type scale:

| Role | Family @1440 | 1440px | Family @390 | 390px | Weight 1440→390 | Letter-spacing |
|---|---|---|---|---|---|---|
| h1 (home) | **Söhne Extraleicht** | **56px** / 61.6 lh | **Söhne Leicht** | **28px** / 36.4 lh | **200 → 300** | −1.7px → −0.3px |
| h2 (home) | Söhne Extraleicht | 56px / 61.6 | Söhne Leicht | 28px / 36.4 | 200 → 300 | −1.7px → −0.3px |
| h2 (team sections) | Söhne Extraleicht | 48px / 57.6 | — | — | 200 | −1px |
| h3 | Söhne Leicht | 28px / 36.4 | Söhne Leicht | 24px / 31.2 | 300 | −0.25 → −0.2px |
| Lead p | Söhne Leicht | 20px / 28 | Söhne Leicht | 16px / 22.4 | 400 | ±0.2px |
| Person name (team) | Söhne Leicht | 20px / 28 | — | — | 400 | −0.2px |
| Person role (team) | Söhne Buch | 12px / — | — | — | 400 | 0.36px |
| Nav / eyebrow / tag | **Söhne Mono** | **12px** / 16.8 | Söhne Mono | **10px** / 14 | 400 | **1px → 0.8px** |

Three things stand out.

1. **The display face changes at mobile.** At 1440 the h1 is Söhne **Extraleicht** at
   weight 200; at 390 the same h1 renders in Söhne **Leicht** at weight 300. This is a
   deliberate optical-size swap — the hairline cut is reserved for type large enough to
   carry it, and a sturdier cut takes over when the headline drops to 28px. It is the most
   sophisticated typographic move found across all four reference sites, and it costs one
   media query.
2. **Mono is the dominant family by element count.** On the home page, 107 text-bearing
   elements compute to `"Sohne Mono"` versus 16 Söhne Leicht and 11 Söhne Buch. Every nav
   item, every eyebrow ("OUR GOAL", "OUR LEADERSHIP", "OUR CULTURE", "OUR HERITAGE"), every
   tag and every button label is mono uppercase at 12px/1px tracking. The mono layer *is*
   the interface; the sans is reserved for prose.
3. **`clamp()` appears 0 times** in 205KB of CSS, yet **18 `vw` units** do. The scale steps
   at breakpoints, but several radii and paddings are `vw`-derived, which is why the
   measured radii come out as fractional values (5.6px, 4.5px, 3.3px, 1.5px) rather than
   the clean token values (2.8 / 3.6 / 4.2 / 5 / 10 / 12px).

### 2.3 Grid, spacing, components

- **Content max-width: 1240px** (7 uses on home, 5 on team), with narrower 700px / 600px /
  500px / 400px / 300px prose measures nested inside. Section elements themselves have
  `padding: 0` — all rhythm lives in inner wrappers.
- **Spacing scale (tokens):** 4 · 8 · 12 · 14 · 16 · 18 · 20 · 30 · 60 · 80 · 120px.
  Eleven steps, irregular in the middle (12/14/16/18/20), clean at the ends. Measured
  gaps cluster on **16px** (22 uses home, 31 uses team), then 8, 4, 30, 40, 80px.
- **Radius scale (tokens):** 2.8 · 3.6 · 4.2 · 5 · 10px, plus
  `--_radius---radius--radius-container: 12px`. Measured on real elements: **20px** for the
  large frames, 7px, 10px, and the `vw`-scaled fractional values.
- **`box-shadow` is `none` on all 522 measured elements on the home and all 387 on the
  team page.** Zero shadows. Four out of four reference sites now agree on this.
- **The signature component is a hairline-bordered rounded frame.** Measured on the home
  hero: `div.home-hero_item` at **621x331**, `border-radius: 20px`, `border: 1px solid
  #1E1E1E`, `background: transparent`; a second identical one; and a full-width
  `1241x331`. The headline and the lead paragraph each sit inside one of these empty
  frames, which are transparent so the mint gradient and the 3D render show through and
  *overflow past the frame edges*. News cards use the same language at 400x142 with a
  lighter `#D8D8D8` hairline.
  The logo lockup and every nav item are built from the same primitive — small
  rounded-rect boxes with a 1px border, so the whole page reads as a **diagram of labelled
  containers**, which is a plausible visual metaphor for molecular structure diagrams.
  **(Inference: the metaphor is my reading; nothing on the site states it.)**
- `gap: 1px` appears only three times, on `news-card_image-overlay`. The hairline-grid
  device from ASL is **not** used here.
- Transitions: `transform 0.15s ease` (6), `all 0.15s cubic-bezier(0.455,0.03,0.515,0.955)`
  (5), `opacity 0.2s ease` (4 home / **12 team**), `all 0.3s ease` (2). Same 0.15–0.3s
  band as everyone else.

### 2.4 Motion

**Hero: a 4K video, not a canvas.** Zero `<canvas>` elements. One `<video autoplay loop
muted>` at **3840x2160** (`home_hero.webm`) served from `storage.googleapis.com`. At 390px
the source switches to **`home_hero.mov` at 1920x1080** — a separate mobile encode in a
different container. **(Inference: the `.mov` is most likely an HEVC-with-alpha encode for
Safari, which is the usual reason to ship `.mov` alongside `.webm`.)** The content is a
soft, glossy, translucent **molecular surface render** — a blue-to-cyan blobby volume with
a pink and orange helix threading through it — that drifts and rotates slowly. Across
`hero-phase-1/2/3` the render rotates and the light moves; the type does not.

**A `<model-viewer>` element is also present on the home** (one instance, GLB source named
`ISOLVL2_Surface`) — Google's web component for interactive 3D. So the home carries both a
pre-rendered video *and* a real-time 3D model.

**`/our-tech` uses a scroll-scrubbed video, and I measured it.** The `<video>` there
(`iso_scrub.mp4`, with a separate `iso_scrub_mobile.mp4`) is **4.52s long and permanently
`paused: true`**; its `currentTime` is driven by scroll position:

| scrollY | 0 | 500 | 1000 | 1500 | 2000 | 2500 | 3000 |
|---|---|---|---|---|---|---|---|
| `video.currentTime` | 0 | 0 | 0 | 0 | 0.40 | 1.11 | 1.81 |

Scrubbing starts at roughly y≈1700 and advances about **1 second of video per ~830px of
scroll**. This is a genuinely effective way to let a reader *drive* a scientific animation
at their own pace — the user controls the clock. It is also the single most bandwidth-hungry
technique on any of the four sites.

**Scroll reveals via Webflow ix2.** 3 elements sit at `opacity: 0` on the home before
scrolling, **12 on `/our-team`**, plus 4–5 transformed elements. `document.getAnimations()`
returns **0** — the motion is JS-driven inline styles, not WAAPI or CSS. The only CSS
keyframe in 205KB is `spin` (a Webflow default).

**A per-character text reveal.** The mono heading "Latest from ISO" is split into
individual `<span>`s — the extracted mono text list reads
`["L","a","t","e","s","f","r","o","m","I","S","O", …]`. **(Inference: a staggered
per-letter entrance animation, the standard Webflow text-split interaction; I captured the
split markup but not the stagger timing.)**

**Reduced motion: not handled at all.** `prefers-reduced-motion` appears **0 times** in
205KB of CSS. Verified by emulation: with `reducedMotion: 'reduce'`, the extraction is
byte-for-byte equivalent — the 4K hero video still autoplays and loops, the ix2 reveals
still hold 3 elements at `opacity: 0`, the scrub still scrubs. Same verdict as Agentic
Systems Lab, on a heavier payload.

### 2.5 Navigation, hero, IA

- **The header is `position: absolute`, not fixed.** Measured at y = 0, 400, 1200 and 3000,
  its `getBoundingClientRect().top` reads 0, −400, −1200, −3000: it scrolls away with the
  page and never comes back. No sticky nav, no backdrop blur, no scroll-progress
  interpolation. Height 72px, fully transparent, `z-index: auto`. A consequence visible in
  `our-team-roster-desktop-1440.png`: the nav overlaps the hero artwork as it leaves, and
  "OUR TEAM" / "CAREERS" briefly sit unreadably on top of a photograph.
- **Nav (1440px):** five visible items — **OUR TEAM · OUR TECH · PARTNERSHIPS · CAREERS ▾ ·
  NEWS** — each in its own rounded box with a hairline border, mono uppercase 12px/1px.
  CAREERS is a dropdown containing Life at Iso · Work with Us · Job Openings.
- **Nav (390px):** all links hidden behind a hamburger; the open panel lists Home · Life at
  Iso · Our Team · Work With Us · Our Tech · Job Openings · Partnerships · News · LinkedIn ·
  X.
- **Logo lockup:** three separate boxed cells — `[glyph] [Isomorphic] [Labs]` — each a
  rounded rect with a 1px border, a wordmark that is itself built from the site's container
  primitive.
- **Hero composition** (observed in `home-hero-desktop-1440.png`): a pale mint-to-ice
  vertical gradient; the logo lockup top-left, boxed nav top-right; a 621x331 hairline
  frame containing only **"Solve all disease"** set in 56px Söhne Extraleicht over two
  lines; a second frame below carrying the 20px lead paragraph; and to the right, the 3D
  molecular surface bleeding out of and behind the frames. **No button in the hero.**
  Both Sakana and Isomorphic put zero CTAs in the hero — as did Aionic.
- **Home outline:** H1 "Solve all disease" → H2 "We're using machine learning to transform
  drug discovery." → H3 ×2 (leadership, careers) → H3 "AlphaFold broke new ground. Iso has
  built on it." → three H3 news items. **Eight headings on a 5,629px page.** Eyebrows
  (mono, uppercase) label the sections: `our goal`, `OUR LEADERSHIP`, `OUR CULTURE`,
  `OUR HERITAGE`. Section CTAs are lowercase mono: `work with us`, `View All`, `More News`.
- **`/our-team`:** H1 "Meet the people leading Iso" (56px/200) → H2 "Leadership Team"
  (48px/200) → 7 leadership H3s → H2 "Scientific Advisory Board" → 5 advisor H3s → H2
  "Join us as we realise the promise of digital biology." **12 people in total**, no PhD
  students, no engineers, no publications.
  Person card: portrait **280x322**, name `h3` 20px Söhne Leicht `#1E1E1E`, role 12px
  **Söhne Buch** with 0.36px tracking. Photography is a single unified commission —
  identical studio lighting, identical pale grey-blue seamless backdrop, identical framing,
  for a board that includes four knights and two Nobel laureates. The uniformity does more
  for the site's authority than any amount of copy.
- **Footer:** 326px, background **`carbon-black-400 #3A3A3A`**, all-caps mono, four
  columns — site links · CONTACT US (`press@` / `partnering@` / `connecting@`) · INFO
  (Privacy Notice, Cookie Notice, Terms & Conditions, Supplier Code of Conduct,
  **Manage Cookies**) · © 2026 ISOMORPHIC LABS. Three distinct contact addresses by
  audience rather than one generic inbox — a pattern worth stealing for our
  students / researchers / industry split.
- **Accessibility gap: alt text.** Of the first 14 `<img>` elements on the home, **13 have
  `alt=""`** — including news thumbnails and the "our goal" illustration. Only the Demis
  Hassabis portrait carries `alt="Sir Demis Hassabis, PhD"`. On `/our-team`, the portraits
  sampled all have empty alt. Every image *has* the attribute (so nothing is unlabelled by
  accident) but content images are declared decorative wholesale. Aionic's ~320-character
  architecture-diagram alt remains the standard; this is the counterexample.
- **Modern image formats confirmed:** `avif`, `jpeg`, `png`, `svg` on `/our-team`.
- **No `<time>` elements and no JSON-LD** on any page sampled.

### 2.6 Tone of voice

Three words: *"Solve all disease."* An imperative with no hedging, set at 56px in a weight
so light it almost dissolves — the typographic restraint is what stops the claim reading as
hubris. Body copy is first-person plural and plain ("We're entering a new era of drug
discovery — one where frontier AI can unlock deeper scientific insights, faster
breakthroughs, and life-changing medicines"). Section eyebrows are possessive and
institutional: *our goal*, *our leadership*, *our culture*, *our heritage* — the last one
claiming AlphaFold as inheritance. The register is pharmaceutical-corporate, not startup.

---

## 3. How much identity survives the click

This was the question the category was chosen for. The two answers are opposites, and the
contrast is the most useful thing in this note.

### Sakana: the identity collapses completely at `/blog/`

The home and the blog are, measurably, two different websites:

| | `sakana.ai` (home) | `sakana.ai/blog/` |
|---|---|---|
| Generator | hand-rolled static | **Jekyll 4.2.2** |
| Custom properties on `:root` | 6 | **0** |
| Body font | Poppins / Noto Sans JP (Google Fonts) | **PT Sans**, self-hosted **`.woff`** (not woff2) |
| Body text colour | `#0D0D0D` | **`#212228`** |
| Accent | **red `#CC2B2B`** | **blue `#6688FF`** |
| `clamp()` | 4 | **0** |
| CSS size | 7.7KB | 13.4KB |
| Site navigation | 5 dropdown menus, 19 links | **none — the wordmark only** |
| p5 canvas / fish | yes | no |
| Page height | 900px | **114,345px** |

Clicking "Research → Read our latest research" takes you from a 900px white poster with a
red fish to a 114,000px Jekyll blog in a different typeface with a different accent colour
and **no way back into the site except the wordmark**. Every design decision in §1 stops at
that boundary — the same failure mode as ASL's Notion links in batch 1, except here the
content is at least on the right domain and indexable.

There is one thin thread of continuity, and it is the mascot: post hero artwork reuses the
hand-drawn fish (visible in `blog-index-top-desktop-1440.png`, where six outline fish and
one red fish sit above the `sakana.ai` wordmark inside the article's own cover image). The
illustration system travels even when the CSS does not. **(Inference: the artwork is
produced per-post by the same hand, which is why it survives a platform change that the
stylesheet did not.)**

### Isomorphic Labs: the identity survives intact

`/our-team` at 1440 is the same system as the home, with no dilution: same boxed logo
lockup, same boxed mono nav, same 1240px container, same 16px gap, same 56px/200 Söhne
Extraleicht for the page title and 48px/200 for section titles, same hairline rounded
frames, same zero shadows, same `#3A3A3A` mono footer. The only concessions are content
ones — portraits instead of a molecular render, and 12 `opacity: 0` reveals instead of 3.
The token system is identical (165 properties, same values) on every page sampled.

The cost of that consistency is the 205KB stylesheet and a Webflow dependency; the benefit
is that the character is not a home-page performance. **For a research project that will
be judged on its interior pages — themes, publications, people — Isomorphic's answer is the
right one and Sakana's is the cautionary tale.**

---

## 4. Comparison

### What they agree on

1. **Zero `box-shadow`.** 89 elements at `none` on Sakana's home (one soft drop, on nav
   dropdowns only); 522 on Iso's home, 387 on `/our-team`, with **no exceptions at all**.
   All four reference sites in both batches are flat.
2. **No CTA in the hero.** Neither site puts a button next to its headline. (Aionic
   likewise; only ASL does.) Both make the first screen a statement, not a funnel.
3. **Mono uppercase, wide-tracked, at 10–12px, for every label.** Iso's Söhne Mono at
   12px/1px and Sakana's nav-and-utility register do the same job as Aionic's IBM Plex Mono
   at 12.8px/0.05em and ASL's 14px/0.3em sans eyebrows. **Four out of four sites** use a
   small tracked label layer to mark structure.
4. **Negative tracking and tight line-heights on display type** (Iso −1.7px at 56px,
   lh 1.1; Sakana's tagline lh normal at 32px/200).
5. **All nav links hidden behind a hamburger at 390px**, in both cases — as with both
   batch-1 sites. Four out of four.
6. **The accent, where there is one, passes AA; the quiet grey does not.** Sakana's red is
   5.32:1 but its `--light` grey is 2.81:1.
7. **Both ship third-party origins and analytics** — see §4.3.

### Where they diverge

| | **Sakana AI** | **Isomorphic Labs** |
|---|---|---|
| Home height @1440 | **900px — one screen, no scroll** | 5,629px |
| Home height @390 | **844px — one screen, no scroll** | 6,369px |
| `:root` custom properties | **6** | **165** (9 of them named `deleted`) |
| Accent | one hue, `#CC2B2B`, 5 elements | **six pastel `100`-step tints**, backgrounds only |
| Theme | light only, no toggle | light only, no toggle |
| Display type | Poppins 200, 32px, **fluid** | Söhne Extraleicht 200, 56px, stepped |
| `clamp()` | **4, one on the tagline** | **0** (18 `vw` units instead) |
| Family swap at mobile | no | **yes — Extraleicht 200 → Leicht 300** |
| Fonts | **Google Fonts CDN** (home) / self-hosted `.woff` (blog) | self-hosted `.woff2` on Webflow CDN |
| Container | **none — no `max-width` on the home** | 1240px |
| Radius | 5px / 8px, dropdowns only | 20px frames + a 6-step token scale |
| Signature device | **a p5 school of fish, one of them red** | **transparent hairline rounded frames** |
| Hero engine | **p5.js 1.4.1, 2D canvas, 1440x900, not DPR-scaled** | **3840x2160 `.webm` video + `<model-viewer>`** |
| Looping CSS animation | 1 (`fugu-breathe`, 3200ms) | 0 (`spin`, unused) |
| Scroll motion | none (page does not scroll) | **Webflow ix2 reveals + a scroll-scrubbed 4.52s video** |
| `prefers-reduced-motion` | **1 rule — covers the badge, not the canvas** | **0 — nothing is gated** |
| Header behaviour | `relative` (moot, no scroll) | **`absolute` — scrolls away, never returns** |
| Internal-page identity | **breaks completely (Jekyll, PT Sans, blue)** | **fully preserved** |
| Publications/news | 120 posts, one page, 9 filters, `<time datetime>` | 3 news teasers on home; no publication list |
| Alt text | logo alt is wrong (`"Sakana Chat"`) | **13 of 14 images `alt=""`** |
| Footer | **none — a 52px utility strip** | 326px, 4 columns, `#3A3A3A`, 3 contact addresses |

### 4.3 Third-party requests — the clearest regression from batch 1

Both batch-1 sites requested **zero external origins**. Both batch-2 sites are the
opposite, measured from `performance.getEntriesByType('resource')`:

| Site | Distinct third-party origins on home | Notable |
|---|---|---|
| sakana.ai | 3 | `fonts.googleapis.com`, `googletagmanager.com`, `region1.google-analytics.com` |
| isomorphiclabs.com | **9** | `cdn.prod.website-files.com`, `consent.cookiebot.com`, `consentcdn.cookiebot.com`, `ajax.googleapis.com`, `d3e54v103j8qbb.cloudfront.net`, `cdn.jsdelivr.net`, `googletagmanager.com`, `region1.google-analytics.com`, `storage.googleapis.com` |

Isomorphic at least gates analytics behind Cookiebot. **Sakana loads GA4 with no consent
mechanism of any kind** — no banner, no toggle, nothing. For a site of ours governed by
"no cookies / no tracking without consent", Sakana's home is a direct example of what not
to ship in the EU, and Isomorphic's is the compliant-but-heavy alternative (9 origins, a
consent vendor, and a "Manage Cookies" footer link to maintain for three years). Aionic and
ASL show the third option: **request nothing, and the problem disappears.**

---

## 5. Takeaways for TA-LLM

Each item is checked against the design system in `CLAUDE.md` (ink `#0F1420`, paper
`#F3EEE4`, amber `#E6A23C`; display serif + sans + mono; "Time, made visible"; dark default;
one accent per view; WCAG AA) **and** against the decisions already taken from batch 1
(1px-gap grids, Publications as a year timeline, fluid `clamp()` type, canvas hero +
animated SVG, themes as native Astro pages).

### Adopt

1. **Tint the surface, never the type — this is Isomorphic's best idea and it resolves our
   light-theme problem exactly.** Every one of Iso's six chromatic tokens is a `100`-step
   pastel used only as a background; black on `amino-azure #E6F7FF` measures **19.11:1** and
   on `genesis-orange #FFE4CC` **17.22:1**. `CLAUDE.md` already forbids amber, sage, violet
   and ice as light-theme text (1.89:1 to 3.12:1 on paper) and supplies darkened variants.
   Iso proves the *positive* form of the same rule: **derive a `-100` tint of each theme
   colour for section washes and theme-page headers, and keep the type ink.** Our four
   themes then get four recognisable surfaces at no contrast cost. Verified: amber
   `#E6A23C` on ink is **8.41:1**, sage **7.76:1**, ice **7.28:1**, violet **5.10:1** — all
   AA on the dark default, so the tints are a light-theme device only.

2. **Name the colour tokens after the subject matter.** `--_color---amino-azure-100`,
   `--_color---carbon-black-500`, `--_color---evo-pink-100`: Iso's palette teaches its
   domain every time a developer types a variable name. Our equivalents are already latent
   in `CLAUDE.md`'s concept — *drift*, *persistence*, *stream*, *horizon*, *lag*. Naming the
   theme colours `--theme-rlaif`, `--theme-cl`, `--theme-topology`, `--theme-agentic` rather
   than `--amber`, `--sage`, `--violet`, `--ice` costs nothing and makes "one accent per
   view" enforceable by name.

3. **Ship a mono label layer that is genuinely dominant.** On Iso's home, 107 text-bearing
   elements are Söhne Mono against 27 in the sans. Four out of four reference sites use a
   small, tracked, uppercase label register; Iso is the one that commits to it as *the
   interface*. Our JetBrains Mono should own nav, section eyebrows, dates, venues, DOIs,
   theme numbers 01–04 and the project codes (FIS-01152, CUP E53C25001820001) at
   **12px / 1px tracking / uppercase** — measured values worth copying directly.

4. **Swap the display cut, not just the size, at mobile.** Iso renders its h1 in Söhne
   **Extraleicht 200** at 56px and in Söhne **Leicht 300** at 28px. Instrument Serif and
   Fraunces both have the range to do this — Fraunces has an explicit optical-size axis
   (`opsz`), which makes the swap a single variable-font adjustment rather than a second
   file. **Actionable: pair our `clamp()` scale with an `opsz`/weight adjustment at the
   same breakpoint, so the serif stays imposing at 1440 and stays legible at 390.** No
   reference site in either batch combines fluid sizing with an optical-size change; doing
   both would be genuinely ours.

5. **Keep the fluid-type decision — Sakana validates it and it is now 1 of 4.** Sakana is
   the only reference site that puts `clamp()` where it matters
   (`clamp(22px, 2.6vw, 32px)` on the tagline, `clamp(280px, 38vw, 560px)` on the wordmark),
   and its hero scales with zero breakpoint jump. Aionic has 3 `clamp()` calls and a
   heading that never changes size; ASL and Iso have none between them. Batch-1 decision
   confirmed, with a working model to copy.

6. **A hairline-frame container language is a real alternative to the 1px-gap grid — use
   both, in different places.** Iso's transparent 20px-radius, 1px-border frames let the
   background artwork bleed through and past them, which is how the hero manages to be a
   diagram and a picture at once. That is an excellent fit for **"Time, made visible"**:
   a frame over a running canvas reads as *a window onto a signal*. **Recommendation: keep
   ASL's `gap: 1px` ruled-table grid for the themes 01–04 and the publications list (a
   dense, data-like reading), and use transparent hairline frames for the hero and theme
   headers, where the animated background must show through.** Note the tension with
   `CLAUDE.md`'s "restrained UI": 20px is a large radius for us — 8–12px over ink is
   probably the right adaptation. **(Inference: the radius value is a judgement call, not
   something the references settle.)**

7. **Three contact addresses, by audience.** Iso's footer splits `press@`, `partnering@`,
   `connecting@`. Our IA already splits Join us into students / researchers / industry;
   giving each its own destination in the footer makes that split real and keeps the PI's
   inbox clean.

8. **Keep `<time datetime>` on everything.** Sakana's blog carries a real `datetime`
   attribute on all 120 entries; Iso has none and ASL had none. Batch-1 takeaway 16
   confirmed — and Sakana shows it is free.

9. **A client-side category filter on a flat list is enough.** Sakana's blog filters 120
   entries across 9 categories with one small script and no pagination. Our filterable
   Publications page needs exactly this mechanism — filter by theme (01–04), by year and by
   type, over a year-grouped timeline that is entirely present in the HTML. It stays
   indexable, works without JS as a plain list, and needs no backend.

10. **Consider a scroll-scrubbed animation for one, and only one, explainer.** Iso's
    `/our-tech` scrub (4.52s of video, `paused: true`, `currentTime` mapped to scroll at
    ~1s per 830px) lets the reader drive a scientific animation at their own pace. For
    exactly one of our concepts — drift over time, or a token stream advancing through a
    window — this is a compelling fit. **But implement it as an animated inline SVG or a
    canvas driven by scroll, not as a video**: Aionic's `streamFlow` SVG diagrams
    (batch 1) already proved SVG is the right medium for us, and a video cannot be given
    alt text, cannot be themed, and cannot honour reduced motion by simply not moving.

11. **A unified photographic commission is worth more than any amount of copy.** Iso's 12
    leadership and advisory portraits share one backdrop, one lighting setup and one crop.
    For our People page — a PI, four PhD students, four co-supervisors — a single
    consistent portrait treatment (even just a shared backdrop colour drawn from the paper
    token and a common crop ratio) will do more for the project's credibility than any
    layout choice. Cheap, and entirely within our control.

### Avoid

12. **Do not let the internal pages fall off the design system.** Sakana's `/blog/` is a
    different generator, a different typeface, a different accent colour and has **no site
    navigation at all** — 114,345px of the company's actual research output, unreachable
    from itself except via the wordmark. This is batch 1's Notion problem in a new form.
    Our themes, publications, people and events are all native Astro pages sharing one
    layout and one token file; that decision is now confirmed twice over, and the
    corollary is explicit: **every page must carry the full site nav.**

13. **Do not build the hero on a p5 canvas that ignores `prefers-reduced-motion`.** Measured:
    Sakana stops the CSS badge animation under `reduce` but its p5 sketch keeps redrawing.
    Iso does not gate anything at all (0 occurrences in 205KB). `CLAUDE.md` already requires
    honouring the preference; the correct implementation remains Aionic's — a global CSS
    block **plus** a `matchMedia("(prefers-reduced-motion: reduce)")` check inside the
    canvas that renders **one static frame and returns**. Three of four reference sites now
    get this wrong; it is a cheap way for us to be better than all of them.

14. **Do not DPR-scale the canvas by accident.** Sakana's canvas is 1440x900 backing store
    against a 1440px CSS width — 1:1, so it is soft on every retina screen. Both batch-1
    canvases had the same defect. Four for four. **Actionable: size the backing store to
    `rect.width * devicePixelRatio` and scale the 2D context.** One line, and we beat every
    reference site on a visible quality axis.

15. **Do not make the header `position: absolute`.** Iso's 72px nav scrolls away and never
    returns, and on `/our-team` it visibly overlaps a photograph on its way out. On pages
    of ours that run long — a theme page, the publications timeline — the nav must stay
    reachable. Aionic's fixed + blurred header, or ASL's scroll-interpolated one, are both
    better answers.

16. **Do not declare content images decorative.** 13 of Iso's first 14 `<img>` elements
    carry `alt=""`, including news thumbnails and section illustrations; Sakana's logo
    carries the wrong alt entirely (`"Sakana Chat"` on the `sakana.ai` wordmark). Batch-1's
    Aionic standard — a ~320-character description of the actual data flow on an
    architecture diagram — is the bar. `CLAUDE.md` requires alt text on every image; these
    two sites show both ways to fail it (omit, and mislabel).

17. **Do not load fonts or analytics from a third party.** Sakana pulls Poppins and Noto
    Sans JP from `fonts.googleapis.com` and runs GA4 **with no consent mechanism at all**;
    Iso touches **9** third-party origins and needs Cookiebot, a "Manage Cookies" footer
    link and a cookie notice page to stay lawful. Both batch-1 sites requested **zero**
    external origins. `CLAUDE.md` mandates self-hosted fonts and no tracking without
    consent: self-hosting our three families and shipping no analytics makes the whole
    consent apparatus unnecessary, which is both cheaper and more honest for a
    publicly-funded project.

18. **Do not ship dead tokens — and certainly not nine of them named `deleted`.** Iso's
    `:root` carries 165 properties including
    `--base-color-brand--blue<deleted|variable-de000a4d-…>`. ASL shipped an unused
    `--destructive`. Batch-1 takeaway 17 stands, reinforced: define ink, paper, amber, the
    four theme colours, their light-theme text variants, their `-100` tints (item 1) and a
    small set of surface and border steps — and stop.

19. **Do not autoplay 31 looping videos on one page.** Sakana's blog index does exactly
    that on a 114,345px document, none of them reduced-motion gated. If our publications
    timeline ever carries result animations, they belong on the individual paper pages, as
    SVG or as click-to-play posters.

20. **Do not ship a home page with no `<h1>`.** Sakana's home has no heading element of any
    level; its name exists only as an image. Our `<h1>` is the project's full title —
    *"TA-LLM — Large Language Models: a matter of time?"* — with the amber "?" as the
    accent. That is a heading, a search result and a brand mark at once, and it should be
    real text.

### What differentiates us

21. **Dark by default is now unique across all four references.** Aionic: light with a dark
    toggle. ASL: dark but rigorously neutral. Sakana: light only, no toggle. Isomorphic:
    light only, no toggle. Our ink `#0F1420` with warm paper `#F3EEE4` at **15.91:1** sits
    in nobody's territory, and amber at **8.41:1** on it is comfortably AAA. Batch-1
    takeaway 19 now holds against four sites instead of two.

22. **The display serif remains the single highest-leverage choice, and it is now 4-for-4.**
    Jost, Inter, Poppins, Söhne — every reference site uses a geometric or neo-grotesque
    sans for display. A display serif set large against a mono metadata layer would look
    unlike all four, and it signals *research project* rather than *AI company*. Note what
    Isomorphic gets from an ultralight sans at 56px: authority through restraint. An
    Instrument Serif or Fraunces at a comparable size on ink, with our mono label layer,
    can deliver the same effect with a scholarly rather than pharmaceutical register.

23. **One accent, and make it carry the concept.** Sakana's identity is one red fish in a
    grey school — the accent is not a colour choice, it is the argument of the company
    (emergence from many small agents) rendered as a single chromatic event on an
    otherwise monochrome page. Five elements. That is the standard for "one accent per
    view". Our amber should do the same work: **the "?" in the title, the current point on
    a time series, the "now" marker on a timeline** — the accent marks *the present moment*
    in a system that is otherwise about the past. That is "Time, made visible" with a
    colour rule attached.

24. **We can own the one thing neither of these labs has: a real publication record.**
    Isomorphic has no publications list at all — its research surface is three news
    teasers. Sakana has 120 undifferentiated blog posts with no per-paper metadata, no
    venues, no authors, no BibTeX. Across all four reference sites, the best publication
    page found is Aionic's plain year-grouped timeline. Our BibTeX-driven, filterable,
    theme-colour-coded timeline with a page per key paper would be the strongest feature on
    any of them — and for a MUR-funded project judged on scientific output, it is also the
    page that matters most.

25. **A small mascot or motif that travels is cheap and works.** The one part of Sakana's
    identity that survived the platform change was the hand-drawn fish, because it lives in
    artwork rather than CSS. Our equivalent — a persistence ring, a barcode, a drift arrow —
    drawn once as a small SVG set and reused in theme headers, paper cards, slides and
    social images, would give the project a recognisable mark that outlives any single
    stylesheet. **(Inference: I am extrapolating from Sakana's blog artwork; the site does
    not document this as a strategy.)**

---

## 6. Screenshot index

> **These screenshots are kept locally only and are not committed.** They are third-party
> reference material, so `research/moodboard/` is git-ignored
> (`.gitignore:15` — `research/moodboard/*`, verified with `git check-ignore`) and the files
> below will not be present in a fresh clone. They are shared on request.

All paths relative to the repository root.

### Sakana AI — `research/moodboard/sakana/`

| File | Page | Viewport | Note |
|---|---|---|---|
| `home-desktop-1440.png` | Home, full page | 1440 | full page = 900px; overwrote the file from the interrupted earlier attempt |
| `home-hero-desktop-1440.png` | Home, hero viewport | 1440 | identical framing to the full page |
| `hero-phase-1-desktop-1440.png` | p5 fish canvas, phase 1 | 1440 | t ≈ 0s after settle |
| `hero-phase-2-desktop-1440.png` | p5 fish canvas, phase 2 | 1440 | t ≈ +2.5s |
| `hero-phase-3-desktop-1440.png` | p5 fish canvas, phase 3 | 1440 | t ≈ +5.5s |
| `home-mobile-390.png` | Home, full page | 390 | full page = 844px |
| `home-mobile-390-menu-open.png` | Home, hamburger menu open | 390 | all 19 nav links revealed |
| `blog-index-top-desktop-1440.png` | `/blog/`, first viewport | 1440 | wordmark-only masthead + 9 category filters |
| `blog-index-desktop-1440.png` | `/blog/`, full page | 1440 | 114,345px document — large file |

### Isomorphic Labs — `research/moodboard/isomorphiclabs/`

| File | Page | Viewport | Note |
|---|---|---|---|
| `home-desktop-1440.png` | Home, full page (5,629px) | 1440 | cookie banner dismissed with "No thanks" |
| `home-hero-desktop-1440.png` | Home, hero viewport | 1440 | hairline frames + molecular render |
| `hero-phase-1-desktop-1440.png` | Hero video, phase 1 | 1440 | t ≈ 0s |
| `hero-phase-2-desktop-1440.png` | Hero video, phase 2 | 1440 | t ≈ +2.2s |
| `hero-phase-3-desktop-1440.png` | Hero video, phase 3 | 1440 | t ≈ +4.4s |
| `home-mobile-390.png` | Home, full page (6,369px) | 390 | mobile hero source is `home_hero.mov` |
| `our-team-desktop-1440.png` | `/our-team`, full page (5,261px) | 1440 | chosen internal page |
| `our-team-hero-desktop-1440.png` | `/our-team`, hero viewport | 1440 | 56px/200 h1 |
| `our-team-roster-desktop-1440.png` | `/our-team` at y=1400 | 1440 | leadership grid; shows the absolute nav overlapping artwork |

No text or assets were copied from either site; the screenshots are reference captures and
all analysis above is original description.
