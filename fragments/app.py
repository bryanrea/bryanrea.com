from flask import Flask, render_template, abort, Blueprint, redirect, url_for, Response, send_from_directory
import markdown
import frontmatter
import os
from datetime import datetime
from dateutil import parser as date_parser
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)

# Configure for reverse proxy
app.wsgi_app = ProxyFix(
    app.wsgi_app,
    x_for=1,
    x_proto=1,
    x_host=1,
    x_prefix=1
)

# Helper function to get all posts
def get_posts():
    """
    Load all markdown files from posts/ directory,
    parse their frontmatter, and return a sorted list.
    """
    posts = []
    posts_dir = 'posts'
    
    # Check if posts directory exists
    if not os.path.exists(posts_dir):
        return posts
    
    # Loop through all markdown files
    for filename in os.listdir(posts_dir):
        if filename.endswith('.md'):
            filepath = os.path.join(posts_dir, filename)
            
            # Read the markdown file with frontmatter
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
                
                # Extract slug from filename (remove .md and date prefix if present)
                # Example: 2024-11-09-why-im-building-this.md -> why-im-building-this
                slug = filename.replace('.md', '')
                if len(slug) > 10 and slug[10] == '-':  # Has date prefix
                    slug = slug[11:]  # Remove YYYY-MM-DD- prefix
                
                # Create post object
                post_data = {
                    'title': post.get('title', 'Untitled'),
                    'date': post.get('date'),
                    'excerpt': post.get('excerpt', ''),
                    'content': post.content,
                    'slug': slug,
                    'filename': filename
                }
                
                posts.append(post_data)
    
    # Sort posts by date (newest first)
    posts.sort(key=lambda x: x['date'] if x['date'] else datetime.min, reverse=True)
    
    return posts

# Helper function to get a single post
def get_post(slug):
    """
    Load a specific post by its slug.
    """
    posts_dir = 'posts'
    
    # Try to find the markdown file matching this slug
    for filename in os.listdir(posts_dir):
        if filename.endswith('.md'):
            # Check if slug matches (with or without date prefix)
            file_slug = filename.replace('.md', '')
            if len(file_slug) > 10 and file_slug[10] == '-':
                file_slug = file_slug[11:]
            
            if file_slug == slug:
                filepath = os.path.join(posts_dir, filename)
                
                # Read and parse the post
                with open(filepath, 'r', encoding='utf-8') as f:
                    post = frontmatter.load(f)
                    
                    # Convert markdown to HTML
                    html_content = markdown.markdown(
                        post.content,
                        extensions=['fenced_code', 'codehilite', 'tables']
                    )
                    
                    return {
                        'title': post.get('title', 'Untitled'),
                        'date': post.get('date'),
                        'content': html_content,
                        'slug': slug
                    }
    
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

@app.route('/sitemap.xml')
def site_sitemap():
    """Generate XML sitemap for entire bryanrea.com site"""
    base_url = 'https://bryanrea.com'
    
    # Start building XML
    xml_parts = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_parts.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # Static pages on main site
    static_pages = [
        {'loc': f'{base_url}/', 'priority': '1.0', 'changefreq': 'monthly'},
        {'loc': f'{base_url}/about', 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': f'{base_url}/experience', 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': f'{base_url}/archive', 'priority': '0.6', 'changefreq': 'yearly'},
        {'loc': f'{base_url}/resume.pdf', 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': f'{base_url}/fragments', 'priority': '0.9', 'changefreq': 'weekly'},
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
        posts_dir = 'posts'
        filename = post.get('filename', '')
        if filename:
            filepath = os.path.join(posts_dir, filename)
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
        xml_parts.append(f'    <loc>{base_url}/fragments/post/{post["slug"]}</loc>')
        if lastmod_str:
            xml_parts.append(f'    <lastmod>{lastmod_str}</lastmod>')
        xml_parts.append('    <changefreq>monthly</changefreq>')
        xml_parts.append('    <priority>0.7</priority>')
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
    app.run(debug=True, port=5000)