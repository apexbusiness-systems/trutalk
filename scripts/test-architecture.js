#!/usr/bin/env node

/**
 * Architecture Test Script
 * Validates the architecture setup and runs basic checks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, required = true) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✓ ${filePath}`, 'green');
    return true;
  } else {
    if (required) {
      log(`✗ ${filePath} (REQUIRED)`, 'red');
      return false;
    } else {
      log(`⚠ ${filePath} (optional)`, 'yellow');
      return true;
    }
  }
}

function checkDirectory(dirPath, required = true) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  if (exists) {
    log(`✓ ${dirPath}/`, 'green');
    return true;
  } else {
    if (required) {
      log(`✗ ${dirPath}/ (REQUIRED)`, 'red');
      return false;
    } else {
      log(`⚠ ${dirPath}/ (optional)`, 'yellow');
      return true;
    }
  }
}

function validatePackageJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const pkg = JSON.parse(content);
    
    if (!pkg.name) {
      log(`  ⚠ Missing 'name' field`, 'yellow');
      return false;
    }
    
    if (!pkg.version) {
      log(`  ⚠ Missing 'version' field`, 'yellow');
      return false;
    }
    
    return true;
  } catch (error) {
    log(`  ✗ Invalid JSON: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('\n🔍 TRU Talk Architecture Validation\n', 'blue');
  
  let allPassed = true;
  
  // Check directory structure
  log('📁 Directory Structure:', 'blue');
  allPassed = checkDirectory('apps/mobile') && allPassed;
  allPassed = checkDirectory('apps/web') && allPassed;
  allPassed = checkDirectory('packages/shared') && allPassed;
  allPassed = checkDirectory('packages/backend') && allPassed;
  allPassed = checkDirectory('packages/ai') && allPassed;
  
  // Check package.json files
  log('\n📦 Package Files:', 'blue');
  allPassed = checkFile('apps/mobile/package.json') && allPassed;
  if (checkFile('apps/mobile/package.json')) {
    validatePackageJson('apps/mobile/package.json');
  }
  
  allPassed = checkFile('apps/web/package.json') && allPassed;
  if (checkFile('apps/web/package.json')) {
    validatePackageJson('apps/web/package.json');
  }
  
  allPassed = checkFile('packages/shared/package.json') && allPassed;
  
  // Check TypeScript configs
  log('\n📝 TypeScript Configurations:', 'blue');
  allPassed = checkFile('apps/mobile/tsconfig.json') && allPassed;
  allPassed = checkFile('apps/web/tsconfig.json') && allPassed;
  allPassed = checkFile('tsconfig.json') && allPassed;
  
  // Check key application files
  log('\n🔑 Key Application Files:', 'blue');
  checkFile('apps/mobile/app.json', false);
  checkFile('apps/mobile/App.tsx', false);
  checkFile('apps/web/next.config.js', false);
  checkFile('apps/web/app/layout.tsx', false);
  checkFile('apps/web/app/page.tsx', false);
  
  // Check test configurations
  log('\n🧪 Test Configurations:', 'blue');
  checkFile('apps/mobile/jest.config.js', false);
  checkFile('apps/web/jest.config.js', false);
  checkFile('jest.config.js', false);
  
  // Check documentation
  log('\n📚 Documentation:', 'blue');
  checkFile('docs/ARCHITECTURE.md', false);
  checkFile('docs/MIGRATION_GUIDE.md', false);
  checkFile('ARCHITECTURE_SUMMARY.md', false);
  
  // Summary
  log('\n' + '='.repeat(50), 'blue');
  if (allPassed) {
    log('✅ Architecture validation PASSED!', 'green');
    log('\nNext steps:', 'blue');
    log('  1. npm install', 'yellow');
    log('  2. Set up .env files', 'yellow');
    log('  3. npm run typecheck', 'yellow');
    log('  4. npm test', 'yellow');
  } else {
    log('❌ Architecture validation FAILED!', 'red');
    log('Please fix the issues above before proceeding.', 'red');
    process.exit(1);
  }
  log('='.repeat(50) + '\n', 'blue');
}

main();


