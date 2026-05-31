# Fragments — Conventions

## Python
- Follow PEP 8
- Prioritize readability over cleverness
- Comment complex or security-related logic — explain *why*, not just *what*
- Prefer explicit over implicit

## HTML
- Semantic HTML5 elements (`<article>`, `<nav>`, `<header>`, `<main>`, etc.)
- Accessible markup — use proper heading hierarchy, alt text on images
- Template inheritance: always extend `base.html`

## CSS
- No frameworks — pure CSS only
- Keep it minimal and readable
- Use descriptive class names
- Mobile-first where it matters

## Post Files
- Filename format: `YYYY-MM-DD-slug-here.md`
- Slug: lowercase, hyphen-separated, no special characters
- Required frontmatter fields: `title`, `date`, `excerpt`
- Optional: `tags` (list), `published` (bool, for draft filtering later)

```yaml
---
title: Post Title Here
date: 2024-11-09
excerpt: One or two sentences describing the post.
tags: [flask, learning, ai]
---
```

## Images in Posts
- Store image files in `fragments/static/images/`. The blueprint serves them at
  `/fragments/static/images/<filename>`.
- Reference them in markdown with a standard image and **always include alt text**:

  ```markdown
  ![A descriptive alt text](/fragments/static/images/my-photo.jpg)
  ```

  These render responsive and centered (max-width 100%, rounded, light border).
- For a **captioned** image, write a raw `<figure>` block in the markdown (python-markdown
  passes raw HTML through untouched):

  ```html
  <figure>
    <img src="/fragments/static/images/my-photo.jpg" alt="A descriptive alt text">
    <figcaption>Caption text shown below the image.</figcaption>
  </figure>
  ```

  Keep `alt` (for screen readers) distinct from the `figcaption` (visible context) —
  don't just duplicate one into the other.

## Flask / Python Patterns
- All blog routes live in the `fragments_bp` Blueprint
- Helper functions (`get_posts`, `get_post`) handle filesystem reads
- Routes should be thin — logic in helpers, not route handlers
- Never put sensitive config in code — use environment variables

## Git & Deployment
- Commit messages: plain English, describe what changed and why if not obvious
- Always test locally before pushing
- Deploy sequence: `git pull` → `sudo systemctl restart fragments-blog`
- Never commit `venv/`, `__pycache__/`, `.env`, or secrets

## Working with Cursor
- Use `@docs/architecture.md` when working on app structure or routes
- Use `@docs/deployment.md` when working on server, Nginx, or systemd
- Use `@docs/roadmap.md` when planning or prioritizing features
- Use `@docs/conventions.md` for code style questions
- Prefer asking "why does this work this way" over just "how do I do this"
