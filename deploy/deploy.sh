#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# deploy.sh — one-command deploy on the production server.
#
# Usage (from anywhere inside the repo):
#   bash deploy/deploy.sh              # deploy main branch
#   bash deploy/deploy.sh --migrate    # also push DB schema changes
#   bash deploy/deploy.sh --branch foo # deploy a specific branch
# ---------------------------------------------------------------------------
set -euo pipefail

MIGRATE=false
BRANCH="main"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --migrate)       MIGRATE=true; shift ;;
    --branch)        BRANCH="$2"; shift 2 ;;
    -h|--help)       grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *)               echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

APP="automystics-api"

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✔  $*${NC}"; }
info() { echo -e "${CYAN}▶  $*${NC}"; }
warn() { echo -e "${YELLOW}⚠  $*${NC}"; }
fail() { echo -e "${RED}✘  $*${NC}"; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN}  Deploying Automystics → $APP             ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}"

# ── Pre-flight: .env + DATABASE_URL must exist before we touch the DB ────────
ENV_FILE="$REPO_ROOT/artifacts/api-server/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  fail ".env not found at $ENV_FILE — run deploy/setup.sh first, or create it manually from deploy/.env.example."
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${DATABASE_URL:-}" ]]; then
  fail "DATABASE_URL is not set in $ENV_FILE — add it before deploying."
fi
ok "Pre-flight checks passed (DATABASE_URL is set)"

TOTAL=5
[[ "$MIGRATE" == true ]] && TOTAL=6

# ── Step 1 — Pull latest code ────────────────────────────────────────────────
info "Step 1/$TOTAL — Pull latest code from git (branch: $BRANCH)"
git fetch origin
git reset --hard "origin/$BRANCH"
ok "Code up to date ($(git rev-parse --short HEAD))"

# ── Step 2 — Install dependencies ────────────────────────────────────────────
info "Step 2/$TOTAL — Install packages (including devDeps needed to build)"
# NODE_ENV=production causes pnpm to skip devDependencies, which breaks
# drizzle-kit and esbuild. Override here; built artefacts run in production.
NODE_ENV=development pnpm install --no-frozen-lockfile --ignore-scripts
ok "Packages up to date"

# ── Step 3 — DB schema (optional) ────────────────────────────────────────────
if [[ "$MIGRATE" == true ]]; then
  info "Step 3/$TOTAL — Push DB schema (drizzle-kit push --force)"
  (cd "$REPO_ROOT/lib/db" && pnpm exec drizzle-kit push --force --config ./drizzle.config.ts)
  ok "DB schema up to date"
  STEP=4
else
  STEP=3
fi

# ── Step 3/4 — Build API server ───────────────────────────────────────────────
info "Step $STEP/$TOTAL — Build API server"
pnpm --filter @workspace/api-server run build
ok "API server built → artifacts/api-server/dist/index.mjs"
STEP=$((STEP + 1))

# ── Step 4/5 — Build frontend ─────────────────────────────────────────────────
info "Step $STEP/$TOTAL — Build frontend (Vite)"
PORT=8090 BASE_PATH=/ pnpm --filter @workspace/automystics run build
ok "Frontend built → artifacts/automystics/dist/public/"
STEP=$((STEP + 1))

# ── Step 5/6 — PM2 restart ────────────────────────────────────────────────────
info "Step $STEP/$TOTAL — Start/Restart PM2: $APP"
pm2 startOrRestart "$REPO_ROOT/deploy/ecosystem.config.cjs" --update-env \
  || fail "Could not start '$APP' — check: pm2 list"
pm2 save

# ── Health check ──────────────────────────────────────────────────────────────
sleep 1
if curl -fsS http://127.0.0.1:8080/api/healthz >/dev/null; then
  ok "API healthy at http://127.0.0.1:8080/api/healthz"
else
  warn "Health check failed — run: pm2 logs $APP --lines 50"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}  Deploy complete!                         ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
pm2 status "$APP"
