export interface Wishlist {
  id: number;
  user_id: number;
  product_id: number;
  variant_id: number | null;
  created_at: Date;
  product?: {
    id: number;
    name: string;
    price: number;
    image_url?: string;
  };
  variant?: {
    id: number;
    name: string;
    price: number;
  } | null;
}

export interface CreateWishlist {
  user_id: number;
  product_id: number;
  variant_id?: number;
}