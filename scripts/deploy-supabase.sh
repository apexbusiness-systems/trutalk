#!/bin/bash
# Idempotent Supabase deployment script
# Can be run multiple times safely

set -e  # Exit on error

echo "🚀 Deploying Supabase database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if project is linked
if [ ! -f "supabase/.temp/project-ref" ]; then
    echo "📍 Linking to Supabase project..."

    if [ -z "$SUPABASE_PROJECT_REF" ]; then
        # Try to extract from SUPABASE_URL if available
        if [ -n "$SUPABASE_URL" ]; then
            echo "⚠️ SUPABASE_PROJECT_REF not set, attempting to extract from SUPABASE_URL..."
            # Extract subdomain from URL (e.g., https://xyz.supabase.co -> xyz)
            SUPABASE_PROJECT_REF=$(echo "$SUPABASE_URL" | sed -E 's/https?:\/\/([^\.]+)\.supabase\.co.*/\1/')
        fi

        if [ -z "$SUPABASE_PROJECT_REF" ]; then
            echo "❌ SUPABASE_PROJECT_REF environment variable not set"
            echo "Please run: export SUPABASE_PROJECT_REF=your-project-ref"
            exit 1
        fi
        echo "✅ Extracted Project Ref: $SUPABASE_PROJECT_REF"
    fi

    supabase link --project-ref "$SUPABASE_PROJECT_REF"
else
    echo "✅ Already linked to Supabase project"
fi

# Run migrations (idempotent - only applies new migrations)
echo "📊 Running database migrations..."
supabase db push --include-all

# Generate TypeScript types
echo "🔧 Generating TypeScript types..."
supabase gen types typescript --local > packages/shared/src/database.types.ts

# Verify migration status
echo "✅ Checking migration status..."
supabase migration list

echo "🎉 Supabase deployment complete!"
echo ""
echo "Next steps:"
echo "1. Verify database at: https://app.supabase.com/project/$SUPABASE_PROJECT_REF"
echo "2. Check RLS policies are enabled"
echo "3. Test vector search functionality"
