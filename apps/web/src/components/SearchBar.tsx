'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@uumiees/utils';
import { useSearchProducts } from '@/hooks/useQueries';
import Link from 'next/link';
import type { Product } from '@uumiees/types';
import { formatCurrency } from '@uumiees/utils';

interface SearchBarProps {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
  className?: string;
  initialValue?: string;
  autoFocus?: boolean;
  onSubmit?: (query: string) => void;
}

export function SearchBar({
  placeholder = 'Search for products, categories…',
  size = 'md',
  variant = 'default',
  className,
  initialValue = '',
  autoFocus,
  onSubmit,
}: SearchBarProps) {
  const router = useRouter();
  const [q, setQ] = React.useState(initialValue);
  const [focused, setFocused] = React.useState(false);
  const [submitted, setSubmitted] = React.useState('');
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const debounced = useDebounce(q, 350);
  const showSuggestions = focused && debounced.trim().length > 0;

  React.useEffect(() => {
    if (initialValue) setQ(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setFocused(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = q.trim();
    if (!text) return;
    setSubmitted(text);
    if (onSubmit) {
      onSubmit(text);
    } else {
      router.push(`/search?q=${encodeURIComponent(text)}`);
      setFocused(false);
    }
  };

  const sizes = {
    sm: 'text-sm px-3 py-2 pl-9 rounded-lg',
    md: 'text-sm px-4 py-3 pl-11 rounded-xl',
    lg: 'text-base px-5 py-4 pl-12 rounded-2xl',
  } as const;

  return (
    <div ref={wrapRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={size === 'sm' ? 14 : 18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#171A21]/40"
        />
        <input
          type="search"
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          aria-label="Search"
          className={cn(
            'w-full bg-white border text-[#171A21] placeholder:text-[#171A21]/40 transition',
            'focus:outline-none focus:ring-2 focus:ring-[#173B8F]/30 focus:border-[#173B8F]/60',
            variant === 'compact' ? 'border-transparent bg-[#F4F5F7] focus:bg-white focus:border-[#173B8F]/60' : 'border-gray-300',
            sizes[size],
          )}
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            aria-label="Clear search"
            className="absolute right-14 sm:right-20 top-1/2 -translate-y-1/2 text-[#171A21]/40 hover:text-[#171A21]"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="submit"
          aria-label="Filters"
          className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F4F5F7] text-xs font-medium text-[#171A21] hover:bg-[#EAECEF] transition"
        >
          <Filter size={12} /> Filters
        </button>
      </form>
      {showSuggestions && (
        <LiveSuggestions query={submitted === debounced ? '' : debounced} onPick={(p) => router.push(`/products/${p.id}`)} />
      )}
    </div>
  );
}

function useDebounce<T>(v: T, ms: number) {
  const [d, setD] = React.useState(v);
  React.useEffect(() => {
    const t = window.setTimeout(() => setD(v), ms);
    return () => window.clearTimeout(t);
  }, [v, ms]);
  return d;
}

function LiveSuggestions({ query, onPick }: { query: string; onPick: (p: Product) => void }) {
  const { data, isLoading } = useSearchProducts(query, 5);
  const items = data ?? [];
  return (
    <div className="absolute z-30 mt-2 w-full rounded-2xl border border-[#F4F5F7] bg-white shadow-xl overflow-hidden animate-[fadeIn_120ms_ease-out]">
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {isLoading && (
        <div className="p-5 text-sm text-[#171A21]/60">Searching…</div>
      )}
      {!isLoading && items.length === 0 && (
        <div className="p-5 text-sm text-[#171A21]/60">No matches. Try broader keywords.</div>
      )}
      <ul>
        {items.slice(0, 5).map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onPick(p)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7]/60 transition border-t border-[#F4F5F7] first:border-0"
            >
              <span className="w-10 h-10 rounded-lg bg-[#F4F5F7] flex items-center justify-center text-xl shrink-0">📦</span>
              <span className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#171A21] truncate">{p.name}</p>
                <p className="text-xs text-[#173B8F] font-semibold">{formatCurrency(p.price)}</p>
              </span>
              <Link
                href={`/products/${p.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs px-2.5 py-1 rounded-md bg-[#173B8F]/5 text-[#173B8F] font-semibold hover:bg-[#173B8F]/10 transition shrink-0"
              >
                View
              </Link>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
