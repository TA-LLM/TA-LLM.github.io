# Reference site analysis — Research institutes: Ai2, Mila, Vector Institute

**Date of capture:** 2026-09-17
**Method:** Playwright 1.64 driving system Chrome (`channel: "chrome"`) in an isolated
persistent context created for this batch only — deliberately *not* the shared Playwright
MCP browser, which another agent was using at the same time. Viewports 1440×900 and
390×844, `deviceScaleFactor: 1`.
All numeric values below were read from the live DOM/CSSOM via `evaluate` (computed styles,
`:root` custom properties, concatenated `cssRules` text, `<form>` markup, resource origins,
canvas contexts), never estimated from the screenshots. Contrast ratios were computed from
the extracted hex values with the WCAG 2.x relative-luminance formula. Motion was verified
by md5-diffing successive screenshots of the same element, both normally and with
`prefers-reduced-motion: reduce` emulated.
Statements that go beyond what was directly measured are marked **(inference)**.

**Scope note:** this is the *research institutes* category — the closest of all five
batches to what TA-LLM actually is: a publicly funded research organisation with people,
papers and events that accumulate for years. The extra brief for this batch was therefore
**how they survive large volumes** of publications, people and events. That question is
answered with measured numbers in section 4.

**Loading issues:** none. All three sites rendered fully at both widths. One URL guess was
wrong: `vectorinstitute.ai/research/publications/` redirects to `/research-talent/`, and
the real publication database sits at `/research-talent/publications/`. The screenshot
taken from the redirect was kept and renamed `research-talent-desktop-1440.png` rather than
deleted, and the correct pages were captured separately.

**Cookie consent — three different philosophies, all measured on a fresh profile:**

| | Ai2 | Mila | Vector |
|---|---|---|---|
| Form | In-flow bar at the bottom of the page, `position: static`, 1440×36 box | Floating card, bottom-left, ~760px wide | Modal card, top-centre, over the header |
| Buttons | Manage Options · Reject All · **Approve All** | Set cookies · Refuse cookies · **Accept cookies** | **Accept** · Decline |
| Reject offered at the same level? | Yes | Yes | Yes |
| Blocks the page? | No — the page is fully usable and scrollable behind it | No | Partially: it sits over the header and hero |
| Third-party origins requested **before** any consent action | **2** (`allenai.org`, `www.datocms-assets.com`) | **17** | **21** |

That last row is the single most important measurement of this batch and it is discussed
in 3.3. Ai2 ships a page that requests nothing from an ad or analytics network until you
say yes; the other two fire Google Tag Manager, DoubleClick, HubSpot and (Mila) LinkedIn
ads while the consent dialog is still on screen.

---

## 1. Ai2 — allenai.org

Stack, from measured artefacts: **Next.js** (font and asset URLs under
`/_next/static/media/`), **Panda CSS** (atomic class names of the form `d_grid`,
`bg-c_background.reversed`, `c_text.primary.reversed`, `fs_[clamp(...)]`), **DatoCMS** for
media (`www.datocms-assets.com`), and **container queries** throughout (`@/md:`, `@/wideWithPad:`
class prefixes and `cqw` units). **(inference: Panda + DatoCMS + Next is the whole stack;
only the class-name grammar and asset hosts were observed, not the build.)**

### 1.1 Palette

Ai2 runs a three-colour system that is structurally the same shape as ours:

```
deep teal   #0A3235   ink / dark surface   (colour on 1549 elements)
cream       #FAF2E9   paper / light surface (colour on 171, background on 35)
hot pink    #F0529C   single accent         (colour on 95, background on 26)
deeper teal #032629   secondary dark surface (62)
```

Measured contrasts:

| Pair | Ratio | Verdict |
|---|---|---|
| cream `#FAF2E9` on teal `#0A3235` | **12.46:1** | AAA |
| teal on cream (inverted sections) | 12.46:1 | AAA |
| teal `#0A3235` on pink `#F0529C` (the "Approve All" button) | **4.20:1** | AA large only — fails for 16px body text |
| pink `#F0529C` on white `#FFFFFF` (paper titles on `/papers`) | **3.29:1** | **fails AA** at 20px/500 |
| pink `#F0529C` on cream `#FAF2E9` | **2.96:1** | fails AA |

This is exactly the trap `CLAUDE.md` already anticipates for the light theme: a saturated
mid-tone brand accent reads fine as a fill and fails as text. Ai2 has not applied the
darkened-variant rule we wrote down (amber `#8A5A10` etc.), and the result is a
publications list whose *titles* — the most important text on the page — sit at 3.29:1.

`:root` carries **16 custom properties and not one of them is a colour**. They are all
parameters for the logo mark animation:

```
--duration 4.75s   --delay 0.25s   --loop forwards
--timing-function cubic-bezier(0.860, 0.000, 0.070, 1.000)
--pin-stroke-width-before 25 / -middle 2.5 / -after 0.12
--mark-scale-before 0.0735 / -after 1   (+ -mobile variants: 0.475 / 4.6)
--vectors-before path("M19.1697,31.7183H0.0255v-4.3437h17.4068c9.5161,0,11.00…")
--vectors-after  path("M20.499,40H0.0255V20.4996h16.4816c2.2005,0,3.9919-1.79…")
```

So the design tokens are compiled away by Panda, and the only runtime variables are for a
**two-keyframe `path()` morph of the logo over 4.75s with a heavy ease-in-out**.
**(inference: the mark morphs between the two declared path shapes; the animation was not
observed running during the 5s capture window — see 1.4.)** This is worth copying as a
*technique*: an SVG shape morph parameterised by custom properties is precisely the kind of
"the movement is the subject" motion our batch-1 decision calls for.

### 1.2 Typography

Three self-hosted families, zero font CDNs: **telegraf** (display + UI), **Manrope**
(declared in every stack as the second choice), **Roboto Mono**. 14 `@font-face` rules,
all `woff2` under `/_next/static/media/`, plus Next.js-generated
`local("Arial")` fallback faces (`"telegraf Fallback"`, `"Manrope Fallback"`) to hold the
metrics during swap — a no-layout-shift trick worth stealing.

Measured, at 1440 → 390:

| Role | 1440 | 390 | Notes |
|---|---|---|---|
| Hero headline (`<span>` inside `h1`) | **61.00px / 64.00px** | **32.00px / 33.57px** | `font-size: clamp(2rem, 4.23612cqw, 7rem)`, `line-height: 1.04918`, `letter-spacing: -0.008em` (−0.488px at 1440) |
| Section `h2` | 61px / 61px, w400, ls −1.83px | 48.39px / 48.39px, ls −1.45px | fluid |
| Body `p` | 16px / 24px, ls 0.5px | 16px / 24px | fixed |
| Nav group label `h3` | 14px / 18.2px | 14px / 18.2px | fixed |
| `/papers` page `h1` | 36px, w700 | — | fixed |
| `/papers` paper title `h2` | 20px, w500 | — | pink |

