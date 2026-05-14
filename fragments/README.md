# Fragments

A lightweight, minimalist, vibe-coded flat-file blogging platform

## What is Fragments?

Fragments is a minimalist blogging platform vibe coded progressively over 12 weeks. With this project, I'm exploring the power (and limites) of AI programming and the democratizing power they might offer – do we really need big platforms like Medium or Substack anymore if you can just build your own thing? Let's find out.

## Why Fragments?

- **Own your content**: No platform lock-in, no algorithm changes, no terms of service
- **Built in public**: Every step documented, all code open source
- **AI-assisted**: Shows what works (and what doesn't) when building with AI
- **Flat-file simplicity**: No database, just markdown files and Python
- **Progressive development**: Starting simple, adding features week by week

## Tech Stack

- **Backend**: Flask (Python 3.9+)
- **Content**: Markdown with YAML frontmatter
- **Templating**: Jinja2
- **Styling**: Pure CSS, no frameworks
- **Hosting**: Render
- **Deployment**: Git push (automatic)

## Project Timeline

This is a 12-week build-in-public project:

- **Week 1**: Foundation & basic blog structure ← *You are here*
- **Week 2**: Markdown conversion automation
- **Week 3**: Post listing & navigation
- **Week 4**: Design & styling
- **Week 5**: RSS feed
- **Week 6**: Build automation
- **Week 7**: Search functionality
- **Week 8**: Content & reflection
- **Week 9**: Code highlighting
- **Week 10**: Comments/webmentions
- **Week 11**: Performance & polish
- **Week 12**: Documentation & launch

## Getting Started
```bash
# Clone the repo
git clone git@github.com:bryanrea/fragments.git
cd fragments

# Install dependencies
pip3 install -r requirements.txt

# Run locally
python3 app.py

# Visit http://localhost:5000
```

## Project Structure
```
fragments/
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── posts/             # Markdown blog posts
├── templates/         # Jinja2 HTML templates
├── static/           # CSS, JS, images
└── docs/             # Project documentation
```

## Writing Posts

Posts are markdown files in the `posts/` directory with YAML frontmatter:
```markdown
---
title: My First Post
date: 2024-11-09
excerpt: A short description of the post
---

Your markdown content here...
```

## Follow Along

- **Live site**: [bryanrea.com](https://bryanrea.com)
- **Weekly progress**: See `docs/weekly-progress.md`
- **GitHub**: [github.com/bryanrea/fragments](https://github.com/bryanrea/fragments)

## Philosophy

Big platforms gave us convenience but took our independence. AI gives us the tools to build our own platforms without being expert developers. Fragments is proof that you can own your corner of the internet again.

## License

MIT License - use this code however you want.

## Credits

Built by Bryan Rea with assistance from Claude (Anthropic) and Gemini (Google).

---

*"Progam. Or be programmed."*