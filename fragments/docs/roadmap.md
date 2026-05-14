# Fragments — Roadmap

## Project Context
12-week build-in-public project. The journey itself is the content — documenting what AI coding assistants can and can't do for non-developers who want to own their corner of the internet.

**Live at:** bryanrea.com/fragments  
**Started:** November 2025

---

## Status by Week

| Week | Focus | Status |
|------|-------|--------|
| 1 | Foundation, Flask setup, Render hosting | ✅ Done |
| 2 | Migrated to Digital Ocean VPS, Nginx, Gunicorn, systemd, SSL | ✅ Done |
| 3 | Post listing, metadata, basic navigation | ✅ Done |
| 4 | Styling, design, mobile responsiveness | ✅ Done |
| 5 | SEO: dynamic sitemap, robots.txt at site root, Search Console | ✅ Done |
| 6 | Build automation, deployment workflow | 🔄 In progress |
| 7 | Search functionality | ⬜ Not started |
| 8 | Content & mid-project reflection | ⬜ Not started |
| 9 | Code highlighting, rich content | ⬜ Not started |
| 10 | Comments or webmentions | ⬜ Not started |
| 11 | Performance & polish | ⬜ Not started |
| 12 | Documentation & launch | ⬜ Not started |

---

## Immediate Backlog (do before Week 7)

These were identified but not yet built. Prioritized in order:

1. **About page** — explains the Fragments project, the 12-week plan, who Bryan is
2. **Navigation menu** — header links: Home | About | bryanrea.com
3. **Tag system** — tags already in frontmatter, need to render + make clickable
4. **Reading time estimate** — "5 min read" on listing and post pages
5. **Previous/Next post navigation** — bottom of each post

*(Detailed context lives in `docs/`; the project root `.cursorrules` file indexes those files for Cursor — that split is in place.)*

---

## Later Weeks

- **Admin interface** — web-based post editor (deferred until core blog is stable)
- **Search** — client-side search with generated index
- **RSS feed** — standard Atom/RSS
- **Privacy-focused analytics** — understand traffic without heavy tracking
- **Performance** — caching, compression, image optimization
- **Accessibility audit**

---

## Key Decisions Made

- **Render → Digital Ocean:** Render's free tier couldn't proxy `/fragments/*` paths. Migrated to VPS for full control. Better learning value, actually cheaper ($6/mo vs $14/mo).
- **No database:** Flat-file keeps it simple and understandable. Revisit if/when content volume demands it.
- **Separate repos:** Static portfolio and Flask blog live in separate GitHub repos. More deployment complexity but cleaner separation of concerns.
- **Pure CSS:** No frameworks. Easier to understand, easier to explain in blog posts.
