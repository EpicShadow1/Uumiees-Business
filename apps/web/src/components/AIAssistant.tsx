'use client';

import * as React from 'react';
import { cn } from '@uumiees/utils';
import { X, Send, Sparkles, Bot, User, ChevronUp, MessageCircle, Loader2 } from 'lucide-react';
import { useAIStore, type AIMessage, type AIMessageAttachment } from '@/stores/useAIStore';
import type { Product, Category, Order } from '@uumiees/types';
import { formatCurrency } from '@uumiees/utils';
import Link from 'next/link';

function ProductAttachment({ a }: { a: AIMessageAttachment }) {
  const p = a.data as Product;
  return (
    <div className="mt-3 grid gap-2">
      <div className="rounded-xl border border-[#F4F5F7] bg-[#FFFDF7] p-3 flex gap-3 items-center">
        <div className="w-14 h-14 rounded-lg bg-white border border-[#F4F5F7] flex items-center justify-center text-2xl shrink-0">
          📦
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#171A21] truncate">{p.name}</p>
          <p className="text-xs text-[#173B8F] font-bold mt-0.5">{formatCurrency(p.price)}</p>
          {p.stock >= 0 && (
            <p className={cn('text-xs mt-0.5', p.stock > 0 ? 'text-[#1F8A5B]' : 'text-[#C73E3A]')}>
              {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {a.actions?.map((ac, i) => (
            <Link
              key={i}
              href={ac.href}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#173B8F] text-white hover:bg-[#081A3A] transition font-medium text-center"
            >
              {ac.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderAttachment({ a }: { a: AIMessageAttachment }) {
  const o = a.data as Order;
  return (
    <div className="mt-3 rounded-xl border border-[#F4F5F7] bg-[#FFFDF7] p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs text-[#171A21]/60">Order</p>
          <p className="font-semibold text-[#171A21]">#{o.order_number}</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F4E7C5] text-[#081A3A]">
          {o.status}
        </span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-[#171A21]/70">Total</p>
        <p className="font-bold text-[#173B8F]">{formatCurrency(o.total)}</p>
      </div>
      {a.actions?.map((ac, i) => (
        <Link
          key={i}
          href={ac.href}
          className="block text-center text-xs px-2.5 py-1.5 rounded-lg bg-[#173B8F] text-white hover:bg-[#081A3A] transition font-medium"
        >
          {ac.label}
        </Link>
      ))}
    </div>
  );
}

function CategoryAttachment({ a }: { a: AIMessageAttachment }) {
  const c = a.data as Category;
  return (
    <div className="mt-3 rounded-xl border border-[#F4F5F7] bg-[#FFFDF7] p-3 flex items-center justify-between">
      <div>
        <p className="font-semibold text-[#171A21]">{c.name}</p>
        {c.description && <p className="text-xs text-[#171A21]/60 mt-0.5">{c.description}</p>}
      </div>
      <Link
        href={`/categories/${c.slug}`}
        className="text-xs px-2.5 py-1.5 rounded-lg bg-[#D4AF37] text-white hover:bg-[#B8952F] transition font-semibold"
      >
        Browse
      </Link>
    </div>
  );
}

function Attachment({ a }: { a: AIMessageAttachment }) {
  if (a.type === 'product') return <ProductAttachment a={a} />;
  if (a.type === 'order') return <OrderAttachment a={a} />;
  return <CategoryAttachment a={a} />;
}

function Bubble({ m }: { m: AIMessage }) {
  const isUser = m.role === 'user';
  const Icon = isUser ? User : Bot;
  return (
    <div className={cn('flex gap-2 max-w-[90%]', isUser ? 'ml-auto flex-row-reverse' : 'mr-auto')}>
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
          isUser ? 'bg-[#173B8F] text-white' : 'bg-[#F4E7C5] text-[#081A3A]',
        )}
      >
        <Icon size={14} />
      </div>
      <div>
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm',
            isUser
              ? 'bg-[#173B8F] text-white rounded-br-md'
              : 'bg-white border border-[#F4F5F7] text-[#171A21] rounded-bl-md',
          )}
        >
          {m.content}
        </div>
        {m.attachments?.map((a, i) => (
          <Attachment key={i} a={a} />
        ))}
        {m.quickActions && m.quickActions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {m.quickActions.map((q, i) =>
              q.href ? (
                <Link
                  key={i}
                  href={q.href}
                  className="text-xs px-3 py-1.5 rounded-full border border-[#173B8F]/20 text-[#173B8F] hover:bg-[#173B8F]/5 font-medium"
                >
                  {q.label}
                </Link>
              ) : (
                <button
                  key={i}
                  onClick={() => useAIStore.getState().sendMessage(q.prompt ?? q.label)}
                  className="text-xs px-3 py-1.5 rounded-full border border-[#173B8F]/20 text-[#173B8F] hover:bg-[#173B8F]/5 font-medium"
                >
                  {q.label}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex gap-2 max-w-[90%] mr-auto">
      <div className="w-8 h-8 rounded-full bg-[#F4E7C5] text-[#081A3A] flex items-center justify-center shrink-0 mt-0.5">
        <Bot size={14} />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-[#F4F5F7] shadow-sm flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-[#D4AF37]/60 animate-bounce [animation-delay:-0.2s]" />
        <span className="w-2 h-2 rounded-full bg-[#D4AF37]/60 animate-bounce [animation-delay:-0.1s]" />
        <span className="w-2 h-2 rounded-full bg-[#D4AF37]/60 animate-bounce" />
      </div>
    </div>
  );
}

export function AIAssistant() {
  const open = useAIStore((s) => s.open);
  const toggle = useAIStore((s) => s.toggle);
  const setOpen = useAIStore((s) => s.setOpen);
  const messages = useAIStore((s) => s.messages);
  const sendMessage = useAIStore((s) => s.sendMessage);
  const isTyping = useAIStore((s) => s.isTyping);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping, open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || isTyping) return;
    sendMessage(text);
    setValue('');
  };

  if (!open) {
    return (
      <button
        onClick={toggle}
        aria-label="Open Uumiee's assistant"
        className="fixed bottom-6 right-6 z-[90] group"
      >
        <span className="absolute inset-0 rounded-full bg-[#173B8F] blur-md opacity-40 group-hover:opacity-60 transition" />
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#173B8F] to-[#081A3A] text-white shadow-[0_10px_30px_-8px_rgba(23,59,143,0.55)] transition group-active:scale-95 group-hover:-translate-y-0.5">
          <MessageCircle size={26} strokeWidth={2.2} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-white flex items-center justify-center">
            <Sparkles size={9} className="text-white" />
          </span>
        </span>
      </button>
    );
  }

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>
      <div
        role="dialog"
        aria-label="Uumiee's assistant"
        className="fixed bottom-6 right-6 z-[90] w-[calc(100vw-3rem)] sm:w-[420px] h-[min(640px,calc(100vh-6rem))] rounded-3xl shadow-[0_24px_60px_-18px_rgba(8,26,58,0.5)] bg-[#FFFDF7] border border-[#F4F5F7] flex flex-col overflow-hidden animate-[fadeIn_160ms_ease-out]"
      >
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
        <div className="px-5 py-4 bg-gradient-to-r from-[#081A3A] to-[#173B8F] text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center ring-2 ring-[#D4AF37]/40 shrink-0">
            <Sparkles size={20} className="text-[#D4AF37]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Uumiee's Assistant
            </p>
            <p className="text-xs text-white/70">Here to help — product tips to order tracking</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Minimize"
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <ChevronUp size={18} />
          </button>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#FFFDF7]"
        >
          {messages.map((m) => (
            <Bubble key={m.id} m={m} />
          ))}
          {isTyping && <Typing />}
        </div>

        <form
          onSubmit={submit}
          className="border-t border-[#F4F5F7] bg-white px-3 py-3 flex items-end gap-2"
        >
          <textarea
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
            placeholder="Ask about products, orders, discounts..."
            className="flex-1 resize-none rounded-2xl border border-[#F4F5F7] px-4 py-3 text-sm text-[#171A21] placeholder:text-[#171A21]/40 focus:outline-none focus:ring-2 focus:ring-[#173B8F]/30 focus:border-[#173B8F]/50 max-h-32"
            aria-label="Message Uumiee's assistant"
          />
          <button
            type="submit"
            disabled={isTyping || !value.trim()}
            className="p-3 rounded-2xl bg-[#173B8F] text-white hover:bg-[#081A3A] disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
            aria-label="Send message"
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </>
  );
}
