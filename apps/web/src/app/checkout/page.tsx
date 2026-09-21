'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, MapPin } from 'lucide-react';

interface CartItem {
  id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
  };
  variant?: {
    id: number;
    name: string;
  } | null;
}

interface ShoppingCart {
  id: number;
  items?: CartItem[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<ShoppingCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    shipping_address: '',
    billing_address: '',
    notes: '',
    discount_code: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setCart(data.cart);

      if (!data.cart?.items || data.cart.items.length === 0) {
        router.push('/cart');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const orderData = {
        user_id: user.id,
        items: cart?.items?.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
        })) || [],
        shipping_address: formData.shipping_address,
        billing_address: formData.billing_address,
        notes: formData.notes,
        discount_code: formData.discount_code || undefined,
      };

      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create order');
      }

      const data = await response.json();
      router.push(`/orders/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173B8F] mx-auto"></div>
          <p className="mt-4 text-[#171A21]">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/cart"
            className="px-6 py-2 bg-[#173B8F] text-white rounded-lg hover:bg-[#081A3A] transition"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center text-[#173B8F] hover:underline mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-[#171A21] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Truck className="text-[#173B8F] mr-2" size={20} />
                  <h2 className="text-xl font-bold text-[#171A21]">Shipping Address</h2>
                </div>
                <div>
                  <label htmlFor="shipping_address" className="block text-sm font-medium text-[#171A21] mb-2">
                    Full Address
                  </label>
                  <textarea
                    id="shipping_address"
                    required
                    rows={3}
                    value={formData.shipping_address}
                    onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B8F] focus:border-transparent outline-none transition"
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="text-[#173B8F] mr-2" size={20} />
                  <h2 className="text-xl font-bold text-[#171A21]">Billing Address</h2>
                </div>
                <div>
                  <label htmlFor="billing_address" className="block text-sm font-medium text-[#171A21] mb-2">
                    Full Address
                  </label>
                  <textarea
                    id="billing_address"
                    required
                    rows={3}
                    value={formData.billing_address}
                    onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B8F] focus:border-transparent outline-none transition"
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
                <div className="mt-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.shipping_address === formData.billing_address}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, billing_address: formData.shipping_address });
                        }
                      }}
                      className="w-4 h-4 text-[#173B8F] border-gray-300 rounded focus:ring-[#173B8F]"
                    />
                    <span className="ml-2 text-sm text-[#171A21]">Same as shipping address</span>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-[#171A21] mb-4">Order Notes (Optional)</h2>
                <div>
                  <textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B8F] focus:border-transparent outline-none transition"
                    placeholder="Any special instructions for your order..."
                  />
                </div>
              </div>

              {/* Discount Code */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-[#171A21] mb-4">Discount Code</h2>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.discount_code}
                    onChange={(e) => setFormData({ ...formData, discount_code: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B8F] focus:border-transparent outline-none transition"
                    placeholder="Enter discount code"
                  />
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-200 text-[#171A21] rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full px-6 py-4 bg-[#173B8F] text-white rounded-lg font-medium hover:bg-[#081A3A] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <CreditCard size={20} className="mr-2" />
                {processing ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#171A21] mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {cart?.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#171A21]">
                      {item.product?.name} {item.variant && `(${item.variant.name})`} x {item.quantity}
                    </span>
                    <span className="text-[#171A21]">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className="mb-4" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#171A21]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#171A21]">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#171A21]">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold text-[#173B8F]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>By placing this order, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
