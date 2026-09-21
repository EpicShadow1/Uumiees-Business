import { pool, executeWithRetry } from '../config/database';
import { ProductImage, CreateProductImage, UpdateProductImage } from '../models';

class ProductImageService {
  async create(imageData: CreateProductImage): Promise<ProductImage> {
    const { product_id, image_url, alt_text, is_primary, sort_order } = imageData;

    return executeWithRetry(async () => {
      // If this is set as primary, remove primary from other images
      if (is_primary) {
        await pool.query(
          `UPDATE product_images SET is_primary = false WHERE product_id = $1`,
          [product_id]
        );
      }

      const result = await pool.query(
        `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING id, product_id, image_url, alt_text, is_primary, sort_order, created_at`,
        [product_id, image_url, alt_text, is_primary ?? false, sort_order ?? 0]
      );

      return result.rows[0];
    });
  }

  async findById(id: number): Promise<ProductImage | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, product_id, image_url, alt_text, is_primary, sort_order, created_at 
         FROM product_images WHERE id = $1`,
        [id]
      );

      return result.rows[0] || null;
    });
  }

  async findByProductId(productId: number): Promise<ProductImage[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, product_id, image_url, alt_text, is_primary, sort_order, created_at 
         FROM product_images WHERE product_id = $1 ORDER BY sort_order, is_primary DESC`,
        [productId]
      );

      return result.rows;
    });
  }

  async getPrimaryImage(productId: number): Promise<ProductImage | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, product_id, image_url, alt_text, is_primary, sort_order, created_at 
         FROM product_images WHERE product_id = $1 AND is_primary = true LIMIT 1`,
        [productId]
      );

      if (result.rows.length === 0) {
        // Fallback to first image
        const fallbackResult = await pool.query(
          `SELECT id, product_id, image_url, alt_text, is_primary, sort_order, created_at 
           FROM product_images WHERE product_id = $1 ORDER BY sort_order LIMIT 1`,
          [productId]
        );
        return fallbackResult.rows[0] || null;
      }

      return result.rows[0];
    });
  }

  async update(id: number, imageData: UpdateProductImage): Promise<ProductImage | null> {
    const { image_url, alt_text, is_primary, sort_order } = imageData;

    return executeWithRetry(async () => {
      const updates: string[] = [];
      const values: (string | number | boolean | null)[] = [];
      let paramCount = 1;

      if (image_url !== undefined) {
        updates.push(`image_url = $${paramCount}`);
        values.push(image_url);
        paramCount++;
      }

      if (alt_text !== undefined) {
        updates.push(`alt_text = $${paramCount}`);
        values.push(alt_text);
        paramCount++;
      }

      if (is_primary !== undefined) {
        updates.push(`is_primary = $${paramCount}`);
        values.push(is_primary);
        paramCount++;
      }

      if (sort_order !== undefined) {
        updates.push(`sort_order = $${paramCount}`);
        values.push(sort_order);
        paramCount++;
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id);

      const query = `
        UPDATE product_images
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, product_id, image_url, alt_text, is_primary, sort_order, created_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    });
  }

  async delete(id: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `DELETE FROM product_images WHERE id = $1`,
        [id]
      );

      return (result.rowCount ?? 0) > 0;
    });
  }

  async deleteByProductId(productId: number): Promise<void> {
    return executeWithRetry(async () => {
      await pool.query(
        `DELETE FROM product_images WHERE product_id = $1`,
        [productId]
      );
    });
  }
}

export const productImageService = new ProductImageService();