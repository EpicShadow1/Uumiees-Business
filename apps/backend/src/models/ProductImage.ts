export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  created_at: Date;
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