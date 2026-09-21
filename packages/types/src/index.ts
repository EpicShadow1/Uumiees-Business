// User Types (matching backend models/User.ts)
export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUser {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  sessionToken: string;
  user: Omit<User, 'password_hash'>;
}

// Product Types (matching backend models/Product.ts)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compare_price?: number | null;
  stock: number;
  sku?: string | null;
  is_active: boolean;
  is_featured: boolean;
  weight?: number | null;
  dimensions?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  stock: number;
  sku?: string;
  is_active?: boolean;
  is_featured?: boolean;
  weight?: number;
  dimensions?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  compare_price?: number;
  stock?: number;
  sku?: string;
  is_active?: boolean;
  is_featured?: boolean;
  weight?: number;
  dimensions?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface ProductResponse extends Product {}

// Product Image Types (matching backend models/ProductImage.ts)
export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductImage {
  product_id: number;
  image_url: string;
  alt_text?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface UpdateProductImage {
  image_url?: string;
  alt_text?: string;
  is_primary?: boolean;
  sort_order?: number;
}

// Product Variant Types (matching backend models/ProductVariant.ts)
export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  options: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductVariant {
  product_id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  options: string;
  is_active?: boolean;
}

export interface UpdateProductVariant {
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
  options?: string;
  is_active?: boolean;
}

// Product Review Types (matching backend models/ProductReview.ts)
export interface ProductReview {
  id: number;
  product_id: number;
  user_id: number | null;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: Date;
  updated_at: Date;
  user?: {
    id: number | null;
    name: string;
  };
}

export interface CreateProductReview {
  product_id: number;
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateProductReview {
  rating?: number;
  title?: string;
  comment?: string;
  is_approved?: boolean;
}

// Category Types (matching backend models/Category.ts)
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: number | null;
  image_url?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  children?: Category[];
}

export interface CreateCategory {
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  image_url?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateCategory {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: number;
  image_url?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface CategoryResponse extends Category {}

// Shopping Cart Types (matching backend models/ShoppingCart.ts)
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
    image_url: string | null;
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
  quantity: number;
}

export interface ShoppingCart {
  id: number;
  user_id?: number | null;
  session_id?: string | null;
  items: CartItem[];
  created_at: Date;
  updated_at: Date;
}

// Order Types (matching backend models/Order.ts)
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

export interface OrderTracking {
  id: number;
  order_id: number;
  status: string;
  location?: string | null;
  description: string;
  estimated_delivery?: Date | null;
  actual_delivery?: Date | null;
  created_at: Date;
}

export interface CreateOrderTracking {
  order_id: number;
  status: string;
  location?: string;
  description: string;
  estimated_delivery?: Date;
  actual_delivery?: Date;
}

export interface UpdateOrderTracking {
  status?: string;
  location?: string;
  description?: string;
  estimated_delivery?: Date;
  actual_delivery?: Date;
}

export interface Order {
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
  created_at: Date;
  updated_at: Date;
  items?: OrderItem[];
  tracking?: OrderTracking[];
}

export interface CreateOrder {
  user_id: number;
  items: { product_id: number; variant_id?: number; quantity: number }[];
  shipping_address: string;
  billing_address: string;
  notes?: string;
  discount_code?: string;
}

export interface OrderResponse extends Order {}

// Wishlist Types (matching backend models/Wishlist.ts)
export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  variant_id: number | null;
  created_at: Date;
  product?: {
    id: number;
    name: string;
    price: number;
    image_url: string | null;
  };
  variant?: {
    id: number;
    name: string;
    price: number;
  } | null;
}

export interface CreateWishlistItem {
  user_id: number;
  product_id: number;
  variant_id?: number;
}

// Discount Types (matching backend models/Discount.ts)
export interface Discount {
  id: number;
  code: string;
  description?: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order: number;
  maximum_discount?: number | null;
  usage_limit?: number | null;
  used_count: number;
  valid_from: Date;
  valid_until: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDiscount {
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order?: number;
  maximum_discount?: number;
  usage_limit?: number;
  valid_from: Date;
  valid_until: Date;
  is_active?: boolean;
}

export interface UpdateDiscount {
  description?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  minimum_order?: number;
  maximum_discount?: number;
  usage_limit?: number;
  valid_from?: Date;
  valid_until?: Date;
  is_active?: boolean;
}

// Support Ticket Types (matching backend models/SupportTicket.ts)
export interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  assigned_to?: number | null;
  created_at: Date;
  updated_at: Date;
  user?: {
    id: number;
    name: string;
    email?: string;
  };
  assigned_to_user?: {
    id: number;
    name: string;
  } | null;
  messages?: TicketMessage[];
}

export interface CreateSupportTicket {
  subject: string;
  description: string;
  category: string;
  priority?: string;
}

export interface UpdateSupportTicket {
  status?: string;
  priority?: string;
  category?: string;
  assigned_to?: number;
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: number | null;
  message: string;
  is_internal: boolean;
  created_at: Date;
  user?: {
    id: number;
    name: string;
  } | null;
}

export interface CreateTicketMessage {
  ticket_id: number;
  message: string;
  is_internal?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
