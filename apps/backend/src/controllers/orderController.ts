import { Request, Response } from 'express';
import { orderService } from '../services';
import { getQueryParam, getPathParam } from '../utils/helpers';

class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order items' });
      }

      const order = await orderService.create({
        user_id: req.user.userId,
        items
      });

      res.status(201).json({
        message: 'Order created successfully',
        order
      });
    } catch (error) {
      console.error('Create order error:', error);
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Insufficient stock')) {
          return res.status(400).json({ error: error.message });
        }
      }
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const orderId = parseInt(getPathParam(req.params.id), 10);
      const order = await orderService.findById(orderId);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Check if user has permission to view this order
      if (req.user && order.user_id !== req.user.userId) {
        // TODO: Add admin role check to allow admins to view any order
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(order);
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  async getUserOrders(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const limit = getQueryParam(req.query.limit, 100);
      const offset = getQueryParam(req.query.offset, 0);

      const orders = await orderService.findByUserId(req.user.userId, limit, offset);
      res.json(orders);
    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async getAllOrders(req: Request, res: Response) {
    try {
      const limit = getQueryParam(req.query.limit, 100);
      const offset = getQueryParam(req.query.offset, 0);

      const orders = await orderService.getAll(limit, offset);
      res.json(orders);
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const orderId = parseInt(getPathParam(req.params.id), 10);
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const order = await orderService.updateStatus(orderId, status);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({
        message: 'Order status updated successfully',
        order
      });
    } catch (error) {
      console.error('Update order status error:', error);
      if (error instanceof Error && error.message === 'Invalid order status') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }

  async cancelOrder(req: Request, res: Response) {
    try {
      const orderId = parseInt(getPathParam(req.params.id), 10);

      // Get order first to check ownership
      const order = await orderService.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Check if user has permission to cancel this order
      if (req.user && order.user_id !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const cancelledOrder = await orderService.cancelOrder(orderId);

      res.json({
        message: 'Order cancelled successfully',
        order: cancelledOrder
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      if (error instanceof Error) {
        if (error.message === 'Order not found') {
          return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Cannot cancel')) {
          return res.status(400).json({ error: error.message });
        }
      }
      res.status(500).json({ error: 'Failed to cancel order' });
    }
  }
}

export const orderController = new OrderController();