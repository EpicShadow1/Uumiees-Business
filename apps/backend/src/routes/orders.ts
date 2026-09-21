import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { orderValidation } from '../middleware/validator';
import { orderController } from '../controllers';

const router = Router();

// All routes require authentication
router.post('/', authenticate, orderValidation, orderController.createOrder.bind(orderController));
router.get('/my', authenticate, orderController.getUserOrders.bind(orderController));
router.get('/:id', authenticate, orderController.getOrder.bind(orderController));
router.put('/:id/status', authenticate, orderController.updateOrderStatus.bind(orderController));
router.post('/:id/cancel', authenticate, orderController.cancelOrder.bind(orderController));

// Admin route to get all orders
router.get('/', authenticate, orderController.getAllOrders.bind(orderController));

export default router;