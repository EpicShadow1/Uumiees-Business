import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string | number, locale = 'en-US'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string | number, locale = 'en-US'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelativeTime(date: Date | string | number, locale = 'en-US'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSec < 60) return rtf.format(-diffSec, 'second');
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  if (diffHour < 24) return rtf.format(-diffHour, 'hour');
  if (diffDay < 7) return rtf.format(-diffDay, 'day');
  return formatDate(d, locale);
}

export function generateOrderNumber(prefix = 'UUM', length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
}

export function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const maskedLocal = local.length <= 2
    ? local[0] + '*'
    : local[0] + '*'.repeat(Math.min(local.length - 2, 4)) + local[local.length - 1];
  return `${maskedLocal}@${domain}`;
}

export function calculateDiscountedPrice(originalPrice: number, discountType: 'percentage' | 'fixed', discountValue: number, maximumDiscount?: number | null): number {
  let discountedPrice: number;

  if (discountType === 'percentage') {
    const discountAmount = originalPrice * (discountValue / 100);
    const finalDiscount = maximumDiscount && discountAmount > maximumDiscount
      ? maximumDiscount
      : discountAmount;
    discountedPrice = originalPrice - finalDiscount;
  } else {
    discountedPrice = originalPrice - discountValue;
  }

  return Math.max(0, discountedPrice);
}

export function calculateDiscountAmount(originalPrice: number, discountType: 'percentage' | 'fixed', discountValue: number, maximumDiscount?: number | null): number {
  if (discountType === 'percentage') {
    const discountAmount = originalPrice * (discountValue / 100);
    return maximumDiscount && discountAmount > maximumDiscount
      ? maximumDiscount
      : discountAmount;
  }
  return Math.min(discountValue, originalPrice);
}

export function calculateOrderTotals(
  subtotal: number,
  taxRate = 0.1,
  shippingRate = 10,
  discountAmount = 0
): { subtotal: number; tax: number; shipping: number; discount: number; total: number } {
  const tax = Math.max(0, subtotal - discountAmount) * taxRate;
  const shipping = subtotal > 0 ? shippingRate : 0;
  const total = Math.max(0, subtotal - discountAmount + tax + shipping);

  return {
    subtotal,
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    discount: Number(discountAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

export function generateStars(rating: number): { filled: number; half: boolean; empty: number } {
  const clamped = Math.max(0, Math.min(5, rating));
  const filled = Math.floor(clamped);
  const half = clamped - filled >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);
  return { filled, half, empty };
}

export function getAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return Number((sum / ratings.length).toFixed(1));
}

export function paginate<T>(items: T[], page: number, limit: number): { data: T[]; total: number; page: number; limit: number; totalPages: number } {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return { data, total, page, limit, totalPages };
}

export function debounce<T extends (...args: unknown[]) => unknown>(func: T, waitMs: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), waitMs);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(func: T, limitMs: number): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limitMs);
    }
  };
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length === 0;
  return false;
}

export function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

export const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await delay(delayMs * attempt);
      }
    }
  }
  throw lastError;
}

export default {
  cn,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  generateOrderNumber,
  generateSessionId,
  slugify,
  truncateText,
  maskEmail,
  calculateDiscountedPrice,
  calculateDiscountAmount,
  calculateOrderTotals,
  generateStars,
  getAverageRating,
  paginate,
  debounce,
  throttle,
  deepClone,
  pick,
  omit,
  isEmpty,
  capitalizeFirst,
  toTitleCase,
  delay,
  retry,
};