Two things stand out. First, the hero uses **container-query units (`cqw`), not `vw`** —
the headline scales with its container, not the window, which is why it holds its measure
inside a 1280px content column instead of tracking a 1440px viewport. Only **3 `clamp()`
rules** appear in the 301 KB / 425 readable rules of same-origin CSS, but each one does a
lot of work. Second, the `h1` element itself computes to 36px while the span inside it
computes to 61px — a reminder to measure the element that actually paints, not the
semantic wrapper.

### 1.3 Grid, spacing, components

- Content column **1280px** inside a 1440 viewport (80px side gutters).
- Grids measured: `repeat(3, 1fr)` → 413.33px columns with **20px** gap; a 2-up asymmetric
  `705.66px 550.34px` with **24px** gap (and its mirror `550.33px 705.67px`); chip rows at
  **8px**; and — notably — **`grid-template-rows: subgrid` with `grid-row: span 4`** so
  that heading, body, meta and CTA line up across sibling cards.
- At 390 every grid collapses to a single 350px column (40px total side padding).
- **No shadows anywhere**: `box-shadow: none` on every card, button and row sampled.
- Radii: 0px on buttons and list rows, 4px on editorial cards, full pill on the hero CTA.
- Borders used as the only card delimiter: e.g. consent buttons are `2px solid #0A3235`,
  `border-radius: 0`, `padding: 2px`.
- `/news` cards: 3-up, 413×721px, radius 4px, cream on cream, padding `20px 20px 35px`.

### 1.4 Motion

Measured, and the result is the surprise of this batch: **Ai2's home page does not move.**

- Three viewport captures at t≈0 / 1.2 / 2.4s are **byte-identical** (md5 `10a1621e50` ×3),
  and three further captures spaced 2.5s apart are also identical (`ae4706be55` ×3).
- 0 `<canvas>`, 0 `<video>`, 0 SMIL (`<animate>`) elements, no Lottie player.
- 63 `<svg>` elements, **0 with a running CSS animation**, 4 with a transition.
- Transition durations in use: **0.5s** (28 elements), **0.3s** (20), **0.2s** (1) — hover
  and focus only.
- **19 rules live inside `prefers-reduced-motion` media queries**, by far the most of the
  three sites.

The hero is a **static full-bleed render** — an abstract 3D ribbon in teal, violet and
magenta — with the headline centred over it in cream and a pink pill CTA beneath. The
header is a floating cream pill bar inset from the viewport edges, `position: fixed`,
79px tall, transparent background (the pill is an inner element).

### 1.5 Navigation, hero, IA

Five top-level items — **Open models · Applications · Research · News · Institute** — each
opening a mega-menu; 29 links are exposed in the header markup. The taxonomy is by
*artefact*, not by discipline: Olmo / Tülu 3 / Molmo / Playground under models,
Asta / Semantic Scholar under applications, OlmoEarth / EarthRanger / Skylight under
applications-for-the-planet.

Mobile: a single `<button aria-label="Toggle mobile navigation menu" aria-expanded="false">`
— correct ARIA, which neither of the other two sites manages.

At 390 the page is 10,633px tall and `document.documentElement.scrollWidth === 390 ===
window.innerWidth`: **no horizontal overflow**.

Semantics: exactly **1 `<h1>`**, 9 `h2`, 9 `h3` on the home page. **0 `<time>` elements and
0 JSON-LD blocks** were found on `/`, `/papers`, `/team` or `/news`. For an institute whose
own product is a scholarly search engine, that is a genuinely strange omission.

### 1.6 Interior page — `/papers` (chosen)

Chosen because it is the only publications *database* in this batch that combines filters
and pagination, i.e. the pattern we have to build.

- **10 papers per page.** The list container is `display: grid`, one column, **8px gap**,
  1280px wide, with 11 children: the filter panel plus 10 rows.
- Row: **1280×188px**, background white on the cream page, `padding: 20px`, radius 0,
  **no border, no shadow**. The 8px gap over a cream page is what makes the rows read as a
  stack of cards rather than a table — the same device as our 1px gap, four notches looser.
- Row anatomy, measured: title `h2` 20px/w500 pink → author `span`s 14px teal → a
  `<button>` "+25 authors" disclosure → abstract `p` 16px/24px with an "Expand" button →
  venue and tags. The row is *dense in information and generous in space*.
- Filter panel: a white card 1280×170, padding 20px, containing a text input `q` and three
  `<select>`s — `award` (2 options), `year` (17: Any + 2010→2026), `tags` (10) — plus a
  "Filter" submit button.
- **Filters are in the URL**: `/papers?q=&award=false&year=2016&tags=`.
- **Pagination is an offset parameter**: `?o=10`, `?o=20`, `?o=30`… Previous on page 1 is a
  `<button disabled>` and Next is an `<a href>` — the correct accessible pattern (a disabled
  control is not a link). There are **no page numbers, no jump-to-page, no result count**.
- **Depth, measured by binary search on the offset**: `?o=1180` returns 10 rows, `?o=1190`
  returns 6, `?o=1200` returns "No papers were found." → **1,196 papers**, i.e. ~120 pages
  reachable only by pressing Next ~119 times.

### 1.7 Tone of voice

Plain, declarative, mission-first: "Breakthrough AI to solve the world's biggest problems",
"Truly open". Section headings are compound and dashed — "AI for science — From dataset to
discovery", "Embodied AI — Bringing 3D reasoning into the open", "Careers — Join us".
No hedging, no academic register, no exclamation marks. The word "open" carries the brand.

---

## 2. Mila — mila.quebec

Stack, from measured artefacts: **Drupal** (theme at
`/sites/default/themes/mila_v1/`, `field-name-body`, `field-item even` class grammar,
`?page=N` pager), **Swiper** for carousels, **MathJax**, **HubSpot** forms, **Google Tag
Manager**.

### 2.1 Palette

One colour does everything:

```
deep purple #662E7D   text, headings, icons, borders — colour on 1358 elements
off-white   #F4F5F1   page background
white       #FFFFFF   card surfaces (background on 17)
light purple #CEB3D3  button borders
pale purple #E6D9E9   2px row rules
cyan        #1EAEDB   secondary accent (11 elements)
```

Measured contrasts: purple on off-white **8.52:1**, white on purple **9.33:1** — both AAA.
Mila does not use black for body text at all; the brand colour *is* the text colour. That
is the boldest single decision in this batch and it is also the cheapest: one hue, two
surfaces, everything passes.

