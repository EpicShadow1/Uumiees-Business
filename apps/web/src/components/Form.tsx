'use client';

import * as React from 'react';
import { cn } from '@uumiees/utils';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const sizes = {
  sm: 'text-sm px-3 py-2',
  md: 'text-sm px-4 py-3',
  lg: 'text-base px-4 py-3.5',
};

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  helperText,
  size = 'md',
  className,
  disabled,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);
  const selected = options.find((o) => o.value === value);
  return (
    <div ref={ref} className={cn('w-full relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-[#171A21] mb-1.5">{label}</label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'w-full rounded-lg border bg-white flex items-center justify-between gap-2 transition focus:outline-none focus:ring-2 focus:ring-[#173B8F]/30 focus:border-[#173B8F]/60',
          sizes[size],
          error ? 'border-[#C73E3A]' : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span className={cn(selected ? 'text-[#171A21]' : 'text-[#171A21]/40')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown size={16} className={cn('text-[#171A21]/50 transition', open && 'rotate-180')} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-40 mt-1.5 w-full rounded-xl border border-[#F4F5F7] bg-white shadow-lg py-1.5 max-h-64 overflow-y-auto animate-[fadeIn_120ms_ease-out]"
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={o.disabled}
                  onClick={() => {
                    if (!o.disabled) {
                      onChange?.(o.value);
                      setOpen(false);
                    }
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition',
                    active ? 'bg-[#173B8F]/5 text-[#173B8F] font-medium' : 'text-[#171A21] hover:bg-[#F4F5F7]',
                    o.disabled && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <span>{o.label}</span>
                  {active && <Check size={14} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {error && <p className="mt-1.5 text-xs text-[#C73E3A]">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-[#171A21]/60">{helperText}</p>}
    </div>
  );
}

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  id?: string;
  size?: 'sm' | 'md';
  className?: string;
  error?: string;
}

export function Checkbox({
  checked: controlled,
  defaultChecked,
  onChange,
  label,
  description,
  disabled,
  id,
  size = 'md',
  className,
  error,
}: CheckboxProps) {
  const [internal, setInternal] = React.useState<boolean>(!!defaultChecked);
  const isControlled = typeof controlled === 'boolean';
  const value = isControlled ? !!controlled : internal;
  const uid = React.useId();
  const finalId = id ?? `cb_${uid}`;
  const toggle = () => {
    if (disabled) return;
    const next = !value;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };
  const boxSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <div className={cn('w-full', className)}>
      <label htmlFor={finalId} className={cn('flex items-start gap-3 select-none', disabled && 'opacity-50 cursor-not-allowed')}>
        <span className="mt-0.5">
          <span
            id={finalId}
            role="checkbox"
            aria-checked={value}
            tabIndex={0}
            onClick={toggle}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggle();
              }
            }}
            className={cn(
              boxSize,
              'rounded-md border transition inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#173B8F]/40 focus:ring-offset-1',
              value
                ? 'bg-[#173B8F] border-[#173B8F] text-white shadow-sm'
                : error
                ? 'bg-white border-[#C73E3A]'
                : 'bg-white border-gray-300 hover:border-gray-400',
            )}
          >
            {value && <Check size={size === 'sm' ? 10 : 12} strokeWidth={3} />}
          </span>
        </span>
        {(label || description) && (
          <span className="min-w-0">
            {label && <span className="block text-sm font-medium text-[#171A21]">{label}</span>}
            {description && <span className="block text-xs text-[#171A21]/60 mt-0.5">{description}</span>}
          </span>
        )}
      </label>
      {error && <p className="mt-1.5 text-xs text-[#C73E3A] pl-8">{error}</p>}
    </div>
  );
}

interface RadioGroupProps {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
}

interface RadioGroupContext {
  name: string;
  value?: string;
  setValue: (v: string) => void;
}

const RadioCtx = React.createContext<RadioGroupContext | null>(null);

export function RadioGroup({ name, value: cv, onChange, defaultValue = '', children, className }: RadioGroupProps) {
  const generatedName = React.useId();
  const [internal, setInternal] = React.useState(defaultValue);
  const value = typeof cv === 'string' ? cv : internal;
  const ctx: RadioGroupContext = {
    name: name ?? `rg_${generatedName}`,
    value,
    setValue: (v) => {
      setInternal(v);
      onChange?.(v);
    },
  };
  return (
    <RadioCtx.Provider value={ctx}>
      <div role="radiogroup" className={cn('space-y-2', className)}>
        {children}
      </div>
    </RadioCtx.Provider>
  );
}

interface RadioProps {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export function Radio({ value, label, description, disabled }: RadioProps) {
  const ctx = React.useContext(RadioCtx);
  if (!ctx) throw new Error('Radio must be used inside RadioGroup');
  const checked = ctx.value === value;
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer select-none',
        checked ? 'border-[#173B8F] bg-[#173B8F]/5' : 'border-gray-200 bg-white hover:border-gray-300',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <span
        id={id}
        role="radio"
        aria-checked={checked}
        onClick={() => !disabled && ctx.setValue(value)}
        className="mt-0.5 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center"
      >
        <span
          className={cn(
            'w-2.5 h-2.5 rounded-full transition',
            checked ? 'bg-[#173B8F] scale-100' : 'bg-transparent scale-0',
          )}
        />
      </span>
      <input
        type="radio"
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => ctx.setValue(value)}
        className="sr-only"
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#171A21]">{label}</p>
        {description && <p className="text-xs text-[#171A21]/60 mt-0.5">{description}</p>}
      </div>
    </label>
  );
}
