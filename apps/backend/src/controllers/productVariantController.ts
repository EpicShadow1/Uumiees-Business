import { Request, Response } from 'express';
import { productVariantService } from '../services';
import { getPathParam } from '../utils/helpers';

class ProductVariantController {
  async createVariant(req: Request, res: Response) {
    try {
      const variant = await productVariantService.create(req.body);
      res.status(201).json({
        message: 'Variant created successfully',
        variant
      });
    } catch (error) {
      console.error('Create variant error:', error);
      res.status(500).json({ error: 'Failed to create variant' });
    }
  }

  async getVariant(req: Request, res: Response) {
    try {
      const variantId = parseInt(getPathParam(req.params.id), 10);
      const variant = await productVariantService.findById(variantId);

      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' });
      }

      res.json(variant);
    } catch (error) {
      console.error('Get variant error:', error);
      res.status(500).json({ error: 'Failed to fetch variant' });
    }
  }

  async getProductVariants(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.productId), 10);
      const variants = await productVariantService.findByProductId(productId);
      res.json(variants);
    } catch (error) {
      console.error('Get product variants error:', error);
      res.status(500).json({ error: 'Failed to fetch product variants' });
    }
  }

  async updateVariant(req: Request, res: Response) {
    try {
      const variantId = parseInt(getPathParam(req.params.id), 10);
      const variant = await productVariantService.update(variantId, req.body);

      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' });
      }

      res.json({
        message: 'Variant updated successfully',
        variant
      });
    } catch (error) {
      console.error('Update variant error:', error);
      res.status(500).json({ error: 'Failed to update variant' });
    }
  }

  async deleteVariant(req: Request, res: Response) {
    try {
      const variantId = parseInt(getPathParam(req.params.id), 10);
      const success = await productVariantService.delete(variantId);

      if (!success) {
        return res.status(404).json({ error: 'Variant not found' });
      }

      res.json({ message: 'Variant deleted successfully' });
    } catch (error) {
      console.error('Delete variant error:', error);
      res.status(500).json({ error: 'Failed to delete variant' });
    }
  }

  async updateVariantStock(req: Request, res: Response) {
    try {
      const variantId = parseInt(getPathParam(req.params.id), 10);
      const { quantity } = req.body;
      const variant = await productVariantService.updateStock(variantId, quantity);
      res.json({
        message: 'Variant stock updated successfully',
        variant
      });
    } catch (error) {
      console.error('Update variant stock error:', error);
      if (error instanceof Error && error.message === 'Insufficient stock') {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      res.status(500).json({ error: 'Failed to update variant stock' });
    }
  }
}

export const productVariantController = new ProductVariantController();