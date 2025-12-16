#!/usr/bin/env node
/**
 * Fix iOS deployment target for Capacitor plugins
 * Ensures Podfile has iOS 13.0+ required by CapacitorStatusBar
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const PODFILE_PATH = join(process.cwd(), 'ios', 'App', 'App', 'Podfile');

if (!existsSync(PODFILE_PATH)) {
  console.warn('⚠️  Podfile not found at', PODFILE_PATH);
  console.warn('   Run "npx cap add ios" first to create the iOS project');
  process.exit(1);
}

console.log('🔧 Fixing iOS deployment target in Podfile...');

let podfileContent = readFileSync(PODFILE_PATH, 'utf8');

// Check if already correct
if (/platform\s*:\s*ios\s*,\s*['"]1[3-9]|platform\s*:\s*ios\s*,\s*['"][2-9]/.test(podfileContent)) {
  console.log('✅ iOS deployment target is already 13.0 or higher');
  process.exit(0);
}

// Backup
const backupPath = PODFILE_PATH + '.backup';
writeFileSync(backupPath, podfileContent);
console.log('📋 Created backup:', backupPath);

// Update or add platform line
if (/^platform\s*:\s*ios/m.test(podfileContent)) {
  // Update existing
  podfileContent = podfileContent.replace(
    /^platform\s*:\s*ios\s*,\s*['"][^'"]+['"]/m,
    "platform :ios, '13.0'"
  );
  console.log('✅ Updated iOS deployment target to 13.0');
} else {
  // Add after target definition
  podfileContent = podfileContent.replace(
    /^(target\s+['"][^'"]+['"])/m,
    "$1\nplatform :ios, '13.0'"
  );
  console.log('✅ Added iOS deployment target 13.0');
}

writeFileSync(PODFILE_PATH, podfileContent);
console.log('✅ Podfile updated successfully');
console.log('   Run "cd ios/App && pod install" to apply changes');
