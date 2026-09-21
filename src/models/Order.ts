export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
}

export interface CreateOrder {
  user_id: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface OrderResponse {
  id: number;
  user_id: number;
  total: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  items: {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    product_name?: string;
  }[];
}