import { pool, executeWithRetry } from '../config/database';
import { OrderTracking, CreateOrderTracking, UpdateOrderTracking } from '../models';

class OrderTrackingService {
  async create(trackingData: CreateOrderTracking): Promise<OrderTracking> {
    const { order_id, status, location, description, estimated_delivery, actual_delivery } = trackingData;

    return executeWithRetry(async () => {
      const result = await pool.query(
        `INSERT INTO order_tracking (order_id, status, location, description, estimated_delivery, actual_delivery, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id, order_id, status, location, description, estimated_delivery, actual_delivery, created_at`,
        [order_id, status, location, description, estimated_delivery, actual_delivery]
      );

      return result.rows[0];
    });
  }

  async findByOrderId(orderId: number): Promise<OrderTracking[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, order_id, status, location, description, estimated_delivery, actual_delivery, created_at 
         FROM order_tracking WHERE order_id = $1 ORDER BY created_at DESC`,
        [orderId]
      );

      return result.rows;
    });
  }

  async getLatestStatus(orderId: number): Promise<OrderTracking | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, order_id, status, location, description, estimated_delivery, actual_delivery, created_at 
         FROM order_tracking WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [orderId]
      );

      return result.rows[0] || null;
    });
  }

  async update(id: number, trackingData: UpdateOrderTracking): Promise<OrderTracking | null> {
    const { status, location, description, estimated_delivery, actual_delivery } = trackingData;

    return executeWithRetry(async () => {
      const updates: string[] = [];
      const values: (string | number | Date | null)[] = [];
      let paramCount = 1;

      if (status !== undefined) {
        updates.push(`status = $${paramCount}`);
        values.push(status);
        paramCount++;
      }

      if (location !== undefined) {
        updates.push(`location = $${paramCount}`);
        values.push(location);
        paramCount++;
      }

      if (description !== undefined) {
        updates.push(`description = $${paramCount}`);
        values.push(description);
        paramCount++;
      }

      if (estimated_delivery !== undefined) {
        updates.push(`estimated_delivery = $${paramCount}`);
        values.push(estimated_delivery instanceof Date ? estimated_delivery : null);
        paramCount++;
      }

      if (actual_delivery !== undefined) {
        updates.push(`actual_delivery = $${paramCount}`);
        values.push(actual_delivery instanceof Date ? actual_delivery : null);
        paramCount++;
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id);

      const query = `
        UPDATE order_tracking
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, order_id, status, location, description, estimated_delivery, actual_delivery, created_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    });
  }

  async findById(id: number): Promise<OrderTracking | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, order_id, status, location, description, estimated_delivery, actual_delivery, created_at 
         FROM order_tracking WHERE id = $1`,
        [id]
      );

      return result.rows[0] || null;
    });
  }

  async delete(id: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `DELETE FROM order_tracking WHERE id = $1`,
        [id]
      );

      return (result.rowCount ?? 0) > 0;
    });
  }
}

export const orderTrackingService = new OrderTrackingService();