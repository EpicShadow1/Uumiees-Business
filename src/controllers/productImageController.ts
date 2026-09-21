import { Request, Response } from 'express';
import { productImageService } from '../services';
import { getPathParam } from '../utils/helpers';

class ProductImageController {
  async uploadImage(req: Request, res: Response) {
    try {
      const { product_id, image_url, alt_text, is_primary, sort_order } = req.body;
      const image = await productImageService.create({
        product_id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      });

      res.status(201).json({
        message: 'Image uploaded successfully',
        image
      });
    } catch (error) {
      console.error('Upload image error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  }

  async getImage(req: Request, res: Response) {
    try {
      const imageId = parseInt(getPathParam(req.params.id), 10);
      const image = await productImageService.findById(imageId);

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      res.json(image);
    } catch (error) {
      console.error('Get image error:', error);
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  }

  async getProductImages(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.productId), 10);
      const images = await productImageService.findByProductId(productId);
      res.json(images);
    } catch (error) {
      console.error('Get product images error:', error);
      res.status(500).json({ error: 'Failed to fetch product images' });
    }
  }

  async getPrimaryImage(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.productId), 10);
      const image = await productImageService.getPrimaryImage(productId);

      if (!image) {
        return res.status(404).json({ error: 'Primary image not found' });
      }

      res.json(image);
    } catch (error) {
      console.error('Get primary image error:', error);
      res.status(500).json({ error: 'Failed to fetch primary image' });
    }
  }

  async updateImage(req: Request, res: Response) {
    try {
      const imageId = parseInt(getPathParam(req.params.id), 10);
      const image = await productImageService.update(imageId, req.body);

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      res.json({
        message: 'Image updated successfully',
        image
      });
    } catch (error) {
      console.error('Update image error:', error);
      res.status(500).json({ error: 'Failed to update image' });
    }
  }

  async deleteImage(req: Request, res: Response) {
    try {
      const imageId = parseInt(getPathParam(req.params.id), 10);
      const success = await productImageService.delete(imageId);

      if (!success) {
        return res.status(404).json({ error: 'Image not found' });
      }

      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Delete image error:', error);
      res.status(500).json({ error: 'Failed to delete image' });
    }
  }

  async deleteProductImages(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.productId), 10);
      await productImageService.deleteByProductId(productId);
      res.json({ message: 'Product images deleted successfully' });
    } catch (error) {
      console.error('Delete product images error:', error);
      res.status(500).json({ error: 'Failed to delete product images' });
    }
  }
}

export const productImageController = new ProductImageController();