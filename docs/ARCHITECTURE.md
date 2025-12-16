# TRU Talk Architecture - Native App & Marketing Site Separation

## 🏗️ Architecture Overview

TRU Talk follows a **monorepo architecture** with clear separation between:
1. **Native Mobile App** (`apps/mobile`) - React Native/Expo for iOS & Android
2. **Marketing Website** (`apps/web`) - Next.js for SEO, landing pages, blog
3. **Shared Packages** (`packages/`) - Business logic, types, utilities
4. **Backend API** (`packages/backend`) - Serverless functions (Vercel)

```
trutalk/
├── apps/
│   ├── mobile/          # 🎯 Native App (React Native/Expo)
│   │   ├── app/         # Expo Router screens
│   │   ├── components/  # Mobile-specific UI components
│   │   ├── hooks/       # Mobile-specific hooks
│   │   └── lib/         # Mobile-specific utilities
│   │
│   └── web/             # 🌐 Marketing Site (Next.js)
│       ├── pages/       # Next.js pages (landing, blog, etc.)
│       ├── components/  # Web-specific components
│       └── public/      # Static assets
│
├── packages/
│   ├── shared/          # 📦 Shared business logic
│   │   ├── types/       # TypeScript types & interfaces
│   │   ├── utils/       # Shared utilities
│   │   └── validators/  # Zod schemas
│   │
│   ├── ui/              # 🎨 Shared UI components (web-compatible)
│   │   └── components/  # Reusable components
│   │
│   ├── backend/         # ⚙️ API endpoints (Vercel serverless)
│   │   └── api/         # API routes
│   │
│   └── ai/              # 🤖 AI integrations
│       └── src/         # Translation, emotion analysis
│
└── supabase/            # 🗄️ Database & migrations
```

---

## 🎯 Native Mobile App (`apps/mobile`)

### Technology Stack
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Query + Zustand
- **UI Library**: React Native Paper / NativeBase
- **Voice**: Expo AV, react-native-audio-recorder-player
- **WebRTC**: Daily.co React Native SDK

### App Structure
```
apps/mobile/
├── app/                      # Expo Router (file-based routing)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/
│   │   ├── index.tsx         # Match/Home screen
│   │   ├── profile.tsx
│   │   ├── matches.tsx
│   │   └── _layout.tsx
│   ├── call/[id].tsx         # Active call screen
│   └── _layout.tsx           # Root layout
│
├── components/
│   ├── voice/
│   │   ├── VoiceRecorder.tsx
│   │   ├── Waveform.tsx
│   │   └── EmotionIndicator.tsx
│   ├── call/
│   │   ├── CallScreen.tsx
│   │   └── TranslationOverlay.tsx
│   └── ui/                   # Mobile-specific UI
│
├── hooks/
│   ├── useVoiceRecording.ts
│   ├── useCall.ts
│   └── useMatch.ts
│
├── lib/
│   ├── api.ts                # API client
│   ├── supabase.ts           # Supabase client
│   └── daily.ts              # Daily.co integration
│
├── app.json                  # Expo config
├── package.json
└── tsconfig.json
```

### Key Features
- ✅ Native iOS & Android builds
- ✅ Push notifications (Expo Notifications)
- ✅ Deep linking support
- ✅ Offline-first architecture
- ✅ Native voice recording
- ✅ Background audio support
- ✅ Biometric authentication

---

## 🌐 Marketing Website (`apps/web`)

### Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Vercel

### Site Structure
```
apps/web/
├── app/                      # Next.js App Router
│   ├── (marketing)/
│   │   ├── page.tsx          # Landing page
│   │   ├── features/
│   │   ├── pricing/
│   │   ├── blog/
│   │   └── about/
│   ├── download/             # App download links
│   └── layout.tsx
│
├── components/
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTA.tsx
│   └── ui/                   # Web-specific UI
│
├── public/
│   ├── images/
│   └── videos/
│
├── next.config.js
├── package.json
└── tsconfig.json
```

### Key Features
- ✅ SEO optimized (meta tags, sitemap, robots.txt)
- ✅ Server-side rendering for fast initial load
- ✅ Blog with MDX support
- ✅ App Store / Play Store download links
- ✅ Analytics (Google Analytics, Plausible)
- ✅ A/B testing support

---

## 📦 Shared Packages

### `packages/shared`
**Purpose**: Business logic, types, validators used by both apps

```typescript
// packages/shared/src/types.ts
export interface User {
  id: string;
  email: string;
  display_name: string;
  // ...
}

export interface VoiceClip {
  id: string;
  user_id: string;
  emotion_vector: number[];
  // ...
}
```

### `packages/ui` (Optional)
**Purpose**: Web-compatible UI components (if needed for web preview)

