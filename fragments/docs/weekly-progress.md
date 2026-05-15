# Weekly Progress Log


## Week 9: RSS Feed, Auto-Deploy & Archive Modernization

**Date:** May 2026

### ✅ Completed
- Added RSS 2.0 feed at `/fragments/feed.xml` — includes `<description>` (excerpt) and `<content:encoded>` (full HTML) so readers can show either. Auto-discovery `<link>` in `base.html`.
- Set up GitHub Actions workflow (`.github/workflows/deploy.yml`) to auto-deploy on push to `main` — SSHes into the DO server, runs `git pull`, restarts the service. Manual SSH is now the fallback.
- Modernized the old portfolio archive: dropped jQuery and legacy plugins, replaced with vanilla JS slide navigation, removed IE cruft and a stale CDN fallback bug, fixed a broken PDF link.
- Added Fathom Analytics to the archive page (it was already on the portfolio and Fragments).
- Documented the auto-deploy workflow and updated roadmap/architecture docs.

### 🌐 Result
Every push to `main` now deploys both sites automatically. The archive is clean, modern JS. RSS feed is live and discoverable.

---

## Week 8: Monorepo, Shared Design System & Visual Unification

**Date:** May 14, 2026  
**Hours Spent:** ~3 hours

### ✅ Completed

**Monorepo Consolidation:**
- Merged the static portfolio (`bryanrea.com`) and Fragments blog into a single GitHub repo (`bryanrea.com`)
- Portfolio files live at the repo root; Flask blog lives in `fragments/`; shared assets in `shared/`
- Removed the nested `.git` from the old fragments repo to integrate it cleanly
- Single `git pull` on the server now updates both sites

**Shared Design System:**
- Extracted duplicated CSS into `shared/css/shared.css`: design tokens (colors, fonts, spacing), global link styles, and the full site nav
- Moved the background animation JS and blob phase randomizer into `shared/js/main.js`, replacing an inline `<script>` in the Flask template
- Moved `noise.png` into `shared/img/` so Flask's local dev route can serve it without a separate Nginx location block
- Both sites now reference the shared files — one change propagates everywhere

**Visual Unification:**
- Added the animated gradient background (two blobs + noise texture) to Fragments — it was previously only on the portfolio
- Unified border/divider color: switched from opaque cream (`#EDE5D5`) to semi-transparent cream (`rgba(237, 229, 213, 0.5)`) so dividers look soft on the gradient instead of harsh
- Unified link styling across both sites: ink-colored text, soft red underline (`--color-accent-soft`), full red on hover — matches the portfolio exactly
- Removed redundant `font-weight`, `font-size`, and `color` overrides from `.read-more` so it inherits cleanly from the global link style

