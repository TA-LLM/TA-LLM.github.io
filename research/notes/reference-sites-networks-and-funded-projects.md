# Reference site analysis — Networks and funded projects: ELLIS, Fondazione FAIR

**Date of capture:** 2026-09-17
**Sites:** `https://ellis.eu/` · `https://future-ai-research.it/` (→ redirects to
`https://fondazione-fair.it/`, see "Loading issues")
**Method:** Playwright 1.64 driving system Chrome (`channel: "chrome"`) in an isolated
persistent context created for this batch only — deliberately *not* the shared Playwright
MCP browser. Viewports 1440×900 and 390×844, `deviceScaleFactor: 1`.
Every number below was read from the live DOM/CSSOM via `evaluate` (computed styles,
`:root` custom properties, concatenated `cssRules` text, resource origins, response body
sizes, `document.getAnimations()`), never estimated from a screenshot. Contrast ratios were
computed from the extracted hex values with the WCAG 2.x relative-luminance formula.
Motion was verified by md5-diffing successive screenshots of the same 1440×900 region over
a 12 s window, both normally and with `prefers-reduced-motion: reduce` emulated.
Statements that go beyond what was directly measured are marked **(inference)**.

**Scope note:** this is the *networks and funded projects* category — the closest of all
five batches to TA-LLM's **funding structure**. We are a MUR-funded project (Fondo Italiano
per la Scienza, FIS 2, project code FIS-01152, CUP E53C25001820001) and we will have to
show a funder logo strip and, probably, administrative identifiers. The extra brief for
this batch was therefore: (a) how these sites attribute their funding and treat
institutional logo strips without wrecking the design; (b) how they represent a network of
sites/partners; (c) for FAIR, an Italian MUR/PNRR-funded project, how they handle
Italian/English and institutional communication. Sections 3, 4 and 5 answer those.

**This batch continues** `reference-sites-aionic-agenticsystemslab.md`,
`reference-sites-frontier-labs.md`, `reference-sites-strong-identity-labs.md`,
`reference-sites-research-institutes.md` and `reference-sites-university-labs.md`;
cross-batch comparisons are in sections 6 and 7.

---

## 0. Loading issues, stated openly

**`https://future-ai-research.it/` does not load in Chrome.** Measured, on a clean profile,
with no `--ignore-certificate-errors` flag:

| URL | Result |
|---|---|
| `https://future-ai-research.it/` | `net::ERR_CERT_COMMON_NAME_INVALID` — hard interstitial, no page |
| `https://www.future-ai-research.it/` | `net::ERR_CERT_COMMON_NAME_INVALID` — hard interstitial, no page |
| `http://future-ai-research.it/` | `301` → `https://fondazione-fair.it/` (200) |
| `http://www.future-ai-research.it/` | `301` → `https://fondazione-fair.it/` (200) |

So the domain we were given — the one that appears in the project's own communications —
only works if the visitor types plain `http://`. Any modern browser, any link written as
`https://future-ai-research.it`, any HSTS-preloaded client, and any user who types the bare
hostname into a browser that upgrades to HTTPS by default (Chrome does, since v115) lands
on a certificate warning instead of the site. The certificate served on that host does not
cover that name; the redirect to `fondazione-fair.it` only exists on port 80.
**This is the single most damaging defect in the batch and it has nothing to do with
design.** All FAIR captures below were therefore taken from `http://future-ai-research.it/`
(which lands on `https://fondazione-fair.it/`) and from `fondazione-fair.it` directly.

**Lesson for us, before anything else:** when we attach `ta-llm.io` via `public/CNAME`,
the HTTPS certificate must cover **both** the apex and `www`, and both must resolve. A
project whose only public identity is a URL cannot afford a URL that throws a security
warning. (GitHub Pages issues certificates for both automatically once "Enforce HTTPS" is
enabled and DNS is correct, so this is a matter of checking, not of building anything.)

ELLIS loaded fully at both widths with no errors.

**Cookie consent — two opposite philosophies, both measured on a fresh profile:**

| | ELLIS | FAIR |
|---|---|---|
| Consent UI | **None** | iubenda `alertdialog`, black card **960×230** centred at (240, 654), full-screen `position: fixed` scrim at z-index 99999998 |
| Buttons | — | `Scopri di più e personalizza` · **`Rifiuta`** · **`Accetta e continua`** (reject offered at the same level and visual weight) |
| Blocks the page? | — | Yes: the scrim covers the viewport; the page is not usable until dismissed |
| Origins contacted **before** any consent action | **2** (`ellis.eu`, `analytics.ellis.eu`) | **9** (`fondazione-fair.it`, `future-ai-research.it`, `cs.iubenda.com`, `cdn.iubenda.com`, `idb.iubenda.com`, `fonts.googleapis.com`, `fonts.gstatic.com`, `cdnjs.cloudflare.com`, `img.youtube.com`) |
| Origins after accepting | 2 (unchanged) | 13 (adds `cpl.iubenda.com`, `static.hotjar.com`, `www.googletagmanager.com`, `region1.google-analytics.com`) |
| Analytics cookies set without consent | **Yes** — `_pk_id.3.c8ef`, `_pk_ses.3.c8ef` (Matomo) | No — GTM/GA4/Hotjar fire only after "Accetta e continua" |

Both are half-right, in opposite ways. **FAIR gates the trackers properly** — GTM, GA4 and
Hotjar genuinely wait for consent, which is more than Mila, Vector, Sakana or DeepMind
managed in the earlier batches — but it loads Google Fonts, cdnjs and a YouTube thumbnail
host before you have said anything, so seven third-party origins already know your IP.
**ELLIS ships no banner at all** and self-hosts Matomo on `analytics.ellis.eu`, but still
writes two first-party `_pk_*` cookies on first visit without asking. Matomo *can* be run
in a consent-exempt configuration; whether theirs is, cannot be determined from the client
side — **(inference: they treat first-party Matomo as exempt)**.

Screenshot of the FAIR banner: `cookie-banner-desktop-1440.png`; the same viewport after
accepting: `home-after-consent-viewport-1440.png`.

---

## 1. ELLIS — `ellis.eu`

Stack, from measured artefacts: **Statamic** (`/vendor/statamic/frontend/js/helpers.js`,
`statamic-easy-forms`), **Laravel Livewire** (`/livewire-f05f1198/livewire.min.js`,
`--livewire-progress-bar-color` on `:root`), **Tailwind CSS v4** (utility class names
throughout, `oklch()` colours in the computed palette), **self-hosted Matomo**. Total
transfer for the home page: **1,426 KB over 21 requests** (script 848 KB, stylesheet 221 KB,
image 121 KB, document 121 KB, font 116 KB).

### 1.1 Palette

ELLIS runs a **five-accent** system — the exact opposite of our one-accent-per-view rule —
anchored on a near-black charcoal and a single dominant blue.

```
charcoal    #333333   hero + dark bands      (background on 10 elements)
near-black  #171717   secondary dark surface (5)
ELLIS blue  #6A9BDD   dominant accent        (colour on 87, background on 21)
light grey  #E5E5E5   alternating band       (2)
white       #FFFFFF   page ground            (7)
black       #000000   body text              (colour on 402)
```

Plus the four extra accents that make up the brand's signature device — a **12 px
five-segment colour bar** pinned to the very top of every page
(`grid-cols-5`, 288 px per segment at 1440, 78 px at 390):

```
coral   #DF7162      green  #B2E684      teal  #4BC5BE      orange #E38E48      blue #6A9BDD
```

The same five colours letter the `ellis` wordmark (one colour per letter).
`:root` carries **exactly one** custom property, and it is not a colour
(`--livewire-progress-bar-color: #2299dd`): all design tokens are compiled away by
Tailwind. There is **no dark/light toggle** and no `prefers-color-scheme` handling —
`color-scheme: normal`.