`:root` has **19 custom properties and none belong to the design system** — 15 are Drupal
admin-toolbar variables (`--manager-menu-*`, `--manager-ui-accent-color-hex`) and 4 belong
to Swiper (`--swiper-theme-color: #007aff`, `--swiper-navigation-size: 44px`). The whole
palette is compiled Sass. **(inference: Sass, from the Drupal theme layout; the
preprocessor was not observed directly.)** Consequence: no runtime theming, no dark mode,
no way for an editor to retheme a section.

### 2.2 Typography

**TT Norms Pro** in 11 self-hosted `woff2` weights (Light → ExtraBold plus italics) and
**Brockmann** in 3. No Google Fonts, no CDN for type. Every element measured on the home
page and on `/research/publications` resolves to `"TT Norms Pro", sans-serif` — a
single-family system.

| Role | 1440 | 390 |
|---|---|---|
| Hero headline (an `<h2>`, not the `h1`) | **58px / 66.7px**, w600 | **40px / 52px**, w600 |
| Page `h1` (`/publications`) | 52px / 63.44px, w500 | 38px / 41.8px |
| `h3` | 32px / 41.6px, w500 | 22px / 28.6px |
| Body `p` | 18px / 26.1px | 18px / 26.1px |
| Nav link | 16px / 19.2px, w500 | 16px / 19.2px |

**`clamp()` appears 0 times in 5,507 readable rules across 843 KB of CSS.** Every step in
the table above is a breakpoint jump. This is the strongest possible argument for the
fluid-type decision already recorded in `CLAUDE.md`: the largest, best-funded site in this
batch resizes type in steps, and you can see the step.

Semantics problem worth recording: the home page's only `<h1>` contains the word **"Home"**
and is 1×1px (visually hidden). The visible hero headline — "Inspiring the development of
artificial intelligence for the benefit of all", with two phrases underlined as a graphic
device — is an `<h2>`. So the document outline says the page is about "Home".

### 2.3 Grid, spacing, components

- Content column **1240px** (wrappers at 1200 and 1400 also measured), inside 1440.
- **Zero CSS grid containers on the home page.** Every layout measured is flex or float.
  The publication list is `display: flex` with `gap: 0px 30px` and a `masonry-grid` class.
- Buttons are pills: `border-radius: 9999px`, `1px solid #CEB3D3`, `padding: 8px 20px`,
  38px tall; icon buttons are `border-radius: 100%`, 40×40.
- List rows are separated by **2px solid `#E6D9E9`** top borders on 1300×80 rows — a ruled
  table, which is the same visual idea as our 1px gap, executed with a border instead of a
  gap.
- **No shadows and no radius on cards** anywhere measured.

### 2.4 Motion

