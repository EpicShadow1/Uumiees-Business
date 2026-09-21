import { Request, Response } from 'express';
import { productService } from '../services';
import { getQueryParam, getPathParam } from '../utils/helpers';

class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const { name, description, price, stock } = req.body;

      const product = await productService.create({
        name,
        description,
        price,
        stock
      });

      res.status(201).json({
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  async getProduct(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.id), 10);
      const product = await productService.findById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const limit = getQueryParam(req.query.limit, 100);
      const offset = getQueryParam(req.query.offset, 0);

      const products = await productService.getAll(limit, offset);
      res.json(products);
    } catch (error) {
      console.error('Get all products error:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.id), 10);
      const { name, description, price, stock } = req.body;

      const product = await productService.update(productId, {
        name,
        description,
        price,
        stock
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({
        message: 'Product updated successfully',
        product
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.id), 10);
      const success = await productService.delete(productId);

      if (!success) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  async updateStock(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.id), 10);
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
      }

      const product = await productService.decreaseStock(productId, quantity);
      res.json({
        message: 'Stock updated successfully',
        product
      });
    } catch (error) {
      console.error('Update stock error:', error);
      if (error instanceof Error && error.message === 'Insufficient stock') {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      res.status(500).json({ error: 'Failed to update stock' });
    }
  }

  async checkStock(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.id), 10);
      const quantity = getQueryParam(req.query.quantity, 1);

      const available = await productService.checkStock(productId, quantity);
      res.json({ available, productId, quantity });
    } catch (error) {
      console.error('Check stock error:', error);
      res.status(500).json({ error: 'Failed to check stock' });
    }
  }
}

export const productController = new ProductController();