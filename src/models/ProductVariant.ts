export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  name: string;
  price: number;
  compare_price: number;
  stock: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  options?: VariantOption[];
}

export interface CreateProductVariant {
  product_id: number;
  sku?: string;
  name?: string;
  price?: number;
  compare_price?: number;
  stock?: number;
  is_active?: boolean;
  options?: {
    option_name: string;
    option_value: string;
  }[];
}

export interface UpdateProductVariant {
  sku?: string;
  name?: string;
  price?: number;
  compare_price?: number;
  stock?: number;
  is_active?: boolean;
}

export interface VariantOption {
  id: number;
  variant_id: number;
  option_name: string;
  option_value: string;
  created_at: Date;
}