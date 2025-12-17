/**
 * Platform detection utilities for marketing site vs native app
 * SSR-safe: All functions return safe defaults when window is undefined
 */

// Type for Capacitor global object
interface CapacitorInstance {
  isNativePlatform: () => boolean;
  getPlatform: () => string;
}

// Access Capacitor from window if available (SSR-safe)
const getCapacitor = (): CapacitorInstance | null => {
  if (typeof window === 'undefined') return null;
  // Capacitor attaches itself to window when loaded
  const win = window as unknown as { Capacitor?: CapacitorInstance };
  return win.Capacitor ?? null;
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
