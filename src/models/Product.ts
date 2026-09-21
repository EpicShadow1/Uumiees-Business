export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
}