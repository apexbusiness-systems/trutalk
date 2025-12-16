# Native App Architecture - Capacitor

## 🏗️ Architecture Overview

TRU Talk uses a **hybrid architecture** that separates the marketing website from the native mobile app:

- **Marketing Site (Web)**: Next.js landing page at `/` with CTAs
- **Native App (Capacitor)**: Opens directly to `/auth`, skipping landing page

## 📱 Native App Setup

The native mobile app is built using **Capacitor**, which wraps the web app for native iOS and Android deployment.

### Technology Stack

- **Framework**: React/Next.js (shared with web)
- **Native Wrapper**: Capacitor
- **Platforms**: iOS & Android
- **Navigation**: Next.js App Router
- **Deep Linking**: Capacitor App Links

### Architecture Benefits

1. **Code Sharing**: Share React components and business logic between web and native
2. **Single Codebase**: Maintain one codebase for web and mobile
3. **Native Features**: Access to native device APIs via Capacitor plugins
4. **Fast Development**: Build once, deploy to web, iOS, and Android

## 🚀 Building Native Apps Locally

### Prerequisites

- Node.js 20+ and npm 9+
- Xcode (for iOS builds) - macOS only
- Android Studio (for Android builds)
- CocoaPods (for iOS) - `sudo gem install cocoapods`

### Step-by-Step Setup

1. **Export to GitHub** (if not already done)
   - Use the "Export to GitHub" button in your development environment
   - Or push your code to GitHub manually

2. **Clone the Repository**
   ```bash
   git clone https://github.com/apexbusiness-systems/trutalk.git
   cd trutalk
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Add Native Platforms**
   ```bash
   # For iOS (macOS only)
   npx cap add ios
   
   # For Android
   npx cap add android
   
   # Or both
   npx cap add ios android
   ```

5. **Build the Web App**
   ```bash
   cd apps/web
   npm run build
   ```

6. **Sync Capacitor**
   ```bash
   # From project root
   npx cap sync
   ```
   This copies the built web app to the native projects.

7. **Fix iOS Deployment Target** (if needed)
   ```bash
   # If you get a CocoaPods error about deployment target, run:
   node scripts/fix-ios-deployment-target.mjs
   cd ios/App
   pod install
   ```

7. **Run on Device/Simulator**
   ```bash
   # iOS (requires Xcode)
   npx cap run ios
   
   # Android (requires Android Studio)
   npx cap run android
   ```

### Alternative: Open in Native IDEs

Instead of `npx cap run`, you can open the native projects in their respective IDEs:

```bash
# Open iOS project in Xcode
npx cap open ios

# Open Android project in Android Studio
npx cap open android
```

Then build and run from the IDE.

## 📂 Project Structure

```
trutalk/
├── apps/
│   ├── web/              # Next.js app (shared with native)
│   │   ├── app/
│   │   │   ├── page.tsx  # Landing page (web only)
│   │   │   └── auth/     # Auth routes (native entry point)
│   │   └── package.json
│   │
│   └── mobile/           # Native app config (if separate)
│       └── capacitor.config.json
│
├── packages/
│   └── shared/           # Shared business logic
│
└── capacitor.config.json  # Root Capacitor config
```

## ⚙️ Configuration

### Capacitor Config (`capacitor.config.json`)

```json
{
  "appId": "com.trutalk.app",
  "appName": "TRU Talk",
  "webDir": "apps/web/.next",
  "server": {
    "url": "http://localhost:3000",
    "cleartext": true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000
    }
  }
}
```

### Native Entry Point

The native app should be configured to:
- **Skip landing page**: Open directly to `/auth` route
- **Handle deep links**: Support `trutalk://` and `https://trutalk.com/call/*`
- **Native navigation**: Use Capacitor's navigation plugin

## 🔗 Deep Linking

### iOS Configuration

In `ios/App/App/Info.plist`:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>trutalk</string>
    </array>
  </dict>
