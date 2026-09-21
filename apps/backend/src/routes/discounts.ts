import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { discountController } from '../controllers';

const router = Router();

// Public routes
router.get('/code/:code', discountController.getDiscountByCode.bind(discountController));
router.post('/validate/:code', discountController.validateDiscount.bind(discountController));
router.get('/', discountController.getAllDiscounts.bind(discountController));

// Protected routes (require authentication)
router.post('/', authenticate, discountController.createDiscount.bind(discountController));
router.put('/:id', authenticate, discountController.updateDiscount.bind(discountController));
router.delete('/:id', authenticate, discountController.deleteDiscount.bind(discountController));

export default router;