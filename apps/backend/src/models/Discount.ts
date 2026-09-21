export interface Discount {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order: number;
  maximum_discount: number | null;
  usage_limit: number | null;
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

export interface DiscountUsage {
  id: number;
  discount_id: number;
  user_id: number;
  order_id: number | null;
  used_at: Date;
}