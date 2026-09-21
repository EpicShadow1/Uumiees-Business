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
  title?: string;
  comment?: string;
}

export interface UpdateProductReview {
  rating?: number;
  title?: string;
  comment?: string;
  is_approved?: boolean;
}