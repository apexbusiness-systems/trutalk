# Commit Message

```
feat: Separate native app from marketing site with comprehensive testing

## Architecture Changes
- Created separate native mobile app (React Native/Expo) in apps/mobile/
- Created separate marketing website (Next.js) in apps/web/
- Maintained shared packages structure for business logic
- Updated all TypeScript and build configurations

## Mobile App (apps/mobile/)
- Set up Expo Router with file-based routing
- Created authentication flow (login/signup screens)
- Implemented voice recording component
- Added tab navigation structure
- Configured Supabase with secure storage
- Set up error boundaries and React Query

## Marketing Site (apps/web/)
- Set up Next.js 14+ with App Router
- Created landing page with hero section
- Added download page for app store links
- Configured Tailwind CSS with custom animations
- Set up SEO metadata and responsive design

## Testing Infrastructure
- Created Jest configurations for both apps
- Added test files for key components and hooks
- Set up mocks for Expo and Next.js
- Created validation scripts for architecture
- Added comprehensive testing documentation

## Configuration Updates
- Fixed TypeScript paths for new structure
- Updated Babel config for mobile app
- Added test dependencies to package.json files
- Created validation scripts (Node.js and Bash)
- Updated Turbo.json for monorepo builds

## Documentation
- Created ARCHITECTURE.md with full architecture docs
- Created MIGRATION_GUIDE.md for migration steps
- Created TESTING_GUIDE.md for testing instructions
- Added validation and testing summary docs

## Validation
- Architecture validation script passes
- All required directories and files present
- TypeScript configurations validated
- Test infrastructure ready

Breaking Changes:
- Root src/ directory is now legacy (to be migrated)
- Apps must be run from their respective directories

Co-authored-by: AI Assistant
```


