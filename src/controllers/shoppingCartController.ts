import { Request, Response } from 'express';
import { shoppingCartService } from '../services';
import { getQueryParam, getPathParam } from '../utils/helpers';

class ShoppingCartController {
  async getCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const sessionId = req.headers['x-session-id'] as string;

      const cart = await shoppingCartService.getOrCreateCart(userId, sessionId);
      res.json(cart);
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  }

  async addToCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const sessionId = req.headers['x-session-id'] as string;

      const cart = await shoppingCartService.getOrCreateCart(userId, sessionId);
      const item = await shoppingCartService.addItem(cart.id, req.body);

      res.status(201).json({
        message: 'Item added to cart successfully',
        item
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  }

  async updateCartItem(req: Request, res: Response) {
    try {
      const itemId = parseInt(getPathParam(req.params.id), 10);
      const item = await shoppingCartService.updateItem(itemId, req.body);

      if (!item) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      res.json({
        message: 'Cart item updated successfully',
        item
      });
    } catch (error) {
      console.error('Update cart item error:', error);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  }

  async removeFromCart(req: Request, res: Response) {
    try {
      const itemId = parseInt(getPathParam(req.params.id), 10);
      const success = await shoppingCartService.removeItem(itemId);

      if (!success) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      res.json({ message: 'Item removed from cart successfully' });
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  }

  async clearCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const sessionId = req.headers['x-session-id'] as string;

      const cart = await shoppingCartService.getOrCreateCart(userId, sessionId);
      await shoppingCartService.clearCart(cart.id);

      res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  }

  async getCartTotal(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const sessionId = req.headers['x-session-id'] as string;

      const cart = await shoppingCartService.getOrCreateCart(userId, sessionId);
      const total = await shoppingCartService.getCartTotal(cart.id);

      res.json({ total });
    } catch (error) {
      console.error('Get cart total error:', error);
      res.status(500).json({ error: 'Failed to fetch cart total' });
    }
  }

  async getCartItemCount(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const sessionId = req.headers['x-session-id'] as string;

      const cart = await shoppingCartService.getOrCreateCart(userId, sessionId);
      const count = await shoppingCartService.getCartItemCount(cart.id);

      res.json({ count });
    } catch (error) {
      console.error('Get cart item count error:', error);
      res.status(500).json({ error: 'Failed to fetch cart item count' });
    }
  }

  async mergeCarts(req: Request, res: Response) {
    try {
      const { sourceCartId, targetCartId } = req.body;
      await shoppingCartService.mergeCarts(sourceCartId, targetCartId);

      res.json({ message: 'Carts merged successfully' });
    } catch (error) {
      console.error('Merge carts error:', error);
      res.status(500).json({ error: 'Failed to merge carts' });
    }
  }
}

export const shoppingCartController = new ShoppingCartController();