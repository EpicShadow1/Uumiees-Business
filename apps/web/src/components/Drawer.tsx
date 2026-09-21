'use client';

import * as React from 'react';
import { cn } from '@uumiees/utils';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right' | 'bottom';
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnBackdrop?: boolean;
  className?: string;
}

const widths = {
  left: { sm: 'max-w-xs', md: 'max-w-sm', lg: 'max-w-md' },
  right: { sm: 'max-w-xs', md: 'max-w-sm', lg: 'max-w-md' },
  bottom: { sm: 'max-h-[40vh]', md: 'max-h-[60vh]', lg: 'max-h-[85vh]' },
};

export function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  description,
  children,
  size = 'md',
  closeOnBackdrop = true,
  className,
}: DrawerProps) {
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
  const dim = widths[side][size];
  const placement =
    side === 'left'
      ? 'left-0 top-0 bottom-0 h-full'
      : side === 'right'
      ? 'right-0 top-0 bottom-0 h-full'
      : 'left-0 right-0 bottom-0 w-full';
  const sizes = side === 'bottom' ? dim : `w-full ${dim}`;
  return (
    <div className="fixed inset-0 z-[85]">
      <div
        className="absolute inset-0 bg-[#081A3A]/50 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
        onClick={() => closeOnBackdrop && onClose()}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="uumiees-drawer-title"
        className={cn(
          'absolute bg-white shadow-2xl flex flex-col overflow-hidden',
          placement,
          sizes,
          'rounded-none sm:rounded-l-3xl sm:rounded-tr-none',
          side === 'left' && 'sm:rounded-r-3xl sm:rounded-tl-none sm:rounded-bl-none',
          side === 'bottom' && 'sm:rounded-t-3xl sm:rounded-bl-none sm:rounded-br-none',
          'animate-[drawerIn_220ms_ease-out]',
          className,
        )}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes drawerIn {
            from { opacity: 0; transform: ${
              side === 'left' ? 'translateX(-100%)' : side === 'right' ? 'translateX(100%)' : 'translateY(100%)'
            }; }
            to { opacity: 1; transform: translateX(0) translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
        `}</style>
        {(title || description) && (
          <div className="px-6 pt-5 pb-4 border-b border-[#F4F5F7] flex items-start justify-between gap-3">
            <div className="min-w-0">
              {title && (
                <p id="uumiees-drawer-title" className="text-lg font-bold text-[#171A21]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {title}
                </p>
              )}
              {description && <p className="text-sm text-[#171A21]/60 mt-0.5">{description}</p>}
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
      </aside>
    </div>
  );
}
