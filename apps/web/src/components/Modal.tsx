'use client';

import * as React from 'react';
import { cn } from '@uumiees/utils';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
}

const sizes: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="uumiees-modal-title"
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-[#081A3A]/50 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
        onClick={() => closeOnBackdrop && onClose()}
      />
      <div
        className={cn(
          'relative w-full',
          sizes[size],
          'm-0 sm:m-6',
          'bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl',
          'border border-[#F4F5F7]',
          'animate-[modalIn_180ms_ease-out]',
          'max-h-[90vh] flex flex-col',
        )}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes modalIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
        `}</style>
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-3 border-b border-[#F4F5F7]">
            <div className="min-w-0">
              {title && (
                <h2 id="uumiees-modal-title" className="text-xl font-bold text-[#171A21]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-sm text-[#171A21]/70">{description}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-lg text-[#171A21]/50 hover:bg-[#F4F5F7] hover:text-[#171A21] transition shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-[#F4F5F7] flex gap-2 flex-wrap">{footer}</div>}
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-[#F4F5F7] text-[#171A21] hover:bg-[#F4F5F7] transition font-medium"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition',
              danger ? 'bg-[#C73E3A] hover:bg-[#A7302B]' : 'bg-[#173B8F] hover:bg-[#081A3A]',
            )}
          >
            {confirmLabel}
          </button>
        </>
      }
    />
  );
}
