import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

let _id = 0;
const nextId = () => `toast_${++_id}_${Date.now().toString(36)}`;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  toast: (t) => {
    const id = nextId();
    const duration = t.duration ?? 4000;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    if (duration > 0) {
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
      }, duration);
    }
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clearAll: () => set({ toasts: [] }),
}));

export function toast(t: Omit<Toast, 'id'>) {
  return useToastStore.getState().toast(t);
}
