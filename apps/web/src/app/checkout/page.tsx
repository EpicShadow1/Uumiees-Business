'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CreditCard, Truck, MapPin, Tag, CheckCircle2 } from 'lucide-react';
import type { Order } from '@uumiees/types';
import { Button, Input, Textarea, Alert, Card, CardContent, Checkbox, EmptyState } from '@uumiees/ui';
import { orderSchemas, discountSchemas } from '@uumiees/validation';
import { formatCurrency } from '@uumiees/utils';
import { tax } from '@uumiees/config';
import { useCart, useCreateOrder, useValidateDiscount } from '@/hooks/useQueries';
import { toast } from '@/stores/useToastStore';
import { CartSkeleton } from '@/components/Skeleton';

const checkoutSchema = orderSchemas.create.pick({
  shipping_address: true,
  billing_address: true,
  notes: true,
}).extend({
  discount_code: z.string().optional(),
  sameAddress: z.boolean().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartResp, isLoading: cartLoading, error: cartError } = useCart();
  const createOrderMut = useCreateOrder();
  const validateMut = useValidateDiscount();

  const items = cartResp?.items ?? [];
  const subtotal = items.reduce((s, i) => s + (i.price ?? 0) * (i.quantity ?? 0), 0);
  const shipping = subtotal > 0 ? (subtotal >= tax.freeShippingThreshold ? 0 : tax.shippingFlatRate) : 0;
  const [discountResult, setDiscountResult] = useState<{ amount: number; code: string } | null>(null);
  const [validating, setValidating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_address: '',
      billing_address: '',
      notes: '',
      discount_code: '',
      sameAddress: false,
    },
  });

  const sameAddress = watch('sameAddress');
  const discountCode = watch('discount_code');

  useEffect(() => {
    if (sameAddress) {
      const ship = watch('shipping_address');
      setValue('billing_address', ship);
    }
  }, [sameAddress, watch, setValue]);

  const discountAmount = discountResult?.amount ?? 0;
  const taxable = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxable * tax.defaultRate;
  const total = Math.max(0, taxable + taxAmount + shipping);

  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.replace('/cart');
    }
  }, [cartLoading, items.length, router]);

  const applyDiscount = async () => {
    if (!discountCode?.trim()) return;
    setValidating(true);
    clearErrors('discount_code');
    try {
      const r = await validateMut.mutateAsync({ code: discountCode.trim(), orderTotal: subtotal });
      if (!r?.valid) {
        setError('discount_code', { type: 'manual', message: 'Invalid or expired code' });
        setDiscountResult(null);
        return;
      }
      setDiscountResult({ amount: r.discountAmount ?? 0, code: discountCode.trim() });
      toast({ variant: 'success', title: 'Discount applied', description: `-${formatCurrency(r.discountAmount ?? 0)}` });
    } catch {
      setError('discount_code', { type: 'manual', message: 'Could not validate code' });
    } finally {
      setValidating(false);
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user?.id) {
      toast({ variant: 'warning', title: 'Please sign in first' });
      router.push('/auth/login');
      return;
    }
    try {
      const result = await createOrderMut.mutateAsync({
        user_id: user.id,
        items: items.map((i) => ({
          product_id: i.product_id,
          variant_id: i.variant_id ?? undefined,
          quantity: i.quantity ?? 1,
        })),
        shipping_address: data.shipping_address,
        billing_address: data.billing_address || data.shipping_address,
        notes: data.notes,
        discount_code: discountResult?.code || data.discount_code || undefined,
      });
      toast({ variant: 'success', title: 'Order placed!', description: `Order ${result.order.order_number}` });
      router.push(`/orders/${result.order.id}`);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      const msg = e?.response?.data?.error || e?.message || 'Could not place order';
      toast({ variant: 'error', title: 'Checkout failed', description: msg });
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#171A21] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Checkout</h1>
          <CartSkeleton />
        </div>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] px-4 py-12">
        <div className="max-w-md w-full text-center">
          <Alert variant="error" title="Could not load cart" className="mb-6">
            {cartError instanceof Error ? cartError.message : 'Please return to cart and try again.'}
          </Alert>
          <Link href="/cart">
            <Button leftIcon={<ArrowLeft size={16} />}>Back to Cart</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <EmptyState
            icon={<CheckCircle2 size={64} />}
            title="Nothing to check out"
            description="Your cart is empty."
            action={{
              label: 'Browse Products',
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
        <Link href="/cart" className="inline-flex items-center text-[#173B8F] hover:underline mb-6 text-sm">
          <ArrowLeft size={16} className="mr-1" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-[#171A21] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-5">
                    <Truck className="text-[#173B8F] mr-2" size={20} />
                    <h2 className="text-xl font-bold text-[#171A21]">Shipping Address</h2>
                  </div>
                  <Textarea
                    label="Full Address"
                    rows={3}
                    placeholder="123 Main St, City, State, ZIP"
                    error={errors.shipping_address?.message}
                    {...register('shipping_address')}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-5">
                    <MapPin className="text-[#173B8F] mr-2" size={20} />
                    <h2 className="text-xl font-bold text-[#171A21]">Billing Address</h2>
                  </div>
                  <div className="mb-4">
                    <Checkbox
                      label="Same as shipping address"
                      checked={!!sameAddress}
                      onChange={(v) => {
                        setValue('sameAddress', !!v);
                        if (v) {
                          const ship = watch('shipping_address');
                          setValue('billing_address', ship);
                        }
                      }}
                    />
                  </div>
                  {!sameAddress && (
                    <Textarea
                      label="Full Address"
                      rows={3}
                      placeholder="123 Main St, City, State, ZIP"
                      error={errors.billing_address?.message}
                      {...register('billing_address')}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-[#171A21] mb-4">Order Notes (Optional)</h2>
                  <Textarea
                    label="Notes"
                    rows={3}
                    placeholder="Any special instructions for your order..."
                    {...register('notes')}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Tag className="text-[#D4AF37] mr-2" size={20} />
                    <h2 className="text-xl font-bold text-[#171A21]">Discount Code</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Enter discount code"
                        error={errors.discount_code?.message}
                        {...register('discount_code')}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      loading={validating}
                      onClick={() => void applyDiscount()}
                      className="whitespace-nowrap"
                    >
                      {validating ? 'Validating…' : 'Apply'}
                    </Button>
                  </div>
                  {discountResult && (
                    <p className="mt-3 text-sm text-[#1F8A5B] font-medium">
                      ✓ Applied: - {formatCurrency(discountAmount)}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Button
                type="submit"
                loading={isSubmitting || createOrderMut.isPending}
                size="lg"
                fullWidth
                leftIcon={<CreditCard size={20} />}
              >
                {isSubmitting || createOrderMut.isPending ? 'Processing…' : `Place Order · ${formatCurrency(total)}`}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#171A21] mb-5">Order Summary</h2>
                <div className="space-y-3 mb-4 max-h-64 overflow-auto pr-1">
                  {items.map((i) => (
                    <div key={i.id} className="flex justify-between text-sm">
                      <span className="text-[#171A21] line-clamp-1 pr-2">
                        {i.product?.name || `Product #${i.product_id}`}
                        {i.variant?.name ? ` (${i.variant.name})` : ''} × {i.quantity}
                      </span>
                      <span className="text-[#171A21] tabular-nums whitespace-nowrap">
                        {formatCurrency((i.price ?? 0) * (i.quantity ?? 1))}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-200 my-4" />
                <div className="space-y-3 text-[#171A21]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium tabular-nums">{formatCurrency(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#1F8A5B]">
                      <span>Discount ({discountResult?.code})</span>
                      <span className="font-medium tabular-nums">- {formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium tabular-nums">
                      {shipping === 0 ? <span className="text-[#1F8A5B]">FREE</span> : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({Math.round(tax.defaultRate * 100)}%)</span>
                    <span className="font-medium tabular-nums">{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-1" />
                  <div className="flex justify-between text-xl font-bold text-[#173B8F]">
                    <span>Total</span>
                    <span className="tabular-nums">{formatCurrency(total)}</span>
                  </div>
                </div>
                <p className="mt-6 text-xs text-[#6B7280]">
                  By placing this order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
