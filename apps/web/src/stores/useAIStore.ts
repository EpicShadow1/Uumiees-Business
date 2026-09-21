import { create } from 'zustand';
import type { Product, Category, Order } from '@uumiees/types';

export type AIMessageRole = 'user' | 'assistant' | 'system';

export interface AIMessageAttachment {
  type: 'product' | 'category' | 'order';
  data: Product | Category | Order;
  actions?: { label: string; href: string }[];
}

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  streaming?: boolean;
  attachments?: AIMessageAttachment[];
  quickActions?: { label: string; prompt?: string; href?: string }[];
  createdAt: number;
}

interface AIState {
  open: boolean;
  messages: AIMessage[];
  context: {
    currentProductId?: number;
    currentCategorySlug?: string;
    searchQuery?: string;
    cartSize?: number;
  };
  suggestedPrompts: string[];
  isTyping: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  setContext: (patch: Partial<AIState['context']>) => void;
  sendMessage: (text: string, attachments?: AIMessageAttachment[]) => Promise<void>;
  reset: () => void;
}

let _mid = 0;
const mid = () => `ai_${++_mid}_${Date.now().toString(36)}`;

const DEFAULT_PROMPTS = [
  'What are your best sellers?',
  'Can you help me find a gift?',
  'Track my last order',
  'Do you have any discounts?',
];

function extractProductIds(text: string): number[] {
  const matches = text.matchAll(/\b\d{2,6}\b/g);
  const out: number[] = [];
  for (const m of matches) {
    if (m[0]) out.push(parseInt(m[0], 10));
  }
  return out;
}

