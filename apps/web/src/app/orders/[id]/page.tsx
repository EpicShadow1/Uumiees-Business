'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Clock, ArrowRight, Home } from 'lucide-react';

interface OrderItem {
  id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  price: number;
  product_name: string;
  variant_name: string;
}

interface OrderTracking {
  id: number;
  order_id: number;
  status: string;
  location?: string | null;
  description: string;
  estimated_delivery?: Date | null;
  actual_delivery?: Date | null;
  created_at: string;
}

interface Order {
  id: number;
  user_id: number;
  order_number: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method?: string | null;
  payment_id?: string | null;
  shipping_address: string;
  billing_address: string;
  notes: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  tracking?: OrderTracking[];
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrderDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      void fetchOrderDetails();
    }
  }, [fetchOrderDetails, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#173B8F] mx-auto"></div>
          <p className="mt-4 text-[#171A21]">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <Link
            href="/"
            className="px-6 py-2 bg-[#173B8F] text-white rounded-lg hover:bg-[#081A3A] transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-[#171A21] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-lg font-semibold text-[#173B8F]">
            Order Number: {order.order_number}
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-[#171A21] mb-4">Order Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-[#171A21] mb-2">Shipping Address</h3>
              <p className="text-gray-600 whitespace-pre-line">{order.shipping_address}</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#171A21] mb-2">Billing Address</h3>
              <p className="text-gray-600 whitespace-pre-line">{order.billing_address}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Payment Status:</span>
              <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Order Date:</span>
              <span className="ml-2 text-sm text-[#171A21]">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-[#171A21] mb-4">Items</h3>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-[#171A21]">{item.product_name}</p>
                    {item.variant_name && (
                      <p className="text-sm text-gray-500">Variant: {item.variant_name}</p>
                    )}
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-[#171A21]">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[#171A21]">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#171A21]">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#171A21]">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-xl font-bold text-[#173B8F]">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        {order.tracking && order.tracking.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-[#171A21] mb-4">Order Tracking</h2>
            <div className="space-y-4">
              {order.tracking.map((track) => (
                <div key={track.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {track.status === 'pending' && <Clock className="text-yellow-500" size={20} />}
                    {track.status === 'processing' && <Package className="text-blue-500" size={20} />}
                    {track.status === 'shipped' && <Truck className="text-purple-500" size={20} />}
                    {track.status === 'delivered' && <CheckCircle className="text-green-500" size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#171A21]">{track.description}</p>
                    {track.location && (
                      <p className="text-sm text-gray-500">Location: {track.location}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {new Date(track.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center px-6 py-3 bg-[#173B8F] text-white rounded-lg font-medium hover:bg-[#081A3A] transition"
          >
            Continue Shopping
            <ArrowRight size={20} className="ml-2" />
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center px-6 py-3 border-2 border-[#173B8F] text-[#173B8F] rounded-lg font-medium hover:bg-[#173B8F] hover:text-white transition"
          >
            <Home size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
