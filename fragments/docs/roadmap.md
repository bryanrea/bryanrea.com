# Fragments — Roadmap

## Project Context
Build-in-public project documenting what AI coding assistants can and can't do for non-developers who want to own their corner of the internet.

**Live at:** bryanrea.com/fragments  
**Started:** November 2025

> The original plan was 12 weeks. It has long since outgrown that. The project is alive and actively improving, just not on the original timeline. That's fine. The spirit of the project is the learning, not the schedule.

---

## Status by Week

| Week | Focus | Status |
|------|-------|--------|
| 1 | Foundation, Flask setup, Render hosting | ✅ Done |
| 2 | Migrated to Digital Ocean VPS, Nginx, Gunicorn, systemd, SSL | ✅ Done |
| 3 | Post listing, metadata, basic navigation | ✅ Done |
| 4 | Styling, design, mobile responsiveness | ✅ Done |
| 5 | SEO: dynamic sitemap, robots.txt, Search Console | ✅ Done |
| 6 | Redesign: warm palette, Fraunces/DM Sans fonts, nav scroll reveal | ✅ Done |
| 7 | Previous/Next post navigation, Fathom Analytics | ✅ Done |
| 8 | Monorepo consolidation, shared design system, visual unification | ✅ Done |
| 9 | RSS feed, auto-deploy via GitHub Actions, archive modernization | ✅ Done |
| 10 | Reading time, tags, image support | ✅ Done |
| 11 | Search, rich content (code highlighting) | 🔶 In progress — code highlighting done, search deferred |
| 12 | Comments/webmentions, performance & polish | 🔶 In progress — accessibility audit and social/SEO metadata done, comments/webmentions not started |

---

## Current Backlog

1. **Search** — client-side search with generated index (defer until post count grows)
2. **Admin interface** — web-based post editor (deferred until core blog is stable)
3. **Comments / webmentions** — the last unstarted Week 12 item. No decision yet on approach.
4. **Share card (`og:image`)** — the social metadata layer ships without one, so links preview as text-only cards. Plan (September 2026): a small illustration per article, composed with the post's title and excerpt into that post's share image — so it waits on the illustrations, which come first. The wiring is small: an `og:image` block in `base.html` that `post.html` overrides, plus flipping `twitter:card` to `summary_large_image`. A generated site-wide card was tried and pulled; the image is a design call.
5. **Performance** — ~~caching~~ (done), ~~compression~~ (done), ~~image optimization~~ (done)
   - Caching: posts are parsed and rendered once into an in-process cache invalidated by file mtime (`_posts_cache` / `_posts_signature()` in `app.py`). See `docs/architecture.md`.
   - Compression: gzip enabled in Nginx via `/etc/nginx/conf.d/gzip.conf` (July 2026) — covers CSS, JS, XML/RSS, JSON, SVG on both sites. See `docs/deployment.md`.
   - Image optimization (September 2026): every `<img>` in a rendered post gets `loading="lazy"` and `decoding="async"` (`_add_image_loading_hints()` in `app.py`), including images in raw `<figure>` blocks. Local images also get their real `width`/`height` read from the file (via `imagesize`), so the page reserves their space and doesn't jump as they load, and a `?v=<content hash>` on the src. Any static file requested with `?v=` — post images and the blog stylesheet — is served with a one-year `immutable` cache header (`cache_versioned_static()`), so repeat visits don't re-check them; replacing an image changes its hash, so readers still get the new one. Pre-sizing is a documented export convention in `docs/conventions.md`.

### Deferred to a look-and-feel pass

Palette contrast came out of the accessibility audit and is deliberately **not** in the numbered backlog — it's a design call, not a mechanical fix, and it belongs with a broader refinement of the look and feel rather than bolted onto functional work. The measurements, so they don't have to be redone:

- Small-size accent crimson (résumé stats, prev/next labels, download pill, tags): `#E63946` on cream is **3.93:1**; AA wants 4.5:1 for small text. Large display text and borders are exempt.
- The 404 numeral (`--color-muted-light`, `#B8A89A`): **2.17:1**.
- Candidates measured against `#FCF8EE`: `#D62828` → 4.72:1, `#C1121F` → 5.87:1, `#A4161A` → 7.31:1.

### Portfolio home — still to build