Measured contrasts:

| Pair | Ratio | Verdict |
|---|---|---|
| white `#FFFFFF` on charcoal `#333333` (hero h1) | **12.63:1** | AAA |
| black `#000000` on ELLIS blue `#6A9BDD` (the "by the Numbers" band) | **7.35:1** | AAA |
| black on light grey `#E5E5E5` | 16.67:1 | AAA |
| **ELLIS blue `#6A9BDD` as text on white** (every "Read More", every outlined CTA) | **2.86:1** | **fails AA** |
| ELLIS blue as a 3 px CTA border on white | 2.86:1 | **fails** the 3:1 non-text minimum too |
| ELLIS blue on light grey `#E5E5E5` | 2.27:1 | fails |
| ELLIS blue on charcoal `#333333` | 4.42:1 | AA large only |
| coral `#DF7162` on white | 3.15:1 | large only |
| teal `#4BC5BE` / orange `#E38E48` / green `#B2E684` on white | 2.09 / 2.55 / **1.44** | fail |

This is the **fourth** consecutive batch in which the brand accent passes as a fill and
fails as text (Ai2's pink 3.29:1, Vector's, Mila's, now ELLIS blue at 2.86:1). ELLIS is the
worst case so far because the failing colour is not decorative: it is the colour of *every
link and every call to action on a white ground* — "See the list of members" and "See the
list of sites" are 20 px / weight 400, which is not "large text" under WCAG, so 4.5:1 is
required and 2.86:1 is delivered. `CLAUDE.md`'s rule about darkened text variants
(amber `#8A5A10` etc. on paper) is exactly the fix ELLIS never applied.

### 1.2 Typography

Two families, **both self-hosted**, zero font CDNs: **Roboto Slab** (display *and* UI —
headings, nav, buttons, even body copy in editorial blocks) and **Roboto** (the `body`
default). 14 `@font-face` rules, all `woff2` under `/fonts/`. The filenames are Google's
own (`KFO5CnqEu92Fr1Mu53ZEC9_…woff2`), i.e. Google Fonts files rehosted on first-party
infrastructure — the same trick we should use.

Measured, 1440 → 390:

| Role | 1440 | 390 | Notes |
|---|---|---|---|
| Hero `h1` | **48 px / 60 px**, w300, ls **+1.2 px** | **30 px / 37.5 px**, w300, ls +0.75 px | Roboto Slab Light |
| Section `h2` | 36 px / 45 px, w300, ls +0.9 px | 20 px / 25 px, ls +0.5 px | |
| Stat `h3` ("2000+") | **96 px / 96 px**, w700 | 48 px / 48 px, w700 | the only bold weight on the page |
| Hero lead `p` | 30 px / 37.5 px, w300, ls +0.75 px | 18 px / 22.5 px | |
| Nav link | 14 px / 20 px, w300 | 14 px / 20 px | unchanged across widths |
| `body` default | 16 px / 24 px, w400 (Roboto) | 16 px / 24 px | |

Two things worth stealing and one worth avoiding.
**Steal:** the whole type system is *light-weight slab at large sizes* — w300 at 48 px with
**positive** letter-spacing (+0.025em), which is unusual and gives the headline an airy,
institutional, un-startup-like voice; and the single bold weight (w700) is reserved for
one thing only, the statistics.
**Avoid:** there is **not one `clamp()` in the entire 243 KB / 582 rules of same-origin
CSS** (`clampCount: 0`). The scale steps at Tailwind breakpoints, so the h1 jumps 48 → 30 px
(a 0.625 ratio) with nothing in between, and the h2 collapses 36 → 20 px (0.56) — the
mobile h2 ends up *smaller than the mobile hero lead paragraph* (20 px vs 18 px is barely a
distinction, and at 20 px/w300 the section headings stop reading as headings on a phone).
This is the concrete failure mode our fluid-type decision was made to avoid.

### 1.3 Grid, spacing, components

- **Two container widths**, measured: a wide **1376 px** column inside 1440 (32 px gutters,
  used by the 12-column page grid) and a narrow **960 px** column for prose and the hero.
- 12-column grid throughout (`grid-cols-12`). Measured instances: 3-up at **416 px × 3 with
  a 64 px gap**; 2-up at **664 px × 2 with a 48 px gap**; a 2-up card row at 444 px with
  24 px; a single 960 px column with 48 px.
- Gap scale, by frequency: **24 px (8) · 48 px (6) · 32 px (3) · 64 px (1) · 16 px (1)**.
  Vertical padding scale: 24 · 16 · 12 · 80 · 40 · 112 · 64 px.
- At 390 every grid collapses to one column: 358 px (16 px gutters) or 326 px inside padded
  cards; gaps halve (48 → 32, 24 → 16).
- **Zero box-shadows on the entire home page** (the shadow histogram is empty). Depth is
  produced by full-bleed background bands — charcoal, blue, light grey, white — alternating
  down the page.
- Radii: **50 px and 30 px pills** (5 + 4 occurrences) and one 6 px. Buttons are
  *outline* pills: `border: 3px solid #6A9BDD`, `padding: 12px 24px`, 20 px text, 62 px tall;
  the big one is `4px solid`, `padding: 12px 32px`, 80 px tall. No filled buttons on the
  light ground at all.
- Transitions: `0.3s cubic-bezier(0.4, 0, 0.2, 1)` on **82** elements (Tailwind's default
  ease), `0.15s` on 11, `0.5s` on 1. Properties are limited to colour / background-color /
  border-color — i.e. hover only, no transforms.
- `border-b-8`: sections are separated by thick 8 px rules in accent colours, and each
  section heading sits above a short accent underline (visible in
  `detail-numbers-band-desktop-1440.png`).

### 1.4 Motion — measured, not grepped

| Check | Result |
|---|---|
| `@keyframes` animations running on the home | **0** (`animationName: none` on every element) |
| `document.getAnimations()` | **0** running |
| `<canvas>` elements | **0** |
| SMIL (`<animate>` in SVG) | **0** |
| Lottie | absent |
| Hero over 12 s (8 frames, md5) | **1 distinct frame** — completely static |
| `prefers-reduced-motion` blocks in CSS | **1** |
| Hero over 12 s with `reduce` emulated | 1 distinct frame — no change, because there was nothing to stop |

ELLIS is the most motionless site in the whole five-batch survey: the only movement on the
entire home page is 0.3 s colour hovers. It declares one `prefers-reduced-motion` block and
has nothing to apply it to. Note that this is not laziness so much as a **budget choice**:
the page is 1.4 MB and does not animate, and it still reads as designed, because the work
is done by colour bands, scale contrast (96 px numerals) and the hand-drawn map.

### 1.5 Navigation, hero, IA

**Navigation** (see `detail-header-desktop-1440.png`):
1. the 12 px five-colour bar (0 px from the top),
2. a **utility strip** on charcoal: Jobs · Become a Member · For Media · Contact · Intranet
   (14 px, right-aligned, 417×40),
3. the **main bar**: wordmark left, five items right — Research · Members · About · News ·
   Events — at 14 px/w300.

The header is **not sticky**: measured after scrolling to y=1500, no element with
`position: fixed|sticky` and width > 1000 exists. The header simply scrolls away. On a
7,463 px page that is a real cost (no persistent way back), and a deliberate one.

At 390 the menu is a **full-screen dark overlay** (`nav-open-mobile-390.png`): colour bar
kept at the top, wordmark left, ✕ right, five primary items separated by 1 px hairlines
with chevrons for the three that expand, then the utility links each with a `→`, then four
social icons. It is the cleanest mobile menu in the whole survey and costs nothing to copy.

**Hero** (`hero-desktop-1440.png`): a 567 px charcoal band. Left half (960 px container,
`col-span-6` = 464 px, `max-width: 512px`): the `h1` at 48 px/w300 in white, left-aligned,
no lead paragraph, no button. Right half: the multicolour `ellis` wordmark at large size
over a **hand-drawn, hatched Europe** in white strokes, with the expanded name beneath it.
The network idea is carried by an *illustration*, not by data — and the illustration is
plainly hand-made, which is what keeps a five-colour palette from looking like a corporate
template. **(inference: the hatched map is a bespoke drawing, not generated.)**

**IA of the home page**, measured section by section (heights at 1440):
hero (567, charcoal) → intro strip (172) → **ELLIS by the Numbers** (625, blue band, six
96 px stats: 2000+ Members · 47 Sites · 16 Cross-Border Research Programs · 560 Fellows &
Scholars · 19 Countries · 500+ PhD Students & Postdocs) → *How ELLIS is making an impact*
(641, white) → a charcoal band with the Annual Report CTA (600) → **Latest News** (1,148,
grey) → **Upcoming Events** (1,043, white, `border-b-8`) → **Jobs in the ELLIS Network**
(838, grey) → *Explore How to Collaborate with ELLIS* (partnerships / sponsorships /
share your offers) → newsletter. Total 7,463 px at 1440; **10,129 px at 390**.

Six `h2`, six `h3`, exactly **one `h1`**. **No `<time datetime>` anywhere** (0 elements),
**no JSON-LD**, **no `hreflang`**, and — worth noting — **no `<footer>` element at all**:
the footer is a plain `<nav>`. 20 images, **0 without an `alt` attribute**, 2 with
`alt=""` (decorative). English only; no language switcher.

**Calls to action** are uniformly phrased as plain sentences in sentence case —
"See the list of members", "See the list of sites", "See More News", "Open the Annual
Report PDF", "Read More" — never imperative marketing verbs. Combined with the light slab
serif, the voice is *institutional-friendly*: it states facts and offers lists.

### 1.6 Interior page — `/research/sites` (chosen, and why)

I chose ELLIS's **Sites** page over Members, News or Jobs because it is the page that
answers the brief's second question: *how do you show a network of many locations?* It is
also the closest structural analogue to our four research themes plus partners.

Measured (`sites-desktop-1440.png`, `detail-map-desktop-1440.png`,
`detail-site-cards-desktop-1440.png`):

- Page height 8,148 px. One `h1`, centred, 1376 px wide. 153 links, 51 of them to
  `/research/sites/...`.
- **A stat band first**: 44 Units · 1 Associate Unit · 2 Institutes · 19 Countries ·
  150 Associated Institutions — same 96 px numerals as the home.
- **Then "Find a Site": an inline SVG map**, 960×540, in a white card with a radius, inside
  a light-grey band, `h-[60svh]`. Measured: **177 `<path>` + 52 `<circle>`** — countries as
  dark silhouettes with white borders, units as coral dots. Two zoom buttons
  (`size-10`, grey, top-right). **Not Leaflet, not Mapbox, not a Google iframe** — a
  hand-built SVG with its own zoom. No tile server, no third-party origin, no consent
  problem, and it inherits the site's palette.
- **Then the list**: **44 unit anchors**, all present in the DOM, as cards of **262×136**
  in a 5-up row, each labelled "Unit" in ELLIS blue above the city name.
- Pagination controls on this page (2–8, 17, 18, NEXT and a second 2, 3, 4, NEXT) belong to
  the *news* and *jobs* modules further down, not to the unit list
  **(inference: the 44 units are unpaginated; the pagers sit in sibling modules)**.
- **No search and no filter on the units** — 44 items are shown, and that is deliberate:
  the map *is* the filter.

**A node page** (`/research/sites/unit-alicante`, 4,057 px) has a fixed template of seven
`h3` sections and no `h2`: Unit Mission · Participating Institutions · Research Agenda ·
Links & Social Media · Unit Directors · Members · Coordinators. People appear as 112–128 px
circular portraits. This is very close to what our per-theme pages need.

### 1.7 Long lists — `/members/members-list`

The comparator for DeepMind (263 declared, 30 shown), Stanford HAI (27 facets, 140→9),
Mila (6,986 publications, numbered pager) and Vector (1,000 rows on a 256,772 px page):

| Measured | ELLIS members list |
|---|---|
| Rows per page | **11–12**, each **596×128** (two columns of rows) |
| Pager | numbered, **1 … 8 … 223, 224, NEXT** |
| Implied total | ≈ **2,690 members** (224 × 12) **(inference — the multiplication is mine)** |
| Total shown to the user | **none** — the page never states how many members exist |
| Facets | 4 groups: Affiliations · Affiliation Country · ELLIS Site · ELLIS Program |
| Facet controls | **1,068 checkboxes** in the DOM, only 1 visible until a group is opened |
| Free text | "Search by name…" |
| Page height | 2,664 px — genuinely small, because pagination does the work |

This is the best long-list behaviour in the survey so far: 2,664 px per page instead of
Vector's 256,772 px, real facets instead of DeepMind's none, and a numbered pager that
tells you the list has 224 pages. The one flaw is that the *count* is never printed: the
home page claims "2000+" and the list page claims nothing. **Our fix is trivial — print the
number** ("218 publications", "4 themes, 12 people") because our numbers will be small
enough to be an asset, not a liability.

### 1.8 Tone of voice

Declarative, quantitative, slightly formal European-institutional English: "Strengthening
Europe's Leadership in AI through Research Excellence"; "ELLIS is a pan-European AI network
of excellence"; "ELLIS fosters international collaboration across domains, connecting top
researchers while investing in the next generation of AI talent." The whole home page is
**3,939 characters of text** — short. The numbers carry the argument.

---

## 2. Fondazione FAIR — `fondazione-fair.it` (ex `future-ai-research.it`)

Our nearest structural twin: an Italian, MUR-funded, PNRR "Partenariato Esteso" (PE13)
organised Hub & Spoke, with 25 partners including **Politecnico di Torino**.

Stack, from measured artefacts: **WordPress 7.1** (`meta[name=generator]`) + the
**Impreza** theme (`us_*`, `l-section`, `w-grid-list` class grammar) + **WPBakery**
(`vc_row`, `wpb_wrapper`) + **Slider Revolution 7** (`sr7-layer`, `revslider` assets) +
**EventON** (`evo_*`, 233 `:root` custom properties from these plugins) + **iubenda** +
**Hotjar** + **GTM/GA4**. Total transfer for the home page: **5,245 KB over 65 requests**
(image 2,244 KB, script 1,494 KB, **stylesheet 906 KB**, font 365 KB, document 211 KB) —
**3.7× heavier than ELLIS**.

### 2.1 Palette

```
ink            #0C0D0E   body text            (colour on 433 elements)
page grey      #F3F3F3   body background      (3)
white          #FFFFFF   content ground       (13)
cream          #FEF6EB   newsletter + footer band (3)
FAIR orange    #F79B26   primary button fill  (4)
amber          #F9B259   hero eyebrow text    (2)
link blue      #1100BD   text links           (8)
grey 1         #565B61   secondary text       (50)
grey 2         #7B8289   tertiary text        (7)
funding navy   #1E3E88   the top funder band  (full-bleed, 1440×50)
```

`:root` carries **233 custom properties**, essentially all of them generated by the theme
and its plugins (`--evo_color_1`, `--color-header-middle-bg`, `--box-shadow`, a 12-step
`--evocg*` grey ramp, a 12-step `--evoclg*` ramp…). It is the opposite of a designed token
set: it is a settings dump. Two ramps of greys are declared and the page actually uses two
greys, neither of which comes from the ramps.

Measured contrasts:

| Pair | Ratio | Verdict |
|---|---|---|
| ink `#0C0D0E` on white | **19.45:1** | AAA |
| ink on page grey `#F3F3F3` | 17.53:1 | AAA |
| ink on cream `#FEF6EB` | 18.15:1 | AAA |
| **ink on FAIR orange `#F79B26`** (the primary button) | **8.96:1** | AAA |
| white on FAIR orange | 2.17:1 | fails — and is correctly *not* used |
| link blue `#1100BD` on white | 11.94:1 | AAA |
| grey 1 `#565B61` on white | 6.85:1 | AA |
| **grey 2 `#7B8289` on white** | **3.89:1** | **fails AA** for body text |
| amber `#F9B259` on white | 1.82:1 | fails — used only over a dark photo, where it is unmeasurable |
| white on cream `#FEF6EB` | **1.07:1** | see below |

Two honest notes. First, FAIR gets the thing ELLIS got wrong **right**: its orange is used
as a *fill with dark text on it* (8.96:1), never as text on white. That is precisely the
rule `CLAUDE.md` writes for our amber, and it is the single best decision on this site.
Second, the 1.07:1 pair is a **fallback risk, not a live failure**: the newsletter band
paints white text over a background *image* (`newsletter_bg.png`, an indigo→purple
gradient) whose containing section's background *colour* is cream. If the image fails to
load or is blocked, the white text lands on cream at 1.07:1 and disappears. The quiet grey
(`#7B8289`, 3.89:1) is a genuine miss — the same "quiet grey fails" pattern found in every
previous batch.

### 2.2 Typography

**One family for everything: Plus Jakarta Sans** (variable, weights 200–800). Loaded
**twice**: from `fonts.googleapis.com` / `fonts.gstatic.com` *and* from a self-hosted copy
under `/wp-content/uploads/themepunch/gfonts/…`. A second Google Fonts request pulls
`Noto Sans` + `Poppins` for the events plugin, and Font Awesome 7 arrives both from
`cdnjs.cloudflare.com` and from the theme folder. Four font sources for one typeface family
in use.

Measured, 1440 → 390:

| Role | 1440 | 390 |
|---|---|---|
| `h1` | **absent** — see 2.6 | absent |
| Section `h2` | **39 px / 42.9 px**, w800 | 33 px / 36.3 px, w800 |
| Card `h3` | 18 px / 19.8 px, w800 | 16.8 px / 18.48 px |
| Body `p` | 18 px / 26 px, w400 | 16 px / 24 px |
| Nav link | 18 px, line-height **100 px** (the header row height) | 16 px / 60 px |
| Hero title (slider layer) | 41 px, w800, white | — |
| Hero eyebrow | 15 px, w400, `#F9B259` | — |
| Hero CTA | 13 px, w700, ink on orange | — |

**Only 1 `clamp()` in 13,618 CSS rules / 1,096 KB**, and it is a theme internal
(`--font-size: clamp(1em, 1em * var(--ratio) …)`). So the type scale is, again, breakpoint
steps, but the steps are gentler than ELLIS's (39 → 33 px, 0.85 ratio, versus ELLIS's 0.56).
The whole site is one weight-contrast system: w800 for every heading and w400 for every
paragraph, nothing in between — which reads as loud and flat. The line-height is tight
(42.9/39 = 1.10 on headings, 19.8/18 = 1.10 on card titles): headline blocks feel cramped
and multi-line card titles collide visually.

