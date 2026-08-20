from flask import Flask, render_template, abort, Blueprint, redirect, url_for, Response, send_from_directory, request
import math
import markdown
import frontmatter
import os
import subprocess
from datetime import datetime, timezone
from email.utils import format_datetime
from html import escape
from urllib.parse import quote
from dateutil import parser as date_parser
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)

# The canonical origin for this site. Every absolute URL we emit — canonical
# links, social tags, the feed, the sitemap — is built from this rather than
# from the incoming request, so the output doesn't depend on the proxy
# forwarding host and scheme correctly.
SITE_URL = 'https://bryanrea.com'

# Resolve the current git short hash once at startup. It can't change while the
# process is running, so there's no reason to shell out on every request — the
# old behavior spawned a `git` subprocess per page load.
def _resolve_cache_bust():
    try:
        return subprocess.check_output(
            ['git', 'rev-parse', '--short', 'HEAD'],
            stderr=subprocess.DEVNULL
        ).decode().strip()
    except Exception:
        return '1'

CACHE_BUST = _resolve_cache_bust()

@app.context_processor
def inject_cache_bust():
    return {'cache_bust': CACHE_BUST}


@app.context_processor
def inject_site_urls():
    """Absolute-URL builder for canonical links and social meta tags.

    Templates need the full https://bryanrea.com/... form; url_for alone gives
    a site-relative path. Going through SITE_URL keeps this identical to how
    the feed and sitemap already build their URLs.
    """
    def absolute_url(endpoint, **values):
        # url_for spells the blog index "/fragments/", while the feed and the
        # sitemap have always used "/fragments". Trailing slashes are stripped
        # so a page advertises exactly one canonical URL everywhere it appears.
        path = url_for(endpoint, **values).rstrip('/')
        return SITE_URL + (path or '/')

    return {'absolute_url': absolute_url}

# Configure for reverse proxy
app.wsgi_app = ProxyFix(
    app.wsgi_app,
    x_for=1,
    x_proto=1,
    x_host=1,
    x_prefix=1
)

# Posts live as flat markdown files here. The slug logic, the cache, and the
# sitemap all key off this one location.
POSTS_DIR = 'posts'

# Markdown rendering is identical for post pages and the RSS feed, so the
# extension list lives in one place rather than being duplicated at each call.
MARKDOWN_EXTENSIONS = ['fenced_code', 'codehilite', 'tables']

# How long readers and intermediaries may treat the feed as fresh. Short enough
# that a new post surfaces promptly, long enough to spare us a full re-send on
# every poll (conditional requests handle the rest).
FEED_MAX_AGE = 900  # 15 minutes

# In-process cache of fully parsed and rendered posts. Posts are flat files
# that only change on deploy (which restarts the process) or, in local dev,
# when you edit one — so instead of re-scanning the directory and re-rendering
# markdown on every request, we build the list once and reuse it until the
# directory's fingerprint changes. Each Gunicorn worker keeps its own copy; a
# redundant rebuild under concurrency is harmless, so no lock is needed.
_posts_cache = {'signature': None, 'posts': [], 'last_modified': None}


def _posts_signature():
    """A cheap fingerprint of posts/ — each markdown file's name and mtime.

    Adding, editing, or removing a post changes this tuple, which is the signal
    to rebuild the cache. Stat-ing files is far cheaper than parsing them.
    """
    if not os.path.exists(POSTS_DIR):
        return ()

    entries = []
    for filename in os.listdir(POSTS_DIR):
        if not filename.endswith('.md'):
            continue
        try:
            mtime = os.path.getmtime(os.path.join(POSTS_DIR, filename))
        except OSError:
            continue
        entries.append((filename, mtime))
    return tuple(sorted(entries))


