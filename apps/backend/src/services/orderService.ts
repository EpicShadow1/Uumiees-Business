import { pool, executeWithRetry } from '../config/database';
import { CreateOrder, OrderResponse } from '../models';
import { productService } from './productService';
import { discountService } from './discountService';
import { orderTrackingService } from './orderTrackingService';

class OrderService {
  async create(orderData: CreateOrder): Promise<OrderResponse> {
    const { user_id, items, shipping_address, billing_address, notes, discount_code } = orderData;

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

        // Calculate subtotal
        let subtotal = 0;
        const orderItems: { product_id: number; variant_id: number | null; quantity: number; price: number; product_name: string; variant_name: string }[] = [];

        for (const item of items) {
          const product = await productService.findById(item.product_id);
          if (product) {
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            orderItems.push({
              product_id: item.product_id,
              variant_id: item.variant_id || null,
              quantity: item.quantity,
              price: product.price,
              product_name: product.name,
              variant_name: ''
            });
          }
        }

        // Calculate discount if provided
        let discount = 0;
        if (discount_code) {
          const discountObj = await discountService.validateDiscount(discount_code, subtotal);
          if (discountObj) {
            discount = await discountService.calculateDiscount(discountObj, subtotal);
            await discountService.recordUsage(discountObj.id, user_id);
          }
        }

        // Calculate tax (10% for example)
        const tax = (subtotal - discount) * 0.1;

        // Calculate shipping (flat rate for example)
        const shipping = 10;

        // Calculate total
        const total = subtotal - discount + tax + shipping;

        // Create order
        const orderResult = await client.query(
          `INSERT INTO orders (user_id, subtotal, tax, shipping, discount, total, status, payment_status, shipping_address, billing_address, notes, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'pending', $7, $8, $9, NOW(), NOW())
           RETURNING id, user_id, order_number, subtotal, tax, shipping, discount, total, status, payment_status, shipping_address, billing_address, notes, created_at, updated_at`,
          [user_id, subtotal, tax, shipping, discount, total, shipping_address, billing_address, notes]
        );

        const order = orderResult.rows[0];

        // Create order items and update inventory
        for (const item of orderItems) {
          // Create order item
          await client.query(
            `INSERT INTO order_items (order_id, product_id, variant_id, quantity, price, product_name, variant_name, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [order.id, item.product_id, item.variant_id, item.quantity, item.price, item.product_name, item.variant_name]
          );

          // Update product stock
          await client.query(
            `UPDATE products
             SET stock = stock - $1, updated_at = NOW()
             WHERE id = $2`,
            [item.quantity, item.product_id]
          );
        }

        // Create initial tracking entry
        await orderTrackingService.create({
          order_id: order.id,
          status: 'Order Placed',
          description: 'Your order has been received and is being processed',
          estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
        });

        await client.query('COMMIT');

        // Fetch complete order with items and tracking
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
        `SELECT id, user_id, order_number, subtotal, tax, shipping, discount, total, status, payment_status, payment_method, payment_id, shipping_address, billing_address, notes, created_at, updated_at 
         FROM orders WHERE id = $1`,
        [id]
      );

      if (orderResult.rows.length === 0) {
        return null;
      }

      const order = orderResult.rows[0];

      // Get order items with product names
      const itemsResult = await pool.query(
        `SELECT oi.id, oi.product_id, oi.variant_id, oi.quantity, oi.price, oi.product_name, oi.variant_name
         FROM order_items oi
         WHERE oi.order_id = $1`,
        [order.id]
      );

      // Get tracking information
      const trackingResult = await pool.query(
        `SELECT id, order_id, status, location, description, estimated_delivery, actual_delivery, created_at
         FROM order_tracking WHERE order_id = $1 ORDER BY created_at DESC`,
        [order.id]
      );

      return {
        ...order,
        items: itemsResult.rows,
        tracking: trackingResult.rows
      };
    });
  }

  async findByUserId(userId: number, limit = 100, offset = 0): Promise<OrderResponse[]> {
    return executeWithRetry(async () => {
      const orderResult = await pool.query(
        `SELECT id, user_id, order_number, subtotal, tax, shipping, discount, total, status, payment_status, shipping_address, billing_address, notes, created_at, updated_at 
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
          `SELECT oi.id, oi.product_id, oi.variant_id, oi.quantity, oi.price, oi.product_name, oi.variant_name
           FROM order_items oi
           WHERE oi.order_id = $1`,
          [order.id]
        );

        const trackingResult = await pool.query(
          `SELECT id, order_id, status, location, description, estimated_delivery, actual_delivery, created_at
           FROM order_tracking WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
          [order.id]
        );

        ordersWithItems.push({
          ...order,
          items: itemsResult.rows,
          tracking: trackingResult.rows
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
         RETURNING id, user_id, order_number, subtotal, tax, shipping, discount, total, status, payment_status, shipping_address, billing_address, notes, created_at, updated_at`,
        [status, id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      // Add tracking entry
      await orderTrackingService.create({
        order_id: id,
        status: status.charAt(0).toUpperCase() + status.slice(1),
        description: `Order status updated to ${status}`
      });

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

        // Add tracking entry
        await orderTrackingService.create({
          order_id: id,
          status: 'Cancelled',
          description: 'Order has been cancelled by customer'
        });

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
        `SELECT id, user_id, order_number, subtotal, tax, shipping, discount, total, status, payment_status, shipping_address, billing_address, notes, created_at, updated_at 
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
          `SELECT oi.id, oi.product_id, oi.variant_id, oi.quantity, oi.price, oi.product_name, oi.variant_name
           FROM order_items oi
           WHERE oi.order_id = $1`,
          [order.id]
        );

        const trackingResult = await pool.query(
          `SELECT id, order_id, status, location, description, estimated_delivery, actual_delivery, created_at
           FROM order_tracking WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
          [order.id]
        );

        ordersWithItems.push({
          ...order,
          items: itemsResult.rows,
          tracking: trackingResult.rows
        });
      }

      return ordersWithItems;
    });
  }
}

export const orderService = new OrderService();