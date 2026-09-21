import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { productVariantController } from '../controllers';

const router = Router();

// Public routes
router.get('/product/:productId', productVariantController.getProductVariants.bind(productVariantController));
router.get('/:id', productVariantController.getVariant.bind(productVariantController));

// Protected routes (require authentication)
router.post('/', authenticate, productVariantController.createVariant.bind(productVariantController));
router.put('/:id', authenticate, productVariantController.updateVariant.bind(productVariantController));
router.delete('/:id', authenticate, productVariantController.deleteVariant.bind(productVariantController));
router.post('/:id/stock', authenticate, productVariantController.updateVariantStock.bind(productVariantController));

export default router;