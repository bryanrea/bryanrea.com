# design.md

The design system for **bryanrea.com** — covering both the static portfolio
(`index.html`, `about/`, `experience/`, `archive/`) and the **Fragments** blog
(`fragments/`). The two sites are visually one: they share a single token file,
link styles, navigation, and animated background so a visitor moving between
them never feels a seam.

The `experiments/` sandbox builds on the same foundations, with looser rules
inside each experiment (§11).

This document is the source of truth for the *look*. For app structure and
routing see `fragments/docs/architecture.md`; for code style see
`fragments/docs/conventions.md`.

---

## 1. Where the design lives

| File | Scope | Owns |
|------|-------|------|
| `shared/css/shared.css` | **Both sites** | Design tokens + type scale, `html` root sizing, shared `body` base (font, color, background, leading, smoothing), global link styles, fixed nav, **hero name block**, animated background |
| `reset.css` | Portfolio only | Modern box-sizing / margin reset (Andy-Bell-style). The portfolio's `style.css` relies on it for `box-sizing` and does **not** redeclare it |
| `style.css` (root) | Portfolio only | Home stacked cards, page-hero, content prose, experience/résumé layout |
| `js/stacked-cards.js` | Home only | Scales and dims covered home cards on scroll (§8) |
| `fragments/static/css/style.css` | Blog only | Blog reset/base, post list, post body, tags, footer, 404, + the hero's outer spacing & tagline offset |
| `shared/js/main.js` | **Both sites** | Blob animation randomizing, nav scroll/title behavior |
| `experiments/experiments.css` | `experiments/` only | Layout shared by experiment pages; each experiment's own CSS lives in its folder (see §11) |
| `archive/css/*` | Legacy `archive/` only | Self-contained old design — **not** part of this system (see §10) |

**Golden rule:** anything visual that appears on *both* sites lives in
`shared/`. Site-specific layout lives in that site's own `style.css`. Never
duplicate a token or a nav rule into a site-specific file.

---

## 2. Design tokens

All defined as CSS custom properties on `:root` in `shared/css/shared.css`.
Always reference the variable — never hardcode a hex value, font size, spacing
step, or layout dimension.

### Color

| Token | Value | Role |
|-------|-------|------|
| `--color-bg` | `#FCF8EE` | Warm cream page background |
| `--color-ink` | `#1F1B16` | Warm near-black — headings, nav links |
| `--color-ink-soft` | `#2A2620` | Body text |
| `--color-muted` | `#7A7068` | Secondary text — dates, meta, captions |
| `--color-muted-light` | `#B8A89A` | Dividers, hint labels, the 404 numeral |
| `--color-rule` | `rgba(237, 229, 213, 0.5)` | Hairline rules & borders (cream at half opacity, softens over the gradient) |
| `--color-accent` | `#E63946` | Crimson — links on hover, `h2` on portfolio, drop cap, accents |
| `--color-accent-soft` | `rgba(230, 57, 70, 0.4)` | Default underline color, soft borders |
| `--color-surface-soft` | `#F6F0E1` | Slightly darker cream for hovers, code backgrounds, soft home cards, the home news callout |
| `--color-surface-glass` | `rgba(252, 248, 238, 0.85)` | Frosted surface — the nav bar; always paired with `--glass-blur` (`saturate(160%) blur(8px)`) |

The palette is **warm, paper-like, single-accent**. Crimson is the only
saturated color and is used sparingly — it should always read as emphasis.

### Type families

| Token | Stack | Use |
|-------|-------|-----|
| `--font-serif` | `"Fraunces", Georgia, "Times New Roman", serif` | All display type & headings |
| `--font-sans` | `"DM Sans", -apple-system, BlinkMacSystemFont, …` | Body, nav, meta, labels, taglines |

Loaded from Google Fonts in every page `<head>`:
- **Fraunces** — variable, `opsz 9..144`, `wght 400..700`. The experience page
  also loads the *italic* axis (`ital`) for its right-rail section labels.
- **DM Sans** — variable, `opsz 9..40`, `wght 400..600`, with the *italic* axis
  (`ital`) for emphasized body text.

### Type scale

A single set of font-size steps shared by both sites, defined in
`shared/css/shared.css`. **Reference these tokens — don't hardcode rem values.**
Base is `html { font-size: 17px }` (16px ≤768px), so `1rem ≈ 17px`. This scale
replaced ~30 ad-hoc sizes; collapsing nine near-identical label sizes to three
and four body sizes to two.

