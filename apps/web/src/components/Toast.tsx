'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@uumiees/utils';
import { useToastStore, type ToastVariant } from '@/stores/useToastStore';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const variants: Record<ToastVariant, { icon: LucideIcon; ring: string; bg: string; accent: string }> = {
  success: {
    icon: CheckCircle,
    ring: 'ring-[#1F8A5B]/30',
    bg: 'bg-white border-[#1F8A5B]/20',
    accent: 'text-[#1F8A5B]',
  },
  error: {
    icon: AlertCircle,
    ring: 'ring-[#C73E3A]/30',
    bg: 'bg-white border-[#C73E3A]/20',
    accent: 'text-[#C73E3A]',
  },
  warning: {
    icon: AlertTriangle,
    ring: 'ring-[#D99A00]/30',
    bg: 'bg-white border-[#D99A00]/20',
    accent: 'text-[#D99A00]',
  },
  info: {
    icon: Info,
    ring: 'ring-[#173B8F]/30',
    bg: 'bg-white border-[#173B8F]/20',
    accent: 'text-[#173B8F]',
  },
};

export function ToastViewport() {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:right-4 sm:top-4 sm:inset-x-auto sm:items-end"
    />
  );
}

export function ToastItem({
  id,
  title,
  description,
  variant,
  onDismiss,
}: {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
  onDismiss: (id: string) => void;
}) {
  const v = variants[variant];
  const Icon = v.icon;
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border shadow-lg ring-1',
        v.bg,
        v.ring,
      )}
      style={{ animation: 'slideIn 180ms ease-out both' }}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={cn('mt-0.5 shrink-0', v.accent)} size={20} />
        <div className="flex-1 min-w-0">
          {title && <p className={cn('font-semibold text-[#171A21] text-sm')}>{title}</p>}
          {description && (
            <p className={cn('text-sm text-[#171A21]/70 mt-0.5 leading-relaxed', !title && 'text-[#171A21] font-medium')}>
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDismiss(id)}
          aria-label="Dismiss"
          className="text-[#171A21]/40 hover:text-[#171A21] transition shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:right-4 sm:top-4 sm:inset-x-auto sm:items-end"
      >
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            id={t.id}
            title={t.title}
            description={t.description}
            variant={t.variant}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </>
  );
}

export const toast = useToastStore.getState().toast;
