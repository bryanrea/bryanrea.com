# Fragments

A lightweight, minimalist, vibe-coded flat-file blogging platform.

## What is Fragments?

Fragments is a minimalist blogging platform being built progressively in public. The project explores the power (and limits) of AI coding assistants — do we really need big platforms like Medium or Substack anymore if you can build your own?

This folder is the Flask blog half of the [bryanrea.com](https://github.com/bryanrea/bryanrea.com) monorepo. The static portfolio site lives at the repo root; shared CSS, JS, and images live in `../shared/`.

## Why Fragments?

- **Own your content**: No platform lock-in, no algorithm changes, no terms of service
- **Built in public**: Every step documented, all code open source
- **AI-assisted**: Shows what works (and what doesn't) when building with AI
- **Flat-file simplicity**: No database, just markdown files and Python
- **Progressive development**: Starting simple, adding features as needed

## Tech Stack

- **Backend**: Flask (Python 3.12)
- **Content**: Markdown with YAML frontmatter
- **Templating**: Jinja2
- **Styling**: Pure CSS, no frameworks (shared with the portfolio site via `../shared/css/shared.css`)
- **Hosting**: Digital Ocean VPS (Ubuntu) — Nginx + Gunicorn + systemd
- **Deployment**: `git pull` + `systemctl restart fragments-blog`

## Getting Started

```bash
# Clone the monorepo
git clone git@github.com:bryanrea/bryanrea.com.git
cd bryanrea.com/fragments

# Install Python 3.12 (macOS). It matches production (Ubuntu 24.04);
# 3.10+ is the hard floor, so the macOS system Python (3.9) won't work.
brew install python@3.12

# Create a virtualenv and install dependencies
python3.12 -m venv venv
venv/bin/pip install -r requirements.txt

# Run locally
venv/bin/python app.py

# Visit http://localhost:5000
```

On macOS, port 5000 is taken by AirPlay Receiver. Either turn it off
(System Settings → General → AirDrop & Handoff) or pick another port:

```bash
PORT=5001 venv/bin/python app.py
```

If you copied the repo from another machine, delete `venv/` and recreate
it — a virtualenv points at the Python it was built with and breaks when
that Python isn't installed.

## Project Structure

```
bryanrea.com/                ← monorepo root
├── shared/                  ← shared CSS, JS, images (both sites)
├── index.html, about/, ...  ← static portfolio site
└── fragments/               ← this folder — the Flask blog
    ├── app.py               # Flask application
    ├── requirements.txt     # Python dependencies
    ├── posts/               # Markdown blog posts
    ├── templates/           # Jinja2 HTML templates
    ├── static/              # CSS, JS, images specific to the blog
    └── docs/                # Project documentation
```

## Writing Posts

Posts are markdown files in the `posts/` directory with YAML frontmatter:

```markdown
---
title: My First Post
date: 2026-05-14
excerpt: A short description of the post
tags: [flask, ai]
---

Your markdown content here...
```

Filename format: `YYYY-MM-DD-slug-here.md`. `title`, `date`, and `excerpt` are required; `tags` is optional, and each tag gets its own page at `/fragments/tag/<tag>`. A starter template lives in `docs/article.md`.

Drafts live in `posts/drafts/`. The app only reads markdown files at the top level of `posts/`, so anything in `drafts/` never appears on the site; publishing a post means moving it up into `posts/`. The folder is gitignored, so drafts exist only on the machine you wrote them on — back them up separately.

## Documentation

- `docs/architecture.md` — app structure, request flow, routing
- `docs/deployment.md` — server setup, Nginx, systemd, troubleshooting
- `docs/roadmap.md` — what's done, what's next
- `docs/weekly-progress.md` — build log with what AI did well and where it struggled
- `docs/conventions.md` — code style and post conventions
- `docs/article.md` — starter template for a new post
- `../design.md` — the design system shared by the blog and portfolio
- `../CLAUDE.md` — quick-reference guide for Claude Code

## Follow Along

- **Live blog**: [bryanrea.com/fragments](https://bryanrea.com/fragments)
- **Portfolio**: [bryanrea.com](https://bryanrea.com)
- **GitHub**: [github.com/bryanrea/bryanrea.com](https://github.com/bryanrea/bryanrea.com)

## Philosophy

Big platforms gave us convenience but took our independence. AI gives us the tools to build our own platforms without being expert developers. Fragments is proof that you can own your corner of the internet again.

## License

MIT License — use this code however you want.

## Credits

Built by Bryan Rea with assistance from Claude (Anthropic) and Gemini (Google).

---

*"Program. Or be programmed."*