### 2.3 Grid, spacing, components

- Container widths measured: **1300 px** and **1354 px** (both present, from different
  WPBakery rows), inside 1440.
- News list: `w-grid-list`, **2 columns of 623 px with a 54 px gap** at 1440; single 342 px
  column with 48 px at 390.
- Partner grid (see 3.2): `grid-template-columns: 228px 228px 228px 228px 228px`,
  tiles **182×182**, row pitch **183 px** (so a 1 px vertical seam; the horizontal air is
  46 px of in-cell whitespace).
- Gap histogram is dominated by **24.3 px** (44 occurrences) and padding by **9.72 px**
  (44) — these are `1.35rem` / `0.54rem` theme values, i.e. a spacing system derived from
  an arbitrary ratio rather than a scale. There is no 4/8 px rhythm to read.
- Radii: **14 px** and **18 px** pills on buttons, 5.4 px on the skip links, `50%` on social
  icons.
- **Shadows exist**: `0 5px 15px rgba(0,0,0,.15)` on 9 elements, plus a 1.5 px inset ring
  on 5. So cards float — the opposite of the ruled-table look we chose.
- Transitions: `0.2s` on 149 elements, `0.3s` on 27. Buttons animate `background, border,
  box-shadow, color, opacity, transform` in 0.3 s.
