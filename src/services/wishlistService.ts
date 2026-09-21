import { pool, executeWithRetry } from '../config/database';
import { Wishlist, CreateWishlist } from '../models';

class WishlistService {
  async addToWishlist(wishlistData: CreateWishlist): Promise<Wishlist> {
    const { user_id, product_id, variant_id } = wishlistData;

    return executeWithRetry(async () => {
      const result = await pool.query(
        `INSERT INTO wishlist (user_id, product_id, variant_id, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, product_id, variant_id) DO NOTHING
         RETURNING id, user_id, product_id, variant_id, created_at`,
        [user_id, product_id, variant_id]
      );

      if (result.rows.length === 0) {
        // Item already exists, fetch it
        const existing = await pool.query(
          `SELECT id, user_id, product_id, variant_id, created_at FROM wishlist WHERE user_id = $1 AND product_id = $2 AND (variant_id = $3 OR (variant_id IS NULL AND $3 IS NULL))`,
          [user_id, product_id, variant_id]
        );
        return existing.rows[0];
      }

      return result.rows[0];
    });
  }

  async removeFromWishlist(userId: number, productId: number, variantId?: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const query = variantId
        ? `DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2 AND variant_id = $3`
        : `DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2 AND variant_id IS NULL`;

      const result = await pool.query(query, [userId, productId, variantId]);
      return (result.rowCount ?? 0) > 0;
    });
  }

  async getUserWishlist(userId: number): Promise<Wishlist[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT w.id, w.user_id, w.product_id, w.variant_id, w.created_at,
         p.name as product_name, p.price as product_price,
         (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url,
         v.name as variant_name, v.price as variant_price
         FROM wishlist w
         LEFT JOIN products p ON w.product_id = p.id
         LEFT JOIN product_variants v ON w.variant_id = v.id
         WHERE w.user_id = $1
         ORDER BY w.created_at DESC`,
        [userId]
      );

      return result.rows.map((item: { id: number; user_id: number; product_id: number; variant_id: number | null; created_at: Date; product_name: string; product_price: number; image_url: string | null; variant_name: string | null; variant_price: number | null }) => ({
        id: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        created_at: item.created_at,
        product: {
          id: item.product_id,
          name: item.product_name,
          price: item.variant_price || item.product_price,
          image_url: item.image_url || null
        },
        variant: item.variant_id ? {
          id: item.variant_id,
          name: item.variant_name || '',
          price: item.variant_price || 0
        } : null
      }));
    });
  }

  async isInWishlist(userId: number, productId: number, variantId?: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const query = variantId
        ? `SELECT COUNT(*) as count FROM wishlist WHERE user_id = $1 AND product_id = $2 AND variant_id = $3`
        : `SELECT COUNT(*) as count FROM wishlist WHERE user_id = $1 AND product_id = $2 AND variant_id IS NULL`;

      const result = await pool.query(query, [userId, productId, variantId]);
      return (result.rows[0]?.count || 0) > 0;
    });
  }

  async clearWishlist(userId: number): Promise<void> {
    return executeWithRetry(async () => {
      await pool.query(
        `DELETE FROM wishlist WHERE user_id = $1`,
        [userId]
      );
    });
  }
}

export const wishlistService = new WishlistService();