import { pool, executeWithRetry } from '../config/database';
import { ProductVariant, CreateProductVariant, UpdateProductVariant } from '../models';

class ProductVariantService {
  async create(variantData: CreateProductVariant): Promise<ProductVariant> {
    const { product_id, sku, name, price, compare_price, stock, is_active, options } = variantData;

    return executeWithRetry(async () => {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        const result = await client.query(
          `INSERT INTO product_variants (product_id, sku, name, price, compare_price, stock, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
           RETURNING id, product_id, sku, name, price, compare_price, stock, is_active, created_at, updated_at`,
          [product_id, sku, name, price, compare_price, stock, is_active ?? true]
        );

        const variant = result.rows[0];

        // Add variant options if provided
        if (options && options.length > 0) {
          for (const option of options) {
            await client.query(
              `INSERT INTO variant_options (variant_id, option_name, option_value, created_at)
               VALUES ($1, $2, $3, NOW())`,
              [variant.id, option.option_name, option.option_value]
            );
          }
        }

        await client.query('COMMIT');

        // Fetch variant with options
        return this.findById(variant.id) as Promise<ProductVariant>;

      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    });
  }

  async findById(id: number): Promise<ProductVariant | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, product_id, sku, name, price, compare_price, stock, is_active, created_at, updated_at 
         FROM product_variants WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const variant = result.rows[0];

      // Get variant options
      const optionsResult = await pool.query(
        `SELECT id, variant_id, option_name, option_value, created_at 
         FROM variant_options WHERE variant_id = $1`,
        [id]
      );

      return {
        ...variant,
        options: optionsResult.rows
      };
    });
  }

  async findByProductId(productId: number): Promise<ProductVariant[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, product_id, sku, name, price, compare_price, stock, is_active, created_at, updated_at 
         FROM product_variants WHERE product_id = $1 AND is_active = true ORDER BY created_at`,
        [productId]
      );

      const variants = result.rows;

      // Get options for each variant
      const variantsWithOptions = await Promise.all(
        variants.map(async (variant: ProductVariant) => {
          const optionsResult = await pool.query(
            `SELECT id, variant_id, option_name, option_value, created_at 
             FROM variant_options WHERE variant_id = $1`,
            [variant.id]
          );

          return {
            ...variant,
            options: optionsResult.rows
          };
        })
      );

      return variantsWithOptions;
    });
  }

  async update(id: number, variantData: UpdateProductVariant): Promise<ProductVariant | null> {
    const { sku, name, price, compare_price, stock, is_active } = variantData;

    return executeWithRetry(async () => {
      const updates: string[] = [];
      const values: (string | number | boolean | null)[] = [];
      let paramCount = 1;

      if (sku !== undefined) {
        updates.push(`sku = $${paramCount}`);
        values.push(sku);
        paramCount++;
      }

      if (name !== undefined) {
        updates.push(`name = $${paramCount}`);
        values.push(name);
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
        UPDATE product_variants
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, product_id, sku, name, price, compare_price, stock, is_active, created_at, updated_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    });
  }

  async delete(id: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `DELETE FROM product_variants WHERE id = $1`,
        [id]
      );

      return (result.rowCount ?? 0) > 0;
    });
  }

  async updateStock(id: number, quantity: number): Promise<ProductVariant | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `UPDATE product_variants 
         SET stock = stock - $1, updated_at = NOW()
         WHERE id = $2 AND stock >= $1
         RETURNING id, product_id, sku, name, price, compare_price, stock, is_active, created_at, updated_at`,
        [quantity, id]
      );

      if (result.rows.length === 0) {
        throw new Error('Insufficient stock');
      }

      return result.rows[0];
    });
  }
}

export const productVariantService = new ProductVariantService();