- **Horizontal overflow at 1440**: `document.scrollWidth` = **1467** vs `innerWidth` 1440.
  The culprits are the Slider Revolution row (`g-cols vc_row`, 1494 px wide starting at
  x = −27) and two `sr7-img` layers whose right edge is at 1478 px. At **390 there is no
  overflow** (390 = 390). A desktop-only 27 px horizontal scroll is a rare and avoidable bug.

### 2.4 Motion — measured, not grepped

| Check | Result |
|---|---|
| `@keyframes` running on the home | 0 elements with a CSS `animation-name` |
| `document.getAnimations()` | **2 running**, both `rotation`, 800 ms, on `div.g-preloader.type_1` (45×45, `visibility: visible`) |
| `<canvas>` | **3**, each 1440×525 (Slider Revolution) |
| SMIL | 0 · Lottie: absent |
| Hero over 12 s (8 frames, md5) | **1 distinct frame** — the slider did not auto-advance |
| Slider controls | prev/next arrows present at both edges (visible in `en-home-desktop-1440.png`) |
| `prefers-reduced-motion` blocks in CSS | **2** |
| Same 12 s with `reduce` emulated | **1 distinct frame**, and the **two 800 ms spinners keep spinning** |

So: the hero is a carousel that did not move in the observed window (**inference:** either
autoplay is off or its interval exceeds 12 s — I did not wait longer), and the only thing
that actually animates on the page is a pair of preloader spinners that **ignore
`prefers-reduced-motion: reduce`**. That continues the pattern from every previous batch —
the rule is declared, the motion is not stopped — but with a mild twist: here there is
almost no motion to stop, and the one animation that survives is the one nobody designed.

### 2.5 Navigation and hero

**Header** (`detail-header-logos-desktop-1440.png`), `position: fixed`, **150 px tall**,
shrinking to **122 px** on scroll (class `sticky` is added; background stays white,
no shadow):
1. `.l-subheader.at_top` — the **funder band**, `#1E3E88` navy, 1440×**50 px**, full-bleed,
   containing the three funder logos centred in a 600 px flex wrapper (details in §3),
2. `.l-subheader.at_middle` — white, **100 px**, with the colourful FAIR wordmark (219×65)
   at the left, then 8 top-level items (Fondazione · Progetto PNRR PE13 · Progetti PON ·
   Bandi · News · Eventi · Contatti) each with a dropdown chevron — **53 links in one
   `<nav>`**, i.e. a fully expanded mega-menu — then a 25×17 **flag icon** for language and
   four social icons.

A 150 px fixed header on a 900 px viewport spends **17 % of the screen** on chrome before
any content. Two skip links exist and work (`Vai al Contenuto`, `Vai al Footer`).

At 390 the menu collapses to a hamburger (`.w-nav-control`, `aria-label="Menu"`,
`aria-expanded="false"`, 50×24 hit area — **below the 44×44 touch-target guideline**).

**Hero**: a Slider Revolution module, 1440×525, at y = 150. A stock photo of a clinician
with a holographic UI; a dark scrim; left-aligned layered text — eyebrow "PROGETTI PON"
(15 px, amber), title "Progetto SINTESI" (41 px, w800, white), subtitle (14 px, white),
then an orange pill CTA "Scopri il progetto" (13 px, ink on `#F79B26`, radius 14 px).
The hero advertises a *sub-project*, not the organisation: a visitor who lands here is not
told what FAIR is above the fold.