| Token | Value | Role |
|-------|-------|------|
| `--text-2xs` | `0.65rem` | Micro pills — tags, résumé pill button |
| `--text-xs` | `0.78rem` | Uppercase meta labels — nav links, dates, reading time, tag count, résumé meta |
| `--text-sm` | `0.85rem` | Small text — footer, back-links, figcaptions |
| `--text-base` | `1.05rem` | Body copy |
| `--text-md` | `1.1rem` | Emphasized body — taglines, blockquotes |
| `--text-lg` | `1.4rem` | `h3`, nav brand mark |
| `--text-xl` | `2rem` | `h2`, résumé entry titles |
| `--text-2xl` | `2.5rem` | Listing & post-preview titles, tag-page pill |
| `--text-3xl` | `3.75rem` | Blog post `h1` |
| `--text-4xl` | `4.5rem` | Post-detail title |
| `--text-5xl` | `5rem` | Sub-page hero (About / Experience) |
| `--text-6xl` | `6rem` | 404 numeral, home intro & latest-post headlines (`.display--xxl`) |
| `--text-hero` | `8rem` | The big name on Home & Fragments |

**Documented off-scale exceptions** (intentionally not tokenized):
- **Drop cap** `7.6rem` — computed from line-height math, not a scale step.
- **Inline `code`** `0.92em` — relative to surrounding text by design.
- **Mobile nav links** `0.72rem` — deliberately tighter than `--text-xs` so four
  links fit the narrow bar.
- **`.display--xxl`** `clamp(--text-3xl, 7.1vw, --text-6xl)` — fluid on
  desktop so mid widths (900–1280px, two columns) don't wrap to 5–6 lines;
  full `--text-6xl` from ~1440px.
- **Mobile `.display--xxl`** `clamp(--text-2xl, 12vw, --text-4xl)` — fluid
  between two scale steps so tablet-ish widths get a big headline, not the
  phone size. The `12vw` slope is the off-scale part.
- **Mobile listing titles** `1.85rem` — a bespoke responsive override that doesn't
  land on a scale step. (Every other mobile heading steps down a token in the
  `.display` mobile block in `shared.css`.)

> Weight, letter-spacing, line-height, and text-transform are **not** tokenized —
> only size. They're set per component (see §7).

### Spacing

One set of margin, padding, and gap steps shared by both sites, defined in
`shared/css/shared.css`. **Reference these tokens — don't hardcode rem values.**
Same base as the type scale (`1rem ≈ 17px`, 16px ≤768px). Near-duplicate
values (e.g. `0.4` / `0.5` / `0.55rem`, `0.75` / `0.85` / `0.9rem`) were snapped
to the nearest step when the scale was introduced.

| Token | Value | Typical use |
|-------|-------|-------------|
| `--space-1` | `0.25rem` | Post-nav label → title |
| `--space-2` | `0.5rem` | Tag-list gap, list items, heading → body, résumé title → meta |
| `--space-3` | `0.75rem` | Prose `h2` bottom, meta row bottom, figcaption, prev/next card padding |
| `--space-4` | `1rem` | Paragraph bottom (résumé), tag-list top, nav gaps |
| `--space-5` | `1.25rem` | Paragraph bottom (prose & portfolio), blockquote indent |
| `--space-6` | `1.5rem` | List indent, `pre` bottom, prev/next grid gap |
| `--space-7` | `2rem` | Post-preview padding, blockquote / image / figure margins |
| `--space-8` | `2.5rem` | Prose `h2`/`h3` top, header bottoms, résumé entry separation |
| `--space-9` | `3rem` | Section separation, post-content bottom |
| `--space-10` | `3.5rem` | Résumé section padding & rail gap |
| `--space-11` | `4rem` | Blog `main` bottom, footer top, 404 padding |
| `--space-12` | `6rem` | Portfolio page bottom padding |

**Documented literal exceptions** (intentionally not tokenized — optical tweaks):
- **`.pill` padding** `0.26rem 0.5rem 0.14rem` and **`.tag-pill` padding**
  `0.35em 0.8em 0.29em` — extra top padding re-centers uppercase glyphs.
- **Drop cap margins** `0.05rem 0.55rem 0 0` (float fallback) and `0 0.5rem 0 0`
  (`initial-letter`) — fitted to the cap.
