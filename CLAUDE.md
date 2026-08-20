# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This is a monorepo for bryanrea.com with two distinct sites:

- **Root** (`index.html`, `about/`, `experience/`, `archive/`) — static portfolio site, served directly by Nginx in production
- **`fragments/`** — a Flask blog app, served via Gunicorn behind Nginx at `/fragments`
- **`shared/`** — CSS, JS, and images shared by both sites (served by Nginx in production; the `shared_static` route in `app.py` handles it in local dev)

## Running the blog locally

```bash
cd fragments
python3.12 -m venv venv          # first time only
venv/bin/pip install -r requirements.txt
venv/bin/python app.py
# Visit http://localhost:5000
```

Use Python 3.12 to match production (Ubuntu 24.04). The dependencies require
3.10+, so macOS system Python (3.9) won't work — install `python@3.12` via
Homebrew rather than reaching for `python3`.

There are no tests and no lint step configured.

## Deployment

Pushes to `main` auto-deploy via GitHub Actions (SSH → `git pull` → `systemctl restart fragments-blog`). Manual deploy sequence on the VPS:

```bash
git pull origin main
sudo systemctl restart fragments-blog
```

## Architecture

All blog routes are registered on the `fragments_bp` Blueprint (`url_prefix='/fragments'`). Three routes live on the bare app: `/sitemap.xml`, `/` (redirects to the blog in local dev only), and `/shared/<path>` (local dev only — Nginx handles this in production).

Posts are flat markdown files in `fragments/posts/`. There is no database. `get_posts()` builds a parsed+rendered list once and caches it in-process (`_posts_cache`), rebuilding only when `posts/` changes — invalidation keys off a fingerprint of each file's name and mtime (`_posts_signature()`). `get_post(slug)` is a lookup over that cached list. The slug is derived from the filename by stripping the `YYYY-MM-DD-` prefix.

Templates use inheritance from `base.html`. Shared macros (post preview card, tag list) live in `_macros.html`.

`base.html` emits the canonical URL and the Open Graph / Twitter tags for every page, replaying the `title` and `meta_description` blocks through `{{ self.title()|striptags }}` — `striptags` is required, since a block's literal text isn't autoescaped. A new page template overrides `canonical_url` and, when it isn't a plain page, `og_type`. Absolute URLs come from `absolute_url()` (built on the `SITE_URL` constant). See `fragments/docs/architecture.md`.

Shared assets are loaded via hardcoded absolute paths (`/shared/css/shared.css`, `/shared/js/main.js`). In production Nginx serves them; in local dev `app.py` proxies them.

## Post frontmatter schema

```yaml
---
title: Post Title
date: 2026-04-27
excerpt: Short description shown on the listing page.
tags: [tag1, tag2]
---
```

Filename format: `YYYY-MM-DD-slug-here.md`. Required fields: `title`, `date`, `excerpt`. Tags are optional; each tag gets a `/fragments/tag/<tag>` page (404s if no posts match).

## Cache busting

**Fragments blog** — `app.py` has a context processor that injects `cache_bust` (the current git short hash) into every template. `base.html` appends `?v={{ cache_bust }}` to all CSS and JS URLs. This updates automatically on every deploy — no manual work needed.

**Static portfolio** (`index.html`, `about/index.html`, `experience/index.html`) — version strings are hardcoded in the HTML (e.g. `shared.css?v=acec136`). When pushing CSS or JS changes that affect the portfolio, update the hash in these three files to match the new commit hash (`git rev-parse --short HEAD`).

## Conventions

- All blog routes go in `fragments_bp`; keep route handlers thin — logic belongs in helpers
- Templates always extend `base.html`
- Pure CSS only — no frameworks
- Python follows PEP 8; prioritize clarity over cleverness
- Detailed context lives in `fragments/docs/`: `architecture.md`, `deployment.md`, `roadmap.md`, `conventions.md`
