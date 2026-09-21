export interface ShoppingCart {
  id: number;
  user_id: number | null;
  session_id: string;
  created_at: Date;
  updated_at: Date;
  items?: CartItem[];
}

export interface CreateShoppingCart {
  user_id?: number;
  session_id?: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  price: number;
  created_at: Date;
  updated_at: Date;
  product?: {
    id: number;
    name: string;
    image_url?: string;
  };
  variant?: {
    id: number;
    name: string;
    sku: string;
  } | null;
}

export interface CreateCartItem {
  cart_id: number;
  product_id: number;
  variant_id?: number;
  quantity: number;
  price: number;
}

export interface UpdateCartItem {
  quantity?: number;
  price?: number;
}