export interface OrderTracking {
  id: number;
  order_id: number;
  status: string;
  location: string;
  description: string;
  estimated_delivery: Date | null;
  actual_delivery: Date | null;
  created_at: Date;
}

export interface CreateOrderTracking {
  order_id: number;
  status: string;
  location?: string;
  description?: string;
  estimated_delivery?: Date;
  actual_delivery?: Date;
}

export interface UpdateOrderTracking {
  status?: string;
  location?: string;
  description?: string;
  estimated_delivery?: Date;
  actual_delivery?: Date;
}