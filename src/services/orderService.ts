import { pool, executeWithRetry } from '../config/database';
import { CreateOrder, OrderResponse } from '../models';
import { productService } from './productService';

class OrderService {
  async create(orderData: CreateOrder): Promise<OrderResponse> {
    const { user_id, items } = orderData;

    return executeWithRetry(async () => {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        // Validate all products exist and have sufficient stock
        for (const item of items) {
          const product = await productService.findById(item.product_id);
          if (!product) {
            throw new Error(`Product ${item.product_id} not found`);
          }

          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ${item.product_id}`);
          }
        }

        // Calculate total
        let total = 0;
        const orderItems: { product_id: number; quantity: number; price: number }[] = [];

        for (const item of items) {
          const product = await productService.findById(item.product_id);
          if (product) {
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            orderItems.push({
              product_id: item.product_id,
              quantity: item.quantity,
              price: product.price
            });
          }
        }

        // Create order
        const orderResult = await client.query(
          `INSERT INTO orders (user_id, total, status, created_at, updated_at)
           VALUES ($1, $2, 'pending', NOW(), NOW())
           RETURNING id, user_id, total, status, created_at, updated_at`,
          [user_id, total]
        );

        const order = orderResult.rows[0];

        // Create order items and update inventory
        for (const item of orderItems) {
          // Create order item
          await client.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [order.id, item.product_id, item.quantity, item.price]
          );

          // Update product stock
          await client.query(
            `UPDATE products
             SET stock = stock - $1, updated_at = NOW()
             WHERE id = $2`,
            [item.quantity, item.product_id]
          );
        }

        await client.query('COMMIT');

        // Fetch complete order with items
        const orderWithItems = await this.findById(order.id);
        if (!orderWithItems) {
          throw new Error('Failed to fetch created order');
        }
        return orderWithItems;

      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    });
  }

  async findById(id: number): Promise<OrderResponse | null> {
    return executeWithRetry(async () => {
      const orderResult = await pool.query(
        `SELECT id, user_id, total, status, created_at, updated_at 
         FROM orders WHERE id = $1`,
        [id]
      );

      if (orderResult.rows.length === 0) {
        return null;
      }

      const order = orderResult.rows[0];

      // Get order items with product names
      const itemsResult = await pool.query(
        `SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name as product_name
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [order.id]
      );

      return {
        ...order,
        items: itemsResult.rows
      };
    });
  }

  async findByUserId(userId: number, limit = 100, offset = 0): Promise<OrderResponse[]> {
    return executeWithRetry(async () => {
      const orderResult = await pool.query(
        `SELECT id, user_id, total, status, created_at, updated_at 
         FROM orders 
         WHERE user_id = $1
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      const orders = orderResult.rows;

      // Get items for each order
      const ordersWithItems: OrderResponse[] = [];
      for (const order of orders) {
        const itemsResult = await pool.query(
          `SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name as product_name
           FROM order_items oi
           LEFT JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );

        ordersWithItems.push({
          ...order,
          items: itemsResult.rows
        });
      }

      return ordersWithItems;
    });
  }

  async updateStatus(id: number, status: string): Promise<OrderResponse | null> {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid order status');
    }

    return executeWithRetry(async () => {
      const result = await pool.query(
        `UPDATE orders 
         SET status = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, user_id, total, status, created_at, updated_at`,
        [status, id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.findById(result.rows[0].id);
    });
  }

  async cancelOrder(id: number): Promise<OrderResponse | null> {
    return executeWithRetry(async () => {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        // Get order details
        const orderResult = await client.query(
          `SELECT id, status FROM orders WHERE id = $1`,
          [id]
        );

        if (orderResult.rows.length === 0) {
          throw new Error('Order not found');
        }

        const order = orderResult.rows[0];

        if (order.status === 'cancelled' || order.status === 'delivered') {
          throw new Error('Cannot cancel this order');
        }

        // Get order items
        const itemsResult = await client.query(
          `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
          [id]
        );

        // Restore inventory
        for (const item of itemsResult.rows) {
          await client.query(
            `UPDATE products 
             SET stock = stock + $1, updated_at = NOW()
             WHERE id = $2`,
            [item.quantity, item.product_id]
          );
        }

        // Update order status
        await client.query(
          `UPDATE orders 
           SET status = 'cancelled', updated_at = NOW()
           WHERE id = $1`,
          [id]
        );

        await client.query('COMMIT');

        return this.findById(id);

      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    });
  }

  async getAll(limit = 100, offset = 0): Promise<OrderResponse[]> {
    return executeWithRetry(async () => {
      const orderResult = await pool.query(
        `SELECT id, user_id, total, status, created_at, updated_at 
         FROM orders 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const orders = orderResult.rows;

      // Get items for each order
      const ordersWithItems: OrderResponse[] = [];
      for (const order of orders) {
        const itemsResult = await pool.query(
          `SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name as product_name
           FROM order_items oi
           LEFT JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );

        ordersWithItems.push({
          ...order,
          items: itemsResult.rows
        });
      }

      return ordersWithItems;
    });
  }
}

export const orderService = new OrderService();