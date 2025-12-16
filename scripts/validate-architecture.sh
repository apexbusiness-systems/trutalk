#!/bin/bash

# Architecture Validation Script
# Validates that the architecture is set up correctly

set -e

echo "🔍 Validating TRU Talk Architecture..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required directories exist
echo "📁 Checking directory structure..."
REQUIRED_DIRS=(
  "apps/mobile"
  "apps/web"
  "packages/shared"
  "packages/backend"
  "packages/ai"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo -e "${GREEN}✓${NC} $dir exists"
  else
    echo -e "${RED}✗${NC} $dir is missing"
    exit 1
  fi
done

# Check if package.json files exist
echo ""
echo "📦 Checking package.json files..."
PACKAGE_FILES=(
  "apps/mobile/package.json"
  "apps/web/package.json"
  "packages/shared/package.json"
)

for file in "${PACKAGE_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file exists"
  else
    echo -e "${RED}✗${NC} $file is missing"
    exit 1
  fi
done

# Check if TypeScript configs exist
echo ""
echo "📝 Checking TypeScript configurations..."
TS_CONFIGS=(
  "apps/mobile/tsconfig.json"
  "apps/web/tsconfig.json"
)

for config in "${TS_CONFIGS[@]}"; do
  if [ -f "$config" ]; then
    echo -e "${GREEN}✓${NC} $config exists"
  else
    echo -e "${RED}✗${NC} $config is missing"
    exit 1
  fi
done

# Check if key files exist
echo ""
echo "🔑 Checking key application files..."
KEY_FILES=(
  "apps/mobile/app.json"
  "apps/mobile/App.tsx"
  "apps/web/next.config.js"
  "apps/web/app/layout.tsx"
  "apps/web/app/page.tsx"
)

for file in "${KEY_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file exists"
  else
    echo -e "${YELLOW}⚠${NC} $file is missing (may be optional)"
  fi
done

# Check if test configs exist
echo ""
echo "🧪 Checking test configurations..."
TEST_CONFIGS=(
  "apps/mobile/jest.config.js"
  "apps/web/jest.config.js"
)

for config in "${TEST_CONFIGS[@]}"; do
  if [ -f "$config" ]; then
    echo -e "${GREEN}✓${NC} $config exists"
  else
    echo -e "${YELLOW}⚠${NC} $config is missing (will be created)"
  fi
done

echo ""
echo -e "${GREEN}✅ Architecture validation complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run 'npm install' to install dependencies"
echo "  2. Set up environment variables (.env files)"
echo "  3. Run 'npm run typecheck' to verify TypeScript"
echo "  4. Run 'npm test' to run tests"

