import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { orderTrackingController } from '../controllers';

const router = Router();

// Public routes
router.get('/order/:orderId', orderTrackingController.getOrderTracking.bind(orderTrackingController));
router.get('/order/:orderId/latest', orderTrackingController.getLatestStatus.bind(orderTrackingController));

// Protected routes (require authentication)
router.post('/', authenticate, orderTrackingController.createTracking.bind(orderTrackingController));
router.put('/:id', authenticate, orderTrackingController.updateTracking.bind(orderTrackingController));
router.delete('/:id', authenticate, orderTrackingController.deleteTracking.bind(orderTrackingController));

export default router;