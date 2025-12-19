// apps/web/types/testing-library-react-screen.d.ts
//
// Test-only type augmentation for @testing-library/react to add `screen`.
// This keeps production types untouched while unblocking `tsc --noEmit`.
//
// Acceptance criteria:
// - TypeScript recognizes `screen` export from @testing-library/react in test files
// - No runtime behavior changes
// - Production code types remain unchanged
//
// Rollback: Delete this file if it causes issues

import '@testing-library/react';

declare module '@testing-library/react' {
  // `screen` exists at runtime; we only need TS to know it exists.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const screen: any;
}

