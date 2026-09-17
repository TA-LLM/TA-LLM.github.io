# Design decisions — synthesis

Single source of truth for building the site. Short by design: the evidence lives in the
six analysis notes, this file records what we decided and why.

**Evidence base:** 13 sites, all values measured in the browser (computed styles, `:root`
tokens, stylesheet text, resource timing, emulated `prefers-reduced-motion`), never
estimated from screenshots. Contrast ratios computed with the WCAG relative-luminance
formula.

Source notes, referenced below by short name:

| Short name | File | Sites |
|---|---|---|
| `[batch1]` | `reference-sites-aionic-agenticsystemslab.md` | Aionic, Agentic Systems Lab |
| `[frontier]` | `reference-sites-frontier-labs.md` | DeepMind, Anthropic |
| `[identity]` | `reference-sites-strong-identity-labs.md` | Sakana, Isomorphic |
| `[university]` | `reference-sites-university-labs.md` | BAIR, Stanford HAI |
| `[institutes]` | `reference-sites-research-institutes.md` | Ai2, Mila, Vector |
| `[networks]` | `reference-sites-networks-and-funded-projects.md` | ELLIS, Fondazione FAIR |

---

## 1. Confirmed patterns and decisions

Each decision names the sites that support it. "N/M" means N of the M sites where the
property was measured.

### Layout and colour

1. **1px-gap ruled grid for every list of research output.** Cards butt together, the page
   background shows through as a hairline, no shadows. `0 box-shadow` on 6/6 sites that
   were checked for it. ASL invented it, HAI arrives at the same thing from the other side
   (ruled rows, `1px solid rgba(ink,.15)`, no border box), ELLIS reads better than FAIR
   precisely because FAIR floats cards on shadows. → themes 01–04, publications, people,
   events. `[batch1 §5.4]` `[university §6.5]` `[networks §7.9]`

2. **Dark default, warm paper on blue-leaning ink.** 12/13 sites are light by default; the
   one dark site (ASL) is rigorously neutral greyscale. Paper `#F3EEE4` on ink `#0F1420`
   measures **15.91:1**. This is the single most distinctive choice in the system and
   nobody else occupies it. `[batch1 §5.19]` `[frontier §5.20]` `[identity §5.21]`

3. **One accent per view, and the accent carries the concept.** Amber marks the "?" in the
   title, the active nav state, the section eyebrow, and — the idea worth keeping —
   **the "now" marker on any time axis**. Sakana's identity is one red fish in a grey
   school: five coloured elements on the whole page. `[identity §5.23]` `[batch1 §5.2]`

4. **Theme colour is a band property, not a sprinkle.** A full-width section declares
   `data-theme="rlaif|cl|topology|agentic"` and its headings, rules and chips recolour from
   it. HAI's `Tier_color-theme-*` is our "one accent per view" rule made implementable, and
   it removes the temptation to show all four colours at once. `[university §6.1]`

5. **Light theme: tint the surface, never the type.** Isomorphic's six chromatic tokens are
   all `100`-step pastels used only as backgrounds — black on them measures 19.11:1 and
   17.22:1. Derive a `-100` tint of each theme colour for section washes; keep the type
   ink. This is the positive form of the rule already in `CLAUDE.md`. `[identity §5.1]`

6. **A paper block inside the ink page.** Both frontier labs invert a block; since we are
   dark by default the move inverts too. Use it for "Why TA-LLM" and the funder plinth.
   Inside a paper block, amber text becomes `#8A5A10`. `[frontier §5.7]`

### Typography