**Note**: Native app uses React Native components, web uses Next.js components. Only share pure business logic.

---

## 🔄 Data Flow

### Authentication Flow
```
┌─────────────┐
│  Mobile App │
└──────┬──────┘
       │
       ├─> Supabase Auth (JWT)
       │
       └─> Backend API (with JWT)
           │
           └─> Supabase Database
```

### Voice Recording Flow
```
Mobile App
  │
  ├─> Record Audio (Native)
  │
  ├─> Upload to Supabase Storage
  │
  ├─> Call /api/transcribe
  │
  ├─> Call /api/vectorize
  │
  └─> Call /api/find-match
```

---

## 🚀 Deployment Strategy

### Native App
- **iOS**: App Store Connect (TestFlight → Production)
- **Android**: Google Play Console (Internal → Production)
- **CI/CD**: EAS Build (Expo Application Services)
- **OTA Updates**: Expo Updates (for JS bundle)

### Marketing Site
- **Hosting**: Vercel
- **CDN**: Cloudflare (for static assets)
- **Domain**: `trutalk.com` (marketing)
- **App Links**: `app.trutalk.com` (deep links)

---

## 🔐 Environment Variables

### Mobile App (`apps/mobile/.env`)
```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_URL=https://api.trutalk.com
EXPO_PUBLIC_DAILY_API_KEY=
```

### Marketing Site (`apps/web/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=https://api.trutalk.com
```

### Backend (`packages/backend/.env`)
```env
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
GOOGLE_CLOUD_API_KEY=
DEEPL_API_KEY=
DAILY_API_KEY=
STRIPE_SECRET_KEY=
```

---

## 📱 Deep Linking

### Universal Links (iOS) / App Links (Android)
```
Marketing Site: https://trutalk.com/call/abc123
                    ↓
Mobile App: trutalk://call/abc123
```

### Configuration
- **iOS**: `apple-app-site-association` file on marketing site
- **Android**: `assetlinks.json` on marketing site
- **Expo**: Configured in `app.json`

---

## 🧪 Testing Strategy

### Mobile App
- **Unit Tests**: Jest + React Native Testing Library
- **E2E Tests**: Detox (iOS/Android simulators)
- **Visual Regression**: Percy / Chromatic

### Marketing Site
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Lighthouse CI**: Performance monitoring

---

## 📊 Monitoring & Analytics

### Mobile App
- **Crash Reporting**: Sentry React Native
- **Analytics**: Mixpanel / PostHog
- **Performance**: Firebase Performance Monitoring

### Marketing Site
- **Analytics**: Google Analytics 4 + Plausible
- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics + Web Vitals

---

## 🔄 Code Sharing Strategy

### ✅ Share
- Business logic (`packages/shared`)
- Type definitions
- API client utilities
- Validation schemas (Zod)

### ❌ Don't Share
- UI components (React Native ≠ React DOM)
- Navigation (Expo Router ≠ Next.js Router)
- Platform-specific code (native modules)

### ⚠️ Conditional Sharing
- Hooks that don't use platform APIs
- Utility functions (pure JS/TS)
- Constants and configuration

---

## 🎯 Development Workflow

### Local Development
```bash
# Start all apps
npm run dev

# Or individually:
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

---

## 📈 Scalability Considerations

### Mobile App
- **Code Splitting**: Expo Router automatic
- **Bundle Size**: Monitor with `expo-doctor`
- **Caching**: React Query + AsyncStorage
- **Offline**: Redux Persist / Zustand persist

### Marketing Site
- **ISR**: Incremental Static Regeneration
- **CDN**: Cloudflare for static assets
- **Image Optimization**: Next.js Image component
- **API Routes**: Serverless functions (Vercel)

---

## 🔒 Security

### Mobile App
- **Certificate Pinning**: For API calls
- **Secure Storage**: Expo SecureStore
- **Biometric Auth**: Expo LocalAuthentication
- **Code Obfuscation**: Metro bundler config

### Marketing Site
- **CSP**: Content Security Policy headers
- **HTTPS**: Enforced via Vercel
- **Rate Limiting**: Vercel Edge Config
- **DDoS Protection**: Cloudflare

---

## 📝 Next Steps

1. ✅ Set up Expo project in `apps/mobile`
2. ✅ Move current web app to `apps/web`
3. ✅ Create shared packages structure
4. ✅ Configure deep linking
5. ✅ Set up CI/CD for both apps
6. ✅ Implement authentication flow
7. ✅ Add voice recording to mobile app
8. ✅ Deploy marketing site to Vercel

---

**Last Updated**: 2025-01-XX  
**Maintained By**: TRU Talk Engineering Team

