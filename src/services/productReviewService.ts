import { pool, executeWithRetry } from '../config/database';
import { ProductReview, CreateProductReview, UpdateProductReview } from '../models';

class ProductReviewService {
  async create(reviewData: CreateProductReview, userId: number): Promise<ProductReview> {
    const { product_id, rating, title, comment } = reviewData;

    return executeWithRetry(async () => {
      // Check if user has purchased this product
      const purchaseCheck = await pool.query(
        `SELECT COUNT(*) as count FROM order_items oi
         INNER JOIN orders o ON oi.order_id = o.id
         WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status IN ('delivered', 'shipped')`,
        [userId, product_id]
      );

      const isVerifiedPurchase = (purchaseCheck.rows[0]?.count || 0) > 0;

      const result = await pool.query(
        `INSERT INTO product_reviews (product_id, user_id, rating, title, comment, is_verified_purchase, is_approved, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, false, NOW(), NOW())
         RETURNING id, product_id, user_id, rating, title, comment, is_verified_purchase, is_approved, helpful_count, created_at, updated_at`,
        [product_id, userId, rating, title, comment, isVerifiedPurchase]
      );

      return result.rows[0];
    });
  }

  async findById(id: number): Promise<ProductReview | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT pr.id, pr.product_id, pr.user_id, pr.rating, pr.title, pr.comment, pr.is_verified_purchase, pr.is_approved, pr.helpful_count, pr.created_at, pr.updated_at,
         u.name as user_name
         FROM product_reviews pr
         LEFT JOIN users u ON pr.user_id = u.id
         WHERE pr.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const review = result.rows[0];
      return {
        ...review,
        user: {
          id: review.user_id,
          name: review.user_name
        }
      };
    });
  }

  async findByProductId(productId: number, approvedOnly = true, limit = 10, offset = 0): Promise<ProductReview[]> {
    return executeWithRetry(async () => {
      const query = approvedOnly
        ? `SELECT pr.id, pr.product_id, pr.user_id, pr.rating, pr.title, pr.comment, pr.is_verified_purchase, pr.is_approved, pr.helpful_count, pr.created_at, pr.updated_at,
           u.name as user_name
           FROM product_reviews pr
           LEFT JOIN users u ON pr.user_id = u.id
           WHERE pr.product_id = $1 AND pr.is_approved = true
           ORDER BY pr.created_at DESC
           LIMIT $2 OFFSET $3`
        : `SELECT pr.id, pr.product_id, pr.user_id, pr.rating, pr.title, pr.comment, pr.is_verified_purchase, pr.is_approved, pr.helpful_count, pr.created_at, pr.updated_at,
           u.name as user_name
           FROM product_reviews pr
           LEFT JOIN users u ON pr.user_id = u.id
           WHERE pr.product_id = $1
           ORDER BY pr.created_at DESC
           LIMIT $2 OFFSET $3`;

      const result = await pool.query(query, [productId, limit, offset]);

      return result.rows.map((review: any) => ({
        ...review,
        user: {
          id: review.user_id,
          name: review.user_name
        }
      }));
    });
  }

  async update(id: number, reviewData: UpdateProductReview): Promise<ProductReview | null> {
    const { rating, title, comment, is_approved } = reviewData;

    return executeWithRetry(async () => {
      const updates: string[] = [];
      const values: (string | number | boolean | null)[] = [];
      let paramCount = 1;

      if (rating !== undefined) {
        updates.push(`rating = $${paramCount}`);
        values.push(rating);
        paramCount++;
      }

      if (title !== undefined) {
        updates.push(`title = $${paramCount}`);
        values.push(title);
        paramCount++;
      }

      if (comment !== undefined) {
        updates.push(`comment = $${paramCount}`);
        values.push(comment);
        paramCount++;
      }

      if (is_approved !== undefined) {
        updates.push(`is_approved = $${paramCount}`);
        values.push(is_approved);
        paramCount++;
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      updates.push(`updated_at = NOW()`);

      const query = `
        UPDATE product_reviews
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, product_id, user_id, rating, title, comment, is_verified_purchase, is_approved, helpful_count, created_at, updated_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    });
  }

  async markHelpful(id: number): Promise<ProductReview | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `UPDATE product_reviews 
         SET helpful_count = helpful_count + 1
         WHERE id = $1
         RETURNING id, product_id, user_id, rating, title, comment, is_verified_purchase, is_approved, helpful_count, created_at, updated_at`,
        [id]
      );

      return result.rows[0] || null;
    });
  }

  async delete(id: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `DELETE FROM product_reviews WHERE id = $1`,
        [id]
      );

      return (result.rowCount ?? 0) > 0;
    });
  }

  async getAverageRating(productId: number): Promise<number> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT AVG(rating) as average_rating, COUNT(*) as review_count
         FROM product_reviews
         WHERE product_id = $1 AND is_approved = true`,
        [productId]
      );

      return result.rows[0]?.average_rating || 0;
    });
  }
}

export const productReviewService = new ProductReviewService();