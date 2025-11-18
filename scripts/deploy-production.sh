#!/bin/bash
# Complete production deployment (idempotent with safety checks)
# Requires manual confirmation before deploying

set -e

echo "🚨 PRODUCTION DEPLOYMENT"
echo "================================"
echo ""
echo "⚠️  WARNING: This will deploy to PRODUCTION"
echo ""
read -p "Have you tested on staging? (yes/no): " TESTED
if [ "$TESTED" != "yes" ]; then
    echo "❌ Please test on staging first: ./scripts/deploy-staging.sh"
    exit 1
fi

read -p "Are all tests passing? (yes/no): " TESTS_PASS
if [ "$TESTS_PASS" != "yes" ]; then
    echo "❌ Please ensure all tests pass: npm run test"
    exit 1
fi

read -p "Type 'DEPLOY PRODUCTION' to confirm: " CONFIRM
if [ "$CONFIRM" != "DEPLOY PRODUCTION" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Set environment to production
export NODE_ENV=production
export VERCEL_ENV=production

# 1. Deploy Supabase
echo ""
echo "📊 Step 1/3: Deploying Supabase..."
./scripts/deploy-supabase.sh

# 2. Deploy Backend
echo ""
echo "⚙️  Step 2/3: Deploying Backend to PRODUCTION..."
./scripts/deploy-backend.sh production

# 3. Submit to App Stores
echo ""
echo "📱 Step 3/3: Submitting to App Stores..."
cd apps/mobile

# Build production apps
echo "🔨 Building production apps..."
eas build --platform ios --profile production --non-interactive --auto-submit
eas build --platform android --profile production --non-interactive --auto-submit

cd ../..

# 4. Create Git tag
VERSION=$(node -p "require('./package.json').version")
git tag -a "v$VERSION" -m "Production release v$VERSION"
git push origin "v$VERSION"

echo ""
echo "🎉 PRODUCTION deployment complete!"
echo "================================"
echo ""
echo "Production URLs:"
echo "  - Database: https://app.supabase.com/project/$SUPABASE_PROJECT_REF"
echo "  - Backend: https://trutalk.com/api"
echo "  - iOS App: https://apps.apple.com/app/trutalk"
echo "  - Android: https://play.google.com/store/apps/trutalk"
echo ""
echo "Post-deployment checklist:"
echo "  ✓ Monitor error logs in Vercel"
echo "  ✓ Check Supabase database performance"
echo "  ✓ Monitor Stripe payments dashboard"
echo "  ✓ Track app store reviews"
echo "  ✓ Monitor analytics (user signups, MAU)"
echo ""
echo "Version: v$VERSION deployed at $(date)"
