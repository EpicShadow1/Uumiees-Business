import { pool, executeWithRetry } from '../config/database';
import { withLock } from '../utils/distributedLock';
import { CreateProduct, UpdateProduct, ProductResponse } from '../models';

class ProductService {
  async create(productData: CreateProduct): Promise<ProductResponse> {
    const { name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description } = productData;

    return executeWithRetry(async () => {
      const result = await pool.query(
        `INSERT INTO products (name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
         RETURNING id, name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description, created_at, updated_at`,
        [name, description, price, compare_price, stock, sku, is_active ?? true, is_featured ?? false, weight, dimensions, meta_title, meta_description]
      );

      return result.rows[0];
    });
  }

  async findById(id: number): Promise<ProductResponse | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description, created_at, updated_at 
         FROM products WHERE id = $1`,
        [id]
      );

      return result.rows[0] || null;
    });
  }

  async update(id: number, productData: UpdateProduct): Promise<ProductResponse | null> {
    const { name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description } = productData;

    return executeWithRetry(async () => {
      const updates: string[] = [];
      const values: (string | number | boolean | null)[] = [];
      let paramCount = 1;

      if (name) {
        updates.push(`name = $${paramCount}`);
        values.push(name);
        paramCount++;
      }

      if (description !== undefined) {
        updates.push(`description = $${paramCount}`);
        values.push(description);
        paramCount++;
      }

      if (price !== undefined) {
        updates.push(`price = $${paramCount}`);
        values.push(price);
        paramCount++;
      }

      if (compare_price !== undefined) {
        updates.push(`compare_price = $${paramCount}`);
        values.push(compare_price);
        paramCount++;
      }

      if (stock !== undefined) {
        updates.push(`stock = $${paramCount}`);
        values.push(stock);
        paramCount++;
      }

      if (sku !== undefined) {
        updates.push(`sku = $${paramCount}`);
        values.push(sku);
        paramCount++;
      }

      if (is_active !== undefined) {
        updates.push(`is_active = $${paramCount}`);
        values.push(is_active);
        paramCount++;
      }

      if (is_featured !== undefined) {
        updates.push(`is_featured = $${paramCount}`);
        values.push(is_featured);
        paramCount++;
      }

      if (weight !== undefined) {
        updates.push(`weight = $${paramCount}`);
        values.push(weight);
        paramCount++;
      }

      if (dimensions !== undefined) {
        updates.push(`dimensions = $${paramCount}`);
        values.push(dimensions);
        paramCount++;
      }

      if (meta_title !== undefined) {
        updates.push(`meta_title = $${paramCount}`);
        values.push(meta_title);
        paramCount++;
      }

      if (meta_description !== undefined) {
        updates.push(`meta_description = $${paramCount}`);
        values.push(meta_description);
        paramCount++;
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      updates.push(`updated_at = NOW()`);

      const query = `
        UPDATE products
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description, created_at, updated_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    });
  }

  async delete(id: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `DELETE FROM products WHERE id = $1`,
        [id]
      );

      return (result.rowCount ?? 0) > 0;
    });
  }

  async getAll(limit = 100, offset = 0, activeOnly = false): Promise<ProductResponse[]> {
    return executeWithRetry(async () => {
      const query = activeOnly
        ? `SELECT id, name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description, created_at, updated_at 
           FROM products WHERE is_active = true
           ORDER BY created_at DESC 
           LIMIT $1 OFFSET $2`
        : `SELECT id, name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description, created_at, updated_at 
           FROM products 
           ORDER BY created_at DESC 
           LIMIT $1 OFFSET $2`;

      const result = await pool.query(query, [limit, offset]);
      return result.rows;
    });
  }

  async getFeatured(limit = 10): Promise<ProductResponse[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description, created_at, updated_at 
         FROM products WHERE is_featured = true AND is_active = true
         ORDER BY created_at DESC 
         LIMIT $1`,
        [limit]
      );

      return result.rows;
    });
  }

  async search(query: string, limit = 20): Promise<ProductResponse[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description, created_at, updated_at 
         FROM products 
         WHERE (name ILIKE $1 OR description ILIKE $1) AND is_active = true
         ORDER BY created_at DESC 
         LIMIT $2`,
        [`%${query}%`, limit]
      );

      return result.rows;
    });
  }

  async updateStock(id: number, quantity: number): Promise<ProductResponse> {
    return withLock(`product:${id}`, async () => {
      return executeWithRetry(async () => {
        const result = await pool.query(
          `UPDATE products 
           SET stock = stock - $1, updated_at = NOW()
           WHERE id = $2 AND stock >= $1
           RETURNING id, name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description, created_at, updated_at`,
          [quantity, id]
        );

        if (result.rows.length === 0) {
          throw new Error('Insufficient stock');
        }

        return result.rows[0];
      });
    });
  }

  async checkStock(id: number, quantity: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT stock FROM products WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return false;
      }

      return result.rows[0].stock >= quantity;
    });
  }

  async decreaseStock(id: number, quantity: number): Promise<ProductResponse | null> {
    return this.updateStock(id, quantity);
  }

  async increaseStock(id: number, quantity: number): Promise<ProductResponse | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `UPDATE products 
         SET stock = stock + $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, name, description, price, compare_price, stock, sku, is_active, is_featured, weight, dimensions, meta_title, meta_description, created_at, updated_at`,
        [quantity, id]
      );

      return result.rows[0] || null;
    });
  }
}

export const productService = new ProductService();