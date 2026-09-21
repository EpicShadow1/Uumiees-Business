import * as React from 'react';
import { cn } from '@uumiees/utils';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'royal';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-gray-100',
  elevated: 'bg-white shadow-[0_4px_20px_-2px_rgba(23,59,143,0.1)]',
  outlined: 'bg-white border-2 border-[#173B8F]/20',
  royal: 'bg-gradient-to-br from-[#173B8F] to-[#081A3A] text-white border border-[#D4AF37]/30',
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hoverable = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-300',
          variantStyles[variant],
          paddingStyles[padding],
          hoverable && 'hover:shadow-[0_10px_30px_-5px_rgba(23,59,143,0.15)] hover:-translate-y-0.5 cursor-pointer',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4 mb-4 border-b border-gray-100', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-bold text-[#171A21]', className)}
      style={{ fontFamily: "'Playfair Display', serif", ...(props.style || {}) }}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-[#6B7280]', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-4', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4 mt-4 border-t border-gray-100', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
