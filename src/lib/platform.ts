import { Capacitor } from '@capacitor/core';

/**
 * Platform detection utilities for marketing site vs native app
 */
export const isNativeApp = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const isWeb = (): boolean => {
  return !Capacitor.isNativePlatform();
};

export const getPlatform = (): 'ios' | 'android' | 'web' => {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};