The stacked-card home page shipped in October 2026 (PR #38) with four live cards: intro, a "More coming, stay tuned!" placeholder, latest post, and contact. Three cards from the prototype are parked in inert `<template>`s in `index.html` with their copy intact; their CSS was removed and lives in git history (commit `f3f1417`, `style.css` §02–04). Restoring one means moving its markup back above the last card and bringing its CSS back.

1. **Work overview** — "Products used by billions." Replaces the "More coming" placeholder (card 2; switch it back to `card--soft`, drop `card--center`). Products and roles, newest first:

   | Product | Role |
   |---------|------|
   | GetYourGuide | Design Director |
   | YouTube Studio | Head of UX |
   | G Suite Assistant | Senior UX Lead |
   | Gmail + Inbox | UX Lead |
   | Play Music | UX Designer |
   | Android | UX Designer |
   | Shopping.com | Interaction Designer |

   - Needs real app icons in `shared/img/apps/` (one per product; the tiles are placeholder initials today).
   - Reconcile the GetYourGuide title: the live intro callout says **UX Director**, this card says **Design Director**.
2. **YouTube Studio case study** — dark card: "From a dumping ground of features to a creative partner." Stats: **100M+** creators served, **2x** mobile usage, **+20%** weekly active channels, **+10%** first-time uploaders. Its "Read the case study →" button links to `/youtube-studio`, **which doesn't exist yet** — the case study page itself needs writing and building before this card goes live.
3. **How I lead** — philosophy card: "Know where you're going, why it matters, and repeat it until everyone else does too." Four principles: Clarity and conviction · Guardrails, not gates · Care deeply · Design as a differentiator (each with a one-line description in the parked markup).

Also: the latest-post card is hand-written — update its label, title, link and excerpt when a new post ships.

---

> **Done:** reading time estimate, the tag system, and image support (Week 10); code highlighting (Week 11) — a warm Pygments theme for the already-enabled `codehilite` extension lives in `fragments/static/css/style.css`; post caching (Week 12) — `get_posts()` builds once and caches until `posts/` changes; accessibility audit (Week 12, July 2026) — skip links, focus-visible ring, nav focus-trap fix, screen-reader semantics, and code-theme contrast across both sites (PR #19); social & SEO metadata (Week 12, August 2026) — canonical URLs, Open Graph and Twitter cards, `BlogPosting` structured data, tag pages in the sitemap. See the weekly progress log and `docs/conventions.md` for the image workflow.

---

## Key Decisions Made

- **Render → Digital Ocean:** Render's free tier couldn't proxy `/fragments/*` paths. Migrated to VPS for full control. Better learning value, cheaper ($6/mo vs $14/mo).
- **No database:** Flat-file keeps it simple and understandable. Revisit if/when content volume demands it.
- **Monorepo:** Static portfolio (`bryanrea.com`) and Flask blog (`fragments`) consolidated into a single GitHub repo (`bryanrea.com`). Shared CSS, JS, and assets now live in `shared/` and are referenced by both sites — one edit ripples everywhere.
- **Pure CSS:** No frameworks. Easier to understand, easier to explain in blog posts.
- **Shared design system:** Design tokens, nav styles, background animation, and link styles extracted into `shared/css/shared.css` and `shared/js/main.js`. Both sites now look and feel like one cohesive thing.
- **Auto-deploy:** GitHub Actions workflow at `.github/workflows/deploy.yml` SSHes into the DO server on every push to `main`, runs `git pull`, syncs Python deps with `pip install`, and restarts `fragments-blog`. Manual SSH is now the fallback, not the default.
- **RSS over Atom:** Feed served at `/fragments/feed.xml` is RSS 2.0 (not Atom) since "RSS" is the universally recognized name. Includes both `<description>` (excerpt) and `<content:encoded>` (full HTML) so readers can show either summary or full text. Auto-discovery `<link>` in `base.html` so feed readers find it from any page.
- **Images:** Stored in `fragments/static/images/` (blueprint serves them at `/fragments/static/images/<file>`) and referenced from markdown with a normal `![alt](…)`. No app.py change was needed — python-markdown already renders images and the blueprint already serves `static/`. The work was purely CSS (responsive, centered, rounded) plus a documented convention. Captions use a raw `<figure>`/`<figcaption>` block written directly in the markdown (python-markdown passes raw HTML through), keeping the common case a one-line markdown image while still allowing captions without a new extension. See `docs/conventions.md`.
- **Metadata via template blocks:** Social and canonical tags live in `base.html` and pull their title and description from the existing `{% block title %}` / `{% block meta_description %}` through `{{ self.title() }}`, so a page still sets each string in exactly one place. A child template overrides `canonical_url`, and `og_type` when it isn't a plain page. Replayed blocks are piped through `striptags` — a block's literal template text isn't autoescaped, so the quotes in `Posts tagged "ai"` would otherwise close the `content` attribute early. `SITE_URL` in `app.py` is the single origin behind canonical links, social tags, the feed, and the sitemap; `absolute_url()` strips trailing slashes so the index doesn't advertise both `/fragments` and `/fragments/`.
- **JSON-LD as a dict, not a string:** Structured data is written as a Jinja dict piped through `|tojson` rather than hand-written JSON. An apostrophe or ampersand in a post title would otherwise break the block — and a broken block fails silently, which is the worst kind of failure for something only crawlers read.
- **Dynamic tag pages:** Tags live in post frontmatter. The `/fragments/tag/<tag>` route filters posts at request time, so adding a tag to a post automatically creates its tag page — no code change, no per-tag setup. A page 404s if no post carries that tag. No standalone "all tags" index page; tags are discovered from posts. Reading time is likewise derived rather than stored — computed from the word count when the post cache is built.
