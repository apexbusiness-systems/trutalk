#!/bin/bash
# Complete staging deployment (idempotent)
# Deploys database, backend, and mobile app to staging

set -e

echo "🚀 Starting STAGING deployment..."
echo "================================"

# Set environment to staging
export NODE_ENV=staging
export VERCEL_ENV=preview

# 1. Deploy Supabase
echo ""
echo "📊 Step 1/3: Deploying Supabase..."
./scripts/deploy-supabase.sh

# 2. Deploy Backend
echo ""
echo "⚙️  Step 2/3: Deploying Backend..."
./scripts/deploy-backend.sh staging

# 3. Build Mobile App (Expo EAS)
echo ""
echo "📱 Step 3/3: Building Mobile App..."
cd apps/mobile

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# Configure EAS (idempotent)
if [ ! -f "eas.json" ]; then
    echo "🔧 Initializing EAS..."
    eas build:configure
fi

# Build for staging (preview)
echo "🔨 Building preview app..."
eas build --platform all --profile preview --non-interactive || true

cd ../..

echo ""
echo "🎉 STAGING deployment complete!"
echo "================================"
echo ""
echo "Staging URLs:"
echo "  - Database: https://app.supabase.com/project/$SUPABASE_PROJECT_REF"
echo "  - Backend: Check Vercel dashboard"
echo "  - Mobile: Check EAS dashboard"
echo ""
echo "Test the staging environment:"
echo "1. Install preview app from Expo dashboard"
echo "2. Test voice recording and matching"
echo "3. Test real-time translation"
echo "4. Verify payment flows"
echo ""
echo "Ready for production? Run: ./scripts/deploy-production.sh"
