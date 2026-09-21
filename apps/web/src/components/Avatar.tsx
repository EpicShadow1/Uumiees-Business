'use client';

import * as React from 'react';
import { cn } from '@uumiees/utils';

interface AvatarProps {
  name?: string | null;
  email?: string | null;
  src?: string | null;
  size?: number;
  className?: string;
  ring?: boolean;
}

function paletteFor(seed: string) {
  const colors = [
    { bg: 'bg-[#173B8F]', fg: 'text-white' },
    { bg: 'bg-[#D4AF37]', fg: 'text-[#081A3A]' },
    { bg: 'bg-[#1F8A5B]', fg: 'text-white' },
    { bg: 'bg-[#C73E3A]', fg: 'text-white' },
    { bg: 'bg-[#081A3A]', fg: 'text-[#D4AF37]' },
    { bg: 'bg-[#F4E7C5]', fg: 'text-[#081A3A]' },
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return colors[Math.abs(h) % colors.length];
}

function initialsFor(name?: string | null, email?: string | null) {
  const s = (name || email || '?').trim();
  if (!s || s === '?') return '?';
  const parts = s.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export function Avatar({ name, email, src, size = 40, className, ring }: AvatarProps) {
  const [failed, setFailed] = React.useState(false);
  const seed = (name || email || '').toLowerCase();
  const { bg, fg } = paletteFor(seed);
  const style = { width: size, height: size, fontSize: size * 0.4, lineHeight: `${size}px` };
  return (
    <div
      aria-hidden={!name}
      aria-label={name ? `${name} avatar` : undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-full overflow-hidden font-semibold select-none',
        ring && 'ring-2 ring-white shadow-md',
        className,
      )}
      style={style}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={name || email || ''}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className={cn('w-full h-full text-center', bg, fg)}>{initialsFor(name, email)}</span>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: { name?: string | null; email?: string | null; src?: string | null }[];
  size?: number;
  max?: number;
  className?: string;
}

export function AvatarGroup({ avatars, size = 32, max = 4, className }: AvatarGroupProps) {
  const shown = avatars.slice(0, max);
  const extra = avatars.length - shown.length;
  return (
    <div className={cn('flex -space-x-2', className)}>
      {shown.map((a, i) => (
        <Avatar key={i} {...a} size={size} ring />
      ))}
      {extra > 0 && (
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-[#F4F5F7] text-[#171A21] font-semibold ring-2 ring-white',
          )}
          style={{ width: size, height: size, fontSize: size * 0.35 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
