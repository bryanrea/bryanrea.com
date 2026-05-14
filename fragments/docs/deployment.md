# Fragments — Deployment

## Infrastructure
- **Host:** Digital Ocean VPS — Ubuntu 24.04
- **Web server:** Nginx (reverse proxy, SSL termination, static file serving)
- **App server:** Gunicorn (WSGI, multiple workers)
- **Process manager:** systemd (`fragments-blog` service)
- **SSL:** Let's Encrypt via Certbot (auto-renews)
- **Firewall:** UFW — allows SSH, HTTP, HTTPS only

## Repositories
- **Fragments blog:** `github.com/bryanrea/fragments`
- **Static portfolio site:** separate repo (bryanrea.com root)
Both are deployed independently to the same VPS.

## Standard Deploy Workflow
```bash
# 1. SSH into server
ssh user@bryanrea.com

# 2. Navigate to app directory
cd /var/www/fragments   # (or wherever the app lives)

# 3. Pull latest code
git pull origin main

# 4. Restart the service
sudo systemctl restart fragments-blog

# 5. Verify it's running
sudo systemctl status fragments-blog
```

## Useful systemd Commands
```bash
sudo systemctl start fragments-blog      # Start
sudo systemctl stop fragments-blog       # Stop
sudo systemctl restart fragments-blog    # Restart
sudo systemctl status fragments-blog     # Check status
sudo journalctl -u fragments-blog -f     # Tail logs
sudo journalctl -u fragments-blog -n 50  # Last 50 log lines
```

## Nginx
Config lives at `/etc/nginx/sites-available/fragments` (or similar).
Key behaviors:
- Routes `/fragments/*` to Flask via proxy_pass
- Serves static portfolio site from root
- Handles SSL termination (Certbot configured this)
- Preserves proxy headers for Flask's ProxyFix middleware

```bash
sudo nginx -t                  # Test config before reloading
sudo systemctl reload nginx    # Reload without downtime
```

## File Ownership & Permissions
The app directory uses `www-data` ownership — this is intentional for security (Nginx/Gunicorn run as www-data). Resolving the Git "dubious ownership" warning required:
```bash
git config --global --add safe.directory /path/to/fragments
```
Do not change ownership to resolve Git issues — use `safe.directory` instead.

## SSL Certificates
Managed by Certbot. Auto-renews via systemd timer. Manual renew if needed:
```bash
sudo certbot renew
```

## Python Environment
App runs in an isolated virtual environment:
```bash
source venv/bin/activate    # Activate
pip install -r requirements.txt  # Install/update dependencies
deactivate
```
After adding new dependencies locally, always update `requirements.txt`:
```bash
pip freeze > requirements.txt
```

## Security Principles
- SSH key-only authentication (no password auth)
- `www-data` ownership for production files
- No Git repos in web-accessible directories
- Sensitive config kept out of version control
- Firewall allows only SSH, HTTP, HTTPS
