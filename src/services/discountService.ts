import { pool, executeWithRetry } from '../config/database';
import { Discount, CreateDiscount, UpdateDiscount } from '../models';

class DiscountService {
  async create(discountData: CreateDiscount): Promise<Discount> {
    const { code, description, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, valid_from, valid_until, is_active } = discountData;

    return executeWithRetry(async () => {
      const result = await pool.query(
        `INSERT INTO discounts (code, description, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, used_count, valid_from, valid_until, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8, $9, $10, NOW(), NOW())
         RETURNING id, code, description, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, used_count, valid_from, valid_until, is_active, created_at, updated_at`,
        [code, description, discount_type, discount_value, minimum_order || 0, maximum_discount, usage_limit, valid_from, valid_until, is_active ?? true]
      );

      return result.rows[0];
    });
  }

  async findByCode(code: string): Promise<Discount | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, code, description, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, used_count, valid_from, valid_until, is_active, created_at, updated_at 
         FROM discounts WHERE code = $1 AND is_active = true`,
        [code]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const discount = result.rows[0];

      // Check if discount is still valid
      const now = new Date();
      if (now < discount.valid_from || now > discount.valid_until) {
        return null;
      }

      // Check if usage limit reached
      if (discount.usage_limit && discount.used_count >= discount.usage_limit) {
        return null;
      }

      return discount;
    });
  }

  async validateDiscount(code: string, orderTotal: number): Promise<Discount | null> {
    const discount = await this.findByCode(code);

    if (!discount) {
      return null;
    }

    // Check minimum order requirement
    if (orderTotal < discount.minimum_order) {
      return null;
    }

    return discount;
  }

  async calculateDiscount(discount: Discount, orderTotal: number): Promise<number> {
    let discountAmount = 0;

    if (discount.discount_type === 'percentage') {
      discountAmount = orderTotal * (discount.discount_value / 100);
    } else {
      discountAmount = discount.discount_value;
    }

    // Apply maximum discount limit if set
    if (discount.maximum_discount && discountAmount > discount.maximum_discount) {
      discountAmount = discount.maximum_discount;
    }

    // Don't discount more than the order total
    if (discountAmount > orderTotal) {
      discountAmount = orderTotal;
    }

    return discountAmount;
  }

  async recordUsage(discountId: number, userId: number, orderId?: number): Promise<void> {
    return executeWithRetry(async () => {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        // Increment used count
        await client.query(
          `UPDATE discounts SET used_count = used_count + 1 WHERE id = $1`,
          [discountId]
        );

        // Record usage
        await client.query(
          `INSERT INTO discount_usage (discount_id, user_id, order_id, used_at)
           VALUES ($1, $2, $3, NOW())`,
          [discountId, userId, orderId]
        );

        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    });
  }

  async getUserUsageCount(discountId: number, userId: number): Promise<number> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT COUNT(*) as count FROM discount_usage WHERE discount_id = $1 AND user_id = $2`,
        [discountId, userId]
      );

      return result.rows[0]?.count || 0;
    });
  }

  async update(id: number, discountData: UpdateDiscount): Promise<Discount | null> {
    const { description, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, valid_from, valid_until, is_active } = discountData;

    return executeWithRetry(async () => {
      const updates: string[] = [];
      const values: (string | number | Date | boolean | null)[] = [];
      let paramCount = 1;

      if (description !== undefined) {
        updates.push(`description = $${paramCount}`);
        values.push(description);
        paramCount++;
      }

      if (discount_type !== undefined) {
        updates.push(`discount_type = $${paramCount}`);
        values.push(discount_type);
        paramCount++;
      }

      if (discount_value !== undefined) {
        updates.push(`discount_value = $${paramCount}`);
        values.push(discount_value);
        paramCount++;
      }

      if (minimum_order !== undefined) {
        updates.push(`minimum_order = $${paramCount}`);
        values.push(minimum_order);
        paramCount++;
      }

      if (maximum_discount !== undefined) {
        updates.push(`maximum_discount = $${paramCount}`);
        values.push(maximum_discount);
        paramCount++;
      }

      if (usage_limit !== undefined) {
        updates.push(`usage_limit = $${paramCount}`);
        values.push(usage_limit);
        paramCount++;
      }

      if (valid_from !== undefined) {
        updates.push(`valid_from = $${paramCount}`);
        values.push(valid_from);
        paramCount++;
      }

      if (valid_until !== undefined) {
        updates.push(`valid_until = $${paramCount}`);
        values.push(valid_until);
        paramCount++;
      }

      if (is_active !== undefined) {
        updates.push(`is_active = $${paramCount}`);
        values.push(is_active);
        paramCount++;
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      updates.push(`updated_at = NOW()`);

      const query = `
        UPDATE discounts
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, code, description, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, used_count, valid_from, valid_until, is_active, created_at, updated_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    });
  }

  async findById(id: number): Promise<Discount | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, code, description, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, used_count, valid_from, valid_until, is_active, created_at, updated_at 
         FROM discounts WHERE id = $1`,
        [id]
      );

      return result.rows[0] || null;
    });
  }

  async getAll(activeOnly = false): Promise<Discount[]> {
    return executeWithRetry(async () => {
      const query = activeOnly
        ? `SELECT id, code, description, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, used_count, valid_from, valid_until, is_active, created_at, updated_at 
           FROM discounts WHERE is_active = true ORDER BY created_at DESC`
        : `SELECT id, code, description, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, used_count, valid_from, valid_until, is_active, created_at, updated_at 
           FROM discounts ORDER BY created_at DESC`;

      const result = await pool.query(query);
      return result.rows;
    });
  }

  async delete(id: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `DELETE FROM discounts WHERE id = $1`,
        [id]
      );

      return (result.rowCount ?? 0) > 0;
    });
  }
}

export const discountService = new DiscountService();