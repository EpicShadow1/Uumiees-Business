import { OrderTracking } from './OrderTracking';

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: string;
  payment_method: string;
  payment_id: string;
  shipping_address: string;
  billing_address: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  items?: OrderItem[];
  tracking?: OrderTracking[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  price: number;
  product_name: string;
  variant_name: string;
  created_at: Date;
}

export interface CreateOrder {
  user_id: number;
  items: {
    product_id: number;
    variant_id?: number;
    quantity: number;
  }[];
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
  discount_code?: string;
}

export interface OrderResponse {
  id: number;
  user_id: number;
  order_number: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  payment_id: string;
  shipping_address: string;
  billing_address: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  items: {
    id: number;
    product_id: number;
    variant_id: number | null;
    quantity: number;
    price: number;
    product_name: string;
    variant_name: string;
  }[];
  tracking?: OrderTracking[];
}