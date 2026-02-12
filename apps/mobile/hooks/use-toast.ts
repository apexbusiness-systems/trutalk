import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
  timeoutId: NodeJS.Timeout | null;
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
}

export const useToast = create<ToastState>((set, get) => ({
  message: '',
  type: 'info',
  visible: false,
  timeoutId: null,
  show: (message, type = 'info') => {
    const currentTimeoutId = get().timeoutId;
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }

    const timeoutId = setTimeout(() => {
      set({ visible: false, timeoutId: null });
    }, 3000);

    set({ message, type, visible: true, timeoutId });
  },
  hide: () => {
    const currentTimeoutId = get().timeoutId;
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }
    set({ visible: false, timeoutId: null });
  },
}));