def _last_modified_from(signature):
    """Newest mtime in posts/, as an aware UTC datetime (None when there are no posts).

    Derived from the signature we already computed, so this costs no extra
    stat calls. This is when the content actually changed on this server —
    unlike a post's frontmatter date, which has no time component and so
    floors to midnight. Truncated to whole seconds to match HTTP date
    resolution, which keeps conditional requests from always missing by a
    fraction.
    """
    if not signature:
        return None
    newest = max(mtime for _, mtime in signature)
    return datetime.fromtimestamp(newest, tz=timezone.utc).replace(microsecond=0)


def _slug_from_filename(filename):
    """Strip the .md extension and any YYYY-MM-DD- date prefix.

    Example: 2024-11-09-why-im-building-this.md -> why-im-building-this
    """
    slug = filename[:-3] if filename.endswith('.md') else filename
    if len(slug) > 10 and slug[10] == '-':  # has a date prefix
        slug = slug[11:]
    return slug


def _build_posts():
    """Parse and render every post once. Called only when the cache is stale.

    Each post carries both `content` (raw markdown, used by the listing's
    excerpt fallback) and `html` (rendered once here, reused by the post page
    and the feed).
    """
    posts = []

    for filename in os.listdir(POSTS_DIR):
        if not filename.endswith('.md'):
            continue

        filepath = os.path.join(POSTS_DIR, filename)

        # Guard each file so one malformed post is skipped rather than 500-ing
        # the whole listing (and, by extension, the feed and sitemap).
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
        except Exception:
            app.logger.warning('Skipping unreadable post: %s', filename, exc_info=True)
            continue

        word_count = len(post.content.split())
        posts.append({
            'title': post.get('title', 'Untitled'),
            'date': post.get('date'),
            'excerpt': post.get('excerpt', ''),
            'content': post.content,
            'html': markdown.markdown(post.content, extensions=MARKDOWN_EXTENSIONS),
            'slug': _slug_from_filename(filename),
            'filename': filename,
            'reading_time': max(1, math.ceil(word_count / 200)),
            'tags': post.get('tags', []) or [],
        })

    # Sort posts by date (newest first)
    posts.sort(key=lambda x: x['date'] if x['date'] else datetime.min, reverse=True)
    return posts


def get_posts():
    """Return all posts, newest first.

    Rebuilds the cache only when posts/ changes; otherwise returns the cached
    list, so the common request does no filesystem parsing or markdown work.
    """
    signature = _posts_signature()
    if signature != _posts_cache['signature']:
        _posts_cache['posts'] = _build_posts()
        _posts_cache['last_modified'] = _last_modified_from(signature)
        _posts_cache['signature'] = signature
    return _posts_cache['posts']


def get_posts_last_modified():
    """When posts/ last changed, as an aware UTC datetime (or None if empty).

    Goes through get_posts() so the cache is refreshed first — otherwise this
    could report a stale timestamp for a post that hasn't been picked up yet.
    """
    get_posts()
    return _posts_cache['last_modified']


def get_post(slug):
    """Return a single post by slug, or None. Served from the same cache as get_posts()."""
    for post in get_posts():
        if post['slug'] == slug:
            return post
    return None

def get_post_neighbors(slug):
    """
    Find the previous and next posts adjacent to the given slug,
    based on date order (newest-first list from get_posts()).

    Previous = the post published before this one (older).
    Next = the post published after this one (newer).
    Returns None at the edges.
    """
    posts = get_posts()
    for i, post in enumerate(posts):
        if post['slug'] == slug:
            # posts is sorted newest-first, so the newer post is at i-1
            # and the older post is at i+1
            newer = posts[i - 1] if i > 0 else None
            older = posts[i + 1] if i < len(posts) - 1 else None
            return {
                'previous': {'title': older['title'], 'slug': older['slug']} if older else None,
                'next': {'title': newer['title'], 'slug': newer['slug']} if newer else None,
            }
    return {'previous': None, 'next': None}


