# Fragments — Roadmap

## Project Context
Build-in-public project documenting what AI coding assistants can and can't do for non-developers who want to own their corner of the internet.

**Live at:** bryanrea.com/fragments  
**Started:** November 2025

> The original plan was 12 weeks. It's now May 2026 — about 26 weeks in. The project is alive and actively improving, just not on the original timeline. That's fine. The spirit of the project is the learning, not the schedule.

---

## Status by Week

| Week | Focus | Status |
|------|-------|--------|
| 1 | Foundation, Flask setup, Render hosting | ✅ Done |
| 2 | Migrated to Digital Ocean VPS, Nginx, Gunicorn, systemd, SSL | ✅ Done |
| 3 | Post listing, metadata, basic navigation | ✅ Done |
| 4 | Styling, design, mobile responsiveness | ✅ Done |
| 5 | SEO: dynamic sitemap, robots.txt, Search Console | ✅ Done |
| 6 | Redesign: warm palette, Fraunces/Inter fonts, nav scroll reveal | ✅ Done |
| 7 | Previous/Next post navigation, Fathom Analytics | ✅ Done |
| 8 | Monorepo consolidation, shared design system, visual unification | ✅ Done |
| 9 | Search functionality | ⬜ Not started |
| 10 | Rich content (code highlighting, images) | ⬜ Not started |
| 11 | Comments or webmentions | ⬜ Not started |
| 12 | RSS feed, performance & polish | ⬜ Not started |

---

## Current Backlog

1. **Tag system** — tags already in frontmatter, need to render + make clickable
2. **Reading time estimate** — "5 min read" on listing and post pages
3. **RSS feed** — standard Atom/RSS
4. **Search** — client-side search with generated index
5. **Admin interface** — web-based post editor (deferred until core blog is stable)
6. **Accessibility audit**
7. **Performance** — caching, compression, image optimization

---

## Key Decisions Made

- **Render → Digital Ocean:** Render's free tier couldn't proxy `/fragments/*` paths. Migrated to VPS for full control. Better learning value, cheaper ($6/mo vs $14/mo).
- **No database:** Flat-file keeps it simple and understandable. Revisit if/when content volume demands it.
- **Monorepo:** Static portfolio (`bryanrea.com`) and Flask blog (`fragments`) consolidated into a single GitHub repo (`bryanrea.com`). Shared CSS, JS, and assets now live in `shared/` and are referenced by both sites — one edit ripples everywhere.
- **Pure CSS:** No frameworks. Easier to understand, easier to explain in blog posts.
- **Shared design system:** Design tokens, nav styles, background animation, and link styles extracted into `shared/css/shared.css` and `shared/js/main.js`. Both sites now look and feel like one cohesive thing.
