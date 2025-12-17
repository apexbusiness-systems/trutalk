/**
 * Platform detection utilities for marketing site vs native app
 * SSR-safe: All functions return safe defaults when window is undefined
 */

// Lazy-loaded Capacitor reference (only loads on client)
let capacitorModule: typeof import('@capacitor/core') | null = null;

const getCapacitor = () => {
  if (typeof window === 'undefined') return null;
  
  // Lazy load Capacitor only on client
  if (!capacitorModule) {
    try {
      // Dynamic require to avoid SSR issues
      capacitorModule = require('@capacitor/core');
    } catch {
      return null;
    }
  }
  return capacitorModule?.Capacitor ?? null;
};

export const isNativeApp = (): boolean => {
  const Capacitor = getCapacitor();
  if (!Capacitor) return false;
  return Capacitor.isNativePlatform();
};

export const isWeb = (): boolean => {
  const Capacitor = getCapacitor();
  if (!Capacitor) return true;
  return !Capacitor.isNativePlatform();
};

export const getPlatform = (): 'ios' | 'android' | 'web' => {
  const Capacitor = getCapacitor();
  if (!Capacitor) return 'web';
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};

/**
 * Async platform detection for cases where accurate detection is critical
 * Use this when you need guaranteed accurate platform info after hydration
 */
export const detectPlatformAsync = async (): Promise<'ios' | 'android' | 'web'> => {
  if (typeof window === 'undefined') return 'web';
  
  try {
    const { Capacitor } = await import('@capacitor/core');
    return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
  } catch {
    return 'web';
  }
};
