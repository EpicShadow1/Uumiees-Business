export const colors = {
  primary: {
    DEFAULT: '#173B8F',
    hover: '#0F2A6B',
    light: '#4A6FB5',
    50: '#EFF4FF',
    100: '#DCE7FF',
    200: '#B8CBFF',
    300: '#8FA9FF',
    400: '#6A87F0',
    500: '#4A6FB5',
    600: '#173B8F',
    700: '#0F2A6B',
    800: '#081A3A',
    900: '#051226',
  },
  secondary: {
    DEFAULT: '#081A3A',
    hover: '#051226',
    50: '#F0F3FF',
    100: '#DCE3FF',
    200: '#BCC8FF',
    300: '#8FA4FF',
    400: '#5C7AE5',
    500: '#3A56B5',
    600: '#1F3A8F',
    700: '#132872',
    800: '#081A3A',
    900: '#051226',
  },
  accent: {
    DEFAULT: '#D4AF37',
    hover: '#B8952F',
    light: '#E0C45C',
    50: '#FFFBEA',
    100: '#FFF3C4',
    200: '#FFE890',
    300: '#FFDB5C',
    400: '#ECC94B',
    500: '#D4AF37',
    600: '#B8952F',
    700: '#977826',
    800: '#7A5F1E',
    900: '#5C4815',
  },
  background: {
    DEFAULT: '#FFFDF7',
    paper: '#FFFFFF',
    surface: '#F4F5F7',
  },
  text: {
    DEFAULT: '#171A21',
    muted: '#6B7280',
    light: '#9CA3AF',
  },
  success: '#1F8A5B',
  warning: '#D99A00',
  danger: '#C73E3A',
  info: '#173B8F',
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    display: ['Playfair Display', 'Georgia', 'serif'],
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  18: '4.5rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
  88: '22rem',
  128: '32rem',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  DEFAULT: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  '4xl': '2.5rem',
  full: '9999px',
} as const;

export const shadows = {
  none: '0 0 #0000',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  gold: '0 4px 20px -2px rgba(212, 175, 55, 0.3)',
  royal: '0 4px 20px -2px rgba(23, 59, 143, 0.3)',
} as const;

export const transitions = {
  DEFAULT: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const orderStatuses = {
  pending: { label: 'Pending', color: 'warning', bgColor: '#FEF3C7', textColor: '#92400E' },
  processing: { label: 'Processing', color: 'info', bgColor: '#DBEAFE', textColor: '#1E40AF' },
  shipped: { label: 'Shipped', color: 'secondary', bgColor: '#EDE9FE', textColor: '#5B21B6' },
  out_for_delivery: { label: 'Out for Delivery', color: 'accent', bgColor: '#FFF3C4', textColor: '#7A5F1E' },
  delivered: { label: 'Delivered', color: 'success', bgColor: '#D1FAE5', textColor: '#065F46' },
  cancelled: { label: 'Cancelled', color: 'danger', bgColor: '#FEE2E2', textColor: '#991B1B' },
  refunded: { label: 'Refunded', color: 'muted', bgColor: '#F3F4F6', textColor: '#374151' },
} as const;

export const paymentStatuses = {
  pending: { label: 'Pending', color: 'warning' },
  authorized: { label: 'Authorized', color: 'info' },
  captured: { label: 'Paid', color: 'success' },
  failed: { label: 'Failed', color: 'danger' },
  refunded: { label: 'Refunded', color: 'muted' },
  partially_refunded: { label: 'Partially Refunded', color: 'accent' },
  voided: { label: 'Voided', color: 'muted' },
} as const;

export const ticketStatuses = {
  open: { label: 'Open', color: 'warning' },
  in_progress: { label: 'In Progress', color: 'info' },
  awaiting_reply: { label: 'Awaiting Reply', color: 'accent' },
  resolved: { label: 'Resolved', color: 'success' },
  closed: { label: 'Closed', color: 'muted' },
} as const;

export const ticketPriorities = {
  low: { label: 'Low', color: 'muted' },
  medium: { label: 'Medium', color: 'info' },
  high: { label: 'High', color: 'warning' },
  urgent: { label: 'Urgent', color: 'danger' },
} as const;

export const ticketCategories = [
  'General Inquiry',
  'Order Issue',
  'Product Question',
  'Shipping & Delivery',
  'Returns & Refunds',
  'Payment Issue',
  'Account Issue',
  'Technical Support',
  'Feedback',
  'Other',
] as const;

export const pagination = {
  defaultLimit: 20,
  maxLimit: 100,
  defaultPage: 1,
} as const;

export const api = {
  defaultBaseUrl: process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

export const storageKeys = {
  token: 'token',
  sessionToken: 'sessionToken',
  user: 'user',
  cartSessionId: 'cartSessionId',
  guestCart: 'guestCart',
  recentSearches: 'recentSearches',
  theme: 'theme',
  language: 'language',
} as const;

export const paginationDefaults = {
  productsPerPage: 20,
  ordersPerPage: 10,
  reviewsPerPage: 10,
  ticketsPerPage: 20,
  cartMaxItems: 99,
} as const;

export const tax = {
  defaultRate: 0.1,
  shippingFlatRate: 10,
  freeShippingThreshold: 100,
} as const;

export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
};

export type ColorKey = keyof typeof colors;
export type OrderStatusKey = keyof typeof orderStatuses;
export type PaymentStatusKey = keyof typeof paymentStatuses;
export type TicketStatusKey = keyof typeof ticketStatuses;
export type TicketPriorityKey = keyof typeof ticketPriorities;

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  orderStatuses,
  paymentStatuses,
  ticketStatuses,
  ticketPriorities,
  ticketCategories,
  pagination,
  api,
  storageKeys,
  paginationDefaults,
  tax,
  designTokens,
};
