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
| 9 | RSS feed, auto-deploy via GitHub Actions, archive modernization | ✅ Done |
| 10 | Reading time, tags, image support | ✅ Done |
| 11 | Search, rich content (code highlighting) | 🔶 In progress — code highlighting done, search deferred |
| 12 | Comments/webmentions, performance & polish | ⬜ Not started |

---

## Current Backlog

1. **Search** — client-side search with generated index (defer until post count grows)
2. **Admin interface** — web-based post editor (deferred until core blog is stable)
3. **Accessibility audit**
4. **Performance** — ~~caching~~ (done), compression, image optimization
   - Caching: posts are parsed and rendered once into an in-process cache invalidated by file mtime (`_posts_cache` / `_posts_signature()` in `app.py`). See `docs/architecture.md`.
   - Compression: gzip belongs in the Nginx config in production (it fronts both sites), not the Flask app — no Python dependency needed.
   - Image optimization: cheap wins are `loading="lazy"`/`decoding="async"` on post images and pre-sizing source files; not yet done.

> **Done:** reading time estimate, the tag system, and image support (Week 10); code highlighting (Week 11) — a warm Pygments theme for the already-enabled `codehilite` extension lives in `fragments/static/css/style.css`; post caching (Week 12) — `get_posts()` builds once and caches until `posts/` changes. See the weekly progress log and `docs/conventions.md` for the image workflow.

---

## Key Decisions Made

- **Render → Digital Ocean:** Render's free tier couldn't proxy `/fragments/*` paths. Migrated to VPS for full control. Better learning value, cheaper ($6/mo vs $14/mo).
- **No database:** Flat-file keeps it simple and understandable. Revisit if/when content volume demands it.
- **Monorepo:** Static portfolio (`bryanrea.com`) and Flask blog (`fragments`) consolidated into a single GitHub repo (`bryanrea.com`). Shared CSS, JS, and assets now live in `shared/` and are referenced by both sites — one edit ripples everywhere.
- **Pure CSS:** No frameworks. Easier to understand, easier to explain in blog posts.
- **Shared design system:** Design tokens, nav styles, background animation, and link styles extracted into `shared/css/shared.css` and `shared/js/main.js`. Both sites now look and feel like one cohesive thing.
- **Auto-deploy:** GitHub Actions workflow at `.github/workflows/deploy.yml` SSHes into the DO server on every push to `main`, runs `git pull` and `systemctl restart fragments-blog`. Manual SSH is now the fallback, not the default.
- **RSS over Atom:** Feed served at `/fragments/feed.xml` is RSS 2.0 (not Atom) since "RSS" is the universally recognized name. Includes both `<description>` (excerpt) and `<content:encoded>` (full HTML) so readers can show either summary or full text. Auto-discovery `<link>` in `base.html` so feed readers find it from any page.
- **Images:** Stored in `fragments/static/images/` (blueprint serves them at `/fragments/static/images/<file>`) and referenced from markdown with a normal `![alt](…)`. No app.py change was needed — python-markdown already renders images and the blueprint already serves `static/`. The work was purely CSS (responsive, centered, rounded) plus a documented convention. Captions use a raw `<figure>`/`<figcaption>` block written directly in the markdown (python-markdown passes raw HTML through), keeping the common case a one-line markdown image while still allowing captions without a new extension. See `docs/conventions.md`.
- **Dynamic tag pages:** Tags live in post frontmatter. The `/fragments/tag/<tag>` route filters posts at request time, so adding a tag to a post automatically creates its tag page — no code change, no per-tag setup. A page 404s if no post carries that tag. No standalone "all tags" index page; tags are discovered from posts. Reading time is computed the same way — derived at request time, never stored.