</array>
```

### Android Configuration

In `android/app/src/main/AndroidManifest.xml`:
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="trutalk" />
</intent-filter>
```

## 📦 Capacitor Plugins

Essential plugins for TRU Talk:

- `@capacitor/app`: App lifecycle and deep linking
- `@capacitor/haptics`: Haptic feedback
- `@capacitor/keyboard`: Keyboard management
- `@capacitor/status-bar`: Status bar styling
- `@capacitor/splash-screen`: Splash screen control
- `@capacitor/network`: Network status
- `@capacitor/geolocation`: Location services (optional)
- `@capacitor/camera`: Camera access (for profile photos)
- `@capacitor/microphone`: Microphone access (for voice recording)

Install plugins:
```bash
npm install @capacitor/app @capacitor/haptics @capacitor/keyboard
npx cap sync
```

## 🎯 Routing Strategy

### Web App
- Landing page at `/` (marketing content)
- Auth at `/auth` (login/signup)
- App routes at `/app/*` (protected routes)

### Native App
- **Skip landing**: Opens directly to `/auth`
- **Deep links**: Handle `/call/[id]` routes
- **Navigation**: Use Next.js App Router

### Implementation

In `apps/web/app/_layout.tsx` or similar:
```typescript
import { Capacitor } from '@capacitor/core';

// Redirect to /auth if on native platform
if (Capacitor.isNativePlatform() && pathname === '/') {
  router.replace('/auth');
}
```

## 🚢 Deployment

### iOS App Store

1. Build for production:
   ```bash
   cd apps/web
   npm run build
   npx cap sync ios
   ```

2. Open in Xcode:
   ```bash
   npx cap open ios
   ```

3. Archive and submit via Xcode or:
   ```bash
   # Using fastlane or similar
   fastlane ios release
   ```

### Android Play Store

1. Build for production:
   ```bash
   cd apps/web
   npm run build
   npx cap sync android
   ```

2. Generate signed APK/AAB:
   ```bash
   cd android
   ./gradlew bundleRelease  # For AAB
   # or
   ./gradlew assembleRelease  # For APK
   ```

3. Upload to Play Console

## 🔄 Development Workflow

### Local Development

1. **Start web dev server**:
   ```bash
   cd apps/web
   npm run dev
   ```

2. **In another terminal, sync Capacitor**:
   ```bash
   npx cap sync
   ```

3. **Run on device**:
   ```bash
   npx cap run ios
   # or
   npx cap run android
   ```

### Hot Reload

For faster development, use Capacitor's live reload:

1. Update `capacitor.config.json`:
   ```json
   {
     "server": {
       "url": "http://YOUR_LOCAL_IP:3000",
       "cleartext": true
     }
   }
   ```

2. Run with live reload:
   ```bash
   npx cap run ios -l
   npx cap run android -l
   ```

## 🐛 Troubleshooting

### iOS Deployment Target Error

If you encounter this error during `npx cap sync ios`:
```
[!] CocoaPods could not find compatible versions for pod "CapacitorStatusBar":
Specs satisfying the `CapacitorStatusBar` dependency were found, but they required a higher minimum deployment target.
```

**Fix**: The iOS deployment target must be 13.0 or higher. Run the fix script:
```bash
bash scripts/fix-ios-deployment-target.sh
```

Or manually update `ios/App/App/Podfile`:
```ruby
platform :ios, '13.0'
```

Then run:
```bash
cd ios/App
pod install
```

## 📝 Notes

- **Current Status**: The project currently uses Expo for the mobile app. This document describes the intended Capacitor architecture.
- **Migration**: If migrating from Expo to Capacitor, see `docs/MIGRATION_GUIDE.md`
- **Web App**: The Next.js app serves both the marketing site and the native app content

## 🔗 Related Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Technical Specification](./TECHNICAL_SPECIFICATION.md)
