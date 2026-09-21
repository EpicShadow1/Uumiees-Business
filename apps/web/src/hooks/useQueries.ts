import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { initApi } from '@/lib/api';
import type {
  Product,
  Category,
  ShoppingCart,
  Order,
  WishlistItem,
  User,
} from '@uumiees/types';

const QK = {
  products: ['products'] as const,
  product: (id: number) => ['products', id] as const,
  categories: ['categories'] as const,
  category: (slug: string) => ['categories', slug] as const,
  cart: ['cart'] as const,
  orders: ['orders'] as const,
  order: (id: number) => ['orders', id] as const,
  tracking: (orderId: number) => ['tracking', orderId] as const,
  wishlist: ['wishlist'] as const,
  reviews: (productId: number) => ['reviews', productId] as const,
  productImages: (productId: number) => ['product-images', productId] as const,
  productVariants: (productId: number) => ['product-variants', productId] as const,
  user: ['user', 'profile'] as const,
  discounts: ['discounts'] as const,
  myTickets: ['support', 'tickets'] as const,
  search: (q: string) => ['search', q] as const,
};

export function useProducts(limit = 100, opts?: Omit<UseQueryOptions<Product[], unknown, Product[], readonly unknown[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: [...QK.products, limit] as const,
    queryFn: () => initApi().getProducts(limit),
    ...opts,
  });
}

export function useProduct(id: number, opts?: Omit<UseQueryOptions<Product, unknown, Product, readonly unknown[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: QK.product(id),
    queryFn: () => initApi().getProduct(id),
    enabled: !!id,
    ...opts,
  });
}

export function useFeaturedProducts(limit = 10) {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => initApi().getFeaturedProducts(limit),
  });
}

export function useSearchProducts(query: string, limit = 20) {
  return useQuery({
    queryKey: QK.search(query),
    queryFn: () => initApi().searchProducts(query, limit),
    enabled: query.trim().length > 0,
  });
}

export function useCategories(opts?: Omit<UseQueryOptions<Category[], unknown, Category[], readonly unknown[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({ queryKey: QK.categories, queryFn: () => initApi().getCategories(), ...opts });
}

export function useCategoryTree() {
  return useQuery({ queryKey: ['categories', 'tree'], queryFn: () => initApi().getCategoryTree() });
}

export function useUser(opts?: Omit<UseQueryOptions<User, unknown, User, readonly unknown[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({ queryKey: QK.user, queryFn: () => initApi().getProfile(), ...opts });
}

export function useUserUpdate(opts?: UseMutationOptions<User, unknown, Partial<User>, unknown>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: Partial<User>) => initApi().updateProfile(d),
    onSuccess: (d) => qc.setQueryData(QK.user, d),
    ...opts,
  });
}

export function useCart(opts?: Omit<UseQueryOptions<ShoppingCart, unknown, ShoppingCart, readonly unknown[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: QK.cart,
    queryFn: () => {
      const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') || undefined : undefined;
      return initApi().getCart(sessionId);
    },
    ...opts,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { data: Parameters<ReturnType<typeof initApi>['addToCart']>[0]; sessionId?: string }) =>
      initApi().addToCart(args.data, args.sessionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.cart }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; quantity: number }) => initApi().updateCartItem(args.id, { quantity: args.quantity }),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.cart }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => initApi().removeFromCart(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.cart }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId?: string) => initApi().clearCart(sessionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.cart }),
  });
}

export function useOrders(limit = 100, opts?: Omit<UseQueryOptions<Order[], unknown, Order[], readonly unknown[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: [...QK.orders, limit] as const,
    queryFn: () => initApi().getOrders(limit),
    ...opts,
  });
}

export function useOrder(id: number, opts?: Omit<UseQueryOptions<Order, unknown, Order, readonly unknown[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({ queryKey: QK.order(id), queryFn: () => initApi().getOrder(id), enabled: !!id, ...opts });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: Parameters<ReturnType<typeof initApi>['createOrder']>[0]) => initApi().createOrder(d),
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: QK.orders });
      qc.invalidateQueries({ queryKey: QK.cart });
      return d;
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; status: string }) => initApi().updateOrderStatus(args.id, args.status),
    onSuccess: (d) => qc.setQueryData(QK.order(d.id), d),
  });
}

export function useOrderTracking(orderId: number) {
  return useQuery({
    queryKey: QK.tracking(orderId),
    queryFn: () => initApi().getOrderTracking(orderId),
    enabled: !!orderId,
  });
}

export function useWishlist(opts?: Omit<UseQueryOptions<WishlistItem[], unknown, WishlistItem[], readonly unknown[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({ queryKey: QK.wishlist, queryFn: () => initApi().getWishlist(), ...opts });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { product_id: number; variant_id?: number }) => initApi().addToWishlist(args),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.wishlist }),
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { productId: number; variantId?: number }) =>
      initApi().removeFromWishlist(args.productId, args.variantId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.wishlist }),
  });
}

export function useInWishlist() {
  return useMutation({
    mutationFn: (args: { productId: number; variantId?: number }) =>
      initApi().isInWishlist(args.productId, args.variantId),
  });
}

export function useProductReviews(productId: number, limit = 20) {
  return useQuery({
    queryKey: QK.reviews(productId),
    queryFn: () => initApi().getProductReviews(productId, true, limit),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: Parameters<ReturnType<typeof initApi>['createReview']>[0]) => initApi().createReview(d),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: QK.reviews(vars.product_id) }),
  });
}

export function useAverageRating(productId: number) {
  return useQuery({
    queryKey: ['reviews', 'average', productId],
    queryFn: () => initApi().getAverageRating(productId),
    enabled: !!productId,
  });
}

export function useProductImages(productId: number) {
  return useQuery({
    queryKey: QK.productImages(productId),
    queryFn: () => initApi().getProductImages(productId),
    enabled: !!productId,
  });
}

export function usePrimaryImage(productId: number) {
  return useQuery({
    queryKey: ['product-images', 'primary', productId],
    queryFn: () => initApi().getPrimaryImage(productId),
    enabled: !!productId,
  });
}

export function useProductVariants(productId: number) {
  return useQuery({
    queryKey: QK.productVariants(productId),
    queryFn: () => initApi().getProductVariants(productId),
    enabled: !!productId,
  });
}

export function useDiscounts(activeOnly = true) {
  return useQuery({
    queryKey: [...QK.discounts, activeOnly] as const,
    queryFn: () => initApi().getDiscounts(activeOnly),
  });
}

export function useValidateDiscount() {
  return useMutation({
    mutationFn: (args: { code: string; orderTotal: number }) =>
      initApi().validateDiscount(args.code, args.orderTotal),
  });
}

export function useMyTickets(limit = 10) {
  return useQuery({
    queryKey: [...QK.myTickets, limit] as const,
    queryFn: () => initApi().getMyTickets(limit),
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: Parameters<ReturnType<typeof initApi>['createTicket']>[0]) => initApi().createTicket(d),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.myTickets }),
  });
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: ['support', 'ticket', id],
    queryFn: () => initApi().getTicket(id),
    enabled: !!id,
  });
}
