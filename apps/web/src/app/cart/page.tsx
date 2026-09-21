'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import type { ShoppingCart } from '@uumiees/types';
import { Button, EmptyState, PriceTag, Card, CardContent, Alert } from '@uumiees/ui';
import { formatCurrency } from '@uumiees/utils';
import { tax } from '@uumiees/config';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useQueries';
import { toast } from '@/stores/useToastStore';
import { ConfirmDialog } from '@/components/Modal';
import { CartSkeleton } from '@/components/Skeleton';

export default function CartPage() {
  const router = useRouter();
  const { data: cartResp, isLoading, error, refetch } = useCart();
  const updateMut = useUpdateCartItem();
  const removeMut = useRemoveCartItem();
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);

  const cart: ShoppingCart | null = cartResp ?? null;
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, it) => sum + (it.price ?? 0) * (it.quantity ?? 0), 0);
  const shipping = subtotal > 0 ? (subtotal >= tax.freeShippingThreshold ? 0 : tax.shippingFlatRate) : 0;
  const taxAmount = subtotal * tax.defaultRate;
  const total = subtotal + shipping + taxAmount;

  const updateQty = async (itemId: number, qty: number) => {
    if (qty < 1) return;
    try {
      await updateMut.mutateAsync({ id: itemId, quantity: qty });
      toast({ variant: 'success', title: 'Cart updated' });
    } catch {
      toast({ variant: 'error', title: 'Could not update quantity' });
    }
  };

  const confirmRemove = (itemId: number) => setPendingRemoveId(itemId);

  const doRemove = async () => {
    if (pendingRemoveId == null) return;
    const id = pendingRemoveId;
    setPendingRemoveId(null);
    try {
      await removeMut.mutateAsync(id);
      toast({ variant: 'success', title: 'Item removed from cart' });
    } catch {
      toast({ variant: 'error', title: 'Could not remove item' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#171A21] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shopping Cart
          </h1>
          <CartSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] px-4 py-12">
        <div className="max-w-md w-full text-center">
          <Alert variant="error" title="Could not load cart" className="mb-6">
            {error instanceof Error ? error.message : 'An unexpected error occurred.'}
          </Alert>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => void refetch()} leftIcon={<ArrowRight size={16} className="rotate-180" />}>
              Retry
            </Button>
            <Link href="/products">
              <Button variant="outline">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <EmptyState
            icon={<ShoppingBag size={64} />}
            title="Your Cart is Empty"
            description="Looks like you haven't added anything to your cart yet."
            action={{
              label: 'Start Shopping',
              onClick: () => router.push('/products'),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#171A21] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          Shopping Cart
          <span className="ml-3 text-lg font-medium text-[#6B7280]">
            ({items.reduce((n, i) => n + (i.quantity ?? 0), 0)} items)
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const busy = updateMut.isPending || removeMut.isPending;
              const price = item.price ?? 0;
              const lineTotal = price * (item.quantity ?? 0);
              return (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 sm:p-6 flex items-center gap-4 sm:gap-6">
                    <Link href={`/products/${item.product_id}`} className="flex-shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F4F5F7] flex items-center justify-center">
                        {item.product?.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={28} className="text-[#9CA3AF]" />
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product_id}`} className="block">
                        <h3 className="font-semibold text-[#171A21] hover:text-[#173B8F] transition line-clamp-2">
                          {item.product?.name ?? `Product #${item.product_id}`}
                        </h3>
                      </Link>
                      {item.variant?.name && (
                        <p className="text-sm text-[#6B7280] mt-1">Variant: {item.variant.name}</p>
                      )}
                      <div className="mt-2">
                        <PriceTag price={price} />
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => void updateQty(item.id, (item.quantity ?? 1) - 1)}
                          disabled={busy || (item.quantity ?? 1) <= 1}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => void updateQty(item.id, (item.quantity ?? 0) + 1)}
                          disabled={busy}
                          aria-label="Increase quantity"
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="font-bold text-[#173B8F] text-lg">{formatCurrency(lineTotal)}</p>
                      </div>
                      <button
                        onClick={() => confirmRemove(item.id)}
                        disabled={busy}
                        aria-label="Remove item"
                        className="p-2 text-[#C73E3A] hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex justify-between items-center pt-2">
              <Link href="/products" className="text-[#173B8F] hover:underline font-medium text-sm">
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#171A21] mb-5">Order Summary</h2>

                <div className="space-y-3 text-[#171A21]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium tabular-nums">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium tabular-nums">
                      {shipping === 0 && subtotal > 0 ? (
                        <span className="text-[#1F8A5B]">FREE</span>
                      ) : (
                        formatCurrency(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({Math.round(tax.defaultRate * 100)}%)</span>
                    <span className="font-medium tabular-nums">{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex justify-between text-xl font-bold text-[#173B8F]">
                    <span>Total</span>
                    <span className="tabular-nums">{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    size="lg"
                    fullWidth
                    leftIcon={<ArrowRight size={18} />}
                    onClick={() => router.push('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>
                  <Link href="/products" className="block">
                    <Button variant="outline" fullWidth>
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {shipping > 0 && (
                  <p className="mt-5 text-xs text-[#6B7280] text-center">
                    Add {formatCurrency(tax.freeShippingThreshold - subtotal)} more for free shipping!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={pendingRemoveId != null}
        onConfirm={() => void doRemove()}
        onCancel={() => setPendingRemoveId(null)}
        title="Remove item from cart?"
        description="This item will be removed from your shopping cart. You can add it back later from the product page."
        confirmLabel="Remove"
        cancelLabel="Keep"
        danger
      />
    </div>
  );
}