7. **Fluid `clamp()` across the whole scale.** Measured: Anthropic 46 calls, Vector 97,
   Sakana on the things that matter — against Aionic 3 (none on headings), Mila 0 in 5,507
   rules, ELLIS 0 in 243 KB, FAIR 1 in 1,096 KB, ASL 0. The sites that skip it are visibly
   worse on a phone (ELLIS's h2 drops to 20px and stops reading as a heading).
   `[frontier §5.1]` `[institutes §6.5]` `[networks §7.2]`

8. **Fluid spacing too, on a ×1.5 ratio.** Anthropic's spacing tokens are themselves
   `clamp()`: gap 31.48px @1440 → 28.05px @390, no media query. This is what fixes ASL's
   128px-padding-on-mobile problem without a single breakpoint. **The 1px grid gap is
   exempt — a hairline is not a spacing step.** `[frontier §5.2]` `[institutes §6.5]`

9. **Container-query units for the hero headline.** Ai2: `clamp(2rem, 4.23612cqw, 7rem)` →
   61px @1440, 32px @390. Strictly better than `vw` for a headline inside a fixed content
   column, which ours is. `[institutes §6.6]`

10. **Swap the display *cut* at mobile, not only the size.** Isomorphic renders its h1 in
    weight 200 at 56px and weight 300 at 28px. Fraunces has an `opsz` axis, so this is one
    variable adjustment. No reference site combines fluid sizing with an optical-size
    change — doing both would be genuinely ours. `[identity §5.4]`

11. **Letter-spacing in `em`, negative and size-tracking.** HAI: −0.035em at 84px, −0.02em
    at 16px. In `em` it tracks a `clamp()` scale automatically. `[university §6.3]`

12. **Mono owns the data layer, and it should be dominant.** Nav, eyebrows, dates, venues,
    DOIs, year headings, theme numerals 01–04, the FIS/CUP codes — 12px, ~1px tracking,
    uppercase. Isomorphic commits to mono as *the interface* (107 mono elements vs 27 sans)
    and it is the strongest thing about that site. `[identity §5.3]` `[university §6.2]`

13. **Optical trim tokens per family.** Anthropic declares separate trim values for display
    serif, sans, paragraph and mono. We mix three families against a 1px grid: this is what
    stops baselines drifting. `[frontier §5.3]`

### Content and structure

14. **Publications = year timeline + Ai2's filter grammar.** Year as a mono heading, papers
    as plain body-size ruled rows. Density measured: Mila's masonry cards show 12 items per
    screen, Vector's rows 4, a 1px-gap row list **15–20**. Add from Ai2: real `<select>`
    facets and a text query, **all serialised into the URL**. `[institutes §6.1]`
    `[university §6.6]`

15. **A sticky mono year rail instead of a pager.** Our corpus is years, not pages. 2026 ·
    2027 · 2028 · 2029 down the side, scrolling the timeline. This is "Time, made visible"
    applied to the navigation itself. `[institutes §6.3]`

16. **Print the result count.** 0/13 sites do it. `24 papers · 2027 · Topology-Aware
    Temporal Reasoning`, in mono, above the list. Cheapest fix in the whole analysis.
    `[institutes §6.2]` `[networks §7.8]`

17. **Machine-readable time everywhere.** `<time datetime>` on every date; `ScholarlyArticle`,
    `Event` and `Person` JSON-LD. Measured: 0 `<time>` on DeepMind, ASL, Ai2, Mila, Vector,
    ELLIS and across 310 items on BAIR+HAI; Anthropic has 14 and no JSON-LD. For a project
    whose subject *is* time this is not hygiene, it is the thesis executed in markup.
    `[frontier §5.22]` `[institutes §6.4]` `[university §6.7]`

18. **Themes are named nav items.** Anthropic opens "Research" onto eight named teams; Mila
    lists six Strategic Priorities by name. Ours: Research → the four themes, with the theme
    name as the coloured eyebrow on every paper row. `[frontier §5.6]` `[institutes §6.8]`

19. **Every page is native and carries the full nav.** Confirmed three times over — ASL
    routes six research areas to Notion, Sakana's `/blog/` is a different generator with a
    different typeface, a different accent and **no site nav at all**, BAIR loses its
    identity in one click. The only sanctioned exception is the external application form,
    and it must be an obvious outbound link. `[batch1 §5.11]` `[identity §5.12]`
    `[university §6.2-avoid]`

20. **Motion = one primitive: many elements, one behaviour, different phases.** Aionic's 10
    desynchronised `streamFlow` durations, DeepMind's 9 looping videos of different lengths,
    Anthropic's 0.13s per-word stagger. That is literally a time series. One stagger
    primitive serves the theme cards, the persistence-ring SVGs and the hero canvas.
    `[frontier §5.21]`

21. **Two motion layers: canvas behind the hero, animated inline SVG for the concepts.**
    The concept animations are the argument, so they belong in SVG where they can carry
    `<text>` labels, alt text and theming — not in video. Both network sites hand-drew their
    maps rather than embedding a tile provider, which adds a privacy argument to the
    aesthetic one. `[batch1 §5.22]` `[identity §5.10]` `[networks §7.3]`

22. **Hero headline animates once, with an `sr-only` duplicate.** Anthropic: opacity +
    `translateY(24px)`, 0.8s, `cubic-bezier(0.16, 1, 0.3, 1)`, ≈0.13s stagger, settles at
    2.1s, never loops; the full sentence also ships in a visually hidden span. This is how
    to have headline motion without ASL's infinite-loop failure. `[frontier §5.4]`

23. **RSS + iCal.** BAIR ships `/blog/feed.xml`; Vector's events page has `Event` JSON-LD
    and subscribe links. For a project running seminars until 2029, a subscribable calendar
    is worth more than the events page design. `[university §6.7]` `[institutes §6.9]`

24. **Additions worth taking:** Ai2's `grid-template-rows: subgrid` so card internals align
    across siblings (matters with a 1px gap and no shadows); metric-matched `local()`
    fallback faces for no-layout-shift font swap; ELLIS's full-screen mobile menu; ELLIS's
    stat band reinterpreted as *4 themes · 3 goals · 3 years · 1 question*. `[institutes §6.10-11]`
    `[networks §7.4-5]`

---

## 2. What to avoid, with the measurement

| Don't | Measured evidence |
|---|---|
| Use the accent as text on a light background | Aionic teal **2.5:1**, Anthropic clay **2.96:1**, Ai2 paper titles `#F0529C` **3.29:1**, ELLIS blue **2.86:1** on every link. 4/4 light-default sites fail. Our amber on paper is **1.89:1** → use `#8A5A10` `#356B58` `#6A55A8` `#2F6DA3` |
| Pick the quiet grey by eye | Sakana `#9a9a9a` **2.81:1** at 11px, BAIR `#7A7A7A` 4.29:1, HAI `rgba(255,255,255,.5)` 3.79:1. The accent often passes; the muted grey almost never does. Compute muted tokens to ≥4.5:1 and check in CI |
| Ship a page with no `<h1>` | DeepMind home **0**, HAI home **0**, Sakana home **0**, FAIR home **0** in both languages; BAIR blog index has **10**; Mila hides a 1×1px `h1` reading "Home" |
| Publish a list that counts more than it shows | DeepMind: **263 publications, 30 rows**, no filter, no pager, no load-more (verified: count stayed 30 after scrolling to the bottom twice) |
| Render the whole corpus on one page | Vector: **1,000 entries, 256,772px, 13,950 DOM nodes, 1.26 MB HTML**, no filters, no count. The opposite failure, same result |
| Step the type scale at breakpoints | ELLIS h2 36→20px (stops reading as a heading), HAI needs a rule per size per breakpoint and still has two states, BAIR's h1 is 36px at both widths |
| Let mobile overflow horizontally | Anthropic 390px page is **396px** wide; FAIR overflows 27px at 1440 |
| Keep desktop section padding on mobile | ASL holds 128px → **18,321px** phone page |
| Build the site as one long home page | ASL home 10,379px desktop; Sakana blog index 114,345px with 31 autoplay videos |
| Trust a CSS media query to stop motion | Vector's WebGL hero **still animating** under emulated `reduce` (1 rule in the whole stylesheet); Sakana's p5 canvas still redrawing (pixels sampled); Iso **0 occurrences in 205KB**; Mila **0**; FAIR's preloader spinner ignores the rule it declares. 3/4 and then some |
| Leave the canvas at 1× | 4/4 canvases measured are 1:1 backing store against CSS width — soft on every retina screen |
| Load fonts or analytics from a third party | Origins before any consent action: **Ai2 2 · Sakana 3 · ELLIS 2 · FAIR 9 · Isomorphic 9 · DeepMind 14 · Mila 17 · Vector 21**. HAI sets `_ga` + `nmstat` with no consent UI; Sakana runs GA4 with no banner at all |
| Ship a large token file | DeepMind **335 properties** (199 colours, nine alpha steps of one ink); FAIR 233; Iso 165 including **9 named `<deleted|variable-…>`**; ASL carries the full shadcn set unused. Anthropic runs its whole identity on **24** and reads as the more designed |
| Remove button transitions | DeepMind: every button `transition: all 0s` |
| Make the hairline invisible | DeepMind row separator **1.12:1** against the page, Anthropic **1.48:1**. Our 1px gap works because the background shows through at full strength |
| Declare content images decorative | **13 of Iso's first 14** `<img>` have `alt=""` including leadership portraits; Ai2's `/team` is 307 images with **89 non-empty alts**; 10 of FAIR's 11 home images, funder logos included; Sakana's wordmark alt says "Sakana Chat" |
| Bake text into images | FAIR's Italian map labels survive onto the English site; its ten spoke numbers are ten images instead of text |
| Ship a tall fixed header | FAIR spends 150px — **17% of a 900px viewport** — half of it on a logo band |
| Let the header vanish forever | Iso's `position: absolute` nav scrolls away and overlaps a photo on the way out; HAI's mobile home is 12,228px with no fixed element anywhere |
| Duplicate a roster onto every profile | ASL repeats all 41 members below each of ~45 profiles |
| Ship two pages called "Publications" | Vector has an editorial one and a database one, and the editorial one outranks the real list in the nav |

---

## 3. Information architecture, revised

**Site map.** Home · Research (overview + 4 theme pages) · Publications (filterable +
a page per key paper) · People · Events · News · Resources · Join us · About (incl. funding).
Unchanged from `CLAUDE.md` except: **About gains a `#funding` section**, and **Events and
News gain feeds** (RSS) and **Events an iCal subscribe link**.

**Theme page template**, from ELLIS's node pages, renamed for us: *What we are studying ·
Why it is hard · Approach · People · Publications · Links*. `[networks §7.6]`

### Home — desktop (1440)

| # | Section | Notes |
|---|---|---|
| 1 | **Hero** | `h1` = "Large Language Models: a matter of time?" with the amber "?". Canvas behind, lazy-started, paused off-screen. Per-word stagger, once, plus `sr-only` full sentence. **No CTA in the hero** — 3/4 references have none and it keeps the question as the only message |
| 2 | **Three goals** | 3-up, 1px-gap grid, mono numerals |
| 3 | **Four themes 01–04** | 1px-gap ruled grid, 4-up. Theme colour appears only as the eyebrow + a 1px edge rule. Each links to its theme page |
| 4 | **Stat band** | *4 themes · 3 goals · 3 years · 1 question* in display serif, one figure in amber. `clamp()`, not ELLIS's 96→48px step |
| 5 | **Why TA-LLM** | The comparison, as a **paper block** on the ink page. Amber text becomes `#8A5A10` inside it |
| 6 | **Latest publications** | 5 rows of the year timeline + result count + link to the full list |
| 7 | **Events** | Next 2–3, `<time datetime>`, iCal link |
| 8 | **News** | 3 latest |
| 9 | **Join us** | Three audiences — students / researchers / industry — each with its own destination; application form is an outbound link |
| 10 | **Team** | PI + roles, links to People |
| 11 | **Funder plinth** | Full-bleed paper band: logos + mono funding line (§4) |
| 12 | **Footer** | Nav, three contact addresses by audience, legal line |

### Home — mobile, designed at 390 (not a shrunk desktop)

The rule: **what changes at 390 is the layout, not the content.** Every section above is
present; these are the ones that need a different design rather than a narrower one.

- **Sticky bar, ~56–64px**: wordmark · menu · theme toggle · pause-motion. Stays reachable
  (HAI's 12,228px page with no sticky element is the counterexample). Menu opens as a
  **full-screen overlay** with 1px hairlines between items, chevrons on expandable groups,
  socials at the bottom — ELLIS's, the best mobile menu in the five batches.
- **Hero**: `h1` at the `clamp()` floor **with the lighter/optical cut**, not merely smaller.
  Canvas drops particle count; under `reduce` it renders one static frame.
- **Four themes**: **stacked 1-up ruled rows**, mono numeral as a left eyebrow — not a 2×2
  squeeze. The ruled-table reading survives; a 2×2 of small cards does not.
- **Stat band**: 2×2, not a 6-up row compressed.
- **Why TA-LLM**: the comparison becomes **stacked labelled pairs**. Never a horizontally
  scrolling table.
- **Publications preview**: 3 rows; theme eyebrow above, title, mono date below — stacked,
  not a truncated 12-column row.
- **Year rail**: collapses from a sticky side rail to a horizontal scrollable chip row
  pinned under the header on `/publications`.
- **Funder plinth**: logos 2-up at 56px height; the mono line wraps to 3 lines and stays at
  13px — it does not shrink below legibility.
- **Section rhythm**: steps down through the fluid spacing scale, with no media query.
- **Hard check**: `scrollWidth === innerWidth` at 390 on every page (§6).

---

## 4. Logos, funding and CUP

Full reasoning and measurements in `[networks §3]`. Decisions:

- **Foot of every page, above the legal line — never the header.** FAIR's permanent 50px
  band costs 17% of the first screen and explains nothing.
- **Its own full-bleed band, in a colour chosen to suit the logos.** On our ink page that
  means a **paper `#F3EEE4` plinth** — a light institutional base under a dark page. This
  is FAIR's one genuinely good move, separated from its execution.
- **Never filter the MUR emblem or the PoliTo crest.** Measured across three sites: funder
  emblems are left at `filter: none`, only *partner* logos are normalised. If a dark band is
  ever required, use official negative/monochrome artwork, not CSS. `grayscale(1)` stays
  available for future industrial partners.
- **Geometry**: `object-fit: contain` (never `cover` — FAIR crops logos), fixed **height**
  boxes of 56–64px so different proportions optically align, ≥32px of air, 48–64px band
  padding.
- **SVG only, descriptive `alt` on each, each linked to the funder.** All reference sites
  fail all three.
- **The mono funding line**, the one opportunity nobody took — JetBrains Mono, 13–14px,
  muted paper:
  > Funded by the Italian Ministry of University and Research — Fondo Italiano per la
  > Scienza (FIS 2) · Project **FIS-01152** · CUP **E53C25001820001** · 18/08/2026 – 17/08/2029

  Dates wrapped in `<time datetime>`. It turns a compliance obligation into a data line
  rather than a disclaimer.
- **`/about#funding`** states programme, code, CUP, DAUIN/PoliTo and the PI, and the plinth
  links to it. FAIR's failure mode is logos everywhere and facts nowhere.

> ⚠️ **To verify with Politecnico before building the strip.** No reference site publishes a
> project code or a CUP, so there is no precedent to copy and the following are assumptions,
> not observations:
> - the **exact mandatory wording** of the MUR / FIS 2 attribution, and whether an EU or
>   ministerial emblem is required alongside it;
> - the **official artwork kits** from MUR and PoliTo — positive/negative/monochrome SVG,
>   minimum sizes, clear-space rules — and whether monochrome treatment is permitted at all;
> - whether the **CUP must appear on every page** or only on `/about` (our current choice is
>   footer line + fuller About section, which is a judgement call);
> - whether PoliTo requires a specific co-branding lockup for a DAUIN-hosted project.

---

## 5. Fonts

**Dropped: Inter and Geist.** Inter is what Agentic Systems Lab uses and is the default
neo-grotesque of this entire category; Geist is Vercel's house face and reads as a
deployment-platform default. Both would place us in the visual centre of the field we just
measured, and 13/13 reference sites use a geometric or neo-grotesque sans for display —
that convergence is exactly what our display serif is meant to escape.

**Display serif: Fraunces** (OFL), preferred over Instrument Serif because its `opsz` axis
makes the mobile cut-swap (§1.10) one variable adjustment rather than a second file.

**Mono: JetBrains Mono** (OFL), unchanged.

**Text sans — three OFL, self-hostable candidates:**

| Font | Why | Watch out |
|---|---|---|
| **Public Sans** *(recommended)* | Designed for the US public sector, i.e. exactly our register: institutional, unfussy, built to recede behind a display face. Variable, excellent at 14–18px, generous Latin coverage. It lets Fraunces carry all the identity, which is the whole point of the pairing | Slightly stiff for very long prose; we have little of it |
| **Source Sans 3** | Humanist rather than grotesque, warmer, designed by Adobe for UI *and* long-form reading. The best choice if the theme pages turn out to be essay-length. Complements Fraunces' humanist warmth rather than contrasting it | Widely used, so slightly less distinctive |
| **IBM Plex Sans** | An engineered, technical voice with real personality, and it shares a design system with IBM Plex Mono — an option if we ever want one family spanning text and data | Aionic already uses IBM Plex Mono; picking the Plex family echoes the reference site closest to our topic. Coherence gained, differentiation lost |

**Rules for all of them** (`[university §6.3-avoid]`): **at most five faces** — display
serif regular, sans regular, sans medium, mono regular, one italic if the content demands
it. Self-hosted, **WOFF2 only**, subset to Latin, `font-display: swap`, with metric-matched
`local()` fallback faces so the swap causes no layout shift. HAI is the counterexample:
self-hosted but 17 TrueType faces.

---

## 6. Technical rules

1. **Reduced motion in JavaScript, not only CSS.** A CSS media query cannot stop a
   `requestAnimationFrame` loop — verified on Vector (WebGL hero still animating under
   emulated `reduce`) and Sakana (p5 canvas pixels still changing). The canvas must check
   `matchMedia('(prefers-reduced-motion: reduce)')` **at start and on change**, render one
   static frame and return. Declare motion as **opt-in** with
   `@media (prefers-reduced-motion: no-preference)` (Anthropic's pattern) so anything left
   unguarded defaults to still. SVG concept animations expose a static first frame.
2. **Canvas at device pixel ratio.** Size the backing store to
   `rect.width * devicePixelRatio` and scale the 2D context. 4/4 reference canvases get
   this wrong; it is one line.
3. **Publications filters and pagination hold their state in the URL.**
   `/publications?theme=topology&year=2027` must be a real, linkable, statically-rendered
   URL — a supervisor should be able to paste "our RLAIF papers" into an email. Pager
   grammar: the unavailable direction is a `<button disabled>`, the available one an
   `<a href>`. Always print the result count. A single year over ~60 papers collapses; the
   page never does.
4. **Zero third-party origins, zero cookies, no consent banner.** A static Astro build on
   GitHub Pages with self-hosted fonts, KaTeX rendered at build time and no analytics can
   ship **one** origin. Ai2 runs a whole institute site on two. This makes the no-tracking
   rule true by construction rather than by policy, and removes the entire consent
   apparatus.
5. **`scrollWidth === innerWidth` asserted at 390px** on every page, as part of the
   screenshot step in the working rules. Anthropic ships 396px on a 390px viewport.
6. **Certificate on apex *and* `www` before announcing the domain.** `future-ai-research.it`
   fails on both over HTTPS with `ERR_CERT_COMMON_NAME_INVALID`; only `http://` resolves,
   301 to a different hostname. Verified independently with `curl` (exit 60 on both).
   Check this immediately after the `public/CNAME` switch.
7. **Semantics**: exactly one `<h1>` per page, descending heading levels, a `<main>`
   landmark and a skip link. Muted-text tokens computed to ≥4.5:1 and checked in CI, never
   sampled by opacity.

---

## 7. Proposed changes to CLAUDE.md — for approval

Not applied. Each is a small edit to an existing section.

1. **Stack** — record that the deploy target is a single-origin static build: no
   third-party requests, no analytics, no consent banner.
2. **Design system → Type** — replace "text sans (Inter or Geist)" with **Public Sans**
   (recommended), Source Sans 3 or IBM Plex Sans; state the preference for **Fraunces** over
   Instrument Serif because of the `opsz` axis; add the **five-faces / WOFF2 / Latin subset /
   metric-matched fallback** rule.
3. **Design system → Colors** — add the `-100` light-theme tints of the four theme colours
   for section washes (§1.5), and rename the theme tokens `--theme-rlaif`, `--theme-cl`,
   `--theme-topology`, `--theme-agentic` rather than by colour name.
4. **Design system → Layout** — add the **1px-gap ruled grid** as the standard list device
   and the **band-level `data-theme`** mechanism for "one accent per view".
5. **Design system → Motion** — add: reduced motion checked **in JS** as well as CSS,
   motion declared opt-in with `no-preference`, canvas sized to `devicePixelRatio`, the
   once-only per-word hero stagger with an `sr-only` duplicate.
6. **Design system → Accessibility** — add: exactly one `<h1>`, `<main>` + skip link, muted
   tokens computed to ≥4.5:1 and checked in CI.
7. **Information architecture** — add `/about#funding`, RSS for News and Publications, iCal
   for Events; record the theme-page template (§3); record that the four themes are named
   items in the Research nav.
8. **New section, "Publications"** — year timeline, URL-held filter state, printed result
   count, sticky year rail, `<time datetime>` + `ScholarlyArticle` JSON-LD.
9. **New section, "Funding and logos"** — the §4 decisions, including the explicit list of
   items to verify with Politecnico.
10. **Working rules** — add the `scrollWidth === innerWidth` assertion at 390px to the
    post-change screenshot step, and the apex+`www` certificate check after the `CNAME`
    switch.
11. **Reference sites** — point to this file as the entry point, with the six notes as the
    evidence behind it.