- **Inline `code` padding** `0.15rem 0.4rem` — hugs the inline glyphs.
- **Hero tagline** `margin-top: -0.4em` and its `left` offsets (`36%` home,
  `46%` Fragments) — tuned to each name's descender.
- **`.post-meta`** `gap: 0.6em` and the reading-time dot's `margin-right: 0.6em`
  — em-relative to the label type.
- Background blob positions, and `0` / `auto` values.

### Layout

| Token | Value | Role |
|-------|-------|------|
| `--nav-height` | `56px` | Fixed nav height; blog `body` uses it as top padding |
| `--nav-padding` | `32px` | Nav side padding |
| `--nav-padding-mobile` | `16px` | Nav side padding ≤768px |
| `--gutter` | `20px` | Page side padding (portfolio heroes & mains, blog `body`) |
| `--hero-offset` | `6rem` | Home `header.hero` top padding |
| `--hero-offset-mobile` | `5.5rem` | Same, ≤768px |
| `--page-hero-offset` | `7rem` | Sub-page `header.page-hero` top padding |
| `--page-hero-offset-mobile` | `5rem` | Same, ≤768px |
| `--measure-portfolio` | `36rem` | Home / About column (`main.content`) |
| `--measure-blog` | `680px` | Fragments column (`.container`, `.post-full`) |
| `--measure-experience` | `50rem` | Résumé column (`main.experience`) |
| `--rail-width` | `8rem` | Résumé section-label rail (`.resume-section` grid) |
| `--measure-home` | `80rem` | Home card column (`main.home`) |
| `--measure-display` | `60rem` | Long display headlines and their body rows on home cards |
| `--tap-target` | `44px` | Min height for standalone links/buttons (home CTAs) |
| `--card-height` | `46rem` | Home card height (capped to the viewport on short screens) |
| `--card-stack-offset` | `24px` | First card's sticky `top`, below the nav |
| `--card-stack-step` | `16px` | Each later card sticks one step lower |
| `--icon-size` | `24px` | Lucide icons (`.icon`) — their native grid |

> `--hero-offset` / `--hero-offset-mobile` are currently unused: the home page
> dropped its name hero for the stacked cards. Kept in case it comes back.

### Radii

| Token | Value | Role |
|-------|-------|------|
| `--radius-card` | `42px` | Home cards (squircle; ~1.5× the old round 28px for similar softness) |

The older `8px` (pills, skip link) and `6px` (images, `pre`, prev/next cards)
radii are still literals; tokenize them in their own pass.

---

## 3. Global foundations (shared.css)

### Root sizing — the one responsive lever

```css
html { font-size: 17px; }
@media (max-width: 768px) { html { font-size: 16px; } }
```

The entire type system is **rem-based**, so this single breakpoint reflows both
sites at once. `768px` is the one shared breakpoint across the whole project —
there is no tablet/desktop ladder.

### Links

Global `a` styling: inherits color, underlined with `--color-accent-soft`,
`text-underline-offset: 0.2em`, `skip-ink: auto`. On hover the text and
underline both go to full `--color-accent`. Transitions are `0.15s ease`.

Structural/nav links opt out by setting `text-decoration: none` and supplying
their own hover (typically ink → accent).

### Motion vocabulary

- **Micro-interactions** (links, nav, buttons, tags): `0.15s ease` on `color`
  and `border-color`.
- **Nav title fly-in**: `250ms cubic-bezier(0.2, 0.8, 0.2, 1)` on opacity +
  transform.
- **Background blobs**: 64s / 82s `ease-in-out infinite` drifts.
- Respect `prefers-reduced-motion: reduce` — it pauses the blob animations.

### Component utilities

Both sites compose their repeated patterns from three utility families in
`shared.css`, applied via class in markup. One source per recipe; size and color
via modifiers; per-context structural bits (margins, grid placement, bespoke
chrome) stay on the site classes.

- **`.display`** — the serif heading recipe (Fraunces, `opsz 144`, weight 600,
  ink, balanced wrap). Size via a modifier: `--hero` (`--text-hero`), `--xxl`
  (`--text-6xl`, home headlines), `--xl`
  (`--text-4xl`), `--lg` (`--text-2xl`), `--md` (`--text-xl`), `--sm`
  (`--text-lg`); `--accent` recolors to crimson. Mobile sizes are token-driven
  in one `@media` block. Used by the hero name, sub-page heroes, post titles,
  listing titles, the nav brand, and the 404.
