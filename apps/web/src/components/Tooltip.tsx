'use client';

import * as React from 'react';
import { cn } from '@uumiees/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function Tooltip({ content, children, side = 'top', delay = 150, className }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number | null>(null);
  const show = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(false);
  };
  const pos = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[side];
  const arrow = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#081A3A]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#081A3A]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#081A3A]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#081A3A]',
  }[side];
  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 px-2.5 py-1.5 rounded-lg bg-[#081A3A] text-white text-xs font-medium whitespace-nowrap shadow-lg',
            pos,
          )}
        >
          {content}
          <span
            className={cn(
              'absolute w-0 h-0 border-[4px] border-transparent',
              arrow,
            )}
          />
        </span>
      )}
    </span>
  );
}
