#!/bin/bash
# Fix iOS deployment target for Capacitor plugins
# This script ensures the Podfile has the correct iOS version (13.0+) required by CapacitorStatusBar

set -e

IOS_DIR="ios/App/App"
PODFILE="$IOS_DIR/Podfile"

if [ ! -f "$PODFILE" ]; then
  echo "⚠️  Podfile not found at $PODFILE"
  echo "   Run 'npx cap add ios' first to create the iOS project"
  exit 1
fi

echo "🔧 Fixing iOS deployment target in Podfile..."

# Check if platform is already set correctly
if grep -q "platform :ios, '13.0'" "$PODFILE" || grep -q "platform :ios, '1[3-9]" "$PODFILE" || grep -q "platform :ios, '[2-9]" "$PODFILE"; then
  echo "✅ iOS deployment target is already 13.0 or higher"
  exit 0
fi

# Backup the Podfile
cp "$PODFILE" "$PODFILE.backup"

# Add or update platform line
if grep -q "^platform :ios" "$PODFILE"; then
  # Update existing platform line
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/^platform :ios.*/platform :ios, '13.0'/" "$PODFILE"
  else
    # Linux
    sed -i "s/^platform :ios.*/platform :ios, '13.0'/" "$PODFILE"
  fi
  echo "✅ Updated iOS deployment target to 13.0"
else
  # Add platform line after the target definition
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "/^target /a\\
platform :ios, '13.0'
" "$PODFILE"
  else
    # Linux
    sed -i "/^target /a platform :ios, '13.0'" "$PODFILE"
  fi
  echo "✅ Added iOS deployment target 13.0"
fi

echo "✅ Podfile updated successfully"
echo "   Run 'cd ios/App && pod install' to apply changes"
