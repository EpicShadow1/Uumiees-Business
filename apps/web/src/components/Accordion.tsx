'use client';

import * as React from 'react';
import { cn } from '@uumiees/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  className?: string;
}

interface AccCtxValue {
  type: 'single' | 'multiple';
  open: string[];
  toggle: (value: string) => void;
}

const AccCtx = React.createContext<AccCtxValue | null>(null);

export function Accordion({ children, type = 'single', defaultValue, className }: AccordionProps) {
  const initial = Array.isArray(defaultValue)
    ? defaultValue
    : typeof defaultValue === 'string'
    ? [defaultValue]
    : [];
  const [open, setOpen] = React.useState<string[]>(initial);
  const ctx: AccCtxValue = {
    type,
    open,
    toggle: (v) => {
      setOpen((prev) => {
        const has = prev.includes(v);
        if (type === 'single') return has ? [] : [v];
        return has ? prev.filter((x) => x !== v) : [...prev, v];
      });
    },
  };
  return (
    <AccCtx.Provider value={ctx}>
      <div className={cn('divide-y divide-[#F4F5F7] rounded-xl border border-[#F4F5F7] overflow-hidden bg-white', className)}>
        {children}
      </div>
    </AccCtx.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({ value, title, subtitle, children, className }: AccordionItemProps) {
  const ctx = React.useContext(AccCtx);
  if (!ctx) throw new Error('AccordionItem must be inside Accordion');
  const isOpen = ctx.open.includes(value);
  return (
    <div className={cn(className)}>
      <button
        type="button"
        onClick={() => ctx.toggle(value)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-[#F4F5F7]/40 transition"
      >
        <div className="min-w-0">
          <p className="font-semibold text-[#171A21]">{title}</p>
          {subtitle && <p className="text-sm text-[#171A21]/60 mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-[#173B8F] shrink-0 transition-transform duration-200">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-0 text-sm text-[#171A21]/80 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
