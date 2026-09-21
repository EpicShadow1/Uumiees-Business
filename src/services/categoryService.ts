import { pool, executeWithRetry } from '../config/database';
import { Category, CreateCategory, UpdateCategory, CategoryResponse } from '../models';

class CategoryService {
  async create(categoryData: CreateCategory): Promise<CategoryResponse> {
    const { name, description, slug, parent_id, image_url, is_active, sort_order } = categoryData;

    return executeWithRetry(async () => {
      const result = await pool.query(
        `INSERT INTO categories (name, description, slug, parent_id, image_url, is_active, sort_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING id, name, description, slug, parent_id, image_url, is_active, sort_order, created_at, updated_at`,
        [name, description, slug, parent_id, image_url, is_active ?? true, sort_order ?? 0]
      );

      return result.rows[0];
    });
  }

  async findById(id: number): Promise<CategoryResponse | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, name, description, slug, parent_id, image_url, is_active, sort_order, created_at, updated_at 
         FROM categories WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const category = result.rows[0];

      // Get children categories
      const childrenResult = await pool.query(
        `SELECT id, name, description, slug, parent_id, image_url, is_active, sort_order, created_at, updated_at 
         FROM categories WHERE parent_id = $1 ORDER BY sort_order`,
        [id]
      );

      return {
        ...category,
        children: childrenResult.rows
      };
    });
  }

  async findBySlug(slug: string): Promise<CategoryResponse | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, name, description, slug, parent_id, image_url, is_active, sort_order, created_at, updated_at 
         FROM categories WHERE slug = $1`,
        [slug]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    });
  }

  async getAll(activeOnly = false): Promise<CategoryResponse[]> {
    return executeWithRetry(async () => {
      const query = activeOnly
        ? `SELECT id, name, description, slug, parent_id, image_url, is_active, sort_order, created_at, updated_at 
           FROM categories WHERE is_active = true ORDER BY sort_order`
        : `SELECT id, name, description, slug, parent_id, image_url, is_active, sort_order, created_at, updated_at 
           FROM categories ORDER BY sort_order`;

      const result = await pool.query(query);
      return result.rows;
    });
  }

  async getTree(): Promise<CategoryResponse[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, name, description, slug, parent_id, image_url, is_active, sort_order, created_at, updated_at 
         FROM categories WHERE is_active = true ORDER BY sort_order`
      );

      const categories = result.rows;
      const categoryMap = new Map<number, CategoryResponse>();
      const rootCategories: CategoryResponse[] = [];

      // First pass: create map
      categories.forEach((category: CategoryResponse) => {
        categoryMap.set(category.id, { ...category, children: [] });
      });

      // Second pass: build tree
      categories.forEach((category: CategoryResponse) => {
        const categoryWithChildren = categoryMap.get(category.id);
        if (category.parent_id) {
          const parent = categoryMap.get(category.parent_id);
          if (parent && categoryWithChildren) {
            parent.children?.push(categoryWithChildren);
          }
        } else if (categoryWithChildren) {
          rootCategories.push(categoryWithChildren);
        }
      });

      return rootCategories;
    });
  }

  async update(id: number, categoryData: UpdateCategory): Promise<CategoryResponse | null> {
    const { name, description, slug, parent_id, image_url, is_active, sort_order } = categoryData;

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

      if (slug) {
        updates.push(`slug = $${paramCount}`);
        values.push(slug);
        paramCount++;
      }

      if (parent_id !== undefined) {
        updates.push(`parent_id = $${paramCount}`);
        values.push(parent_id);
        paramCount++;
      }

      if (image_url !== undefined) {
        updates.push(`image_url = $${paramCount}`);
        values.push(image_url);
        paramCount++;
      }

      if (is_active !== undefined) {
        updates.push(`is_active = $${paramCount}`);
        values.push(is_active);
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
      updates.push(`updated_at = NOW()`);

      const query = `
        UPDATE categories
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, name, description, slug, parent_id, image_url, is_active, sort_order, created_at, updated_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    });
  }

  async delete(id: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `DELETE FROM categories WHERE id = $1`,
        [id]
      );

      return (result.rowCount ?? 0) > 0;
    });
  }

  async assignProductToCategory(productId: number, categoryId: number): Promise<void> {
    return executeWithRetry(async () => {
      await pool.query(
        `INSERT INTO product_categories (product_id, category_id, created_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (product_id, category_id) DO NOTHING`,
        [productId, categoryId]
      );
    });
  }

  async removeProductFromCategory(productId: number, categoryId: number): Promise<void> {
    return executeWithRetry(async () => {
      await pool.query(
        `DELETE FROM product_categories WHERE product_id = $1 AND category_id = $2`,
        [productId, categoryId]
      );
    });
  }

  async getProductCategories(productId: number): Promise<CategoryResponse[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT c.id, c.name, c.description, c.slug, c.parent_id, c.image_url, c.is_active, c.sort_order, c.created_at, c.updated_at
         FROM categories c
         INNER JOIN product_categories pc ON c.id = pc.category_id
         WHERE pc.product_id = $1 AND c.is_active = true
         ORDER BY c.sort_order`,
        [productId]
      );

      return result.rows;
    });
  }
}

export const categoryService = new CategoryService();