- **One easing token for the whole site**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` at
  **0.25s**, applied to 106 single-property transitions, 79 two-property and 59
  three-property declarations. Outliers: 0.3s (1), 0.4s (1), 0.075s (1), `1s, 0.25s` (3).
- Scroll-triggered reveals: content blocks carry `in-view` and `animation-done` classes
  after entering the viewport. **(inference: a Drupal "animate on view" behaviour toggling
  the class; the JS was not read.)**
- **0 rules inside any `prefers-reduced-motion` media query.** Nothing on this site turns
  off for a user who asks for less motion.
- Hero: a static photo collage masked into geometric shapes (circles, quarter-arcs,
  squares) in yellow, orange, teal, crimson and blue — a visual echo of the dot-grid logo.
  Three captures over 2.4s are byte-identical; across a 5s window one frame changed once.
  **(inference: a Swiper autoplay step or a lazily decoded image, not a continuous
  animation.)**
- 43 `<svg>`, 0 animated, 19 with transitions.

### 2.5 Navigation, hero, IA

Two-tier header: a purple utility strip (Directory · Insights · News · Careers · **Français**)
above a white bar with six mega-menu sections — **Research · Prospective Students ·
AI4Humanity · Continuing Education · Industry · About**. The taxonomy is by *audience*,
not by artefact. Research expands to Core Expertise, Core Academic Members, Blog,
Publications, Open Source Software and six Strategic Priorities (AI and Health, Responsible
AI, Environment and Energy, AI4Science, Language and Image, Robotics) — i.e. **the research
themes are first-class nav items**, which is precisely the structure our four themes need.

Hero: split composition — headline left in purple on off-white, collage right. At 390 the
page is 9,287px and there is **no horizontal overflow** (390 === 390). The mobile trigger
is `.mobile-toggle.hamburger` with **no `aria-expanded` and no `aria-label`**, next to a
correctly labelled "Toggle search menu" circular button.

### 2.6 Bilingual FR/EN — measured

This is the part of the batch that matters for a possible IT/EN version of our site.

- **Path prefix**: `/en/…` and `/fr/…`. There is no unprefixed canonical page; the root
  redirects.
- **Slugs are translated, not just the prefix**:
  `/en/research/publications` ↔ `/fr/recherche/publications`.
- **`<link rel="alternate" hreflang="en|fr">` is emitted on every page measured**, and it
  points at that page's real counterpart — not at the home page, which is the usual bug.
  No `x-default` was found.
- `<html lang="en">` on the `/en` tree.
- The switcher is a **single "Français" link** in the utility strip, not a dropdown: one
  click, one alternative, no menu. **(inference: it links to the current page's counterpart
  via the same mechanism as the `hreflang`; only the link's presence was measured.)**

### 2.7 Tone of voice

Institutional and mission-led, in the register of a public-interest organisation:
"Inspiring the development of artificial intelligence for the benefit of all", "Located in
the heart of Quebec's AI ecosystem". Programme names do the differentiating work (Mila
Ventures Launchpad, AI Policy Compass, Indigenous Pathfinders in AI). Much more "institute"
and much less "lab" than Ai2.

---

## 3. Vector Institute — vectorinstitute.ai

Stack, from measured artefacts: **WordPress block theme** (190 `:root` properties, all
`--wp--preset--*` / `--wp-admin-*`), **The Events Calendar** plugin (`tribe-events-*`
classes, `tribe_l10n_datatables`), **HubSpot** (8 hosts), **Chatbase** chat widget,
**Google Fonts**. The publications page also emits a `newIslands = [{"clientOnly":false,
"hydrateOn":…}]` payload — an islands-hydration runtime embedded in the WordPress page.
**(inference: an Astro- or islands-style component layer inside WordPress; only the
serialized payload was observed.)**

### 3.1 Palette

The opposite of Mila: a **ten-colour brand ramp declared as theme presets**.

```
--wp--preset--color--vector-magenta   #E00087     --vector-cobalt     #313CFF
--wp--preset--color--vector-turquoise #589BD5     --vector-violet     #8A25C9
--wp--preset--color--vector-tangerine #FF9E00     --vector-lime       #AED15E
--wp--preset--color--vector-blue      #3844FF     --vector-purple     #6C33DD
--wp--preset--color--vector-aqua      #52C7DE     --vector-yellow     #FFA800
--vector-black #000000  --vector-white #FFFFFF
--vector-grey-light #f1f1f1  --vector-grey #e9e8e8  --vector-grey-dark #626262
```

What is actually *used* on the home page is far narrower: black `#000000` (1,080 elements),
white (27), grey-dark `#626262` (14), magenta `#E00087` (7 as colour, 8 as background),
navy `#15295A` (13 — HubSpot's own UI), and **`#0000EE` on 123 elements**, which is the
browser's default unstyled-link blue.

| Pair | Ratio | Verdict |
|---|---|---|
| white on magenta `#E00087` | **4.65:1** | AA (normal text) |
| black on white | 21:1 | AAA |
| grey-dark `#626262` on white | 6.10:1 | AA |
| `#0000EE` (default link) on white | 9.40:1 | AAA, but unstyled |
| cobalt `#313CFF` on white | 6.52:1 | AA |
| violet `#8A25C9` on white | 6.59:1 | AA |

The ten-colour ramp is the thing to be wary of. `CLAUDE.md` says **one accent per view**;
Vector declares ten and then, on the home page, mostly uses black. The ramp exists for the
editors, not for the reader, and the visual identity ends up carried entirely by the hero
gradient. Our four theme colours (amber / sage / violet / ice) are a ramp too — the
difference must be that each one is *scoped to one theme page* rather than offered as a
palette to pick from.

### 3.2 Typography

Four families, two of them from a CDN:

- **Karbon** — 6 self-hosted `woff2` faces, display and headings.
- **"Open Sans", -apple-system, …** — the body stack; Open Sans is not self-hosted, so this
  resolves to a system font on most machines. **(inference)**
- **Lato** — loaded from `fonts.googleapis.com` / `fonts.gstatic.com`.
- **Roboto** — a `@font-face` pointing at `fonts.gstatic.com`.

| Role | 1440 | 390 | Preset |
|---|---|---|---|
| Hero `h1` | **86.4px / 86.4px**, w700 | **48px / 48px** | `--wp--preset--font-size--h-1-large: clamp(3rem, 6vw, 6.875rem)` |
| Interior `h1` | 70px / 70px | — | `--h-1: clamp(2.5rem, 6vw, 4.375rem)` |
| `h2` | 60px / 60px | 34px / 34px | `--h-2: clamp(2.125rem, 5vw, 3.75rem)` |
| `h3` | 34px / 34px | 22px / 22px | `--h-3: clamp(1.75rem, 5vw, 3.125rem)` |
| Body | 16px / 22.4px | 16px / 22.4px | — |
| Publication title | 24px / 24px, w700 | — | — |

**97 `clamp()` rules** were counted in 4,773 readable rules / 532 KB. The entire type ramp
is declared once, as tokens, and every heading level has its own floor, slope and ceiling:
`h-1 … h-6`, `x-large`, `headline`, `body-large`, `body-medium`, `button`. Note the
line-heights: every heading is `1.0` (86.4px text on an 86.4px line) — a tight display
setting that only works because Karbon has short descenders.

Spacing is tokenised too, on a ≈×1.5 ratio, plus two genuinely fluid steps:

```
--wp--preset--spacing--20: 0.44rem   --30: 0.67rem   --40: 1rem   --50: 1.5rem
--60: 2.25rem   --70: 3.38rem   --80: 5.06rem
--wp--custom--spacing--small:  max(1.25rem, 5vw)
--wp--custom--spacing--medium: clamp(2rem, 8vw, calc(4 * var(--wp--style--block-gap)))
```

### 3.3 Grid, spacing, components

- Content column **1340px** inside 1440 (50px gutters) — the widest of the three.
- Grid gaps measured: **32px** on card grids and statistics grids; 30px inside HubSpot forms.
- Buttons: `border-radius: 10px`, `padding: 15px 30px 7.5px`, **`font-size: 30px`**, w700,
  `transition: 0.35s cubic-bezier(0.1, 0.46, 0.32, 0.9)`. A 30px button label is unusual and
  it is a deliberate part of the identity — the CTA is typographically as loud as an `h3`.
- **381 elements share the 0.35s duration** — like Mila, one global transition token.
- Shadow presets are declared (`natural`, `deep`, `sharp`, `outlined`, `crisp`) but none of
  the sampled cards uses one; the hero link cards are translucent panels with a 1px white
  border over the gradient.

### 3.4 Motion

This is the only site of the three with a real animated hero, and the only one that fails
the reduced-motion test.

- **`<canvas>` 1440×900, WebGL context**, `position: absolute` inside
  `.hero-1__background.hero-1__background--gradient.fluid-gradient` — an animated fluid
  gradient in magenta → violet → blue with a drifting pixel-square motif over it.
- **Verified animating:** two screenshots of the canvas 1.5s apart differ
  (md5 `501dfb65d0` vs `0da265a113`). The three `hero-phase-*` captures are all different
  files, unlike Ai2's and Mila's.
- **Verified *still* animating under `prefers-reduced-motion: reduce`**: after reloading with
  the media feature emulated, two canvas captures 1.5s apart still differ
  (`e60520f363` vs `333d7ddf4a`). **The hero ignores the setting.**
- Only **1 rule** in the whole readable CSS sits inside a `prefers-reduced-motion` query.
- Third-party motion on top: a HubSpot banner animation (0.5s), and the Chatbase bubble
  (0.18s entrance plus `chatbase-spin 2s linear infinite` and `chatbase-dash 1.5s infinite`)
  — two infinite animations injected by a vendor script, which no amount of care in our own
  CSS would have stopped.

Second-order observation: the hero headline is white over a *moving* gradient. The 4.65:1
figure above is measured against the declared magenta fallback `#E00087`; over the animated
canvas the effective background changes continuously, so the true contrast is a range, not
a number. **(inference: parts of the gradient are lighter than the fallback, so the
headline dips below 4.5:1 at some frames; not measured per-frame.)**

### 3.5 Navigation, hero, IA

Four mega-menu sections — **Research & Talent · AI Adoption · Impact · About** — plus
Sign In, a language toggle (EN / FR-CA) and search. Research & Talent expands to Core
Research Areas, Research Team, Publications & Papers, AI Engineering, Students, Hire AI
Talent, Research Opportunities. Like Mila, the taxonomy is by audience; unlike Mila, the
research areas are one level deeper.

Hero: full-bleed WebGL gradient, huge white headline bottom-left (three lines at 86.4px),
and two **translucent link cards** stacked right, each with a circular arrow button — a
"latest two things" slot in the hero itself. At 390, page height 11,224px, **no horizontal
overflow**.

Bilingual: `hreflang` `en` / `fr-ca`, prefix `/fr-ca/`, **slugs are not translated**
(`/research-talent/` ↔ `/fr-ca/research-talent/`). `<html lang="en-CA">`. Switcher is a
two-state text toggle in the header.

Semantics: 1 `<h1>` per page; JSON-LD `WebPage`, `ImageObject`, `BreadcrumbList`, `WebSite`,
`Organization` on the home page; **`Event` ×4 plus 3 `<time datetime>` on `/events`**; and
**0 `<time>`, 0 `ScholarlyArticle` on the publications database**.

### 3.6 Interior page — `/research-talent/publications/` (chosen)

Chosen because it is the most instructive failure in the whole reference survey, and
because it is the exact page we are about to build.

There are in fact **two** pages with almost the same name:

1. `/research-talent/publications-and-papers/` — an **editorial landing page**: 5,735px,
   five `h2` sections ("From our researchers", "Vector research, translated", "Building AI
   tools for global impact", "Open source", "Stay updated"), ten highlighted items, no
   filters, no list. It is a magazine front page for research.
2. `/research-talent/publications/` — the **database**.

Measured on the database page, unfiltered:

| Metric | Value |
|---|---|
| Entries rendered | **1,000** (`main h3` count) |
| Page height | **256,772px** |
| DOM nodes | **13,950** |
| HTML transferred | **1.26 MB** (1,287,227 chars in the DOM) |
| Links | 1,068 |
| `<p>` elements | 1,997 |
| DOMContentLoaded / load | 1.13s / 1.37s |
| Filters | **none** |
| Pagination | **none** |
| Result count shown | **none** |
| `<time datetime>` | 0 |
| JSON-LD for publications | none (`CollectionPage`, `WebSite`, `Organization` only) |

Each entry is 893×229px, `padding: 25px 80px 25px 25px`, title 24px/24px Karbon bold black,
then a plain author string, then the year. **No border, no radius, no shadow, no alternating
background**: 1,000 rows separated by whitespace alone, which at 229px a row means a reader
sees roughly four at a time and has no landmark to hold position.

There *is* a filter, but only one, and it is invisible until used: a scoped GET form on the
same URL —

```html
<form role="search" class="publications-searchform"
      action="…/research-talent/publications/" method="GET">
  <label class="visuallyhidden" for="field-input-search-filter">Search</label>
  <input type="search" id="field-input-search-filter" name="s"
         placeholder="What are you looking for?">
```

Measured with `?s=time+series`: **17 results**, and now the page *does* print a count
("17 results"), drops to **9,118px**, **135 KB**, **1,039 DOM nodes**. Everything good about
this page only exists after you type something.

Other Vector lists, measured: `/research-talent/research-team/` renders **191 person links
and 198 images on one 3,795px page**, grouped under headings ("Faculty Members", …), with no
filter, no search and no pagination; `/about/team/` renders 11 staff cards (206px each) on
2,562px.

`/events/` is the best page on the site and the best events page in the batch: The Events
Calendar gives it a keyword + date bar, a List/Month view switch, Previous/Next Events
links, **"Subscribe to calendar" with Outlook 365 / Google / iCal export**, `Event` JSON-LD
for all four upcoming events, and `<time datetime>`. "4 events found." is printed above the
list.

### 3.7 Tone of voice

Confident, commercial, outcome-oriented: "Where AI possibilities come to life", "Bridging
research and real-world impact", "Advancing AI research and developing talent". Case-study
framing throughout ("How Linamar built production-ready AI through Vector's Agentic AI
Bootcamp"). Of the three, this is the one that reads like a company.

---

## 4. Long lists: publications, people, events — measured

This section answers the question left open by the earlier batches. For context, the
figures already recorded elsewhere in `research/notes/`: **DeepMind** declares 263
publications and renders 30, with no filter and no pagination; **Sakana** puts
`<time datetime>` on all 120 posts and adds a client-side filter; **Stanford HAI** offers 27
topic facets that cut 140 results down to 9.

### 4.1 The numbers

| | Ai2 `/papers` | Mila `/research/publications` | Vector `/research-talent/publications/` |
|---|---|---|---|
| Total items reachable | **1,196** (measured by offset binary search) | **6,986** (582 full pages × 12 + 2) | **1,000** (all at once) |
| Items per page | **10** | **12** | **1,000** |
| Row / card height | 188px | 335px median (222–355) | 229px |
| Page height | 3,501px | 3,330px | **256,772px** |
| DOM nodes | not measured | not measured | 13,950 |
| Pagination control | Prev/Next only, `?o=N` | **Numbered**: 1…9 · … · Last (583) · Next, `?page=N` | none |
| Filters | 3 selects (award / year 17 / tags 10) + text `q` | text search | text search (`?s=`) only |
| Filters in the URL | **yes** (`?q=&award=false&year=2016&tags=`) | **yes** (`?mila-membership=36&s=bengio`) | **yes** (`?s=`) |
| Result count shown | no | no | only after a search ("17 results") |
| `<time datetime>` | **0** | **0** | **0** |
| `ScholarlyArticle` JSON-LD | **0** | **0** | **0** |

People and events:

| | Ai2 | Mila | Vector |
|---|---|---|---|
| People list | `/team`: 11,581px, **307 `<img>`, only 89 with a non-empty `alt`**, 60 links total — a photo wall, individuals are **not** linked | `/directory`: **3,834 entries** (106 × 36 + 18), 36 per page, 241px cards, **10+ checkbox facets** + name/expertise/department search, all in the URL | `/research-talent/research-team/`: **191 people on one page**, grouped by role, no filter |
| Events | none found | `/events`: 4 upcoming, **11 `<time datetime>`** with timezone offsets (`2026-09-29T13:00:00-04:00`), "Archives" for past events, no `Event` JSON-LD | `/events`: "4 events found.", **`Event` JSON-LD ×4**, 3 `<time datetime>`, List/Month views, **iCal / Google / Outlook subscribe** |

### 4.2 So where do they stand?

**Mila is at the Stanford HAI end and past it.** It is the only site in the entire survey
that treats a large corpus as a *database*: numbered pagination with a "Last page 583"
affordance, combinable facets, and both facets and query preserved in the URL, which makes
every filtered view shareable and crawlable. Verified live: checking one membership facet
gave `?mila-membership=36`, then typing a name gave `?mila-membership=36&s=bengio` and 4
results. The cost is density — 335px masonry cards for a publication means 12 per screenful
of scrolling, where a text row would fit 40.

**Ai2 is in the middle, and closest to a model we can copy.** Three real facets plus
search, all in the URL, ten dense rows per page, a correctly built pager (disabled
`<button>` for the unavailable direction, `<a href>` for the available one). Its two
failures are: no result count anywhere, so a reader cannot tell whether "year = 2016" found
4 papers or 400; and a 120-page corpus navigable only by repeated Next clicks — page 60 is
reachable by URL but not by any control on the page.

**Vector is at the DeepMind end, arrived at from the opposite direction.** DeepMind shows
30 of 263 and hides the rest; Vector shows 1,000 of 1,000 and hides nothing — and the
result is the same, because 256,772px of unstructured rows is not navigable either. Showing
everything is not the opposite of showing too little; both are the absence of a list design.

**Nobody in the batch marks up dates or papers.** Zero `<time datetime>` and zero
`ScholarlyArticle` across all three publication lists. Only Vector's events (via a
WordPress plugin, not a design decision) emit `Event` JSON-LD. The gap identified in the
frontier-labs note is therefore not a DeepMind quirk — **it is universal in this field**,
and it is free for us, because our data comes out of a `.bib` file that already has the
year, venue, authors and DOI.

### 4.3 The third-party and consent trend, continued

| | Third-party origins on the home page | Trackers before consent | Fonts |
|---|---|---|---|
| Ai2 | **2** | **none** | self-hosted only |
| Mila | 17 | GTM, DoubleClick, LinkedIn Ads, HubSpot ×6 | self-hosted only |
| Vector | 21 | GTM, DoubleClick ×2, HubSpot ×8, Chatbase | Karbon self-hosted, **Lato + Roboto from Google** |

`CLAUDE.md` says "no cookies / no tracking without consent" and "self-host fonts". Ai2 is
the existence proof that a large institute site can be built that way — including its own
publication database, its own CMS-driven media, and a consent bar that genuinely gates
everything. It is also, not coincidentally, the fastest and the only one without a chat
widget spinning an infinite animation in the corner.

---

## 5. Comparison

### What they agree on

1. **Self-hosted display type.** All three self-host their primary family (telegraf,
   TT Norms Pro, Karbon) and all three chose a *licensed* grotesque with a strong lowercase
   `g` and tight apertures. None uses a serif. None uses a monospace for anything measured
   except Ai2's Roboto Mono, which was loaded but not observed in use.
2. **No shadows.** Zero elevation shadows on cards across all three sites. Separation is
   done with a surface change (Ai2: white rows on cream), a rule (Mila: 2px `#E6D9E9`), or
   nothing at all (Vector).
3. **One global transition token.** Mila 0.25s on 244 declarations, Vector 0.35s on 381,
   Ai2 a two-step 0.3s/0.5s. Nobody varies duration by component.
4. **Audience-based or artefact-based nav, never discipline-based.** No site puts "our
   research areas" at the top level as its primary axis; research areas are always one
   level down inside a mega-menu.
5. **Filters and pagination state live in the URL** on all three. This is now unanimous
   across every reference site measured in all batches, and settles the question for us.
6. **Nobody has `<time datetime>` or scholarly structured data on publications.**

### Where they diverge

| | Ai2 | Mila | Vector |
|---|---|---|---|
| Palette strategy | 3 colours, accent only as fill | 1 colour used as text | 10 declared, mostly unused |
| Colour tokens at runtime | none (compiled) | none (compiled) | **190 `:root` properties** |
| Fluid type | 3 `clamp()`, **container units (`cqw`)** | **0 `clamp()`** | **97 `clamp()`**, whole ramp as tokens |
| Fluid spacing | no | no | **yes**, 2 steps |
| Hero | static render | static collage | **animated WebGL gradient** |
| Reduced-motion rules | **19** | **0** | 1, and the hero ignores it |
| Layout engine | CSS grid + **subgrid** | flex / float, **0 grids** | flex + a few grids |
| Content width | 1280 | 1240 | 1340 |
| Consent | in-flow bar, nothing loads first | floating card, 17 origins already loaded | modal, 21 origins already loaded |
| Long lists | paginated + faceted | **paginated + faceted + numbered** | **unpaginated dump** |
| People | photo wall, not linked | full faceted directory | one page, grouped |
| Bilingual | monolingual | **`/en` + `/fr` with translated slugs** | `/` + `/fr-ca`, untranslated slugs |

### The one-accent rule, tested three ways

`CLAUDE.md` says "one accent per view". The batch is a natural experiment:

- **Mila** goes furthest — one hue is the text, the headings, the icons and the borders, so
  "one accent per view" becomes "one accent per site". Result: 8.52:1 everywhere, total
  coherence, and a site that cannot signal *which section you are in* by colour at all.
- **Ai2** keeps one accent and uses it sparingly — but uses it for the paper titles at
  3.29:1, which is where a fill colour becomes a text colour and fails.
- **Vector** declares ten and then paints in black, so the accents exist in the token file
  and not on the page.

For our four theme colours the lesson is the middle path taken by neither: **one accent per
view, scoped to the theme page, and used at its darkened variant whenever it carries text**
— which is already the rule written in `CLAUDE.md`, now with three worked counter-examples.

---

## 6. Takeaways for TA-LLM

Each item is checked against the design system in `CLAUDE.md` (ink `#0F1420`, paper
`#F3EEE4`, amber `#E6A23C`; display serif + sans + mono; "Time, made visible"; dark default;
one accent per view; WCAG AA) and against the decisions already recorded from the earlier
batches (1px grid gap, publications as a year timeline, fluid type with `clamp()`, canvas
hero + animated SVG, themes as native Astro pages, applications on an external form).

### Adopt

1. **Build Publications as a year timeline *with Ai2's filter and pager grammar bolted on*.**
   The batch-1 decision (year heading in mono, papers as plain body-size rows, no cards) is
   confirmed by contrast: Mila's 335px masonry cards show 12 items per screen and Vector's
   229px rows show four. A 1px-gap ruled list of ~56px rows shows 15–20. Keep the timeline,
   and take from Ai2: filters as real `<select>`s + a text query, **all serialised into the
   URL** (`?theme=&year=&type=`), and a Prev/Next pager where the unavailable direction is a
   `<button disabled>` and the available one is an `<a href>`.
   *Checks against `CLAUDE.md`:* "restrained UI, strong hierarchy through size and spacing";
   keyboard navigation (a disabled button is skipped, a link is focusable).

2. **Print the result count. All three sites fail to, and it is the cheapest fix in the
   batch.** Vector proves the value by accident: the count appears only on a search
   ("17 results") and it is the one moment the page becomes legible. Our line should read
   `24 papers · 2026 · Topology-Aware Temporal Reasoning` above the list, in mono, as part of
   the timeline's own typography.

3. **Group by year *and* give the year a jump-list.** Ai2's 120 pages are unreachable except
   by clicking Next; Mila's numbered pager with "Last page 583" is better but is still
   page-shaped, not content-shaped. Our corpus is years, not pages: a sticky mono year rail
   (2026 · 2027 · 2028 · 2029) that scrolls the timeline is the equivalent of Mila's pager
   and needs no pagination at all at our volume.
   *Checks against `CLAUDE.md`:* this is literally "Time, made visible" applied to a list —
   the navigation *is* the time axis.

4. **Add `<time datetime>` and `ScholarlyArticle` JSON-LD, because no one in the field
   does.** Zero of three here, zero of two in frontier labs. Our publications come from
   `src/content/publications.bib`, where year, venue, authors and DOI already exist; the
   markup is a template change, not a content task. Do the same with `Event` on the events
   page and `Person` on people pages. Vector shows what `Event` JSON-LD buys (calendar
   subscription, rich results); we get it for free from the same front-matter.

5. **Copy Vector's `theme.json` pattern for the type and spacing ramp — as CSS custom
   properties, one declaration each.** 97 `clamp()` rules is not the lesson; *declaring the
   ramp once as tokens* is:
   ```
   --step--h1: clamp(2.5rem, 6vw, 4.375rem)   /* Vector's actual value */
   --space--60: 2.25rem  --space--70: 3.38rem  --space--80: 5.06rem  /* ×1.5 ratio */
   ```
   Ours should carry the same shape with our own numbers, and the `×1.5` spacing ratio is a
   good starting point. Batch 2 already recommended fluid spacing from Anthropic; Vector
   confirms it, and both must leave the **1px grid gap alone** — the hairline is not a
   spacing step.

6. **Use container-query units for the hero headline, as Ai2 does.** `clamp(2rem,
   4.23612cqw, 7rem)` scales the headline with the *content column*, not the window, so it
   keeps its measure when the column is constrained. Measured effect: 61px at 1440, 32px at
   390, no breakpoint. This is strictly better than `vw` for a headline that lives inside a
   fixed-width column, which ours does.

7. **Ship Ai2's consent posture, not just its consent bar.** Two origins before consent,
   zero analytics, zero ad networks, fonts self-hosted, an in-flow bar that does not block
   the page, and **Reject All at the same visual weight as Approve All**. `CLAUDE.md`
   already says "no cookies / no tracking without consent"; Ai2 is the proof that it costs
   nothing. As a static Astro site on GitHub Pages we can go one better and have **zero**
   third-party origins, in which case we need no banner at all.

8. **Make the research themes first-class nav items, as Mila does.** Mila's Research menu
   lists six Strategic Priorities by name, so a visitor sees the intellectual structure
   before any page loads. Our four themes (01–04) belong in the Research mega-menu by name,
   which is the natural consequence of the existing decision that **themes are native Astro
   pages, never external links**.

9. **Steal Vector's events page wholesale, minus the plugin.** Upcoming/past split, a
   printed count, `Event` JSON-LD, `<time datetime>` with a real timezone offset (Mila's
   `2026-09-29T13:00:00-04:00` is the right level of precision for a seminar), and an
   **iCal/Google/Outlook subscribe link**. For a project running seminars for three years,
   a subscribable calendar is worth more than the whole events page design.

10. **Use Next.js-style metric-matched fallback faces.** Ai2 declares
    `@font-face { font-family: "telegraf Fallback"; src: local("Arial") }` so the fallback
    occupies the same space as the webfont. `CLAUDE.md` demands "no layout shift" and we are
    self-hosting three families; this is how that promise is kept during swap.

11. **Ai2's `subgrid` trick for card rows.** `grid-template-rows: subgrid; grid-row: span 4`
    makes heading / body / meta / CTA line up across sibling cards regardless of content
    length. With a 1px gap and no shadows, misaligned internal baselines are the main way a
    card grid looks sloppy; subgrid fixes it with no JS and no fixed heights.

### Avoid

1. **Do not render the whole corpus on one page.** Vector: 1,000 entries, 256,772px, 13,950
   DOM nodes, 1.26 MB of HTML. It loads fast and is still unusable. Our `.bib` will grow for
   three years; the year timeline plus a year rail is the answer, and if a single year ever
   exceeds ~60 papers, that year collapses, not the page.

2. **Do not use a brand accent as a text colour without its darkened variant.** Ai2's paper
   titles are `#F0529C` on white at **3.29:1** — a measured AA failure on the most
   important text on the page. Our equivalent trap is amber `#E6A23C` on paper `#F3EEE4`
   at **1.89:1**. The rule already in `CLAUDE.md` (text uses `#8A5A10` / `#356B58` /
   `#6A55A8` / `#2F6DA3`) now has a live example of what happens when you skip it.

3. **Do not let the hero animation ignore `prefers-reduced-motion`.** Vector's WebGL
   gradient was verified still animating with the feature emulated, and only one rule in
   the entire stylesheet responds to it. Our canvas hero must check
   `matchMedia('(prefers-reduced-motion: reduce)')` in JS — a CSS media query cannot stop a
   `requestAnimationFrame` loop — and render one static frame instead. Mila's **0**
   reduced-motion rules is the same failure with less ambition.

4. **Do not hide the real `<h1>`.** Mila's home page `h1` says "Home" at 1×1px while the
   visible headline is an `h2`. Our hero headline must *be* the `h1`, as Ai2's and Vector's
   are.

5. **Do not build a photo wall instead of a people page.** Ai2's `/team` is 11,581px of 307
   images with **only 89 non-empty `alt` attributes** and 60 links total — the faces are not
   individually linked, so there is no page for a person, no URL to cite, and most images
   are unlabelled. `CLAUDE.md` requires "alt text on every image". Our People page needs a
   row per person with a real link, a role and a theme, and — because we have four themes —
   Mila's facet pattern (`?theme=agentic`) rather than no filter at all.

6. **Do not declare a palette wider than the design uses.** Vector declares ten brand
   colours and paints the home page in black. Our four theme colours must each be scoped to
   their theme page, one accent per view, never offered together as a swatch row.

7. **Do not put a chat widget or any vendor script that injects infinite animation.**
   Chatbase adds `chatbase-spin 2s linear infinite` to Vector's corner, outside the site's
   own motion budget and outside its reduced-motion handling. On a static, cookie-free site
   this is simply a thing we never add.

8. **Do not ship two pages called "Publications".** Vector has both
   `/research-talent/publications-and-papers/` (editorial) and `/research-talent/publications/`
   (database), and the first one out-ranks the second in the nav. If we want an editorial
   "research highlights" view, it is a *section of the home page* or of `/research`, not a
   sibling of the real list.

### What differentiates us

- **Nobody in this batch has a serif.** Three grotesques, three institutes, one visual
  register. Our display serif (Instrument Serif / Fraunces) against a sans and a mono is an
  immediate differentiator in a field that has converged on the same typographic choice.
- **Nobody is dark by default.** All three are light-background sites; dark appears only as
  an inverted section (Ai2's teal blocks). Dark default plus the amber accent at **8.41:1**
  is a register none of them occupies.
- **Nobody marks up time.** Zero `<time datetime>` on all three publication lists, in a
  batch of institutes whose entire output is dated. For a project called *"Large Language
  Models: a matter of time?"*, making time machine-readable is not a technical nicety — it
  is the thesis, executed in the markup.
- **Nobody animates the concept.** Ai2's hero is a still render, Mila's is a photo collage,
  Vector's is a decorative gradient that says nothing about what Vector does. Our two-layer
  plan — **canvas behind the hero, animated inline SVG for the concepts themselves** — puts
  the motion where it carries meaning (drift, persistence, token streams), which none of
  these three attempts.
- **We can be smaller and still be complete.** Ai2 proves a research institute site can run
  on two origins with no tracker. On GitHub Pages, with content collections and an external
  PoliTo-hosted application form, we can run on **one**.

### Still open

- Whether we do IT/EN at all. If we do, **Mila's model is the one to copy**: `/en/` and
  `/it/` prefixes, *translated slugs*, and per-page `hreflang` pointing at the real
  counterpart — not Vector's untranslated `/fr-ca/` mirror. Astro's i18n routing supports
  exactly this shape. Note that Mila emits no `x-default`; we should.
- Whether the People page needs facets at four themes and ~10 people. Mila's facets exist
  because it has 3,834 entries. **(inference: below ~40 people a facet row costs more than
  it saves; we should ship the row layout first and add `?theme=` only when the list grows.)**

---

## 7. Screenshot index

> **These screenshots are kept locally only and are not committed.** They are third-party
> reference material, so `research/moodboard/` is git-ignored (`.gitignore` lines 15–16:
> `research/moodboard/*` with an exception for `.gitkeep`) and the files below will not be
> present in a fresh clone. They are shared on request.

All paths are relative to the repository root.

### Ai2 — `research/moodboard/allenai/`

| File | Page | Viewport | Size |
|---|---|---|---|
| `cookie-banner-desktop-1440.png` | Home on a **fresh profile**, consent bar visible at the bottom | 1440 | 1440×900 |
| `home-after-consent-desktop-1440.png` | Home immediately after "Approve All" | 1440 | 1440×900 |
| `hero-phase-1-desktop-1440.png` | Home hero, t≈0s | 1440 | 1440×900 |
| `hero-phase-2-desktop-1440.png` | Home hero, t≈1.2s | 1440 | 1440×900 |
| `hero-phase-3-desktop-1440.png` | Home hero, t≈2.4s | 1440 | 1440×900 |
| `home-desktop-1440.png` | Home, full page (consent bar still present, at page bottom) | 1440 | 1440×7078 |
| `home-mobile-390.png` | Home, full page | 390 | 390×10633 |
| `papers-desktop-1440-initial.png` | `/papers`, first viewport (filter panel + first rows) | 1440 | 1440×900 |
| `papers-desktop-1440.png` | `/papers`, full page (10 rows + pager) | 1440 | 1440×3501 |
| `team-desktop-1440.png` | `/team`, full page (the photo wall) | 1440 | 1440×11581 |

The three `hero-phase-*` files are **byte-identical** (md5 `10a1621e50`): the hero does not
move. They are kept as the evidence for that statement.

### Mila — `research/moodboard/mila/`

| File | Page | Viewport | Size |
|---|---|---|---|
| `cookie-banner-desktop-1440.png` | Home with the consent card (Set / Refuse / Accept cookies) | 1440 | 1440×900 |
| `hero-phase-1-desktop-1440.png` | Home hero, t≈0s (consent card still visible) | 1440 | 1440×900 |
| `hero-phase-2-desktop-1440.png` | Home hero, t≈1.2s | 1440 | 1440×900 |
| `hero-phase-3-desktop-1440.png` | Home hero, t≈2.4s | 1440 | 1440×900 |
| `home-desktop-1440.png` | Home, full page, **after** "Accept cookies" | 1440 | 1440×7059 |
| `home-mobile-390.png` | Home, full page | 390 | 390×9287 |
| `publications-desktop-1440-initial.png` | `/en/research/publications`, first viewport | 1440 | 1440×900 |
| `publications-desktop-1440.png` | `/en/research/publications`, full page (12 masonry cards + numbered pager) | 1440 | 1440×3330 |
| `directory-desktop-1440.png` | `/en/directory`, full page (36 cards + facets + pager) | 1440 | 1440×5686 |

The three `hero-phase-*` files are also byte-identical (md5 `86f8054fa3`); the single frame
change observed on this site happened later in a 5s window and is not captured here.

### Vector Institute — `research/moodboard/vectorinstitute/`

| File | Page | Viewport | Size |
|---|---|---|---|
| `cookie-banner-desktop-1440.png` | Home with the HubSpot consent modal (Accept / Decline) | 1440 | 1440×900 |
| `hero-phase-1-desktop-1440.png` | Home hero, t≈0s — WebGL gradient frame 1 | 1440 | 1440×900 |
| `hero-phase-2-desktop-1440.png` | Home hero, t≈1.2s — frame 2 | 1440 | 1440×900 |
| `hero-phase-3-desktop-1440.png` | Home hero, t≈2.4s — frame 3 | 1440 | 1440×900 |
| `home-desktop-1440.png` | Home, full page | 1440 | 1440×8944 |
| `home-mobile-390.png` | Home, full page | 390 | 390×11224 |
| `publications-and-papers-desktop-1440.png` | `/research-talent/publications-and-papers/`, the **editorial** page | 1440 | 1440×5735 |
| `publications-db-top-desktop-1440.png` | `/research-talent/publications/`, top of the 1,000-entry database | 1440 | 1440×900 |
| `publications-db-rows-desktop-1440.png` | Same page at y=2400 — row rhythm with no rules or dividers | 1440 | 1440×900 |
| `publications-db-search-desktop-1440.png` | Same page with `?s=time+series` — 17 results, full page | 1440 | 1440×9124 |
| `research-talent-desktop-1440.png` | `/research-talent/` (the redirect target of the first URL guess), full page | 1440 | 1440×5808 |
| `research-talent-desktop-1440-initial.png` | Same, first viewport | 1440 | 1440×900 |

The three `hero-phase-*` files here are **all different** (md5 `7efa9af71d`, `5eee3b87c5`,
`a94f8ba5a3`) — this is the evidence that the WebGL gradient animates. No full-page capture
of the unfiltered publications database exists: at 256,772px it would be a ~40 MB PNG, so
the two viewport crops plus the filtered full-page capture stand in for it.

### Not captured

- No mobile (390) capture of any interior page: the brief asked for one interior page at
  1440 only, and both mobile home captures confirmed `scrollWidth === innerWidth`.
- No capture of Mila's `/en/events` or Vector's `/events`; those pages were measured through
  the DOM only (counts, `<time>`, JSON-LD, controls) and the numbers are in section 4.1.
- No French/`fr-ca` captures; the bilingual findings in 2.6 and 3.5 come from `hreflang`
  markup, URL structure and live navigation, not from screenshots.
