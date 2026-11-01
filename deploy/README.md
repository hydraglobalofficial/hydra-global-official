# Fresh VPS install

Ubuntu 22.04 or 24.04. One public IPv4. Domain DNS already points at that IP.

The app listens on `127.0.0.1:3000` only. Nginx is the public door (80/443). Postgres stays on `127.0.0.1:5432`. Redis stays on `127.0.0.1:6379`. Uploads sit on disk. Production login and checkout refuse to run if Redis is not reachable.

## 0. DNS

At the domain host, both records must be the VPS address before TLS:

- `A` `hydraglobalofficial.com` → VPS IP
- `A` `www` → VPS IP

## 1. SSH in as root

```bash
ssh root@YOUR_VPS_IP
apt-get update && apt-get upgrade -y
```

## 2. Code

```bash
mkdir -p /var/www
git clone https://github.com/mahafujriyan/hydra-global.git /var/www/hydra-global
cd /var/www/hydra-global
bash deploy/setup.sh
```

`setup.sh` installs git, Nginx, Docker, Node 22, pnpm 8.15.9, and Redis. It creates the `hydra` system user, and creates `/mnt/raid/hydra/postgres` and `/mnt/raid/hydra/uploads`. Redis listens on localhost only.

No RAID disk yet? Use the system disk:

```bash
mkdir -p /var/lib/hydra/postgres /var/lib/hydra/uploads
```

and set `POSTGRES_DATA_DIR` and `UPLOAD_DIR` to those paths in the next step.

## 3. Environment

```bash
cd /var/www/hydra-global
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Run that node command twice. First value is `AUTH_SECRET`. Second is `ADMIN_MASTER_KEY`.

Edit `.env` and set at least:

```
NEXT_PUBLIC_SITE_URL="https://www.hydraglobalofficial.com"
DATABASE_URL="postgresql://hydra:YOUR_DB_PASSWORD@127.0.0.1:5432/hydra"
DIRECT_URL="postgresql://hydra:YOUR_DB_PASSWORD@127.0.0.1:5432/hydra"
POSTGRES_PASSWORD="YOUR_DB_PASSWORD"
POSTGRES_DATA_DIR="/mnt/raid/hydra/postgres"
STORAGE_DRIVER="local"
UPLOAD_DIR="/mnt/raid/hydra/uploads"
AUTH_SECRET="paste-first-random"
ADMIN_MASTER_KEY="paste-second-random"
SEED_ADMIN_PASSWORD="a-long-password-you-will-type-at-login"
REDIS_URL="redis://127.0.0.1:6379"
```

`YOUR_DB_PASSWORD` must be the same in `DATABASE_URL`, `DIRECT_URL`, and `POSTGRES_PASSWORD`.

Leave `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` empty when Redis is on this VPS. Leave `R2_*` empty when uploads stay on this disk.

SMTP, Pathao, and pixels can stay empty until the store is up. Do not set `ADMIN_REGISTRATION_ENABLED=1`.

```bash
chown hydra:hydra /var/www/hydra-global/.env
chmod 600 /var/www/hydra-global/.env
chown -R hydra:hydra /mnt/raid/hydra/uploads
chown -R 999:999 /mnt/raid/hydra/postgres
```

## 4. Postgres

```bash
cd /var/www/hydra-global
docker compose up -d postgres
docker compose ps
```

Wait until the postgres service is healthy. It is bound to `127.0.0.1:5432` only.

## 5. Build

```bash
cd /var/www/hydra-global
chown -R hydra:hydra /var/www/hydra-global
sudo -u hydra pnpm install
sudo -u hydra pnpm db:deploy
sudo -u hydra pnpm db:seed
sudo -u hydra pnpm build
```

Seed once. Admin is `admin@hydra.com.bd` (or `SEED_ADMIN_EMAIL`) and the `SEED_ADMIN_PASSWORD` you set. Do not seed again on later deploys.

## 6. systemd

```bash
cp deploy/hydra.service /etc/systemd/system/hydra.service
systemctl daemon-reload
systemctl enable --now hydra
systemctl status hydra --no-pager
```

The process must say it is listening on `127.0.0.1:3000`. If `pnpm` is not at `/usr/bin/pnpm`, run `command -v pnpm` and put that path in `ExecStart`.

## 7. Nginx

```bash
cp deploy/nginx.conf /etc/nginx/sites-available/hydra
ln -sf /etc/nginx/sites-available/hydra /etc/nginx/sites-enabled/hydra
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

`deploy/nginx.conf` already sets `X-Real-IP` from the real connection and proxies to `127.0.0.1:3000`. Change `server_name` in that file if the domain is different, then copy it again.

Open the site on port 80 in a browser. You should see the store.

## 8. Firewall

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status
```

Do not allow `3000` or `5432`.

## 9. TLS

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d hydraglobalofficial.com -d www.hydraglobalofficial.com
```

Certbot edits the Nginx site and installs a renew timer. Check with `certbot renew --dry-run`.

## 10. Confirm

- `https://www.hydraglobalofficial.com` loads.
- `https://www.hydraglobalofficial.com/admin/login` loads.
- Log in with the seed email and `SEED_ADMIN_PASSWORD`.
- Upload one image in admin. The file should appear under `UPLOAD_DIR` and the page should use `/media/...`.

## Later updates

```bash
cd /var/www/hydra-global
git pull
sudo -u hydra pnpm install
sudo -u hydra pnpm build
systemctl restart hydra
```

`pnpm start:vps` runs `prisma migrate deploy` before the server, so schema updates apply on restart. Do not run `pnpm db:seed` again.

## If it does not start

```bash
journalctl -u hydra -n 80 --no-pager
docker compose logs postgres --tail 50
nginx -t
```

Login error that mentions Redis: `redis-cli ping` should print `PONG`, and `.env` should contain `REDIS_URL="redis://127.0.0.1:6379"`. Then `systemctl restart hydra`.
