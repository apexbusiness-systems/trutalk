# 🧪 TRU Talk Testing Guide

## Overview

This guide explains how to test and validate the TRU Talk architecture.

---

## 🚀 Quick Start

### 1. Validate Architecture
```bash
# Run architecture validation
npm run validate

# Or use the shell script
npm run validate:arch
```

### 2. Run All Tests
```bash
# Run all tests across the monorepo
npm test

# Run tests for specific app
cd apps/mobile && npm test
cd apps/web && npm test
```

### 3. Type Checking
```bash
# Check TypeScript across all packages
npm run typecheck

# Check specific app
cd apps/mobile && npm run typecheck
cd apps/web && npm run typecheck
```

---

## 📱 Mobile App Testing

### Setup
```bash
cd apps/mobile
npm install
```

### Run Tests
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Test Files
- `__tests__/hooks/use-auth.test.tsx` - Authentication hook tests
- `__tests__/components/voice/VoiceRecorder.test.tsx` - Voice recorder tests

### Configuration
- **Jest Config**: `apps/mobile/jest.config.js`
- **Setup File**: `apps/mobile/jest.setup.js`
- **Test Environment**: `jest-expo` (React Native)

---

## 🌐 Web App Testing

### Setup
```bash
cd apps/web
npm install
```

### Run Tests
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e
```

### Test Files
- `__tests__/components/ui/button.test.tsx` - Button component tests
- `__tests__/app/page.test.tsx` - Home page tests

### Configuration
- **Jest Config**: `apps/web/jest.config.js`
- **Setup File**: `apps/web/jest.setup.js`
- **Test Environment**: `jsdom` (DOM simulation)

---

## 📦 Shared Package Testing

### Setup
```bash
cd packages/shared
npm install
```

### Run Tests
```bash
npm test
```

### Test Files
- `__tests__/utils.test.ts` - Utility function tests

---

## ✅ Architecture Validation

### Automated Validation

The `scripts/test-architecture.js` script validates:
- ✅ Directory structure
- ✅ Package.json files
- ✅ TypeScript configurations
- ✅ Key application files
- ✅ Test configurations
- ✅ Documentation

### Run Validation
```bash
npm run validate
```

### What It Checks

1. **Directory Structure**
   - `apps/mobile/` exists
   - `apps/web/` exists
   - `packages/shared/` exists
   - `packages/backend/` exists
   - `packages/ai/` exists

2. **Package Files**
   - All `package.json` files exist
   - Valid JSON structure
   - Required fields (name, version)

3. **TypeScript Configs**
   - `apps/mobile/tsconfig.json`
   - `apps/web/tsconfig.json`
   - Root `tsconfig.json`

4. **Key Files**
   - Mobile app entry point
   - Web app entry point
   - Configuration files

---

## 🔍 Manual Testing Checklist

### Mobile App
- [ ] App starts without errors
- [ ] Navigation works (tabs, auth)
- [ ] Voice recording component renders
- [ ] Authentication flow works
- [ ] TypeScript compiles without errors

### Web App
- [ ] Home page loads
- [ ] Download page loads
- [ ] Links work correctly
- [ ] Responsive design works
- [ ] TypeScript compiles without errors

### Shared Packages
- [ ] Types are exported correctly
- [ ] Utilities work as expected
- [ ] No circular dependencies

---

## 🐛 Troubleshooting

### Issue: Tests not finding modules
**Solution**: Check `moduleNameMapper` in Jest config matches your path aliases.

### Issue: TypeScript errors in tests
**Solution**: Ensure `tsconfig.json` includes test files and has correct paths.

### Issue: Expo modules not mocked
**Solution**: Add mocks to `jest.setup.js` for any Expo modules you use.

### Issue: Next.js router errors
**Solution**: Ensure `next/navigation` is mocked in `jest.setup.js`.

---

## 📊 Test Coverage Goals

### Current Coverage
- Mobile App: ~30% (basic tests)
- Web App: ~30% (basic tests)
- Shared Packages: ~20% (placeholder tests)

### Target Coverage
- **Unit Tests**: 80% coverage
- **Integration Tests**: 60% coverage
- **E2E Tests**: Critical paths only

---

## 🎯 Next Steps

1. **Add More Tests**
   - [ ] API endpoint tests
   - [ ] Integration tests
   - [ ] E2E tests (Detox, Playwright)

2. **Improve Coverage**
   - [ ] Test all hooks
   - [ ] Test all components
   - [ ] Test utilities

3. **CI/CD Integration**
   - [ ] Run tests on PR
   - [ ] Coverage reports
   - [ ] Test badges

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [React Testing Library](https://testing-library.com/react)
- [Expo Testing Guide](https://docs.expo.dev/guides/testing-with-jest/)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)

---

**Last Updated**: 2025-01-XX