def get_file_modification_time(filepath):
    """Get the last modification time of a file as a datetime object."""
    if os.path.exists(filepath):
        return datetime.fromtimestamp(os.path.getmtime(filepath))
    return None

# Create a blueprint with url_prefix
fragments_bp = Blueprint(
    'fragments',
    __name__,
    url_prefix='/fragments',
    template_folder='templates',
    static_folder='static'
)


# Routes
@fragments_bp.route('/', strict_slashes=False)
def index():
    """Homepage - list all blog posts"""
    posts = get_posts()
    return render_template('index.html', posts=posts)

@fragments_bp.route('/post/<slug>')
def post(slug):
    """Individual post page"""
    post_data = get_post(slug)

    if post_data is None:
        abort(404)

    neighbors = get_post_neighbors(slug)
    return render_template('post.html', post=post_data, neighbors=neighbors)

@fragments_bp.route('/tag/<tag>')
def tag(tag):
    """List all posts that carry a given tag."""
    posts = [p for p in get_posts() if tag in p['tags']]

    if not posts:
        abort(404)

    return render_template('tag.html', tag=tag, posts=posts)

@fragments_bp.route('/feed.xml')
def feed():
    """RSS 2.0 feed of all posts.

    Includes both a short description (excerpt) and the full HTML body
    via content:encoded, so readers can show whatever they prefer.

    Freshness is reported three ways — lastBuildDate, Last-Modified, and an
    ETag — all derived from when posts/ actually changed. Conditional requests
    get a 304, so a polling reader only pays for the body when there's
    something new.
    """
    feed_url = f'{SITE_URL}/fragments/feed.xml'
    blog_url = f'{SITE_URL}/fragments'

    posts = get_posts()

    def to_rfc822(d):
        """Convert a date or datetime to an RFC 822 string (RSS requirement)."""
        if d is None:
            return ''
        if isinstance(d, datetime):
            dt = d if d.tzinfo else d.replace(tzinfo=timezone.utc)
        else:
            # date object -> midnight UTC
            dt = datetime.combine(d, datetime.min.time(), tzinfo=timezone.utc)
        return format_datetime(dt)

    items = []
    for post in posts:
        post_url = f'{SITE_URL}/fragments/post/{post["slug"]}'
        html_content = post['html']  # rendered once when the cache was built
        items.append(
            f'    <item>\n'
            f'      <title>{escape(post["title"])}</title>\n'
            f'      <link>{post_url}</link>\n'
            f'      <guid isPermaLink="true">{post_url}</guid>\n'
            f'      <pubDate>{to_rfc822(post["date"])}</pubDate>\n'
            f'      <description>{escape(post.get("excerpt", ""))}</description>\n'
            f'      <content:encoded><![CDATA[{html_content}]]></content:encoded>\n'
            f'    </item>'
        )

    # lastBuildDate is when the feed's content last changed, not the newest
    # post's frontmatter date. Those differ by however long it took to write
    # and deploy a post, and a reader that polls in that window would
    # otherwise see a lastBuildDate no newer than the one it already had —
    # and skip the new item entirely.
    last_modified = get_posts_last_modified()
    last_build = format_datetime(last_modified or datetime.now(timezone.utc))

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0"\n'
        '     xmlns:atom="http://www.w3.org/2005/Atom"\n'
        '     xmlns:content="http://purl.org/rss/1.0/modules/content/">\n'
        '  <channel>\n'
        '    <title>Fragments</title>\n'
        f'    <link>{blog_url}</link>\n'
        f'    <atom:link href="{feed_url}" rel="self" type="application/rss+xml" />\n'
        '    <description>Building with AI, in public. A blog by Bryan Rea.</description>\n'
        '    <language>en-us</language>\n'
        f'    <lastBuildDate>{last_build}</lastBuildDate>\n'
        + '\n'.join(items) + '\n'
        '  </channel>\n'
        '</rss>\n'
    )

    response = Response(xml, mimetype='application/rss+xml')
    if last_modified:
        response.last_modified = last_modified
    response.add_etag()  # hashes the body, so it changes iff the output does
    response.cache_control.public = True
    response.cache_control.max_age = FEED_MAX_AGE
    # Turns a matching If-None-Match / If-Modified-Since into a 304.
    return response.make_conditional(request)

