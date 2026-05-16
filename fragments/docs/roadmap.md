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
| 10 | Reading time, tags, image support | 🟡 In progress |
| 11 | Search, rich content (code highlighting) | ⬜ Not started |
| 12 | Comments/webmentions, performance & polish | ⬜ Not started |

---

## Current Backlog

1. **Image support in posts** — confirm workflow for adding images to markdown posts and how they get sized/styled
2. **Search** — client-side search with generated index (defer until post count grows)
3. **Code highlighting** — Pygments via the existing `codehilite` markdown extension; needs a stylesheet
4. **Admin interface** — web-based post editor (deferred until core blog is stable)
5. **Accessibility audit**
6. **Performance** — caching, compression, image optimization

> **Done:** reading time estimate and the tag system (Week 10) — see the weekly progress log.

---

## Key Decisions Made

- **Render → Digital Ocean:** Render's free tier couldn't proxy `/fragments/*` paths. Migrated to VPS for full control. Better learning value, cheaper ($6/mo vs $14/mo).
- **No database:** Flat-file keeps it simple and understandable. Revisit if/when content volume demands it.
- **Monorepo:** Static portfolio (`bryanrea.com`) and Flask blog (`fragments`) consolidated into a single GitHub repo (`bryanrea.com`). Shared CSS, JS, and assets now live in `shared/` and are referenced by both sites — one edit ripples everywhere.
- **Pure CSS:** No frameworks. Easier to understand, easier to explain in blog posts.
- **Shared design system:** Design tokens, nav styles, background animation, and link styles extracted into `shared/css/shared.css` and `shared/js/main.js`. Both sites now look and feel like one cohesive thing.
- **Auto-deploy:** GitHub Actions workflow at `.github/workflows/deploy.yml` SSHes into the DO server on every push to `main`, runs `git pull` and `systemctl restart fragments-blog`. Manual SSH is now the fallback, not the default.
- **RSS over Atom:** Feed served at `/fragments/feed.xml` is RSS 2.0 (not Atom) since "RSS" is the universally recognized name. Includes both `<description>` (excerpt) and `<content:encoded>` (full HTML) so readers can show either summary or full text. Auto-discovery `<link>` in `base.html` so feed readers find it from any page.
- **Dynamic tag pages:** Tags live in post frontmatter. The `/fragments/tag/<tag>` route filters posts at request time, so adding a tag to a post automatically creates its tag page — no code change, no per-tag setup. A page 404s if no post carries that tag. No standalone "all tags" index page; tags are discovered from posts. Reading time is computed the same way — derived at request time, never stored.
