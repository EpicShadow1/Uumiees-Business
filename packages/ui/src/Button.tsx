import * as React from 'react';
import { cn } from '@uumiees/utils';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#173B8F] text-white hover:bg-[#0F2A6B] active:bg-[#081A3A] shadow-[0_4px_20px_-2px_rgba(23,59,143,0.3)]',
  secondary:
    'bg-[#081A3A] text-white hover:bg-[#051226] active:bg-[#030C1C]',
  accent:
    'bg-[#D4AF37] text-white hover:bg-[#B8952F] active:bg-[#977826] shadow-[0_4px_20px_-2px_rgba(212,175,55,0.3)]',
  outline:
    'bg-transparent border-2 border-[#173B8F] text-[#173B8F] hover:bg-[#173B8F] hover:text-white',
  ghost:
    'bg-transparent text-[#173B8F] hover:bg-[#EFF4FF] active:bg-[#DCE7FF]',
  danger:
    'bg-[#C73E3A] text-white hover:bg-[#A5322E] active:bg-[#842824]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-base rounded-lg',
  lg: 'px-7 py-3.5 text-lg rounded-xl',
  xl: 'px-9 py-4 text-xl rounded-2xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#173B8F] focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none',
          'active:scale-[0.98]',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
