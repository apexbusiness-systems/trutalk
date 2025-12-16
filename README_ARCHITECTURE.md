# TRU Talk - Architecture Overview

## 🏗️ Monorepo Structure

TRU Talk uses a **monorepo architecture** with clear separation between the native mobile app and marketing website.

```
trutalk/
├── apps/
│   ├── mobile/          # 📱 Native App (React Native/Expo)
│   └── web/             # 🌐 Marketing Site (Next.js)
├── packages/
│   ├── shared/          # 📦 Shared business logic
│   ├── backend/         # ⚙️ API endpoints
│   └── ai/              # 🤖 AI integrations
└── supabase/            # 🗄️ Database
```

## 🎯 Quick Start

### Development
```bash
# Install all dependencies
npm install

# Start all apps
npm run dev

# Or start individually:
cd apps/mobile && npm start    # Expo dev server
cd apps/web && npm run dev     # Next.js dev server
```

### Building
```bash
# Build mobile app
cd apps/mobile
eas build --platform ios
eas build --platform android

# Build marketing site
cd apps/web
npm run build
```

## 📱 Native Mobile App

**Location**: `apps/mobile/`

- React Native with Expo
- iOS & Android support
- Voice recording & calls
- Real-time translation
- Emotion-based matching

**Tech Stack**:
- Expo Router (navigation)
- React Query (state)
- Supabase (backend)
- Daily.co (WebRTC)

## 🌐 Marketing Website

**Location**: `apps/web/`

- Next.js 14+ with App Router
- SEO optimized
- Landing pages
- Blog support
- App download links

**Tech Stack**:
- Next.js (framework)
- Tailwind CSS (styling)
- Framer Motion (animations)

## 📦 Shared Packages

**Location**: `packages/shared/`

- TypeScript types
- Business logic
- Validation schemas (Zod)
- API utilities

## 📚 Documentation

- **Architecture**: `docs/ARCHITECTURE.md`
- **Migration Guide**: `docs/MIGRATION_GUIDE.md`
- **Technical Spec**: `docs/TECHNICAL_SPECIFICATION.md`

## 🔗 Links

- **Marketing Site**: https://trutalk.com (when deployed)
- **App Store**: Coming soon
- **Play Store**: Coming soon

---

For detailed architecture information, see `docs/ARCHITECTURE.md`.

