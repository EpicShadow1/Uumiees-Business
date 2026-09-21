import * as React from 'react';
import { cn } from '@uumiees/utils';

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'outlined' | 'royal';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-9 text-sm px-3 py-1.5 rounded-md',
  md: 'h-11 text-base px-4 py-2.5 rounded-lg',
  lg: 'h-14 text-lg px-5 py-3.5 rounded-xl',
};

const variantStyles: Record<InputVariant, string> = {
  default: 'bg-[#F4F5F7] border border-transparent focus:bg-white focus:border-[#173B8F]',
  outlined: 'bg-white border border-gray-300 focus:border-[#173B8F]',
  royal: 'bg-white border-2 border-[#173B8F]/30 focus:border-[#173B8F]',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = 'md',
      variant = 'default',
      error,
      label,
      helperText,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[#171A21] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              'w-full font-medium text-[#171A21] placeholder-[#9CA3AF]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#173B8F]/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeStyles[size],
              variantStyles[variant],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error &&
                'border-[#C73E3A] focus:border-[#C73E3A] focus:ring-[#C73E3A]/20 bg-red-50',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-[#C73E3A] font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-[#6B7280]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || React.useId();
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-semibold text-[#171A21] mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg font-medium text-[#171A21] placeholder-[#9CA3AF]',
            'bg-[#F4F5F7] border border-transparent focus:bg-white focus:border-[#173B8F]',
            'transition-all duration-200 resize-y',
            'focus:outline-none focus:ring-2 focus:ring-[#173B8F]/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[#C73E3A] focus:border-[#C73E3A] focus:ring-[#C73E3A]/20 bg-red-50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[#C73E3A] font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1.5 text-sm text-[#6B7280]">{helperText}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
