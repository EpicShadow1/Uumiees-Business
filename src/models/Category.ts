export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  parent_id: number | null;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCategory {
  name: string;
  description?: string;
  slug: string;
  parent_id?: number;
  image_url?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateCategory {
  name?: string;
  description?: string;
  slug?: string;
  parent_id?: number;
  image_url?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  slug: string;
  parent_id: number | null;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  children?: CategoryResponse[];
}