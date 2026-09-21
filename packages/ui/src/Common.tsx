import * as React from 'react';
import { cn, generateStars, formatCurrency } from '@uumiees/utils';
import { Star } from 'lucide-react';

export interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  size = 16,
  interactive = false,
  onRate,
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const { filled, half, empty } = generateStars(hoverRating ?? rating);

  const displayRating = hoverRating ?? rating;

  return (
    <div className={cn('inline-flex items-center', className)}>
      <div
        className={cn('flex items-center gap-0.5', interactive && 'cursor-pointer')}
        onMouseLeave={() => interactive && setHoverRating(null)}
      >
        {Array.from({ length: filled }).map((_, i) => (
          <Star
            key={`filled-${i}`}
            size={size}
            className={cn(
              'fill-[#D4AF37] text-[#D4AF37] transition-colors',
              interactive && 'hover:fill-[#B8952F] hover:text-[#B8952F]'
            )}
            onClick={() => interactive && onRate?.(i + 1)}
            onMouseEnter={() => interactive && setHoverRating(i + 1)}
          />
        ))}
        {half && (
          <div className="relative" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="absolute top-0 left-0 text-gray-300"
              onClick={() => interactive && onRate?.(filled + 1)}
              onMouseEnter={() => interactive && setHoverRating(filled + 1)}
            />
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
              <Star
                size={size}
                className="fill-[#D4AF37] text-[#D4AF37]"
                onClick={() => interactive && onRate?.(filled + 0.5)}
                onMouseEnter={() => interactive && setHoverRating(filled + 0.5)}
              />
            </div>
          </div>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            className={cn(
              'text-gray-300 transition-colors',
              interactive && 'hover:fill-[#D4AF37] hover:text-[#D4AF37]'
            )}
            onClick={() => interactive && onRate?.(filled + (half ? 1 : 0) + i + 1)}
            onMouseEnter={() => interactive && setHoverRating(filled + (half ? 1 : 0) + i + 1)}
          />
        ))}
      </div>
      {showValue && (
        <span className="ml-2 text-sm text-[#6B7280] font-medium">
          {displayRating.toFixed(1)}
          {reviewCount !== undefined && ` (${reviewCount})`}
        </span>
      )}
    </div>
  );
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-[#F4F5F7]',
        className
      )}
    >
      {icon && <div className="mb-4 text-[#9CA3AF]">{icon}</div>}
      <h3 className="text-xl font-bold text-[#171A21] mb-2">{title}</h3>
      {description && <p className="text-[#6B7280] mb-6 max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-[#173B8F] text-white rounded-lg font-semibold hover:bg-[#0F2A6B] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', label, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-16 w-16 border-3',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-[#173B8F]/20 border-t-[#173B8F]',
          sizeClasses[size]
        )}
      />
      {label && <p className="text-sm text-[#6B7280] font-medium">{label}</p>}
    </div>
  );
}

export interface PriceTagProps {
  price: number;
  comparePrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceTag({ price, comparePrice, size = 'md', className }: PriceTagProps) {
  const sizeClasses = {
    sm: { price: 'text-sm', compare: 'text-xs' },
    md: { price: 'text-xl', compare: 'text-sm' },
    lg: { price: 'text-3xl', compare: 'text-base' },
  };

  const hasDiscount = comparePrice != null && comparePrice > price;
  const discountPercent = hasDiscount
    ? Math.round((1 - price / comparePrice!) * 100)
    : 0;

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span
        className={cn(
          'font-bold text-[#173B8F]',
          sizeClasses[size].price
        )}
      >
        {formatCurrency(price)}
      </span>
      {hasDiscount && (
        <>
          <span
            className={cn(
              'text-[#9CA3AF] line-through',
              sizeClasses[size].compare
            )}
          >
            {formatCurrency(comparePrice!)}
          </span>
          <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-800 rounded-full">
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
}
