import { Discount as SharedDiscount, CreateDiscount as SharedCreateDiscount, UpdateDiscount as SharedUpdateDiscount } from '@uumiees/types';

export type Discount = SharedDiscount;
export type CreateDiscount = SharedCreateDiscount;
export type UpdateDiscount = SharedUpdateDiscount;

export interface DiscountUsage {
  id: number;
  discount_id: number;
  user_id: number;
  order_id: number | null;
  used_at: Date;
}