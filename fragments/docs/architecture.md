# Fragments — Architecture

## Overview
A lightweight flat-file Flask blog. No database — posts are markdown files with YAML frontmatter. Lives in the `fragments/` folder of the [bryanrea.com](https://github.com/bryanrea/bryanrea.com) monorepo alongside the static portfolio site and a shared design system in `../shared/`.

Deployed at `bryanrea.com/fragments`.

## Tech Stack
- **Framework:** Flask 3.1.0 with Blueprint routing
- **Language:** Python 3.9.6
- **Templating:** Jinja2
- **Content:** Markdown with YAML frontmatter (python-frontmatter)
- **Markdown rendering:** `markdown` library with `fenced_code`, `codehilite`, `tables` extensions
- **Styling:** Pure CSS — no frameworks. Design tokens, nav, link styles, and the animated background live in `../shared/css/shared.css`; blog-specific styles in `static/css/style.css`.
- **WSGI:** Gunicorn
- **Web server:** Nginx (reverse proxy + SSL termination)
- **Process management:** systemd (`fragments-blog.service`)
- **SSL:** Let's Encrypt via Certbot

## File Structure

The Fragments app is one piece of the larger monorepo:

```
bryanrea.com/                  ← monorepo root, also the Nginx web root
├── shared/                    ← shared assets (both sites reference these)
│   ├── css/shared.css         # Design tokens, nav, link styles, background
│   ├── js/main.js             # Background blob randomizer, nav scroll behavior
│   └── img/noise.png          # Noise texture for the gradient overlay
├── index.html, about/, ...    ← static portfolio site
└── fragments/                 ← this Flask app
    ├── app.py                 # Flask init, Blueprint registration, all routes
    ├── requirements.txt
    ├── posts/                 # Flat-file content store
    │   └── YYYY-MM-DD-slug.md
    ├── templates/
    │   ├── base.html          # Base layout (loads /shared/css/shared.css + /shared/js/main.js)
    │   ├── _macros.html       # Reusable fragments: post preview card, tag list
    │   ├── index.html         # Post listing
    │   ├── post.html          # Individual post
    │   ├── tag.html           # Posts filtered by a single tag
    │   └── 404.html
    ├── static/
    │   └── css/style.css      # Blog-specific styles only
    └── docs/                  # Context files (this folder)
```

## Request Flow
```
Browser → Nginx (SSL) → either:
                        ├── /fragments/* → Gunicorn → Flask → Blueprint → Template
                        ├── /sitemap.xml → Gunicorn → Flask
                        └── /shared/*, /, /about, etc. → Nginx static files
```

Nginx routes:
- `/fragments/*` → proxied to Flask/Gunicorn on `127.0.0.1:8000`
- `/sitemap.xml` → proxied to Flask (generated dynamically)
- everything else → static files served directly from `/var/www/bryanrea.com/` (portfolio HTML, `shared/` assets, etc.)

## Routing
All blog routes live under the `fragments_bp` Blueprint with `url_prefix='/fragments'`:
- `GET /fragments/` — homepage, lists all posts
- `GET /fragments/post/<slug>` — individual post (with prev/next neighbors)
- `GET /fragments/tag/<tag>` — all posts carrying a given tag (404 if none match)
- `GET /fragments/feed.xml` — RSS 2.0 feed of all posts

Three routes live on the bare Flask app (outside the Blueprint):
- `GET /sitemap.xml` — dynamically generated XML sitemap (includes portfolio URLs, blog URLs, and the feed URL)
- `GET /` — redirects to `/fragments/` (only fires in local dev; in production Nginx serves the portfolio at `/`)
- `GET /shared/<path:filename>` — serves shared assets in local dev only. In production, Nginx serves `/shared/*` directly and this route is never hit.

## Post Loading
`get_posts()` in `app.py` scans `posts/` on every request:
1. Lists all `.md` files
2. Parses YAML frontmatter via `python-frontmatter`
3. Extracts slug from filename (strips `YYYY-MM-DD-` prefix)
4. Returns list sorted by date descending

`get_post(slug)` does the same for a single file, then converts the markdown body → HTML.

`get_post_neighbors(slug)` returns the previous (older) and next (newer) posts for prev/next navigation.

**Note:** No caching — filesystem read on every request. Fine at current scale.

## Frontmatter Schema
```yaml
---
title: Post Title
date: 2026-04-27
excerpt: Short description shown on listing page
tags: [tag1, tag2]
---
```

`get_posts()` and `get_post()` both copy `tags` into the post dict (defaulting to an empty list). Tags render as clickable pills on the listing and post pages; each links to its `/fragments/tag/<tag>` page.

## Shared Assets

The Flask templates load shared CSS/JS via hardcoded absolute paths:
```html
<link rel="stylesheet" href="/shared/css/shared.css">
<script src="/shared/js/main.js" defer></script>
```

- **In production**, Nginx serves these directly from `/var/www/bryanrea.com/shared/` — fast, no Flask involvement.
- **In local dev**, the `shared_static` route in `app.py` serves them via `send_from_directory` so styles still load when running `python3 app.py`.

## SEO & Syndication
- `/sitemap.xml` — generated by this Flask app (includes portfolio URLs, blog URLs, and the feed URL).
- `/fragments/feed.xml` — RSS 2.0 feed of all posts. Includes both `<description>` (excerpt) and `<content:encoded>` (full HTML body) so readers can show either summary or full text. Auto-discovery `<link rel="alternate" type="application/rss+xml">` lives in `base.html`, so feed readers find it from any blog page.
- `robots.txt` — lives at the monorepo root (`../robots.txt`), served by Nginx as a static file.

## Template Inheritance
```
base.html
├── index.html   (extends base)
├── post.html    (extends base)
└── 404.html     (extends base)
```

## ProxyFix Middleware
`werkzeug.middleware.proxy_fix.ProxyFix` is applied so Flask sees correct client IPs and protocols when sitting behind Nginx.

## Code Style
- Semantic HTML5
- PEP 8 Python
- Comment security-related or non-obvious decisions
- Prioritize clarity and explainability over cleverness
