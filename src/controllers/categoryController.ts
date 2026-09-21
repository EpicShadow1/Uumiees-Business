import { Request, Response } from 'express';
import { categoryService } from '../services';
import { getQueryParam, getPathParam } from '../utils/helpers';

class CategoryController {
  async createCategory(req: Request, res: Response) {
    try {
      const category = await categoryService.create(req.body);
      res.status(201).json({
        message: 'Category created successfully',
        category
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  }

  async getCategory(req: Request, res: Response) {
    try {
      const categoryId = parseInt(getPathParam(req.params.id), 10);
      const category = await categoryService.findById(categoryId);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  }

  async getCategoryBySlug(req: Request, res: Response) {
    try {
      const slug = getPathParam(req.params.slug);
      const category = await categoryService.findBySlug(slug);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      console.error('Get category by slug error:', error);
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const activeOnly = req.query.active === 'true';
      const categories = await categoryService.getAll(activeOnly);
      res.json(categories);
    } catch (error) {
      console.error('Get all categories error:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  async getCategoryTree(req: Request, res: Response) {
    try {
      const categories = await categoryService.getTree();
      res.json(categories);
    } catch (error) {
      console.error('Get category tree error:', error);
      res.status(500).json({ error: 'Failed to fetch category tree' });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const categoryId = parseInt(getPathParam(req.params.id), 10);
      const category = await categoryService.update(categoryId, req.body);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({
        message: 'Category updated successfully',
        category
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const categoryId = parseInt(getPathParam(req.params.id), 10);
      const success = await categoryService.delete(categoryId);

      if (!success) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }

  async assignProductToCategory(req: Request, res: Response) {
    try {
      const { productId, categoryId } = req.body;
      await categoryService.assignProductToCategory(productId, categoryId);
      res.json({ message: 'Product assigned to category successfully' });
    } catch (error) {
      console.error('Assign product to category error:', error);
      res.status(500).json({ error: 'Failed to assign product to category' });
    }
  }

  async removeProductFromCategory(req: Request, res: Response) {
    try {
      const { productId, categoryId } = req.body;
      await categoryService.removeProductFromCategory(productId, categoryId);
      res.json({ message: 'Product removed from category successfully' });
    } catch (error) {
      console.error('Remove product from category error:', error);
      res.status(500).json({ error: 'Failed to remove product from category' });
    }
  }

  async getProductCategories(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.productId), 10);
      const categories = await categoryService.getProductCategories(productId);
      res.json(categories);
    } catch (error) {
      console.error('Get product categories error:', error);
      res.status(500).json({ error: 'Failed to fetch product categories' });
    }
  }
}

export const categoryController = new CategoryController();