**Server Deployment:**
- Discovered the monorepo's Nginx root (`/var/www/bryanrea.com`) was already correct — no Nginx path changes needed for the portfolio
- Wrote a proper systemd service file (`fragments-blog.service`) — the old one was missing the `[Unit]`, `[Service]`, and `[Install]` sections entirely, which is why it had never been properly managed
- Discovered an old `fragments.service` was still running the previous Flask app from `/var/www/fragments`, blocking the new service from binding to port 8000. Stopped and disabled it.
- Enabled `fragments-blog.service` to auto-start on reboot (it hadn't been enabled before)

### 🤖 What AI Did Well

- Identified the monorepo structure that kept deployment complexity low (no Nginx changes for the portfolio)
- Tracked the CSS specificity cascade precisely — knowing that `a:not([class])` in reset.css has higher specificity than `a` in shared.css, and that `text-decoration` shorthand resets `text-decoration-color`, were non-obvious bugs that would have taken a long time to find manually
- Diagnosed the 502 error methodically: checked the socket, found the port conflict, found the stale service
- Wrote a comprehensive deployment doc that explains *why* each piece exists, not just what commands to run

### 🔧 Where AI Struggled / What I Had to Fix

- Initially tried Unix socket for Gunicorn instead of a port — added complexity without benefit given the existing Nginx config used a port. Caught quickly but required a round-trip.
- The systemd service file I pasted into the server got corrupted (only the two path lines survived). Had to rewrite the whole file from scratch via `cat >`. Would have been faster to just open the file properly.

### 💡 Key Learnings

**On the monorepo:**
- Two repos that share design tokens is a maintenance trap. Every visual tweak becomes two edits. Monorepo with a `shared/` folder solves this with almost no extra complexity.
- Relative paths in CSS `url()` are relative to the CSS file, not the HTML that loads it — critical for `noise.png` to resolve correctly from `shared/css/`.

**On CSS:**
- The `text-decoration` shorthand silently resets `text-decoration-color` to `currentColor`. If you set `text-decoration-color` on `a` and then a child rule re-declares `text-decoration: underline`, your color is gone.
- Semi-transparent colors (`rgba`) for borders are more versatile than opaque ones — they work on any background color, not just the one you designed for.

**On the server:**
- Always check `ss -tlnp | grep <port>` when a service won't start — another process may already own the port.
- `systemctl list-units | grep <name>` reveals old/duplicate services that are easy to forget about.
- A systemd service file with missing section headers (`[Unit]`, `[Service]`, `[Install]`) will fail silently on reload but show "bad unit file setting" on restart.

### 🌐 Result

- Both sites (`bryanrea.com` and `bryanrea.com/fragments`) served from one repo, one server directory
- Consistent visual identity: same palette, fonts, nav, background, link behavior
- Deployment is simpler: `git pull` + `systemctl restart fragments-blog`
- `fragments-blog.service` now properly enabled and auto-starts on reboot

---

## Week 7: Prev/Next Navigation & Fathom Analytics

**Date:** ~April 2026

### ✅ Completed
- Added previous/next post navigation to post pages — links to the adjacent posts by date so readers can move through the archive without going back to the listing.
- Integrated Fathom Analytics on the Fragments blog (privacy-friendly, no cookie banner needed).

### 🌐 Result
Posts feel connected rather than isolated. Basic traffic visibility is in place.

---

## Week 6: Visual Redesign

**Date:** ~March 2026

### ✅ Completed
- Redesigned Fragments with the warm palette (cream + crimson), Fraunces + Inter type pairing, and the animated gradient background — aligning it with the direction of the portfolio.
- Added nav scroll-reveal behavior so the nav hides on scroll down and reappears on scroll up.

### 🌐 Result
The blog went from generic Flask starter styles to a distinctive, cohesive visual identity.

---

## Week 5: SEO Foundations

**Date:** ~February 2026

### ✅ Completed
- Added dynamic `/sitemap.xml` generated by Flask — covers both portfolio URLs and all blog post URLs.
- Added `robots.txt` at the repo root with basic scraper rules (including AI crawler blocks).
- Submitted the site to Google Search Console.

### 🌐 Result
Site is discoverable by search engines and has basic crawl controls in place.

---

## Week 4: Styling & Mobile Responsiveness

**Date:** ~February 2026

### ✅ Completed
- Overhauled the look and feel: cleaned up navigation, added the animated blob background with noise texture overlay.
- Polished mobile responsiveness across both the portfolio and blog.
- Rebranded the portfolio tagline to "Designing in Systems."

### 🌐 Result
The site felt designed for the first time — not just functional.

---

## Week 3: Post Listing, Metadata & Navigation

**Date:** ~January 2026

### ✅ Completed
- Built the post listing page with excerpts and dates pulled from frontmatter.
- Added basic site navigation linking the portfolio and blog.
- Improved date formatting (human-readable dates instead of raw ISO strings).
- Added post count display and better excerpt handling.

### 🌐 Result
The blog was usable end-to-end: write a markdown file, it appears on the listing, click through to read it.

---

## Week 2: Migrating from Render to DigitalOcean

**Date:** January 12, 2026  
**Hours Spent:** ~2 hours

### ✅ Completed

**The Render Problem:**
- Discovered Render's free-tier static sites can't proxy to external web services
- Rewrite rules literally forwarded `:splat` as text instead of substituting captured paths
- CSS returned 404s, post links broke
- Redirects worked (proved rules were configured), but rewrites didn't
- Root cause: Platform limitation, not a configuration error

**Migration Decision:**
- Chose Digital Ocean VPS over upgrading Render to paid tier
- Better for learning traditional hosting infrastructure
- More control, actually cheaper ($6/month vs $14/month Render paid)
- Perfect content for "building in public" - understanding real infrastructure

**Digital Ocean Setup:**
- Created VPS droplet (Ubuntu 24.04)
- Configured SSH key authentication
- Installed nginx, python3, pip, git, firewall
- Set up directory structure for static site and Flask app
- Uploaded static site files
- Cloned fragments repo from GitHub

**Nginx Configuration:**
- Configured nginx to serve static site at root
- Set up reverse proxy for `/fragments` to Flask backend
- Nginx handles SSL termination, static files, and routing
- One clean config file handles everything

**Flask Production Setup:**
- Created Python virtual environment
- Installed dependencies via pip in venv
- Set up Gunicorn with multiple workers
- Created systemd service for auto-start
- Configured proper user permissions for security
- Service auto-restarts on boot

**SSL & DNS:**
- Installed Certbot for Let's Encrypt
- Generated SSL certificates for domain and www subdomain
- Certbot automatically configured nginx for HTTPS
- Certificates auto-renew automatically
- Updated DNS to point to new server
- DNS propagated quickly

**Security:**
- Configured firewall (allow only SSH, HTTP, HTTPS)
- Services run with appropriate user permissions
- SSH key-only authentication (no passwords)

### 🤖 What AI Did Well

**Absolutely Essential:**
- Step-by-step server setup guidance (would have been lost without it)
- Generated working nginx config on first try
- Created systemd service file that worked immediately
- Explained complex concepts (reverse proxy, WSGI servers, systemd)
- Debugged Render issue by analyzing server logs
- Broke down intimidating VPS setup into manageable steps

**Specific Wins:**
- Nginx configuration with proper proxy headers
- systemd service syntax (unfamiliar territory)
- Certbot SSL setup walked through perfectly
- File permissions and ownership commands
- Understanding what each tool does and why it's needed

**Teaching Moments:**
- Explained the difference between web server (Nginx) and app server (Gunicorn)
- Clarified what `:splat` is and why it wasn't working
- Broke down the entire request flow (browser → nginx → gunicorn → flask)
- Helped understand when to search for current info vs use knowledge

### 🔧 Where AI Struggled / What I Had to Fix

**Platform-Specific Knowledge:**
- Couldn't magically make Render rewrites work (platform limitation)
- Required human judgment on whether to upgrade Render, use subdomain, or migrate
- I had to weigh trade-offs: cost vs control vs learning value vs time

**Interactive Prompts:**
- Some server setup steps required answering prompts during installation
- AI couldn't know my preferences for those decisions

**Decision Points:**
- Choosing VPS over other options was my call based on project goals
- Deciding which tools to learn vs accept as black boxes
- Balancing "get it working" vs "understand deeply"

### 💡 Key Learnings

**Technical Concepts:**
- How reverse proxies actually work (Nginx routing to backend services)
- WSGI servers bridge web servers and Python apps
- systemd manages services and handles auto-restart/boot
- Let's Encrypt made SSL completely free and automatic
- Firewall configuration is straightforward but critical for security

**Infrastructure Understanding:**
- Traditional LEMP stack (Linux, Nginx, Python) isn't that scary
- Understanding the full stack is more valuable than platform abstractions
- Server logs are essential for debugging (found `:splat` issue there)
- VPS hosting is affordable and provides total control

**Problem-Solving Process:**
- When something doesn't work, investigate thoroughly before pivoting
- Server logs tell you exactly what's failing
- Testing at each layer helps isolate problems
- Sometimes the "harder" solution teaches you more

**Working with AI:**
- AI can't overcome platform limitations but can help you find alternatives
- Best to ask "why does this work this way" not just "how do I do this"
- Understanding beats copying - I can now explain every part of the stack
- AI excels at tedious config files but you still need to understand them

**Design Leadership Parallel:**
- Breaking down overwhelming problems (VPS setup) into small steps works
- Progress over perfection - got it working, can optimize later
- Learning by doing is more valuable than reading docs
- Shipping imperfect but functional > waiting for perfect

### 📝 Architecture Now

**Production Stack:**
```
Browser Request (https://bryanrea.com/fragments)
    ↓
[Firewall] - allows web traffic
    ↓
[Nginx] - SSL termination, reverse proxy
    ↓
    ├→ /fragments → proxy to Flask backend
    └→ / → serves static files
    ↓
[Gunicorn] - WSGI server with multiple workers
    ↓
[Flask App] - in isolated Python environment
```

**Deployment Workflow (Current):**
- SSH into server
- Navigate to app directory
- Pull latest code from GitHub
- Restart application service

### 🔍 Technical Details Worth Remembering

**Nginx Config Concepts:**
- Proxy pass configuration for routing
- Header preservation for proper request handling
- Static file serving for main site

**systemd Service Concepts:**
- User permissions for security
- Working directory configuration
- Automatic restart and boot behavior

**Let's Encrypt:**
- Automated certificate generation
- Auto-renewal via systemd timer
- Free SSL for multiple domains/subdomains

### 🌐 Result

**Live URLs:**
- Static site: `https://bryanrea.com` ✅
- Blog: `https://bryanrea.com/fragments` ✅
- Individual posts working ✅
- SSL: Let's Encrypt, auto-renewing ✅
- Both www and non-www working ✅

**No More Issues:**
- CSS loads perfectly
- Post links work
- Everything properly routed
- Full control over infrastructure

### 📈 What This Unlocked

**Understanding:**
- How professional web hosting actually works
- The tools that power most of the internet
- Why platforms abstract these things away (it's complex!)
- But also why understanding them gives you power

**Future Capabilities:**
- Can add any feature without platform limitations
- Can optimize performance (caching, compression, etc.)
- Can add more services on same server
- Can troubleshoot issues at any layer

**Content:**
- Great material for blog posts about infrastructure
- Real learning journey to share
- Authentic "building in public" experience

### 🎯 Week 3 Goals

**Content & Polish:**
- Write 2-3 design leadership posts (test the system)
- Improve date formatting (show readable dates)
- Better excerpt handling (currently just truncates)
- Add post count to homepage

**Deployment:**
- Create simple deployment script to automate updates
- Document deployment process
- Maybe: automated deployment on git push

**Features:**
- Add RSS feed
- Consider: simple About page
- Consider: tags or categories for posts


## Week 1: Foundations & Initial Setup

**Date:** November 9, 2025  
**Hours Spent:** ~4 hours

### ✅ Completed
- Set up Render hosting with custom domain (bryanrea.com)
- Configured DNS on Cloudflare
- Set up SSH keys for GitHub
- Created Flask application structure
- Installed dependencies (Flask, Markdown, python-frontmatter, gunicorn)
- Built base template with header/footer
- Created homepage and post templates
- Designed minimal CSS styling
- Wrote and published first post
- Tested locally - everything works!

### 🤖 What AI Did Well
- Literally could not have done this on my own, would have been months learning and trial and error
- It's a great partner and sounding board
- Generated simple, clean Flask app structure (I think... no idea if it's good or will scale)
- Created easy to understand, semantic HTML templates
- Produced readable, well-commented CSS
- Helped troubleshoot Git/SSH setup
- Explained concepts clearly (DNS, SSH keys, Flask routing)
- Pasting errors and asking what went wrong is a great way to fix something

### 🔧 Where AI Struggled / What I Had to Fix
- Hard to keep track of things switching between Claude, Gemini, and Cursor
- Wish I could connect Claude and Gemini context directly to a Cursor project
- Quickly builds things that are beyond my knowledge or capabilities, hard to verify if it's right
- Don't let AI write my blog posts, didn't capture my voice at all

### 💡 Key Learnings
- Flask makes flat-file blogs really simple
- Frontmatter + Markdown is a clean content workflow
- AI is excellent at boilerplate and structure
- SSH setup is one-time pain but worth it (public key encryption always feels like magic)
- Building in public creates natural accountability

### 📝 Notes for Next Week
- Add more posts to test the listing
- Consider adding a tagline or about section
- Start thinking about RSS feed structure
- Document AI prompts I used