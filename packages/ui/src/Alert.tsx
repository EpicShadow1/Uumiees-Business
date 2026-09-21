import * as React from 'react';
import { cn } from '@uumiees/utils';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const variantConfig: Record<AlertVariant, { bg: string; border: string; iconColor: string; Icon: typeof AlertCircle }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconColor: 'text-[#1F8A5B]',
    Icon: CheckCircle,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-[#C73E3A]',
    Icon: AlertCircle,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    iconColor: 'text-[#D99A00]',
    Icon: AlertTriangle,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-[#173B8F]',
    Icon: Info,
  },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, dismissible = false, onDismiss, children, ...props }, ref) => {
    const config = variantConfig[variant];
    const { Icon } = config;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative flex items-start gap-3 p-4 rounded-xl border',
          config.bg,
          config.border,
          className
        )}
        {...props}
      >
        <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', config.iconColor)} />
        <div className="flex-1 min-w-0">
          {title && (
            <h5 className={cn('font-semibold mb-0.5', config.iconColor)}>{title}</h5>
          )}
          <div className="text-sm text-[#171A21]/80">{children}</div>
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              'p-1 rounded-md transition-colors flex-shrink-0',
              'hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#173B8F]/30'
            )}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-[#171A21]/60" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
}

const badgeVariantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  primary: 'bg-[#173B8F]/10 text-[#173B8F] border-[#173B8F]/20',
  secondary: 'bg-[#081A3A]/10 text-[#081A3A] border-[#081A3A]/20',
  accent: 'bg-[#D4AF37]/10 text-[#977826] border-[#D4AF37]/20',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  outline: 'bg-white text-[#171A21] border-gray-300',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-semibold border rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        badgeVariantStyles[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';
