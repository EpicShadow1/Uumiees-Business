import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  User,
  AuthResponse,
  Product,
  ProductImage,
  ProductVariant,
  ProductReview,
  Category,
  CartItem,
  ShoppingCart,
  Order,
  OrderResponse,
  OrderTracking,
  WishlistItem,
  Discount,
  SupportTicket,
  ApiResponse,
  PaginatedResponse
} from '@uumiees/types';

export class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          // Optionally redirect to login
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  // Auth Endpoints
  async register(data: { email: string; password: string; name: string; phone?: string; address?: string; city?: string; state?: string; postal_code?: string; country?: string }): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/register', data);
    this.setToken(response.data.token);
    return response.data;
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/login', data);
    this.setToken(response.data.token);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/api/auth/logout');
    this.clearToken();
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<User>('/api/users/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.client.put<User>('/api/users/profile', data);
    return response.data;
  }

  // Product Endpoints
  async getProducts(limit = 100, offset = 0, activeOnly = true): Promise<Product[]> {
    const response = await this.client.get<Product[]>('/api/products', {
      params: { limit, offset, activeOnly }
    });
    return response.data;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.client.get<Product>(`/api/products/${id}`);
    return response.data;
  }

  async searchProducts(query: string, limit = 20): Promise<Product[]> {
    const response = await this.client.get<Product[]>('/api/products/search', {
      params: { q: query, limit }
    });
    return response.data;
  }

  async getFeaturedProducts(limit = 10): Promise<Product[]> {
    const response = await this.client.get<Product[]>('/api/products/featured', {
      params: { limit }
    });
    return response.data;
  }

  // Product Images
  async getProductImages(productId: number): Promise<ProductImage[]> {
    const response = await this.client.get<ProductImage[]>(`/api/product-images/product/${productId}`);
    return response.data;
  }

  async getPrimaryImage(productId: number): Promise<ProductImage> {
    const response = await this.client.get<ProductImage>(`/api/product-images/product/${productId}/primary`);
    return response.data;
  }

  // Product Variants
  async getProductVariants(productId: number): Promise<ProductVariant[]> {
    const response = await this.client.get<ProductVariant[]>(`/api/product-variants/product/${productId}`);
    return response.data;
  }

  // Categories
  async getCategories(activeOnly = true): Promise<Category[]> {
    const response = await this.client.get<Category[]>('/api/categories', {
      params: { activeOnly }
    });
    return response.data;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await this.client.get<Category>(`/api/categories/${id}`);
    return response.data;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await this.client.get<Category>(`/api/categories/slug/${slug}`);
    return response.data;
  }

  async getCategoryTree(): Promise<Category[]> {
    const response = await this.client.get<Category[]>('/api/categories/tree');
    return response.data;
  }

  // Shopping Cart
  async getCart(sessionId?: string): Promise<ShoppingCart> {
    const headers = sessionId ? { 'x-session-id': sessionId } : {};
    const response = await this.client.get<ShoppingCart>('/api/cart', { headers });
    return response.data;
  }

  async addToCart(data: { product_id: number; variant_id?: number; quantity: number; price: number }, sessionId?: string): Promise<CartItem> {
    const headers = sessionId ? { 'x-session-id': sessionId } : {};
    const response = await this.client.post<CartItem>('/api/cart', data, { headers });
    return response.data;
  }

  async updateCartItem(id: number, data: { quantity: number }): Promise<CartItem> {
    const response = await this.client.put<CartItem>(`/api/cart/items/${id}`, data);
    return response.data;
  }

  async removeFromCart(id: number): Promise<void> {
    await this.client.delete(`/api/cart/items/${id}`);
  }

  async clearCart(sessionId?: string): Promise<void> {
    const headers = sessionId ? { 'x-session-id': sessionId } : {};
    await this.client.delete('/api/cart', { headers });
  }

  async getCartTotal(sessionId?: string): Promise<{ total: number }> {
    const headers = sessionId ? { 'x-session-id': sessionId } : {};
    const response = await this.client.get<{ total: number }>('/api/cart/total', { headers });
    return response.data;
  }

  async getCartItemCount(sessionId?: string): Promise<{ count: number }> {
    const headers = sessionId ? { 'x-session-id': sessionId } : {};
    const response = await this.client.get<{ count: number }>('/api/cart/count', { headers });
    return response.data;
  }

  async mergeCarts(sourceCartId: number, targetCartId: number): Promise<void> {
    await this.client.post('/api/cart/merge', { sourceCartId, targetCartId });
  }

  // Orders
  async createOrder(data: {
    user_id: number;
    items: { product_id: number; variant_id?: number; quantity: number }[];
    shipping_address: string;
    billing_address: string;
    notes?: string;
    discount_code?: string;
  }): Promise<OrderResponse> {
    const response = await this.client.post<OrderResponse>('/api/orders', data);
    return response.data;
  }

  async getOrders(limit = 100, offset = 0): Promise<Order[]> {
    const response = await this.client.get<Order[]>('/api/orders', {
      params: { limit, offset }
    });
    return response.data;
  }

  async getOrder(id: number): Promise<Order> {
    const response = await this.client.get<Order>(`/api/orders/${id}`);
    return response.data;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const response = await this.client.put<Order>(`/api/orders/${id}/status`, { status });
    return response.data;
  }

  async cancelOrder(id: number): Promise<Order> {
    const response = await this.client.post<Order>(`/api/orders/${id}/cancel`);
    return response.data;
  }

  // Order Tracking
  async getOrderTracking(orderId: number): Promise<OrderTracking[]> {
    const response = await this.client.get<OrderTracking[]>(`/api/tracking/order/${orderId}`);
    return response.data;
  }

  async getLatestTrackingStatus(orderId: number): Promise<OrderTracking> {
    const response = await this.client.get<OrderTracking>(`/api/tracking/order/${orderId}/latest`);
    return response.data;
  }

  // Product Reviews
  async getProductReviews(productId: number, approvedOnly = true, limit = 10, offset = 0): Promise<ProductReview[]> {
    const response = await this.client.get<ProductReview[]>(`/api/reviews/product/${productId}`, {
      params: { approvedOnly, limit, offset }
    });
    return response.data;
  }

  async createReview(data: {
    product_id: number;
    rating: number;
    title: string;
    comment: string;
  }): Promise<ProductReview> {
    const response = await this.client.post<ProductReview>('/api/reviews', data);
    return response.data;
  }

  async markReviewHelpful(reviewId: number): Promise<ProductReview> {
    const response = await this.client.post<ProductReview>(`/api/reviews/${reviewId}/helpful`);
    return response.data;
  }

  async getAverageRating(productId: number): Promise<{ averageRating: number }> {
    const response = await this.client.get<{ averageRating: number }>(`/api/reviews/product/${productId}/average`);
    return response.data;
  }

  // Wishlist
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await this.client.get<WishlistItem[]>('/api/wishlist');
    return response.data;
  }

  async addToWishlist(data: { product_id: number; variant_id?: number }): Promise<WishlistItem> {
    const response = await this.client.post<WishlistItem>('/api/wishlist', data);
    return response.data;
  }

  async removeFromWishlist(productId: number, variantId?: number): Promise<void> {
    const params = variantId ? { variantId } : {};
    await this.client.delete(`/api/wishlist/product/${productId}`, { params });
  }

  async isInWishlist(productId: number, variantId?: number): Promise<{ inWishlist: boolean }> {
    const params = variantId ? { variantId } : {};
    const response = await this.client.get<{ inWishlist: boolean }>(`/api/wishlist/product/${productId}`, { params });
    return response.data;
  }

  async clearWishlist(): Promise<void> {
    await this.client.delete('/api/wishlist');
  }

  // Discounts
  async getDiscountByCode(code: string): Promise<Discount> {
    const response = await this.client.get<Discount>(`/api/discounts/code/${code}`);
    return response.data;
  }

  async validateDiscount(code: string, orderTotal: number): Promise<{
    valid: boolean;
    discount: Discount;
    discountAmount: number;
    finalTotal: number;
  }> {
    const response = await this.client.post(`/api/discounts/validate/${code}`, { orderTotal });
    return response.data;
  }

  async getDiscounts(activeOnly = true): Promise<Discount[]> {
    const response = await this.client.get<Discount[]>('/api/discounts', {
      params: { activeOnly }
    });
    return response.data;
  }

  // Support Tickets
  async createTicket(data: {
    subject: string;
    description: string;
    category: string;
    priority?: string;
  }): Promise<SupportTicket> {
    const response = await this.client.post<SupportTicket>('/api/support', data);
    return response.data;
  }

  async getMyTickets(limit = 10, offset = 0): Promise<SupportTicket[]> {
    const response = await this.client.get<SupportTicket[]>('/api/support/my', {
      params: { limit, offset }
    });
    return response.data;
  }

  async getTicket(id: number): Promise<SupportTicket> {
    const response = await this.client.get<SupportTicket>(`/api/support/${id}`);
    return response.data;
  }

  async updateTicket(id: number, data: { status?: string; priority?: string; category?: string }): Promise<SupportTicket> {
    const response = await this.client.put<SupportTicket>(`/api/support/${id}`, data);
    return response.data;
  }

  async addTicketMessage(ticketId: number, message: string, isInternal = false): Promise<any> {
    const response = await this.client.post(`/api/support/${ticketId}/messages`, {
      message,
      is_internal: isInternal
    });
    return response.data;
  }
}

// Create default API client instance
let apiClient: ApiClient | null = null;

export function getApiClient(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'): ApiClient {
  if (!apiClient) {
    apiClient = new ApiClient(baseURL);
  }
  return apiClient;
}

export function setApiClient(client: ApiClient) {
  apiClient = client;
}

export default getApiClient;