### 2.6 Semantics and accessibility

| Check | Result |
|---|---|
| `<h1>` on the home | **0** — IT and EN both. First heading is an `h2` |
| Heading order | h2 *L'Ecosistema di FAIR* → h2 *Ultime news* → h3 ×4 → h2 *Iscriviti alla newsletter* |
| `<time datetime>` | **4** (news card dates) — better than ELLIS's 0 |
| JSON-LD | **Place, Organization, WebSite, ImageObject, WebPage** — the only site in the batch with structured data |
| `hreflang` | **none**, although an `/en/` tree exists |
| Images on the home | 11 total, **10 with `alt=""`** — including the three funder logos and the ecosystem map |
| Language switch | a 25×17 flag image, `alt="Inglese"`, no text label |
| `:focus` / `:focus-visible` rules | 107 |
| Skip links | 2, working |

The zero-`h1` and the blanket `alt=""` are the two defects we must not copy. The second is
especially pointed given this batch's subject: **the funder logos, the one element the
funding body requires to be visible, are invisible to a screen reader** — a blind visitor is
never told that this project is funded by the European Union and the Ministry.

### 2.7 Italian / English — the most direct comparison we have

FAIR is bilingual; measured behaviour:

| Aspect | Measured |
|---|---|
| Default | Italian, `<html lang="it-IT">` |
| English tree | `/en/…` mirror, `<html lang="en-US">`, e.g. `/en/spoke/`, `/en/partners/` |
| Switcher | flag icon only (25×17 PNG), present on the IT side, pointing to the *corresponding* EN page — the deep link is correct, which is more than most WP multilingual setups manage |
| `hreflang` alternates | **absent** on both trees — search engines are not told the pages are translations |
| `<title>` | **not translated**: "Spoke - Fondazione FAIR" is identical in both trees |
| Body copy | genuinely translated, including news items and the footer |
| Images with baked-in text | **not translated** — the ecosystem map still reads "HUB Fondazione FAIR" / "Sede secondaria Fondazione FAIR" in Italian on the English page |
| Institutional vocabulary | untranslated by design on both sides: "Spoke", "Hub", "Bandi"/"Calls", "Amministrazione trasparente" |
| Page heights | IT home 3,098 px, EN home 3,098 px — a true mirror, not a reduced version |

**Verdict for us.** The structure (`/en/` mirror, per-page deep links, full translation of
body copy) is right and worth copying *if* we ever go bilingual. Three things are wrong and
cheap to avoid: no `hreflang`, untranslated `<title>`, and **text baked into images**.
`CLAUDE.md` says "English first"; the FAIR evidence says that the day an Italian version is
requested, the cost is not the copy, it is every SVG/PNG that has words in it. So: **never
put words inside our diagrams as raster**; keep them as live `<text>` in inline SVG, which
we are doing anyway for the animated concept graphics.

### 2.8 Interior pages — `/partner/` (chosen) and `/spoke/`

I chose **`/partner/`** as the main interior capture because it is the literal
logo-grid page — the direct reference for the question this batch was commissioned to
answer — and captured `/spoke/` as a secondary because it is the network-of-nodes page.

`/partner/` (`partner-desktop-1440.png`, `detail-partner-logo-grid-desktop-1440.png`):
1,838 px, one `h1` ("Partner"), an `h2` "I partner del progetto FAIR", then **25 logos in a
5 × 5 grid** — 182×182 tiles, `filter: grayscale(1)`, each wrapped in a link to the
partner's own site, each with `alt=""`. Sources include `cnr.it`, `bracco.com`,
`deloitte.com`, `expert.ai`, `fbk.eu`, `intesasanpaolo.com`, `iit.it`, `infn.it`,
`leonardo.com`, `lutech.group`, `polimi.it`, **`polito.it`**, `sissa.it`, `sns.it`,
`st.com`, and ten more universities. The page is white, generously spaced, and — apart
from the grayscale — completely unstyled. It works.

`/spoke/` (`spoke-desktop-1440.png`): 3,008 px, one `h1`, the ten spokes presented with
**numbered SVG badges `numero-fair-01.svg` … `-10.svg`, 100×100 each**, followed by title
and description, linking to `/spoke/spoke-N-<slug>/`. This is exactly the "themes 01–04"
device in our own IA, executed as ten images instead of live text (so, again, untranslated
and unreadable by assistive tech).

### 2.9 Tone of voice

Administrative Italian, long sentences, institutional nouns: "La Fondazione FAIR … è una
fondazione senza scopo di lucro che ha come scopo principale quello di realizzare gli
interventi finanziati nell'ambito del Piano Nazionale di Ripresa e Resilienza (PNRR)…".
The `/progetto/` page is 2,631 characters, `/la-fondazione/` 3,705, `/hub/` 2,318. The
sections that matter to a researcher (what is being studied, by whom, with what results)
are shorter than the sections that describe the governance. Calls to action are neutral
("Scopri il progetto", "Vai alla mappa", "Iscriviti"). News headlines, by contrast, are
good and concrete ("Roma ospita la General Conference di chiusura del progetto PNRR FAIR…").

---

## 3. Funding attribution and institutional logo strips

This is the section this batch was commissioned for. Everything here is measured.

### 3.1 Where the funders are, and how big

| | ELLIS | FAIR |
|---|---|---|
| Funder logos on the home | **none** | **three, at the very top of every page** |
| Location | — | `.l-subheader.at_top`, first element in the fixed header, above the logo and the nav |
| Band | — | full-bleed **1440 × 50 px**, background **`#1E3E88`** navy |
| Logos | — | `logo-eu3-300x120.png`, `logo-ministero3-300x120.png`, `logo-italia-domani3-300x120.png` |
| Rendered size | — | **200 × 80 px each**, `object-fit: cover`, centred in a 600 px flex wrapper (`justify-content: center`, `align-items: flex-start`) |
| Filter / opacity | — | **`filter: none`, `opacity: 1`** — untouched, full colour |
| Alt text | — | **`alt=""` on all three** |
| Links | — | **none** — the logos are not clickable |
| On interior pages | — | identical, on every page measured (`/spoke/`, `/partner/`, `/en/`) |
| In the footer | — | **absent** — only the FAIR wordmark |
| Sponsors/funders elsewhere | `/about/sponsorships-donations`: four sponsors as **664 px-wide editorial cards with real alt text** (G-Research, Max Planck IS, Baden-Württemberg Ministry, Kühborth-Stiftung), no filter | — |
| Partners elsewhere | `/about/partnerships`: partner logos as **427×240 editorial images with descriptive alt** ("EMBL logo with logo icon", "CIFAR logo", "RIKEN logo"), no filter, no grid | `/partner/`: **25 tiles 182×182, `filter: grayscale(1)`**, linked, `alt=""` |

The exact wording in the FAIR band, read from the artwork: **"Funded by the European Union
— NextGenerationEU"** (EU flag), **"Ministero dell'Università e della Ricerca"** (MUR
emblem), **"Italiadomani — Piano Nazionale di Ripresa e Resilienza"**.

### 3.2 The filter question, answered across three sites

The earlier note recorded that **Agentic Systems Lab** forces partner logos to white
silhouettes with `filter: brightness(0) invert(1)`. Measured here:

| Site | Logo class | Treatment |
|---|---|---|
| Agentic Systems Lab | partners | `filter: brightness(0) invert(1)` → flat white silhouettes on dark |
| FAIR | **funders** (EU, MUR, Italia Domani) | **`filter: none`** — full colour, on a navy band chosen to suit them |
| FAIR | **partners** (25 organisations) | **`filter: grayscale(1)`** — desaturated, on white |
| ELLIS | sponsors and partners | `filter: none`, but presented as **editorial images**, not as a strip |

