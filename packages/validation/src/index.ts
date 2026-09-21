import { z } from 'zod';

export const authSchemas = {
  register: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
  }),

  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
};

export const userSchemas = {
  updateProfile: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    postal_code: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
  }),
};

export const productSchemas = {
  create: z.object({
    name: z.string().min(1).max(255),
    description: z.string().min(1),
    price: z.number().positive(),
    compare_price: z.number().positive().optional().nullable(),
    stock: z.number().int().min(0),
    sku: z.string().optional().nullable(),
    is_active: z.boolean().optional(),
    is_featured: z.boolean().optional(),
    weight: z.number().positive().optional().nullable(),
    dimensions: z.string().optional().nullable(),
    meta_title: z.string().optional().nullable(),
    meta_description: z.string().optional().nullable(),
  }),

  update: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    compare_price: z.number().positive().optional().nullable(),
    stock: z.number().int().min(0).optional(),
    sku: z.string().optional().nullable(),
    is_active: z.boolean().optional(),
    is_featured: z.boolean().optional(),
    weight: z.number().positive().optional().nullable(),
    dimensions: z.string().optional().nullable(),
    meta_title: z.string().optional().nullable(),
    meta_description: z.string().optional().nullable(),
  }),

  search: z.object({
    q: z.string().min(1).max(255),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).optional(),
  }),
};

export const productVariantSchemas = {
  create: z.object({
    product_id: z.number().int().positive(),
    sku: z.string().optional(),
    name: z.string().min(1).max(255).optional(),
    price: z.number().positive().optional(),
    compare_price: z.number().positive().optional().nullable(),
    stock: z.number().int().min(0).optional(),
    is_active: z.boolean().optional(),
    options: z.array(
      z.object({
        option_name: z.string().min(1),
        option_value: z.string().min(1),
      })
    ).optional(),
  }),

  update: z.object({
    sku: z.string().optional(),
    name: z.string().min(1).max(255).optional(),
    price: z.number().positive().optional(),
    compare_price: z.number().positive().optional().nullable(),
    stock: z.number().int().min(0).optional(),
    is_active: z.boolean().optional(),
  }),
};

export const productImageSchemas = {
  create: z.object({
    product_id: z.number().int().positive(),
    image_url: z.string().url(),
    alt_text: z.string().optional().nullable(),
    is_primary: z.boolean().optional(),
    sort_order: z.number().int().min(0).optional(),
  }),

  update: z.object({
    image_url: z.string().url().optional(),
    alt_text: z.string().optional().nullable(),
    is_primary: z.boolean().optional(),
    sort_order: z.number().int().min(0).optional(),
  }),
};

export const reviewSchemas = {
  create: z.object({
    product_id: z.number().int().positive(),
    rating: z.number().int().min(1).max(5),
    title: z.string().min(1).max(255),
    comment: z.string().min(1),
  }),

  update: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().min(1).max(255).optional(),
    comment: z.string().min(1).optional(),
    is_approved: z.boolean().optional(),
  }),
};

export const categorySchemas = {
  create: z.object({
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    description: z.string().optional().nullable(),
    parent_id: z.number().int().positive().optional().nullable(),
    image_url: z.string().url().optional().nullable(),
    is_active: z.boolean().optional(),
    sort_order: z.number().int().min(0).optional(),
  }),

  update: z.object({
    name: z.string().min(1).max(255).optional(),
    slug: z.string().min(1).max(255).optional(),
    description: z.string().optional().nullable(),
    parent_id: z.number().int().positive().optional().nullable(),
    image_url: z.string().url().optional().nullable(),
    is_active: z.boolean().optional(),
    sort_order: z.number().int().min(0).optional(),
  }),
};

export const cartSchemas = {
  addItem: z.object({
    product_id: z.number().int().positive(),
    variant_id: z.number().int().positive().optional().nullable(),
    quantity: z.number().int().min(1),
    price: z.number().positive().optional(),
  }),

  updateItem: z.object({
    quantity: z.number().int().min(1),
    price: z.number().positive().optional(),
  }),

  merge: z.object({
    sourceCartId: z.number().int().positive(),
    targetCartId: z.number().int().positive(),
  }),
};

export const orderSchemas = {
  create: z.object({
    user_id: z.number().int().positive(),
    items: z.array(
      z.object({
        product_id: z.number().int().positive(),
        variant_id: z.number().int().positive().optional().nullable(),
        quantity: z.number().int().min(1),
      })
    ).min(1, 'Order must contain at least one item'),
    shipping_address: z.string().min(1),
    billing_address: z.string().min(1),
    notes: z.string().optional(),
    discount_code: z.string().optional(),
  }),

  updateStatus: z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  }),
};

export const wishlistSchemas = {
  addItem: z.object({
    product_id: z.number().int().positive(),
    variant_id: z.number().int().positive().optional().nullable(),
  }),
};

export const discountSchemas = {
  create: z.object({
    code: z.string().min(1).max(50),
    description: z.string().optional().nullable(),
    discount_type: z.enum(['percentage', 'fixed']),
    discount_value: z.number().positive(),
    minimum_order: z.number().min(0).optional(),
    maximum_discount: z.number().positive().optional().nullable(),
    usage_limit: z.number().int().min(1).optional().nullable(),
    valid_from: z.coerce.date(),
    valid_until: z.coerce.date(),
    is_active: z.boolean().optional(),
  }),

  update: z.object({
    description: z.string().optional().nullable(),
    discount_type: z.enum(['percentage', 'fixed']).optional(),
    discount_value: z.number().positive().optional(),
    minimum_order: z.number().min(0).optional(),
    maximum_discount: z.number().positive().optional().nullable(),
    usage_limit: z.number().int().min(1).optional().nullable(),
    valid_from: z.coerce.date().optional(),
    valid_until: z.coerce.date().optional(),
    is_active: z.boolean().optional(),
  }),

  validate: z.object({
    code: z.string().min(1).max(50),
    orderTotal: z.number().min(0),
  }),
};

export const supportTicketSchemas = {
  create: z.object({
    subject: z.string().min(1).max(255),
    description: z.string().min(1),
    category: z.string().min(1),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  }),

  update: z.object({
    status: z.enum(['open', 'in_progress', 'awaiting_reply', 'resolved', 'closed']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    category: z.string().min(1).optional(),
    assigned_to: z.number().int().positive().optional().nullable(),
  }),

  addMessage: z.object({
    message: z.string().min(1),
    is_internal: z.boolean().optional(),
  }),
};

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }
  return { success: false, errors };
}

export default {
  authSchemas,
  userSchemas,
  productSchemas,
  productVariantSchemas,
  productImageSchemas,
  reviewSchemas,
  categorySchemas,
  cartSchemas,
  orderSchemas,
  wishlistSchemas,
  discountSchemas,
  supportTicketSchemas,
  validate,
};