@app.route('/sitemap.xml')
def site_sitemap():
    """Generate XML sitemap for entire bryanrea.com site"""
    # Start building XML
    xml_parts = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_parts.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # Static pages on main site
    static_pages = [
        {'loc': f'{SITE_URL}/', 'priority': '1.0', 'changefreq': 'monthly'},
        {'loc': f'{SITE_URL}/about', 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': f'{SITE_URL}/experience', 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': f'{SITE_URL}/archive', 'priority': '0.6', 'changefreq': 'yearly'},
        {'loc': f'{SITE_URL}/resume.pdf', 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': f'{SITE_URL}/fragments', 'priority': '0.9', 'changefreq': 'weekly'},
        {'loc': f'{SITE_URL}/fragments/feed.xml', 'priority': '0.5', 'changefreq': 'weekly'},
    ]
    
    for page in static_pages:
        xml_parts.append('  <url>')
        xml_parts.append(f'    <loc>{page["loc"]}</loc>')
        xml_parts.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
        xml_parts.append(f'    <priority>{page["priority"]}</priority>')
        xml_parts.append('  </url>')
    
    # Add all blog posts
    posts = get_posts()
    for post in posts:
        # Get last modification time from file
        filename = post.get('filename', '')
        if filename:
            filepath = os.path.join(POSTS_DIR, filename)
            lastmod = get_file_modification_time(filepath)
        else:
            lastmod = post.get('date')
        
        # Format lastmod date
        if lastmod:
            if isinstance(lastmod, str):
                try:
                    lastmod = date_parser.parse(lastmod)
                except:
                    lastmod = None
            if lastmod and isinstance(lastmod, datetime):
                lastmod_str = lastmod.strftime('%Y-%m-%d')
            else:
                lastmod_str = None
        else:
            lastmod_str = None
        
        xml_parts.append('  <url>')
        xml_parts.append(f'    <loc>{SITE_URL}/fragments/post/{post["slug"]}</loc>')
        if lastmod_str:
            xml_parts.append(f'    <lastmod>{lastmod_str}</lastmod>')
        xml_parts.append('    <changefreq>monthly</changefreq>')
        xml_parts.append('    <priority>0.7</priority>')
        xml_parts.append('  </url>')

    # Tag pages are generated from frontmatter at request time, so the only way
    # to enumerate them is from the posts themselves. Derived from the list we
    # already have, so this costs no extra filesystem work. Without this they're
    # indexable but undiscoverable — nothing machine-readable links to them.
    for tag in sorted({tag for post in posts for tag in post['tags']}):
        xml_parts.append('  <url>')
        xml_parts.append(f'    <loc>{SITE_URL}/fragments/tag/{quote(tag, safe="")}</loc>')
        xml_parts.append('    <changefreq>monthly</changefreq>')
        xml_parts.append('    <priority>0.4</priority>')
        xml_parts.append('  </url>')

    xml_parts.append('</urlset>')
    
    xml_content = '\n'.join(xml_parts)
    return Response(xml_content, mimetype='application/xml')

# Register blueprint
app.register_blueprint(fragments_bp)


@app.errorhandler(404)
def page_not_found(e):
    """Custom 404 page"""
    return render_template('404.html'), 404


@app.route('/')
def root():
    """Redirect root to fragments homepage"""
    return redirect(url_for('fragments.index'))

@app.route('/shared/<path:filename>')
def shared_static(filename):
    """Serve shared assets locally. In production, Nginx handles this path directly."""
    shared_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'shared')
    return send_from_directory(shared_dir, filename)

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get('PORT', 5000)))