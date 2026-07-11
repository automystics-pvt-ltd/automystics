#!/usr/bin/env bash
# Automystics — re-deploy script for the VPS (Nginx + PM2 + PostgreSQL).
#
# Usage (from anywhere on the server):
#   bash deploy/deploy.sh              # pull, install, build, restart
#   bash deploy/deploy.sh --migrate    # also push DB schema changes (drizzle-kit push --force)
#   bash deploy/deploy.sh --branch foo # deploy a specific branch instead of the current one
#
# See deploy/DEPLOY.md for the full one-time setup. This script only covers
# the "re-deploy after a code update" steps.

set -euo pipefail

# Resolve repo root (this script lives in <repo>/deploy/deploy.sh).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

MIGRATE=false
BRANCH=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --migrate) MIGRATE=true; shift ;;
    --branch) BRANCH="$2"; shift 2 ;;
    -h|--help)
      grep '^#' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }

log "Repo: $REPO_ROOT"

log "Pulling latest code"
if [[ -n "$BRANCH" ]]; then
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
else
  git pull
fi

log "Installing dependencies (pnpm install --frozen-lockfile)"
pnpm install --frozen-lockfile

log "Building API server (artifacts/api-server/dist/index.mjs)"
pnpm --filter @workspace/api-server build

log "Building frontend (artifacts/automystics/dist/public)"
PORT=8090 BASE_PATH=/ pnpm --filter @workspace/automystics build

if [[ "$MIGRATE" == true ]]; then
  log "Pushing database schema changes (drizzle-kit push --force)"
  pnpm --filter @workspace/db exec drizzle-kit push --force
fi

log "Reloading API with PM2 (automystics-api)"
pm2 reload automystics-api --update-env

log "Health check"
sleep 1
if curl -fsS http://127.0.0.1:8080/api/healthz > /dev/null; then
  echo "API healthy."
else
  echo "WARNING: health check failed. Run: pm2 logs automystics-api --lines 50" >&2
fi

log "Done. Nginx serves the new frontend files immediately (no reload needed)."
pm2 status automystics-api
