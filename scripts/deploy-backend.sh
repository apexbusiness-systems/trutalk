#!/bin/bash
# Idempotent Vercel backend deployment script
# Can be run multiple times safely

set -e

echo "🚀 Deploying backend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check required environment variables
REQUIRED_VARS=(
    "SUPABASE_URL"
    "SUPABASE_SERVICE_ROLE_KEY"
    "OPENAI_API_KEY"
    "GOOGLE_CLOUD_CREDENTIALS"
    "DEEPL_API_KEY"
    "DAILY_API_KEY"
    "STRIPE_SECRET_KEY"
    "TWILIO_ACCOUNT_SID"
    "TWILIO_AUTH_TOKEN"
    "TWILIO_VERIFY_SERVICE_SID"
)

echo "🔐 Checking environment variables..."
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "⚠️  Warning: $var not set"
    else
        echo "✅ $var is set"
    fi
done

# Build backend
echo "🔨 Building backend..."
cd packages/backend
npm install
npm run build

# Deploy to Vercel
echo "📤 Deploying to Vercel..."
if [ "$1" == "production" ]; then
    echo "🚨 Deploying to PRODUCTION"
    vercel --prod --yes
else
    echo "🧪 Deploying to STAGING"
    vercel --yes
fi

# Set environment variables on Vercel (idempotent)
echo "🔧 Configuring Vercel environment variables..."
for var in "${REQUIRED_VARS[@]}"; do
    if [ -n "${!var}" ]; then
        vercel env add "$var" production "${!var}" --force 2>/dev/null || true
        vercel env add "$var" preview "${!var}" --force 2>/dev/null || true
    fi
done

# Get deployment URL
DEPLOYMENT_URL=$(vercel inspect --wait 2>&1 | grep -o 'https://[^ ]*' | head -1)

echo ""
echo "🎉 Backend deployment complete!"
echo "📍 Deployment URL: $DEPLOYMENT_URL"
echo ""
echo "API Endpoints:"
echo "  - POST $DEPLOYMENT_URL/api/verify-phone"
echo "  - POST $DEPLOYMENT_URL/api/transcribe"
echo "  - POST $DEPLOYMENT_URL/api/vectorize"
echo "  - POST $DEPLOYMENT_URL/api/find-match"
echo "  - POST $DEPLOYMENT_URL/api/start-call"
echo "  - POST $DEPLOYMENT_URL/api/call-webhook"
echo "  - POST $DEPLOYMENT_URL/api/stripe-webhook"
echo "  - POST $DEPLOYMENT_URL/api/daily-drop"
echo "  - POST $DEPLOYMENT_URL/api/cleanup"
echo ""
echo "Next steps:"
echo "1. Test endpoints with: curl -X POST $DEPLOYMENT_URL/api/verify-phone"
echo "2. Configure webhook URLs in Stripe and Daily.co"
echo "3. Set up CRON jobs for daily-drop and cleanup"

cd ../..
