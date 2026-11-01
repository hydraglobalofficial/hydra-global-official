#!/usr/bin/env bash
# First-time Ubuntu VPS bootstrap. Run from the repo root as root (or sudo).
# Does not print secrets. Edit .env before starting the app.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RAID_ROOT="${RAID_ROOT:-/mnt/raid/hydra}"
APP_USER="${APP_USER:-hydra}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/setup.sh"
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl gnupg git nginx redis-server

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

corepack enable
corepack prepare pnpm@8.15.9 --activate

# Redis stays on localhost. Do not open 6379 to the internet.
if [[ -f /etc/redis/redis.conf ]]; then
  sed -i 's/^bind .*/bind 127.0.0.1 ::1/' /etc/redis/redis.conf || true
  sed -i 's/^supervised .*/supervised systemd/' /etc/redis/redis.conf || true
fi
systemctl enable --now redis-server || systemctl enable --now redis
systemctl restart redis-server || systemctl restart redis

if ! id -u "${APP_USER}" >/dev/null 2>&1; then
  useradd --system --create-home --shell /usr/sbin/nologin "${APP_USER}"
fi

mkdir -p "${RAID_ROOT}/postgres" "${RAID_ROOT}/uploads"
chown -R "${APP_USER}:${APP_USER}" "${RAID_ROOT}/uploads"
# Postgres container runs as uid 999 inside the image.
chown -R 999:999 "${RAID_ROOT}/postgres" || true

if [[ ! -f "${REPO_ROOT}/.env" ]]; then
  cp "${REPO_ROOT}/.env.example" "${REPO_ROOT}/.env"
  echo "Created ${REPO_ROOT}/.env from .env.example — set POSTGRES_PASSWORD, AUTH_SECRET, ADMIN_MASTER_KEY, then re-run."
fi

cd "${REPO_ROOT}"
docker compose up -d postgres

echo
echo "Next:"
echo "  1. Edit .env — DATABASE_URL / DIRECT_URL to 127.0.0.1, STORAGE_DRIVER=local, UPLOAD_DIR=${RAID_ROOT}/uploads, POSTGRES_DATA_DIR=${RAID_ROOT}/postgres"
echo "  2. pnpm install"
echo "  3. pnpm db:deploy && pnpm db:seed"
echo "  4. pnpm build && sudo systemctl enable --now hydra"
echo "  5. Copy deploy/nginx.conf into sites-available and reload nginx"
echo "  6. Copy deploy/hydra.service to /etc/systemd/system/hydra.service (fix User= if needed)"
