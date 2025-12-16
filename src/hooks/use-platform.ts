import { useState, useEffect } from 'react';
import { isNativeApp, getPlatform } from '@/lib/platform';

export function usePlatform() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setPlatform(getPlatform());
    setIsNative(isNativeApp());
  }, []);

  return { platform, isNative, isWeb: !isNative };
}
