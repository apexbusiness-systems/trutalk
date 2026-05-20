#!/bin/bash
# Deploy frontend build to Cloudflare Pages (non-interactive)
set -euo pipefail

DOMAIN="https://trutalk.icu"
PROJECT_NAME="trutalk"
BUILD_DIR="dist"

required_vars=("CLOUDFLARE_ACCOUNT_ID")

echo "🔐 Checking required Cloudflare environment variables..."
for var in "${required_vars[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "❌ Missing required environment variable: $var"
    exit 1
  fi
  echo "✅ $var is set"
done

# Normalize token sources so CI can inject either legacy or Cloudflare-native key names.
if [ -n "${CLOUDFLARE_AGENT_TOKEN:-}" ]; then
  export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_AGENT_TOKEN"
elif [ -n "${TRUTALK_BUILD_TOKEN:-}" ]; then
  export CLOUDFLARE_API_TOKEN="$TRUTALK_BUILD_TOKEN"
elif [ -n "${CLOUDFLARE_API_TOKEN:-}" ]; then
  export CLOUDFLARE_API_TOKEN
else
  echo "❌ Missing required token env var: CLOUDFLARE_AGENT_TOKEN, TRUTALK_BUILD_TOKEN, or CLOUDFLARE_API_TOKEN"
  exit 1
fi

echo "✅ Cloudflare token source resolved"

echo "📦 Installing dependencies (prefers lockfile-clean install)..."
if ! npm ci; then
  # Fallback keeps deployments unblocked when lockfile drift exists in active branch.
  echo "⚠️ npm ci failed due to lockfile drift; falling back to npm install"
  npm install
fi

echo "🏗️ Building app..."
npm run build

if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ Build directory '$BUILD_DIR' not found"
  exit 1
fi

echo "🚀 Deploying '$BUILD_DIR' to Cloudflare Pages project '$PROJECT_NAME'..."
npx wrangler pages deploy "$BUILD_DIR" \
  --project-name "$PROJECT_NAME" \
  --branch main \
  --commit-dirty=true

echo "✅ Deployment completed. Verify DNS/custom domain for $DOMAIN in Cloudflare Pages settings."
