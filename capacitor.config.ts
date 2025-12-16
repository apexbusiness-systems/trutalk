import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trutalk.app',
  appName: 'trutalk',
  webDir: 'dist',
  server: {
    url: 'https://9b20b04e-f48e-4b57-809c-83cc21a8b334.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
