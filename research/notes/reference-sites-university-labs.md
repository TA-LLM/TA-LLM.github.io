# Reference site analysis — BAIR (UC Berkeley) & Stanford HAI

**Category:** University labs (second batch of reference sites)
**Date of capture:** 2026-09-17
**Method:** a dedicated, isolated Playwright driver (`playwright-core` + the locally
installed Chrome, `channel: 'chrome'`, headless), not the shared Playwright MCP browser.
Viewports 1440x900 and 390x844, `deviceScaleFactor: 1`, mobile runs with an iPhone UA plus
`isMobile`/`hasTouch`.
All numeric values below were read from the live DOM/CSSOM inside the page (computed
styles, `:root` custom properties, parsed `CSSStyleSheet` rules, `document.getAnimations()`,
`performance.getEntriesByType('resource')`, `document.cookie`), never estimated from the
screenshots. Contrast ratios were computed from the extracted colour values with the
WCAG 2.x relative-luminance formula, compositing alpha over the measured background.
Statements that go beyond what was directly measured are marked **(inference)**.

This is the category closest to us institutionally: both are labs that live inside a
university, and both have to answer the question we have with Politecnico di Torino and
the MUR — where does the university's identity end and the lab's begin. They answer it in
**opposite** ways, which makes the pair unusually useful (§5).

---

## 0. Loading issues, and what had to be substituted

**BAIR was down during the whole capture window.** `bair.berkeley.edu` (128.32.244.190)
did not answer on port 443 or port 80 for ~35 minutes of continuous polling
(`curl` from this machine: `000`, timeout after 12–21 s, 60 consecutive probes). The
failure is **not** local: an independent fetch from a different network path returned
`ECONNREFUSED 128.32.244.190:443`, i.e. the origin actively refused the connection.
Other Berkeley hosts were fine at the same moment (`www.berkeley.edu` → 200 in 0.50 s,
`eecs.berkeley.edu` → 200), so this was a host-level outage of the BAIR server, not a
block on us and not a DNS problem. (A separate local annoyance was found and worked
around: the ISP router hijacks the bare name and resolves `bair.berkeley.edu` to
`127.0.0.1`; queried with a trailing dot against 1.1.1.1 the real A record is
`128.32.244.190`. That host is the one that refused connections.)

**Substitution.** Rather than report nothing for half the category, BAIR was captured
from the **Internet Archive**, using the `if_` modifier so the archive toolbar is not
injected into the page:

| Page | Snapshot |
|---|---|
| `bair.berkeley.edu/` | `web.archive.org/web/20260810071427if_/` — **2026-08-10** |
| `bair.berkeley.edu/blog/` | `web.archive.org/web/20260809164249if_/` — **2026-08-09** |
| `bair.berkeley.edu/blog/archive/` | same snapshot family, 2026-08-09 |

**What the archive still measures correctly:** DOM structure, heading levels, computed
styles, colours, type scale, grid and spacing, `@font-face` rules (the original hostnames
survive inside the rewritten URLs), stylesheet filenames, CSS animations and transitions,
`prefers-reduced-motion` behaviour, `<time>` elements, image `alt` attributes, pagination
and filter markup.
**What it does NOT measure, and is therefore not reported for BAIR:** the real count of
third-party request origins (everything is proxied through `web.archive.org`), real
cookies and analytics behaviour, network timing, and anything that depends on a live
backend (BAIR's home loads a Firebase/Firestore client, which obviously cannot connect
inside the archive). Where a fact depends on the archive being faithful, it is marked.
BAIR screenshots are named with a `-wayback-<date>` suffix so they can never be mistaken
for live captures.

**HAI loaded normally, live, with zero console errors.** Two failed requests were logged
on the home page: a `region1.google-analytics.com/g/collect` beacon and the 4:15 "anthem"
MP4 (which is click-to-play and was never played). **No cookie banner exists on
hai.stanford.edu** — a search for any element whose class or id matches
`cookie|consent|gdpr|onetrust` returned **zero** elements, and no fixed or sticky element
of any kind was present on the page. The site nevertheless sets **three cookies with no
consent step**: `_ga`, `_ga_QGX42T28VX` (GA4) and `nmstat` (Siteimprove). The screenshot
originally named `…-cookiebanner.png` was renamed
`home-desktop-1440-firstview-no-cookie-banner.png` once this was measured.

### Internal page choice, and why

- **BAIR → `/blog/`.** The brief named the blog as the centre of the BAIR site, and the
  measurements confirm it: the home page is **1102 px tall** — one screen — while the blog
  index is 8978 px and the archive lists 170 posts. The home is a door; the blog is the
  building. It is also the direct analogue of our Publications + News surfaces and, as it
  turns out, the sharpest identity-break found in this whole project (§5.1).
- **HAI → `/research/publications`.** HAI has dozens of internal pages, but this one maps
  one-to-one onto the page we still have to design, it is the only place where HAI's
  filtering and pagination machinery is visible, and it is where the open question from
  the previous batches (`<time datetime>`, filters, pagination) can actually be measured
  against numbers. `/research/publications?topic=machine-learning` was also exercised, to
  test whether filter state is shareable.

### Scope note on stacks

Neither site is Astro, so their build stacks are not a model for ours — only their design
and content decisions are. Confirmed from loaded scripts, stylesheet filenames and
`@font-face` sources:

| | Home | Internal section |
|---|---|---|
| bair.berkeley.edu | **Next.js + Tailwind** (`/_next/static/…`, utility classes, breakpoints 640/768/1024 px), `next/font` Inter (7 self-hosted `.woff2`), Firebase/Firestore 10.14.1 client, a `Log In` route | **Jekyll, Pixyll theme** (`/blog/css/pixyll.css?202607291655` + `bair-blog.css`), Google Fonts, Font Awesome 4.4.0 (maxcdn), MathJax 2.7.1 (cdnjs) |
| hai.stanford.edu | **Next.js + CSS Modules** (`Typography_root__…`, `Tier_root__…`), 17 self-hosted Circular `.ttf` faces, Stanford wordmark webfont from `www-media.stanford.edu`, GA4 + Siteimprove + Ahrefs analytics | same Next.js app (`FilteredSearchIndex_…`, `ContentItem_…`) |

---

## 1. BAIR — bair.berkeley.edu

Two sites wearing one name. A brand-new, almost empty Next.js front door, and a nine-year-old
Jekyll blog behind it that shares nothing with it — not a colour, not a typeface, not a
layout rule.

### 1.1 Palette

**Home.** Measured on 87 elements, the entire page uses **two colours plus two strays**:

| Role | Value | Where measured |
|---|---|---|
| Background | `#FFFFFF` | body; the only large background area |
| Berkeley Blue | `#003262` = `rgb(0,50,98)` | 18 text elements (all nav links), and the largest non-white background area |
| Tailwind `blue-800` | `#1E40AF` | 5 elements (**inference:** an unreplaced Tailwind default, since it is not in Berkeley's palette) |
| Neutral | `#42454D` | 1 element |

`#003262` is **exactly** UC Berkeley's primary Berkeley Blue. The official palette hexes
were counted in the readable CSS: `003262` ×6, Founder's Rock `3B7EA1` ×4, Medalist
`C4820E` ×4; California Gold `FDB515`, Golden Gate `ED4E33`, Bay Fog `DDD5C7`, Lawrence
`00B0DA`, Lap Lane `00A598` → **0 each**. So BAIR uses three of the university's colours
and nothing else.

The three appear together in one place, and it is the best single idea on the site: the
hero `<h1>` has `color: rgba(0,0,0,0)` with
`background-image: linear-gradient(to right, rgb(0,50,98), rgb(59,126,161), rgb(196,130,14))`
and `background-clip: text` — **Berkeley Blue → Founder's Rock → Medalist, painted through
the headline**. The university's palette *is* the headline treatment.

There are **no CSS custom properties on `:root`** (measured: 0). The design tokens are
Tailwind's, not the lab's.

`@media (prefers-color-scheme: dark)` exists in the CSS, but rendering the page with
`colorScheme: 'dark'` changed nothing measurable: `body` background stayed transparent
(white shows through), nav links stayed `#003262`, the h1 gradient was identical.
**The dark-mode block is dead code** (**inference:** a create-next-app leftover).

**Blog.** A completely different, brand-free palette:

| Role | Value | Uses |
|---|---|---|
| Background | `#FFFFFF` | page |
| Heading / body ink | `#333333` | 33 elements |
| Paragraph / caption ink | `#444444` | 3 |
| Meta grey (author line) | `#7A7A7A` | 21 |
| Nav grey | `#666666` | 4 |
| Link blue | `#0076DF` | **82 elements** |

Counted in the blog's readable CSS, **all eight** official Berkeley colours score **0 hits**.
The blog does not know it belongs to Berkeley.

**Contrast, measured:**

| Pair | Ratio | Verdict |
|---|---|---|
| `#003262` on white (nav, h1 left end) | **12.86:1** | AAA |
| `#3B7EA1` on white (h1 middle) | **4.48:1** | fails AA for body text; passes AA-large — the h1 is 36 px/600, so large |
| `#C4820E` on white (h1 right end) | **3.21:1** | AA-large only, and only just above the 3:1 floor |
| `#1E40AF` on white | 8.72:1 | AAA |
| blog body `#333333` on white | 12.63:1 | AAA |
| blog paragraph `#444444` on white | 9.74:1 | AAA |
| blog nav `#666666` on white | 5.74:1 | AA |
| blog link `#0076DF` on white | **4.51:1** | AA by 0.01 |
| blog author line `#7A7A7A` on white @ 21.33 px regular | **4.29:1** | **fails AA** (needs 4.5:1; 21.33 px non-bold is not "large text") |

The pattern from the previous two batches holds exactly: **the quiet grey is what fails**,
not the accent. Here the failing element is the author/affiliation line under every post
title — the line that carries the names of the researchers.

### 1.2 Typography

**Home — one family, three sizes.** Every one of the 87 measured elements resolves to
`__Inter_d65c78` (`next/font` Inter, 7 self-hosted `.woff2`, `local("Arial")` fallback).
Sizes in use: **36 px (×1), 16 px (×26), 14 px (×6)**. That is the whole scale.

| Role | 1440 px | 390 px |
|---|---|---|
| `h1` | Inter 36/40, weight 600, `letter-spacing: normal`, gradient-clipped | Inter **36/40**, weight 600 — identical |
| Nav link | Inter 16/24, 400, `#003262` | Inter **24/36**, 400, `#003262` |
| Body default | Inter 16/24, 400 | 16/24 |

`clamp()` appears **0 times** in the readable CSS. There is no fluid type: the h1 does not
move at all between 1440 and 390, and the nav *grows* on mobile (16 → 24 px) because it
becomes a full-screen menu. Breakpoints are Tailwind's defaults (640/768/1024 px) plus one
`@media (max-height: 715px)`.

**Blog — a two-family editorial scale, and it is the better typography of the two.**

| Role | Family | Size / line-height | Weight | Colour |
|---|---|---|---|---|
| Post title (`h1`) | **Lato**, Helvetica Neue fallback | 36 / 45 px | **900** | `#333333` |
| Body text | **Merriweather**, PT Serif, Georgia fallback | **20 / 30 px** | 400 | `#333333` |
| Figure caption | Merriweather | 17 / 24.65 px | 400 | `#444444` |
| Author + affiliation line | Lato | 21.33 / 26.67 px | 300 | `#7A7A7A` |
| Nav link | Merriweather | 18 / 27 px | 300 | `#666666` |

A 20 px serif body at 30 px leading in an 840 px column is a genuinely good reading setting
for long technical posts — and it is closer to what we want for theme pages than anything
on the modern half of the site. But the fonts come from **Google Fonts**
(`fonts.googleapis.com` + `fonts.gstatic.com`), with Font Awesome 4.4.0 from
`maxcdn.bootstrapcdn.com` and MathJax 2.7.1 from `cdnjs.cloudflare.com` — **at least four
third-party origins** on a university blog. `clamp()`: 0. Media queries are in `em`
(32/40/48/52/64/78/96 em) and mixed with a stray `1000px` pair, i.e. two stylesheets from
two eras glued together.

### 1.3 Grid, spacing, components

**Home.** Content container **956 px** inside 1440 (so ~242 px of side margin each side,
**inference:** a Tailwind `max-w-*` plus auto margins). Spacing values actually in use:
**8 px (×17), 16 px (×11), 32, 40, 48, 160 px** — a clean 8-px scale. Border-radius: only
two values in the whole page (`0 0 4px 4px` on the nav dropdown, `8px` once). **Zero
box-shadows.** No `<button>`, no card component, no input — there is almost nothing on the
page to style.

**Blog.** Content column **840 px**, header block **294 px tall**, dominated by a
`479×256` PNG logo. Spacing values: **20 px (×50)**, 5.33 px (×40), 18, 36, 8.75, 17.5, 15,
30, 40 px — a 20-px rhythm with a lot of fractional em-derived leftovers. One transition in
the entire stylesheet (`all 0.2s ease-in-out`, 2 elements). No cards, no shadows: posts are
separated by whitespace only.

### 1.4 Motion

**Home:** two CSS keyframe animations, each firing once —
`fadeIn` (1 s, on the hero `<img>`) and `fadeInDelay` (1 s, on a `<div>`) — plus one
transition, `top 0.15s ease-in` (the nav dropdown). No canvas, no video, no SVG SMIL, no
Lottie. Sampled at 300 ms intervals from `domcontentloaded`, both animations were observed
`running` and then finished; total motion on the page is under two seconds.

**Blog:** zero CSS animations, zero running Web Animations, one `all 0.2s ease-in-out`
transition. A completely static document.

**`prefers-reduced-motion`: declared 0 times, honoured 0 times.** The readable CSS contains
**no** `prefers-reduced-motion` rule on either the home or the blog, and with the context
launched as `reducedMotion: 'reduce'` the home's `fadeIn` and `fadeInDelay` were both
measured `playState: "running"` (currentTime 417 ms at the first sample). The motion is
mild enough that the practical harm is small, but the rule is simply absent.

> Running total across the three batches: **five of the six sites measured so far declare
> or imply reduced-motion support without actually stopping the motion — and BAIR does not
> even declare it.** This is now the single most consistent failure in the whole reference
> set.

### 1.5 Navigation, hero, IA

**Home** = `<nav class="h-20 flex justify-between items-center mx-4 mt-2">`, `position: static`
(not sticky), transparent background, left-aligned mark + right-aligned menu. The entire
page below it is a **956 × 638 px `BAIR_Logo_Blue_BearOnly.svg`** (the Berkeley bear) with
the gradient headline and nothing else. Page height 1102 px at 1440, 880 px at 390.

Top-level IA, measured from the nav:
`About` · `Blog` · `People ▸ (Faculty, Staff, Students & Alumni)` ·
`Resources ▸ (Admissions, Courses, Software)` ·
`Initiatives ▸ (BAIR Commons ↗, BAIR REU, Berkeley Deep Drive ↗, Responsible & Equitable AI ↗, Humanoid Intelligence (HIC))` ·
`Affiliates` · `Log In`.
Three of the five initiatives are **external hostnames** (`bcommons.berkeley.edu`,
`deepdrive.berkeley.edu`, `re-ai.berkeley.edu`) — the lab's sub-projects each run their own
site. There is no Research section, no Publications section, and no news: research output
lives entirely in `/blog/`.

Footer, verbatim structure: social links, two `mailto:` addresses
(`bair-admin@`, `bair-website@berkeley.edu`) and **"© UC Regents 2026."**

**Blog** = its own site with its own chrome: a 294 px header with the full `BAIR_Logo.png`
(alt attribute **missing**) and four links — `Subscribe`, `About`, `Archive`, `BAIR`.
The last one is the only way back. There is **no `<main>` landmark** on the blog
(`header 1, nav 1, main 0, footer 1 (empty), article 0, section 0`).

**Mobile (390 px).** `document.documentElement.scrollWidth === window.innerWidth` (390 =
390) on both pages: **no horizontal page overflow**. On the home, `document.body.scrollWidth`
measures **710 px** — wider than the viewport but clipped by the document element
(**inference:** an off-canvas menu panel parked to the side).

### 1.6 Tone of voice

Superlative and institutional on the home — the single headline is *"Discover BAIR, the
world's most advanced academic AI research lab."* That is the whole homepage copy. No
mission statement, no research summary, no numbers.

On the blog the voice flips completely to researcher-to-researcher: post titles are paper
titles (*"Adaptive Parallel Reasoning: The Next Paradigm in Efficient Inference Scaling"*,
*"RL without TD learning"*, *"What exactly does word2vec learn?"*), each with a full author
list with affiliation superscripts, figures with captions, and MathJax-rendered LaTeX. The
blog is written by the researchers; the home is written by whoever commissioned the
redesign.

---

## 2. Stanford HAI — hai.stanford.edu

The opposite of BAIR in every respect: one large, coherent, thoroughly designed Next.js
site with an editorial colour system, a proper component library, and an institute-scale
information architecture. It is also, measurably, the site with the **least university
branding** of the two.

### 2.1 Palette

Ten `:root` custom properties exist, and **all ten are layout tokens, not colours**:

```
--layout-max-width: 200rem        --body-text-max-width: 70rem
--col-gutter: 4.8rem (→2.4rem @390) --col-offset: 9.2rem (→0rem @390)
--col-gutter-half / --col-gutter-3-4
--tier-padding-half: 4.8rem  --tier-padding-single: 9.6rem  --tier-padding-double: 19.2rem
```

The colour system is instead expressed as **named themes applied per horizontal band**.
Measured class names on the home page: `Tier_color-theme-fig`, `Tier_color-theme-chalk`,
`color-theme-cloud`, `Tier_color-theme-zeal`, each wrapped in a `tier-theme-provider`.
Every full-width section gets exactly one palette, and the headings, borders and chips
inside it recolour to match. This is **"one accent per view"** implemented as
"one accent per band" — the closest thing in the whole reference set to our own rule.

Measured colours (computed, with the largest background areas first):

| Role | Hex | Evidence |
|---|---|---|
| Page background ("cloud") | `#F0F3F5` | largest bg area on the home; also the header and HAI footer background |
| Publications background ("chalk") | `#F0EAF1` | `main` background on `/research/publications` |
| Band background ("fig") | `#72307C` | the purple Research band |
| Band background (teal) | `#14494F` | the Education band |
| Ink | `#111010` | body text, 20 elements |
| Quiet ink | `rgba(17,16,16,0.6)` | **the single most-used text colour on the site** (234 elements on the publications page) |
| Deep blue | `#0B3E6E` | nav links, the HAI logo fill, glossary headings |
| Link / heading blue | `#005FA3` | `h2` "Latest at HAI", "The 2026 AI Index Report Is Here" |
| Plum | `#4B2349` | `h1` on the publications page |
| Cyan | `#9CF2F2` | headings on the purple band |
| Pink | `#F3ADFF` | chips on purple |
| Lime | `#E5FF66` | small accents |
| Stanford bar | `#2E2D29` | the global footer strip only |

**The finding that matters: Stanford's own web palette is essentially absent.** Counted as
hex literals in the readable CSS: cardinal `8C1515` → **0**, dark red `820000` → **0**,
bright red `B1040E` → **0**, digital blue `006CB8` → **0**, Lagunita `007C92` → **0**,
Stanford black `2E2D29` → **0**. **There is no cardinal red anywhere on Stanford HAI's home
page.** The only official Stanford colour that renders at all is `#2E2D29`, and it appears
exactly once — as the background of the mandated 1440 × 138 px university footer bar
(computed `rgb(46,45,41)`; not found as a hex literal, so it is set some other way —
**inference:** inside the vendored Stanford footer component).

**Contrast, measured:**

| Pair | Ratio | Verdict |
|---|---|---|
| `#111010` on `#F0F3F5` | 17.05:1 | AAA |
| `#111010` on `#F0EAF1` (publications) | 16.05:1 | AAA |
| quiet ink `rgba(17,16,16,.6)` → `#6A6B6C` on `#F0F3F5` | **4.79:1** | AA |
| quiet ink on `#F0EAF1` (the mono dates) | **4.72:1** | AA |
| `#0B3E6E` on `#F0F3F5` (nav, logo) | 9.77:1 | AAA |
| `#005FA3` on `#F0F3F5` | 5.95:1 | AA |
| `#4B2349` on `#F0EAF1` (h1) | 10.85:1 | AAA |
| white on `#14494F` | 10.02:1 | AAA |
| `rgba(255,255,255,.78)` → `#CBD7D8` on `#14494F` | 6.80:1 | AA |
| **`rgba(255,255,255,.5)` → `#8AA4A7` on `#14494F` @ 22 px regular** | **3.79:1** | **fails AA** (22 px non-bold needs 4.5:1) |
| `#9CF2F2` on `#14494F` | 7.82:1 | AAA |
| white on `#72307C` | 8.64:1 | AAA |
| `#F3ADFF` on `#72307C` | 5.04:1 | AA |
| white on `#2E2D29` | 13.78:1 | AAA |

Again: **the accents all pass, the quiet text is what fails.** HAI's failure is
`rgba(255,255,255,0.5)` on the teal band (the "Engage With HAI" label), and its two most
common quiet greys pass by only 0.2–0.3 points. HAI is one careless alpha value away from
failing its own body copy.

### 2.2 Typography

Self-hosted **Circular** in 17 faces (Thin/Light/Book/Regular/Medium/Bold/Black/ExtraBlack
+ italics + **circularMonoRegular**), all `font-display: swap`, all served from
`/_next/static/media/` — but as **`.ttf`, not `.woff2`**. Seventeen TrueType files is a
measurable performance mistake on an otherwise careful site. A single extra face,
`Stanford` (300 weight), is loaded **from another origin**, `www-media.stanford.edu/assets/fonts/stanford.woff`,
and is used by exactly **two elements**, both inside the university footer bar (§5.2).

`html { font-size: 10px }` at **both** widths, so `1rem = 10px` and the `--col-*` tokens
read as whole pixels (4.8rem = 48 px).

| Role | 1440 px | 390 px | Family |
|---|---|---|---|
| Band `h2` | **58 / ~61 px**, ls −1.16 px | — | circularMedium 500 |
| Feature `h2` | 50 / 52.5 px, ls −1.75 px | **38 / 39.9 px**, ls −1.33 px | circularMedium |
| `h3` | 42 / 46.2 px, ls −0.84 px | **32 / 35.2 px**, ls −0.64 px | circularMedium |
| `h4` | 27 / 32.4 px, ls −0.54 px | **24 / 28.8 px**, ls −0.48 px | circularMedium |
| Card title `h5` | 22 / 28.6 px, ls −0.22 px | 22 | circularMedium |
| Lead paragraph | 22 / 22 px, ls −0.66 px | **16 / 18.4 px** | circularRegular → circularBook on mobile |
| Publications `h1` | **84 / 86.1 px, ls −2.94 px** | — | circularMedium |
| Result date | **12 px** | — | **circularMonoRegular** |
| Nav link | 16 / 16 px, ls −0.32 px | — | circularMedium |

Two things are worth copying and one is worth refusing.

1. **Negative tracking that scales with size** (−2.94 px at 84 px ≈ −0.035 em, −0.32 px at
   16 px = −0.02 em). Large type is visibly tightened; small type barely. This is why the
   84 px page titles feel set rather than merely big.
2. **A monospace face used for dates and only for dates.** `circularMonoRegular` appears on
   52 elements, and the one measured in detail is the `Mar 19, 2026` line on every
   publication row. This is precisely the JetBrains-Mono role in our own design system,
   validated on a site with 140 publications.
3. **`clamp()` appears 0 times in 1.2 MB of CSS.** The whole scale is stepped at
   breakpoints by swapping the token values (`--col-gutter` 4.8rem → 2.4rem, `--col-offset`
   9.2rem → 0, h2 50 → 38 px). It works, but it means every size is a separate rule at
   every breakpoint — which is exactly the cost our `clamp()` decision avoids.

### 2.3 Grid, spacing, components

**Desktop 1440:** content width **1344 px** → a **48 px gutter** each side, matching
`--col-gutter: 4.8rem`. Inside it:

| Pattern | `grid-template-columns` | gap |
|---|---|---|
| Two-up (`Columns_two-up`, `Header_main`, `BigFeed`) | `648px 648px` | `24px 48px` |
| Three-up (`Columns_three-up`) | `354.66px × 3` | `24px 48px` |
| Four-up (`MiniFeed`) | `300px × 4` | `24px 48px` |
| Card internals (`ContentItem`) | `196px 92px` (text + thumb) | `12px` |
| Section header (`Header_title_hasBullet`) | `92px 556px` | — |
| Publications page (`FilteredSearchIndex_index`) | **`300px 900px 240px`** (filters / results / rail) | — |

**Mobile 390:** content **342 px** → **24 px** gutters; every grid collapses to one column;
gaps halve to `12px 24px`. Nothing about the grid is fluid — it is two discrete states.

Spacing values in use, by frequency: **14, 24, 12, 48, 10, 6, 8, 16, 36, 96 px**. A
6/12/24/48/96 doubling scale with a 14-px outlier.

**Components.**

- **Radius is the signature.** `24px 24px 24px 6px` on **107 elements** — a card with three
  round corners and one nearly square bottom-left. That single asymmetry does more brand
  work than any colour on the page. Also `36px 36px 36px 6px` (large cards), `56px`
  (buttons, full pills), `24px`, `100%`.
- **Buttons:** 56 px radius, `1px solid` border, `padding: 19px 20px 19px 25px`
  (asymmetric — more padding on the left, for the leading icon), background/border only on
  hover, `transition: background-color .15s ease-out, border-color .15s ease-out`.
- **Shadows: two elements on the entire home page** (`rgba(17,16,16,0.33) 0 4px 32px`).
  Separation is done with background colour and 1 px rules, not elevation.
- **Publication rows** use a `1px solid rgba(17,16,16,0.15)` divider and
  `padding: 24px 120px 24px 48px`. The 120 px right padding keeps the text measure short
  even in a 731 px column.

### 2.4 Motion

**There is no CSS animation on Stanford HAI.** Measured: `0` keyframe animations, `0`
entries in `document.getAnimations()`, `0` `<canvas>`, `0` SVG SMIL elements, `0` Lottie
players. Everything that moves is either a transition or a video.

Transitions, by frequency: `all 0.1s ease` (**86 elements**),
`background-color, border-color 0.15s ease-out` (22),
`grid-template-rows 0.2s ease` (5 — the accordion, animating grid rows, which is the modern
height-animation trick), `margin 0.25s ease-in-out` (3). The whole site moves in **100–250 ms**.

Motion comes from **three `<video>` elements**: `hero-video-1.mp4` (autoplay, loop, muted,
playsInline) behind the hero, an AI-Index device loop, and a 4:15 "anthem" film that is
click-to-play with a full media player.

**`prefers-reduced-motion`: declared 0 times, and measurably not honoured.** With the
context launched as `reducedMotion: 'reduce'`, the hero video's `currentTime` advanced from
**4.98 s to 7.64 s** across a 2.5 s sample — it plays exactly as it does without the
preference.

**But HAI is the first site in the whole reference set to ship a real motion control.**
A button labelled **"Pause Media"** (`ControlAnimationsButton_root`, 119 × 44 px,
`rgba(17,16,16,0.68)` background, white 18 px) sits in the footer area. Clicking it was
measured to pause **all three videos** (`paused: true` on every one) and the label toggles
to "Play Media". There is also a "Skip Carousel Content" button.

The catch: the control is at **y ≈ 8827 px** on an **8918 px** page. A user who is bothered
by the autoplaying hero video has to scroll the entire site to switch it off. The right
idea, in the wrong place. (**Inference:** the button ships with the Stanford footer
component, which is why it inherits the footer's position — its class list sits next to the
Stanford footer classes and it uses `"Circular Std", "Source Sans Pro", sans-serif`, the
*university's* font stack, not the site's `circularRegular`.)

### 2.5 Navigation, hero, IA

**Header:** 80 px tall, background `#F0F3F5`, `position: static` — it **scrolls away and
never comes back** (measured `top: -1580px` after a 1500 px scroll). No element on the page
is `fixed` or `sticky`. On an 8918 px home page, that is a deliberate refusal of the
persistent-nav convention.

Left: an inline SVG logo, `viewBox="0 0 248 50"`, rendered 200 × 40, filled `#0B3E6E`,
inside `a[href="/"]` with
`aria-label="HAI Stanford University Human-Centered Artificial Intelligence"`. The SVG
itself carries no `<title>`, `role` or `aria-label` — the accessible name lives on the link,
which is correct.
Right: a five-item mega menu — **About · Research · Education · Policy · AI Index** — each
expanding to 4–6 children (e.g. Research ▸ Fellowship Programs, Grants, Student Affinity
Groups, Centers & Labs, **Research Publications**, Research Partners). On mobile the whole
thing collapses behind a 32 × 32 `button[aria-label="Menu"]`.

**Hero:** full-bleed looping video, a single line of copy set as an `h3`
(*"Advancing AI research, education, and policy to improve the human condition."*, 42 px
white) and two buttons, **Watch Our Story** and **Engage With HAI**.

**Home structure:** hero → AI Index feature → **Research** (purple band) → **Education**
(teal band) → **Policy** → **Latest at HAI** (news feed) → founder quotes (Fei-Fei Li, John
Etchemendy) → **AI Glossary** → sector feeds ("In Healthcare", "In Education, Skills") →
**Stay Up To Date** (newsletter) → HAI footer → Stanford bar. Page height 8918 px desktop,
**12228 px mobile**.

**Semantics are the weak point.** The home page has **zero `<h1>`** elements. The hero
headline is an `h3`, section titles are `h2` (58 px), card titles are `h5` (22 px) — so the
document outline runs h3 → h2 → h4 → h2 → h5, which is not a valid hierarchy. There are
**zero `<time>` elements** and **zero JSON-LD blocks** on both pages measured. Images are
better handled: 19 images, **19 with an `alt` attribute** (5 deliberately empty), **19
lazy-loaded**, and the alt texts are descriptive ("Two smiling HAI Fellows sitting on
steps", "Students working together on a robotics project").

The publications page is cleaner: exactly **one `<h1>`** ("Research Publications", 84 px).

**Mobile 390:** `scrollWidth === innerWidth` (390 = 390) — **no horizontal overflow**.

### 2.6 Tone of voice

Institutional-warm, policy-facing, and aimed squarely at people who are not researchers.
The hero promises to *"improve the human condition"*. CTAs are invitations rather than
labels: *Watch Our Story*, *Engage With HAI*, *Explore our programs*,
*See how HAI empowers policymakers*, *Discover our immersive programs*,
*Sign Up For Latest News*. Research output is filed under reader-facing topics
("Healthcare", "Regulation, Policy, Governance") rather than methods, and each publication
carries a reading-time-style label ("Quick Read"). A homepage section is literally an
**AI Glossary** ("What is Human-Centered AI?", "What is an Open-Weight Model?").

This is a lab talking to legislators, journalists and donors. BAIR's blog is a lab talking
to other labs. We have to do both — which is the single clearest argument for keeping our
Research/theme pages and our Publications timeline visually distinct in density but
identical in system (§6).

---

## 3. The blog / publications feed, measured — answering the open question

The question carried over from the earlier batches: DeepMind claims 263 publications and
shows 30 with no filters and no pagination; Sakana puts `<time datetime>` on all 120 posts
and filters them client-side. Where do the university labs fall?

| | DeepMind (batch 2) | Sakana (batch 2) | **BAIR `/blog/`** | **HAI `/research/publications`** |
|---|---|---|---|---|
| Items in the corpus | 263 declared | 120 | **170** (archive page) | **140** ("140 Results Found") |
| Items per page | 30, no more | all 120 | **10** | **20** (40 DOM nodes = each row rendered twice) |
| Pagination | none | none needed | **`/blog/page2/` + "Older" + a full `/blog/archive/`** | **`?page=1…5`, server-rendered** |
| Filters | none | client-side category filter | **none** (0 selects, 0 checkboxes, 0 text inputs, 0 tag links) | **27 topic checkboxes + "Type to Search" + "Show Results"** |
| Filter state in the URL | — | not measured | — | **yes — `?topic=machine-learning`, written on tick, 140 → 9 results** |
| `<time datetime>` | absent | **on all 120** | **0 elements**; 10 plain-text dates ("Jul 1, 2026") | **0 elements**; dates are `<span>` in a mono face |
| JSON-LD | — | — | **none** | **none** |
| Machine-readable dates anywhere | no | yes | only in the URL slug (`/blog/2026/07/29/…`) | no |
| Feed | — | — | **`/blog/feed.xml`** | not found on the pages measured |

**Answer: both university labs sit on the DeepMind side for semantics and on the Sakana
side (or past it) for navigation.** Neither emits a single `<time datetime>` or a single
JSON-LD block across 310 combined items — yet both solve the "too many items" problem that
DeepMind did not even attempt. HAI goes furthest: faceted filtering **with shareable URL
state**, which Sakana's client-side filter does not give you.

Two details are directly useful to us:

- **BAIR's `/blog/archive/` lists all 170 posts on one 9938 px page** — one `h1`, one `h2`,
  and a flat list of links. No year headings, no dates rendered at all (a scan for text
  nodes matching `Mon D, YYYY` found **0**). It proves the "everything on one page" model
  scales to 170 items, and it also shows exactly what that model loses: with no dates and
  no grouping, a nine-year archive reads as an undifferentiated list. **Our decision to
  group Publications by year with a mono year heading is the fix for precisely this.**
- **HAI's publication row** is the component we should study: `h5` title 22 px, author,
  a type label ("Quick Read"), a **12 px monospace date**, topic chips, a 1 px rule, and a
  112 px thumbnail column. No card, no shadow, no border box — a ruled list.

---

## 4. Comparison

### What they agree on

- **Neither honours `prefers-reduced-motion`,** and neither writes a single such rule
  (0 occurrences in both CSS bundles). HAI at least ships a working global pause button;
  BAIR ships nothing, but also has almost nothing to pause.
- **Neither uses `clamp()`.** BAIR has no fluid type at all (the h1 is 36 px at 1440 *and*
  at 390); HAI swaps token values at breakpoints. Our fluid-type decision remains
  unmatched in the entire reference set — now 0 out of 8 sites.
- **Neither emits `<time datetime>` or JSON-LD**, on any page measured, for 310 combined
  research items.
- **Both pass the mobile overflow check**: `documentElement.scrollWidth === innerWidth` at
  390 px on every page measured.
- **Both put the accent colours through AA comfortably and let a quiet grey fail**:
  BAIR's `#7A7A7A` author line at 4.29:1, HAI's `rgba(255,255,255,0.5)` label at 3.79:1.
  Third batch in a row with the same result.
- **Both header bars are `position: static`** — neither site has a sticky navigation, and
  HAI has no fixed or sticky element anywhere on an 8918 px page.

### Where they diverge

| | BAIR | Stanford HAI |
|---|---|---|
| Home page height @1440 | **1102 px** (one screen) | **8918 px** |
| Colours in use | 2 (+2 strays) | ~13, organised into 4 named band themes |
| Typefaces | Inter only (home); Lato + Merriweather (blog) | Circular in 17 faces incl. a mono |
| Type sizes on the home | **3** (36/16/14) | **20** distinct sizes measured |
| `:root` custom properties | **0** | 10 (all layout, no colour) |
| Border-radius vocabulary | 2 values, both incidental | a signature `24px 24px 24px 6px` on 107 elements |
| Research content on the home | **none** | four bands + two feeds + a glossary |
| University colours used | **3 of Berkeley's**, including a tri-colour gradient headline | **none** of Stanford's, except the footer bar's `#2E2D29` |
| Identity across a click | **breaks completely** (§5.1) | **holds** — the publications page is the same system in a different band theme |
| Third-party origins | ≥4 on the blog (gstatic, googleapis, maxcdn, cdnjs) — home not measurable from the archive | **7** live (2× Siteimprove, GTM, GA4, Ahrefs, `www-media.stanford.edu`, `siteimproveanalytics.com`) |
| Cookies without consent | not measurable from the archive | **3** (`_ga`, `_ga_QGX42T28VX`, `nmstat`), no banner at all |

### The third-party trend, continued

Batch 1's two sites were comparatively clean; batch 2 flagged third-party requests as the
clearest regression. The university labs are worse again: **HAI loads from 7 third-party
origins and sets 3 analytics cookies with no consent mechanism whatsoever**, and BAIR's
blog pulls fonts, icons and a maths renderer from 4 CDNs. Both are US sites where this is
lawful; for a MUR-funded Italian project it is simply not available to us, which turns our
"no cookies, no tracking without consent, self-hosted fonts" rule from a nicety into the
thing that makes our site *smaller and faster* than either reference.

---

## 5. University identity vs lab identity — the co-branding question

This is the section the category exists for. BAIR and HAI make **opposite** choices, and
between them they map the whole space.

### 5.1 BAIR: maximum university, zero continuity

BAIR's new home is, visually, **a Berkeley page**. Its only two colours are white and
Berkeley Blue `#003262`; its headline is a gradient of three official Berkeley colours
(`#003262 → #3B7EA1 → #C4820E`); its single image is the Berkeley bear; its footer says
**"© UC Regents 2026."**; three of its five initiatives are `*.berkeley.edu` hostnames.
There is no separate BAIR palette to speak of. The lab's identity *is* the university's
identity, plus a bear.

And then you click "Blog" and land in a different universe: Lato and Merriweather instead
of Inter, `#0076DF` links, `#333` text, a 294 px Jekyll header with a PNG logo, **zero**
Berkeley colours in the stylesheet, no "UC Regents" line, no shared nav. The only route
back is a single link labelled "BAIR".

> This is a harder break than the Sakana → `/blog/` break recorded in the previous batch.
> Sakana at least kept the wordmark and the white page. BAIR changes stack, typeface,
> palette, layout, header height and footer, and **the page that breaks is the one holding
> nine years and 170 posts of the lab's actual research**. The redesign reached the door
> and stopped.

**The lesson is not "don't use university colours."** It is that a co-branding decision
which lives only on the homepage is not a design system — it is a poster.

### 5.2 HAI: minimum university, maximum continuity

Stanford HAI does the reverse. The university appears in **exactly two places**:

1. **The logo lockup** — one 200 × 40 SVG in `#0B3E6E`, whose accessible name is
   *"HAI Stanford University Human-Centered Artificial Intelligence"*. The word "Stanford"
   is inside the lab's mark. There is **no separate Stanford wordmark in the header**.
2. **The bottom bar** — a vendored `StanfordFooter` component: 1440 × 138 px, background
   `#2E2D29` (Stanford black), the university wordmark set in Stanford's own `stanford.woff`
   webfont loaded from `www-media.stanford.edu`, at 34 px white, followed by the ten
   mandated links: Stanford Home · Maps & Directions · Search Stanford · Emergency Info ·
   Terms of Use · Privacy · Copyright · Trademarks · Non-Discrimination · Accessibility.

Everything between those two points is HAI's own: its own palette (with **no cardinal red
at all**), its own typeface, its own notched-card radius, its own band-theme system. The
university is a **frame**, not a skin — and because the frame is a self-contained component
at the very bottom of the page, it costs the lab's design nothing. That is also why the
"Pause Media" button is down there in the university's font stack rather than the site's:
it arrived with the frame.

The continuity test that BAIR fails, HAI passes cleanly: `/research/publications` is
recognisably the same site as `/` — same header, same logo, same type scale, same notched
cards, same 1344 px grid — it simply switches the band theme from "cloud" to "chalk" and
raises the `h1` to 84 px.

### 5.3 What this means for TA-LLM, PoliTo and the MUR

We have three identities to fit, not two: **TA-LLM** (the project), **Politecnico di
Torino / DAUIN** (the host), and **MUR / FIS 2** (the funder, whose acknowledgement is a
contractual obligation, not a design choice). The measured evidence supports the HAI model
over the BAIR model, with one adjustment.

**Recommendation.**

1. **The header carries TA-LLM only.** One wordmark, amber `#E6A23C` on ink `#0F1420`, with
   the accessible name doing the institutional work exactly as HAI's does — e.g.
   `aria-label="TA-LLM — Large Language Models: a matter of time? — Politecnico di Torino"`.
   No PoliTo logo, no MUR logo, no FIS badge above the fold. HAI proves a lab can put the
   university's *name* in its mark without importing the university's *design*.
2. **The institutional block is a single component at the foot of every page**, styled as
   our own (ink background, paper text, mono labels) rather than as a foreign skin. It
   holds, in this order: the PoliTo/DAUIN line, the MUR + Fondo Italiano per la Scienza
   acknowledgement with **FIS-01152** and **CUP E53C25001820001**, and the logos. Treat it
   like HAI's Stanford bar: a frame that is present on every page and never negotiates with
   the content above it.
3. **Do not adopt PoliTo's palette.** BAIR shows what happens when the lab has no colours
   of its own: the identity cannot survive onto any page the redesign did not touch. Our
   ink / paper / amber system plus the four theme colours is the identity; PoliTo blue and
   the MUR tricolour belong to the logos in the footer block and nowhere else. If a PoliTo
   colour is ever needed for an official lockup, it goes in the footer component only.
   *(Inference: PoliTo's brand guidelines will require a minimum clear space and a minimum
   size for the logo — worth checking before the footer is built, since that constraint
   will set the footer block's minimum height.)*
4. **Logos are SVG with a real accessible name, never a PNG with a missing `alt`.** BAIR's
   blog header ships a 479 × 256 PNG with **no `alt` attribute at all**; on a
   funder-acknowledgement block that is both an accessibility failure and a compliance one.
   Every logo in the footer block gets an `alt` naming the institution.
5. **Whatever the co-branding decision is, it has to hold on the smallest page.**
   The one test that separates HAI from BAIR is: open the deepest, least-designed page —
   a single publication, one person, one news item — and check that the header, the
   footer block, the type scale and the accent are unchanged. If the funding
   acknowledgement is only on the homepage, we have built BAIR.

---

## 6. Takeaways for TA-LLM

Each item is checked against the design system in `CLAUDE.md` (ink `#0F1420` / paper
`#F3EEE4` / amber `#E6A23C`, display serif + sans + mono, "Time, made visible", dark
default, one accent per view, WCAG AA) and against the decisions already taken (1 px grid
gap, Publications as a year timeline, fluid `clamp()` type, canvas hero + animated SVG,
themes as native Astro pages, applications via an external form).

### Adopt

1. **Band themes, as the mechanism behind "one accent per view".**
   HAI's `tier-theme-provider` / `Tier_color-theme-*` pattern is our rule made
   implementable: a full-width section declares one theme, and the headings, rules and
   chips inside it recolour from it. Ours writes itself onto the four research themes —
   `data-theme="rlaif|cl|topology|agentic"` on the section, with amber `#E6A23C`, sage
   `#7FB3A0`, violet `#8E7CC3`, ice `#6FA8DC` as the band accent. It also removes the
   temptation to put all four colours in one view. *Confirms and operationalises the
   existing rule; no change to the palette.*

2. **A monospace face reserved for dates and numbers — and nothing else.**
   Measured on HAI: `circularMonoRegular` at 12 px for `Mar 19, 2026` on every publication
   row (52 elements site-wide). This is exactly the JetBrains Mono role in our system and
   it is now validated on a 140-item corpus. Extend it to the **year headings** in our
   Publications timeline, the theme numbers **01–04**, the FIS/CUP codes in the footer
   block, and event dates. *Directly supports the year-grouped-timeline decision.*

3. **Negative tracking that scales with type size.**
   HAI: −0.035 em at 84 px, −0.02 em at 16 px. Our display serif (Instrument Serif /
   Fraunces) at hero sizes will need the same treatment. Since our scale is `clamp()`-based,
   set `letter-spacing` in `em` so it tracks automatically instead of needing a rule per
   breakpoint — something HAI cannot do because it has no fluid scale. *Extends the fluid
   type decision rather than contradicting it.*

4. **One asymmetric geometric signature, applied everywhere.**
   HAI's `24px 24px 24px 6px` on 107 elements does more identity work than any single
   colour on the site, at zero performance cost. Our equivalent should come from
   "Time, made visible" rather than from a copied corner — e.g. every card carries a
   **1 px amber rule on one edge only**, or the persistence-ring motif clipped into one
   corner. The principle to take is *one geometric rule, repeated without exception*, not
   the rounding itself — our 1 px-gap ruled-table grid already forbids HAI's soft cards.

5. **Ruled rows, not cards, for any list of research output.**
   HAI's publication row: title 22 px, author, type label, mono date, topic chips,
   `1px solid rgba(ink,0.15)` divider, generous asymmetric padding (`24px 120px 24px 48px`),
   no shadow, no border box. That is our 1 px-gap grid seen from the other side, and it is
   what our Publications timeline rows should be. Note the 120 px right padding: it keeps
   the measure short inside a wide column without a narrower container.

6. **Faceted filtering that writes its state into the URL.**
   Measured on HAI: ticking "Machine Learning" rewrote the URL to
   `?topic=machine-learning` *immediately* and cut 140 results to 9. For us that means
   `/publications?theme=topology` and `/publications?year=2027` must be real, linkable,
   statically-renderable URLs — which Astro gives us for free and which a client-only
   filter (Sakana's model) does not. A supervisor should be able to paste a link to "our
   RLAIF papers" into an email. *Fits the "filterable Publications" item in our IA.*

7. **An RSS feed for News and Publications.**
   BAIR ships `/blog/feed.xml`; HAI has no feed on the pages measured. For an academic
   project a feed is close to free in Astro and is how other labs and aggregators will
   actually follow us. *Addition to the IA, not a change to it.*

8. **MathJax-class maths rendering on theme and paper pages.**
   BAIR's blog loads MathJax 2.7.1 and its posts use inline LaTeX with numbered figures and
   captions. Our four themes (topology-aware reasoning in particular) will need this.
   Do it with **KaTeX rendered at build time** rather than a runtime CDN script, so we keep
   zero third-party origins and no layout shift. *Consistent with the self-hosting rule.*

9. **A global "pause motion" control — but put it in the header, not the footer.**
   HAI's "Pause Media" button genuinely pauses every video (measured). Its mistake is
   placement: y ≈ 8827 on an 8918 px page. Ours belongs next to the theme toggle, and —
   unlike both reference sites — it must sit **on top of a real `prefers-reduced-motion`
   implementation**, not instead of one. Our canvas hero already has to be lazy-started and
   paused off-screen; add "paused by preference, and by an always-reachable button".

10. **Descriptive, lazy-loaded imagery with honest empty alts.**
    HAI: 19/19 images carry an `alt`, 5 deliberately empty for decoration, 19/19
    `loading="lazy"`, and the alt texts describe the scene. BAIR's blog: 11 images, 2 with
    **no alt at all**, 1 empty, 0 lazy. HAI's handling is the standard to hit. *Matches the
    "alt text on every image" rule.*

### Avoid

1. **Shipping a homepage instead of a site.**
   BAIR's home is 1102 px: a bear, one sentence, and a menu. Every substantive question a
   visitor has — what do you work on, who are you, what have you published — is answered
   only after a click into a site that looks nothing like it. Our home must carry the three
   goals, the four themes and the latest papers *on the page*, as our IA already specifies.

2. **Letting any page fall outside the design system.**
   The BAIR blog is the strongest argument yet for our "themes are native Astro pages,
   never external links" decision. Extend it explicitly: **Publications, News, Events and
   People are native pages too.** The only sanctioned exception stays the external
   application form (PoliTo-hosted), and it should be an obvious outbound link, not a
   surprise.

3. **A 17-face `.ttf` webfont stack.**
   HAI self-hosts — correctly — but ships TrueType, not WOFF2, in 17 weights. We need at
   most **five faces**: display serif regular, sans regular, sans medium, mono regular, and
   one italic if the content demands it. Self-hosted, **WOFF2 only**, subset to Latin,
   `font-display: swap`.

4. **Seven third-party origins and silent analytics cookies.**
   HAI sets `_ga`, `_ga_QGX42T28VX` and `nmstat` with no consent UI at all. Our target
   stays **zero third-party origins and zero cookies**. If usage numbers are ever required,
   use a cookieless, self-hosted or EU-hosted counter and say so on the About page.

5. **Stepping the type scale at breakpoints.**
   HAI needs a rule per size per breakpoint (h2 50→38, h3 42→32, h4 27→24, gutters
   4.8rem→2.4rem) and still has only two discrete states. BAIR does not scale at all —
   its 36 px h1 is identical at 1440 and 390. `clamp()` across the whole scale remains the
   right call, and no reference site has yet contradicted it.

6. **Broken heading order and missing `<h1>`.**
   HAI's home has **zero** `h1` and runs h3 → h2 → h4 → h5; BAIR's blog index has **ten**
   `h1` elements on one page and no `<main>` landmark. Our rule stays: **exactly one `<h1>`
   per page**, descending levels, a `<main>` landmark and a skip link on every page.

7. **Dates as plain text.**
   Zero `<time datetime>` across 310 items on two sites. Every date we render — publication,
   event, news, project start/end — goes in `<time datetime="YYYY-MM-DD">`, and every
   publication and event gets JSON-LD (`ScholarlyArticle`, `Event`, `Person`). On a project
   whose subject *is* time, unmachine-readable dates would be an embarrassment.

8. **An archive with no dates and no grouping.**
   BAIR's `/blog/archive/` puts 170 posts on one page with no year headings and no rendered
   dates. It is the exact failure mode our year-grouped Publications timeline avoids —
   worth keeping in mind when the list eventually gets long enough to tempt us into a flat
   "see all" page.

9. **A quiet grey chosen by eye.**
   Three batches, three sites, same failure: BAIR `#7A7A7A` at 4.29:1, HAI
   `rgba(255,255,255,0.5)` at 3.79:1, and HAI's two most-used greys passing by under 0.3
   points. Our muted text tokens (`--paper-muted` on ink, and the darkened variants on
   paper) must be **computed to ≥ 4.5:1 and checked in CI**, not sampled by opacity.

10. **A sticky-nav-free 12 000 px mobile page.**
    HAI's mobile home is 12228 px with a header that scrolls away at 80 px and never
    returns, and no fixed element anywhere. Our pages are shorter, but the mobile header
    should stay reachable — a compact sticky bar with the wordmark, the menu and the theme
    toggle, with no layout shift on scroll.

### What differentiates us

- **We are the only one of the eight reference sites whose subject is time**, and the only
  one that will therefore be judged on whether its dates are machine-readable. `<time>`,
  JSON-LD and a year-grouped timeline are not hygiene for us — they are the argument.
- **Dark by default.** BAIR is light-only (its dark-mode media query is dead code); HAI is
  light-only with dark bands. A dark-default site with a real light theme is already a
  differentiator in this category, and our measured contrast pairs (amber on ink 8.4:1,
  paper on ink 15.9:1) are better than anything measured on either reference.
- **Motion as content, not decoration.** HAI's motion is a stock hero video; BAIR's is a
  one-second fade. Our canvas hero and animated inline SVGs make the movement *the subject*
  — flowing series, persistence rings, token streams — and they will be the only motion in
  the category that carries meaning. That also raises the bar: they must be the first in
  this reference set to actually stop under `prefers-reduced-motion`.
- **Zero third-party origins, zero cookies, self-hosted everything.** Measured against
  HAI's 7 origins and 3 silent cookies, and BAIR's blog pulling from 4 CDNs, our compliance
  constraint is also our performance advantage.
- **One system from the homepage to the last publication row.** BAIR loses its identity in
  one click; HAI keeps it. We should be measurably on HAI's side, and the check is cheap:
  screenshot the deepest page and diff its header, footer block, type scale and accent
  against the homepage.

---

## 7. Screenshot index

> **Not committed.** `research/moodboard/` is git-ignored (`.gitignore:15 —
> research/moodboard/*`) because it holds third-party material. These files exist only on
> the local machine and are shared on request.

### BAIR — `research/moodboard/bair/`

**All BAIR captures are from the Internet Archive** (the live host was refusing connections
throughout the capture window — see §0). The `if_` modifier was used, so no archive toolbar
is present in the images.

| File | What it shows |
|---|---|
| `home-desktop-1440-wayback-2026-08-10.png` | Home, 1440 px, full page (1102 px tall): nav, gradient headline, Berkeley bear |
| `home-mobile-390-wayback-2026-08-10.png` | Home, 390 px, full page (880 px tall) |
| `hero-phase-1-desktop-1440-wayback.png` | Hero **mid-animation** — `fadeIn`/`fadeInDelay` measured `running` at currentTime ≈ 417 ms |
| `hero-phase-2-desktop-1440-wayback.png` | Hero after the fades complete (`getAnimations()` empty, opacity 1) |
| `hero-phase-3-desktop-1440-wayback.png` | Settled state, ~450 ms later — identical to phase 2, which is the point: total motion < 2 s |
| `home-reduced-motion-desktop-1440-wayback.png` | Home rendered with `reducedMotion: 'reduce'` — the fades still ran (measured) |
| `home-dark-scheme-desktop-1440-wayback.png` | Home with `colorScheme: 'dark'` — visually identical to light; the dark media query is dead code |
| `blog-index-desktop-1440-wayback-2026-08-09.png` | **Chosen internal page.** `/blog/`, 1440 px, full page (8978 px): 10 posts, Lato/Merriweather, 840 px column |
| `blog-index-reduced-motion-desktop-1440-wayback.png` | `/blog/` with reduced motion (nothing to stop — 0 animations) |
| `blog-archive-desktop-1440-wayback.png` | `/blog/archive/` — 170 posts, flat list, no years, no dates |

*(The first live-capture attempt produced four screenshots of Chrome's "site unreachable"
error page; they were deleted rather than kept.)*

### Stanford HAI — `research/moodboard/hai-stanford/`

All captured **live** on 2026-09-17.

| File | What it shows |
|---|---|
| `home-desktop-1440.png` | Home, 1440 px, full page (8918 px): hero video, purple/teal/lilac bands, feeds, glossary, both footers |
| `home-mobile-390.png` | Home, 390 px, full page (12228 px) — no horizontal overflow |
| `home-desktop-1440-firstview-no-cookie-banner.png` | First viewport before any interaction — **documents the absence of a cookie banner** despite 3 analytics cookies being set |
| `hero-phase-1-desktop-1440.png` | Hero video, frame ≈ 1.5 s |
| `hero-phase-2-desktop-1440.png` | Hero video, frame ≈ 4 s — the two frames show what moves and how slowly |
| `home-reduced-motion-desktop-1440.png` | Home with `reducedMotion: 'reduce'` — hero video still playing (`currentTime` 4.98 → 7.64 s) |
| `header-lockup-desktop-1440.png` | 2× crop of the top 120 px: the HAI/Stanford logo lockup and the mega-menu bar |
| `footer-stanford-cobranding-desktop-1440.png` | The HAI footer above the mandated Stanford bar (`#2E2D29`, wordmark in Stanford's own webfont, the ten university links, and the "Pause Media" button) |
| `nav-menu-open-mobile-390.png` | Mobile menu open (`button[aria-label="Menu"]`) |
| `research-publications-desktop-1440.png` | **Chosen internal page.** `/research/publications`, 1440 px, full page: 84 px plum `h1`, 300/900/240 grid, ruled rows, mono dates |
| `research-publications-filters-desktop-1440.png` | The 27-checkbox topic facet rail and "Show Results" |
| `research-publications-filtered-desktop-1440.png` | After ticking "Machine Learning": URL `?topic=machine-learning`, 140 → 9 results |