The pattern is consistent and it is the answer to our question: **funder emblems are left
alone; partner logos are normalised.** The likely reason is that EU and PNRR visual-identity
rules prescribe the emblem's colours and proportions, so a `grayscale()` or `invert()` on
the EU flag would breach them, whereas partner logos are yours to harmonise
**(inference: I am reading intent from the CSS; I did not check the rulebooks).**
The second, purely visual, lesson: FAIR solved "these three logos clash with my page" not
by filtering them but by **giving them their own full-bleed band in a colour that suits
them** — navy, which is the EU emblem's own background. That is a design move we can copy
exactly.

### 3.3 What FAIR gets wrong with its strip, measured

1. **The band is 50 px tall and the logos are 80 px tall.** Measured `y` of all three
   images is **−15** at scroll 0, i.e. the image boxes start 15 px above the document. The
   artwork inside the PNGs is padded, so nothing important is visibly clipped, but the
   layout is nominally broken and one theme update away from cropping the EU flag.
2. **`object-fit: cover` on a logo.** Three 300×120 sources rendered into 200×80 boxes with
   `cover` means any source with a different aspect ratio gets **cropped**, not letterboxed.
   `contain` is the only correct value for a logo.
3. **`alt=""` on all three.** The mandatory attribution is invisible to assistive tech.
4. **Not linked.** A funder logo should link to the funder (or to our own funding page).
5. **Raster PNGs at 1× for line art.** These are wordmarks and an emblem: they should be SVG.
6. **The band is repeated in the fixed header on every page**, costing 50 px of every
   viewport forever, while the *information* about the funding (programme, project, code)
   appears nowhere near it.

### 3.4 Project codes and CUP — nobody publishes them

Searched the FAIR pages most likely to carry them (`/progetto/`, `/la-fondazione/`,
`/hub/`) with a regex for `CUP`, `PE000000…`, `Missione 4`, `codice`:

- The only identifier used anywhere is the **nav label "Progetto PNRR PE13"**.
- The **full project code is never printed**; the **CUP is never printed**; the grant
  decree number is never printed.
- The footer carries fiscal identity instead: legal name, *codice fiscale* 93098910503,
  registered office in Pisa, PEC address, DPO email, privacy and cookie policies.
- ELLIS's equivalent is `/about/imprint`: German *Impressum* data — registered association
  ELLIS Society e.V., Max-Planck-Ring 4 Tübingen, register number VR 724584, named legal
  representatives.

So neither reference site solves the "where do the code and the CUP go" problem; both solve
the *legal-identity* problem in a footer-adjacent page. That is a **gap in the evidence**,
stated plainly: our design for the code/CUP will not be copied from anyone here.

### 3.5 Recommendation for our MUR + PoliTo strip, and for the code and CUP

Concrete, and checked against `CLAUDE.md`'s tokens and rules.

**A. Do not put the funder strip in the header.** FAIR's 50 px permanent band costs 17 % of
the first screen and still fails to explain anything. Put ours **at the foot of every page,
directly above the legal line** — the position ELLIS uses for sponsors and the position a
reader reaches after the content has earned their attention.

**B. Give the strip its own full-bleed band, and pick the band colour to suit the logos,
not the other way round.** This is FAIR's one genuinely good move. On our dark default
(ink `#0F1420`), the MUR emblem and the PoliTo mark are dark-on-light artwork and will look
wrong. Two acceptable options, in order:
  1. a **paper `#F3EEE4` band** (our light surface) running full-bleed above the footer,
     with the logos in their native colours on it — one light band at the bottom of a dark
     page reads as a deliberate "institutional plinth", not as an accident;
  2. if a dark band is required, use **official monochrome/negative versions supplied by
     MUR and PoliTo**, never a CSS `filter`.

**C. Never apply `filter: grayscale()` / `brightness(0) invert(1)` to the MUR emblem or the
PoliTo crest.** Both sites in this batch left their mandated funder marks untouched; only
*partner* logos are normalised. If we later add industrial partners, `grayscale(1)` on a
white/paper tile is the established, safe treatment — and it also enforces our
"one accent per view" rule automatically, because the partners stop competing for colour.

**D. Geometry.** Use `object-fit: contain`, not `cover`. Give each logo a fixed **height**
box (not width) so marks of different proportions optically align — measured reference
points: FAIR uses 200×80 boxes for funders, 182×182 for partners; ELLIS uses 427×240 and
664 px editorial images. For us: a row of **three to four logos, each in a 56–64 px-tall
box, with ≥ 32 px of air between them**, centred, on a band with 48–64 px of vertical
padding (our own spacing scale, not ELLIS's 24/48 or FAIR's 24.3).

**E. Always SVG, always with real `alt`, always linked.** Every funder logo gets a
descriptive `alt` ("Ministero dell'Università e della Ricerca") and links to the funder.
This is where both reference sites fail, and where our WCAG-AA rule and "alt text on every
image" rule make us better at no cost.

**F. Put the words next to the logos, in mono.** Neither site does this, and it is the
single opportunity in this whole analysis. Underneath the logo row, one short block set in
**JetBrains Mono at 13–14 px** in the muted paper tone:

> Funded by the Italian Ministry of University and Research — Fondo Italiano per la Scienza
> (FIS 2) · Project **FIS-01152** · CUP **E53C25001820001** · 18/08/2026 – 17/08/2029

Mono is already in our type stack for exactly this kind of machine-readable string, and it
turns a compliance obligation into a piece of the "Time, made visible" identity — a data
line, not a disclaimer. Wrap the dates in `<time datetime="2026-08-18">` (neither reference
site uses `<time>` properly: ELLIS has none at all, FAIR has four).

**G. Give it a home page of its own.** A `/about` (or `/about#funding`) section that states
the programme, the code, the CUP, the host institution (DAUIN, Politecnico di Torino) and
the PI, so the footer strip can link to it. FAIR proves the failure mode: the logos are
everywhere and the facts are nowhere.

**H. One accent per view still holds.** The funder band is the only place in the design
where colours we do not control appear. Keeping it in the footer, on paper, once per page,
is what lets the rest of the page keep its single amber accent.

---

## 4. Representing a network — four patterns, measured

| Pattern | ELLIS | FAIR |
|---|---|---|
| Map | **inline SVG**, 960×540, 177 paths + 52 circles, coral pins, custom +/− zoom, in a white card | **static SVG image** of Italy, 614×734, `alt=""`, numbered coloured dots per region, wrapped in a single link to `/lecosistema-di-fair/` |
| Map is accessible? | the SVG is inline and the units are also listed as 44 links below it | **no** — one image, one link, `alt=""`, and its labels stay Italian on the English page |
| Node list | 44 unit cards, 262×136, 5-up, unpaginated | 10 spokes, each with a 100×100 numbered SVG badge |
| Node pages | yes — `/research/sites/unit-<city>`, fixed 7-section template | yes — `/spoke/spoke-N-<slug>/` |
| Partner display | editorial cards with descriptive alt | 5×5 grayscale logo grid |
| Counted summary | stat band: 44 / 1 / 2 / 19 / 150 | none on the home |
| Third-party map service | **none** — no Leaflet, Mapbox or Google iframe on either site | none |

The most transferable finding: **both sites drew their own map rather than embedding a tile
service.** No consent problem, no third-party origin, no attribution bar, and the map
inherits the palette. ELLIS's version is better in every respect (inline, zoomable,
duplicated as a link list); FAIR's is a picture.

For TA-LLM this matters less than it does for them — we are one project at one university,
not 47 sites — but the *technique* is directly reusable for the thing we do have to draw:
the relationship between four research themes, their supervisors and their co-supervisors.
An inline, animated SVG with live `<text>` is our equivalent of their map, and it is
already the batch-1 decision ("animated inline SVG for the concepts themselves").

---

## 5. ELLIS vs FAIR, head to head

