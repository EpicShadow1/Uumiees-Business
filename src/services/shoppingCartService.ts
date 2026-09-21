import { pool, executeWithRetry } from '../config/database';
import { ShoppingCart, CartItem, CreateCartItem, UpdateCartItem } from '../models';

class ShoppingCartService {
  async getOrCreateCart(userId?: number, sessionId?: string): Promise<ShoppingCart> {
    return executeWithRetry(async () => {
      let cart: ShoppingCart;

      if (userId) {
        // Try to find cart by user ID
        const userCartResult = await pool.query(
          `SELECT id, user_id, session_id, created_at, updated_at 
           FROM shopping_cart WHERE user_id = $1`,
          [userId]
        );

        if (userCartResult.rows.length > 0) {
          cart = userCartResult.rows[0];
        } else {
          // Create new cart for user
          const newCartResult = await pool.query(
            `INSERT INTO shopping_cart (user_id, session_id, created_at, updated_at)
             VALUES ($1, $2, NOW(), NOW())
             RETURNING id, user_id, session_id, created_at, updated_at`,
            [userId, sessionId || null]
          );
          cart = newCartResult.rows[0];
        }
      } else if (sessionId) {
        // Try to find cart by session ID
        const sessionCartResult = await pool.query(
          `SELECT id, user_id, session_id, created_at, updated_at 
           FROM shopping_cart WHERE session_id = $1`,
          [sessionId]
        );

        if (sessionCartResult.rows.length > 0) {
          cart = sessionCartResult.rows[0];
        } else {
          // Create new cart for session
          const newCartResult = await pool.query(
            `INSERT INTO shopping_cart (user_id, session_id, created_at, updated_at)
             VALUES ($1, $2, NOW(), NOW())
             RETURNING id, user_id, session_id, created_at, updated_at`,
            [null, sessionId]
          );
          cart = newCartResult.rows[0];
        }
      } else {
        throw new Error('Either userId or sessionId must be provided');
      }

      // Get cart items
      const itemsResult = await pool.query(
        `SELECT ci.id, ci.cart_id, ci.product_id, ci.variant_id, ci.quantity, ci.price, ci.created_at, ci.updated_at,
         p.name as product_name, 
         (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url,
         v.name as variant_name, v.sku as variant_sku
         FROM cart_items ci
         LEFT JOIN products p ON ci.product_id = p.id
         LEFT JOIN product_variants v ON ci.variant_id = v.id
         WHERE ci.cart_id = $1`,
        [cart.id]
      );

      return {
        ...cart,
        items: itemsResult.rows.map((item: { id: number; cart_id: number; product_id: number; variant_id: number | null; quantity: number; price: number; created_at: Date; updated_at: Date; product_name: string; image_url: string | null; variant_name: string | null; variant_sku: string | null }) => ({
          id: item.id,
          cart_id: item.cart_id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price,
          created_at: item.created_at,
          updated_at: item.updated_at,
          product: {
            id: item.product_id,
            name: item.product_name,
            image_url: item.image_url || null
          },
          variant: item.variant_id ? {
            id: item.variant_id,
            name: item.variant_name || '',
            sku: item.variant_sku || ''
          } : null
        }))
      };
    });
  }

  async addItem(cartId: number, itemData: CreateCartItem): Promise<CartItem> {
    return executeWithRetry(async () => {
      const { product_id, variant_id, quantity, price } = itemData;

      // Check if item already exists in cart
      const existingItemResult = await pool.query(
        `SELECT id, quantity FROM cart_items 
         WHERE cart_id = $1 AND product_id = $2 AND (variant_id = $3 OR (variant_id IS NULL AND $3 IS NULL))`,
        [cartId, product_id, variant_id]
      );

      if (existingItemResult.rows.length > 0) {
        // Update quantity
        const updatedItemResult = await pool.query(
          `UPDATE cart_items 
           SET quantity = quantity + $1, price = $2, updated_at = NOW()
           WHERE id = $3
           RETURNING id, cart_id, product_id, variant_id, quantity, price, created_at, updated_at`,
          [quantity, price, existingItemResult.rows[0].id]
        );
        return updatedItemResult.rows[0];
      } else {
        // Add new item
        const newItemResult = await pool.query(
          `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, price, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
           RETURNING id, cart_id, product_id, variant_id, quantity, price, created_at, updated_at`,
          [cartId, product_id, variant_id, quantity, price]
        );
        return newItemResult.rows[0];
      }
    });
  }

  async updateItem(itemId: number, itemData: UpdateCartItem): Promise<CartItem | null> {
    return executeWithRetry(async () => {
      const { quantity, price } = itemData;

      const updates: string[] = [];
      const values: (number)[] = [];
      let paramCount = 1;

      if (quantity !== undefined) {
        updates.push(`quantity = $${paramCount}`);
        values.push(quantity);
        paramCount++;
      }

      if (price !== undefined) {
        updates.push(`price = $${paramCount}`);
        values.push(price);
        paramCount++;
      }

      if (updates.length === 0) {
        const result = await pool.query(
          `SELECT id, cart_id, product_id, variant_id, quantity, price, created_at, updated_at 
           FROM cart_items WHERE id = $1`,
          [itemId]
        );
        return result.rows[0] || null;
      }

      values.push(itemId);
      updates.push(`updated_at = NOW()`);

      const query = `
        UPDATE cart_items
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, cart_id, product_id, variant_id, quantity, price, created_at, updated_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    });
  }

  async removeItem(itemId: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `DELETE FROM cart_items WHERE id = $1`,
        [itemId]
      );

      return (result.rowCount ?? 0) > 0;
    });
  }

  async clearCart(cartId: number): Promise<void> {
    return executeWithRetry(async () => {
      await pool.query(
        `DELETE FROM cart_items WHERE cart_id = $1`,
        [cartId]
      );
    });
  }

  async mergeCarts(sourceCartId: number, targetCartId: number): Promise<void> {
    return executeWithRetry(async () => {
      // Get items from source cart
      const sourceItemsResult = await pool.query(
        `SELECT product_id, variant_id, quantity, price FROM cart_items WHERE cart_id = $1`,
        [sourceCartId]
      );

      // Add each item to target cart
      for (const item of sourceItemsResult.rows) {
        await this.addItem(targetCartId, {
          cart_id: targetCartId,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price
        });
      }

      // Clear source cart
      await this.clearCart(sourceCartId);
    });
  }

  async getCartTotal(cartId: number): Promise<number> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT SUM(quantity * price) as total FROM cart_items WHERE cart_id = $1`,
        [cartId]
      );

      return result.rows[0]?.total || 0;
    });
  }

  async getCartItemCount(cartId: number): Promise<number> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT SUM(quantity) as count FROM cart_items WHERE cart_id = $1`,
        [cartId]
      );

      return result.rows[0]?.count || 0;
    });
  }
}

export const shoppingCartService = new ShoppingCartService();