# Automystics — VPS Deployment (Ubuntu 22.04 / 24.04)

Stack: **Nginx (static + reverse proxy) + PM2 (Node API) + local PostgreSQL**.

Assumes the repo is at `/var/www/automystics`. Replace paths if yours differs.

---

## 1. One-time server prep (run as root or with sudo)

```bash
# Node 20 LTS + build tools
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs build-essential git nginx postgresql postgresql-contrib

# pnpm + pm2 globally
npm install -g pnpm@9 pm2

# Log + app directories
mkdir -p /var/log/automystics
chown -R $USER:$USER /var/www/automystics /var/log/automystics
```

## 2. PostgreSQL — create database + user

```bash
sudo -u postgres psql <<'SQL'
CREATE USER automystics WITH PASSWORD 'CHANGE_ME_STRONG_PW';
CREATE DATABASE automystics OWNER automystics;
GRANT ALL PRIVILEGES ON DATABASE automystics TO automystics;
SQL
```

Verify:
```bash
psql "postgresql://automystics:CHANGE_ME_STRONG_PW@127.0.0.1:5432/automystics" -c '\conninfo'
```

## 3. Configure environment

```bash
cd /var/www/automystics
cp deploy/.env.example artifacts/api-server/.env
nano artifacts/api-server/.env   # fill DATABASE_URL, SESSION_SECRET, ADMIN_PASSWORD
chmod 600 artifacts/api-server/.env

# generate a strong session secret
openssl rand -base64 48
```

## 4. Install dependencies + build

```bash
cd /var/www/automystics
pnpm install --frozen-lockfile

# Backend bundle -> artifacts/api-server/dist/index.mjs
pnpm --filter @workspace/api-server build

# Frontend build -> artifacts/automystics/dist/public
# (vite.config.ts requires PORT and BASE_PATH at build time)
PORT=4173 BASE_PATH=/ pnpm --filter @workspace/automystics build
```

## 5. Create database tables

The app uses Drizzle ORM. Push the schema once:

```bash
cd /var/www/automystics
pnpm --filter @workspace/db exec drizzle-kit push
```

If `drizzle-kit` prompts interactively and that fails over SSH, run with `--force`:
```bash
pnpm --filter @workspace/db exec drizzle-kit push --force
```

Sanity check tables exist:
```bash
psql "$DATABASE_URL" -c '\dt'
```

## 6. Start the API with PM2

```bash
cd /var/www/automystics

# Load .env into PM2's view of the process, then start
pm2 start deploy/ecosystem.config.cjs --update-env

pm2 status
pm2 logs automystics-api --lines 50

# Persist across reboots
pm2 save
pm2 startup systemd -u $USER --hp $HOME   # run the printed command as root
```

Quick health check:
```bash
curl -s http://127.0.0.1:8080/api/healthz
```

> **Note:** All environment variables (including `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD`, `PORT`, `LOG_LEVEL`) are loaded from `artifacts/api-server/.env` via Node's built-in `--env-file=.env` flag (`node_args` in `ecosystem.config.cjs`). Requires Node 20.6+.

## 7. Nginx — serve frontend + proxy /api

```bash
cp /var/www/automystics/deploy/nginx.conf /etc/nginx/sites-available/automystics
sed -i 's/YOUR_SERVER_IP_OR_DOMAIN/your.vps.ip.or.host/' /etc/nginx/sites-available/automystics
ln -sf /etc/nginx/sites-available/automystics /etc/nginx/sites-enabled/automystics
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
```

Open the firewall:
```bash
ufw allow 'Nginx Full'    # ports 80 + 443
```

Visit `http://YOUR_SERVER_IP/` — the site should load. Admin lives at `/admin/login`.

## 8. (Optional but recommended) HTTPS with Let's Encrypt

Only after you point a real domain at the VPS:
```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot will rewrite the Nginx config to add SSL and auto-renew via systemd timer.

---

## Re-deploying after a code update

```bash
cd /var/www/automystics
git pull
pnpm install --frozen-lockfile

pnpm --filter @workspace/api-server build
PORT=4173 BASE_PATH=/ pnpm --filter @workspace/automystics build

# If schema changed:
pnpm --filter @workspace/db exec drizzle-kit push --force

pm2 reload automystics-api --update-env
# Frontend is static — Nginx will serve the new files immediately.
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| 502 from Nginx | `pm2 status`, then `pm2 logs automystics-api`. Confirm port 8080 is listening: `ss -ltnp \| grep 8080`. |
| Login works but session lost | Behind HTTPS the cookie is `secure: true`. Make sure you're hitting `https://` and Nginx forwards `X-Forwarded-Proto $scheme` (already in our config). |
| Admin password not accepted | The default admin only seeds when the table is empty. Set `ADMIN_PASSWORD` **before** the first boot, or wipe `admin_users` and restart. |
| `BASE_PATH` / `PORT` build error | Both env vars must be present for the Vite build: `PORT=4173 BASE_PATH=/ pnpm --filter @workspace/automystics build`. |
| Cannot connect to Postgres | Check `pg_hba.conf` allows `127.0.0.1` md5 auth (default on Ubuntu). Restart: `systemctl restart postgresql`. |
| Email not sending | Configure SMTP from `/admin` → Email Settings → save → "Send test email". |
