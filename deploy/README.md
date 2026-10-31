# Deploy HYDRA on a VPS

Uploads go to the VPS disk (RAID). Postgres also runs on the VPS. Cloudflare R2 is not required.

## 1. Put the code on the server

```bash
sudo mkdir -p /var/www
sudo git clone <your-repo-url> /var/www/hydra-global
cd /var/www/hydra-global
```

Or rsync from your PC:

```bash
rsync -av --exclude node_modules --exclude .next --exclude .git --exclude .env.local ./ user@VPS:/var/www/hydra-global/
```

## 2. RAID folders + env

```bash
sudo mkdir -p /mnt/raid/hydra/postgres /mnt/raid/hydra/uploads
sudo chmod 775 /mnt/raid/hydra/uploads
cp .env.example .env
```

In `.env` set at least:

```
NEXT_PUBLIC_SITE_URL="https://www.hydraglobalofficial.com"
DATABASE_URL="postgresql://hydra:YOUR_DB_PASSWORD@127.0.0.1:5432/hydra"
DIRECT_URL="postgresql://hydra:YOUR_DB_PASSWORD@127.0.0.1:5432/hydra"
POSTGRES_PASSWORD="YOUR_DB_PASSWORD"
POSTGRES_DATA_DIR="/mnt/raid/hydra/postgres"
STORAGE_DRIVER="local"
UPLOAD_DIR="/mnt/raid/hydra/uploads"
AUTH_SECRET="32+ random chars"
ADMIN_MASTER_KEY="16+ random chars"
```

Leave `R2_*` empty. Change the RAID root if your extra disk is mounted somewhere else (`df -h`).

## 3. Database

```bash
docker compose up -d postgres
```

Already have Postgres on the box? Skip compose and point `DATABASE_URL` / `DIRECT_URL` at that instance instead.

## 4. App

```bash
corepack enable
corepack prepare pnpm@8.15.9 --activate
pnpm install
pnpm db:deploy
pnpm db:seed          # first time only
pnpm build
pnpm start:vps        # or systemd below
```

Admin login after seed: `admin@hydra.com.bd` / the `SEED_ADMIN_PASSWORD` you set in `.env`.

## 5. Nginx + systemd

```bash
sudo cp deploy/hydra.service /etc/systemd/system/hydra.service
sudo cp deploy/nginx.conf /etc/nginx/sites-available/hydra
sudo ln -sf /etc/nginx/sites-available/hydra /etc/nginx/sites-enabled/hydra
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl daemon-reload
sudo systemctl enable --now hydra
```

Then attach TLS (`certbot --nginx`).

## After each code update

```bash
cd /var/www/hydra-global
git pull
pnpm install
pnpm build
sudo systemctl restart hydra
```

`start:vps` / the systemd `ExecStartPre` runs `prisma migrate deploy` so schema updates apply automatically.

## Uploads

Admin **Upload from device** writes to `UPLOAD_DIR` and serves files at `/media/...`. Keep that folder on RAID so images survive OS reinstalls. Do not put `uploads/` in git.
