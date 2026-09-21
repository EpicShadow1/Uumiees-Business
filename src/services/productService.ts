import { pool, executeWithRetry } from '../config/database';
import { withLock } from '../utils/distributedLock';
import { CreateProduct, UpdateProduct, ProductResponse } from '../models';

class ProductService {
  async create(productData: CreateProduct): Promise<ProductResponse> {
    const { name, description, price, stock } = productData;

    return executeWithRetry(async () => {
      const result = await pool.query(
        `INSERT INTO products (name, description, price, stock, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id, name, description, price, stock, created_at, updated_at`,
        [name, description, price, stock]
      );

      return result.rows[0];
    });
  }

  async findById(id: number): Promise<ProductResponse | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, name, description, price, stock, created_at, updated_at 
         FROM products WHERE id = $1`,
        [id]
      );

      return result.rows[0] || null;
    });
  }

  async update(id: number, productData: UpdateProduct): Promise<ProductResponse | null> {
    const { name, description, price, stock } = productData;

    return executeWithRetry(async () => {
      // Build dynamic update query
      const updates: string[] = [];
      const values: (string | number)[] = [];
      let paramCount = 1;

      if (name) {
        updates.push(`name = $${paramCount}`);
        values.push(name);
        paramCount++;
      }

      if (description) {
        updates.push(`description = $${paramCount}`);
        values.push(description);
        paramCount++;
      }

      if (price !== undefined) {
        updates.push(`price = $${paramCount}`);
        values.push(price);
        paramCount++;
      }

      if (stock !== undefined) {
        updates.push(`stock = $${paramCount}`);
        values.push(stock);
        paramCount++;
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id); // Add id for WHERE clause
      updates.push(`updated_at = NOW()`);

      const query = `
        UPDATE products
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, name, description, price, stock, created_at, updated_at
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

  async getAll(limit = 100, offset = 0): Promise<ProductResponse[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, name, description, price, stock, created_at, updated_at 
         FROM products 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      return result.rows;
    });
  }

  async updateStock(id: number, quantity: number): Promise<ProductResponse> {
    // Use distributed lock to prevent race conditions on inventory
    return withLock(`product:${id}`, async () => {
      return executeWithRetry(async () => {
        const result = await pool.query(
          `UPDATE products 
           SET stock = stock - $1, updated_at = NOW()
           WHERE id = $2 AND stock >= $1
           RETURNING id, name, description, price, stock, created_at, updated_at`,
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
         RETURNING id, name, description, price, stock, created_at, updated_at`,
        [quantity, id]
      );

      return result.rows[0] || null;
    });
  }
}

export const productService = new ProductService();