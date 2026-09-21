import { Request, Response } from 'express';
import { orderTrackingService } from '../services';
import { getPathParam } from '../utils/helpers';

class OrderTrackingController {
  async createTracking(req: Request, res: Response) {
    try {
      const tracking = await orderTrackingService.create(req.body);
      res.status(201).json({
        message: 'Tracking created successfully',
        tracking
      });
    } catch (error) {
      console.error('Create tracking error:', error);
      res.status(500).json({ error: 'Failed to create tracking' });
    }
  }

  async getOrderTracking(req: Request, res: Response) {
    try {
      const orderId = parseInt(getPathParam(req.params.orderId), 10);
      const tracking = await orderTrackingService.findByOrderId(orderId);
      res.json(tracking);
    } catch (error) {
      console.error('Get order tracking error:', error);
      res.status(500).json({ error: 'Failed to fetch order tracking' });
    }
  }

  async getLatestStatus(req: Request, res: Response) {
    try {
      const orderId = parseInt(getPathParam(req.params.orderId), 10);
      const tracking = await orderTrackingService.getLatestStatus(orderId);

      if (!tracking) {
        return res.status(404).json({ error: 'No tracking information found' });
      }

      res.json(tracking);
    } catch (error) {
      console.error('Get latest status error:', error);
      res.status(500).json({ error: 'Failed to fetch latest status' });
    }
  }

  async updateTracking(req: Request, res: Response) {
    try {
      const trackingId = parseInt(getPathParam(req.params.id), 10);
      const tracking = await orderTrackingService.update(trackingId, req.body);

      if (!tracking) {
        return res.status(404).json({ error: 'Tracking not found' });
      }

      res.json({
        message: 'Tracking updated successfully',
        tracking
      });
    } catch (error) {
      console.error('Update tracking error:', error);
      res.status(500).json({ error: 'Failed to update tracking' });
    }
  }

  async deleteTracking(req: Request, res: Response) {
    try {
      const trackingId = parseInt(getPathParam(req.params.id), 10);
      const success = await orderTrackingService.delete(trackingId);

      if (!success) {
        return res.status(404).json({ error: 'Tracking not found' });
      }

      res.json({ message: 'Tracking deleted successfully' });
    } catch (error) {
      console.error('Delete tracking error:', error);
      res.status(500).json({ error: 'Failed to delete tracking' });
    }
  }
}

export const orderTrackingController = new OrderTrackingController();