| | ELLIS | FAIR |
|---|---|---|
| Page weight (home) | **1,426 KB / 21 req** | **5,245 KB / 65 req** |
| CSS | 243 KB, 582 rules | **1,096 KB, 13,618 rules** |
| Origins before consent | **2** | 9 |
| Fonts | 2 families, **self-hosted only** | 1 family in use, loaded from **4 sources** (2 CDN, 2 local) |
| `clamp()` in CSS | **0** | 1 (a theme internal) |
| `:root` custom properties | 1 | 233 (plugin dumps) |
| `h1` on home | 1 | **0** |
| `<time datetime>` | 0 | 4 |
| JSON-LD | none | Organization, WebSite, Place, WebPage, ImageObject |
| Horizontal overflow @1440 | none | **27 px** |
| Horizontal overflow @390 | none | none |
| Shadows | **none** | `0 5px 15px rgba(0,0,0,.15)` on 9 elements |
| Accent used as text on white | **yes → 2.86:1, fails** | **no → dark text on orange, 8.96:1** |
| Quiet grey | n/a (black body text) | `#7B8289` → 3.89:1, fails |
| Sticky header | **no** | yes, 150 px → 122 px |
| Motion | none at all | 2 preloader spinners that survive `reduce` |
| Funder attribution | **absent** | top of every page, full colour, `alt=""` |
| Languages | EN only | IT + EN mirror, no `hreflang` |
| Long lists | 224-page pager + 4 facets + search | none needed (10 spokes, 25 partners) |
| Mobile menu | full-screen overlay, excellent | hamburger, 50×24 hit area (under 44×44) |
| Home page height | 7,463 px (10,129 @390) | 3,098 px (3,776 @390) |

**The honest summary.** ELLIS is a *designed* site built on a light stack with one
significant accessibility failure (its own brand blue as link text) and a deliberate refusal
to animate. FAIR is a *WordPress theme* configured by an agency: it gets three things right
that matter to us — dark-text-on-orange contrast, real consent gating of analytics, JSON-LD
— and gets the fundamentals wrong (no `h1`, blanket `alt=""`, 5 MB, desktop overflow,
a dead HTTPS domain, text baked into images).

**The part of FAIR we must look at without flinching:** it is the closest thing to us on
the internet — Italian, MUR/PNRR, hub-and-spoke, PoliTo among the partners — and it is
**not a good website**. The fact that an €100M+ national partnership ships a 5 MB WordPress
page with zero `h1` is the strongest argument in this whole survey for our chosen
approach: a small static Astro site, hand-built, will beat it on every measurable axis
(weight, semantics, contrast, motion, privacy) with a fraction of the budget.

---

## 6. The third-party / consent series, completed

All five batches, home page, before any consent action:

| Site | Origins | Trackers before consent | Fonts |
|---|---|---|---|
| **ELLIS** | **2** | self-hosted Matomo, sets `_pk_*` cookies with **no banner** | self-hosted only |
| Ai2 | 2 | none | self-hosted only |
| sakana.ai | 3 | GA4, **no consent mechanism at all** | Google Fonts |
| **FAIR** | **9** | none (GTM/GA4/Hotjar wait for consent) | Google Fonts + cdnjs + 2 local copies |
| isomorphiclabs.com | 9 | gated by Cookiebot | mixed |
| DeepMind | 14 | DoubleClick + GA | — |
| Mila | 17 | GTM, DoubleClick, LinkedIn Ads, HubSpot ×6 | self-hosted |
| Vector | 21 | GTM, DoubleClick ×2, HubSpot ×8, Chatbase | Google Fonts |

Our target is unambiguous and now has two exemplars at the top of the table: **one origin
(ours), zero cookies, zero banner.** ELLIS shows that a real organisation can run on 2
origins; FAIR shows that even a well-intentioned consent setup leaks 7 third parties before
the visitor speaks. Self-hosted fonts and no analytics is the only configuration that needs
no banner at all — which is also the only configuration that keeps `CLAUDE.md`'s
"no cookies / no tracking without consent" literally true.

---

## 7. Takeaways for TA-LLM

Each item is checked against the design system in `CLAUDE.md` (ink `#0F1420` / paper
`#F3EEE4` / amber `#E6A23C`; display serif + sans + mono; "Time, made visible"; dark
default; one accent per view; WCAG AA) and against the decisions already taken (1 px grid
gap, publications as a per-year timeline, fluid type with `clamp()`, canvas hero + animated
inline SVG, Pages CMS, themes as native Astro pages, applications on an external form).

### Adopt

1. **Funder band at the foot, on paper, in its own full-bleed strip** — §3.5. FAIR's band
   idea, ELLIS's placement, neither site's filters. Compatible with dark default: one light
   plinth at the bottom of an ink page, `object-fit: contain`, 56–64 px logo height,
   ≥ 32 px air, real `alt`, real links, SVG only.
2. **The mono funding line** — programme, code `FIS-01152`, CUP `E53C25001820001`, duration
   — set in JetBrains Mono beneath the logos, with `<time datetime>` on the dates. Uses a
   family already in our stack, and it is the one thing no reference site thought to do.
3. **Draw our own diagram instead of embedding a service** — both sites hand-built their
   map; neither loads a tile provider. Confirms the batch-1 decision to build the theme
   relationships as inline animated SVG, and adds a privacy argument to the aesthetic one.
4. **ELLIS's stat band, reinterpreted.** Six numerals at 96 px / w700 against a colour band
   is the strongest single device on either site, and it costs nothing. Ours would be
   *4 themes · 3 goals · 3 years · 1 question* — in our display serif on ink with amber for
   one figure only, honouring one-accent-per-view. Do **not** copy their ratio of 96 → 48 px;
   use `clamp()`.
5. **ELLIS's mobile menu**: full-screen overlay, 1 px hairlines between items, chevrons for
   expandable groups, `→` for utility links, socials at the bottom. It is better than
   anything else in the five batches and maps directly onto our IA.
6. **ELLIS's node-page template** for our four theme pages: Mission · Participating
   Institutions · Research Agenda · People (directors, members, coordinators) · Links.
   Rename to: *What we are studying · Why it is hard · Approach · People · Publications ·
   Links*. Confirms "themes are native Astro pages".
7. **FAIR's one good colour decision**: the brand accent is a **fill with ink text on it**
   (8.96:1), never text on white. This is exactly the amber rule in `CLAUDE.md` — treat
   FAIR as the positive proof and ELLIS (2.86:1) as the negative one.
8. **Print the count.** ELLIS never says how many members it has; we should always state
   "N publications", "N events" next to a list. Cheap, honest, and it makes a small corpus
   look curated instead of empty.
9. **`<time datetime>` on every date and JSON-LD on the site.** FAIR has both (4 `<time>`,
   5 JSON-LD types); ELLIS has neither. For a publications-and-events site, this is the
   half of FAIR worth keeping.
10. **Grayscale, if we ever show industrial partners** — `filter: grayscale(1)` on white
    tiles, 5-up, as FAIR does at `/partner/`. It normalises other people's colours and
    protects one-accent-per-view. **Never** on MUR or PoliTo.

### Avoid

1. **Accent as body/link text.** ELLIS blue at 2.86:1 on white, on *every* link and CTA, is
   the clearest demonstration yet of why `CLAUDE.md` defines darkened text variants
   (`#8A5A10`, `#356B58`, `#6A55A8`, `#2F6DA3`). Never ship amber `#E6A23C` as text on paper.
2. **Breakpoint type instead of fluid type.** ELLIS's h2 at 20 px on a phone (down from
   36 px) stops reading as a heading; FAIR's 39 → 33 px is gentler but still stepped. Zero
   and one `clamp()` in 243 KB and 1,096 KB of CSS respectively — our fluid scale remains
   the right call and is now measured against two more sites.
