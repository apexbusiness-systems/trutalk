# Migration Guide: Separating Native App from Marketing Site

## Overview

This guide explains the new architecture that separates the native mobile app from the marketing website.

## Architecture Changes

### Before
```
trutalk/
├── src/              # Mixed web app code
├── apps/
│   ├── mobile/       # Empty/placeholder
│   └── web/          # Incomplete
└── packages/          # Shared code
```

### After
```
trutalk/
├── apps/
│   ├── mobile/       # ✅ Native React Native/Expo app
│   └── web/          # ✅ Marketing site (Next.js)
├── packages/
│   ├── shared/       # Business logic, types, validators
│   ├── backend/      # API endpoints
│   └── ai/           # AI integrations
└── src/              # ⚠️ Legacy - to be removed
```

## Migration Steps

### 1. Update Dependencies

```bash
# Install dependencies for all workspaces
npm install

# Mobile app dependencies
cd apps/mobile
npm install

# Web app dependencies
cd apps/web
npm install
```

### 2. Environment Variables

#### Mobile App (`apps/mobile/.env`)
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_API_URL=https://api.trutalk.com
EXPO_PUBLIC_DAILY_API_KEY=your_daily_key
```

#### Web App (`apps/web/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=https://api.trutalk.com
```

### 3. Move Legacy Code

The root `src/` directory contains the old web app. You have two options:

#### Option A: Keep for Reference (Recommended)
- Keep `src/` as reference during migration
- Gradually move components to `apps/web/` as needed
- Remove `src/` once migration is complete

#### Option B: Immediate Migration
- Move `src/pages/Landing.tsx` → `apps/web/app/page.tsx` ✅ (Done)
- Move `src/pages/Auth.tsx` → Not needed (auth handled in mobile app)
- Move `src/pages/Match.tsx` → Not needed (match handled in mobile app)
- Move `src/pages/Profile.tsx` → Not needed (profile handled in mobile app)
- Move `src/components/ui/*` → `apps/web/components/ui/*` (as needed)

### 4. Update Build Scripts

The root `package.json` already has the correct scripts:
```json
{
  "scripts": {
    "dev": "turbo run dev",           # Runs all apps
    "build": "turbo run build",       # Builds all apps
    "test": "turbo run test"           # Tests all apps
  }
}
```

### 5. Development Workflow

#### Start All Apps
```bash
npm run dev
```

#### Start Individual Apps
```bash
# Mobile app (Expo)
cd apps/mobile
npm start

# Web app (Next.js)
cd apps/web
npm run dev
```

### 6. Update Vite Config (Legacy)

The root `vite.config.ts` is for the old web app. You can:
- Keep it for now if you need the old app running
- Remove it once migration is complete
- The new web app uses Next.js (no Vite needed)

### 7. Update Turbo Config

The `turbo.json` is already configured correctly for the monorepo structure.

## Key Differences

### Native App (`apps/mobile`)
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based)
- **UI**: React Native components
- **Platform**: iOS & Android
- **Features**: Voice recording, calls, matching

### Marketing Site (`apps/web`)
- **Framework**: Next.js 14+
- **Navigation**: Next.js App Router
- **UI**: React DOM components
- **Platform**: Web browsers
- **Features**: Landing pages, blog, app download links

## Code Sharing Strategy

### ✅ Share Between Apps
- Business logic (`packages/shared`)
- Type definitions
- API client utilities
- Validation schemas (Zod)

### ❌ Don't Share
- UI components (React Native ≠ React DOM)
- Navigation (Expo Router ≠ Next.js Router)
- Platform-specific code

## Testing

### Mobile App
```bash
cd apps/mobile
npm test              # Unit tests
npm run test:e2e      # E2E tests (Detox)
```

### Web App
```bash
cd apps/web
npm test              # Unit tests
npm run test:e2e      # E2E tests (Playwright)
```

## Deployment

### Mobile App
```bash
cd apps/mobile
eas build --platform ios
eas build --platform android
```

### Web App
```bash
cd apps/web
npm run build
# Deploy to Vercel
```

## Troubleshooting

### Issue: Module not found errors
**Solution**: Ensure all dependencies are installed in the correct workspace.

### Issue: TypeScript errors
**Solution**: Run `npm run typecheck` to verify all types are correct.

### Issue: Expo not starting
**Solution**: Ensure you have Expo CLI installed globally or use `npx expo start`.

## Next Steps

1. ✅ Architecture documentation created
2. ✅ Mobile app structure set up
3. ✅ Marketing site structure set up
4. ⏳ Migrate remaining components from `src/`
5. ⏳ Set up CI/CD for both apps
6. ⏳ Configure deep linking
7. ⏳ Deploy marketing site to Vercel
8. ⏳ Set up EAS for mobile builds

## Questions?

Refer to:
- `docs/ARCHITECTURE.md` - Full architecture documentation
- `apps/mobile/README.md` - Mobile app specific docs
- `apps/web/README.md` - Web app specific docs


