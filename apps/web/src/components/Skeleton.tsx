'use client';

import * as React from 'react';
import { cn } from '@uumiees/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block animate-pulse rounded-lg bg-[#F4F5F7]',
        className,
      )}
    />
  );
}

export function ProductCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
          <Skeleton className="w-full aspect-square rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/3" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-4">
          <Skeleton className="w-24 h-24 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-5 w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
