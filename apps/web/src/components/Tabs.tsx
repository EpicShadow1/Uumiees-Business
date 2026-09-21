'use client';

import * as React from 'react';
import { cn } from '@uumiees/utils';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used inside Tabs');
  return ctx;
}

export function Tabs({ defaultValue = '', value, onChange, children, className }: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;
  const ctx: TabsContextValue = {
    value: current,
    setValue: (v) => {
      setInternal(v);
      onChange?.(v);
    },
  };
  return (
    <TabsContext.Provider value={ctx}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-xl bg-[#F4F5F7] p-1 gap-1 w-full sm:w-auto overflow-x-auto',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { value: current, setValue } = useTabs();
  const active = current === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => setValue(value)}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition',
        active
          ? 'bg-white text-[#173B8F] shadow-sm'
          : 'text-[#171A21]/60 hover:text-[#171A21] hover:bg-white/60',
        className,
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: current } = useTabs();
  if (current !== value) return null;
  return (
    <div role="tabpanel" className={cn('mt-4 animate-[fadeIn_150ms_ease-out]', className)}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {children}
    </div>
  );
}