export const useAIStore = create<AIState>((set, get) => ({
  open: false,
  messages: [
    {
      id: mid(),
      role: 'assistant',
      content:
        "Hi! I'm your Uumiee's assistant 👋. I can help you find products, explain details, track orders, or answer questions. What are you looking for today?",
      quickActions: DEFAULT_PROMPTS.map((p) => ({ label: p, prompt: p })),
      createdAt: Date.now(),
    },
  ],
  context: {},
  suggestedPrompts: DEFAULT_PROMPTS,
  isTyping: false,
  setOpen: (v) => set({ open: v }),
  toggle: () => set((s) => ({ open: !s.open })),
  setContext: (patch) => set((s) => ({ context: { ...s.context, ...patch } })),
  reset: () =>
    set({
      messages: [
        {
          id: mid(),
          role: 'assistant',
          content:
            "Hi! I'm your Uumiee's assistant 👋. I can help you find products, explain details, track orders, or answer questions. What are you looking for today?",
          quickActions: DEFAULT_PROMPTS.map((p) => ({ label: p, prompt: p })),
          createdAt: Date.now(),
        },
      ],
    }),
  sendMessage: async (rawText, attachments) => {
    const text = rawText.trim();
    if (!text && !attachments) return;

    const context = get().context;
    const userId = parseUserId();

    const userMsg: AIMessage = {
      id: mid(),
      role: 'user',
      content: text,
      attachments,
      createdAt: Date.now(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], isTyping: true }));

    let responseContent = "I'll help you with that.";
    let responseAttachments: AIMessageAttachment[] = [];
    let quickActions: AIMessage['quickActions'] = [];

    try {
      const { getApiClient } = await import('@uumiees/api');
      const client = getApiClient();
      if (typeof window !== 'undefined') {
        const t = localStorage.getItem('token');
        if (t) client.setToken(t);
      }

      const lowered = text.toLowerCase();

      if (/\b(best\s*seller|bestseller|top\s*products?|featured)\b/.test(lowered)) {
        const products = await safeCall(() => client.getFeaturedProducts(3), []);
        responseContent =
          "Here are Uumiee's current featured picks ✨ — these are some of our most loved items right now.";
        responseAttachments = products.map((p) => ({
          type: 'product' as const,
          data: p,
          actions: [
            { label: 'View', href: `/products/${p.id}` },
          ],
        }));
        quickActions = [{ label: 'Show all products', href: '/products' }];
      } else if (/\b(discount|promo|sale|coupon|code)\b/.test(lowered)) {
        const discounts = await safeCall(() => client.getDiscounts(true), []);
        if (discounts.length > 0) {
          const active = discounts.slice(0, 3);
          responseContent = `Great news — we currently have ${active.length} active promotions. Here are the best ones:`;
          quickActions = active.map((d) => ({
            label: `Use code ${d.code} (${d.discount_type === 'percentage' ? `${d.discount_value}% off` : `$${d.discount_value} off`})`,
            prompt: `Tell me more about discount ${d.code}`,
          }));
        } else {
          responseContent =
            "I don't see any public discount codes right now. But make sure to check back — we run seasonal sales, and subscribers get early access!";
        }
      } else if (/\btrack\b.*\border\b|\border\b.*\bstat(?:us)?\b/.test(lowered) || /\bwhere\s+is\s+my\s+order\b/.test(lowered)) {
        if (!userId) {
          responseContent =
            'I can help you track your order! Please sign in first so I can pull up your recent orders.';
          quickActions = [{ label: 'Sign in', href: '/auth/login' }];
        } else {
          const orders = await safeCall(() => client.getOrders(5), []);
          if (orders.length > 0) {
            const latest = orders[0];
            responseContent = `Here's your latest order (#${latest.order_number}). Current status: **${latest.status}**.`;
            responseAttachments = [{ type: 'order', data: latest, actions: [{ label: 'View order', href: `/orders/${latest.id}` }] }];
            quickActions = [{ label: 'All orders', href: '/orders' }];
          } else {
            responseContent = "It looks like you haven't placed any orders yet.";
            quickActions = [{ label: 'Start shopping', href: '/products' }];
          }
        }
      } else if (/\bgift\b|\bpresent\b|\bfor\s+(?:mother|mom|father|dad|wife|husband|kids|children|baby|him|her|them|us)\b/.test(lowered)) {
        const categories = await safeCall(() => client.getCategories(true), []);
        const products = await safeCall(() => client.getProducts(4), []);
        responseContent =
          "Perfect! Here are a few thoughtful gift ideas from Uumiee's. Let me know the recipient and I'll narrow them down further:";
        responseAttachments = products.slice(0, 3).map((p) => ({
          type: 'product' as const,
          data: p,
          actions: [{ label: 'View', href: `/products/${p.id}` }],
        }));
        if (categories.length > 0) {
          quickActions = categories.slice(0, 3).map((c) => ({ label: `Browse ${c.name}`, href: `/categories/${c.slug}` }));
        }
      } else if (context.currentProductId && /\bgood for|recommend|cheaper|alternative|similar|better\b/.test(lowered)) {
        const currentProductId = context.currentProductId;
        const products = await safeCall(() => client.getProducts(3), []);
        const alt = products.filter((p) => p.id !== currentProductId).slice(0, 3);
        if (/\bcheap(?:er)?\b/.test(lowered)) {
          const original = await safeCall(() => client.getProduct(currentProductId), null);
          if (original) {
            const cheaper = products
              .filter((p) => p.id !== original.id && p.price < original.price)
              .slice(0, 3);
            if (cheaper.length > 0) {
              responseContent = `Here are ${cheaper.length} similar items at a lower price point than what you're currently looking at:`;
              responseAttachments = cheaper.map((p) => ({
                type: 'product' as const,
                data: p,
                actions: [{ label: 'View', href: `/products/${p.id}` }],
              }));
            }
          }
        } else if (alt.length > 0) {
          responseContent = "Great question! Here are some alternatives you might also like:";
          responseAttachments = alt.map((p) => ({
            type: 'product' as const,
            data: p,
            actions: [{ label: 'View', href: `/products/${p.id}` }],
          }));
        }
      } else if (/\b(?:search|find|looking\s+for|do\s+you\s+have)\b|^(?:i\s+want|need|show|get)\s+/.test(lowered) || text.length > 0) {
        const products = await safeCall(() => client.searchProducts(text, 3), []);
        const categories = await safeCall(() => client.getCategories(true), []);
        if (products.length > 0) {
          responseContent = `I found ${products.length} items matching "${text}". Here are the top matches:`;
          responseAttachments = products.map((p) => ({
            type: 'product' as const,
            data: p,
            actions: [{ label: 'View', href: `/products/${p.id}` }],
          }));
          quickActions = [{ label: 'See all results', href: `/search?q=${encodeURIComponent(text)}` }];
        } else {
          responseContent =
            "I couldn't find exact matches for that in our catalog yet. You can browse our categories below — or rephrase with different keywords:";
          quickActions = categories.slice(0, 4).map((c) => ({ label: c.name, href: `/categories/${c.slug}` }));
        }

        if (extractProductIds(text).length > 0 && responseAttachments.length === 0) {
          const ids = extractProductIds(text);
          for (const id of ids.slice(0, 2)) {
            const p = await safeCall(() => client.getProduct(id), null);
            if (p) {
              responseContent = `Here are the details for product #${p.id}:`;
              responseAttachments = [{ type: 'product', data: p, actions: [{ label: 'View product', href: `/products/${p.id}` }] }];
              break;
            }
          }
        }
      }
    } catch (err) {
      responseContent =
        "I'm having trouble reaching Uumiee's backend right now. You can still browse products directly — want me to point you in the right direction?";
      quickActions = [{ label: 'Browse products', href: '/products' }, { label: 'Help center', href: '/help' }];
    } finally {
      const assMsg: AIMessage = {
        id: mid(),
        role: 'assistant',
        content: responseContent,
        attachments: responseAttachments.length ? responseAttachments : undefined,
        quickActions: quickActions.length ? quickActions : undefined,
        createdAt: Date.now(),
      };
      set((s) => ({
        messages: [...s.messages, assMsg],
        isTyping: false,
        suggestedPrompts: s.suggestedPrompts.length ? s.suggestedPrompts : DEFAULT_PROMPTS,
      }));
    }
  },
}));

function parseUserId(): number | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const u = JSON.parse(raw);
    return typeof u.id === 'number' ? u.id : null;
  } catch {
    return null;
  }
}

async function safeCall<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}
