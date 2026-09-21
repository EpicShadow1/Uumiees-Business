import { Request, Response } from 'express';
import { wishlistService } from '../services';
import { getPathParam } from '../utils/helpers';

class WishlistController {
  async addToWishlist(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const wishlistItem = await wishlistService.addToWishlist({
        user_id: req.user.userId,
        ...req.body
      });

      res.status(201).json({
        message: 'Added to wishlist successfully',
        item: wishlistItem
      });
    } catch (error) {
      console.error('Add to wishlist error:', error);
      res.status(500).json({ error: 'Failed to add to wishlist' });
    }
  }

  async removeFromWishlist(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const productId = parseInt(getPathParam(req.params.productId), 10);
      const variantId = req.query.variantId ? parseInt(getPathParam(req.query.variantId as string), 10) : undefined;

      const success = await wishlistService.removeFromWishlist(req.user.userId, productId, variantId);

      if (!success) {
        return res.status(404).json({ error: 'Wishlist item not found' });
      }

      res.json({ message: 'Removed from wishlist successfully' });
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
  }

  async getUserWishlist(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const wishlist = await wishlistService.getUserWishlist(req.user.userId);
      res.json(wishlist);
    } catch (error) {
      console.error('Get user wishlist error:', error);
      res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
  }

  async isInWishlist(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const productId = parseInt(getPathParam(req.params.productId), 10);
      const variantId = req.query.variantId ? parseInt(getPathParam(req.query.variantId as string), 10) : undefined;

      const inWishlist = await wishlistService.isInWishlist(req.user.userId, productId, variantId);
      res.json({ inWishlist });
    } catch (error) {
      console.error('Check wishlist status error:', error);
      res.status(500).json({ error: 'Failed to check wishlist status' });
    }
  }

  async clearWishlist(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      await wishlistService.clearWishlist(req.user.userId);
      res.json({ message: 'Wishlist cleared successfully' });
    } catch (error) {
      console.error('Clear wishlist error:', error);
      res.status(500).json({ error: 'Failed to clear wishlist' });
    }
  }
}

export const wishlistController = new WishlistController();