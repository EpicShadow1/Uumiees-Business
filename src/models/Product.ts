export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compare_price: number;
  stock: number;
  sku: string;
  is_active: boolean;
  is_featured: boolean;
  weight: number;
  dimensions: string;
  meta_title: string;
  meta_description: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProduct {
  name: string;
  description?: string;
  price: number;
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

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  compare_price: number;
  stock: number;
  sku: string;
  is_active: boolean;
  is_featured: boolean;
  weight: number;
  dimensions: string;
  meta_title: string;
  meta_description: string;
  created_at: Date;
  updated_at: Date;
}