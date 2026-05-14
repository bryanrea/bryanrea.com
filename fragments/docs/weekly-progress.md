# Weekly Progress Log


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