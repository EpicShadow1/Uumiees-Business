import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { productImageController } from '../controllers';

const router = Router();

// Public routes
router.get('/product/:productId', productImageController.getProductImages.bind(productImageController));
router.get('/product/:productId/primary', productImageController.getPrimaryImage.bind(productImageController));
router.get('/:id', productImageController.getImage.bind(productImageController));

// Protected routes (require authentication)
router.post('/', authenticate, productImageController.uploadImage.bind(productImageController));
router.put('/:id', authenticate, productImageController.updateImage.bind(productImageController));
router.delete('/:id', authenticate, productImageController.deleteImage.bind(productImageController));
router.delete('/product/:productId', authenticate, productImageController.deleteProductImages.bind(productImageController));

export default router;