3. **A tall fixed header.** FAIR spends 150 px (17 % of a 900 px viewport) on chrome, half
   of it on a logo band. ELLIS's answer — no sticky header at all — is too austere for a
   7,400 px page; ours should be a slim sticky bar (~64 px) with the funder band at the
   bottom of the page.
4. **`alt=""` on meaningful images**, above all on funder logos. Our rule already says
   "alt text on every image"; this batch shows what the alternative looks like.
5. **Zero `<h1>`.** FAIR ships a home page with no `h1` in both languages. Our hero `h1`
   ("Large Language Models: a matter of time?") is the page.
6. **Text baked into images.** FAIR's Italian map labels survive into the English site, and
   its ten spoke numbers are ten PNG/SVG images instead of text. Keep numerals `01–04` as
   live text styled in mono, and keep all diagram labels as `<text>` in inline SVG.
7. **Plugin-generated token dumps.** 233 `:root` properties, two grey ramps, neither used.
   Our token set should stay small enough to read in one screen.
8. **Preloader spinners and any motion that ignores `prefers-reduced-motion`.** The only
   animation FAIR actually runs is the one that violates the rule it declares. Our canvas
   hero must check `matchMedia('(prefers-reduced-motion: reduce)')` at start **and** on
   change, and the SVG concept animations must expose a static first frame.
9. **Shadows for depth.** FAIR floats cards on `0 5px 15px rgba(0,0,0,.15)`; ELLIS uses
   none at all and reads better. Confirms the 1 px-gap ruled-table decision.
10. **An HTTPS hostname that does not resolve.** §0. Check both apex and `www` after the
    `CNAME` switch, before announcing the URL anywhere.

### What differentiates us

- **Dark by default with a single amber accent**, where ELLIS runs five accents in
  rotation and FAIR runs a theme's defaults. One accent per view is now the measurable
  difference between our pages and both of theirs.
- **Display serif + sans + mono**, where both reference sites use exactly one voice
  (ELLIS: Roboto Slab everywhere; FAIR: Plus Jakarta Sans everywhere). Our mono is what
  makes the funding line, the publication years and the theme numerals feel like data.
- **Motion as subject matter.** ELLIS has no motion; FAIR has an accidental spinner.
  Nobody in this category animates *time*, which is our entire concept.
- **Weight.** A static Astro build should land an order of magnitude below FAIR's 5.2 MB
  and comfortably under ELLIS's 1.4 MB.
- **Privacy.** One origin, no cookies, no banner — better than both.

### Still open

- **Where exactly the funder band sits relative to the footer nav** (above it, inside it, or
  as a separate strip below it) — needs a visual test once the footer exists.
- **Which official artwork MUR and Politecnico di Torino supply** (positive/negative/mono
  SVG, minimum sizes, clear-space rules). Neither reference site tells us; this must come
  from the institutions' own brand kits before the strip is built.
- **Whether the CUP belongs on every page or only on `/about`.** FAIR publishes neither, so
  there is no precedent to copy; my recommendation (footer line on every page + a fuller
  `/about` section) is a judgement, not an observation.
- **Whether we will need an Italian version at all.** If yes, §2.7 says: `/it/` mirror with
  per-page deep links, `hreflang` on both trees, translated `<title>`, and zero words inside
  images.
- **ELLIS's members-list per-page count** was measured on page 1 only (11–12 rows); the
  implied total (~2,690) is arithmetic, not an observation.
- **FAIR's hero carousel interval** — no auto-advance was observed in 12 s; I did not wait
  longer.

---

## 8. Screenshot index

> These screenshots are **kept locally only and are not committed**: `research/moodboard/`
> is git-ignored (`.gitignore:15 research/moodboard/*`) because it holds third-party
> material captured for private design study. They can be shared on request.
> Paths are relative to the repository root.

### ELLIS — `research/moodboard/ellis/`

| File | What it shows |
|---|---|
| `home-desktop-1440.png` | Full home page, 1440×7,463 (overwrote the interrupted earlier attempt) |
| `home-mobile-390.png` | Full home page, 390×10,129 |
| `hero-desktop-1440.png` | Hero region: colour bar, utility strip, nav, h1, hatched Europe, wordmark |
| `hero-phase-1/2/3-desktop-1440.png` | Three captures 1.4 s apart — **byte-identical** (md5 `293a2e22…`), the evidence that the hero is static |
| `detail-header-desktop-1440.png` | Header detail: 12 px five-colour bar + utility strip + main nav |
| `detail-numbers-band-desktop-1440.png` | "ELLIS by the Numbers" band: 96 px numerals on `#6A9BDD` |
| `sites-desktop-1440.png` | Full `/research/sites` page, the chosen interior page |
| `detail-map-desktop-1440.png` | "Find a Site": inline SVG map, coral pins, +/− zoom, in a white card |
| `detail-site-cards-desktop-1440.png` | The 44 unit cards, 262×136, 5-up |
| `members-list-desktop-1440.png` | `/members/members-list`: facets, search, 224-page pager |
| `partnerships-desktop-1440.png` | `/about/partnerships`: partner logos as editorial cards with real alt text |
| `nav-open-mobile-390.png` | Mobile menu open — the best mobile nav in the survey |
| `detail-funding-desktop-1440.png` | *False positive from the automatic funding probe; ELLIS has no funder strip. Kept only as a record that the probe ran.* |

*Removed:* `home-hero-desktop-1440.png` from the interrupted earlier attempt, superseded by
`hero-desktop-1440.png`.

### Fondazione FAIR — `research/moodboard/future-ai-research/`

| File | What it shows |
|---|---|
| `home-desktop-1440.png` | Full home page (IT), 1440×3,098 |
| `home-mobile-390.png` | Full home page, 390×3,776 |
| `hero-desktop-1440.png` | Hero region: Slider Revolution, photo, eyebrow/title/subtitle/CTA layers |
| `hero-phase-1/2/3-desktop-1440.png` | Three captures 1.4 s apart — **byte-identical** (md5 `5f95084a…`): the carousel did not advance |
| **`detail-header-logos-desktop-1440.png`** | **The reference image for this batch**: the navy `#1E3E88` 1440×50 funder band with EU / MUR / Italiadomani at 200×80, above the white 100 px nav row |
| `detail-funding-strip-desktop-1440.png` | Element-level capture of the same funder area |
| `detail-header-scrolled-1440.png` | The header after scrolling (150 px → 122 px) |
| `cookie-banner-desktop-1440.png` | iubenda consent card, 960×230, with `Rifiuta` and `Accetta e continua` at equal weight |
| `home-after-consent-viewport-1440.png` | Same viewport after accepting |
| `detail-ecosystem-map-desktop-1440.png` | The static SVG map of Italy with numbered regional dots |
| `detail-newsletter-desktop-1440.png` | The newsletter band: white text on an indigo→purple background image over a cream section |
| `partner-desktop-1440.png` | Full `/partner/` page, the chosen interior page |
| **`detail-partner-logo-grid-desktop-1440.png`** | The 5×5 grid of `filter: grayscale(1)` partner tiles, 182×182 — including Politecnico di Torino |
| `spoke-desktop-1440.png` | Full `/spoke/` page: ten spokes with 100×100 numbered SVG badges |
| `en-home-desktop-1440.png` | Full `/en/` home page — same funder band, Italian labels surviving inside the map image |
| `nav-open-mobile-390.png` | Mobile menu open |

### Not captured

- ELLIS `/research/jobs`, `/news`, `/events` details (only measured through the home page
  modules).
- FAIR individual spoke pages (`/spoke/spoke-1-human-centered-ai/` etc.) — measured only as
  link targets.
- Any page behind the ELLIS Intranet (external Google Sites) or the FAIR *Bandi* documents.
- FAIR's hero carousel beyond 12 s.