- **`.label`** — uppercase meta (DM Sans, `--text-xs`, weight 500, `0.1em`
  tracking, muted); `--accent` recolors. Used by post dates, reading time, tag
  counts, the post-nav labels.
- **`.pill`** — small bordered uppercase chip (`--text-2xs`, `0.07em`, `8px`
  radius, hover to accent); `--accent` is the always-crimson variant. Used by
  blog tags and the résumé download button. The tag-page heading composes
  `.pill` with a bespoke `.tag-pill` shim for its larger, rounder display scale.
- **`.icon`** — an inline [Lucide](https://lucide.dev) SVG (ISC), pasted from
  the site with `class="icon"`, sized `--icon-size`, stroked in
  `currentColor`. Inline SVG rather than the Lucide web font, so a page only
  carries the icons it uses. Mark it (or its wrapper) `aria-hidden="true"`
  when it's decorative.
  `.icon--inline` sizes it to `1em` to sit in a line of text (e.g. the map pin
  before "Based in Zurich" on home).

**Deliberately off-system** (do *not* take `.display`): the experience
right-rail section labels (`main.experience h2` — small italic serif, `opsz 9`),
the drop cap (`::first-letter`, math tied to `.post-content` line-height), and
Markdown-rendered prose headings (`.post-content h1/h2/h3` — can't take classes,
so they carry the recipe scoped to `.post-content`).

---

## 4. The fixed navigation

A `position: fixed` top bar, `--nav-height` tall, present on every page of both
sites with identical markup.

- **Surface:** frosted glass — `--color-surface-glass` (translucent cream) with
  `backdrop-filter: var(--glass-blur)` (`saturate(160%) blur(8px)`). Bottom border is transparent
  until scrolled.
- **Layout:** a 3-column grid `1fr auto 1fr` — `HOME / ABOUT` left,
  `EXPERIENCE / FRAGMENTS` right, centered brand title between.
- **Nav links:** DM Sans, `0.78rem`, weight 500, uppercase, `letter-spacing
  0.14em`. Ink by default, crimson on hover.
- **Brand title** (`.nav-title`, "Bryan Rea"): Fraunces `1.4rem` (`--text-lg`), hidden by
  default (`opacity: 0`, nudged up 8px). It flies in once the hero scrolls
  past — see §6.
- **Scrolled state:** `.nav-scrolled` adds the hairline bottom border once the
  page scrolls past 8px.

**Responsive (≤768px):** padding tightens to `--nav-padding-mobile`, link gap
shrinks to `--space-4`, font to `0.72rem`; the centered brand title is hidden
entirely.

> Cross-site note: in the blog's `base.html` the nav links point at absolute
> `https://bryanrea.com/...` URLs (the blog is a separate Flask app behind
> `/fragments`); on the static portfolio they're root-relative.

---

## 5. The animated background

Fixed behind all content (`z-index: -1`) on every page. Identical markup:

```html
<div class="background">
  <div class="circle circle-1"></div>
  <div class="circle circle-2"></div>
  <div class="noise"></div>
</div>
```

- **Two gradient blobs**, `80vmin`, `blur(20vmin)`, `opacity 0.55`:
  - `.circle-1` — warm peach → crimson, drifts on a 64s loop.
  - `.circle-2` — soft amber → terracotta, drifts on an 82s loop.
  - Different durations and waypoints keep them from ever syncing.
- **Contained variant** — `.background.background--contained` drops the same
  markup inside a positioned, `overflow: hidden` box (the home intro and
  contact cards) instead of fixing it to the viewport. Each use positions its
  own circles.
- **`main.js` randomizes each blob's `animation-delay`** on load so the page
  never opens on the same frame twice.
- **`.noise`** — a tiled `img/noise.png` at `opacity 0.25`,
  `mix-blend-mode: overlay`, adding paper grain over the gradient.

This warm, slowly-moving gradient is the signature of the brand. Keep content
surfaces transparent so it shows through.

---

## 6. The hero pattern (and the nav handoff)

> The portfolio home no longer has a name hero — it opens on the stacked cards
> (§8), so the nav title shows immediately there. The `.hero-name` block is
> currently used by Fragments only; the description below covers both in case
> home brings it back.

Both site homepages use the **same oversized name hero** — defined once as the
`.hero-name` block in `shared.css` so the two stay in lockstep — and it drives
the nav. Each site adds only its own `header.hero` outer spacing and the
tagline's `left` offset.

- `.hero-name h1` — Fraunces, **`--text-hero` (8rem)**, weight 600,
  `line-height 0.9`, `letter-spacing -0.04em`, ink. On the blog the name is
  wrapped in an `<a>` (links home); the portfolio's isn't, so the shared
  `.hero-name h1 a` rule is simply inert there.
- `.hero-name .tagline` — DM Sans `--text-md` (1.1rem), muted, absolutely
  positioned just under-right of the name, clearing the descender (the `y` in
  "Bryan", the `g` in "Fragments" — hence the blog tagline's `left: 46%`
  override vs the portfolio's `left: 35%`, the one per-site difference).
- **≤768px:** name drops to `--text-5xl` (5rem), tagline to `--text-sm`
  (0.85rem) — a shared mobile rule in `shared.css`, applied to both.

**The handoff (`main.js`):** an `IntersectionObserver` watches the hero `h1`.
While it's in view the centered nav title stays hidden; once it scrolls out, JS
toggles `.nav-title-visible` and the small "Bryan Rea" mark flies in — so the
brand is always visible, either big in the hero or small in the bar. **Pages
with no hero** (blog post pages, blog tag pages, portfolio sub-pages) get
`.nav-title-visible` + `.nav-scrolled` added immediately on load.

Portfolio sub-pages (`about`, `experience`) instead use `header.page-hero` — a
centered Fraunces `h1` at `5rem` (`4rem` on mobile), no tagline.

---

## 7. Component catalog

The reusable, cross-cutting UI elements — collected here with their variants and
states. (Sections 4–6 cover nav, background, and hero, which are also
components; this section covers the rest.) The surface sections (§8–§9) describe
*where* these get composed.

> **Note — there are no form components.** The portfolio and blog contain no
> `<button>`, `<input>`, `<form>`, `<select>`, or `<textarea>`. Every "button" is
> a styled `<a>`. Experiments (§11) use native buttons and range inputs, styled
> locally; those aren't part of this catalog. If the portfolio or blog ever adds
> a real form/button, define its base + `:hover`/`:focus`/`:active`/disabled
> states here first.

### 7.1 Links — five variants

| Variant | Selector | Look | Hover |
|---------|----------|------|-------|
| **Prose link** (default) | global `a` | Inherits color; underline in `--color-accent-soft`, `0.2em` offset | Text + underline → `--color-accent` |
| **Nav link** | `.nav-group a` | DM Sans `0.78rem`, uppercase, `0.14em` tracking, ink, no underline | → `--color-accent` |
| **Brand title** | `.nav-title` | Fraunces `1.4rem` (`--text-lg`), ink, hidden until scroll | → `--color-accent` |
| **Read-more / back-link** | `.read-more`, `.back-link` | Inline; read-more carries a trailing `→`, back-link a leading `←`; back-link is muted | accent |
| **Footer link** | `footer a` | Muted, no underline | → `--color-accent` |

All transition `color` / `text-decoration-color` at `0.15s ease`. Structural
links (nav, cards, headings) set `text-decoration: none` and supply their own
hover; only prose links keep the underline.

### 7.2 Pill / button

The single button-like control. Pattern: small uppercase DM Sans, crimson text, a
`--color-accent-soft` (or `--color-rule`) border, `8px` radius, with extra **top
padding** to optically center the uppercase glyphs. Hover darkens the border to
full crimson.

- `.resume-footer a` — "Download resume" (the canonical button).
- `.tag` shares the same shape at a smaller size (see below).

### 7.3 Tags

| Variant | Selector | Use | Look |
|---------|----------|-----|------|
| **Tag** | `.tag` | Inline tag chips on previews & post headers | `--text-2xs` (0.65rem) uppercase muted pill, `--color-rule` border, `8px` radius |
| **Tag heading** | `.tag-pill` | The H1 of a tag page | Large `2.5rem` crimson pill, translucent cream fill + `blur(3px)`, `24px` radius |

Tag hover: text → crimson, border → `--color-accent-soft`. Rendered in lists via
the `tag_list()` macro in `_macros.html`.

### 7.4 Cards

| Variant | Selector | Box? | Hover |
|---------|----------|------|-------|
| **Post preview** | `.post-preview` | No box — hairline `--color-rule` bottom separator only | Title goes crimson |
| **Prev/next nav card** | `.post-nav-item a` | Bordered (`--color-rule`, `6px` radius) | Border → crimson, fill → `--color-surface-soft` |

Prev/next cards are the only true bordered, filled-on-hover surface in the
system; everything else separates with hairlines, not boxes.

### 7.5 Meta row

`.post-meta` — a flex row of `.post-date` + `.post-reading-time`, both DM Sans
`--text-xs` (0.78rem), uppercase, `0.1em` tracking, muted. The reading time is preceded by a
`·` separator. Left-aligned on listing cards; centered in the post header.

### 7.6 Prose / content elements (blog `.post-content`)

Markdown renders into these — they're styled once and reused across all posts:

- **Drop cap** — first letter of the first paragraph, Fraunces crimson, 3 lines
  tall (`initial-letter: 3`, with a `7.6rem` float fallback).
- **Blockquote** — `3px` crimson left border, Fraunces, muted.
- **Inline `code` / `pre`** — `--color-surface-soft` fill, monospace; `pre` adds
  a `--color-rule` border + `6px` radius.
- **Images** — block, centered, rounded `6px`, `--color-rule` border; wrap in
  `<figure>` for a centered italic muted `<figcaption>`.
- **Lists** — `--space-6` indent, `--space-2` between items.

---

## 8. Portfolio surfaces (root `style.css`)

**Body:** DM Sans, `line-height 1.7`, `--color-ink-soft` on `--color-bg`,
antialiased.

### Home — stacked cards (`main.home`)
- Four live `section.card`s (intro, "More coming", latest post, contact; the
  work, case-study and philosophy markup is parked in inert `<template>`s;
  their CSS was removed — restore it from git history with the markup)
  in a `--measure-home` column, `--space-12` apart. Each
  has squircle corners (`corner-shape: squircle` on `--radius-card`;
  plain round where unsupported) and is `position: sticky` at `--nav-height + --card-stack-offset +
  --card-stack-step × index` (index set by `:nth-child`), `--card-height` tall
  (capped to the viewport), `--radius-card`, clipped.
- Variants: default (cream, `--color-rule` border), `.card--soft`
  (`--color-surface-soft`), `.card--dark` (ink surface, cream type), `.card--center` (one centered
  message — the "More coming" placeholder). The intro and contact cards hold a
  contained background (§5).
- **`js/stacked-cards.js`** sums how far each later card has travelled to its
  sticky top and scales (`-0.05`) and dims (`brightness -0.05`) the covered
  card per card on top, from the top edge. Off under `prefers-reduced-motion`.
- **Peek:** a card's height is the screen below its sticky top less
  `--card-gap` and `--card-peek` (both `--space-9`; set on `main.home`), so the
  next card always shows a sliver below the current one. `main.home`'s bottom
  padding equals gap + peek, so the page ends where the last card lands (it
  can't stick, being last in its container, and extra padding would scroll it
  under the nav).
- **≤768px:** the same sticky deck, `--card-gap: --space-4`, no 46rem cap,
  `--space-7` padding. The intro slims down (third-width portrait, `--space-6`
  gaps, `--text-base` copy) and goes to one column, packed to the bottom.
- **Too-tall cards** (any width): `stacked-cards.js` gives a card taller than
  the room below its sticky top a negative `top`, so it scrolls until its
  bottom sits gap + peek above the viewport edge and sticks there — nothing is cut
  off on short screens (e.g. the intro at 1280×800 or 375×667).
- **News callout** (`.callout`) — no box: an icon tile and one line of news
  at the top of the intro card, on the same content edge as the headline;
  the icon centers vertically on the text, however many lines it wraps to. The icon is a bare crimson
  Lucide party popper (`.callout-icon`, no tile). It
  holds the time-bound announcement so the card's headline and body stay
  evergreen; drop it when the news is old.
- **Cycling verb** (`.verb-cycle`, `js/verb-cycle.js`) — the intro headline
  ends "help people connect / create / learn / … / thrive" in crimson
  (upright, not italic): the words share one grid cell (sized to the longest, so nothing re-wraps) and each fades and
  lifts out with a soft blur as the next rises in, once, resting on "thrive",
  which then gets a hand-drawn crimson underline (inline SVG, drawn on with
  `stroke-dashoffset`; static when there's no JS or reduced motion).
  Screen readers get a `.visually-hidden` static "thrive"; reduced motion and
  no-JS just show it. `.visually-hidden` lives in `shared.css`.
- **Portrait** (`.portrait`) — the headshot (`img/headshot.webp`) beside the
  intro headline in a `5fr / 3fr` grid, clipped to an organic blob (literal
  `border-radius` percentages) that slowly morphs on a 24s loop
  (`portrait-morph`; off under `prefers-reduced-motion`). Its white photo backdrop is
  `mix-blend-mode: multiply`'d onto a `--color-surface-soft` fill inside an
  isolated shape, so it reads as cream, not a white box. ≤768px it moves above
  the headline at a third of the width.

### About content (`main.content`)
- Centered column, `max-width: var(--measure-portfolio)`.
- `h2` — Fraunces `2.5rem`, **crimson**, `text-wrap: balance`. (The crimson
  `h2` is a portfolio-only signature; the blog's `h2` is ink.)
- `p` — `1.1rem`, ink-soft. Sections separated by `--space-9`.

### Experience / résumé (`main.experience`)
- Wider column, `max-width: var(--measure-experience)`, left-aligned.
- **Two-column grid** `var(--rail-width) 1fr` with a `--space-10` gap per `.resume-section`,
  separated by `--color-rule` top borders. The left column is the section label.
- `main.experience h2` (section label) — Fraunces **italic**, `1.05rem`,
  `opsz 9`, muted, right-aligned in its rail.
- `.resume-entry h3` — Fraunces `2rem`, ink. `.resume-meta` — DM Sans `0.78rem`,
  muted, for dates/locations.
- `.resume-results` — two-column list of metrics, crimson, each prefixed with a
  faded `→`.
- `.resume-papers` — stacked citations, ink-soft.
- `.resume-footer a` ("Download resume") — the **pill button** pattern: tiny
  uppercase DM Sans, crimson text, `--color-accent-soft` border, `8px` radius,
  border darkens to full crimson on hover.
- **≤768px:** the grid collapses to one column; section labels go left-aligned;
  entry `h3` drops to `1.5rem`.

---

## 9. Fragments blog surfaces (`fragments/static/css/style.css`)

**Body:** DM Sans, `line-height 1.7`, top padding `--nav-height` (clears the fixed
nav). Content lives in `.container` (`max-width: var(--measure-blog)`, centered).

### Headings
- `h1` `3.75rem` / `h2` `2rem` / `h3` `1.4rem`, all Fraunces, weight 600, ink.
  Note: blog headings are **ink**, not crimson (the portfolio's content `h2` is
  the exception).

### Home hero
Mirrors the portfolio hero exactly — "Fragments" at `8rem` with the tagline
*"Building with AI, in public"* tucked under-right. The name is a link to the
blog index. (Comments in the CSS explain how the `--space-8` top padding + body's
`--nav-height` approximate home's `--hero-offset`.)

### Post listing (`.post-preview`)
- Stacked, separated by `--color-rule` bottom borders.
- Title `h2` `2.5rem`, ink, crimson on hover.
- `.post-meta` — date + reading time, DM Sans `--text-xs` (0.78rem), uppercase,
  `letter-spacing 0.1em`, muted; reading time separated by a `·`.
- `.post-excerpt` `1.05rem`; `.read-more` "Read more →"; tags below.

### Post page (`.post-full`, `.post-header`)
- **Centered header**: `h1` at `4.5rem` (`text-wrap: balance`), centered meta
  row, centered tags. Post pages omit the site hero — the article is the focus.
- A `← All posts` back-link sits above the article.
- `.post-content` — `1.05rem`, `line-height 1.75`:
  - **Drop cap** on the first paragraph's first letter — Fraunces, crimson,
    spanning 3 lines via `initial-letter: 3` (with a `font-size: 7.6rem` float
    fallback for browsers without `initial-letter` support).
  - `blockquote` — `3px` crimson left border, Fraunces, muted.
  - `code` / `pre` — `--color-surface-soft` background, monospace stack, rounded;
    `pre` adds a `--color-rule` border.
  - `img` — block, centered, rounded `6px`, `--color-rule` border, `--space-7`
    margins. `figure` + `figcaption` (centered, italic, muted) for captions.
- **Prev/next nav** (`.post-nav`) — two bordered cards in a `1fr 1fr` grid
  (stacks on mobile); crimson uppercase label + Fraunces title; hover darkens
  border to crimson with a soft-surface fill.

### Tags
- `.tag` — small uppercase DM Sans pill, muted, `--color-rule` border, `8px`
  radius; crimson + soft border on hover. (Extra top padding re-centers the
  uppercase glyphs in the box — a recurring trick for all uppercase pills.)
- Tag page header — `.tag-pill`, a large (`2.5rem`) translucent blurred pill in
  crimson, with a `.tag-count` beneath.

### Footer & 404
- **Footer** (blog only) — top `--color-rule` border, centered, muted DM Sans
  `0.85rem`: *"Built with AI • View Source • RSS"*. The portfolio has no footer.
- **404** — giant `6rem` muted-light "404", an ink `h2`, a muted line, and a
  `← Go home` back-link.

---

## 10. The archive (`archive/`) — out of scope

`archive/` is a legacy "old work" page with its own self-contained
`normalize.css` + `main.css` and a separate visual language. It is **not** part
of this design system and intentionally does not share the tokens, nav, or
background. Leave it alone unless explicitly redesigning it.

---

## 11. Experiments (`experiments/`)

A sandbox of small prototypes built to try ideas out, at `/experiments/`. Unlike
the archive, experiments sit **on** the design system: every page loads
`reset.css`, `shared.css`, and `shared/js/main.js`, and uses the standard fixed
nav, animated background, and `.display` / `.label` recipes. Page layout shared
across experiments lives in `experiments/experiments.css`.

Inside an experiment the rules loosen. Native form controls, canvas drawing,
extra colors for diagrams, and one-off layout are all fine, as long as they're
scoped to that experiment's folder and never added to `shared/`. The motion
studies, for example, define `--study-teal` / `--study-gold` diagram inks on
`.motion-grid` rather than as site tokens.

Experiments stay low-profile: not linked from the nav, left out of the sitemap,
`noindex, nofollow`, no analytics. Their CSS links aren't cache-busted. See
`experiments/README.md` for structure and how to add one.

---

## 12. Conventions & gotchas

- **Pure CSS, no frameworks** — by project rule. No utility classes, no
  preprocessor.
- **Reference tokens, never literals.** New hex value, font size, spacing value,
  or layout dimension → add/use a `:root` token in `shared.css`. Font sizes come
  from the **type scale** (`--text-*`, §2) — don't introduce a new ad-hoc rem
  value; pick the nearest step or, if a genuinely new size is warranted, add a
  scale token. The only allowed off-scale sizes are the documented exceptions in
  §2 (drop cap, inline `code`, mobile nav, bespoke mobile heading overrides).
- **Spacing comes from `--space-*`** (§2). Every margin, padding, and gap uses a
  spacing step; gutters, nav padding, hero offsets, measures, and the résumé
  rail use the layout tokens. Snap a new value to the nearest step rather than
  inventing one. The only literals allowed are the documented optical exceptions
  in §2 (pill / tag-pill padding, drop-cap margins, inline `code` padding, the
  hero tagline tuck and offsets, the `.post-meta` em gaps, blob positions) plus
  `0` / `auto` — each carries a "kept literal on purpose" comment in the CSS.
- **One breakpoint: `768px`.** Lean on rem-based sizing + the `html` font-size
  step before reaching for a new media query.
- **Crimson is precious.** It's the only saturated color — use it for emphasis,
  hover, and a few signature accents (portfolio `h2`, drop cap, tag pill), not
  as decoration.
- **Uppercase pills need top padding.** Uppercase glyphs ride high in the line
  box; `.tag`, `.tag-pill`, and `.resume-footer a` add extra top padding to
  re-center them.
- **Hero ↔ nav title are a pair.** If you change the hero `h1` selector,
  re-check the `IntersectionObserver` target in `shared/js/main.js`.
- **Cache busting differs by site.** The blog auto-appends `?v={{ cache_bust }}`
  (git short hash, via a context processor). The static portfolio hardcodes the
  hash in `index.html`, `about/index.html`, `experience/index.html` (currently
  `?v=f3f1417`) — **update all three by hand** when shipping shared CSS/JS
  changes that affect the portfolio. See `CLAUDE.md` § Cache busting.
- **Fonts are loaded per-page** in each `<head>` (Fraunces + DM Sans); the
  experience page additionally loads Fraunces italic.
- **Analytics:** Fathom (`data-site="VBYEXRMM"`) is included on every page
  except experiments.
